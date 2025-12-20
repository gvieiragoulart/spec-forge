---
sidebar_position: 1
---

# Route Aliases

Route aliases allow you to define multiple paths for the same endpoint, making API versioning and migration seamless.

## Overview

The `x-route-aliases` extension lets you specify alternative paths that resolve to the same operation. This is particularly useful when:

- Migrating from old API paths to new ones
- Supporting multiple naming conventions simultaneously
- Providing backward compatibility during API evolution
- Creating user-friendly alternative paths

## Specification

Add `x-route-aliases` to any operation:

```json
{
  "paths": {
    "/users": {
      "get": {
        "summary": "List users",
        "x-route-aliases": ["/accounts", "/members"],
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
interface RouteAliasExtension {
  'x-route-aliases'?: string[];
}
```

## Usage

### RouteAliasHandler

The `RouteAliasHandler` provides methods for working with route aliases:

```typescript
import { routeAliasHandler } from 'spec-forge';

// Get all aliases
const aliases = routeAliasHandler.getAliases(operation);
console.log(aliases); // ['/accounts', '/members']

// Check if operation has aliases
const hasAliases = routeAliasHandler.hasAliases(operation);
console.log(hasAliases); // true

// Validate alias format
const isValid = routeAliasHandler.validateAlias('/api/v2/users');
console.log(isValid); // true
```

### Adding Aliases

```typescript
// Add a new alias
const updatedOperation = routeAliasHandler.addAlias(operation, '/people');

// The operation now has: ['/accounts', '/members', '/people']
```

### Removing Aliases

```typescript
// Remove an alias
const updatedOperation = routeAliasHandler.removeAlias(operation, '/members');

// The operation now has: ['/accounts']
```

### Validation

Aliases must follow OpenAPI path format:

```typescript
// Valid aliases
routeAliasHandler.validateAlias('/users'); // ✅ true
routeAliasHandler.validateAlias('/api/v2/users'); // ✅ true
routeAliasHandler.validateAlias('/users/{id}'); // ✅ true

// Invalid aliases
routeAliasHandler.validateAlias('users'); // ❌ false (missing leading /)
routeAliasHandler.validateAlias(''); // ❌ false (empty)
```

## Real-World Examples

### Example 1: API Migration

When renaming an endpoint, support both old and new paths:

```json
{
  "paths": {
    "/api/v2/users": {
      "get": {
        "summary": "List users",
        "x-route-aliases": ["/api/v1/users"],
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

### Example 2: Multiple Conventions

Support different naming conventions:

```json
{
  "paths": {
    "/users": {
      "get": {
        "x-route-aliases": [
          "/accounts",
          "/members", 
          "/people"
        ]
      }
    }
  }
}
```

### Example 3: Resource-Specific Paths

Provide specific resource aliases:

```json
{
  "paths": {
    "/users/{userId}": {
      "get": {
        "x-route-aliases": [
          "/accounts/{userId}",
          "/profile/{userId}",
          "/members/{userId}"
        ],
        "parameters": [
          {
            "name": "userId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ]
      }
    }
  }
}
```

## Building a Route Map

Use aliases to build a complete route mapping:

```typescript
import { createParser, routeAliasHandler } from 'spec-forge';

function buildRouteMap(spec: any) {
  const parser = createParser();
  parser.parseObject(spec);
  const operations = parser.getAllOperations();

  const routeMap = new Map();

  operations.forEach(({ path, method, operation }) => {
    // Add main path
    routeMap.set(`${method}:${path}`, operation);

    // Add all aliases
    const aliases = routeAliasHandler.getAliases(operation);
    aliases.forEach(alias => {
      routeMap.set(`${method}:${alias}`, operation);
    });
  });

  return routeMap;
}

// Usage
const routes = buildRouteMap(apiSpec);
console.log(`Total routes: ${routes.size}`);

// Look up by any path or alias
const operation = routes.get('GET:/accounts');
console.log(operation.summary); // "List users"
```

## Best Practices

1. **Keep Aliases Meaningful**: Use aliases that make sense to API consumers
2. **Document Deprecation**: Use the standard `deprecated` field for old paths
3. **Version Carefully**: Include version in path when providing aliases
4. **Limit Aliases**: Don't create too many aliases - it can confuse users
5. **Consistent Parameters**: Ensure parameter names match across aliases

## Common Patterns

### Pattern 1: Version Migration

```json
{
  "/api/v2/resource": {
    "get": {
      "x-route-aliases": ["/api/v1/resource"],
      "deprecated": false
    }
  }
}
```

### Pattern 2: Plural/Singular Support

```json
{
  "/users": {
    "post": {
      "summary": "Create user",
      "x-route-aliases": ["/user"]
    }
  }
}
```

### Pattern 3: Shorthand Paths

```json
{
  "/administration/users": {
    "get": {
      "x-route-aliases": ["/admin/users"]
    }
  }
}
```

## API Reference

### RouteAliasHandler Methods

| Method | Parameters | Returns | Description |
|--------|-----------|---------|-------------|
| `getAliases` | `operation` | `string[]` | Get all aliases |
| `hasAliases` | `operation` | `boolean` | Check if has aliases |
| `addAlias` | `operation, alias` | `ExtendedOperation` | Add an alias |
| `removeAlias` | `operation, alias` | `ExtendedOperation` | Remove an alias |
| `validateAlias` | `alias` | `boolean` | Validate format |

## Next Steps

- Learn about [Custom Tags](./custom-tags)
- Explore [Permission Flags](./permission-flags)
- See [Usage Examples](../core-concepts/usage)
