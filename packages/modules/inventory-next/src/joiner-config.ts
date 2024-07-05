import { defineJoinerConfig, Modules } from "@medusajs/utils"

export const joinerConfig = defineJoinerConfig(Modules.INVENTORY, {
  alias: [
    {
      name: ["inventory_items", "inventory_item", "inventory"],
      args: {
        entity: "InventoryItem",
        methodSuffix: "InventoryItems",
      },
    },
    {
      name: [
        "reservation",
        "reservations",
        "reservation_item",
        "reservation_items",
      ],
      args: {
        entity: "ReservationItem",
        methodSuffix: "ReservationItems",
      },
    },
  ],
})
