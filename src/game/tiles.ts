// Tile index catalog from Kenney RPG Urban Pack (CC0).
// Atlas: 27 cols × 18 rows of 16×16 tiles in tilemap_packed.png.
// Index = row * 27 + col, zero-based.

export const T = {
  EMPTY: -1,

  // -- Ground --
  GRASS: 1, // solid green grass (interior)
  GRASS_ALT: 28,
  PAVEMENT: 9, // light grey concrete (interior)
  PAVEMENT_DRAIN: 13, // pavement with drain cover
  PAVEMENT_MANHOLE: 12,

  // -- Park edge: grass surrounded by stone curb --
  // 3-row × 6-col block starting at (col=3, row=0)
  PARK_TL: 3,
  PARK_T: 4,
  PARK_TR: 7,
  PARK_L: 30,
  PARK_R: 34,
  PARK_BL: 57,
  PARK_B: 58,
  PARK_BR: 61,

  // -- Water (pool/fountain) --
  WATER_TL: 170,
  WATER_T: 171,
  WATER_TR: 177,
  WATER_L: 197,
  WATER: 198, // solid water interior
  WATER_R: 204,
  WATER_BL: 224,
  WATER_B: 225,
  WATER_BR: 231,

  // -- Road (asphalt) --
  ROAD: 432, // plain asphalt
  ROAD_DASH_H: 437, // dashed center line horizontal
  ROAD_DASH_V: 463, // dashed center line vertical (best guess)
  CROSSWALK_H: 461, // pedestrian crossing
  PARKING_P: 443, // parking 'P' marker

  // -- Building walls (red brick) --
  WALL_RED_L: 16, // left edge with trim
  WALL_RED: 19, // middle
  WALL_RED_R: 22, // right edge with shadow trim
  WALL_RED_WIN_L: 43, // left edge with windowsill
  WALL_RED_WIN: 46, // middle with windowsill
  WALL_RED_WIN_R: 49, // right edge with windowsill

  // -- Building walls (orange brick) --
  WALL_ORN_L: 178,
  WALL_ORN: 181,
  WALL_ORN_R: 184,
  WALL_ORN_TRIM_L: 205,
  WALL_ORN_TRIM: 208,
  WALL_ORN_TRIM_R: 211,

  // -- Decorations --
  LAMP_TOP: 164,
  LAMP_POST: 191,
  TREE_SMALL: 235,
  TREE_TL: 234,
  TREE_TR: 236,
  TREE_BL: 261,
  TREE_BR: 263,
  TREE_ORN_TL: 286,
  TREE_ORN_TR: 287,
  TREE_ORN_BL: 313,
  TREE_ORN_BR: 314,
  BUSH: 232,
  BUSH_ORN: 313,

  // -- Windows / Doors --
  WINDOW: 256, // glass window with frame
  DOOR_RED: 282, // red door
  DOOR_WOOD: 283, // wooden double-door
  DOOR_GREY: 281,
  DOOR_WHITE: 285,
  DOOR_BLUE: 308,
  DOOR_DARK: 311,
} as const;

// Character sprite indices.
// Each character has frames laid out in a 4-column block; rows give directions.
// We pick a single "front-facing" frame per character for the MVP.
export const CHAR = {
  PLAYER: 24, // green-shirt, brown-hair (will face down)
  NPC_RED: 51, // red-shirt brown-hair
  NPC_BLUE: 105, // blue-shirt
  NPC_ORANGE: 240, // orange-shirt
} as const;

export const ATLAS_COLS = 27;
export const ATLAS_ROWS = 18;
export const TILE_SIZE = 16;
