import { FindParams } from "../../common"

export interface AdminFulfillmentProviderListParams extends FindParams {
  id?: string | string[]
  q?: string
  is_enabled?: boolean
}
