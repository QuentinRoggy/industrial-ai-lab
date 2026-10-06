import type { Organization } from '#modules/organization/domain/organization'
import type { Transaction } from '#shared/application/unit_of_work'

export interface OrganizationRepository {
  current(transaction: Transaction): Promise<Organization | null>
  add(transaction: Transaction, organization: Organization, createdAt: Date): Promise<void>
}
