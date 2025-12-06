import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput.trim().split("\n");

const dirs: [number, number][] = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];

const buildNeighborCounts = (grid: string[][]): number[][] => {
  const rows = grid.length;
  const cols = grid[0].length;
  const counts: number[][] = Array.from({ length: rows }, () =>
    Array(cols).fill(0),
  );

  const inBounds = (r: number, c: number) =>
    r >= 0 && r < rows && c >= 0 && c < cols;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] !== "@") continue;

      for (const [dr, dc] of dirs) {
        const nr = r + dr;
        const nc = c + dc;
        if (!inBounds(nr, nc)) continue;
        counts[nr][nc] += 1;
      }
    }
  }

  return counts;
};

const part1 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  const grid = lines.map((line) => line.split(""));
  const rows = grid.length;
  const cols = grid[0].length;

  const neighborCount = buildNeighborCounts(grid);

  let accessibleCount = 0;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] !== "@") continue;
      if (neighborCount[r][c] < 4) {
        accessibleCount++;
      }
    }
  }

  return accessibleCount;
};

const part2 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  const grid = lines.map((line) => line.split(""));
  const rows = grid.length;
  const cols = grid[0].length;

  const inBounds = (r: number, c: number) =>
    r >= 0 && r < rows && c >= 0 && c < cols;

  const neighborCount = buildNeighborCounts(grid);

  type Cell = { r: number; c: number };
  const queue: Cell[] = [];

  // initial queue: all rolls with neighborCount < 4
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === "@" && neighborCount[r][c] < 4) {
        queue.push({ r, c });
      }
    }
  }

  let qIndex = 0;
  let removed = 0;

  while (qIndex < queue.length) {
    const { r, c } = queue[qIndex++];
    if (grid[r][c] !== "@") continue; // already removed
    if (neighborCount[r][c] >= 4) continue; // no longer removable

    // remove this roll
    grid[r][c] = ".";
    removed++;

    // update neighbors
    for (const [dr, dc] of dirs) {
      const nr = r + dr;
      const nc = c + dc;
      if (!inBounds(nr, nc)) continue;
      if (grid[nr][nc] !== "@") continue;

      neighborCount[nr][nc] -= 1;
      if (neighborCount[nr][nc] === 3) {
        // it just dropped below 4
        queue.push({ r: nr, c: nc });
      }
    }
  }

  return removed;
};

const exampleInput = `..@@.@@@@.
@@@.@.@.@@
@@@@@.@.@@
@.@@@@..@.
@@.@@@@.@@
.@@@@@@@.@
.@.@.@.@@@
@.@@@.@@@@
.@@@@@@@@.
@.@.@@@.@.`;

run({
  part1: {
    tests: [
      {
        input: exampleInput,
        expected: 13,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: exampleInput,
        expected: 43,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
