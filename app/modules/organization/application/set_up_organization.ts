import type { AccessControl, Actor } from '#modules/iam/application/access_control'
import type { OrganizationRepository } from '#modules/organization/domain/organization_repository'
import type { OrganizationView } from '#modules/organization/application/views'
import { Organization } from '#modules/organization/domain/organization'
import type { UnitOfWork } from '#shared/application/unit_of_work'
import type { Clock } from '#shared/domain/clock'
import { DomainError } from '#shared/domain/domain_error'

export class SetUpOrganization {
  constructor(
    private readonly accessControl: AccessControl,
    private readonly unitOfWork: UnitOfWork,
    private readonly organizations: OrganizationRepository,
    private readonly clock: Clock
  ) {}

  async execute(actor: Actor, input: { name: string }): Promise<OrganizationView> {
    await this.accessControl.ensure(actor, 'organization.set_up')

    return this.unitOfWork.run(async (transaction) => {
      if (await this.organizations.current(transaction)) {
        throw new DomainError('organization.already_set_up', 'The organization is already set up')
      }

      const organization = Organization.create(input.name)
      await this.organizations.add(transaction, organization, this.clock.now())

      return { id: organization.id, name: organization.name }
    })
  }
}
