import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IPromotionModuleService } from "@medusajs/types"
import { MedusaRequest, MedusaResponse } from "../../../types/routing"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const promotionModuleService: IPromotionModuleService = req.scope.resolve(
    ModuleRegistrationName.PROMOTION
  )

  const [promotions, count] = await promotionModuleService.listAndCount(
    req.filterableFields,
    req.listConfig
  )

  const { limit, offset } = req.validatedQuery

  res.json({
    count,
    promotions,
    offset,
    limit,
  })
}
