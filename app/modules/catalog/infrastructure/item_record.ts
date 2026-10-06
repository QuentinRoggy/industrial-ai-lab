import { ItemSchema } from '#database/schema'

export class ItemRecord extends ItemSchema {
  static table = 'items'
}
