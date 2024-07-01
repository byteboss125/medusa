/**
 * @schema AdminPrice
 * type: object
 * description: The price's prices.
 * x-schemaName: AdminPrice
 * required:
 *   - id
 *   - title
 *   - currency_code
 *   - amount
 *   - raw_amount
 *   - min_quantity
 *   - max_quantity
 *   - price_set_id
 *   - created_at
 *   - updated_at
 *   - deleted_at
 * properties:
 *   id:
 *     type: string
 *     title: id
 *     description: The price's ID.
 *   title:
 *     type: string
 *     title: title
 *     description: The price's title.
 *   currency_code:
 *     type: string
 *     title: currency_code
 *     description: The price's currency code.
 *   amount:
 *     type: number
 *     title: amount
 *     description: The price's amount.
 *   raw_amount:
 *     type: object
 *     description: The price's raw amount.
 *   min_quantity:
 *     type: number
 *     title: min_quantity
 *     description: The price's min quantity.
 *   max_quantity:
 *     type: number
 *     title: max_quantity
 *     description: The price's max quantity.
 *   price_set_id:
 *     type: string
 *     title: price_set_id
 *     description: The price's price set id.
 *   created_at:
 *     type: string
 *     format: date-time
 *     title: created_at
 *     description: The price's created at.
 *   updated_at:
 *     type: string
 *     format: date-time
 *     title: updated_at
 *     description: The price's updated at.
 *   deleted_at:
 *     type: string
 *     format: date-time
 *     title: deleted_at
 *     description: The price's deleted at.
 * 
*/

