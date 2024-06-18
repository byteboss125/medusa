import { DmlEntity } from "./entity"

/**
 * The supported data types
 */
export type KnownDataTypes =
  | "text"
  | "boolean"
  | "enum"
  | "number"
  | "dateTime"
  | "json"

/**
 * List of available relationships at DML level
 */
export type RelationshipTypes =
  | "hasOne"
  | "hasMany"
  | "belongsTo"
  | "manyToMany"

/**
 * Any field that contains "nullable" and "optional" properties
 * in their metadata are qualified as maybe fields.
 *
 * This allows us to wrap them inside "NullableModifier" and
 * "OptionalModifier" classes.
 */
export type MaybeFieldMetadata = {
  nullable: boolean
}

/**
 * The meta-data returned by the schema parse method
 */
export type SchemaMetadata = MaybeFieldMetadata & {
  fieldName: string
  defaultValue?: any
  dataType: {
    name: KnownDataTypes
    options?: Record<string, any>
  }
  indexes: {
    name?: string
    type: "index" | "unique"
  }[]
  relationships: RelationshipMetadata[]
}

/**
 * Definition of a schema type. It should have a parse
 * method to get the metadata and a type-only property
 * to get its static type
 */
export type SchemaType<T> = {
  $dataType: T
  parse(fieldName: string): SchemaMetadata
}

/**
 * Options accepted by all the relationships
 */
export type RelationshipOptions = {
  mappedBy?: string
}

/**
 * The meta-data returned by the relationship parse
 * method
 */
export type RelationshipMetadata = MaybeFieldMetadata & {
  name: string
  type: RelationshipTypes
  entity: unknown
  mappedBy?: string
}

/**
 * Definition of a relationship type. It should have a parse
 * method to get the metadata and a type-only property
 * to get its static type
 */
export type RelationshipType<T> = {
  $dataType: T
  type: RelationshipTypes
  parse(relationshipName: string): RelationshipMetadata
}

/**
 * A type-only representation of a MikroORM entity. Since we generate
 * entities on the fly, we need a way to represent a type-safe
 * constructor and its instance properties.
 */
export interface EntityConstructor<Props> extends Function {
  new (): Props
}

/**
 * Helper to infer the schema type of a DmlEntity
 */
export type Infer<T> = T extends DmlEntity<infer Schema>
  ? EntityConstructor<{
      [K in keyof Schema]: Schema[K]["$dataType"] extends () => infer R
        ? Infer<R>
        : Schema[K]["$dataType"] extends (() => infer R) | null
        ? Infer<R> | null
        : Schema[K]["$dataType"]
    }>
  : never

/**
 * Extracts names of relationships from a schema
 */
export type ExtractEntityRelations<
  Schema extends Record<string, any>,
  OfType extends RelationshipTypes
> = {
  [K in keyof Schema & string]: Schema[K] extends RelationshipType<any>
    ? Schema[K] extends { type: OfType }
      ? K
      : never
    : never
}[keyof Schema & string][]

/**
 * The actions to cascade from a given entity to its
 * relationship.
 */
export type EntityCascades<Relationships> = {
  delete?: Relationships
}
