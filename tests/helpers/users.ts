import User from '#models/user'
import type { Role } from '#modules/iam/application/roles'
import { iamModule } from '#modules/iam/iam_module'

/**
 * Creates a user holding the given roles and returns it as an actor.
 */
export async function userWithRoles(email: string, roles: Role[]) {
  const user = await User.create({ email, password: 'secret-password' })
  await iamModule().seedRoles(user.id, roles)
  return { userId: user.id }
}
