import type { GraphData, GraphEdge, GraphNode } from '../types/graph';

export function parsePackageJson(raw: string): GraphData {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error('Invalid JSON: could not parse the file.');
  }

  if (typeof parsed !== 'object' || parsed === null) {
    throw new Error('Invalid package.json: root must be an object.');
  }

  const pkg = parsed as Record<string, unknown>;
  const rootName = typeof pkg.name === 'string' ? pkg.name : 'my-package';

  const allDeps: Record<string, string> = {
    ...(typeof pkg.dependencies === 'object' && pkg.dependencies !== null
      ? (pkg.dependencies as Record<string, string>)
      : {}),
    ...(typeof pkg.devDependencies === 'object' && pkg.devDependencies !== null
      ? (pkg.devDependencies as Record<string, string>)
      : {}),
  };

  if (Object.keys(allDeps).length === 0) {
    throw new Error('No dependencies found in package.json.');
  }

  const nodes: GraphNode[] = [{ id: rootName, label: rootName }];
  const edges: GraphEdge[] = [];

  Object.entries(allDeps).forEach(([name, version], i) => {
    nodes.push({ id: name, label: name, version });
    edges.push({ id: `e${i}`, source: rootName, target: name });
  });

  return { nodes, edges };
}
