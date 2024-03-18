import { StartProductionOfOrderDTO } from './StartProductionOfOrderDTO'

export interface IStartProductionOfOrderUseCase {
  execute: (params: StartProductionOfOrderDTO) => Promise<void>
}