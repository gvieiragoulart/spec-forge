---
sidebar_position: 2
---

# Custom Tags

Custom tags provide rich categorization for API operations with metadata like colors, icons, and hierarchical categories.

## Overview

The `x-custom-tags` extension goes beyond standard OpenAPI tags by adding:

- **Categories**: Group tags hierarchically
- **Colors**: Visual identification with hex colors
- **Icons**: Icon identifiers for UI representation
- **Descriptions**: Detailed tag explanations

## Specification

Add `x-custom-tags` to any operation:

```json
{
  "paths": {
    "/users": {
      "get": {
        "summary": "List users",
        "x-custom-tags": [
          {
            "name": "User Management",
            "category": "admin",
            "color": "#2563eb",
            "icon": "users",
            "description": "Operations for managing users"
          },
          {
            "name": "Read-Only",
            "category": "operation-type",
            "color": "#16a34a",
            "icon": "eye"
          }
        ],
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
interface CustomTag {
  name: string;
  category?: string;
  color?: string;
  icon?: string;
  description?: string;
}

interface CustomTagsExtension {
  'x-custom-tags'?: CustomTag[];
}
```

## Usage

### CustomTagsHandler

The `CustomTagsHandler` provides methods for working with custom tags:

```typescript
import { customTagsHandler } from 'spec-forge';

// Get all custom tags
const tags = customTagsHandler.getCustomTags(operation);

// Check if operation has custom tags
const hasTags = customTagsHandler.hasCustomTags(operation);

// Get tags by category
const adminTags = customTagsHandler.getTagsByCategory(operation, 'admin');

// Get all categories
const categories = customTagsHandler.getAllCategories(operation);

// Validate tag structure
const isValid = customTagsHandler.validateCustomTag({
  name: "Admin",
  category: "security"
});
```

### Adding Tags

```typescript
// Add a custom tag
const newTag = {
  name: "Premium Feature",
  category: "billing",
  color: "#f59e0b",
  icon: "star"
};

const updatedOperation = customTagsHandler.addCustomTag(operation, newTag);
```

### Removing Tags

```typescript
// Remove a tag by name
const updatedOperation = customTagsHandler.removeCustomTag(operation, "Premium Feature");
```

## Real-World Examples

### Example 1: Operation Types

Categorize operations by type:

```json
{
  "paths": {
    "/users": {
      "get": {
        "x-custom-tags": [
          {
            "name": "Read-Only",
            "category": "operation-type",
            "color": "#16a34a",
            "icon": "eye"
          }
        ]
      },
      "post": {
        "x-custom-tags": [
          {
            "name": "Write Operation",
            "category": "operation-type",
            "color": "#dc2626",
            "icon": "edit"
          }
        ]
      },
      "delete": {
        "x-custom-tags": [
          {
            "name": "Destructive",
            "category": "operation-type",
            "color": "#991b1b",
            "icon": "trash"
          }
        ]
      }
    }
  }
}
```

### Example 2: Feature Flags

Mark operations by feature:

```json
{
  "x-custom-tags": [
    {
      "name": "Beta Feature",
      "category": "release-stage",
      "color": "#f59e0b",
      "icon": "flask",
      "description": "This endpoint is in beta"
    },
    {
      "name": "Premium",
      "category": "billing",
      "color": "#8b5cf6",
      "icon": "star",
      "description": "Requires premium subscription"
    }
  ]
}
```

### Example 3: Domain Organization

Organize by business domain:

```json
{
  "x-custom-tags": [
    {
      "name": "User Management",
      "category": "domain",
      "color": "#2563eb",
      "icon": "users",
      "description": "User and account management"
    },
    {
      "name": "Payment Processing",
      "category": "domain",
      "color": "#059669",
      "icon": "credit-card",
      "description": "Billing and payment operations"
    },
    {
      "name": "Analytics",
      "category": "domain",
      "color": "#7c3aed",
      "icon": "chart",
      "description": "Analytics and reporting"
    }
  ]
}
```

### Example 4: Security Classification

Tag operations by security level:

```json
{
  "x-custom-tags": [
    {
      "name": "Public",
      "category": "security",
      "color": "#16a34a",
      "icon": "globe",
      "description": "Publicly accessible"
    },
    {
      "name": "Authenticated",
      "category": "security",
      "color": "#f59e0b",
      "icon": "lock",
      "description": "Requires authentication"
    },
    {
      "name": "Admin Only",
      "category": "security",
      "color": "#dc2626",
      "icon": "shield",
      "description": "Administrator access required"
    }
  ]
}
```

## Filtering by Tags

Filter operations based on custom tags:

```typescript
import { createParser, customTagsHandler } from 'spec-forge';

function getOperationsByTag(spec: any, tagName: string) {
  const parser = createParser();
  parser.parseObject(spec);
  const operations = parser.getAllOperations();

  return operations.filter(({ operation }) => {
    const tags = customTagsHandler.getCustomTags(operation);
    return tags.some(tag => tag.name === tagName);
  });
}

function getOperationsByCategory(spec: any, category: string) {
  const parser = createParser();
  parser.parseObject(spec);
  const operations = parser.getAllOperations();

  return operations.filter(({ operation }) => {
    const tags = customTagsHandler.getCustomTags(operation);
    return tags.some(tag => tag.category === category);
  });
}

// Usage
const adminOps = getOperationsByCategory(apiSpec, 'admin');
const betaOps = getOperationsByTag(apiSpec, 'Beta Feature');
```

## Generating Tag Documentation

Create documentation grouped by tags:

```typescript
function generateTagDocs(spec: any) {
  const parser = createParser();
  parser.parseObject(spec);
  const operations = parser.getAllOperations();

  const tagGroups = new Map<string, any[]>();

  operations.forEach(({ path, method, operation }) => {
    const tags = customTagsHandler.getCustomTags(operation);
    
    tags.forEach(tag => {
      if (!tagGroups.has(tag.name)) {
        tagGroups.set(tag.name, []);
      }
      tagGroups.get(tag.name).push({ path, method, operation, tag });
    });
  });

  // Generate documentation
  tagGroups.forEach((ops, tagName) => {
    const tag = ops[0].tag;
    console.log(`\n## ${tagName}`);
    if (tag.description) {
      console.log(tag.description);
    }
    console.log('');
    
    ops.forEach(({ path, method, operation }) => {
      console.log(`- ${method.toUpperCase()} ${path}: ${operation.summary}`);
    });
  });
}
```

## Color Schemes

Recommended color schemes for common categories:

| Category | Purpose | Color | Example |
|----------|---------|-------|---------|
| Success | Read operations | `#16a34a` | 🟢 |
| Warning | Beta/Experimental | `#f59e0b` | 🟡 |
| Danger | Delete/Destructive | `#dc2626` | 🔴 |
| Info | General info | `#2563eb` | 🔵 |
| Premium | Paid features | `#8b5cf6` | 🟣 |
| Admin | Admin only | `#991b1b` | 🟤 |

## Best Practices

1. **Consistent Categories**: Use a standard set of categories across your API
2. **Meaningful Colors**: Choose colors that represent the tag's purpose
3. **Standard Icons**: Use a consistent icon set (e.g., Heroicons, FontAwesome)
4. **Clear Names**: Use descriptive, unambiguous tag names
5. **Documentation**: Always provide descriptions for important tags
6. **Don't Overdo**: Limit to 2-4 tags per operation

## Common Patterns

### Pattern 1: Multi-Dimensional Classification

```json
{
  "x-custom-tags": [
    {"name": "Users", "category": "domain"},
    {"name": "Write", "category": "operation-type"},
    {"name": "Admin", "category": "security"}
  ]
}
```

### Pattern 2: Feature Lifecycle

```json
{
  "x-custom-tags": [
    {"name": "Stable", "category": "maturity", "color": "#16a34a"},
    {"name": "Beta", "category": "maturity", "color": "#f59e0b"},
    {"name": "Deprecated", "category": "maturity", "color": "#991b1b"}
  ]
}
```

### Pattern 3: Rate Limiting

```json
{
  "x-custom-tags": [
    {
      "name": "High Rate Limit",
      "category": "rate-limiting",
      "color": "#16a34a",
      "description": "1000 requests per minute"
    }
  ]
}
```

## API Reference

### CustomTagsHandler Methods

| Method | Parameters | Returns | Description |
|--------|-----------|---------|-------------|
| `getCustomTags` | `operation` | `CustomTag[]` | Get all tags |
| `hasCustomTags` | `operation` | `boolean` | Check if has tags |
| `getTagsByCategory` | `operation, category` | `CustomTag[]` | Filter by category |
| `getAllCategories` | `operation` | `string[]` | Get unique categories |
| `addCustomTag` | `operation, tag` | `ExtendedOperation` | Add a tag |
| `removeCustomTag` | `operation, tagName` | `ExtendedOperation` | Remove a tag |
| `validateCustomTag` | `tag` | `boolean` | Validate structure |

## Next Steps

- Learn about [Permission Flags](./permission-flags)
- Explore [Route Aliases](./route-aliases)
- See [Usage Examples](../core-concepts/usage)
