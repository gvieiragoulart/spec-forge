---
sidebar_position: 3
---

# Usage Examples

Practical examples of using SpecForge in real-world scenarios.

## Basic Setup

```typescript
import { createParser, routeAliasHandler, customTagsHandler, permissionFlagsHandler } from 'spec-forge';

// Load your OpenAPI spec
import apiSpec from './api-spec.json';

// Create and initialize parser
const parser = createParser();
parser.parseObject(apiSpec);
```

## Example 1: Generate API Documentation

```typescript
function generateApiDocs() {
  const parser = createParser();
  parser.parseObject(apiSpec);

  const info = parser.getInfo();
  const operations = parser.getAllOperations();

  console.log(`# ${info.title}`);
  console.log(`Version: ${info.version}\n`);
  console.log(info.description);
  console.log('\n## Endpoints\n');

  operations.forEach(({ path, method, operation }) => {
    console.log(`### ${method.toUpperCase()} ${path}`);
    console.log(operation.summary);
    console.log('');
  });
}
```

## Example 2: List All Route Aliases

```typescript
function listAllAliases() {
  const parser = createParser();
  parser.parseObject(apiSpec);
  const operations = parser.getAllOperations();

  console.log('Route Aliases:\n');

  operations.forEach(({ path, method, operation }) => {
    const aliases = routeAliasHandler.getAliases(operation);
    
    if (aliases.length > 0) {
      console.log(`${method.toUpperCase()} ${path}`);
      aliases.forEach(alias => {
        console.log(`  → ${alias}`);
      });
      console.log('');
    }
  });
}
```

## Example 3: Check Permissions

```typescript
function checkEndpointPermissions(userPermissions: string[], userRoles: string[]) {
  const parser = createParser();
  parser.parseObject(apiSpec);
  const operations = parser.getAllOperations();

  operations.forEach(({ path, method, operation }) => {
    const requiredPerms = permissionFlagsHandler.getRequiredPermissions(operation);
    const requiredRoles = permissionFlagsHandler.getRequiredRoles(operation);

    const hasPermissions = requiredPerms.every(p => userPermissions.includes(p));
    const hasRole = requiredRoles.length === 0 || requiredRoles.some(r => userRoles.includes(r));

    const canAccess = hasPermissions && hasRole;

    console.log(`${method.toUpperCase()} ${path}: ${canAccess ? '✅' : '❌'}`);
    
    if (!canAccess) {
      console.log(`  Missing: ${requiredPerms.join(', ')}`);
    }
  });
}

// Usage
checkEndpointPermissions(
  ['users:read'],
  ['user']
);
```

## Example 4: Filter by Custom Tags

```typescript
function getOperationsByCategory(category: string) {
  const parser = createParser();
  parser.parseObject(apiSpec);
  const operations = parser.getAllOperations();

  const filtered = operations.filter(({ operation }) => {
    const tags = customTagsHandler.getCustomTags(operation);
    return tags.some(tag => tag.category === category);
  });

  console.log(`Operations in category "${category}":\n`);
  filtered.forEach(({ path, method, operation }) => {
    console.log(`${method.toUpperCase()} ${path} - ${operation.summary}`);
  });

  return filtered;
}

// Usage
getOperationsByCategory('admin');
```

## Example 5: Generate Permission Matrix

```typescript
function generatePermissionMatrix() {
  const parser = createParser();
  parser.parseObject(apiSpec);
  const operations = parser.getAllOperations();

  const matrix: Record<string, string[]> = {};

  operations.forEach(({ path, method, operation }) => {
    const key = `${method.toUpperCase()} ${path}`;
    const permissions = permissionFlagsHandler.getRequiredPermissions(operation);
    const roles = permissionFlagsHandler.getRequiredRoles(operation);

    matrix[key] = [...permissions, ...roles.map(r => `role:${r}`)];
  });

  console.log('Permission Matrix:\n');
  console.table(matrix);

  return matrix;
}
```

## Example 6: Validate All Extensions

```typescript
function validateSpecExtensions() {
  const parser = createParser();
  parser.parseObject(apiSpec);
  const operations = parser.getAllOperations();

  let valid = true;

  operations.forEach(({ path, method, operation }) => {
    const prefix = `${method.toUpperCase()} ${path}`;

    // Validate route aliases
    const aliases = routeAliasHandler.getAliases(operation);
    aliases.forEach(alias => {
      if (!routeAliasHandler.validateAlias(alias)) {
        console.error(`❌ ${prefix}: Invalid alias "${alias}"`);
        valid = false;
      }
    });

    // Validate custom tags
    const tags = customTagsHandler.getCustomTags(operation);
    tags.forEach(tag => {
      if (!customTagsHandler.validateCustomTag(tag)) {
        console.error(`❌ ${prefix}: Invalid tag "${tag.name}"`);
        valid = false;
      }
    });

    // Validate permissions
    const permissions = permissionFlagsHandler.getPermissions(operation);
    if (permissions && !permissionFlagsHandler.validatePermissions(permissions)) {
      console.error(`❌ ${prefix}: Invalid permissions`);
      valid = false;
    }
  });

  if (valid) {
    console.log('✅ All extensions are valid');
  }

  return valid;
}
```

## Example 7: Build Route Map with Aliases

```typescript
function buildRouteMap() {
  const parser = createParser();
  parser.parseObject(apiSpec);
  const operations = parser.getAllOperations();

  const routeMap = new Map<string, { path: string; method: string; operation: any }>();

  operations.forEach(({ path, method, operation }) => {
    const key = `${method}:${path}`;
    routeMap.set(key, { path, method, operation });

    // Add aliases
    const aliases = routeAliasHandler.getAliases(operation);
    aliases.forEach(alias => {
      const aliasKey = `${method}:${alias}`;
      routeMap.set(aliasKey, { path: alias, method, operation });
    });
  });

  console.log(`Total routes (including aliases): ${routeMap.size}`);
  return routeMap;
}
```

## Example 8: Generate OpenAPI Client Config

```typescript
function generateClientConfig() {
  const parser = createParser();
  parser.parseObject(apiSpec);
  const info = parser.getInfo();
  const operations = parser.getAllOperations();

  const config = {
    apiTitle: info.title,
    apiVersion: info.version,
    endpoints: operations.map(({ path, method, operation }) => ({
      path,
      method,
      operationId: operation.operationId,
      summary: operation.summary,
      permissions: permissionFlagsHandler.getRequiredPermissions(operation),
      roles: permissionFlagsHandler.getRequiredRoles(operation),
      aliases: routeAliasHandler.getAliases(operation),
    })),
  };

  return config;
}
```

## Next Steps

Explore the extension handlers in detail:

- [Route Aliases](../extensions/route-aliases)
- [Custom Tags](../extensions/custom-tags)
- [Permission Flags](../extensions/permission-flags)
