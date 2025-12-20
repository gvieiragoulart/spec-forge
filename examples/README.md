# SpecForge Example Usage

This directory contains example usage of SpecForge.

## Example API Specification

See `example-api.json` for a complete OpenAPI v3 specification with all SpecForge extensions:

- **Route Aliases** (`x-route-aliases`) - Multiple paths for the same endpoint
- **Custom Tags** (`x-custom-tags`) - Rich categorization with colors and icons
- **Permission Flags** (`x-permissions`) - Required permissions, roles, and scopes

## Using the Example

### Parse the Example Spec

```typescript
import { createParser } from 'spec-forge';
import exampleSpec from './example-api.json';

const parser = createParser();
parser.parseObject(exampleSpec);

console.log(`API: ${parser.getInfo().title}`);
console.log(`Operations: ${parser.getAllOperations().length}`);
```

### Access Extensions

```typescript
import { routeAliasHandler, customTagsHandler, permissionFlagsHandler } from 'spec-forge';

const operations = parser.getAllOperations();

operations.forEach(({ path, method, operation }) => {
  // Get route aliases
  const aliases = routeAliasHandler.getAliases(operation);
  console.log(`Aliases for ${method} ${path}:`, aliases);

  // Get custom tags
  const tags = customTagsHandler.getCustomTags(operation);
  tags.forEach(tag => {
    console.log(`  Tag: ${tag.name} (${tag.category})`);
  });

  // Get permissions
  const permissions = permissionFlagsHandler.getRequiredPermissions(operation);
  const roles = permissionFlagsHandler.getRequiredRoles(operation);
  console.log(`  Permissions:`, permissions);
  console.log(`  Roles:`, roles);
});
```

## Key Features Demonstrated

### 1. Route Aliases
The example shows how `/users` has aliases `/accounts` and `/members`, allowing the same endpoint to be accessed via multiple paths.

### 2. Custom Tags
Operations are tagged with:
- **User Management** (admin category)
- **Read-Only / Write Operation / Destructive** (operation-type category)

Each tag includes a color and icon for visual representation.

### 3. Permission Flags
Each operation specifies:
- **Required permissions** - Must-have permissions
- **Optional permissions** - Enhance functionality
- **Roles** - User roles allowed
- **Scopes** - OAuth scopes required

## Running Examples

To see the example in action, you can create a Node.js script:

```bash
npm install spec-forge
node examples/usage-example.js
```

Or use TypeScript:

```bash
npm install spec-forge
npx ts-node examples/usage-example.ts
```

## Learn More

- [Documentation](../docs/intro.md)
- [Route Aliases Guide](../docs/extensions/route-aliases.md)
- [Custom Tags Guide](../docs/extensions/custom-tags.md)
- [Permission Flags Guide](../docs/extensions/permission-flags.md)
