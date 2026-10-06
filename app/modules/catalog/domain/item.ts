import { ItemCode } from '#modules/catalog/domain/item_code'
import { DomainError } from '#shared/domain/domain_error'
import { generateId } from '#shared/domain/identifier'

export const stockUnits = ['unit', 'kg', 'g', 'm', 'mm', 'l'] as const

export type StockUnit = (typeof stockUnits)[number]

const maxDescriptionLength = 255
const maxLeadTimeDays = 3650

export interface ItemDefinition {
  code: string
  description: string
  purchased: boolean
  manufactured: boolean
  stockUnit: string
  lotTracked: boolean
  leadTimeDays: number
  receiptInspection: boolean
  finalInspection: boolean
}

export class Item {
  private constructor(
    readonly id: string,
    readonly code: ItemCode,
    readonly description: string,
    readonly purchased: boolean,
    readonly manufactured: boolean,
    readonly stockUnit: StockUnit,
    readonly lotTracked: boolean,
    readonly leadTimeDays: number,
    readonly receiptInspection: boolean,
    readonly finalInspection: boolean
  ) {}

  static create(definition: ItemDefinition): Item {
    const description = definition.description.trim()
    if (description === '') {
      throw new DomainError('catalog.item_without_description', 'An item needs a description')
    }
    if (description.length > maxDescriptionLength) {
      throw new DomainError(
        'catalog.item_description_too_long',
        `An item description has at most ${maxDescriptionLength} characters`
      )
    }

    if (!definition.purchased && !definition.manufactured) {
      throw new DomainError(
        'catalog.item_without_sourcing',
        'An item must be purchased, manufactured, or both'
      )
    }

    if (!isStockUnit(definition.stockUnit)) {
      throw new DomainError(
        'catalog.unknown_stock_unit',
        `Unknown stock unit "${definition.stockUnit}"`
      )
    }

    if (
      !Number.isInteger(definition.leadTimeDays) ||
      definition.leadTimeDays < 0 ||
      definition.leadTimeDays > maxLeadTimeDays
    ) {
      throw new DomainError(
        'catalog.invalid_lead_time',
        `Lead time must be a whole number of days between 0 and ${maxLeadTimeDays}`
      )
    }

    if (definition.receiptInspection && !definition.purchased) {
      throw new DomainError(
        'catalog.receipt_inspection_not_purchased',
        'Only a purchased item can require a receipt inspection'
      )
    }

    if (definition.finalInspection && !definition.manufactured) {
      throw new DomainError(
        'catalog.final_inspection_not_manufactured',
        'Only a manufactured item can require a final inspection'
      )
    }

    return new Item(
      generateId(),
      ItemCode.of(definition.code),
      description,
      definition.purchased,
      definition.manufactured,
      definition.stockUnit,
      definition.lotTracked,
      definition.leadTimeDays,
      definition.receiptInspection,
      definition.finalInspection
    )
  }
}

function isStockUnit(value: string): value is StockUnit {
  return (stockUnits as readonly string[]).includes(value)
}
