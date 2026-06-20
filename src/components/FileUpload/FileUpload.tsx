import { useRef, useState } from 'react';
import DemoSelector from './DemoSelector';
import { DEMO_GRAPHS } from '../../data/demoGraphs';
import { parsePackageJson } from '../../utils/parsePackageJson';
import type { GraphData } from '../../types/graph';

interface FileUploadProps {
  onLoad: (data: GraphData) => void;
}

export default function FileUpload({ onLoad }: FileUploadProps) {
  const [jsonText, setJsonText] = useState('');
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  function handleParse() {
    setError('');
    try {
      const data = parsePackageJson(jsonText);
      onLoad(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    }
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      setJsonText(text);
      setError('');
      try {
        const data = parsePackageJson(text);
        onLoad(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    };
    reader.readAsText(file);
  }

  function handleDemo(key: string) {
    setError('');
    const demo = DEMO_GRAPHS[key];
    if (demo) onLoad(demo.data);
  }

  return (
    <div className="p-4 border-b border-gray-700 space-y-3">
      <div className="flex items-center gap-3">
        <h1 className="text-base font-bold text-gray-100">Dependency Graph Visualizer</h1>
      </div>

      <DemoSelector onSelect={handleDemo} />

      <div className="border-t border-gray-700 pt-3 space-y-2">
        <div className="flex gap-2">
          <button
            onClick={() => fileRef.current?.click()}
            className="px-3 py-1.5 text-sm bg-blue-700 hover:bg-blue-600 text-white rounded border border-blue-600 transition-colors"
          >
            Upload package.json
          </button>
          <input
            ref={fileRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleFile}
          />
        </div>

        <div className="flex gap-2">
          <textarea
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            placeholder="Or paste JSON here..."
            className="flex-1 bg-gray-800 border border-gray-600 rounded text-xs text-gray-200 p-2 font-mono resize-none h-16 focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={handleParse}
            disabled={!jsonText.trim()}
            className="px-3 py-1.5 text-sm bg-gray-700 hover:bg-gray-600 disabled:opacity-40 text-gray-200 rounded border border-gray-600 transition-colors self-start"
          >
            Parse
          </button>
        </div>

        {error && (
          <div className="text-xs text-red-400 bg-red-900/30 border border-red-800 rounded p-2">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
