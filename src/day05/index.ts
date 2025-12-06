import run from "aocrunner";

const parseInput = (rawInput: {
  trim: () => {
    (): any;
    new (): any;
    split: { (arg0: string): [any, any]; new (): any };
  };
}) => {
  const [rangesRaw, idsRaw] = rawInput.trim().split("\n\n");

  const ranges = rangesRaw.split("\n").map(
    (line: {
      split: (arg0: string) => {
        (): any;
        new (): any;
        map: { (arg0: NumberConstructor): [any, any]; new (): any };
      };
    }) => {
      const [a, b] = line.split("-").map(Number);
      return { start: a, end: b };
    },
  );

  const ids = idsRaw ? idsRaw.split("\n").map(Number) : [];

  return { ranges, ids };
};

const part1 = (rawInput: any) => {
  const { ranges, ids } = parseInput(rawInput);

  let fresh = 0;

  for (const id of ids) {
    for (const r of ranges) {
      if (id >= r.start && id <= r.end) {
        fresh++;
        break;
      }
    }
  }

  return fresh;
};

const mergeRanges = (ranges: string | any[]) => {
  if (ranges.length === 0) return [];

  const sorted = [...ranges].sort((a, b) => a.start - b.start);
  const merged = [];
  let curr = { ...sorted[0] };

  for (let i = 1; i < sorted.length; i++) {
    const r = sorted[i];

    if (r.start <= curr.end) {
      curr.end = Math.max(curr.end, r.end);
    } else {
      merged.push(curr);
      curr = { ...r };
    }
  }

  merged.push(curr);
  return merged;
};

const part2 = (rawInput: any) => {
  const { ranges } = parseInput(rawInput);

  const merged = mergeRanges(ranges);

  let total = 0;

  for (const r of merged) {
    total += r.end - r.start + 1;
  }

  return total;
};

const exampleInput = `
3-5
10-14
16-20
12-18

1
5
8
11
17
32
`;

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
        expected: 14,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
