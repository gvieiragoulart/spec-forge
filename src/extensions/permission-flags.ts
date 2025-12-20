import { ExtendedOperation, PermissionFlags } from '../types/extensions';

/**
 * Permission Flags Handler - Manages permission and authorization flags for operations
 */
export class PermissionFlagsHandler {
  /**
   * Extract permission flags from an operation
   */
  getPermissions(operation: ExtendedOperation): PermissionFlags | undefined {
    return operation['x-permissions'];
  }

  /**
   * Check if an operation has permission flags
   */
  hasPermissions(operation: ExtendedOperation): boolean {
    return operation['x-permissions'] !== undefined;
  }

  /**
   * Get required permissions
   */
  getRequiredPermissions(operation: ExtendedOperation): string[] {
    return this.getPermissions(operation)?.required || [];
  }

  /**
   * Get optional permissions
   */
  getOptionalPermissions(operation: ExtendedOperation): string[] {
    return this.getPermissions(operation)?.optional || [];
  }

  /**
   * Get required roles
   */
  getRequiredRoles(operation: ExtendedOperation): string[] {
    return this.getPermissions(operation)?.roles || [];
  }

  /**
   * Get required scopes
   */
  getRequiredScopes(operation: ExtendedOperation): string[] {
    return this.getPermissions(operation)?.scopes || [];
  }

  /**
   * Set permission flags for an operation
   */
  setPermissions(operation: ExtendedOperation, permissions: PermissionFlags): ExtendedOperation {
    return {
      ...operation,
      'x-permissions': permissions,
    };
  }

  /**
   * Add a required permission
   */
  addRequiredPermission(operation: ExtendedOperation, permission: string): ExtendedOperation {
    const current = this.getPermissions(operation) || {};
    const required = current.required || [];
    
    if (!required.includes(permission)) {
      return {
        ...operation,
        'x-permissions': {
          ...current,
          required: [...required, permission],
        },
      };
    }
    return operation;
  }

  /**
   * Add a required role
   */
  addRequiredRole(operation: ExtendedOperation, role: string): ExtendedOperation {
    const current = this.getPermissions(operation) || {};
    const roles = current.roles || [];
    
    if (!roles.includes(role)) {
      return {
        ...operation,
        'x-permissions': {
          ...current,
          roles: [...roles, role],
        },
      };
    }
    return operation;
  }

  /**
   * Check if operation requires specific permission
   */
  requiresPermission(operation: ExtendedOperation, permission: string): boolean {
    return this.getRequiredPermissions(operation).includes(permission);
  }

  /**
   * Check if operation requires specific role
   */
  requiresRole(operation: ExtendedOperation, role: string): boolean {
    return this.getRequiredRoles(operation).includes(role);
  }

  /**
   * Validate permission flags structure
   */
  validatePermissions(permissions: PermissionFlags): boolean {
    const isArrayOfStrings = (arr: any): arr is string[] => {
      return Array.isArray(arr) && arr.every(item => typeof item === 'string');
    };

    return (
      (permissions.required === undefined || isArrayOfStrings(permissions.required)) &&
      (permissions.optional === undefined || isArrayOfStrings(permissions.optional)) &&
      (permissions.roles === undefined || isArrayOfStrings(permissions.roles)) &&
      (permissions.scopes === undefined || isArrayOfStrings(permissions.scopes))
    );
  }
}

export const permissionFlagsHandler = new PermissionFlagsHandler();
