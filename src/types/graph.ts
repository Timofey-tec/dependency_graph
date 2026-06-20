export interface GraphNode {
  id: string;
  label: string;
  version?: string;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface CycleInfo {
  hasCycles: boolean;
  cycles: string[][];
}

export interface NodeAnalysis {
  dependencies: string[];
  dependents: string[];
}
