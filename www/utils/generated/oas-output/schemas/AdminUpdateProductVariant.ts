/**
 * @schema AdminUpdateProductVariant
 * type: object
 * description: The update's details.
 * x-schemaName: AdminUpdateProductVariant
 * properties:
 *   title:
 *     type: string
 *     title: title
 *     description: The update's title.
 *   sku:
 *     type: string
 *     title: sku
 *     description: The update's sku.
 *   ean:
 *     type: string
 *     title: ean
 *     description: The update's ean.
 *   upc:
 *     type: string
 *     title: upc
 *     description: The update's upc.
 *   barcode:
 *     type: string
 *     title: barcode
 *     description: The update's barcode.
 *   hs_code:
 *     type: string
 *     title: hs_code
 *     description: The update's hs code.
 *   mid_code:
 *     type: string
 *     title: mid_code
 *     description: The update's mid code.
 *   allow_backorder:
 *     type: boolean
 *     title: allow_backorder
 *     description: The update's allow backorder.
 *   manage_inventory:
 *     type: boolean
 *     title: manage_inventory
 *     description: The update's manage inventory.
 *   variant_rank:
 *     type: number
 *     title: variant_rank
 *     description: The update's variant rank.
 *   weight:
 *     type: number
 *     title: weight
 *     description: The update's weight.
 *   length:
 *     type: number
 *     title: length
 *     description: The update's length.
 *   height:
 *     type: number
 *     title: height
 *     description: The update's height.
 *   width:
 *     type: number
 *     title: width
 *     description: The update's width.
 *   origin_country:
 *     type: string
 *     title: origin_country
 *     description: The update's origin country.
 *   material:
 *     type: string
 *     title: material
 *     description: The update's material.
 *   metadata:
 *     type: object
 *     description: The update's metadata.
 *   prices:
 *     type: array
 *     description: The update's prices.
 *     items:
 *       $ref: "#/components/schemas/AdminCreateProductVariantPrice"
 *   options:
 *     type: object
 *     description: The update's options.
 * 
*/

