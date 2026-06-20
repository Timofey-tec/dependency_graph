import { useCallback, useEffect, useRef } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
} from 'reactflow';
import type { Connection, Edge, Node } from 'reactflow';
import { toPng } from 'html-to-image';
import DependencyNode from './DependencyNode';

const nodeTypes = { dependency: DependencyNode };

interface GraphCanvasProps {
  nodes: Node[];
  edges: Edge[];
  onNodeClick: (nodeId: string) => void;
}

export default function GraphCanvas({ nodes: initialNodes, edges: initialEdges, onNodeClick }: GraphCanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const flowRef = useRef<HTMLDivElement>(null);

  // Sync when the graph changes externally (new demo or upload).
  // Preserves drag positions for nodes that exist in both old and new graph.
  useEffect(() => {
    setNodes((prev) =>
      initialNodes.map((newNode) => {
        const existing = prev.find((n) => n.id === newNode.id);
        return existing ? { ...newNode, position: existing.position } : newNode;
      })
    );
  }, [initialNodes, setNodes]);

  useEffect(() => {
    setEdges(initialEdges);
  }, [initialEdges, setEdges]);

  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  const handleExport = useCallback(() => {
    if (!flowRef.current) return;
    toPng(flowRef.current, { backgroundColor: '#1f2937' }).then((dataUrl) => {
      const link = document.createElement('a');
      link.download = 'dependency-graph.png';
      link.href = dataUrl;
      link.click();
    });
  }, []);

  return (
    <div className="flex-1 relative" ref={flowRef}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        onNodeClick={(_, node) => onNodeClick(node.id)}
        fitView
        attributionPosition="bottom-right"
      >
        <Background color="#374151" gap={20} />
        <Controls />
        <MiniMap
          nodeColor={(node) => {
            const h = node.data?.highlight;
            if (h === 'selected') return '#3b82f6';
            if (h === 'dependency') return '#16a34a';
            if (h === 'dependent') return '#f97316';
            if (h === 'cycle') return '#dc2626';
            return '#4b5563';
          }}
          style={{ background: '#1f2937', border: '1px solid #374151' }}
        />
      </ReactFlow>
      <button
        onClick={handleExport}
        className="absolute top-3 right-3 bg-gray-700 hover:bg-gray-600 text-gray-100 text-sm px-3 py-1.5 rounded border border-gray-500 z-10"
      >
        Export PNG
      </button>
    </div>
  );
}
