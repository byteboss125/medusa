import { AdminTaxRate } from "../../tax-rate"

export interface AdminTaxRegion {
  id: string
  rate: number | null
  code: string | null
  country_code: string | null
  province_code: string | null
  name: string
  metadata: Record<string, unknown> | null
  tax_region_id: string
  is_combinable: boolean
  is_default: boolean
  parent_id: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
  created_by: string | null
  tax_rates: AdminTaxRate[]
  parent: AdminTaxRegion
}
