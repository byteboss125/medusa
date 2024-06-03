import { ModuleRegistrationName } from "@medusajs/utils"
import { adminHeaders } from "../../../../helpers/create-admin-user"
import { IPaymentModuleService } from "@medusajs/types"

const { medusaIntegrationTestRunner } = require("medusa-test-utils")
const { createAdminUser } = require("../../../../helpers/create-admin-user")

jest.setTimeout(30000)

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, getContainer, api }) => {
    let paymentModule: IPaymentModuleService
    let paymentCollection
    let payment

    beforeEach(async () => {
      paymentModule = getContainer().resolve(ModuleRegistrationName.PAYMENT)
      await createAdminUser(dbConnection, adminHeaders, getContainer())

      const collection = (
        await api.post(
          "/store/payment-collections",
          {
            cart_id: "test-cart",
            region_id: "test-region",
            amount: 1000,
            currency_code: "usd",
          },
          adminHeaders
        )
      ).data.payment_collection

      paymentCollection = (
        await api.post(
          `/store/payment-collections/${collection.id}/payment-sessions`,
          { provider_id: "pp_system_default" },
          adminHeaders
        )
      ).data.payment_collection

      const lastSession = paymentCollection.payment_sessions[0]
      // TODO: Try to replace it with user behavior, like completing a cart.
      await paymentModule.authorizePaymentSession(lastSession.id, {})

      const payments = (
        await api.get(
          `/admin/payments?payment_session_id=${lastSession.id}`,
          adminHeaders
        )
      ).data.payments
      payment = payments[0]
    })

    it("Captures an authorized payment", async () => {
      const response = await api.post(
        `/admin/payments/${payment.id}/capture`,
        undefined,
        adminHeaders
      )

      expect(response.data.payment).toEqual(
        expect.objectContaining({
          id: payment.id,
          captured_at: expect.any(String),
          captures: [
            expect.objectContaining({
              id: expect.any(String),
              amount: 1000,
            }),
          ],
          refunds: [],
          amount: 1000,
        })
      )
      expect(response.status).toEqual(200)
    })

    it("Refunds an captured payment", async () => {
      await api.post(
        `/admin/payments/${payment.id}/capture`,
        undefined,
        adminHeaders
      )

      // refund
      const response = await api.post(
        `/admin/payments/${payment.id}/refund`,
        {
          amount: 500,
          // BREAKING: We should probably introduce reason and notes in V2 too
          // reason: "return",
          // note: "Do not like it",
        },
        adminHeaders
      )

      // BREAKING: Response was `data.refund` in V1 with payment ID, reason, and amount
      expect(response.status).toEqual(200)
      expect(response.data.payment).toEqual(
        expect.objectContaining({
          id: payment.id,
          captured_at: expect.any(String),
          captures: [
            expect.objectContaining({
              id: expect.any(String),
              amount: 1000,
            }),
          ],
          refunds: [
            expect.objectContaining({
              id: expect.any(String),
              amount: 500,
            }),
          ],
          amount: 1000,
        })
      )
    })
  },
})
