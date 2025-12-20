import { Operation, PathItem } from './openapi';

/**
 * SpecForge Extensions - Custom x-* fields for OpenAPI specs
 */

/**
 * Route alias extension - allows defining alternative paths for the same endpoint
 */
export interface RouteAliasExtension {
  'x-route-aliases'?: string[];
}

/**
 * Custom tags extension - allows categorization beyond standard OpenAPI tags
 */
export interface CustomTagsExtension {
  'x-custom-tags'?: CustomTag[];
}

export interface CustomTag {
  name: string;
  category?: string;
  color?: string;
  icon?: string;
  description?: string;
}

/**
 * Permission flags extension - defines required permissions for operations
 */
export interface PermissionFlagsExtension {
  'x-permissions'?: PermissionFlags;
}

export interface PermissionFlags {
  required?: string[];
  optional?: string[];
  roles?: string[];
  scopes?: string[];
}

/**
 * Extended types that include SpecForge custom extensions
 */
export type ExtendedOperation = Operation & 
  RouteAliasExtension & 
  CustomTagsExtension & 
  PermissionFlagsExtension;

export type ExtendedPathItem = PathItem & {
  get?: ExtendedOperation;
  put?: ExtendedOperation;
  post?: ExtendedOperation;
  delete?: ExtendedOperation;
  options?: ExtendedOperation;
  head?: ExtendedOperation;
  patch?: ExtendedOperation;
  trace?: ExtendedOperation;
};

/**
 * Metadata extension for the entire spec
 */
export interface SpecMetadataExtension {
  'x-spec-forge'?: {
    version: string;
    generator?: string;
    generatedAt?: string;
    features?: string[];
  };
}
