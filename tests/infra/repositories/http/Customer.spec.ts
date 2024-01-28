import 'reflect-metadata'
import { HttpService } from '../../../../src/infra/http/HttpService'
import { HttpCustomerRepository } from '../../../../src/infra/repositories'
import { Customer } from '../../../../src/domain/valueObjects/Customer'

jest.mock('../../../../src/infra/http/HttpService')

describe('HttpCustomerRepository', () => {
  let httpService: jest.Mocked<HttpService>
  let httpCustomerRepository: HttpCustomerRepository

  beforeEach(() => {
    httpService = new HttpService() as jest.Mocked<HttpService>
    httpCustomerRepository = new HttpCustomerRepository(httpService)
  })

  describe('getById', () => {
    it('should get a customer by id', async () => {
      const customer = new Customer({
        id: '1',
        name: 'customer',
        documentNumber: '123',
        email: 'email'
      })

      httpService.get.mockResolvedValue({
        status: 200,
        data: { data: customer }
      } as any)

      const result = await httpCustomerRepository.getById('1')

      expect(result).toEqual(customer)
      expect(httpService.get).toHaveBeenCalledWith('/customers/1')
    })

    it('should return null if status is not 200', async () => {
      httpService.get.mockResolvedValue({
        status: 500,
        data: { data: {} }
      } as any)

      const result = await httpCustomerRepository.getById('1')

      expect(httpService.get).toHaveBeenCalledWith('/customers/1')
      expect(result).toBeNull()
    })
  })
})