import React, { createContext, useContext, useState } from 'react';


type Contact = {
    name: string;
    url: string;
};

type Info = {
    contact: Contact;
    title: string;
    version: string;
};


type Server = {
  url: string;
  description: string;
};

type Tag = {
  name: string;
  description: string;
};

type HttpMethod = {
    description: string;
    operationId: string;
    requestBody: object; // Tipo 'object' ou mais específico se detalhado
    responses: Record<string, object>; // Ex: {'200': {...}, '400': {...}}
    summary: string;
    tags: string[];
    // Propriedades adicionais vistas na imagem, como 'post', 'get', etc.
};

type Paths = Record<string, {
    // Um endpoint pode ter 'post', 'get', 'put', etc.
    // Usamos Partial para indicar que nem todos os métodos são obrigatórios em todas as URLs.
    post?: HttpMethod;
    get?: HttpMethod;
    put?: HttpMethod;
    delete?: HttpMethod;
    // Adicione outros métodos REST conforme necessário
}>;

type YamlData = {
  openapi: string;
  info: Info;
  servers: Server[];
  tags: Tag[];
  components: {
    securitySchemes: {
      ApiKeyAuth: {
        type: string;
        in: string;
        name: string;
      };
    };
  };
  security: Array<Record<string, string[]>>;
  paths: Paths;
};


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
  console.log('useYaml context:', ctx);
  if (!ctx) throw new Error('useYaml must be used within YamlProvider');
  return ctx;
}

export default YamlContext;
