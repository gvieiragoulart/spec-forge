---
sidebar_position: 1
---

# Introduction to SpecForge

Welcome to **SpecForge** - a powerful extension system for OpenAPI v3 that adds route aliases, custom tags, and permission flags while maintaining full compatibility with the OpenAPI standard.

## What is SpecForge?

SpecForge extends the OpenAPI v3 specification with custom `x-*` fields that enable:

- **🔗 Route Aliases**: Define multiple paths for the same endpoint
- **🏷️ Custom Tags**: Rich categorization with colors, icons, and metadata
- **🔐 Permission Flags**: Document required permissions, roles, and scopes

All extensions follow the OpenAPI convention of using `x-*` prefixed fields, ensuring compatibility with existing OpenAPI tools and validators.

## Why SpecForge?

Standard OpenAPI specifications are great for documenting API structure, but they lack some features that are crucial for modern API development:

1. **API Evolution**: When migrating APIs, you often need to support old and new paths simultaneously. Route aliases make this seamless.

2. **Rich Categorization**: Beyond simple tags, APIs need structured metadata for better organization and discoverability.

3. **Authorization Documentation**: Security requirements should be clear and structured. Permission flags document exactly what access is needed.

4. **Developer Experience**: Built with TypeScript and React, SpecForge provides excellent tooling and beautiful documentation generation.

## Quick Start

### Installation

```bash
npm install spec-forge
# or
yarn add spec-forge
```

### Basic Usage

```typescript
import { createParser } from 'spec-forge';
import exampleSpec from './examples/example-api.json';

// Parse an OpenAPI spec
const parser = createParser();
parser.parseObject(exampleSpec);

// Get all operations
const operations = parser.getAllOperations();

console.log(`Found ${operations.length} operations`);
```

### Using Extensions

```typescript
import { routeAliasHandler, customTagsHandler, permissionFlagsHandler } from 'spec-forge';

// Get route aliases
const aliases = routeAliasHandler.getAliases(operation);

// Get custom tags
const tags = customTagsHandler.getCustomTags(operation);

// Get permission requirements
const permissions = permissionFlagsHandler.getRequiredPermissions(operation);
const roles = permissionFlagsHandler.getRequiredRoles(operation);
```

## Example Specification

Here's a simple example showing all SpecForge extensions:

```json
{
  "openapi": "3.0.3",
  "info": {
    "title": "Example API",
    "version": "1.0.0"
  },
  "paths": {
    "/users": {
      "get": {
        "summary": "List users",
        "x-route-aliases": ["/accounts", "/members"],
        "x-custom-tags": [
          {
            "name": "User Management",
            "category": "admin",
            "color": "#2563eb",
            "icon": "users"
          }
        ],
        "x-permissions": {
          "required": ["users:read"],
          "roles": ["admin", "user-manager"]
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

## Next Steps

- Learn about [OpenAPI Extensions](./core-concepts/openapi-extensions)
- Explore the [Parser](./core-concepts/parser)
- Understand [Route Aliases](./extensions/route-aliases)
- Discover [Custom Tags](./extensions/custom-tags)
- Master [Permission Flags](./extensions/permission-flags)

## Features

✅ Full OpenAPI v3 compatibility  
✅ TypeScript support with complete type definitions  
✅ Zero-config documentation generation with Docusaurus  
✅ Extensible architecture for custom extensions  
✅ Production-ready parser and handlers  
✅ Comprehensive examples and documentation
