import { ClaimType } from "@medusajs/utils"
import { z } from "zod"
import {
  createFindParams,
  createOperatorMap,
  createSelectParams,
} from "../../utils/validators"

export const AdminGetOrdersOrderParams = createSelectParams().merge(
  z.object({
    id: z.union([z.string(), z.array(z.string())]).optional(),
    status: z.union([z.string(), z.array(z.string())]).optional(),
    created_at: createOperatorMap().optional(),
    updated_at: createOperatorMap().optional(),
    deleted_at: createOperatorMap().optional(),
  })
)

export type AdminGetOrdersOrderParamsType = z.infer<
  typeof AdminGetOrdersOrderParams
>

/**
 * Parameters used to filter and configure the pagination of the retrieved order.
 */
export const AdminGetOrdersParams = createFindParams({
  limit: 15,
  offset: 0,
}).merge(
  z.object({
    id: z.union([z.string(), z.array(z.string())]).optional(),
    status: z.union([z.string(), z.array(z.string())]).optional(),
    created_at: createOperatorMap().optional(),
    updated_at: createOperatorMap().optional(),
    deleted_at: createOperatorMap().optional(),
  })
)

export type AdminGetOrdersParamsType = z.infer<typeof AdminGetOrdersParams>

const ItemSchema = z.object({
  id: z.string(),
  quantity: z.number().min(1),
  reason_id: z.string().nullish(),
  note: z.string().optional(),
})

export const AdminPostReturnsReqSchema = z.object({
  order_id: z.string(),
  location_id: z.string().optional(),
  description: z.string().optional(),
  internal_note: z.string().optional(),
  no_notification: z.boolean().optional(),
  metadata: z.record(z.unknown()).nullish(),
})
export type AdminPostReturnsReqSchemaType = z.infer<
  typeof AdminPostReturnsReqSchema
>

export const AdminPostOrderClaimsReqSchema = z.object({
  type: z.nativeEnum(ClaimType),
  order_id: z.string(),
  description: z.string().optional(),
  internal_note: z.string().optional(),
  metadata: z.record(z.unknown()).nullish(),
})
export type AdminPostOrderClaimsReqSchemaType = z.infer<
  typeof AdminPostOrderClaimsReqSchema
>

export const AdminPostOrderExchangesReqSchema = z.object({
  order_id: z.string(),
  description: z.string().optional(),
  internal_note: z.string().optional(),
  metadata: z.record(z.unknown()).nullish(),
})
export type AdminPostOrderExchangesReqSchemaType = z.infer<
  typeof AdminPostOrderExchangesReqSchema
>

export const AdminPostReceiveReturnsReqSchema = z.object({
  return_id: z.string(),
  items: z.array(ItemSchema),
  internal_note: z.string().nullish(),
})
export type AdminPostReceiveReturnsReqSchemaType = z.infer<
  typeof AdminPostReceiveReturnsReqSchema
>

export const AdminPostCancelReturnReqSchema = z.object({
  return_id: z.string(),
  no_notification: z.boolean().optional(),
  internal_note: z.string().nullish(),
})
export type AdminPostCancelReturnReqSchemaType = z.infer<
  typeof AdminPostReceiveReturnsReqSchema
>

export const AdminPostReturnsShippingReqSchema = z.object({
  shipping_option_id: z.string(),
  custom_price: z.number().optional(),
  description: z.string().optional(),
  internal_note: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
})

export type AdminPostReturnsShippingReqSchemaType = z.infer<
  typeof AdminPostReturnsShippingReqSchema
>

export const AdminPostReturnsRequestItemsReqSchema = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      quantity: z.number(),
      description: z.string().optional(),
      internal_note: z.string().optional(),
      metadata: z.record(z.unknown()).optional(),
    })
  ),
})

export type AdminPostReturnsRequestItemsReqSchemaType = z.infer<
  typeof AdminPostReturnsRequestItemsReqSchema
>

export const AdminPostReturnsConfirmRequestReqSchema = z.object({
  no_notification: z.boolean().optional(),
})

export type AdminPostReturnsConfirmRequestReqSchemaType = z.infer<
  typeof AdminPostReturnsConfirmRequestReqSchema
>
