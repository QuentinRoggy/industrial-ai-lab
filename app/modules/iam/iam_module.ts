import { AccessControl } from '#modules/iam/application/access_control'
import { AssignRoles } from '#modules/iam/application/assign_roles'
import type { Role } from '#modules/iam/application/roles'
import { LucidRoleAssignments } from '#modules/iam/infrastructure/lucid_role_assignments'
import { LucidUnitOfWork } from '#shared/infrastructure/lucid_unit_of_work'

export function iamModule() {
  const unitOfWork = new LucidUnitOfWork()
  const roleAssignments = new LucidRoleAssignments()
  const accessControl = new AccessControl(roleAssignments)

  return {
    accessControl,
    assignRoles: new AssignRoles(accessControl, unitOfWork, roleAssignments),
    rolesOf: (userId: number) => roleAssignments.rolesOf(userId),
    /**
     * Grants roles without a permission check. Only for seeding the first
     * administrator and for tests; never call it from a request.
     */
    seedRoles: (userId: number, roles: readonly Role[]) =>
      unitOfWork.run((transaction) => roleAssignments.replace(transaction, userId, roles)),
  }
}
