import { OrganizationSchema } from '#database/schema'

export class OrganizationRecord extends OrganizationSchema {
  static table = 'organizations'
}
