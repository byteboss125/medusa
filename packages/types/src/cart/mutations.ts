import { CartLineItemDTO } from "./common"

export interface UpsertAddressDTO {
  customer_id?: string
  company?: string
  first_name?: string
  last_name?: string
  address_1?: string
  address_2?: string
  city?: string
  country_code?: string
  province?: string
  postal_code?: string
  phone?: string
  metadata?: Record<string, unknown>
}

export interface UpdateAddressDTO extends UpsertAddressDTO {
  id: string
}

export interface CreateAddressDTO extends UpsertAddressDTO {}

export interface CreateCartDTO {
  region_id?: string
  customer_id?: string
  sales_channel_id?: string

  email?: string
  currency_code: string

  shipping_address_id?: string
  billing_address_id?: string

  shipping_address?: CreateAddressDTO | UpdateAddressDTO
  billing_address?: CreateAddressDTO | UpdateAddressDTO

  metadata?: Record<string, unknown>
}

export interface UpdateCartDTO {
  id: string
  region_id?: string
  customer_id?: string
  sales_channel_id?: string

  email?: string
  currency_code?: string

  shipping_address_id?: string
  billing_address_id?: string

  billing_address?: CreateAddressDTO | UpdateAddressDTO
  shipping_address?: CreateAddressDTO | UpdateAddressDTO

  metadata?: Record<string, unknown>
}

export interface CreateLineItemTaxLineDTO {
  description?: string
  tax_rate_id?: string
  code: string
  rate: number
  provider_id?: string
}

export interface CreateLineItemAdjustmentDTO {
  code: string
  amount: number
  description?: string
  promotion_id?: string
  provider_id?: string
}

export interface UpdateLineItemTaxLineDTO {
  id: string
  description?: string
  tax_rate_id?: string
  code?: string
  rate?: number
  provider_id?: string
}

export interface UpdateLineItemAdjustmentDTO {
  id: string
  code?: string
  amount?: number
  description?: string
  promotion_id?: string
  provider_id?: string
}

export interface CreateLineItemDTO {
  title: string
  subtitle?: string
  thumbnail?: string

  cart_id?: string

  quantity: number

  product_id?: string
  product_title?: string
  product_description?: string
  product_subtitle?: string
  product_type?: string
  product_collection?: string
  product_handle?: string

  variant_id?: string
  variant_sku?: string
  variant_barcode?: string
  variant_title?: string
  variant_option_values?: Record<string, unknown>

  requires_shipping?: boolean
  is_discountable?: boolean
  is_tax_inclusive?: boolean

  compare_at_unit_price?: number
  unit_price: number

  tax_lines?: CreateLineItemTaxLineDTO[]
  adjustments?: CreateLineItemAdjustmentDTO[]
}

export interface CreateLineItemForCartDTO extends CreateLineItemDTO {
  cart_id: string
}

export interface UpdateLineItemWithSelectorDTO {
  selector: Partial<CartLineItemDTO>
  data: Partial<UpdateLineItemDTO>
}

export interface UpdateLineItemDTO
  extends Omit<
    CreateLineItemDTO,
    "tax_lines" | "adjustments" | "title" | "quantity" | "unit_price"
  > {
  id: string

  title?: string
  quantity?: number
  unit_price?: number

  tax_lines?: UpdateLineItemTaxLineDTO[] | CreateLineItemTaxLineDTO[]
  adjustments?: UpdateLineItemAdjustmentDTO[] | CreateLineItemAdjustmentDTO[]
}
