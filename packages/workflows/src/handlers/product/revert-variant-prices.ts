import { PricingTypes } from "@medusajs/types"
import { WorkflowArguments } from "../../helper"

type HandlerInput = {
  createdLinks: Record<any, any>[]
  originalMoneyAmounts: PricingTypes.MoneyAmountDTO[]
  createdPriceSets: PricingTypes.PriceSetDTO[]
}

export async function revertVariantPrices({
  container,
  context,
  data,
}: WorkflowArguments<HandlerInput>): Promise<void> {
  const {
    createdLinks = [],
    originalMoneyAmounts = [],
    createdPriceSets = [],
  } = data

  const featureFlagRouter = container.resolve("featureFlagRouter")
  const isPricingDomainEnabled = featureFlagRouter.isFeatureEnabled(
    "isolate_pricing_domain"
  )

  if (!isPricingDomainEnabled) {
    return
  }

  const pricingModuleService = container.resolve("pricingModuleService")
  const remoteLink = container.resolve("remoteLink")

  await remoteLink.remove(createdLinks)

  if (originalMoneyAmounts.length) {
    await pricingModuleService.updateMoneyAmounts(originalMoneyAmounts)
  }

  if (createdPriceSets.length) {
    await pricingModuleService.delete({
      id: createdPriceSets.map((cps) => cps.id),
    })
  }
}

revertVariantPrices.aliases = {
  productVariantsPrices: "productVariantsPrices",
}
