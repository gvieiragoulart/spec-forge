import React, { useMemo, useState, useEffect } from 'react';
import { useYaml } from '../context/YamlContext';

const LANGUAGES = ['cURL', 'JavaScript (fetch)', 'Python (requests)', 'Java (OkHttp)'];

function genCodeSnippet(lang: string, method: string, url: string, headers: Record<string,string>, body: string) {
  const hdrLines = Object.entries(headers)
    .filter(([,v]) => v)
    .map(([k,v]) => ({k,v}));
  switch (lang) {
    case 'cURL': {
      const h = hdrLines.map(h=>`-H "${h.k}: ${h.v}"`).join(' ');
      const bd = body ? `--data '${body.replace(/'/g, "\\'")}'` : '';
      return `curl -X ${method.toUpperCase()} ${h} ${bd} "${url}"`;
    }
    case 'JavaScript (fetch)': {
      const hdrObj = hdrLines.length ? `headers: ${JSON.stringify(Object.fromEntries(hdrLines.map(h=>[h.k,h.v])), null, 2)},` : '';
      const bd = body ? `body: ${JSON.stringify(body, null, 2)},` : '';
      return `fetch("${url}", {
  method: "${method.toUpperCase()}",
  ${hdrObj}
  ${bd}
})
.then(r => r.json())
.then(console.log)
.catch(console.error);`;
    }
    case 'Python (requests)': {
      const hdrPy = hdrLines.length ? `headers = ${JSON.stringify(Object.fromEntries(hdrLines.map(h=>[h.k,h.v])), null, 2)}` : 'headers = {}';
      const bdPy = body ? `data = ${JSON.stringify(body)}` : 'data = None';
      return `${hdrPy}
${bdPy}
import requests
resp = requests.request("${method.toUpperCase()}", "${url}", headers=headers, data=data)
print(resp.status_code)
print(resp.text)`;
    }
    case 'Java (OkHttp)': {
      const hLines = hdrLines.map(h => `.addHeader("${h.k}", "${h.v}")`).join('\n    ');
      const bdLine = body ? `RequestBody body = RequestBody.create(MediaType.parse("application/json"), "${body.replace(/"/g,'\\"')}");` : `RequestBody body = RequestBody.create("", null);`;
      return `OkHttpClient client = new OkHttpClient();

${bdLine}

Request request = new Request.Builder()
    .url("${url}")
    ${hLines ? hLines + '\n    ' : ''}
    .method("${method.toUpperCase()}", body)
    .build();

Response response = client.newCall(request).execute();
System.out.println(response.code());
System.out.println(response.body().string());`;
    }
    default:
      return '';
  }
}

export default function RightPlayground() {
  const { data, selectedPath } = useYaml();
  const [language, setLanguage] = useState<string>(LANGUAGES[0]);
  const [method, setMethod] = useState<string>('get');
  const baseUrl = data?.servers?.[0]?.url || '';

  const pathInfo = useMemo(() => {
    if (!data || !selectedPath) return null;
    const item: any = data.paths?.[selectedPath];
    if (!item) return null;
    const m = Object.keys(item)[0] || 'get';
    return { item, detectedMethod: m };
  }, [data, selectedPath]);

  useEffect(() => {
    if (pathInfo?.detectedMethod) setMethod(pathInfo.detectedMethod);
  }, [pathInfo?.detectedMethod]);

  const [url, setUrl] = useState<string>('');
  useEffect(() => {
    setUrl(baseUrl && selectedPath ? `${baseUrl}${selectedPath}` : selectedPath || '');
  }, [baseUrl, selectedPath]);

  const [headers, setHeaders] = useState<Array<{k:string;v:string}>>([{k:'Content-Type', v:'application/json'}]);
  const [body, setBody] = useState<string>('');
  const [resp, setResp] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const headerObj = useMemo(() => Object.fromEntries(headers.filter(h=>h.k).map(h=>[h.k,h.v])), [headers]);

  const runRequest = async () => {
    setResp({});
    setLoading(true);
    try {
      const fetchOpts: any = {
        method: method?.toUpperCase(),
        headers: headerObj,
      };
      if (body && ['post','put','patch','delete'].includes(method)) {
        fetchOpts.body = body;
      }
      const r = await fetch(url, fetchOpts);
      const text = await r.text();
      let parsed = text;
      try { parsed = JSON.stringify(JSON.parse(text), null, 2); } catch {}
      const headersRes: Record<string,string> = {};
      r.headers.forEach((v,k)=>headersRes[k]=v);
      setResp({status: r.status, headers: headersRes, body: parsed});
    } catch (err: any) {
      setResp({error: String(err)});
    } finally {
      setLoading(false);
    }
  };

  if (!selectedPath) {
    return (
      <aside className="w-80 border-l px-4 py-4 bg-white text-sm">
        <div className="text-gray-500">Selecione um path para abrir o Playground.</div>
      </aside>
    );
  }

  return (
    <aside className="w-96 border-l px-4 py-6 overflow-auto bg-white text-sm">
      <div className="space-y-4">
        <div>
          <label className="text-xs text-gray-500 uppercase">Language</label>
          <select
            value={language}
            onChange={(e)=>setLanguage(e.target.value)}
            className="mt-1 block w-full border rounded px-2 py-1"
          >
            {LANGUAGES.map(l=> <option key={l} value={l}>{l}</option>)}
          </select>
        </div>

        <div>
          <label className="text-xs text-gray-500 uppercase">Code</label>
          <pre className="bg-gray-50 rounded p-3 text-xs overflow-auto max-h-40">
            {genCodeSnippet(language, method, url, headerObj, body)}
          </pre>
        </div>

        <div className="border-t pt-3">
          <div className="flex items-center gap-2 mb-2">
            <select value={method} onChange={e=>setMethod(e.target.value)} className="border rounded px-2 py-1">
              <option value="get">GET</option>
              <option value="post">POST</option>
              <option value="put">PUT</option>
              <option value="patch">PATCH</option>
              <option value="delete">DELETE</option>
            </select>
            <input value={url} onChange={e=>setUrl(e.target.value)} className="flex-1 border rounded px-2 py-1 text-sm" />
            <button onClick={runRequest} disabled={loading} className="ml-2 bg-blue-600 text-white px-3 py-1 rounded text-sm">
              {loading ? 'Running...' : 'Run'}
            </button>
          </div>

          <div className="mb-3">
            <div className="text-xs text-gray-500 mb-1">Headers</div>
            <div className="space-y-2">
              {headers.map((h, idx) => (
                <div key={idx} className="flex gap-2">
                  <input value={h.k} onChange={e=> setHeaders(prev => prev.map((it,i)=> i===idx? {...it,k:e.target.value}: it))} placeholder="Name" className="w-1/2 border rounded px-2 py-1 text-sm" />
                  <input value={h.v} onChange={e=> setHeaders(prev => prev.map((it,i)=> i===idx? {...it,v:e.target.value}: it))} placeholder="Value" className="flex-1 border rounded px-2 py-1 text-sm" />
                  <button onClick={()=> setHeaders(prev => prev.filter((_,i)=>i!==idx))} className="text-red-500 px-2">✕</button>
                </div>
              ))}
              <button onClick={()=> setHeaders(prev => [...prev, {k:'', v:''}])} className="text-blue-600 text-sm">+ Add header</button>
            </div>
          </div>

          <div className="mb-3">
            <div className="text-xs text-gray-500 mb-1">Body</div>
            <textarea value={body} onChange={e=>setBody(e.target.value)} rows={6} className="w-full border rounded p-2 text-sm" />
          </div>
        </div>

        <div className="border-t pt-3">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold">Response</div>
            <div className="text-xs text-gray-500">{resp.status ? `Status ${resp.status}` : ''}</div>
          </div>

          {resp.error && <div className="text-red-500 text-sm mt-2">{resp.error}</div>}

          {resp.status && (
            <div className="mt-2 space-y-2">
              <div className="text-xs text-gray-500">Headers</div>
              <div className="bg-gray-50 rounded p-2 text-xs">
                {Object.entries(resp.headers || {}).map(([k,v])=>(
                  <div key={k}><strong className="text-gray-700">{k}:</strong> <span className="text-gray-600">{v}</span></div>
                ))}
              </div>

              <div className="text-xs text-gray-500 mt-2">Body</div>
              <pre className="bg-gray-50 rounded p-3 text-xs overflow-auto max-h-56">
                {resp.body}
              </pre>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
