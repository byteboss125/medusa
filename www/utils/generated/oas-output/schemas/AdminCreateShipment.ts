/**
 * @schema AdminCreateShipment
 * type: object
 * description: SUMMARY
 * x-schemaName: AdminCreateShipment
 * required:
 *   - labels
 * properties:
 *   labels:
 *     type: array
 *     description: The fulfillment's labels.
 *     items:
 *       type: object
 *       description: The label's labels.
 *       required:
 *         - tracking_number
 *         - tracking_url
 *         - label_url
 *       properties:
 *         tracking_number:
 *           type: string
 *           title: tracking_number
 *           description: The label's tracking number.
 *         tracking_url:
 *           type: string
 *           title: tracking_url
 *           description: The label's tracking url.
 *         label_url:
 *           type: string
 *           title: label_url
 *           description: The label's label url.
 * 
*/

