import type { StockUnit } from '#modules/catalog/domain/item'

export interface ItemView {
  id: string
  code: string
  description: string
  purchased: boolean
  manufactured: boolean
  stockUnit: StockUnit
  lotTracked: boolean
  leadTimeDays: number
  receiptInspection: boolean
  finalInspection: boolean
}
