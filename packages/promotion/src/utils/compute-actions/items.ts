import {
  ApplicationMethodAllocationValues,
  PromotionTypes,
} from "@medusajs/types"
import {
  ApplicationMethodAllocation,
  ApplicationMethodTargetType,
  MedusaError,
} from "@medusajs/utils"
import { areRulesValidForContext } from "../validations"

export function getComputedActionsForItems(
  promotion: PromotionTypes.PromotionDTO,
  itemApplicationContext: PromotionTypes.ComputeActionContext[ApplicationMethodTargetType.ITEMS],
  methodIdPromoValueMap: Map<string, number>,
  allocationOverride?: ApplicationMethodAllocationValues
): PromotionTypes.ComputeActions[] {
  const applicableItems: PromotionTypes.ComputeActionContext[ApplicationMethodTargetType.ITEMS] =
    []

  if (!itemApplicationContext) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `"items" should be present as an array in the context for computeActions`
    )
  }

  for (const itemContext of itemApplicationContext) {
    const isPromotionApplicableToItem = areRulesValidForContext(
      promotion?.application_method?.target_rules!,
      itemContext
    )

    if (!isPromotionApplicableToItem) {
      continue
    }

    applicableItems.push(itemContext)
  }

  return applyPromotionToItems(
    promotion,
    applicableItems,
    methodIdPromoValueMap,
    allocationOverride
  )
}

export function applyPromotionToItems(
  promotion: PromotionTypes.PromotionDTO,
  items: PromotionTypes.ComputeActionContext[ApplicationMethodTargetType.ITEMS],
  methodIdPromoValueMap: Map<string, number>,
  allocationOverride?: ApplicationMethodAllocationValues
): PromotionTypes.ComputeActions[] {
  const { application_method: applicationMethod } = promotion
  const allocation = applicationMethod?.allocation!
  const computedActions: PromotionTypes.ComputeActions[] = []

  if (
    [allocation, allocationOverride].includes(ApplicationMethodAllocation.EACH)
  ) {
    for (const method of items!) {
      const appliedPromoValue = methodIdPromoValueMap.get(method.id) || 0
      const promotionValue = parseFloat(applicationMethod!.value!)
      const applicableTotal =
        method.unit_price *
          Math.min(method.quantity, applicationMethod?.max_quantity!) -
        appliedPromoValue

      const amount = Math.min(promotionValue, applicableTotal)

      if (amount <= 0) {
        continue
      }

      methodIdPromoValueMap.set(method.id, appliedPromoValue + amount)

      computedActions.push({
        action: "addItemAdjustment",
        item_id: method.id,
        amount,
        code: promotion.code!,
      })
    }
  }

  if (
    [allocation, allocationOverride].includes(
      ApplicationMethodAllocation.ACROSS
    )
  ) {
    const totalApplicableValue = items!.reduce((acc, method) => {
      const appliedPromoValue = methodIdPromoValueMap.get(method.id) || 0
      return (
        acc +
        method.unit_price *
          Math.min(method.quantity, applicationMethod?.max_quantity!) -
        appliedPromoValue
      )
    }, 0)

    for (const method of items!) {
      const promotionValue = parseFloat(applicationMethod!.value!)
      const appliedPromoValue = methodIdPromoValueMap.get(method.id) || 0

      const applicableTotal =
        method.unit_price *
          Math.min(method.quantity, applicationMethod?.max_quantity!) -
        appliedPromoValue

      // TODO: should we worry about precision here?
      const applicablePromotionValue =
        (applicableTotal / totalApplicableValue) * promotionValue

      const amount = Math.min(applicablePromotionValue, applicableTotal)

      if (amount <= 0) {
        continue
      }

      computedActions.push({
        action: "addItemAdjustment",
        item_id: method.id,
        amount,
        code: promotion.code!,
      })
    }
  }

  return computedActions
}
