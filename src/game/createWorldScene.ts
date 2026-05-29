import type * as PhaserNS from "phaser";
import { bus, EVENTS } from "./eventBus";
import { SECTIONS, type SectionId } from "@/data/sections";
import { T, CHAR, TILE_SIZE } from "./tiles";

const MAP_W = 48;
const MAP_H = 32;

// -- Building layout --
// Buildings are 7 wide × 6 tall. Door tile at (x + 3, y + 5).
// 7 sections placed: 3 across the top row, 3 across the bottom row, 1 on the right side.
type BSpec = {
  id: SectionId;
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
  variant: "red" | "orange";
};

const BUILDINGS: BSpec[] = [
  { id: "technologies", label: "Technologies", x: 5, y: 3, w: 7, h: 6, variant: "red" },
  { id: "about", label: "About Me", x: 17, y: 3, w: 7, h: 6, variant: "orange" },
  { id: "cv", label: "Curriculum Vitae", x: 29, y: 3, w: 7, h: 6, variant: "red" },
  { id: "cards", label: "Collectible Cards", x: 5, y: 23, w: 7, h: 6, variant: "orange" },
  { id: "projects", label: "Projects", x: 17, y: 23, w: 7, h: 6, variant: "red" },
  { id: "contact", label: "Contact", x: 29, y: 23, w: 7, h: 6, variant: "orange" },
  { id: "under-the-hood", label: "Under the Hood", x: 39, y: 13, w: 6, h: 6, variant: "red" },
];

// Central fountain (water): 4x4 block.
const FOUNTAIN = { x: 22, y: 13, w: 4, h: 4 };

// Decorative tree positions (single 1×1 small trees).
const SMALL_TREES: Array<[number, number]> = [
  [13, 10], [27, 10], [13, 22], [27, 22],
  [3, 13], [3, 18], [46, 11], [46, 20],
];

// Lampposts: 2 tiles tall. x,y is the lamp head (post is at y+1).
// Placed in the plaza corners — not on the central east-west corridor (row 19).
const LAMPS: Array<[number, number]> = [
  [4, 10], [37, 10], [4, 21], [37, 21],
  [13, 21], [27, 21],
];

// Big 2×2 hedge clusters — kept clear of the east-west plaza corridor.
const HEDGES: Array<[number, number]> = [
  [14, 11], [25, 11], [14, 20], [25, 20],
];

function wallRow(variant: "red" | "orange") {
  return variant === "red"
    ? { L: T.WALL_RED_L, M: T.WALL_RED, R: T.WALL_RED_R }
    : { L: T.WALL_ORN_L, M: T.WALL_ORN, R: T.WALL_ORN_R };
}
function trimRow(variant: "red" | "orange") {
  return variant === "red"
    ? { L: T.WALL_RED_WIN_L, M: T.WALL_RED_WIN, R: T.WALL_RED_WIN_R }
    : { L: T.WALL_ORN_TRIM_L, M: T.WALL_ORN_TRIM, R: T.WALL_ORN_TRIM_R };
}

export function createWorldScene(Phaser: typeof PhaserNS) {
  return class WorldScene extends Phaser.Scene {
    private player!: PhaserNS.Physics.Arcade.Sprite;
    private cursors!: PhaserNS.Types.Input.Keyboard.CursorKeys;
    private wasd!: {
      W: PhaserNS.Input.Keyboard.Key;
      A: PhaserNS.Input.Keyboard.Key;
      S: PhaserNS.Input.Keyboard.Key;
      D: PhaserNS.Input.Keyboard.Key;
      E: PhaserNS.Input.Keyboard.Key;
    };
    private zones: Array<{
      zone: PhaserNS.GameObjects.Zone;
      id: SectionId;
      label: string;
    }> = [];
    private activeZone: SectionId | null = null;
    private hintText!: PhaserNS.GameObjects.Text;
    private inputPaused = false;
    private busUnsubs: Array<() => void> = [];
    private npcs: Array<{
      sprite: PhaserNS.Physics.Arcade.Sprite;
      bounds: { x1: number; x2: number };
      vx: number;
    }> = [];

    constructor() {
      super("WorldScene");
    }

    preload() {
      this.load.image("tiles", "/assets/Tilemap/tilemap_packed.png");
      this.load.spritesheet("chars", "/assets/Tilemap/tilemap_packed.png", {
        frameWidth: TILE_SIZE,
        frameHeight: TILE_SIZE,
      });
      this.load.on("progress", (p: number) => bus.emit(EVENTS.LOAD_PROGRESS, p));
    }

    create() {
      const map = this.make.tilemap({
        width: MAP_W,
        height: MAP_H,
        tileWidth: TILE_SIZE,
        tileHeight: TILE_SIZE,
      });
      const tileset = map.addTilesetImage("tiles", "tiles", TILE_SIZE, TILE_SIZE, 0, 0)!;
      const ground = map.createBlankLayer("ground", tileset, 0, 0)!;
      const decor = map.createBlankLayer("decor", tileset, 0, 0)!;
      const ornaments = map.createBlankLayer("ornaments", tileset, 0, 0)!;

      this.buildGround(ground);
      this.buildBuildings(decor);
      this.buildDecor(decor, ornaments);
      this.buildFountain(ground, ornaments);

      // Collisions: any non-empty tile on the decor layer is solid.
      decor.setCollisionByExclusion([-1]);

      // Center plaza grass-like base tile is pavement; no collision there.
      ground.setCollision([], false);

      // Sort depths so decor draws above ground.
      ground.setDepth(0);
      decor.setDepth(10);
      ornaments.setDepth(15);

      this.createPlayer();
      this.physics.add.collider(this.player, decor);

      this.createNPCs(decor);
      this.createZones();

      this.setupCamera();
      this.setupInput();
      this.setupBus();

      this.time.delayedCall(50, () => bus.emit(EVENTS.GAME_READY));

      // Debug hook for verify scripts.
      if (typeof window !== "undefined") {
        (window as unknown as { __scene: unknown }).__scene = this;
      }
    }

    // -- Ground: pavement everywhere, roads on edges, grass parks under buildings rows --
    private buildGround(layer: PhaserNS.Tilemaps.TilemapLayer) {
      // 1. Fill everything with pavement.
      for (let y = 0; y < MAP_H; y++) {
        for (let x = 0; x < MAP_W; x++) {
          layer.putTileAt(T.PAVEMENT, x, y);
        }
      }

      // 2. Outer ring: green park strip (2 tiles deep on each side).
      for (let x = 0; x < MAP_W; x++) {
        layer.putTileAt(T.GRASS, x, 0);
        layer.putTileAt(T.GRASS, x, 1);
        layer.putTileAt(T.GRASS, x, MAP_H - 2);
        layer.putTileAt(T.GRASS, x, MAP_H - 1);
      }
      for (let y = 0; y < MAP_H; y++) {
        layer.putTileAt(T.GRASS, 0, y);
        layer.putTileAt(T.GRASS, 1, y);
        layer.putTileAt(T.GRASS, MAP_W - 2, y);
        layer.putTileAt(T.GRASS, MAP_W - 1, y);
      }

      // 3. Park strips inside (a thin grass border on the inner sides of buildings).
      // Drop grass patches under tree positions for a nicer look.
      for (const [tx, ty] of SMALL_TREES) {
        for (let dx = -1; dx <= 1; dx++) {
          for (let dy = -1; dy <= 1; dy++) {
            layer.putTileAt(T.GRASS, tx + dx, ty + dy);
          }
        }
      }
      for (const [tx, ty] of HEDGES) {
        for (let dx = 0; dx <= 1; dx++) {
          for (let dy = 0; dy <= 1; dy++) {
            layer.putTileAt(T.GRASS, tx + dx, ty + dy);
          }
        }
      }

      // Add a green park border around the fountain.
      const f = FOUNTAIN;
      for (let y = f.y - 1; y < f.y + f.h + 1; y++) {
        for (let x = f.x - 1; x < f.x + f.w + 1; x++) {
          if (
            x < f.x ||
            x >= f.x + f.w ||
            y < f.y ||
            y >= f.y + f.h
          ) {
            layer.putTileAt(T.PAVEMENT, x, y);
          }
        }
      }
    }

    // -- Buildings: walls + windows + doors --
    private buildBuildings(layer: PhaserNS.Tilemaps.TilemapLayer) {
      for (const b of BUILDINGS) {
        const wall = wallRow(b.variant);
        const trim = trimRow(b.variant);
        // Roof line (top row): plain wall
        for (let dx = 0; dx < b.w; dx++) {
          const tile = dx === 0 ? wall.L : dx === b.w - 1 ? wall.R : wall.M;
          layer.putTileAt(tile, b.x + dx, b.y);
        }
        // Window row (second from top)
        for (let dx = 0; dx < b.w; dx++) {
          const tile = dx === 0 ? trim.L : dx === b.w - 1 ? trim.R : trim.M;
          layer.putTileAt(tile, b.x + dx, b.y + 1);
        }
        // Body rows
        for (let dy = 2; dy < b.h - 1; dy++) {
          for (let dx = 0; dx < b.w; dx++) {
            const tile = dx === 0 ? wall.L : dx === b.w - 1 ? wall.R : wall.M;
            layer.putTileAt(tile, b.x + dx, b.y + dy);
          }
        }
        // Place windows on the second body row.
        const winRow = b.y + 2;
        if (b.w >= 5) {
          layer.putTileAt(T.WINDOW, b.x + 1, winRow);
          layer.putTileAt(T.WINDOW, b.x + b.w - 2, winRow);
        }
        // Bottom row: walls with door in center.
        for (let dx = 0; dx < b.w; dx++) {
          const tile = dx === 0 ? wall.L : dx === b.w - 1 ? wall.R : wall.M;
          layer.putTileAt(tile, b.x + dx, b.y + b.h - 1);
        }
        const doorTile = b.variant === "red" ? T.DOOR_WOOD : T.DOOR_RED;
        layer.putTileAt(doorTile, b.x + Math.floor(b.w / 2), b.y + b.h - 1);
      }
    }

    // -- Trees, lampposts, hedges --
    private buildDecor(
      decor: PhaserNS.Tilemaps.TilemapLayer,
      ornaments: PhaserNS.Tilemaps.TilemapLayer,
    ) {
      // Small trees (1×1, solid)
      for (const [x, y] of SMALL_TREES) {
        decor.putTileAt(T.TREE_SMALL, x, y);
      }
      // 2×2 hedges (decor base + ornaments top)
      for (const [x, y] of HEDGES) {
        decor.putTileAt(T.TREE_TL, x, y);
        decor.putTileAt(T.TREE_TR, x + 1, y);
        decor.putTileAt(T.TREE_BL, x, y + 1);
        decor.putTileAt(T.TREE_BR, x + 1, y + 1);
      }
      // Lampposts (2 tiles tall: top = lamp head, bottom = post)
      for (const [x, y] of LAMPS) {
        ornaments.putTileAt(T.LAMP_TOP, x, y);
        decor.putTileAt(T.LAMP_POST, x, y + 1);
      }
    }

    // -- Fountain: water square --
    private buildFountain(
      ground: PhaserNS.Tilemaps.TilemapLayer,
      _ornaments: PhaserNS.Tilemaps.TilemapLayer,
    ) {
      const f = FOUNTAIN;
      for (let dy = 0; dy < f.h; dy++) {
        for (let dx = 0; dx < f.w; dx++) {
          let tile: number = T.WATER;
          if (dx === 0 && dy === 0) tile = T.WATER_TL;
          else if (dx === f.w - 1 && dy === 0) tile = T.WATER_TR;
          else if (dx === 0 && dy === f.h - 1) tile = T.WATER_BL;
          else if (dx === f.w - 1 && dy === f.h - 1) tile = T.WATER_BR;
          else if (dy === 0) tile = T.WATER_T;
          else if (dy === f.h - 1) tile = T.WATER_B;
          else if (dx === 0) tile = T.WATER_L;
          else if (dx === f.w - 1) tile = T.WATER_R;
          ground.putTileAt(tile, f.x + dx, f.y + dy);
        }
      }
    }

    private createPlayer() {
      // Spawn in the plaza, with a clear east-west corridor.
      const spawnX = (FOUNTAIN.x + FOUNTAIN.w / 2) * TILE_SIZE;
      const spawnY = (FOUNTAIN.y + FOUNTAIN.h + 2.5) * TILE_SIZE;
      this.player = this.physics.add.sprite(spawnX, spawnY, "chars", CHAR.PLAYER);
      this.player.setCollideWorldBounds(true);
      this.player.body!.setSize(8, 6);
      this.player.body!.setOffset(4, 9);
      this.player.setDepth(20);

      // Build walking animations (front/back/side) from the character's 4-frame
      // block. Kenney's pack: each character occupies 4 consecutive frames
      // (down, then side, then up — 4 frames per direction in some variants).
      // We use a simple 2-frame walk on the player frame and frame+1.
      this.anims.create({
        key: "player-walk",
        frames: [
          { key: "chars", frame: CHAR.PLAYER },
          { key: "chars", frame: CHAR.PLAYER + 27 }, // next row, same column ~ side step
        ],
        frameRate: 6,
        repeat: -1,
      });
      this.anims.create({
        key: "player-idle",
        frames: [{ key: "chars", frame: CHAR.PLAYER }],
        frameRate: 1,
      });
      this.player.anims.play("player-idle");
    }

    private createNPCs(decor: PhaserNS.Tilemaps.TilemapLayer) {
      const specs: Array<{ frame: number; x: number; y: number; range: number; speed: number }> = [
        { frame: CHAR.NPC_RED, x: 15, y: 11, range: 6, speed: 35 },
        { frame: CHAR.NPC_BLUE, x: 18, y: 20, range: 7, speed: 30 },
        { frame: CHAR.NPC_ORANGE, x: 32, y: 11, range: 5, speed: 28 },
      ];
      for (const s of specs) {
        const sprite = this.physics.add.sprite(
          s.x * TILE_SIZE + TILE_SIZE / 2,
          s.y * TILE_SIZE + TILE_SIZE / 2,
          "chars",
          s.frame,
        );
        sprite.body!.setSize(8, 6);
        sprite.body!.setOffset(4, 9);
        sprite.setDepth(18);
        sprite.setVelocityX(s.speed);
        this.physics.add.collider(sprite, decor);
        const bounds = {
          x1: (s.x - s.range) * TILE_SIZE,
          x2: (s.x + s.range) * TILE_SIZE,
        };
        this.npcs.push({ sprite, bounds, vx: s.speed });
      }
    }

    private createZones() {
      for (const b of BUILDINGS) {
        const zx = (b.x + b.w / 2) * TILE_SIZE;
        const zy = (b.y + b.h + 0.5) * TILE_SIZE; // just south of the door
        const zone = this.add.zone(zx, zy, TILE_SIZE * 1.3, TILE_SIZE * 1.3);
        this.physics.world.enable(zone);
        const body = zone.body as PhaserNS.Physics.Arcade.Body;
        body.setAllowGravity(false);
        body.moves = false;
        this.zones.push({ zone, id: b.id, label: b.label });

        // Building label sign above the roof.
        this.add
          .text(
            (b.x + b.w / 2) * TILE_SIZE,
            b.y * TILE_SIZE - 4,
            b.label,
            {
              fontFamily: "ui-monospace, 'SF Mono', Menlo, Consolas, monospace",
              fontSize: "8px",
              color: "#1f1f1f",
              backgroundColor: "#f5e9c8",
              padding: { left: 3, right: 3, top: 1, bottom: 1 },
            },
          )
          .setOrigin(0.5, 1)
          .setDepth(25);
      }

      this.hintText = this.add
        .text(0, 0, "", {
          fontFamily: "ui-monospace, 'SF Mono', Menlo, Consolas, monospace",
          fontSize: "9px",
          color: "#ffffff",
          backgroundColor: "#1f1f1f",
          padding: { left: 4, right: 4, top: 2, bottom: 2 },
        })
        .setOrigin(0.5, 1)
        .setDepth(30)
        .setVisible(false);
    }

    private setupCamera() {
      this.physics.world.setBounds(0, 0, MAP_W * TILE_SIZE, MAP_H * TILE_SIZE);
      this.cameras.main.setBounds(0, 0, MAP_W * TILE_SIZE, MAP_H * TILE_SIZE);
      this.cameras.main.startFollow(this.player, true, 0.12, 0.12);
      this.cameras.main.setZoom(3);
      this.cameras.main.setRoundPixels(true);
    }

    private setupInput() {
      const kb = this.input.keyboard!;
      this.cursors = kb.createCursorKeys();
      this.wasd = kb.addKeys("W,A,S,D,E") as typeof this.wasd;
      this.wasd.E.on("down", () => {
        if (this.inputPaused) return;
        if (this.activeZone) bus.emit(EVENTS.OPEN_SECTION, this.activeZone);
      });
    }

    private setupBus() {
      this.busUnsubs.push(
        bus.on(EVENTS.PAUSE_INPUT, () => {
          this.inputPaused = true;
          this.player.setVelocity(0, 0);
        }),
      );
      this.busUnsubs.push(
        bus.on(EVENTS.RESUME_INPUT, () => {
          this.inputPaused = false;
        }),
      );
    }

    update() {
      if (!this.player) return;
      const speed = 90;
      let vx = 0;
      let vy = 0;

      if (!this.inputPaused) {
        if (this.cursors.left.isDown || this.wasd.A.isDown) vx = -speed;
        else if (this.cursors.right.isDown || this.wasd.D.isDown) vx = speed;
        if (this.cursors.up.isDown || this.wasd.W.isDown) vy = -speed;
        else if (this.cursors.down.isDown || this.wasd.S.isDown) vy = speed;
      }
      this.player.setVelocity(vx, vy);
      if (vx !== 0) this.player.setFlipX(vx < 0);
      if (vx !== 0 || vy !== 0) {
        if (this.player.anims.currentAnim?.key !== "player-walk") {
          this.player.anims.play("player-walk", true);
        }
      } else {
        this.player.anims.play("player-idle", true);
      }

      // NPCs patrol back and forth.
      for (const n of this.npcs) {
        if (n.sprite.x < n.bounds.x1) {
          n.vx = Math.abs(n.vx);
          n.sprite.setFlipX(false);
        } else if (n.sprite.x > n.bounds.x2) {
          n.vx = -Math.abs(n.vx);
          n.sprite.setFlipX(true);
        }
        n.sprite.setVelocityX(n.vx);
      }

      // Active interaction zone
      this.activeZone = null;
      let nearestLabel = "";
      const px = this.player.x;
      const py = this.player.y;
      for (const z of this.zones) {
        if (
          Math.abs(z.zone.x - px) < TILE_SIZE * 0.9 &&
          Math.abs(z.zone.y - py) < TILE_SIZE * 0.9
        ) {
          this.activeZone = z.id;
          nearestLabel = z.label;
          break;
        }
      }
      if (this.activeZone && !this.inputPaused) {
        this.hintText
          .setText(`▸ Enter "${nearestLabel}" · press E`)
          .setVisible(true)
          .setPosition(px, py - 14);
      } else {
        this.hintText.setVisible(false);
      }
    }

    shutdown() {
      this.busUnsubs.forEach((u) => u());
      this.busUnsubs = [];
      this.npcs = [];
    }
  };
}
