import { parse } from 'yaml';

export function parseYaml(yamlContent: string): any {
  try {
    const parsedData = parse(yamlContent);

    return parsedData;
  } catch (err) {
    console.error("YAML parse error:", err);
    throw err;
  }
}

export default parseYaml;