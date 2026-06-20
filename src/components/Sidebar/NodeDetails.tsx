import type { NodeAnalysis } from '../../types/graph';

interface NodeDetailsProps {
  nodeId: string | null;
  analysis: NodeAnalysis | null;
}

export default function NodeDetails({ nodeId, analysis }: NodeDetailsProps) {
  if (!nodeId || !analysis) {
    return (
      <div className="p-3 flex-1">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Node details</h3>
        <p className="text-sm text-gray-500">Click a node to see its dependencies</p>
      </div>
    );
  }

  return (
    <div className="p-3 flex-1 overflow-y-auto">
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Selected: {nodeId}</h3>

      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
          <span className="text-xs font-semibold text-gray-300">
            Depends on ({analysis.dependencies.length})
          </span>
        </div>
        {analysis.dependencies.length === 0 ? (
          <p className="text-xs text-gray-500 ml-4">No dependencies</p>
        ) : (
          <ul className="ml-4 space-y-0.5">
            {analysis.dependencies.map((dep) => (
              <li key={dep} className="text-xs text-green-400 font-mono">→ {dep}</li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-orange-500 inline-block" />
          <span className="text-xs font-semibold text-gray-300">
            Used by ({analysis.dependents.length})
          </span>
        </div>
        {analysis.dependents.length === 0 ? (
          <p className="text-xs text-gray-500 ml-4">No dependents</p>
        ) : (
          <ul className="ml-4 space-y-0.5">
            {analysis.dependents.map((dep) => (
              <li key={dep} className="text-xs text-orange-400 font-mono">← {dep}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
