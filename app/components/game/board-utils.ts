export type Coordinate = { row: number; col: number };

export const getGlobalPathIndex = (player: string, position: number) => {
  const startIndices: Record<string, number> = {
    red: 0,
    blue: 13,
    yellow: 26,
    green: 39,
  };
  return (startIndices[player] + position) % 52;
};

// Standard Ludo board is 15x15
// Global path is 52 steps
// Each player has a starting offset

export const PATH_COORDINATES: Coordinate[] = [
  // Red start path (from 6,1 moving right then up)
  { row: 6, col: 1 },
  { row: 6, col: 2 },
  { row: 6, col: 3 },
  { row: 6, col: 4 },
  { row: 6, col: 5 },
  { row: 5, col: 6 },
  { row: 4, col: 6 },
  { row: 3, col: 6 },
  { row: 2, col: 6 },
  { row: 1, col: 6 },
  { row: 0, col: 6 },
  { row: 0, col: 7 },
  { row: 0, col: 8 },
  { row: 1, col: 8 },
  { row: 2, col: 8 },
  { row: 3, col: 8 },
  { row: 4, col: 8 },
  { row: 5, col: 8 },
  { row: 6, col: 9 },
  { row: 6, col: 10 },
  { row: 6, col: 11 },
  { row: 6, col: 12 },
  { row: 6, col: 13 },
  { row: 6, col: 14 },
  { row: 7, col: 14 },
  { row: 8, col: 14 },
  { row: 8, col: 13 },
  { row: 8, col: 12 },
  { row: 8, col: 11 },
  { row: 8, col: 10 },
  { row: 8, col: 9 },
  { row: 9, col: 8 },
  { row: 10, col: 8 },
  { row: 11, col: 8 },
  { row: 12, col: 8 },
  { row: 13, col: 8 },
  { row: 14, col: 8 },
  { row: 14, col: 7 },
  { row: 14, col: 6 },
  { row: 13, col: 6 },
  { row: 12, col: 6 },
  { row: 11, col: 6 },
  { row: 10, col: 6 },
  { row: 9, col: 6 },
  { row: 8, col: 5 },
  { row: 8, col: 4 },
  { row: 8, col: 3 },
  { row: 8, col: 2 },
  { row: 8, col: 1 },
  { row: 8, col: 0 },
  { row: 7, col: 0 },
  { row: 6, col: 0 },
];

export const HOME_STRETCH_COORDINATES: Record<string, Coordinate[]> = {
  red: [
    { row: 7, col: 1 },
    { row: 7, col: 2 },
    { row: 7, col: 3 },
    { row: 7, col: 4 },
    { row: 7, col: 5 },
    { row: 7, col: 6 }, // Home
  ],
  blue: [
    { row: 1, col: 7 },
    { row: 2, col: 7 },
    { row: 3, col: 7 },
    { row: 4, col: 7 },
    { row: 5, col: 7 },
    { row: 6, col: 7 },
  ],
  yellow: [
    { row: 7, col: 13 },
    { row: 7, col: 12 },
    { row: 7, col: 11 },
    { row: 7, col: 10 },
    { row: 7, col: 9 },
    { row: 7, col: 8 },
  ],
  green: [
    { row: 13, col: 7 },
    { row: 12, col: 7 },
    { row: 11, col: 7 },
    { row: 10, col: 7 },
    { row: 9, col: 7 },
    { row: 8, col: 7 },
  ],
};

export const BASE_COORDINATES: Record<string, Coordinate[]> = {
  red: [
    { row: 2, col: 2 },
    { row: 2, col: 3 },
    { row: 3, col: 2 },
    { row: 3, col: 3 },
  ],
  blue: [
    { row: 2, col: 11 },
    { row: 2, col: 12 },
    { row: 3, col: 11 },
    { row: 3, col: 12 },
  ],
  yellow: [
    { row: 11, col: 11 },
    { row: 11, col: 12 },
    { row: 12, col: 11 },
    { row: 12, col: 12 },
  ],
  green: [
    { row: 11, col: 2 },
    { row: 11, col: 3 },
    { row: 12, col: 2 },
    { row: 12, col: 3 },
  ],
};

export const PLAYER_START_INDICES: Record<string, number> = {
  red: 0,
  blue: 13,
  yellow: 26,
  green: 39,
};

// Starting spots - where each player enters the main path (global path indices)
// These are safe spots where pieces cannot be captured
export const STARTING_SPOTS: number[] = [0, 13, 26, 39];

// Safe spots - additional star positions on the board (global path indices)
// These are located 8 steps after each starting spot and are marked with stars
export const STAR_SAFE_SPOTS: number[] = [8, 21, 34, 47];

// Combined safe spots - all positions where pieces cannot be captured
export const ALL_SAFE_SPOTS: number[] = [...STARTING_SPOTS, ...STAR_SAFE_SPOTS];

// Function to check if a global path index is a safe spot
export const isSafeSpot = (globalIndex: number): boolean => {
  return ALL_SAFE_SPOTS.includes(globalIndex);
};

// Function to check if a global path index is a starting spot
export const isStartingSpot = (globalIndex: number): boolean => {
  return STARTING_SPOTS.includes(globalIndex);
};

// Function to check if a global path index is a star safe spot
export const isStarSpot = (globalIndex: number): boolean => {
  return STAR_SAFE_SPOTS.includes(globalIndex);
};
