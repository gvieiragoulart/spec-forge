---
sidebar_position: 3
---

# Permission Flags

Permission flags document authorization requirements for API operations, including permissions, roles, and OAuth scopes.

## Overview

The `x-permissions` extension allows you to specify:

- **Required Permissions**: Must-have permissions to access the endpoint
- **Optional Permissions**: Permissions that unlock additional functionality
- **Roles**: User roles that are allowed to access the endpoint
- **Scopes**: OAuth/OIDC scopes required for the operation

## Specification

Add `x-permissions` to any operation:

```json
{
  "paths": {
    "/users": {
      "get": {
        "summary": "List users",
        "x-permissions": {
          "required": ["users:read"],
          "optional": ["users:read:sensitive"],
          "roles": ["admin", "user-manager"],
          "scopes": ["read:users"]
        },
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    }
  }
}
```

## Type Definition

```typescript
interface PermissionFlags {
  required?: string[];
  optional?: string[];
  roles?: string[];
  scopes?: string[];
}

interface PermissionFlagsExtension {
  'x-permissions'?: PermissionFlags;
}
```

## Usage

### PermissionFlagsHandler

The `PermissionFlagsHandler` provides methods for working with permissions:

```typescript
import { permissionFlagsHandler } from 'spec-forge';

// Get all permissions
const permissions = permissionFlagsHandler.getPermissions(operation);

// Check if operation has permissions
const hasPermissions = permissionFlagsHandler.hasPermissions(operation);

// Get specific permission types
const required = permissionFlagsHandler.getRequiredPermissions(operation);
const optional = permissionFlagsHandler.getOptionalPermissions(operation);
const roles = permissionFlagsHandler.getRequiredRoles(operation);
const scopes = permissionFlagsHandler.getRequiredScopes(operation);

// Check specific permission
const needsAdmin = permissionFlagsHandler.requiresPermission(operation, 'users:write');
const needsRole = permissionFlagsHandler.requiresRole(operation, 'admin');

// Validate permission structure
const isValid = permissionFlagsHandler.validatePermissions({
  required: ['users:read'],
  roles: ['admin']
});
```

### Setting Permissions

```typescript
// Set permissions
const updatedOperation = permissionFlagsHandler.setPermissions(operation, {
  required: ['users:write', 'users:create'],
  roles: ['admin'],
  scopes: ['write:users']
});

// Add individual permissions
const withPermission = permissionFlagsHandler.addRequiredPermission(
  operation,
  'users:delete'
);

// Add roles
const withRole = permissionFlagsHandler.addRequiredRole(operation, 'admin');
```

## Real-World Examples

### Example 1: CRUD Operations

Different permissions for different operations:

```json
{
  "paths": {
    "/users": {
      "get": {
        "summary": "List users",
        "x-permissions": {
          "required": ["users:read"],
          "roles": ["admin", "user-manager", "user"]
        }
      },
      "post": {
        "summary": "Create user",
        "x-permissions": {
          "required": ["users:write", "users:create"],
          "roles": ["admin", "user-manager"]
        }
      }
    },
    "/users/{userId}": {
      "put": {
        "summary": "Update user",
        "x-permissions": {
          "required": ["users:write", "users:update"],
          "roles": ["admin", "user-manager"]
        }
      },
      "delete": {
        "summary": "Delete user",
        "x-permissions": {
          "required": ["users:write", "users:delete"],
          "roles": ["admin"]
        }
      }
    }
  }
}
```

### Example 2: Optional Permissions

Permissions that enhance functionality:

```json
{
  "paths": {
    "/users/{userId}": {
      "get": {
        "summary": "Get user details",
        "description": "Basic info for all roles. Sensitive data requires additional permission.",
        "x-permissions": {
          "required": ["users:read"],
          "optional": ["users:read:sensitive", "users:read:private"],
          "roles": ["admin", "user-manager", "user"]
        }
      }
    }
  }
}
```

### Example 3: OAuth Scopes

Using OAuth 2.0 scopes:

```json
{
  "paths": {
    "/api/users": {
      "get": {
        "x-permissions": {
          "scopes": ["read:users", "read:profile"],
          "roles": ["user"]
        }
      },
      "post": {
        "x-permissions": {
          "scopes": ["write:users", "admin:users"],
          "roles": ["admin"]
        }
      }
    }
  }
}
```

### Example 4: Hierarchical Permissions

Resource-specific permissions:

```json
{
  "paths": {
    "/projects/{projectId}/files": {
      "get": {
        "x-permissions": {
          "required": ["projects:read", "files:read"],
          "roles": ["project-member"]
        }
      },
      "post": {
        "x-permissions": {
          "required": ["projects:write", "files:create"],
          "roles": ["project-admin", "project-editor"]
        }
      }
    }
  }
}
```

## Permission Checker

Build an authorization checker:

```typescript
import { createParser, permissionFlagsHandler } from 'spec-forge';

class PermissionChecker {
  constructor(
    private userPermissions: string[],
    private userRoles: string[],
    private userScopes: string[]
  ) {}

  canAccess(operation: ExtendedOperation): boolean {
    // Check required permissions
    const required = permissionFlagsHandler.getRequiredPermissions(operation);
    const hasAllPermissions = required.every(p => 
      this.userPermissions.includes(p)
    );

    if (!hasAllPermissions) {
      return false;
    }

    // Check roles (user must have at least one required role)
    const requiredRoles = permissionFlagsHandler.getRequiredRoles(operation);
    const hasRole = requiredRoles.length === 0 || 
      requiredRoles.some(r => this.userRoles.includes(r));

    if (!hasRole) {
      return false;
    }

    // Check scopes
    const requiredScopes = permissionFlagsHandler.getRequiredScopes(operation);
    const hasAllScopes = requiredScopes.every(s => 
      this.userScopes.includes(s)
    );

    return hasAllScopes;
  }

  getMissingPermissions(operation: ExtendedOperation): {
    permissions: string[];
    roles: string[];
    scopes: string[];
  } {
    const required = permissionFlagsHandler.getRequiredPermissions(operation);
    const requiredRoles = permissionFlagsHandler.getRequiredRoles(operation);
    const requiredScopes = permissionFlagsHandler.getRequiredScopes(operation);

    return {
      permissions: required.filter(p => !this.userPermissions.includes(p)),
      roles: requiredRoles.filter(r => !this.userRoles.includes(r)),
      scopes: requiredScopes.filter(s => !this.userScopes.includes(s))
    };
  }

  getAccessibleEndpoints(spec: any): any[] {
    const parser = createParser();
    parser.parseObject(spec);
    const operations = parser.getAllOperations();

    return operations.filter(({ operation }) => this.canAccess(operation));
  }
}

// Usage
const checker = new PermissionChecker(
  ['users:read', 'users:write'],
  ['user-manager'],
  ['read:users', 'write:users']
);

const canAccess = checker.canAccess(operation);
const missing = checker.getMissingPermissions(operation);
const accessible = checker.getAccessibleEndpoints(apiSpec);
```

## Permission Matrix

Generate a permission matrix:

```typescript
function generatePermissionMatrix(spec: any) {
  const parser = createParser();
  parser.parseObject(spec);
  const operations = parser.getAllOperations();

  const matrix: any[] = [];

  operations.forEach(({ path, method, operation }) => {
    const required = permissionFlagsHandler.getRequiredPermissions(operation);
    const optional = permissionFlagsHandler.getOptionalPermissions(operation);
    const roles = permissionFlagsHandler.getRequiredRoles(operation);
    const scopes = permissionFlagsHandler.getRequiredScopes(operation);

    matrix.push({
      endpoint: `${method.toUpperCase()} ${path}`,
      requiredPermissions: required.join(', '),
      optionalPermissions: optional.join(', '),
      roles: roles.join(', '),
      scopes: scopes.join(', ')
    });
  });

  console.table(matrix);
  return matrix;
}
```

## Permission Naming Conventions

Recommended patterns for permission names:

### Pattern 1: Resource:Action

```
users:read
users:write
users:create
users:update
users:delete
```

### Pattern 2: Service:Resource:Action

```
api:users:read
api:users:write
admin:users:delete
```

### Pattern 3: Hierarchical

```
projects:read
projects:files:read
projects:files:write
projects:members:manage
```

### Pattern 4: Wildcard Support

```
users:*          // All user operations
*:read           // Read on all resources
admin:*          // All admin operations
```

## Role Hierarchy

Define role hierarchies in documentation:

```typescript
const roleHierarchy = {
  'super-admin': ['admin', 'user-manager', 'user'],
  'admin': ['user-manager', 'user'],
  'user-manager': ['user'],
  'user': []
};

function hasInheritedRole(userRole: string, requiredRole: string): boolean {
  if (userRole === requiredRole) return true;
  
  const inherited = roleHierarchy[userRole] || [];
  return inherited.includes(requiredRole);
}
```

## Best Practices

1. **Consistent Naming**: Use a standard format for permission names
2. **Principle of Least Privilege**: Require only necessary permissions
3. **Document Everything**: Explain what each permission grants
4. **Use Roles**: Group permissions into roles for easier management
5. **Optional Permissions**: Use for enhanced features, not core functionality
6. **Validate Early**: Check permissions at API gateway level
7. **Audit Trail**: Log permission checks for security auditing

## Common Patterns

### Pattern 1: Public Endpoints

```json
{
  "paths": {
    "/health": {
      "get": {
        "summary": "Health check",
        "x-permissions": {}
      }
    }
  }
}
```

### Pattern 2: Authenticated Only

```json
{
  "x-permissions": {
    "roles": ["user"]
  }
}
```

### Pattern 3: Admin Only

```json
{
  "x-permissions": {
    "roles": ["admin"],
    "required": ["admin:access"]
  }
}
```

### Pattern 4: Multi-Tier Access

```json
{
  "x-permissions": {
    "required": ["resource:read"],
    "optional": ["resource:read:premium"],
    "roles": ["free-tier", "premium-tier"]
  }
}
```

## Security Considerations

1. **Never Trust Client**: Always validate permissions server-side
2. **Defense in Depth**: Use multiple layers of authorization
3. **Regular Audits**: Review permission assignments regularly
4. **Fail Secure**: Deny access by default
5. **Clear Errors**: Return 403 (Forbidden) with clear messages
6. **Rate Limiting**: Combine with rate limits for sensitive operations

## API Reference

### PermissionFlagsHandler Methods

| Method | Parameters | Returns | Description |
|--------|-----------|---------|-------------|
| `getPermissions` | `operation` | `PermissionFlags \| undefined` | Get all flags |
| `hasPermissions` | `operation` | `boolean` | Check if has flags |
| `getRequiredPermissions` | `operation` | `string[]` | Get required |
| `getOptionalPermissions` | `operation` | `string[]` | Get optional |
| `getRequiredRoles` | `operation` | `string[]` | Get roles |
| `getRequiredScopes` | `operation` | `string[]` | Get scopes |
| `setPermissions` | `operation, permissions` | `ExtendedOperation` | Set flags |
| `addRequiredPermission` | `operation, permission` | `ExtendedOperation` | Add permission |
| `addRequiredRole` | `operation, role` | `ExtendedOperation` | Add role |
| `requiresPermission` | `operation, permission` | `boolean` | Check permission |
| `requiresRole` | `operation, role` | `boolean` | Check role |
| `validatePermissions` | `permissions` | `boolean` | Validate structure |

## Next Steps

- Learn about [Route Aliases](./route-aliases)
- Explore [Custom Tags](./custom-tags)
- See [Usage Examples](../core-concepts/usage)
