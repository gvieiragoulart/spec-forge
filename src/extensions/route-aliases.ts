import { ExtendedOperation } from '../types/extensions';

/**
 * Route Alias Handler - Manages route aliases for operations
 */
export class RouteAliasHandler {
  /**
   * Extract route aliases from an operation
   */
  getAliases(operation: ExtendedOperation): string[] {
    return operation['x-route-aliases'] || [];
  }

  /**
   * Check if an operation has aliases
   */
  hasAliases(operation: ExtendedOperation): boolean {
    return this.getAliases(operation).length > 0;
  }

  /**
   * Add an alias to an operation
   */
  addAlias(operation: ExtendedOperation, alias: string): ExtendedOperation {
    const aliases = this.getAliases(operation);
    if (!aliases.includes(alias)) {
      return {
        ...operation,
        'x-route-aliases': [...aliases, alias],
      };
    }
    return operation;
  }

  /**
   * Remove an alias from an operation
   */
  removeAlias(operation: ExtendedOperation, alias: string): ExtendedOperation {
    const aliases = this.getAliases(operation);
    return {
      ...operation,
      'x-route-aliases': aliases.filter(a => a !== alias),
    };
  }

  /**
   * Validate an alias format
   */
  validateAlias(alias: string): boolean {
    // Alias should start with / and follow OpenAPI path format
    return /^\/[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=%{}]*$/.test(alias);
  }
}

export const routeAliasHandler = new RouteAliasHandler();
