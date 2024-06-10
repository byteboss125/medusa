import { expectTypeOf } from "expect-type"
import { HasOne } from "../relations/has_one"
import { TextSchema } from "../schema/text"

describe("HasOne relationship", () => {
  test("define hasOne relationship", () => {
    const user = {
      username: new TextSchema(),
    }

    const entityRef = () => user
    const relationship = new HasOne(entityRef, {})

    expectTypeOf(relationship["$dataType"]).toEqualTypeOf<() => typeof user>()
    expect(relationship.parse("user")).toEqual({
      name: "user",
      type: "hasOne",
      entity: entityRef,
      options: {},
    })
  })
})
