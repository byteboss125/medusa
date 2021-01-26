import { IdMap, MockManager, MockRepository } from "medusa-test-utils"
import { add } from "winston"
import CustomerService from "../customer"

const eventBusService = {
  emit: jest.fn(),
  withTransaction: function() {
    return this
  },
}

describe("CustomerService", () => {
  describe("retrieve", () => {
    const customerRepository = MockRepository({
      findOne: () => Promise.resolve({ id: IdMap.getId("ironman") }),
    })
    const customerService = new CustomerService({
      manager: MockManager,
      customerRepository,
    })

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("successfully retrieves a customer", async () => {
      const result = await customerService.retrieve(IdMap.getId("ironman"))

      expect(customerRepository.findOne).toHaveBeenCalledTimes(1)
      expect(customerRepository.findOne).toHaveBeenCalledWith({
        where: { id: IdMap.getId("ironman") },
      })

      expect(result.id).toEqual(IdMap.getId("ironman"))
    })
  })

  describe("retrieveByEmail", () => {
    const customerRepository = MockRepository({
      findOne: () => Promise.resolve({ id: IdMap.getId("ironman") }),
    })
    const customerService = new CustomerService({
      manager: MockManager,
      customerRepository,
    })

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("successfully retrieves a customer by email", async () => {
      const result = await customerService.retrieveByEmail("tony@stark.com")

      expect(customerRepository.findOne).toHaveBeenCalledTimes(1)
      expect(customerRepository.findOne).toHaveBeenCalledWith({
        where: { email: "tony@stark.com" },
      })

      expect(result.id).toEqual(IdMap.getId("ironman"))
    })
  })

  describe("retrieveByPhone", () => {
    const customerRepository = MockRepository({
      findOne: () => Promise.resolve({ id: IdMap.getId("ironman") }),
    })
    const customerService = new CustomerService({
      manager: MockManager,
      customerRepository,
    })

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("successfully retrieves a customer by email", async () => {
      const result = await customerService.retrieveByPhone("12341234")

      expect(customerRepository.findOne).toHaveBeenCalledTimes(1)
      expect(customerRepository.findOne).toHaveBeenCalledWith({
        where: { phone: "12341234" },
      })

      expect(result.id).toEqual(IdMap.getId("ironman"))
    })
  })

  describe("create", () => {
    const customerRepository = MockRepository({
      findOne: query => {
        if (query.where.email === "tony@stark.com") {
          return Promise.resolve({
            id: IdMap.getId("exists"),
            password_hash: "test",
          })
        }
        return Promise.resolve({ id: IdMap.getId("ironman") })
      },
    })

    const customerService = new CustomerService({
      manager: MockManager,
      customerRepository,
      eventBusService,
    })

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("successfully create a customer", async () => {
      await customerService.create({
        email: "oliver@medusa.com",
        first_name: "Oliver",
        last_name: "Juhl",
      })

      expect(customerRepository.create).toBeCalledTimes(1)
      expect(customerRepository.create).toBeCalledWith({
        email: "oliver@medusa.com",
        first_name: "Oliver",
        last_name: "Juhl",
      })
    })

    it("successfully updates an existing customer on create", async () => {
      await customerService.create({
        email: "tony@stark.com",
        password: "stark123",
        has_account: false,
      })

      expect(customerRepository.save).toBeCalledTimes(1)
      expect(customerRepository.save).toBeCalledWith({
        id: IdMap.getId("exists"),
        email: "tony@stark.com",
        password_hash: expect.anything(),
        has_account: true,
      })
    })

    it("fails if email is in incorrect format", async () => {
      expect(
        customerService.create({
          email: "olivermedusa.com",
        })
      ).rejects.toThrow("The email is not valid")
    })

    it("fails if billing address is in incorrect format", () => {
      expect(
        customerService.create({
          email: "oliver@medusa.com",
          first_name: "Oliver",
          last_name: "Juhl",
          billing_address: {
            first_name: 1234,
          },
        })
      ).rejects.toThrow("The address is not valid")
    })
  })

  describe("update", () => {
    const customerRepository = MockRepository({
      findOne: query => {
        return Promise.resolve({ id: IdMap.getId("ironman") })
      },
    })

    const customerService = new CustomerService({
      manager: MockManager,
      customerRepository,
      eventBusService,
    })

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("successfully updates a customer", async () => {
      await customerService.update(IdMap.getId("ironman"), {
        first_name: "Olli",
        last_name: "Test",
      })

      expect(customerRepository.save).toBeCalledTimes(1)
      expect(customerRepository.save).toBeCalledWith({
        id: IdMap.getId("ironman"),
        first_name: "Olli",
        last_name: "Test",
      })
    })

    it("successfully updates customer metadata", async () => {
      await customerService.update(IdMap.getId("ironman"), {
        metadata: {
          some: "test",
        },
      })

      expect(customerRepository.save).toBeCalledTimes(1)
      expect(customerRepository.save).toBeCalledWith({
        id: IdMap.getId("ironman"),
        metadata: {
          some: "test",
        },
      })
    })

    it("successfully updates with billing address", async () => {
      await customerService.update(IdMap.getId("ironman"), {
        first_name: "Olli",
        last_name: "Test",
        billing_address: {
          first_name: "Olli",
          last_name: "Juhl",
          address_1: "Laksegade",
          city: "Copenhagen",
          country_code: "DK",
          postal_code: "2100",
          phone: "+1 (222) 333 4444",
        },
      })

      expect(customerRepository.save).toBeCalledTimes(1)
      expect(customerRepository.save).toBeCalledWith({
        id: IdMap.getId("ironman"),
        first_name: "Olli",
        last_name: "Test",
        billing_address: {
          first_name: "Olli",
          last_name: "Juhl",
          address_1: "Laksegade",
          city: "Copenhagen",
          country_code: "DK",
          postal_code: "2100",
          phone: "+1 (222) 333 4444",
        },
      })
    })
  })

  describe("updateAddress", () => {
    const addressRepository = MockRepository({
      findOne: query => {
        return Promise.resolve({
          id: IdMap.getId("hollywood-boulevard"),
          address_1: "Hollywood Boulevard 2",
        })
      },
    })

    const customerService = new CustomerService({
      manager: MockManager,
      addressRepository,
    })

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("successfully updates address", async () => {
      await customerService.updateAddress(
        IdMap.getId("ironman"),
        IdMap.getId("hollywood-boulevard"),
        {
          first_name: "Tony",
          last_name: "Stark",
          address_1: "Hollywood Boulevard 1",
          city: "Los Angeles",
          country_code: "us",
          postal_code: "90046",
          phone: "+1 (222) 333 4444",
        }
      )

      expect(addressRepository.save).toBeCalledTimes(1)
      expect(addressRepository.save).toBeCalledWith({
        id: IdMap.getId("hollywood-boulevard"),
        first_name: "Tony",
        last_name: "Stark",
        address_1: "Hollywood Boulevard 1",
        city: "Los Angeles",
        country_code: "us",
        postal_code: "90046",
        phone: "+1 (222) 333 4444",
      })
    })

    it("throws on invalid address", async () => {
      expect(
        customerService.updateAddress(
          IdMap.getId("ironman"),
          IdMap.getId("hollywood-boulevard"),
          {
            first_name: "Tony",
            last_name: "Stark",
            address_1: "Hollywood",
          }
        )
      ).rejects.toThrow("The address is not valid")
    })
  })

  describe("removeAddress", () => {
    const addressRepository = MockRepository({
      findOne: query => {
        return Promise.resolve({
          id: IdMap.getId("hollywood-boulevard"),
          address_1: "Hollywood Boulevard 2",
        })
      },
    })

    const customerService = new CustomerService({
      manager: MockManager,
      addressRepository,
    })

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("successfully deletes address", async () => {
      await customerService.removeAddress(
        IdMap.getId("ironman"),
        IdMap.getId("hollywood-boulevard")
      )

      expect(addressRepository.softRemove).toBeCalledTimes(1)
      expect(addressRepository.softRemove).toBeCalledWith({
        id: IdMap.getId("hollywood-boulevard"),
        address_1: "Hollywood Boulevard 2",
      })
    })
  })

  describe("delete", () => {
    const customerRepository = MockRepository({
      findOne: query => {
        return Promise.resolve({ id: IdMap.getId("ironman") })
      },
    })

    const customerService = new CustomerService({
      manager: MockManager,
      customerRepository,
    })

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("successfully deletes customer", async () => {
      await customerService.delete(IdMap.getId("ironman"))

      expect(customerRepository.softRemove).toBeCalledTimes(1)
      expect(customerRepository.softRemove).toBeCalledWith({
        id: IdMap.getId("ironman"),
      })
    })
  })
})
