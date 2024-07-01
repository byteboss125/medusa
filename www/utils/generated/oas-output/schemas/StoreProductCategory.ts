/**
 * @schema StoreProductCategory
 * type: object
 * description: The product category's details.
 * x-schemaName: StoreProductCategory
 * required:
 *   - id
 *   - name
 *   - description
 *   - handle
 *   - is_active
 *   - is_internal
 *   - rank
 *   - parent_category_id
 *   - parent_category
 *   - category_children
 *   - created_at
 *   - updated_at
 *   - deleted_at
 * properties:
 *   products:
 *     type: array
 *     description: The product category's products.
 *     items:
 *       $ref: "#/components/schemas/StoreProduct"
 *   id:
 *     type: string
 *     title: id
 *     description: The product category's ID.
 *   name:
 *     type: string
 *     title: name
 *     description: The product category's name.
 *   description:
 *     type: string
 *     title: description
 *     description: The product category's description.
 *   handle:
 *     type: string
 *     title: handle
 *     description: The product category's handle.
 *   is_active:
 *     type: boolean
 *     title: is_active
 *     description: The product category's is active.
 *   is_internal:
 *     type: boolean
 *     title: is_internal
 *     description: The product category's is internal.
 *   rank:
 *     type: number
 *     title: rank
 *     description: The product category's rank.
 *   parent_category_id:
 *     type: string
 *     title: parent_category_id
 *     description: The product category's parent category id.
 *   parent_category:
 *     $ref: "#/components/schemas/BaseProductCategory"
 *   category_children:
 *     type: array
 *     description: The product category's category children.
 *     items:
 *       $ref: "#/components/schemas/BaseProductCategory"
 *   created_at:
 *     type: string
 *     format: date-time
 *     title: created_at
 *     description: The product category's created at.
 *   updated_at:
 *     type: string
 *     format: date-time
 *     title: updated_at
 *     description: The product category's updated at.
 *   deleted_at:
 *     type: string
 *     format: date-time
 *     title: deleted_at
 *     description: The product category's deleted at.
 * 
*/

