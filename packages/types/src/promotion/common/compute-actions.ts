export type ComputeActions =
  | AddItemAdjustmentAction
  | RemoveItemAdjustmentAction
  | AddShippingMethodAdjustment
  | RemoveShippingMethodAdjustment

export interface AddItemAdjustmentAction {
  action: "addItemAdjustment"
  item_id: string
  amount: number
  code: string
  description?: string
}

export interface RemoveItemAdjustmentAction {
  action: "removeItemAdjustment"
  adjustment_id: string
  description?: string
}

export interface AddShippingMethodAdjustment {
  action: "addShippingMethodAdjustment"
  shipping_method_id: string
  amount: number
  code: string
  description?: string
}

export interface RemoveShippingMethodAdjustment {
  action: "removeShippingMethodAdjustment"
  adjustment_id: string
}

export interface ComputeActionAdjustmentLine {
  id: string
  code: string
}

export interface ComputeActionItemLine {
  id: string
  quantity: number
  unit_price: number
  adjustments?: ComputeActionAdjustmentLine[]
}

export interface ComputeActionShippingLine {
  id: string
  unit_price: number
  adjustments?: ComputeActionAdjustmentLine[]
}

export interface ComputeActionContext {
  items?: ComputeActionItemLine[]
  shipping_methods?: ComputeActionShippingLine[]
}
