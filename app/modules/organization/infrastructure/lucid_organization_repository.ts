import type { OrganizationRepository } from '#modules/organization/domain/organization_repository'
import { Organization } from '#modules/organization/domain/organization'
import { OrganizationRecord } from '#modules/organization/infrastructure/organization_record'
import type { Transaction } from '#shared/application/unit_of_work'
import { lucidClient } from '#shared/infrastructure/lucid_unit_of_work'
import { DateTime } from 'luxon'

export class LucidOrganizationRepository implements OrganizationRepository {
  async current(transaction: Transaction): Promise<Organization | null> {
    const record = await OrganizationRecord.query({ client: lucidClient(transaction) }).first()
    return record ? Organization.restore(record.id, record.name) : null
  }

  async add(transaction: Transaction, organization: Organization, createdAt: Date): Promise<void> {
    await OrganizationRecord.create(
      { id: organization.id, name: organization.name, createdAt: DateTime.fromJSDate(createdAt) },
      { client: lucidClient(transaction) }
    )
  }
}
