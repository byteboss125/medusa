import {
  OrderChangeActionDTO,
  OrderChangeDTO,
  OrderDTO,
  OrderWorkflow,
  ReturnDTO,
} from "@medusajs/types"
import { ChangeActionType } from "@medusajs/utils"
import {
  WorkflowData,
  createStep,
  createWorkflow,
  transform,
} from "@medusajs/workflows-sdk"
import { useRemoteQueryStep } from "../../common"
import { createOrderChangeActionsStep } from "../steps/create-order-change-actions"
import {
  throwIfItemsDoesNotExistsInOrder,
  throwIfOrderChangeIsNotActive,
  throwIfOrderIsCancelled,
  throwIfReturnIsCancelled,
} from "../utils/order-validation"

const validationStep = createStep(
  "request-item-return-validation",
  async function ({
    order,
    orderChange,
    orderReturn,
    items,
  }: {
    order: OrderDTO
    orderReturn: ReturnDTO
    orderChange: OrderChangeDTO
    items: OrderWorkflow.RequestItemReturnWorkflowInput["items"]
  }) {
    throwIfOrderIsCancelled({ order })
    throwIfReturnIsCancelled({ orderReturn })
    throwIfOrderChangeIsNotActive({ orderChange })
    throwIfItemsDoesNotExistsInOrder({ order, inputItems: items })
  }
)

export const requestItemReturnWorkflowId = "request-item-return"
export const requestItemReturnWorkflow = createWorkflow(
  requestItemReturnWorkflowId,
  function (
    input: WorkflowData<OrderWorkflow.RequestItemReturnWorkflowInput>
  ): WorkflowData<OrderChangeActionDTO[]> {
    const orderReturn: ReturnDTO = useRemoteQueryStep({
      entry_point: "return",
      fields: ["id", "status", "refund_amount", "order_id", "items.*"],
      variables: { id: input.return_id },
      list: false,
      throw_if_key_not_found: true,
    })

    const order: OrderDTO = useRemoteQueryStep({
      entry_point: "orders",
      fields: ["id", "status", "items.*"],
      variables: { id: orderReturn.order_id },
      list: false,
      throw_if_key_not_found: true,
    }).config({ name: "order-query" })

    const orderChange: OrderChangeDTO = useRemoteQueryStep({
      entry_point: "order_change",
      fields: ["id", "status"],
      variables: { order_id: orderReturn.order_id },
      list: false,
    }).config({ name: "order-change-query" })

    validationStep({ order, items: input.items, orderReturn, orderChange })

    const orderChangeActionInput = transform(
      { order, orderChange, orderReturn, items: input.items },
      ({ order, orderChange, orderReturn, items }) => {
        return items.map((item) => ({
          order_change_id: orderChange.id,
          order_id: order.id,
          return_id: orderReturn.id,
          version: orderChange.version,
          action: ChangeActionType.RETURN_ITEM,
          internal_note: item.internal_note,
          reference: "return",
          reference_id: orderReturn.id,
          details: {
            reference_id: item.id,
            return_id: orderReturn.id,
            quantity: item.quantity,
            metadata: item.metadata,
          },
        }))
      }
    )

    return createOrderChangeActionsStep(orderChangeActionInput)
  }
)
