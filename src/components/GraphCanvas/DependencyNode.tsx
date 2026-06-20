import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';

type NodeData = {
  label: string;
  version: string;
  highlight?: 'dependency' | 'dependent' | 'selected' | 'cycle';
};

function DependencyNode({ data }: NodeProps<NodeData>) {
  const colorMap: Record<string, string> = {
    selected: 'bg-blue-500 border-blue-400 text-white',
    dependency: 'bg-green-600 border-green-400 text-white',
    dependent: 'bg-orange-500 border-orange-400 text-white',
    cycle: 'bg-red-600 border-red-400 text-white',
  };

  const cls = data.highlight
    ? colorMap[data.highlight]
    : 'bg-gray-700 border-gray-500 text-gray-100';

  return (
    <div className={`px-3 py-1.5 rounded border text-sm font-mono min-w-[120px] text-center ${cls}`}>
      <Handle type="target" position={Position.Top} style={{ background: '#6b7280' }} />
      <div className="font-semibold truncate">{data.label}</div>
      {data.version && (
        <div className="text-xs opacity-70 truncate">{data.version}</div>
      )}
      <Handle type="source" position={Position.Bottom} style={{ background: '#6b7280' }} />
    </div>
  );
}

export default memo(DependencyNode);
