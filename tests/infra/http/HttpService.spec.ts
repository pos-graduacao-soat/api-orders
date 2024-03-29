import { HttpService } from '../../../src/infra/http/HttpService'
import axios, { AxiosResponse } from 'axios'
import { IHttpResponseModel } from '../../../src/infra/http/interfaces/IHttpResponseModel'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>
mockedAxios.create.mockReturnValue(mockedAxios)

describe('HttpService', () => {
  it('should execute GET request using axios and return data', async () => {
    const mockResponse: Partial<AxiosResponse> = { data: 'data', status: 200 }

    mockedAxios.get.mockResolvedValue({ data: mockResponse })

    const httpService = new HttpService({})

    const response = await httpService.get<IHttpResponseModel>('url')

    expect(response.data).toEqual(mockResponse)
  })

  it('should execute POST request using axios and return data', async () => {
    const mockResponse: Partial<AxiosResponse> = { data: 'data', status: 200 }

    mockedAxios.post.mockResolvedValue({ data: mockResponse })

    const httpService = new HttpService({})

    const response = await httpService.post<IHttpResponseModel>('url')

    expect(response.data).toEqual(mockResponse)
  })
})