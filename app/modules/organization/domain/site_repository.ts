import type { Site } from '#modules/organization/domain/site'
import type { SiteCode } from '#modules/organization/domain/site_code'
import type { Transaction } from '#shared/application/unit_of_work'

export interface SiteRepository {
  existsWithCode(transaction: Transaction, code: SiteCode): Promise<boolean>
  add(transaction: Transaction, site: Site, createdAt: Date): Promise<void>
}
