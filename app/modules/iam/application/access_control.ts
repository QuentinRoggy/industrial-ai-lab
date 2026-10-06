import type { RoleAssignments } from '#modules/iam/domain/role_assignments'
import { rolePermissions, type Permission } from '#modules/iam/application/roles'

/**
 * The authenticated person on whose behalf a use case runs.
 */
export interface Actor {
  userId: number
}

export class AccessDenied extends Error {
  constructor(
    readonly actor: Actor,
    readonly permission: Permission
  ) {
    super(`User ${actor.userId} lacks permission "${permission}"`)
    this.name = 'AccessDenied'
  }
}

export class AccessControl {
  constructor(private readonly assignments: RoleAssignments) {}

  async ensure(actor: Actor, permission: Permission): Promise<void> {
    const roles = await this.assignments.rolesOf(actor.userId)

    if (!roles.some((role) => rolePermissions[role].includes(permission))) {
      throw new AccessDenied(actor, permission)
    }
  }
}
