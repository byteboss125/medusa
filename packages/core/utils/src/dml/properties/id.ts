import { BaseProperty } from "./base"

/**
 * The Id property defines a unique identifier for the schema.
 * Most of the times it will be the primary as well.
 */
export class IdProperty extends BaseProperty<string> {
  protected dataType: {
    name: "id"
    options: {
      primaryKey: boolean
      prefix?: string
    }
  }

  constructor(options?: { 
    /**
     * Whether the ID is the data model's primary key.
     * 
     * @defaultValue true
     */
    primaryKey?: boolean
    /**
     * By default, Medusa shortens the data model's name and uses it as the 
     * prefix of all IDs. For example, `cm_123`.
     * 
     * Use this option to specify the prefix to use instead.
     */
    prefix?: string
  }) {
    super()
    this.dataType = {
      name: "id",
      options: { primaryKey: true, ...options },
    }
  }

  primaryKey(decision: boolean) {
    this.dataType.options.primaryKey = decision

    return this
  }
}
