

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

export type { YamlData, Paths };