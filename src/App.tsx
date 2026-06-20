import { useCallback, useMemo, useState } from 'react';
import type { Edge, Node } from 'reactflow';
import FileUpload from './components/FileUpload/FileUpload';
import GraphCanvas from './components/GraphCanvas/GraphCanvas';
import Sidebar from './components/Sidebar/Sidebar';
import { DEMO_GRAPHS } from './data/demoGraphs';
import type { GraphData } from './types/graph';
import { analyzeNode, detectCycles, getCycleNodeIds, getGraphStats } from './utils/graphAnalysis';
import { applyDagreLayout } from './utils/layout';

export default function App() {
  const [graphData, setGraphData] = useState<GraphData>(DEMO_GRAPHS.react.data);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const cycleInfo = useMemo(() => detectCycles(graphData), [graphData]);
  const cycleNodeIds = useMemo(() => getCycleNodeIds(cycleInfo.cycles), [cycleInfo]);
  const stats = useMemo(() => getGraphStats(graphData, cycleInfo), [graphData, cycleInfo]);

  const nodeAnalysis = useMemo(
    () => (selectedNodeId ? analyzeNode(selectedNodeId, graphData) : null),
    [selectedNodeId, graphData]
  );

  const { nodes: layoutNodes, edges: layoutEdges } = useMemo(
    () => applyDagreLayout(graphData),
    [graphData]
  );

  const coloredNodes: Node[] = useMemo(() => {
    return layoutNodes.map((node) => {
      let highlight: 'dependency' | 'dependent' | 'selected' | 'cycle' | undefined;

      if (cycleNodeIds.has(node.id)) {
        highlight = 'cycle';
      }

      if (selectedNodeId && nodeAnalysis) {
        if (node.id === selectedNodeId) {
          highlight = 'selected';
        } else if (nodeAnalysis.dependencies.includes(node.id)) {
          highlight = 'dependency';
        } else if (nodeAnalysis.dependents.includes(node.id)) {
          highlight = 'dependent';
        }
      }

      return { ...node, data: { ...node.data, highlight } };
    });
  }, [layoutNodes, selectedNodeId, nodeAnalysis, cycleNodeIds]);

  const coloredEdges: Edge[] = useMemo(() => {
    if (!selectedNodeId || !nodeAnalysis) return layoutEdges;

    return layoutEdges.map((edge) => {
      const isDep = edge.source === selectedNodeId && nodeAnalysis.dependencies.includes(edge.target);
      const isDependent = edge.target === selectedNodeId && nodeAnalysis.dependents.includes(edge.source);

      if (isDep) {
        return { ...edge, style: { stroke: '#22c55e', strokeWidth: 2 }, animated: true };
      }
      if (isDependent) {
        return { ...edge, style: { stroke: '#f97316', strokeWidth: 2 }, animated: true };
      }
      return edge;
    });
  }, [layoutEdges, selectedNodeId, nodeAnalysis]);

  const handleLoad = useCallback((data: GraphData) => {
    setGraphData(data);
    setSelectedNodeId(null);
  }, []);

  const handleNodeClick = useCallback((nodeId: string) => {
    setSelectedNodeId((prev) => (prev === nodeId ? null : nodeId));
  }, []);

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-gray-100">
      <div className="flex flex-1 overflow-hidden">
        <div className="w-80 flex flex-col bg-gray-800 border-r border-gray-700 overflow-y-auto">
          <FileUpload onLoad={handleLoad} />
        </div>

        <GraphCanvas
          nodes={coloredNodes}
          edges={coloredEdges}
          onNodeClick={handleNodeClick}
        />

        <Sidebar
          nodeCount={stats.nodeCount}
          edgeCount={stats.edgeCount}
          hasCycles={stats.hasCycles}
          selectedNodeId={selectedNodeId}
          nodeAnalysis={nodeAnalysis}
        />
      </div>
    </div>
  );
}
