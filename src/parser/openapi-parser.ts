import { OpenAPISpec } from '../types/openapi';
import { ExtendedOperation, ExtendedPathItem } from '../types/extensions';

/**
 * OpenAPI Parser - Validates and parses OpenAPI v3 specifications
 */
export class OpenAPIParser {
  private spec: OpenAPISpec | null = null;

  /**
   * Parse an OpenAPI specification from JSON string
   */
  parse(specString: string): OpenAPISpec {
    try {
      const parsed = JSON.parse(specString);
      return this.parseObject(parsed);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to parse OpenAPI spec: ${message}`);
    }
  }

  /**
   * Parse an OpenAPI specification from object
   */
  parseObject(specObject: any): OpenAPISpec {
    this.validateSpec(specObject);
    this.spec = specObject as OpenAPISpec;
    return this.spec;
  }

  /**
   * Validate basic OpenAPI v3 structure
   */
  private validateSpec(spec: any): void {
    if (!spec.openapi) {
      throw new Error('Missing required field: openapi');
    }

    if (!spec.openapi.startsWith('3.')) {
      throw new Error(`Unsupported OpenAPI version: ${spec.openapi}. Only 3.x is supported.`);
    }

    if (!spec.info) {
      throw new Error('Missing required field: info');
    }

    if (!spec.info.title) {
      throw new Error('Missing required field: info.title');
    }

    if (!spec.info.version) {
      throw new Error('Missing required field: info.version');
    }

    if (!spec.paths) {
      throw new Error('Missing required field: paths');
    }
  }

  /**
   * Get the parsed specification
   */
  getSpec(): OpenAPISpec | null {
    return this.spec;
  }

  /**
   * Get all paths from the specification
   */
  getPaths(): Record<string, ExtendedPathItem> {
    if (!this.spec) {
      throw new Error('No spec loaded. Call parse() first.');
    }
    return this.spec.paths as Record<string, ExtendedPathItem>;
  }

  /**
   * Get a specific path item
   */
  getPath(path: string): ExtendedPathItem | undefined {
    const paths = this.getPaths();
    return paths[path];
  }

  /**
   * Get all operations from all paths
   */
  getAllOperations(): Array<{
    path: string;
    method: string;
    operation: ExtendedOperation;
  }> {
    const paths = this.getPaths();
    const operations: Array<{
      path: string;
      method: string;
      operation: ExtendedOperation;
    }> = [];

    for (const [path, pathItem] of Object.entries(paths)) {
      const methods: Array<keyof ExtendedPathItem> = ['get', 'put', 'post', 'delete', 'options', 'head', 'patch', 'trace'];
      
      for (const method of methods) {
        const operation = pathItem[method];
        if (operation && typeof operation === 'object') {
          operations.push({
            path,
            method,
            operation: operation as ExtendedOperation,
          });
        }
      }
    }

    return operations;
  }

  /**
   * Get specification info
   */
  getInfo() {
    if (!this.spec) {
      throw new Error('No spec loaded. Call parse() first.');
    }
    return this.spec.info;
  }

  /**
   * Get specification version
   */
  getVersion(): string {
    if (!this.spec) {
      throw new Error('No spec loaded. Call parse() first.');
    }
    return this.spec.openapi;
  }
}

/**
 * Factory function to create a new parser instance
 */
export function createParser(): OpenAPIParser {
  return new OpenAPIParser();
}
