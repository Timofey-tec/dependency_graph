import Stats from './Stats';
import NodeDetails from './NodeDetails';
import type { NodeAnalysis } from '../../types/graph';

interface SidebarProps {
  nodeCount: number;
  edgeCount: number;
  hasCycles: boolean;
  selectedNodeId: string | null;
  nodeAnalysis: NodeAnalysis | null;
}

export default function Sidebar({ nodeCount, edgeCount, hasCycles, selectedNodeId, nodeAnalysis }: SidebarProps) {
  return (
    <div className="w-64 bg-gray-800 border-l border-gray-700 flex flex-col">
      <div className="p-3 border-b border-gray-700">
        <h2 className="text-sm font-bold text-gray-100">Graph Analysis</h2>
      </div>
      <Stats nodeCount={nodeCount} edgeCount={edgeCount} hasCycles={hasCycles} />
      <NodeDetails nodeId={selectedNodeId} analysis={nodeAnalysis} />
      <div className="p-3 border-t border-gray-700 text-xs text-gray-500">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" /> Selected
        </div>
        <div className="flex items-center gap-1.5 mb-1">
          <span className="w-2 h-2 rounded-full bg-green-500 inline-block" /> Dependencies (out)
        </div>
        <div className="flex items-center gap-1.5 mb-1">
          <span className="w-2 h-2 rounded-full bg-orange-500 inline-block" /> Dependents (in)
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-red-500 inline-block" /> In cycle
        </div>
      </div>
    </div>
  );
}
