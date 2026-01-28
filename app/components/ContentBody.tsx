import React from 'react';
import { useYaml } from '../context/YamlContext';

export default function ContentBody() {
  const { data, selectedPath } = useYaml();

  if (!data) return <div className="p-4">Nenhum YAML carregado.</div>;

  const entries = data.paths && typeof data.paths === 'object'
    ? Object.entries(data.paths)
    : Object.entries(data);

  const current = entries.find(([path]) => path === selectedPath);

  if (!current) {
    return <div className="p-4">Selecione um path na sidebar.</div>;
  }

  const [, item] = current;

  return (
    <div className="p-4 flex-1 overflow-auto">
      <h2 className="font-bold mb-2">{selectedPath}</h2>
      <pre className="bg-gray-50 p-3 rounded overflow-auto">
        <code>{JSON.stringify(item, null, 2)}</code>
      </pre>
    </div>
  );
}
