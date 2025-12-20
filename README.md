# SpecForge

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![OpenAPI](https://img.shields.io/badge/OpenAPI-3.0-green.svg)](https://swagger.io/specification/)

> Extend OpenAPI v3 with route aliases, custom tags, and permission flags while maintaining full compatibility with the OpenAPI standard.

## 🚀 Features

- **🔗 Route Aliases** - Define multiple paths for the same endpoint
- **🏷️ Custom Tags** - Rich categorization with colors, icons, and metadata
- **🔐 Permission Flags** - Document required permissions, roles, and OAuth scopes
- **✅ OpenAPI Compatible** - Uses standard `x-*` extension pattern
- **⚡ TypeScript First** - Complete type safety and excellent DX
- **📚 Beautiful Docs** - Generate documentation with Docusaurus and React

## 📋 Table of Contents

- [Installation](#-installation)
- [Quick Start](#-quick-start)
- [Core Concepts](#-core-concepts)
- [Extensions](#-extensions)
- [Documentation](#-documentation)
- [Examples](#-examples)
- [Contributing](#-contributing)
- [License](#-license)

## 📦 Installation

```bash
npm install spec-forge
# or
yarn add spec-forge
```

## 🎯 Quick Start

### 1. Parse an OpenAPI Spec

```typescript
import { createParser } from 'spec-forge';

const parser = createParser();
parser.parseObject(yourOpenAPISpec);

console.log(`API: ${parser.getInfo().title}`);
console.log(`Operations: ${parser.getAllOperations().length}`);
```

### 2. Use Extensions

```typescript
import { routeAliasHandler, customTagsHandler, permissionFlagsHandler } from 'spec-forge';

const operations = parser.getAllOperations();

operations.forEach(({ path, method, operation }) => {
  // Get route aliases
  const aliases = routeAliasHandler.getAliases(operation);
  
  // Get custom tags
  const tags = customTagsHandler.getCustomTags(operation);
  
  // Get permissions
  const permissions = permissionFlagsHandler.getRequiredPermissions(operation);
  const roles = permissionFlagsHandler.getRequiredRoles(operation);
});
```

### 3. Example OpenAPI Spec with Extensions

```json
{
  "openapi": "3.0.3",
  "info": {
    "title": "Example API",
    "version": "1.0.0"
  },
  "x-spec-forge": {
    "version": "0.1.0",
    "features": ["route-aliases", "custom-tags", "permission-flags"]
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

## 💡 Core Concepts

### OpenAPI Parser

SpecForge provides a robust parser for OpenAPI v3 specifications:

```typescript
import { createParser } from 'spec-forge';

const parser = createParser();

// Parse from object
parser.parseObject(spec);

// Parse from JSON string
parser.parse(jsonString);

// Access spec data
const info = parser.getInfo();
const paths = parser.getPaths();
const operations = parser.getAllOperations();
```

### Type Safety

Full TypeScript support with complete type definitions:

```typescript
import { 
  OpenAPISpec, 
  ExtendedOperation, 
  CustomTag, 
  PermissionFlags 
} from 'spec-forge';

const operation: ExtendedOperation = {
  summary: "List users",
  responses: { "200": { description: "Success" } },
  "x-route-aliases": ["/accounts"],
  "x-custom-tags": [{ name: "Admin", category: "security" }],
  "x-permissions": { required: ["users:read"], roles: ["admin"] }
};
```

## 🔌 Extensions

### 🔗 Route Aliases

Define alternative paths for the same operation:

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

**Use Cases:**
- API versioning and migration
- Supporting multiple naming conventions
- Backward compatibility

### 🏷️ Custom Tags

Rich categorization with metadata:

```json
{
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
```

**Use Cases:**
- Hierarchical organization
- Visual identification in documentation
- Feature flagging
- Domain-driven design

### 🔐 Permission Flags

Document authorization requirements:

```json
{
  "x-permissions": {
    "required": ["users:read"],
    "optional": ["users:read:sensitive"],
    "roles": ["admin", "user-manager"],
    "scopes": ["read:users"]
  }
}
```

**Use Cases:**
- Clear authorization documentation
- Permission matrix generation
- Access control validation
- Security auditing

## 📚 Documentation

### Generate Documentation Site

This project uses Docusaurus for documentation:

```bash
npm install
npm start
```

Visit `http://localhost:3000` to see the documentation site.

### Build for Production

```bash
npm run build
npm run serve
```

## 📖 Examples

Check out the [`examples/`](./examples) directory for complete examples:

- **example-api.json** - Complete API specification with all SpecForge extensions

### Real-World Usage Examples

#### Permission Checker

```typescript
class PermissionChecker {
  constructor(
    private userPermissions: string[],
    private userRoles: string[]
  ) {}

  canAccess(operation: ExtendedOperation): boolean {
    const required = permissionFlagsHandler.getRequiredPermissions(operation);
    const roles = permissionFlagsHandler.getRequiredRoles(operation);

    const hasPermissions = required.every(p => 
      this.userPermissions.includes(p)
    );
    const hasRole = roles.length === 0 || 
      roles.some(r => this.userRoles.includes(r));

    return hasPermissions && hasRole;
  }
}
```

#### Route Map Builder

```typescript
function buildRouteMap(spec: any) {
  const parser = createParser();
  parser.parseObject(spec);
  const operations = parser.getAllOperations();
  
  const routes = new Map();
  
  operations.forEach(({ path, method, operation }) => {
    routes.set(`${method}:${path}`, operation);
    
    // Add aliases
    const aliases = routeAliasHandler.getAliases(operation);
    aliases.forEach(alias => {
      routes.set(`${method}:${alias}`, operation);
    });
  });
  
  return routes;
}
```

## 🏗️ Project Structure

```
spec-forge/
├── src/
│   ├── parser/           # OpenAPI parser
│   ├── extensions/       # Extension handlers
│   ├── types/           # TypeScript definitions
│   ├── components/      # React components
│   ├── pages/          # Documentation pages
│   └── css/            # Styles
├── docs/               # Documentation content
│   ├── core-concepts/  # Core concepts docs
│   └── extensions/     # Extension docs
├── examples/           # Example specifications
├── static/            # Static assets
└── blog/             # Blog posts

```

## 🛠️ Development

### Setup

```bash
# Clone the repository
git clone https://github.com/gvieiragoulart/spec-forge.git
cd spec-forge

# Install dependencies
npm install

# Start development server
npm start
```

### Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm run serve` - Serve production build
- `npm run typecheck` - Run TypeScript type checking
- `npm run clear` - Clear Docusaurus cache

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Docusaurus](https://docusaurus.io/)
- Follows [OpenAPI v3 Specification](https://swagger.io/specification/)
- Inspired by the need for better API documentation and authorization clarity

## 📞 Support

- 📫 Issues: [GitHub Issues](https://github.com/gvieiragoulart/spec-forge/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/gvieiragoulart/spec-forge/discussions)

## 🗺️ Roadmap

- [ ] CLI tool for validation and generation
- [ ] Visual API explorer
- [ ] Integration with popular API gateways
- [ ] Plugin system for custom extensions
- [ ] OpenAPI v3.1 support
- [ ] Import/export to other formats

---

Made with ❤️ by [Guilherme Vieira Goulart](https://github.com/gvieiragoulart)
