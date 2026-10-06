import type { AccessControl, Actor } from '#modules/iam/application/access_control'
import type { RoleAssignments } from '#modules/iam/domain/role_assignments'
import { isRole } from '#modules/iam/application/roles'
import type { UnitOfWork } from '#shared/application/unit_of_work'
import { DomainError } from '#shared/domain/domain_error'

/**
 * Replaces the roles of a user with the given set.
 */
export class AssignRoles {
  constructor(
    private readonly accessControl: AccessControl,
    private readonly unitOfWork: UnitOfWork,
    private readonly assignments: RoleAssignments
  ) {}

  async execute(actor: Actor, input: { userId: number; roles: readonly string[] }): Promise<void> {
    await this.accessControl.ensure(actor, 'iam.assign_roles')

    const roles = [...new Set(input.roles)]
    const unknown = roles.filter((role) => !isRole(role))
    if (unknown.length > 0) {
      throw new DomainError('iam.unknown_role', `Unknown roles: ${unknown.join(', ')}`)
    }
    if (roles.length === 0) {
      throw new DomainError('iam.no_role', 'A user needs at least one role')
    }

    await this.unitOfWork.run((transaction) =>
      this.assignments.replace(transaction, input.userId, roles.filter(isRole))
    )
  }
}
