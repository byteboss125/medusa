import { CartDTO, CreateCartWorkflowInputDTO } from "@medusajs/types"
import {
  WorkflowData,
  createWorkflow,
  transform,
} from "@medusajs/workflows-sdk"
import {
  createCartsStep,
  findOneOrAnyRegionStep,
  findOrCreateCustomerStep,
} from "../steps"

export const createCartWorkflowId = "create-cart"
export const createCartWorkflow = createWorkflow(
  createCartWorkflowId,
  (input: WorkflowData<CreateCartWorkflowInputDTO>): WorkflowData<CartDTO> => {
    const region = findOneOrAnyRegionStep({
      regionId: input.region_id,
    })

    const customerData = findOrCreateCustomerStep({
      customerId: input.customer_id,
      email: input.email,
    })

    const cartInput = transform({ input, region, customerData }, (data) => {
      const data_ = {
        ...data.input,
        currency_code: data.input.currency_code ?? data.region.currency_code,
        region_id: data.region.id,
      }

      if (data.customerData.customer?.id) {
        data_.customer_id = data.customerData.customer.id
        data_.email = data.input?.email ?? data.customerData.customer.email
      }

      return data_
    })

    // TODO: Add line items

    const cart = createCartsStep([cartInput])

    return cart[0]
  }
)
