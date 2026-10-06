import type { Role } from '#modules/iam/application/roles'
import type { Transaction } from '#shared/application/unit_of_work'

export interface RoleAssignments {
  rolesOf(userId: number): Promise<Role[]>
  replace(transaction: Transaction, userId: number, roles: readonly Role[]): Promise<void>
}
