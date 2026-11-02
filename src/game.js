export const LADDERS = { 1: 38, 4: 14, 9: 31, 21: 42, 28: 84, 36: 44, 51: 67, 71: 91, 80: 100 };
export const SNAKES = { 16: 6, 47: 26, 49: 11, 56: 53, 62: 19, 64: 60, 87: 24, 93: 73, 95: 75, 98: 78 };

// Board number for the cell at (row, col), counting rows from the top; 1 is bottom-left, 100 top-left.
export function cellNumber(row, col) {
  const fromBottom = 9 - row;
  return fromBottom % 2 === 0 ? fromBottom * 10 + col + 1 : fromBottom * 10 + 10 - col;
}

// Moves a player from `pos` by `dice`; exact 100 is required to win.
export function move(pos, dice) {
  const landed = pos + dice;
  if (landed > 100) return { pos, landed, blocked: true, kind: null };
  if (LADDERS[landed]) return { pos: LADDERS[landed], landed, blocked: false, kind: "ladder" };
  if (SNAKES[landed]) return { pos: SNAKES[landed], landed, blocked: false, kind: "snake" };
  return { pos: landed, landed, blocked: false, kind: null };
}
