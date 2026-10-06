import { SiteSchema } from '#database/schema'

export class SiteRecord extends SiteSchema {
  static table = 'sites'
}
