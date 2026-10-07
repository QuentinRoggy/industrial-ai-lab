import type { AccessControl, Actor } from '#modules/iam/application/access_control'
import type { WorkCentreView } from '#modules/methods/application/views'
import { duplicateWorkCentreCode, WorkCentre } from '#modules/methods/domain/work_centre'
import type { WorkCentreRepository } from '#modules/methods/domain/work_centre_repository'
import type { UnitOfWork } from '#shared/application/unit_of_work'
import type { Clock } from '#shared/domain/clock'

export class CreateWorkCentre {
  constructor(
    private readonly accessControl: AccessControl,
    private readonly unitOfWork: UnitOfWork,
    private readonly workCentres: WorkCentreRepository,
    private readonly clock: Clock
  ) {}

  async execute(actor: Actor, input: { code: string; name: string }): Promise<WorkCentreView> {
    await this.accessControl.ensure(actor, 'methods.create_work_centre')

    return this.unitOfWork.run(async (transaction) => {
      const workCentre = WorkCentre.create(input.code, input.name)
      if (await this.workCentres.existsWithCode(transaction, workCentre.code)) {
        throw duplicateWorkCentreCode(workCentre.code)
      }

      await this.workCentres.add(transaction, workCentre, this.clock.now())
      return { id: workCentre.id, code: workCentre.code, name: workCentre.name }
    })
  }
}
