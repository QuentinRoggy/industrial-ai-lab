import type { SiteRepository } from '#modules/organization/domain/site_repository'
import type { Site } from '#modules/organization/domain/site'
import { duplicateSiteCode, type SiteCode } from '#modules/organization/domain/site_code'
import { SiteRecord } from '#modules/organization/infrastructure/site_record'
import type { Transaction } from '#shared/application/unit_of_work'
import { lucidClient } from '#shared/infrastructure/lucid_unit_of_work'
import { isUniqueViolation } from '#shared/infrastructure/unique_violation'
import { DateTime } from 'luxon'

export class LucidSiteRepository implements SiteRepository {
  async existsWithCode(transaction: Transaction, code: SiteCode): Promise<boolean> {
    const record = await SiteRecord.query({ client: lucidClient(transaction) })
      .where('code', code.toString())
      .first()

    return record !== null
  }

  async add(transaction: Transaction, site: Site, createdAt: Date): Promise<void> {
    try {
      await this.insert(transaction, site, createdAt)
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw duplicateSiteCode(site.code)
      }
      throw error
    }
  }

  private async insert(transaction: Transaction, site: Site, createdAt: Date) {
    await SiteRecord.create(
      {
        id: site.id,
        organizationId: site.organizationId,
        code: site.code.toString(),
        name: site.name,
        createdAt: DateTime.fromJSDate(createdAt),
      },
      { client: lucidClient(transaction) }
    )
  }
}
