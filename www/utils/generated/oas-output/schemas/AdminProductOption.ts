/**
 * @schema AdminProductOption
 * type: object
 * description: The product's product option.
 * x-schemaName: AdminProductOption
 * required:
 *   - id
 *   - title
 * properties:
 *   id:
 *     type: string
 *     title: id
 *     description: The product option's ID.
 *   title:
 *     type: string
 *     title: title
 *     description: The product option's title.
 *   product:
 *     $ref: "#/components/schemas/BaseProduct"
 *   product_id:
 *     type: string
 *     title: product_id
 *     description: The product option's product id.
 *   values:
 *     type: array
 *     description: The product option's values.
 *     items:
 *       $ref: "#/components/schemas/BaseProductOptionValue"
 *   metadata:
 *     type: object
 *     description: The product option's metadata.
 *   created_at:
 *     type: string
 *     format: date-time
 *     title: created_at
 *     description: The product option's created at.
 *   updated_at:
 *     type: string
 *     format: date-time
 *     title: updated_at
 *     description: The product option's updated at.
 *   deleted_at:
 *     type: string
 *     format: date-time
 *     title: deleted_at
 *     description: The product option's deleted at.
 * 
*/

