interface StatsProps {
  nodeCount: number;
  edgeCount: number;
  hasCycles: boolean;
}

export default function Stats({ nodeCount, edgeCount, hasCycles }: StatsProps) {
  return (
    <div className="p-3 border-b border-gray-700">
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Graph stats</h3>
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-gray-800 rounded p-2">
          <div className="text-lg font-bold text-blue-400">{nodeCount}</div>
          <div className="text-xs text-gray-400">Nodes</div>
        </div>
        <div className="bg-gray-800 rounded p-2">
          <div className="text-lg font-bold text-blue-400">{edgeCount}</div>
          <div className="text-xs text-gray-400">Edges</div>
        </div>
        <div className="bg-gray-800 rounded p-2">
          <div className={`text-lg font-bold ${hasCycles ? 'text-red-400' : 'text-green-400'}`}>
            {hasCycles ? 'Yes' : 'No'}
          </div>
          <div className="text-xs text-gray-400">Cycles</div>
        </div>
      </div>
      {hasCycles && (
        <div className="mt-2 text-xs text-red-400 bg-red-900/30 rounded p-2 border border-red-800">
          Circular dependencies detected! Red nodes form cycles.
        </div>
      )}
    </div>
  );
}
