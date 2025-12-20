---
sidebar_position: 2
---

# Parser

The SpecForge parser validates and processes OpenAPI v3 specifications, providing a clean API for accessing spec data and extensions.

## Creating a Parser

```typescript
import { createParser, OpenAPIParser } from 'spec-forge';

// Using factory function
const parser = createParser();

// Or instantiate directly
const parser = new OpenAPIParser();
```

## Parsing Specifications

### From JSON String

```typescript
import fs from 'fs';

const specString = fs.readFileSync('./api-spec.json', 'utf-8');
const spec = parser.parse(specString);
```

### From Object

```typescript
import apiSpec from './api-spec.json';

const spec = parser.parseObject(apiSpec);
```

## Validation

The parser automatically validates:

- ✅ OpenAPI version (must be 3.x)
- ✅ Required fields (openapi, info, paths)
- ✅ Info object structure (title, version)
- ✅ JSON format validity

```typescript
try {
  parser.parse(specString);
  console.log('✅ Specification is valid');
} catch (error) {
  console.error('❌ Validation failed:', error.message);
}
```

## Accessing Spec Data

### Get Complete Spec

```typescript
const spec = parser.getSpec();
console.log(spec.info.title);
console.log(spec.info.version);
```

### Get Spec Info

```typescript
const info = parser.getInfo();
console.log(`API: ${info.title} v${info.version}`);
console.log(`Description: ${info.description}`);
```

### Get OpenAPI Version

```typescript
const version = parser.getVersion();
console.log(`OpenAPI version: ${version}`);
```

## Working with Paths

### Get All Paths

```typescript
const paths = parser.getPaths();

for (const [path, pathItem] of Object.entries(paths)) {
  console.log(`Path: ${path}`);
}
```

### Get Specific Path

```typescript
const userPath = parser.getPath('/users');

if (userPath) {
  console.log('GET:', userPath.get?.summary);
  console.log('POST:', userPath.post?.summary);
}
```

### Get All Operations

```typescript
const operations = parser.getAllOperations();

operations.forEach(({ path, method, operation }) => {
  console.log(`${method.toUpperCase()} ${path}`);
  console.log(`  Summary: ${operation.summary}`);
  console.log(`  Operation ID: ${operation.operationId}`);
});
```

## Working with Extensions

The parser returns `ExtendedOperation` types that include all SpecForge extensions:

```typescript
import { routeAliasHandler, customTagsHandler, permissionFlagsHandler } from 'spec-forge';

const operations = parser.getAllOperations();

operations.forEach(({ path, method, operation }) => {
  // Route aliases
  const aliases = routeAliasHandler.getAliases(operation);
  if (aliases.length > 0) {
    console.log(`  Aliases: ${aliases.join(', ')}`);
  }

  // Custom tags
  const customTags = customTagsHandler.getCustomTags(operation);
  customTags.forEach(tag => {
    console.log(`  Tag: ${tag.name} (${tag.category})`);
  });

  // Permissions
  const permissions = permissionFlagsHandler.getRequiredPermissions(operation);
  if (permissions.length > 0) {
    console.log(`  Required Permissions: ${permissions.join(', ')}`);
  }

  const roles = permissionFlagsHandler.getRequiredRoles(operation);
  if (roles.length > 0) {
    console.log(`  Required Roles: ${roles.join(', ')}`);
  }
});
```

## Complete Example

```typescript
import { createParser, routeAliasHandler, customTagsHandler, permissionFlagsHandler } from 'spec-forge';
import apiSpec from './examples/example-api.json';

// Parse the specification
const parser = createParser();
parser.parseObject(apiSpec);

// Display API info
const info = parser.getInfo();
console.log(`\n📚 API: ${info.title} v${info.version}`);
console.log(`📝 ${info.description}\n`);

// Analyze all operations
const operations = parser.getAllOperations();
console.log(`🔍 Found ${operations.length} operations:\n`);

operations.forEach(({ path, method, operation }) => {
  console.log(`${method.toUpperCase()} ${path}`);
  console.log(`  📄 ${operation.summary}`);

  // Show aliases
  const aliases = routeAliasHandler.getAliases(operation);
  if (aliases.length > 0) {
    console.log(`  🔗 Aliases: ${aliases.join(', ')}`);
  }

  // Show custom tags
  const tags = customTagsHandler.getCustomTags(operation);
  if (tags.length > 0) {
    tags.forEach(tag => {
      console.log(`  🏷️  ${tag.name} [${tag.category}]`);
    });
  }

  // Show permissions
  const permissions = permissionFlagsHandler.getPermissions(operation);
  if (permissions) {
    if (permissions.required) {
      console.log(`  🔐 Permissions: ${permissions.required.join(', ')}`);
    }
    if (permissions.roles) {
      console.log(`  👤 Roles: ${permissions.roles.join(', ')}`);
    }
  }

  console.log('');
});
```

## Error Handling

```typescript
try {
  const spec = parser.parse(specString);
  console.log('✅ Parsed successfully');
} catch (error) {
  if (error.message.includes('Unsupported OpenAPI version')) {
    console.error('❌ Wrong OpenAPI version. Use 3.x');
  } else if (error.message.includes('Missing required field')) {
    console.error('❌ Specification is incomplete');
  } else {
    console.error('❌ Failed to parse:', error.message);
  }
}
```

## Next Steps

- Learn about [Usage Examples](./usage)
- Explore [Route Aliases](../extensions/route-aliases)
- Discover [Custom Tags](../extensions/custom-tags)
- Master [Permission Flags](../extensions/permission-flags)
