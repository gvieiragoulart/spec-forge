import React, { useState, useCallback } from 'react';
import { parseYaml } from '../services/handle_yaml';
import { useYaml } from '../context/YamlContext';
import { useNavigate } from 'react-router';

const FileUploader: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const { setData: setParsed, setSelectedPath } = useYaml();
  const navigate = useNavigate();

  const isYaml = (f: File | undefined) => {
    if (!f) return false;
    const name = f.name.toLowerCase();
    return name.endsWith('.yaml') || name.endsWith('.yml');
  };

  const handleFile = useCallback((f?: File) => {
    if (!f) return;
    if (!isYaml(f)) {
      setFile(null);
      setError('Apenas arquivos .yaml ou .yml são aceitos.');
      return;
    }
    setError(null);
    setFile(f);

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result;
      if (typeof content === 'string') {
        try {
          const parsed = parseYaml(content);
          setParsed(parsed);
          // set default selected path to first entry if any
          const entries = parsed && parsed.paths ? Object.keys(parsed.paths) : parsed ? Object.keys(parsed) : [];
          if (entries && entries.length) setSelectedPath(entries[0]);
          // navigate to viewer page where Sidebar/ContentBody live
          navigate('/viewer');
        } catch (err) {
          setError('Erro ao parsear YAML. Veja console.');
        }
      }
    };
    reader.readAsText(f);
  }, [navigate, setParsed, setSelectedPath]);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFile(e.target.files?.[0]);
  };

  const prevent = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const onDragEnter = (e: React.DragEvent) => {
    prevent(e);
    setIsDragOver(true);
  };
  const onDragOver = (e: React.DragEvent) => {
    prevent(e);
    setIsDragOver(true);
  };
  const onDragLeave = (e: React.DragEvent) => {
    prevent(e);
    setIsDragOver(false);
  };
  const onDrop = (e: React.DragEvent) => {
    prevent(e);
    setIsDragOver(false);
    const dropped = e.dataTransfer.files?.[0];
    handleFile(dropped);
  };

  return (
    <div>
      <input
        id="yaml-input"
        type="file"
        accept=".yaml,.yml"
        onChange={onInputChange}
        style={{ display: 'none' }}
      />

      <label
        htmlFor="yaml-input"
        onDragEnter={onDragEnter}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        tabIndex={0}
        role="button"
        style={{
          display: 'block',
          padding: '20px',
          border: `2px dashed ${isDragOver ? '#007acc' : '#ccc'}`,
          borderRadius: 6,
          textAlign: 'center',
          cursor: 'pointer',
          userSelect: 'none'
        }}
      >
        Arraste e solte um arquivo .yaml/.yml aqui, ou clique para selecionar
      </label>

      {file && <p>Arquivo selecionado: {file.name}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default FileUploader;