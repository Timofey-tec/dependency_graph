import dagre from 'dagre';
import type { GraphData } from '../types/graph';
import { MarkerType } from 'reactflow';
import type { Edge, Node } from 'reactflow';

const NODE_WIDTH = 160;
const NODE_HEIGHT = 40;

export function applyDagreLayout(data: GraphData): { nodes: Node[]; edges: Edge[] } {
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: 'TB', ranksep: 60, nodesep: 40 });

  for (const node of data.nodes) {
    g.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  }

  for (const edge of data.edges) {
    g.setEdge(edge.source, edge.target);
  }

  dagre.layout(g);

  const nodes: Node[] = data.nodes.map((node) => {
    const pos = g.node(node.id);
    return {
      id: node.id,
      type: 'dependency',
      position: { x: pos.x - NODE_WIDTH / 2, y: pos.y - NODE_HEIGHT / 2 },
      data: { label: node.label, version: node.version ?? '' },
    };
  });

  const edges: Edge[] = data.edges.map((edge) => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    type: 'smoothstep',
    animated: false,
    style: { stroke: '#4b5563' },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#4b5563' },
  }));

  return { nodes, edges };
}
