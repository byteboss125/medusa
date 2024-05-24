import { cancelFulfillmentWorkflow } from "@medusajs/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../types/routing"
import { refetchFulfillment } from "../../helpers"
import { AdminCancelFulfillmentType } from "../../validators"

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminCancelFulfillmentType>,
  res: MedusaResponse
) => {
  const { id } = req.params
  await cancelFulfillmentWorkflow(req.scope).run({
    input: { id },
  })

  const fulfillment = await refetchFulfillment(
    id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  res.status(200).json({ fulfillment })
}
