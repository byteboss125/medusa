/**
 * @schema AdminProductOptionDeleteResponse
 * type: object
 * description: SUMMARY
 * x-schemaName: AdminProductOptionDeleteResponse
 * required:
 *   - id
 *   - object
 *   - deleted
 * properties:
 *   id:
 *     type: string
 *     title: id
 *     description: The product's ID.
 *   object:
 *     type: string
 *     title: object
 *     description: The product's object.
 *     default: product_option
 *   deleted:
 *     type: boolean
 *     title: deleted
 *     description: The product's deleted.
 *   parent:
 *     $ref: "#/components/schemas/AdminProduct"
 * 
*/

