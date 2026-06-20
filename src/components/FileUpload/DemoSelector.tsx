import { DEMO_GRAPHS } from '../../data/demoGraphs';

interface DemoSelectorProps {
  onSelect: (key: string) => void;
}

export default function DemoSelector({ onSelect }: DemoSelectorProps) {
  return (
    <div>
      <p className="text-xs text-gray-400 mb-2">Or try a built-in demo:</p>
      <div className="flex flex-wrap gap-2">
        {Object.entries(DEMO_GRAPHS).map(([key, { label, description }]) => (
          <button
            key={key}
            onClick={() => onSelect(key)}
            title={description}
            className="px-3 py-1.5 text-sm bg-gray-700 hover:bg-gray-600 text-gray-200 rounded border border-gray-600 transition-colors"
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
