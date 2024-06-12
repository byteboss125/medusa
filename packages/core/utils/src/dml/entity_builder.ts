import { DmlEntity } from "./entity"
import { TextSchema } from "./schema/text"
import { EnumSchema } from "./schema/enum"
import { JSONSchema } from "./schema/json"
import { HasOne } from "./relations/has_one"
import { HasMany } from "./relations/has_many"
import { NumberSchema } from "./schema/number"
import { BooleanSchema } from "./schema/boolean"
import { DateTimeSchema } from "./schema/date_time"
import { ManyToMany } from "./relations/many_to_many"
import { RelationshipType, SchemaType } from "./types"
import { HasOneThroughMany } from "./relations/has_one_through_many"

/**
 * Entity builder exposes the API to create an entity and define its
 * schema using the shorthand methods.
 */
export class EntityBuilder {
  /**
   * Define an entity or a model. The name should be unique across
   * all the entities.
   */
  define<
    Schema extends Record<string, SchemaType<any> | RelationshipType<any>>
  >(name: string, schema: Schema) {
    return new DmlEntity(name, schema)
  }

  /**
   * Define a text/string based column
   */
  text() {
    return new TextSchema()
  }

  /**
   * Define a boolean column
   */
  boolean() {
    return new BooleanSchema()
  }

  /**
   * Define a numeric/integer column
   */
  number() {
    return new NumberSchema()
  }

  /**
   * Define a timestampz column
   */
  dateTime() {
    return new DateTimeSchema()
  }

  /**
   * Define a JSON column to store data as a
   * JSON string
   */
  json() {
    return new JSONSchema()
  }

  /**
   * Define an enum column where only a pre-defined set
   * of values are allowed.
   */
  enum<const Values extends unknown>(values: Values[]) {
    return new EnumSchema<Values>(values)
  }

  /**
   * Has one relationship defines a relationship between two entities
   * where the owner of the relationship has exactly one instance
   * of the related entity.
   *
   * For example: A user "hasOne" profile
   *
   * You may use the "belongsTo" relationship to define the inverse
   * of the "hasOne" relationship
   */
  hasOne<T>(entityBuilder: T, options?: Record<string, any>) {
    return new HasOne<T>(entityBuilder, options || {})
  }

  /**
   * Has many relationship defines a relationship between two entities
   * where the owner of the relationship has many instance of the
   * related entity.
   *
   * For example:
   *
   * - A user "hasMany" books
   * - A user "hasMany" addresses
   */
  hasMany<T>(entityBuilder: T, options?: Record<string, any>) {
    return new HasMany<T>(entityBuilder, options || {})
  }

  /**
   * Define a hasOneThroughMany relationship between two entities.
   * @todo Remove in favor of "belongTo"
   */
  hasOneThroughMany<T>(entityBuilder: T, options?: Record<string, any>) {
    return new HasOneThroughMany<T>(entityBuilder, options || {})
  }

  /**
   * ManyToMany relationship defines a relationship between two entities
   * where the owner of the relationship has many instance of the
   * related entity via a pivot table.
   *
   * For example:
   *
   * - A user has many teams. But a team has many users as well. So this
   *   relationship requires a pivot table to establish a many to many
   *   relationship between two entities
   */
  manyToMany<T>(entityBuilder: T, options?: Record<string, any>) {
    return new ManyToMany<T>(entityBuilder, options || {})
  }
}
