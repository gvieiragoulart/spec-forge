import React, { createContext, useContext, useState } from 'react';
import type { YamlData } from '../types/YamlData';


type YamlContextType = {
  data: YamlData | null;
  setData: (d: YamlData | null) => void;
  selectedPath: string | null;
  setSelectedPath: (p: string | null) => void;
};

const YamlContext = createContext<YamlContextType | undefined>(undefined);

export const YamlProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [data, setData] = useState<YamlData | null>(null);
  const [selectedPath, setSelectedPath] = useState<string | null>(null);

  return (
    <YamlContext.Provider
      value={{ data, setData, selectedPath, setSelectedPath }}
    >
      {children}
    </YamlContext.Provider>
  );
};

export function useYaml() {
  const ctx = useContext(YamlContext);

  if (!ctx) throw new Error('useYaml must be used within YamlProvider');
  return ctx;
}

export default YamlContext;
