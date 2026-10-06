export const roles = [
  'planner',
  'buyer',
  'quality_engineer',
  'operator',
  'warehouse_operator',
  'sales_administrator',
  'methods_manager',
  'it_administrator',
] as const

export type Role = (typeof roles)[number]

export function isRole(value: string): value is Role {
  return (roles as readonly string[]).includes(value)
}

export type Permission =
  'iam.assign_roles' | 'organization.set_up' | 'organization.create_site' | 'catalog.create_item'

/**
 * Static role matrix. Roles apply to the whole organization; each module adds
 * its permissions here as its commands appear.
 */
export const rolePermissions: Record<Role, readonly Permission[]> = {
  planner: [],
  buyer: [],
  quality_engineer: [],
  operator: [],
  warehouse_operator: [],
  sales_administrator: [],
  methods_manager: ['catalog.create_item'],
  it_administrator: ['iam.assign_roles', 'organization.set_up', 'organization.create_site'],
}
