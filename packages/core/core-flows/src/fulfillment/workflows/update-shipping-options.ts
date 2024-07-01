import { FulfillmentWorkflow } from "@medusajs/types"
import {
  createWorkflow,
  transform,
  WorkflowData,
} from "@medusajs/workflows-sdk"
import {
  setShippingOptionsPricesStep,
  upsertShippingOptionsStep,
} from "../steps"

export const updateShippingOptionsWorkflowId =
  "update-shipping-options-workflow"
export const updateShippingOptionsWorkflow = createWorkflow(
  updateShippingOptionsWorkflowId,
  (
    input: WorkflowData<
      FulfillmentWorkflow.UpdateShippingOptionsWorkflowInput[]
    >
  ): WorkflowData<FulfillmentWorkflow.UpdateShippingOptionsWorkflowOutput> => {
    const data = transform(input, (data) => {
      const shippingOptionsIndexToPrices = data.map((option, index) => {
        const prices = option.prices
        delete option.prices
        return {
          shipping_option_index: index,
          prices,
        }
      })

      return {
        shippingOptions: data,
        shippingOptionsIndexToPrices,
      }
    })

    const updatedShippingOptions = upsertShippingOptionsStep(
      data.shippingOptions
    )

    const normalizedShippingOptionsPrices = transform(
      {
        shippingOptions: updatedShippingOptions,
        shippingOptionsIndexToPrices: data.shippingOptionsIndexToPrices,
      },
      (data) => {
        const shippingOptionsPrices = data.shippingOptionsIndexToPrices.map(
          ({ shipping_option_index, prices }) => {
            return {
              id: data.shippingOptions[shipping_option_index].id,
              prices,
            }
          }
        )

        return {
          shippingOptionsPrices,
        }
      }
    )

    setShippingOptionsPricesStep(
      normalizedShippingOptionsPrices.shippingOptionsPrices
    )

    return updatedShippingOptions
  }
)
