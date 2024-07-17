import { ModuleRegistrationName, RuleOperator } from "@medusajs/utils"
import { medusaIntegrationTestRunner } from "medusa-test-utils"
import {
  adminHeaders,
  createAdminUser,
} from "../../../helpers/create-admin-user"

jest.setTimeout(30000)

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, getContainer, api }) => {
    let order
    let returnShippingOption
    let shippingProfile
    let fulfillmentSet
    let returnReason

    beforeEach(async () => {
      const container = getContainer()
      await createAdminUser(dbConnection, adminHeaders, container)

      returnReason = (
        await api.post(
          "/admin/return-reasons",
          {
            value: "return-reason-test",
            label: "Test return reason",
            description: "This is the reason description!!!",
          },
          adminHeaders
        )
      ).data.return_reason

      const orderModule = container.resolve(ModuleRegistrationName.ORDER)

      order = await orderModule.createOrders({
        region_id: "test_region_id",
        email: "foo@bar.com",
        items: [
          {
            title: "Custom Item 2",
            quantity: 2,
            unit_price: 25,
          },
        ],
        sales_channel_id: "test",
        shipping_address: {
          first_name: "Test",
          last_name: "Test",
          address_1: "Test",
          city: "Test",
          country_code: "US",
          postal_code: "12345",
          phone: "12345",
        },
        billing_address: {
          first_name: "Test",
          last_name: "Test",
          address_1: "Test",
          city: "Test",
          country_code: "US",
          postal_code: "12345",
        },
        shipping_methods: [
          {
            name: "Test shipping method",
            amount: 10,
            data: {},
            tax_lines: [
              {
                description: "shipping Tax 1",
                tax_rate_id: "tax_usa_shipping",
                code: "code",
                rate: 10,
              },
            ],
          },
        ],
        currency_code: "usd",
        customer_id: "joe",
      })

      shippingProfile = (
        await api.post(
          `/admin/shipping-profiles`,
          {
            name: "Test",
            type: "default",
          },
          adminHeaders
        )
      ).data.shipping_profile

      let location = (
        await api.post(
          `/admin/stock-locations`,
          {
            name: "Test location",
          },
          adminHeaders
        )
      ).data.stock_location

      location = (
        await api.post(
          `/admin/stock-locations/${location.id}/fulfillment-sets?fields=*fulfillment_sets`,
          {
            name: "Test",
            type: "test-type",
          },
          adminHeaders
        )
      ).data.stock_location

      fulfillmentSet = (
        await api.post(
          `/admin/fulfillment-sets/${location.fulfillment_sets[0].id}/service-zones`,
          {
            name: "Test",
            geo_zones: [{ type: "country", country_code: "us" }],
          },
          adminHeaders
        )
      ).data.fulfillment_set

      const shippingOptionPayload = {
        name: "Return shipping",
        service_zone_id: fulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        provider_id: "manual_test-provider",
        price_type: "flat",
        type: {
          label: "Test type",
          description: "Test description",
          code: "test-code",
        },
        prices: [
          {
            currency_code: "usd",
            amount: 1000,
          },
        ],
        rules: [
          {
            operator: RuleOperator.EQ,
            attribute: "is_return",
            value: "true",
          },
        ],
      }

      returnShippingOption = (
        await api.post(
          "/admin/shipping-options",
          shippingOptionPayload,
          adminHeaders
        )
      ).data.shipping_option

      const item = order.items[0]

      await api.post(
        `/admin/orders/${order.id}/fulfillments`,
        {
          items: [
            {
              id: item.id,
              quantity: 2,
            },
          ],
        },
        adminHeaders
      )
    })

    describe("Returns lifecycle", () => {
      // Simple lifecyle:
      // 1. Initiate return
      // 2. Request to return items
      // 3. Add return shipping
      // 4. Confirm return
      it("should initiate a return", async () => {
        let result = await api.post(
          "/admin/returns",
          {
            order_id: order.id,
            description: "Test",
          },
          adminHeaders
        )

        const returnId = result.data.return.id

        expect(result.data.return).toEqual(
          expect.objectContaining({
            id: expect.any(String),
            order_id: order.id,
            display_id: 1,
            order_version: 2,
            status: "requested",
          })
        )

        expect(result.data.order_preview).toEqual(
          expect.objectContaining({
            id: expect.any(String),
            return_id: returnId,
            change_type: "return",
            actions: [],
            description: "Test",
            status: "pending",
            order_id: order.id,
          })
        )

        const item = order.items[0]

        result = await api.post(
          `/admin/returns/${returnId}/request-items`,
          {
            items: [
              {
                id: item.id,
                quantity: 2,
                reason_id: returnReason.id,
              },
            ],
          },
          adminHeaders
        )

        expect(result.data.order_preview).toEqual(
          expect.objectContaining({
            id: order.id,
            items: expect.arrayContaining([
              expect.objectContaining({
                id: expect.any(String),
                title: "Custom Item 2",
                unit_price: 25,
                quantity: 2,
                subtotal: 50,
                total: 50,
                fulfilled_total: 50,
                return_requested_total: 50,
                detail: expect.objectContaining({
                  quantity: 2,
                  return_requested_quantity: 2,
                }),
              }),
            ]),
          })
        )

        // Remove item return requesta
        const returnItemActionId =
          result.data.order_preview.items[0].actions[0].id
        result = await api.delete(
          `/admin/returns/${returnId}/request-items/${returnItemActionId}`,
          adminHeaders
        )

        expect(result.data.order_preview).toEqual(
          expect.objectContaining({
            id: order.id,
            items: expect.arrayContaining([
              expect.objectContaining({
                detail: expect.objectContaining({
                  return_requested_quantity: 0,
                }),
              }),
            ]),
          })
        )

        // Add item return request again
        result = await api.post(
          `/admin/returns/${returnId}/request-items`,
          {
            items: [
              {
                id: item.id,
                quantity: 1,
              },
            ],
          },
          adminHeaders
        )

        expect(result.data.order_preview).toEqual(
          expect.objectContaining({
            id: order.id,
            items: expect.arrayContaining([
              expect.objectContaining({
                detail: expect.objectContaining({
                  return_requested_quantity: 1,
                }),
              }),
            ]),
          })
        )

        // updated the requested quantitty
        const updateReturnItemActionId =
          result.data.order_preview.items[0].actions[0].id
        result = await api.post(
          `/admin/returns/${returnId}/request-items/${updateReturnItemActionId}`,
          {
            quantity: 2,
            internal_note: "Test internal note",
            reason_id: returnReason.id,
          },
          adminHeaders
        )

        expect(result.data.order_preview).toEqual(
          expect.objectContaining({
            id: order.id,
            items: expect.arrayContaining([
              expect.objectContaining({
                detail: expect.objectContaining({
                  quantity: 2,
                  return_requested_quantity: 2,
                }),
              }),
            ]),
          })
        )

        result = await api.post(
          `/admin/returns/${returnId}/shipping-method`,
          {
            shipping_option_id: returnShippingOption.id,
          },
          adminHeaders
        )

        expect(result.data.order_preview).toEqual(
          expect.objectContaining({
            id: order.id,
            items: expect.arrayContaining([
              expect.objectContaining({
                id: expect.any(String),
                title: "Custom Item 2",
                unit_price: 25,
                quantity: 2,
                subtotal: 50,
                total: 50,
                fulfilled_total: 50,
                return_requested_total: 50,
                actions: expect.arrayContaining([
                  expect.objectContaining({
                    details: expect.objectContaining({
                      quantity: 2,
                    }),
                    internal_note: "Test internal note",
                  }),
                ]),
              }),
            ]),
            shipping_methods: expect.arrayContaining([
              expect.objectContaining({
                id: expect.any(String),
                name: "Return shipping",
                amount: 1000,
                subtotal: 1000,
                total: 1000,
              }),
            ]),
          })
        )

        let orderPreview = await api.get(
          `/admin/orders/${order.id}/preview`,
          adminHeaders
        )

        expect(orderPreview.data.order).toEqual(
          expect.objectContaining({
            id: order.id,
            items: expect.arrayContaining([
              expect.objectContaining({
                id: expect.any(String),
                title: "Custom Item 2",
                unit_price: 25,
                quantity: 2,
                subtotal: 50,
                total: 50,
                fulfilled_total: 50,
                return_requested_total: 50,
              }),
            ]),
            shipping_methods: expect.arrayContaining([
              expect.objectContaining({
                id: expect.any(String),
                name: "Return shipping",
                amount: 1000,
                subtotal: 1000,
                total: 1000,
              }),
            ]),
          })
        )

        expect(result.data.order_preview.shipping_methods).toHaveLength(2)

        // remove shipping method
        const shippingActionId =
          result.data.order_preview.shipping_methods[1].actions[0].id
        result = await api.delete(
          `/admin/returns/${returnId}/shipping-method/${shippingActionId}`,
          adminHeaders
        )

        expect(result.data.order_preview.shipping_methods).toHaveLength(1)

        // recreate shipping
        result = await api.post(
          `/admin/returns/${returnId}/shipping-method`,
          {
            shipping_option_id: returnShippingOption.id,
          },
          adminHeaders
        )

        // updates the shipping method price
        const updateShippingActionId =
          result.data.order_preview.shipping_methods[1].actions[0].id
        result = await api.post(
          `/admin/returns/${returnId}/shipping-method/${updateShippingActionId}`,
          {
            custom_price: 1002,
            internal_note: "cx agent note",
          },
          adminHeaders
        )

        expect(result.data.order_preview.shipping_methods).toHaveLength(2)
        expect(result.data.order_preview.shipping_methods[1]).toEqual(
          expect.objectContaining({
            id: expect.any(String),
            name: "Return shipping",
            amount: 1002,
            subtotal: 1002,
            total: 1002,
            actions: [
              expect.objectContaining({
                internal_note: "cx agent note",
              }),
            ],
          })
        )

        result = await api.post(
          `/admin/returns/${returnId}/request`,
          {},
          adminHeaders
        )

        expect(result.data.return).toEqual(
          expect.objectContaining({
            items: [
              expect.objectContaining({
                reason: expect.objectContaining({
                  id: returnReason.id,
                  value: "return-reason-test",
                  label: "Test return reason",
                  description: "This is the reason description!!!",
                }),
              }),
            ],
          })
        )

        expect(result.data.order_preview).toEqual(
          expect.objectContaining({
            id: order.id,
            items: expect.arrayContaining([
              expect.objectContaining({
                id: expect.any(String),
                title: "Custom Item 2",
                unit_price: 25,
                quantity: 2,
                subtotal: 50,
                total: 50,
                fulfilled_total: 50,
                return_requested_total: 50,
              }),
            ]),
            shipping_methods: expect.arrayContaining([
              expect.objectContaining({
                id: expect.any(String),
                name: "Return shipping",
                amount: 1002,
                subtotal: 1002,
                total: 1002,
              }),
            ]),
          })
        )

        // The order preview endpoint should still return the order in case the change has been completed
        orderPreview = await api.get(
          `/admin/orders/${order.id}/preview`,
          adminHeaders
        )

        expect(orderPreview.data.order).toEqual(
          expect.objectContaining({
            id: order.id,
            items: expect.arrayContaining([
              expect.objectContaining({
                id: expect.any(String),
                title: "Custom Item 2",
                unit_price: 25,
                quantity: 2,
                subtotal: 50,
                total: 50,
                fulfilled_total: 50,
                return_requested_total: 50,
              }),
            ]),
            shipping_methods: expect.arrayContaining([
              expect.objectContaining({
                id: expect.any(String),
                name: "Return shipping",
                amount: 1002,
                subtotal: 1002,
                total: 1002,
              }),
            ]),
          })
        )
      })
    })
  },
})
