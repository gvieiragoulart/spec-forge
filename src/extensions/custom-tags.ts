import { ExtendedOperation, CustomTag } from '../types/extensions';

/**
 * Custom Tags Handler - Manages custom categorization tags for operations
 */
export class CustomTagsHandler {
  /**
   * Extract custom tags from an operation
   */
  getCustomTags(operation: ExtendedOperation): CustomTag[] {
    return operation['x-custom-tags'] || [];
  }

  /**
   * Check if an operation has custom tags
   */
  hasCustomTags(operation: ExtendedOperation): boolean {
    return this.getCustomTags(operation).length > 0;
  }

  /**
   * Get custom tags by category
   */
  getTagsByCategory(operation: ExtendedOperation, category: string): CustomTag[] {
    return this.getCustomTags(operation).filter(tag => tag.category === category);
  }

  /**
   * Add a custom tag to an operation
   */
  addCustomTag(operation: ExtendedOperation, tag: CustomTag): ExtendedOperation {
    const tags = this.getCustomTags(operation);
    // Check if tag with same name already exists
    if (tags.some(t => t.name === tag.name)) {
      return operation;
    }
    return {
      ...operation,
      'x-custom-tags': [...tags, tag],
    };
  }

  /**
   * Remove a custom tag from an operation
   */
  removeCustomTag(operation: ExtendedOperation, tagName: string): ExtendedOperation {
    const tags = this.getCustomTags(operation);
    return {
      ...operation,
      'x-custom-tags': tags.filter(t => t.name !== tagName),
    };
  }

  /**
   * Get all unique categories from custom tags
   */
  getAllCategories(operation: ExtendedOperation): string[] {
    const tags = this.getCustomTags(operation);
    const categories = tags
      .map(tag => tag.category)
      .filter((category): category is string => category !== undefined);
    return Array.from(new Set(categories));
  }

  /**
   * Validate custom tag structure
   */
  validateCustomTag(tag: CustomTag): boolean {
    return (
      typeof tag.name === 'string' &&
      tag.name.length > 0 &&
      (tag.category === undefined || typeof tag.category === 'string') &&
      (tag.color === undefined || typeof tag.color === 'string') &&
      (tag.icon === undefined || typeof tag.icon === 'string') &&
      (tag.description === undefined || typeof tag.description === 'string')
    );
  }
}

export const customTagsHandler = new CustomTagsHandler();
