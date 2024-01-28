import 'reflect-metadata'
import { HttpService } from '../../../../src/infra/http/HttpService'
import { HttpProductRepository } from '../../../../src/infra/repositories'
import { Product } from '../../../../src/domain/valueObjects/Product'

jest.mock('../../../../src/infra/http/HttpService')

describe('HttpProductRepository', () => {
  let httpService: jest.Mocked<HttpService>
  let httpProductRepository: HttpProductRepository

  beforeEach(() => {
    httpService = new HttpService() as jest.Mocked<HttpService>
    httpProductRepository = new HttpProductRepository(httpService)
  })

  describe('getById', () => {
    it('should get a product by id', async () => {
      const product = new Product({
        id: '1',
        name: 'customer',
        category: 'category',
        description: 'description',
        image: 'image',
        price: 10
      })

      httpService.get.mockResolvedValue({
        status: 200,
        data: { data: product }
      } as any)

      const result = await httpProductRepository.getById('1')

      expect(result).toEqual(product)
      expect(httpService.get).toHaveBeenCalledWith('/products/1')
    })
  })

  describe('getByIds', () => {
    it('should get products by ids', async () => {
      const product = new Product({
        id: '1',
        name: 'prod',
        category: 'category',
        description: 'description',
        image: 'image',
        price: 10
      })

      httpService.get.mockResolvedValue({
        status: 200,
        data: { data: [product, { ...product, id: 2, name: 'prodjct' }] }
      } as any)

      const result = await httpProductRepository.getByIds(['1', '2'])

      expect(result).toEqual([product, { ...product, id: 2, name: 'prodjct' }])
      expect(httpService.get).toHaveBeenCalledWith('/products/ids?ids=1,2')
    })

    it('should return empty if status is not 200', async () => {
      httpService.get.mockResolvedValue({
        status: 500,
        data: { data: {} }
      } as any)

      const result = await httpProductRepository.getByIds(['1'])

      expect(httpService.get).toHaveBeenCalledWith('/products/ids?ids=1')
      expect(result).toEqual([])
    })
  })
})