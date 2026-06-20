import type { CycleInfo, GraphData, NodeAnalysis } from '../types/graph';

export function detectCycles(data: GraphData): CycleInfo {
  const adj = new Map<string, string[]>();
  for (const node of data.nodes) adj.set(node.id, []);
  for (const edge of data.edges) {
    adj.get(edge.source)?.push(edge.target);
  }

  const WHITE = 0, GRAY = 1, BLACK = 2;
  const color = new Map<string, number>();
  for (const node of data.nodes) color.set(node.id, WHITE);

  const cycles: string[][] = [];
  const stack: string[] = [];

  function dfs(node: string): void {
    color.set(node, GRAY);
    stack.push(node);

    for (const neighbor of adj.get(node) ?? []) {
      if (color.get(neighbor) === GRAY) {
        const cycleStart = stack.indexOf(neighbor);
        cycles.push([...stack.slice(cycleStart), neighbor]);
      } else if (color.get(neighbor) === WHITE) {
        dfs(neighbor);
      }
    }

    stack.pop();
    color.set(node, BLACK);
  }

  for (const node of data.nodes) {
    if (color.get(node.id) === WHITE) {
      dfs(node.id);
    }
  }

  return { hasCycles: cycles.length > 0, cycles };
}

export function analyzeNode(nodeId: string, data: GraphData): NodeAnalysis {
  const dependencies = data.edges
    .filter((e) => e.source === nodeId)
    .map((e) => e.target);

  const dependents = data.edges
    .filter((e) => e.target === nodeId)
    .map((e) => e.source);

  return { dependencies, dependents };
}

export function getGraphStats(data: GraphData, cycleInfo: CycleInfo) {
  return {
    nodeCount: data.nodes.length,
    edgeCount: data.edges.length,
    hasCycles: cycleInfo.hasCycles,
  };
}

export function getCycleNodeIds(cycles: string[][]): Set<string> {
  const ids = new Set<string>();
  for (const cycle of cycles) {
    for (const id of cycle) ids.add(id);
  }
  return ids;
}
