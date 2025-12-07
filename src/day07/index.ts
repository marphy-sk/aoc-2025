import run from "aocrunner";

type Grid = string[];

interface BeamPos {
  row: number;
  col: number;
}

const parseInput = (rawInput: string): Grid => {
  return rawInput.trim().split("\n");
};

const findStart = (grid: Grid): BeamPos => {
  const firstRow = grid[0];
  const col = firstRow.indexOf("S");

  if (col === -1) {
    throw new Error("No start 'S' found in first row");
  }

  return { row: 0, col };
};

const buildSplittersByCol = (grid: Grid): number[][] => {
  const height = grid.length;
  const width = grid[0].length;

  const splitters: number[][] = Array.from({ length: width }, () => []);

  for (let r = 0; r < height; r++) {
    const row = grid[r];
    for (let c = 0; c < width; c++) {
      if (row[c] === "^") {
        splitters[c].push(r);
      }
    }
  }

  return splitters;
};

const findNextSplitterRow = (
  rows: number[],
  fromRow: number,
): number | undefined => {
  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    if (r > fromRow) {
      return r;
    }
  }
  return undefined;
};

const part1 = (rawInput: string): number => {
  const grid = parseInput(rawInput);
  const width = grid[0].length;

  const start = findStart(grid);
  const splittersByCol = buildSplittersByCol(grid);

  const queue: BeamPos[] = [];
  const visited = new Set<string>();
  const usedSplitters = new Set<string>();

  const startKey = `${start.row},${start.col}`;
  queue.push(start);
  visited.add(startKey);

  let splitCount = 0;

  while (queue.length > 0) {
    const current = queue.shift() as BeamPos;
    const { row, col } = current;

    const splitRows = splittersByCol[col];
    const splitRow = findNextSplitterRow(splitRows, row);

    if (splitRow === undefined) {
      continue;
    }

    const splitKey = `${splitRow},${col}`;
    if (usedSplitters.has(splitKey)) {
      continue;
    }

    usedSplitters.add(splitKey);
    splitCount++;

    const nextRow = splitRow;

    const enqueue = (r: number, c: number) => {
      if (c < 0 || c >= width) {
        return;
      }
      const key = `${r},${c}`;
      if (!visited.has(key)) {
        visited.add(key);
        queue.push({ row: r, col: c });
      }
    };

    enqueue(nextRow, col - 1);
    enqueue(nextRow, col + 1);
  }

  return splitCount;
};

const part2 = (rawInput: string): number => {
  const grid = parseInput(rawInput);
  const width = grid[0].length;

  const start = findStart(grid);
  const splittersByCol = buildSplittersByCol(grid);

  const memo = new Map<string, number>();

  const countTimelines = (row: number, col: number): number => {
    if (col < 0 || col >= width) {
      return 1;
    }

    const key = `${row},${col}`;
    if (memo.has(key)) {
      return memo.get(key)!;
    }

    const splitRows = splittersByCol[col];
    const splitRow = findNextSplitterRow(splitRows, row);

    if (splitRow === undefined) {
      memo.set(key, 1);
      return 1;
    }

    const nextRow = splitRow;
    const left = countTimelines(nextRow, col - 1);
    const right = countTimelines(nextRow, col + 1);

    const result = left + right;
    memo.set(key, result);

    return result;
  };

  return countTimelines(start.row, start.col);
};

const exampleInput = `
.......S.......
...............
.......^.......
...............
......^.^......
...............
.....^.^.^.....
...............
....^.^...^....
...............
...^.^...^.^...
...............
..^...^.....^..
...............
.^.^.^.^.^...^.
...............
`;

run({
  part1: {
    tests: [
      {
        input: exampleInput,
        expected: 21,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: exampleInput,
        expected: 40,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
