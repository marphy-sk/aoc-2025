import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput.split("\n");

const getColumnBlocks = (
  originalLines: string[],
): { start: number; end: number }[] => {
  const height = originalLines.length;
  const width = Math.max(...originalLines.map((r) => r.length));
  const grid = originalLines.map((r) => r.padEnd(width, " "));

  const blocks: { start: number; end: number }[] = [];

  const isEmptyColumn = (col: number): boolean => {
    for (let r = 0; r < height; r++) {
      if (grid[r][col] !== " ") {
        return false;
      }
    }
    return true;
  };

  let c = 0;
  while (c < width) {
    if (isEmptyColumn(c)) {
      c++;
      continue;
    }

    const start = c;
    while (c < width && !isEmptyColumn(c)) {
      c++;
    }
    const end = c - 1;

    blocks.push({ start, end });
  }

  return blocks;
};

const part1 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  const height = lines.length;
  const width = Math.max(...lines.map((r) => r.length));
  const grid = lines.map((r) => r.padEnd(width, " "));

  const blocks = getColumnBlocks(lines);

  let total = 0;

  for (const block of blocks) {
    const numbers: number[] = [];
    let op: "+" | "*" = "*";

    for (let r = 0; r < height; r++) {
      let numStr = "";

      for (let c = block.start; c <= block.end; c++) {
        const ch = grid[r][c];
        if (ch >= "0" && ch <= "9") {
          numStr += ch;
        }
      }

      if (numStr.length > 0) {
        numbers.push(Number(numStr));
      } else {
        for (let c = block.start; c <= block.end; c++) {
          const ch = grid[r][c];
          if (ch === "+" || ch === "*") {
            op = ch;
          }
        }
      }
    }

    const value = numbers.reduce((a, b) => (op === "+" ? a + b : a * b));
    total += value;
  }

  return total;
};

const part2 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  const height = lines.length;
  const width = Math.max(...lines.map((r) => r.length));
  const grid = lines.map((r) => r.padEnd(width, " "));

  const blocks = getColumnBlocks(lines);

  let total = 0;

  for (const block of blocks) {
    let op: "+" | "*" = "*";

    // operator is on the last row
    for (let c = block.start; c <= block.end; c++) {
      const ch = grid[height - 1][c];
      if (ch === "+" || ch === "*") {
        op = ch;
      }
    }

    const numbers: number[] = [];

    // read columns right-to-left
    for (let col = block.end; col >= block.start; col--) {
      let numStr = "";
      for (let r = 0; r < height; r++) {
        const ch = grid[r][col];
        if (ch >= "0" && ch <= "9") {
          numStr += ch;
        }
      }
      if (numStr.length > 0) {
        numbers.push(Number(numStr));
      }
    }

    const value = numbers.reduce((a, b) => (op === "+" ? a + b : a * b));
    total += value;
  }

  return total;
};

const exampleInput = `
123 328  51 64 
 45 64  387 23 
  6 98  215 314
*   +   *   +  
`;

run({
  part1: {
    tests: [
      {
        input: exampleInput,
        expected: 4277556,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: exampleInput,
        expected: 3263827,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
