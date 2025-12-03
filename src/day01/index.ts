import run from "aocrunner";

const parseInput = (rawInput: string) =>
  rawInput
    .trim()
    .split("\n")
    .filter(Boolean);

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let position = 50;
  let countZero = 0;

  for (const line of input) {
    const dir = line[0];
    const distance = Number(line.slice(1));

    if (dir === "R") {
      position = (position + distance) % 100;
    } else {
      position = (position - distance) % 100;
      if (position < 0) position += 100;
    }

    if (position === 0) {
      countZero++;
    }
  }
  return countZero;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let position = 50;
  let countZero = 0;

  for (const line of input) {
    const dir = line[0];
    const distance = Number(line.slice(1));

    if (dir === "R") {
      let base = (100 - position) % 100;
      if (base === 0) base = 100;

      if (base <= distance) {
        countZero += 1 + Math.floor((distance - base) / 100);
      }

      position = (position + distance) % 100;

    } else if (dir === "L") {
      let base = position % 100;
      if (base === 0) base = 100;

      if (base <= distance) {
        countZero += 1 + Math.floor((distance - base) / 100);
      }

      position = (position - distance) % 100;
      if (position < 0) position += 100;
    }
  }

  return countZero;
};

// ------------------ TEST INPUT ------------------

const exampleInput = `
L68
L30
R48
L5
R60
L55
L1
L99
R14
L82
`.trim();

run({
  part1: {
    tests: [
      {
        input: exampleInput,
        expected: 3,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: exampleInput,
        expected: 6,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
