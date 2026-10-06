import type { AccessControl, Actor } from '#modules/iam/application/access_control'
import type { OrganizationRepository } from '#modules/organization/domain/organization_repository'
import type { SiteRepository } from '#modules/organization/domain/site_repository'
import type { SiteView } from '#modules/organization/application/views'
import { Site } from '#modules/organization/domain/site'
import { duplicateSiteCode, SiteCode } from '#modules/organization/domain/site_code'
import type { Outbox } from '#shared/application/outbox'
import type { UnitOfWork } from '#shared/application/unit_of_work'
import type { Clock } from '#shared/domain/clock'
import { DomainError } from '#shared/domain/domain_error'

export class CreateSite {
  constructor(
    private readonly accessControl: AccessControl,
    private readonly unitOfWork: UnitOfWork,
    private readonly organizations: OrganizationRepository,
    private readonly sites: SiteRepository,
    private readonly outbox: Outbox,
    private readonly clock: Clock
  ) {}

  async execute(actor: Actor, input: { code: string; name: string }): Promise<SiteView> {
    await this.accessControl.ensure(actor, 'organization.create_site')

    return this.unitOfWork.run(async (transaction) => {
      const organization = await this.organizations.current(transaction)
      if (!organization) {
        throw new DomainError('organization.not_set_up', 'The organization is not set up yet')
      }

      const code = SiteCode.of(input.code)
      if (await this.sites.existsWithCode(transaction, code)) {
        throw duplicateSiteCode(code)
      }

      const site = Site.create(organization.id, code, input.name)
      const now = this.clock.now()

      await this.sites.add(transaction, site, now)
      await this.outbox.record(transaction, {
        name: 'organization.site_created',
        version: 1,
        occurredAt: now,
        payload: { siteId: site.id, code: site.code.toString() },
      })

      return { id: site.id, code: site.code.toString(), name: site.name }
    })
  }
}
