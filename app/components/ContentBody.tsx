import React, { useState } from 'react';
import { useYaml } from '../context/YamlContext';

const VERBS = ['get', 'post', 'put', 'delete', 'patch', 'options', 'head'];

const METHOD_COLORS: Record<string, string> = {
  get: 'bg-green-500',
  post: 'bg-blue-500',
  put: 'bg-orange-500',
  delete: 'bg-red-500',
  patch: 'bg-yellow-500',
  options: 'bg-gray-500',
  head: 'bg-purple-500',
};

type SchemaProperty = {
  type?: string;
  description?: string;
  properties?: Record<string, SchemaProperty>;
  items?: SchemaProperty;
  required?: string[];
  $ref?: string;
};

function resolveRef(ref: string, data: any): any {
  if (!ref.startsWith('#/')) return null;
  const parts = ref.replace('#/', '').split('/');
  let result = data;
  for (const part of parts) {
    result = result?.[part];
  }
  return result;
}

function SchemaViewer({
  schema,
  data,
  level = 0,
}: {
  schema: SchemaProperty;
  data: any;
  level?: number;
}) {
  if (schema.$ref) {
    const resolved = resolveRef(schema.$ref, data);
    if (resolved) {
      return <SchemaViewer schema={resolved} data={data} level={level} />;
    }
    return <span className="text-gray-400">Ref não resolvida</span>;
  }

  if (schema.type === 'array' && schema.items) {
    return (
      <div className="ml-4 border-l-2 border-gray-200 pl-4">
        <div className="text-sm text-gray-600 mb-1">array of objects</div>
        <SchemaViewer schema={schema.items} data={data} level={level + 1} />
      </div>
    );
  }

  if (schema.properties) {
    const requiredFields = schema.required || [];
    return (
      <div className={level > 0 ? 'ml-4 border-l-2 border-gray-200 pl-4' : ''}>
        {Object.entries(schema.properties).map(([key, prop]) => (
          <div key={key} className="mb-3">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-800">{key}</span>
              <span className="text-gray-500 text-sm">{prop.type || 'object'}</span>
              {requiredFields.includes(key) && (
                <span className="text-red-500 text-xs font-medium">required</span>
              )}
            </div>
            {prop.description && (
              <p className="text-gray-500 text-sm mt-0.5">{prop.description}</p>
            )}
            {(prop.properties || prop.items) && (
              <SchemaViewer schema={prop} data={data} level={level + 1} />
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <span className="text-gray-500 text-sm">{schema.type || 'unknown'}</span>
  );
}

export default function ContentBody() {
  const { data, selectedPath } = useYaml();

  if (!data) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white">
        <p className="text-gray-400 text-lg">Nenhum YAML carregado.</p>
      </div>
    );
  }

  const entries =
    data.paths && typeof data.paths === 'object'
      ? Object.entries(data.paths)
      : Object.entries(data);

  const current = entries.find(([path]) => path === selectedPath);

  if (!current) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white">
        <p className="text-gray-400 text-lg">Selecione um path na sidebar.</p>
      </div>
    );
  }

  const [path, pathItem] = current;

  // Find first operation (get, post, etc.)
  let method: string | null = null;
  let operation: any = null;
  const pathItemAny = pathItem as any;
  for (const verb of VERBS) {
    if (pathItemAny[verb]) {
      method = verb;
      operation = pathItemAny[verb];
      break;
    }
  }

  if (!operation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white">
        <p className="text-gray-400 text-lg">Nenhuma operação encontrada.</p>
      </div>
    );
  }

  const summary = operation.summary || 'Sem título';
  const description = operation.description || '';
  const parameters = operation.parameters || [];
  const requestBody = operation.requestBody;
  const responses = operation.responses || {};

  const [openResponses, setOpenResponses] = useState<Record<string, boolean>>({});
  const toggleResponse = (code: string) => {
    setOpenResponses((prev) => ({ ...prev, [code]: !prev[code] }));
  };

  // Build full URL (if servers exist)
  const baseUrl = data.servers?.[0]?.url || '';
  const fullUrl = `${baseUrl}${path}`;

  return (
    <div className="flex-1 overflow-auto bg-white">
      <div className="max-w-4xl mx-auto px-8 py-10">
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{summary}</h1>

        {/* Method + URL */}
        <div className="flex items-center gap-3 mb-6">
          <span
            className={`${METHOD_COLORS[method!] || 'bg-gray-500'} text-white text-xs font-bold uppercase px-2 py-1 rounded`}
          >
            {method}
          </span>
          <code className="text-gray-600 text-sm break-all">{fullUrl}</code>
        </div>

        {/* Description */}
        {description && (
          <p className="text-gray-600 leading-relaxed mb-10">{description}</p>
        )}

        {/* Parameters (query, path, header) */}
        {parameters.length > 0 && (
          <section className="mb-10">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
              Parameters
            </h2>
            <div className="space-y-4">
              {parameters.map((param: any, idx: number) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-800">
                        {param.name}
                      </span>
                      <span className="text-gray-500 text-sm">
                        {param.schema?.type || param.type || 'string'}
                      </span>
                      {param.required && (
                        <span className="text-red-500 text-xs font-medium">
                          required
                        </span>
                      )}
                      <span className="text-gray-400 text-xs">
                        in {param.in}
                      </span>
                    </div>
                    {param.description && (
                      <p className="text-gray-500 text-sm mt-1">
                        {param.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Request Body */}
        {requestBody && (
          <section className="mb-10">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
              Body Params
            </h2>
            {Object.entries(requestBody.content || {}).map(
              ([contentType, content]: [string, any]) => {
                const schema = content.schema;
                return (
                  <div key={contentType}>
                    <div className="text-xs text-gray-400 mb-2">
                      {contentType}
                    </div>
                    {schema && <SchemaViewer schema={schema} data={data} />}
                  </div>
                );
              }
            )}
          </section>
        )}

        {/* Responses */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
            Responses
          </h2>
          <div className="space-y-6">
            {Object.entries(responses).map(
              ([statusCode, response]: [string, any]) => {
                const isSuccess = statusCode.startsWith('2');
                const isOpen = !!openResponses[statusCode];
                return (
                  <div key={statusCode}>
                    <button
                      type="button"
                      onClick={() => toggleResponse(statusCode)}
                      className="w-full flex items-center justify-between p-2 rounded hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${isSuccess ? 'bg-green-500' : 'bg-red-500'}`} />
                        <span className="font-semibold text-gray-900">{statusCode}</span>
                      </div>
                      <div className="text-gray-500 text-sm">{isOpen ? '−' : '+'}</div>
                    </button>
                    {isOpen && (
                      <div className="mt-2 pl-4">
                        {response.description && (
                          <p className="text-gray-600 text-sm mb-3">{response.description}</p>
                        )}
                        {response.content && (
                          <div className="bg-gray-50 rounded-lg p-4">
                            <div className="text-xs text-gray-500 uppercase tracking-wide mb-3">Response Body</div>
                            {Object.entries(response.content).map(
                              ([contentType, content]: [string, any]) => {
                                const schema = content.schema;
                                return (
                                  <div key={contentType} className="mb-3">
                                    <div className="text-xs text-gray-400 mb-2">{contentType}</div>
                                    {schema && <SchemaViewer schema={schema} data={data} />}
                                  </div>
                                );
                              }
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              }
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
