import React from 'react';
import { useYaml } from '../context/YamlContext';

function getEntries(data: any): Array<[string, any]> {
  if (!data) return [];
  if (data.paths && typeof data.paths === 'object') {
    return Object.entries(data.paths);
  }
  if (typeof data === 'object') {
    return Object.entries(data);
  }
  return [];
}

export default function LeftSidebar() {
  const { data, selectedPath, setSelectedPath } = useYaml();

  const entries = getEntries(data);

  const groups: Record<string, Array<{ path: string; item: any }>> = {};

  entries.forEach(([path, item]) => {
    let tag = 'Ungrouped';
    if (item && typeof item === 'object') {
      if (Array.isArray(item.tags) && item.tags.length) tag = item.tags[0];
      else if (typeof item.tag === 'string') tag = item.tag;
      else if (item.tags && typeof item.tags === 'string') tag = item.tags;
    }
    if (!groups[tag]) groups[tag] = [];
    groups[tag].push({ path, item });
  });

  const tags = Object.keys(groups);

  return (
    <aside className="w-64 border-r p-2 overflow-auto">
      {tags.length === 0 && <div>Nenhum path carregado.</div>}
      {tags.map((tag) => (
        <div key={tag} className="mb-4">
          <h3 className="font-semibold mb-2">{tag}</h3>
          <ul>
            {groups[tag].map(({ path }) => (
              <li key={path}>
                <button
                  className={`text-left w-full py-1 px-2 rounded hover:bg-gray-100 ${
                    selectedPath === path ? 'bg-gray-200' : ''
                  }`}
                  onClick={() => setSelectedPath(path)}
                >
                  {path}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </aside>
  );
}
