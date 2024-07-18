import { beginReturnOrderWorkflow } from "@medusajs/core-flows"
import {
  ContainerRegistrationKeys,
  ModuleRegistrationName,
  promiseAll,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../types/routing"
import { AdminPostReturnsReqSchemaType } from "./validators"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "returns",
    variables: {
      filters: {
        ...req.filterableFields,
      },
      ...req.remoteQueryConfig.pagination,
    },
    fields: req.remoteQueryConfig.fields,
  })

  const { rows: returns, metadata } = await remoteQuery(queryObject)

  res.json({
    returns,
    count: metadata.count,
    offset: metadata.skip,
    limit: metadata.take,
  })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminPostReturnsReqSchemaType>,
  res: MedusaResponse
) => {
  const input = req.validatedBody as AdminPostReturnsReqSchemaType
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)
  const orderModuleService = req.scope.resolve(ModuleRegistrationName.ORDER)

  const workflow = beginReturnOrderWorkflow(req.scope)
  const { result } = await workflow.run({
    input,
  })

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "return",
    variables: {
      id: result.return_id,
      filters: {
        ...req.filterableFields,
      },
    },
    fields: req.remoteQueryConfig.fields,
  })

  const [order, orderReturn] = await promiseAll([
    orderModuleService.retrieveOrder(result.order_id),
    remoteQuery(queryObject),
  ])

  res.json({
    order,
    return: orderReturn[0],
  })
}
