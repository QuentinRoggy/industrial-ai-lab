import type { RoleAssignments } from '#modules/iam/domain/role_assignments'
import type { Role } from '#modules/iam/application/roles'
import type { Transaction } from '#shared/application/unit_of_work'
import { DomainError } from '#shared/domain/domain_error'
import { lucidClient } from '#shared/infrastructure/lucid_unit_of_work'
import db from '@adonisjs/lucid/services/db'

const table = 'user_roles'

export class LucidRoleAssignments implements RoleAssignments {
  async rolesOf(userId: number): Promise<Role[]> {
    const rows = await db.from(table).where('user_id', userId).orderBy('role').select('role')
    return rows.map((row) => row.role)
  }

  async replace(transaction: Transaction, userId: number, roles: readonly Role[]): Promise<void> {
    const client = lucidClient(transaction)

    if (!(await client.from('users').where('id', userId).first())) {
      throw new DomainError('iam.unknown_user', `Unknown user ${userId}`)
    }

    await client.from(table).where('user_id', userId).delete()

    if (roles.length > 0) {
      await client.table(table).multiInsert(roles.map((role) => ({ user_id: userId, role })))
    }
  }
}
