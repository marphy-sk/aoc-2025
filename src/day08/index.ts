import run from "aocrunner";

type Point3D = {
  x: number;
  y: number;
  z: number;
};

type GridInput = Point3D[];

interface Edge {
  dist2: number;
  a: number;
  b: number;
}

class DisjointSetUnion {
  private readonly parent: number[];
  private readonly size: number[];

  constructor(count: number) {
    this.parent = new Array(count);
    this.size = new Array(count);

    for (let i = 0; i < count; i++) {
      this.parent[i] = i;
      this.size[i] = 1;
    }
  }

  find(x: number): number {
    let root = x;
    while (this.parent[root] !== root) {
      root = this.parent[root];
    }

    // path compression
    let node = x;
    while (node !== root) {
      const next = this.parent[node];
      this.parent[node] = root;
      node = next;
    }

    return root;
  }

  union(a: number, b: number): boolean {
    const rootA = this.find(a);
    const rootB = this.find(b);

    if (rootA === rootB) {
      return false;
    }

    if (this.size[rootA] < this.size[rootB]) {
      this.parent[rootA] = rootB;
      this.size[rootB] += this.size[rootA];
    } else {
      this.parent[rootB] = rootA;
      this.size[rootA] += this.size[rootB];
    }

    return true;
  }

  getComponentSizes(): number[] {
    const counts = new Map<number, number>();

    for (let i = 0; i < this.parent.length; i++) {
      const root = this.find(i);
      const current = counts.get(root) ?? 0;
      counts.set(root, current + 1);
    }

    return Array.from(counts.values());
  }
}

const parseInput = (rawInput: string): GridInput =>
  rawInput
    .trim()
    .split("\n")
    .filter((line) => line.trim().length > 0)
    .map((line) => {
      const [xStr, yStr, zStr] = line.split(",").map((s) => s.trim());
      return {
        x: Number(xStr),
        y: Number(yStr),
        z: Number(zStr),
      };
    });

const getPairsToConnect = (pointsCount: number): number => {
  // example input in the problem text has exactly 20 points and uses 10 pairs
  if (pointsCount === 20) {
    return 10;
  }

  // real input uses 1000 pairs
  return 1000;
};

const buildSortedEdges = (points: GridInput): Edge[] => {
  const n = points.length;
  const edges: Edge[] = [];

  for (let i = 0; i < n; i++) {
    const a = points[i];
    for (let j = i + 1; j < n; j++) {
      const b = points[j];

      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const dz = a.z - b.z;
      const dist2 = dx * dx + dy * dy + dz * dz;

      edges.push({ dist2, a: i, b: j });
    }
  }

  edges.sort((e1, e2) => e1.dist2 - e2.dist2);
  return edges;
};

const part1 = (rawInput: string): number => {
  const points = parseInput(rawInput);
  const n = points.length;

  if (n === 0) {
    return 0;
  }

  const edges = buildSortedEdges(points);
  const totalPairs = edges.length;
  const pairsToConnect = Math.min(getPairsToConnect(n), totalPairs);

  const dsu = new DisjointSetUnion(n);

  // we just take the K shortest pairs and connect them
  for (let i = 0; i < pairsToConnect; i++) {
    const edge = edges[i];
    dsu.union(edge.a, edge.b);
  }

  const sizes = dsu.getComponentSizes().sort((a, b) => b - a);

  return sizes[0] * sizes[1] * sizes[2];
};

const part2 = (rawInput: string): number => {
  const points = parseInput(rawInput);
  const n = points.length;

  const edges = buildSortedEdges(points);
  const dsu = new DisjointSetUnion(n);

  let components = n;
  let lastEdge: Edge | null = null;

  for (const edge of edges) {
    const merged = dsu.union(edge.a, edge.b);
    if (!merged) {
      continue;
    }

    components -= 1;

    if (components === 1) {
      lastEdge = edge;
      break;
    }
  }

  if (!lastEdge) {
    // graph was already connected or something unexpected
    return 0;
  }

  const x1 = points[lastEdge.a].x;
  const x2 = points[lastEdge.b].x;

  return x1 * x2;
};

const exampleInput = `162,817,812
57,618,57
906,360,560
592,479,940
352,342,300
466,668,158
542,29,236
431,825,988
739,650,466
52,470,668
216,146,977
819,987,18
117,168,530
805,96,715
346,949,466
970,615,88
941,993,340
862,61,35
984,92,344
425,690,689`;

run({
  part1: {
    tests: [
      {
        input: exampleInput,
        expected: 40,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: exampleInput,
        expected: 25272,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
