import {
  createPsqlIndexStatementHelper,
  generateEntityId,
} from "@medusajs/utils"
import {
  BeforeCreate,
  Cascade,
  Entity,
  ManyToOne,
  OnInit,
} from "@mikro-orm/core"
import AdjustmentLine from "./adjustment-line"
import LineItem from "./line-item"

const ItemIdIndex = createPsqlIndexStatementHelper({
  tableName: "order_line_item_adjustment",
  columns: "item_id",
})

@Entity({ tableName: "order_line_item_adjustment" })
export default class LineItemAdjustment extends AdjustmentLine {
  @ManyToOne(() => LineItem, {
    persist: false,
  })
  item: LineItem

  @ManyToOne({
    entity: () => LineItem,
    columnType: "text",
    fieldName: "item_id",
    cascade: [Cascade.REMOVE],
    mapToPk: true,
  })
  @ItemIdIndex.MikroORMIndex()
  item_id: string

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "ordliadj")
    this.item_id ??= this.item?.id
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "ordliadj")
    this.item_id ??= this.item?.id
  }
}
