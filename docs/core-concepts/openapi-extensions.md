---
sidebar_position: 1
---

# OpenAPI Extensions

SpecForge extends OpenAPI v3 using the standard `x-*` prefix convention for custom fields. This ensures full compatibility with existing OpenAPI tools while adding powerful new capabilities.

## Extension Philosophy

All SpecForge extensions follow these principles:

1. **Standards Compliant**: Use only `x-*` prefixed fields as defined in the OpenAPI specification
2. **Backwards Compatible**: Standard OpenAPI tools can process SpecForge specs (they simply ignore the extensions)
3. **Additive Only**: Extensions add functionality without modifying standard OpenAPI behavior
4. **Well-Typed**: Full TypeScript support for all extension fields

## Available Extensions

### x-route-aliases

Define alternative paths for the same operation, useful for API versioning and migration.

```json
{
  "paths": {
    "/users": {
      "get": {
        "x-route-aliases": ["/accounts", "/members"]
      }
    }
  }
}
```

### x-custom-tags

Rich categorization tags with metadata like colors, icons, and categories.

```json
{
  "paths": {
    "/users": {
      "get": {
        "x-custom-tags": [
          {
            "name": "User Management",
            "category": "admin",
            "color": "#2563eb",
            "icon": "users",
            "description": "Operations for managing users"
          }
        ]
      }
    }
  }
}
```

### x-permissions

Document authorization requirements including permissions, roles, and scopes.

```json
{
  "paths": {
    "/users": {
      "get": {
        "x-permissions": {
          "required": ["users:read"],
          "optional": ["users:read:sensitive"],
          "roles": ["admin", "user-manager"],
          "scopes": ["read:users"]
        }
      }
    }
  }
}
```

### x-spec-forge

Metadata about the SpecForge version and features used.

```json
{
  "openapi": "3.0.3",
  "x-spec-forge": {
    "version": "0.1.0",
    "generator": "SpecForge",
    "features": ["route-aliases", "custom-tags", "permission-flags"]
  }
}
```

## Type Safety

All extensions are fully typed in TypeScript:

```typescript
import { ExtendedOperation, PermissionFlags, CustomTag } from 'spec-forge';

const operation: ExtendedOperation = {
  summary: "List users",
  responses: { "200": { description: "Success" } },
  "x-route-aliases": ["/accounts"],
  "x-custom-tags": [{
    name: "Admin",
    category: "security"
  }],
  "x-permissions": {
    required: ["users:read"],
    roles: ["admin"]
  }
};
```

## Extension Handlers

SpecForge provides handler classes for working with each extension:

```typescript
import { 
  routeAliasHandler,
  customTagsHandler,
  permissionFlagsHandler 
} from 'spec-forge';

// Work with route aliases
const aliases = routeAliasHandler.getAliases(operation);
const hasAliases = routeAliasHandler.hasAliases(operation);

// Work with custom tags
const tags = customTagsHandler.getCustomTags(operation);
const adminTags = customTagsHandler.getTagsByCategory(operation, 'admin');

// Work with permissions
const permissions = permissionFlagsHandler.getRequiredPermissions(operation);
const roles = permissionFlagsHandler.getRequiredRoles(operation);
```

## Validation

All handlers include validation methods:

```typescript
// Validate alias format
routeAliasHandler.validateAlias('/api/v2/users'); // true

// Validate custom tag structure
customTagsHandler.validateCustomTag({
  name: "Admin",
  category: "security"
}); // true

// Validate permission flags
permissionFlagsHandler.validatePermissions({
  required: ["users:read"],
  roles: ["admin"]
}); // true
```

## Best Practices

1. **Use Meaningful Aliases**: Choose aliases that reflect actual use cases
2. **Categorize Tags**: Use the category field to group related tags
3. **Document Permissions**: Always specify required permissions for protected endpoints
4. **Validate Extensions**: Use the provided validators before committing specs
5. **Keep It Simple**: Don't over-engineer - add extensions only when they add value

## Next Steps

Learn more about each extension:

- [Route Aliases](../extensions/route-aliases)
- [Custom Tags](../extensions/custom-tags)
- [Permission Flags](../extensions/permission-flags)
