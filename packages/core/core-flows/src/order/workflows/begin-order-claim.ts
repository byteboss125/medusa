import { OrderChangeDTO, OrderDTO, OrderWorkflow } from "@medusajs/types"
import {
  WorkflowData,
  createStep,
  createWorkflow,
  transform,
} from "@medusajs/workflows-sdk"
import { useRemoteQueryStep } from "../../common"
import { createOrderClaimsStep } from "../steps/create-claims"
import { createOrderChangeStep } from "../steps/create-order-change"
import { throwIfOrderIsCancelled } from "../utils/order-validation"

const validationStep = createStep(
  "begin-claim-order-validation",
  async function ({ order }: { order: OrderDTO }) {
    throwIfOrderIsCancelled({ order })
  }
)

export const beginClaimOrderWorkflowId = "begin-claim-order"
export const beginClaimOrderWorkflow = createWorkflow(
  beginClaimOrderWorkflowId,
  function (
    input: WorkflowData<OrderWorkflow.BeginOrderClaimWorkflowInput>
  ): WorkflowData<OrderChangeDTO> {
    const order: OrderDTO = useRemoteQueryStep({
      entry_point: "orders",
      fields: ["id", "status"],
      variables: { id: input.order_id },
      list: false,
      throw_if_key_not_found: true,
    })

    validationStep({ order })

    const created = createOrderClaimsStep([
      {
        type: input.type,
        order_id: input.order_id,
        metadata: input.metadata,
      },
    ])

    const orderChangeInput = transform(
      { created, input },
      ({ created, input }) => {
        return {
          change_type: "claim" as const,
          order_id: input.order_id,
          claim_id: created[0].id,
          created_by: input.created_by,
          description: input.description,
          internal_note: input.internal_note,
        }
      }
    )
    return createOrderChangeStep(orderChangeInput)
  }
)
