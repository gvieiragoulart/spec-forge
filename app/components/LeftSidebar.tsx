import React, { useMemo, useState } from 'react';
import { useYaml } from '../context/YamlContext';
import type { YamlData, Paths } from '../types/YamlData';

function getEntries(data: YamlData | null): Paths {
  if (!data) return {};

  return data.paths;
}

const METHOD_COLORS: Record<string, string> = {
  get: 'bg-green-100 text-green-800',
  post: 'bg-blue-100 text-blue-800',
  put: 'bg-orange-100 text-orange-800',
  delete: 'bg-red-100 text-red-800',
  patch: 'bg-yellow-100 text-yellow-800',
  options: 'bg-gray-100 text-gray-800',
  head: 'bg-purple-100 text-purple-800',
};

export default function LeftSidebar() {
  const { data, selectedPath, setSelectedPath } = useYaml();

  const entries = getEntries(data);

  const groups = useMemo(() => {
    const g: Record<
      string,
      Array<{ path: string; method: string; summary?: string; operationId?: string }>
    > = {};

    Object.entries(entries || {}).forEach(([path, item]) => {
      if (!item || typeof item !== 'object') return;
      Object.entries(item).forEach(([method, details]) => {
        const d: any = details;
        const tag = d.tags && d.tags.length > 0 ? d.tags[0] : 'Ungrouped';
        if (!g[tag]) g[tag] = [];
        g[tag].push({
          path,
          method,
          summary: d.summary || d.description,
          operationId: d.operationId,
        });
      });
    });

    return g;
  }, [entries]);

  const tags = Object.keys(groups);

  const [openTags, setOpenTags] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    for (const tag of Object.keys(groups)) {
      init[tag] = groups[tag].some((it) => it.path === selectedPath);
    }
    return init;
  });

  const toggleTag = (tag: string) => setOpenTags((prev) => ({ ...prev, [tag]: !prev[tag] }));

  return (
    <aside className="w-72 border-r px-6 py-4 overflow-y-auto overflow-x-hidden bg-white font-sans text-sm">
      {tags.length === 0 && <div className="text-gray-500">Nenhum path carregado.</div>}
      {tags.map((tag) => {
        const isOpen = !!openTags[tag];
        return (
          <div key={tag} className="mb-4">
            <button
              type="button"
              onClick={() => toggleTag(tag)}
              className="w-full flex items-center justify-between px-2 py-1"
            >
              <span className="font-semibold text-gray-700">{tag}</span>
              <span className="text-gray-400">{isOpen ? '▾' : '▸'}</span>
            </button>

            {isOpen && (
              <ul className="mt-2 pl-4 space-y-1">
                {groups[tag].map(({ path, method, summary, operationId }) => (
                  <li key={operationId || `${method}-${path}`}>
                    <button
                      className={`w-full py-1.5 px-2 rounded hover:bg-gray-50 flex items-center justify-between gap-2 ${
                        selectedPath === path ? 'bg-gray-100' : ''
                      }`}
                      onClick={() => setSelectedPath(path)}
                    >
                      <span className="truncate text-left flex-1 min-w-0">{summary || path}</span>
                      <span
                        className={`shrink-0 inline-flex items-center justify-center px-2 py-0.5 rounded text-xs font-medium ${METHOD_COLORS[method] || 'bg-gray-100 text-gray-700'}`}
                      >
                        {method.toUpperCase()}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </aside>
  );
}