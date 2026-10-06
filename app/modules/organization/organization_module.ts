import type { AccessControl } from '#modules/iam/application/access_control'
import { iamModule } from '#modules/iam/iam_module'
import { CreateSite } from '#modules/organization/application/create_site'
import { SetUpOrganization } from '#modules/organization/application/set_up_organization'
import { LucidOrganizationRepository } from '#modules/organization/infrastructure/lucid_organization_repository'
import { LucidSiteRepository } from '#modules/organization/infrastructure/lucid_site_repository'
import { SiteQueries } from '#modules/organization/infrastructure/site_queries'
import type { Clock } from '#shared/domain/clock'
import { LucidOutbox } from '#shared/infrastructure/lucid_outbox'
import { LucidUnitOfWork } from '#shared/infrastructure/lucid_unit_of_work'
import { SystemClock } from '#shared/infrastructure/system_clock'

export function organizationModule({
  clock = new SystemClock(),
  accessControl = iamModule().accessControl,
}: { clock?: Clock; accessControl?: AccessControl } = {}) {
  const unitOfWork = new LucidUnitOfWork()
  const organizations = new LucidOrganizationRepository()

  return {
    setUpOrganization: new SetUpOrganization(accessControl, unitOfWork, organizations, clock),
    createSite: new CreateSite(
      accessControl,
      unitOfWork,
      organizations,
      new LucidSiteRepository(),
      new LucidOutbox(),
      clock
    ),
    sites: new SiteQueries(),
  }
}
