/**
 * @schema AdminCreateProductVariant
 * type: object
 * description: The create's details.
 * x-schemaName: AdminCreateProductVariant
 * required:
 *   - title
 *   - prices
 * properties:
 *   title:
 *     type: string
 *     title: title
 *     description: The create's title.
 *   sku:
 *     type: string
 *     title: sku
 *     description: The create's sku.
 *   ean:
 *     type: string
 *     title: ean
 *     description: The create's ean.
 *   upc:
 *     type: string
 *     title: upc
 *     description: The create's upc.
 *   barcode:
 *     type: string
 *     title: barcode
 *     description: The create's barcode.
 *   hs_code:
 *     type: string
 *     title: hs_code
 *     description: The create's hs code.
 *   mid_code:
 *     type: string
 *     title: mid_code
 *     description: The create's mid code.
 *   allow_backorder:
 *     type: boolean
 *     title: allow_backorder
 *     description: The create's allow backorder.
 *   manage_inventory:
 *     type: boolean
 *     title: manage_inventory
 *     description: The create's manage inventory.
 *   variant_rank:
 *     type: number
 *     title: variant_rank
 *     description: The create's variant rank.
 *   weight:
 *     type: number
 *     title: weight
 *     description: The create's weight.
 *   length:
 *     type: number
 *     title: length
 *     description: The create's length.
 *   height:
 *     type: number
 *     title: height
 *     description: The create's height.
 *   width:
 *     type: number
 *     title: width
 *     description: The create's width.
 *   origin_country:
 *     type: string
 *     title: origin_country
 *     description: The create's origin country.
 *   material:
 *     type: string
 *     title: material
 *     description: The create's material.
 *   metadata:
 *     type: object
 *     description: The create's metadata.
 *   prices:
 *     type: array
 *     description: The create's prices.
 *     items:
 *       $ref: "#/components/schemas/AdminCreateProductVariantPrice"
 *   options:
 *     type: object
 *     description: The create's options.
 * 
*/

