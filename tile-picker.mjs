// Generate a tile picker image: every tile from the atlas blown up
// with its index number overlaid, so we can identify tile indices visually.
import sharp from "sharp";
import fs from "node:fs/promises";

const ATLAS = "public/assets/Tilemap/tilemap_packed.png";
const COLS = 27;
const ROWS = 18;
const TILE = 16;
const SCALE = 6; // 96px tiles
const GUTTER = 3;
const LABEL_H = 16;

// Read the atlas
const atlas = sharp(ATLAS);
const meta = await atlas.metadata();
console.log("atlas", meta.width, meta.height);

// Output canvas dimensions
const cellW = TILE * SCALE + GUTTER;
const cellH = TILE * SCALE + GUTTER + LABEL_H;
const outW = COLS * cellW;
const outH = ROWS * cellH;

// SVG overlay with just labels under each tile (transparent bg).
let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${outW}" height="${outH}">`;
for (let r = 0; r < ROWS; r++) {
  for (let c = 0; c < COLS; c++) {
    const idx = r * COLS + c;
    const x = c * cellW;
    const y = r * cellH + TILE * SCALE; // just below the tile
    // Small black backdrop for legibility
    svg += `<rect x="${x}" y="${y}" width="${TILE * SCALE}" height="${LABEL_H}" fill="#000" fill-opacity="0.85"/>`;
    svg += `<text x="${x + (TILE * SCALE) / 2}" y="${y + LABEL_H - 3}" font-family="monospace" font-size="13" fill="#ffeb3b" text-anchor="middle">${idx}</text>`;
  }
}
svg += `</svg>`;

// Now generate the tile thumbnails layered onto a base
const composites = [];
for (let r = 0; r < ROWS; r++) {
  for (let c = 0; c < COLS; c++) {
    // Extract the 16x16 from atlas
    const tile = await sharp(ATLAS)
      .extract({ left: c * TILE, top: r * TILE, width: TILE, height: TILE })
      .resize(TILE * SCALE, TILE * SCALE, { kernel: "nearest" })
      .toBuffer();
    composites.push({
      input: tile,
      left: c * cellW,
      top: r * cellH,
    });
  }
}

// Base black canvas
const base = sharp({
  create: {
    width: outW,
    height: outH,
    channels: 4,
    background: { r: 30, g: 30, b: 30, alpha: 1 },
  },
});

const composed = await base.composite(composites).png().toBuffer();
const labeled = await sharp(composed)
  .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
  .png()
  .toBuffer();

// Split into top/middle/bottom thirds for legibility.
const meta2 = await sharp(labeled).metadata();
const third = Math.ceil(meta2.height / 3);
for (let i = 0; i < 3; i++) {
  const top = i * third;
  const height = Math.min(third, meta2.height - top);
  await sharp(labeled)
    .extract({ left: 0, top, width: meta2.width, height })
    .toFile(`/tmp/tile-picker-${i}.png`);
  console.log(`→ /tmp/tile-picker-${i}.png`);
}
