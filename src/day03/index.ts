import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput.split('\n');

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let total = 0;

  for (const line of input) {
    if (!line) continue; ***REMOVED***

    let maxPrev = -1; ***REMOVED***
    let best = -1;    ***REMOVED***

    for (let i = 0; i < line.length; i++) {
      const d = line.charCodeAt(i) - 48; ***REMOVED***

      if (i > 0 && maxPrev >= 0) {
        const val = maxPrev * 10 + d;
        if (val > best) {
          best = val;
        }
      }

      if (d > maxPrev) {
        maxPrev = d;
      }
    }

    total += best;
  }

  return total;
};

***REMOVED***
const maxSubsequenceOfLength = (line: string, k: number): string => {
  const stack: string[] = [];
  let toRemove = line.length - k; ***REMOVED***

  for (const ch of line) {
    while (toRemove > 0 && stack.length > 0 && stack[stack.length - 1] < ch) {
      stack.pop();
      toRemove--;
    }
    stack.push(ch);
  }

  ***REMOVED***
  ***REMOVED***
  return stack.slice(0, k).join('');
};

const part2 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  const K = 12;

  let total = 0;

  for (const line of lines) {
    if (!line) continue;

    ***REMOVED***
    const k = Math.min(K, line.length);

    const bestStr = maxSubsequenceOfLength(line, k);
    const val = Number(bestStr); ***REMOVED***

    total += val;
  }

  return total;
};

run({
  part1: {
    tests: [
      {
        input: `
987654321111111
811111111111119
234234234234278
818181911112111
        `,
        expected: 357,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
987654321111111
811111111111119
234234234234278
818181911112111
        `,
        expected: 3121910778619,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
