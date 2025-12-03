import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput.trim().split("\n");

type Range = { start: number; end: number };

const parseRanges = (raw: string): Range[] =>
  raw
    .replace(/\s+/g, "")
    .split(",")
    .filter(Boolean)
    .map((part) => {
      const [a, b] = part.split("-");
      return { start: Number(a), end: Number(b) };
    });

const buildRepeatedIds = (maxR: number): number[] => {
  const maxD = String(maxR).length;
  const set = new Set<number>();

  for (let m = 1; m <= Math.floor(maxD / 2); m++) {
    const p10m = 10 ** m;
    const minSeg = 10 ** (m - 1);
    const maxSeg = p10m - 1;
    const maxK = Math.floor(maxD / m);

    for (let k = 2; k <= maxK; k++) {
      const mult = (10 ** (m * k) - 1) / (p10m - 1); 
      for (let seg = minSeg; seg <= maxSeg; seg++) {
        const n = seg * mult;
        if (n > maxR) break;
        set.add(n);
      }
    }
  }

  return Array.from(set).sort((a, b) => a - b);
};

const sumInRanges = (ids: number[], ranges: Range[], maxR: number): number => {
  const lowerBound = (arr: number[], t: number) => {
    let lo = 0,
      hi = arr.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (arr[mid] < t) lo = mid + 1;
      else hi = mid;
    }
    return lo;
  };
  const upperBound = (arr: number[], t: number) => {
    let lo = 0,
      hi = arr.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (arr[mid] <= t) lo = mid + 1;
      else hi = mid;
    }
    return lo;
  };

  let sum = 0;
  for (const { start, end } of ranges) {
    if (start > maxR) continue;
    const from = lowerBound(ids, start);
    const to = upperBound(ids, end);
    for (let i = from; i < to; i++) sum += ids[i];
  }
  return sum;
};

const part1 = (rawInput: string) => {
  const [line] = parseInput(rawInput);
  const ranges = parseRanges(line);

  let maxR = 0;
  for (const r of ranges) if (r.end > maxR) maxR = r.end;
  if (!maxR) return 0;

  const allRepeated = buildRepeatedIds(maxR);
  const doubleOnly = allRepeated.filter((n) => {
    const s = String(n);
    if (s.length % 2) return false;
    const h = s.length / 2;
    return s.slice(0, h) === s.slice(h);
  });

  return sumInRanges(doubleOnly, ranges, maxR);
};

const part2 = (rawInput: string) => {
  const [line] = parseInput(rawInput);
  const ranges = parseRanges(line);

  let maxR = 0;
  for (const r of ranges) if (r.end > maxR) maxR = r.end;
  if (!maxR) return 0;

  const allRepeated = buildRepeatedIds(maxR);
  return sumInRanges(allRepeated, ranges, maxR);
};


const exampleInput = `11-22,95-115,998-1012,1188511880-1188511890,222220-222224,1698522-1698528,446443-446449,38593856-38593862,565653-565659,824824821-824824827,2121212118-2121212124`;

run({
  part1: {
    tests: [
      {
        input: exampleInput,
        expected: 1227775554,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: exampleInput,
        expected: 4174379265,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
