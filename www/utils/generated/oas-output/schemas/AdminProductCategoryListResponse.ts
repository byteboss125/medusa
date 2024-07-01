/**
 * @schema AdminProductCategoryListResponse
 * type: object
 * description: SUMMARY
 * x-schemaName: AdminProductCategoryListResponse
 * required:
 *   - limit
 *   - offset
 *   - count
 *   - product_categories
 * properties:
 *   limit:
 *     type: number
 *     title: limit
 *     description: The product category's limit.
 *   offset:
 *     type: number
 *     title: offset
 *     description: The product category's offset.
 *   count:
 *     type: number
 *     title: count
 *     description: The product category's count.
 *   product_categories:
 *     type: array
 *     description: The product category's product categories.
 *     items:
 *       $ref: "#/components/schemas/AdminProductCategory"
 * 
*/

