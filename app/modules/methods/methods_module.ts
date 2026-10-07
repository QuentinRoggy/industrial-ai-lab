import { catalogModule } from '#modules/catalog/catalog_module'
import type { AccessControl } from '#modules/iam/application/access_control'
import { iamModule } from '#modules/iam/iam_module'
import { CreateWorkCentre } from '#modules/methods/application/create_work_centre'
import {
  ApproveRouting,
  DraftRouting,
  MakeRoutingObsolete,
  ReviseRouting,
} from '#modules/methods/application/routing_commands'
import { LucidRoutingRepository } from '#modules/methods/infrastructure/lucid_routing_repository'
import { LucidWorkCentreRepository } from '#modules/methods/infrastructure/lucid_work_centre_repository'
import { RoutingQueries } from '#modules/methods/infrastructure/routing_queries'
import type { Clock } from '#shared/domain/clock'
import { LucidOutbox } from '#shared/infrastructure/lucid_outbox'
import { LucidUnitOfWork } from '#shared/infrastructure/lucid_unit_of_work'
import { SystemClock } from '#shared/infrastructure/system_clock'

export function methodsModule({
  clock = new SystemClock(),
  accessControl = iamModule().accessControl,
}: { clock?: Clock; accessControl?: AccessControl } = {}) {
  const unitOfWork = new LucidUnitOfWork()
  const workCentres = new LucidWorkCentreRepository()
  const routingDependencies = {
    accessControl,
    unitOfWork,
    routings: new LucidRoutingRepository(),
    workCentres,
    items: catalogModule({ clock, accessControl }).items,
    outbox: new LucidOutbox(),
    clock,
  }

  return {
    createWorkCentre: new CreateWorkCentre(accessControl, unitOfWork, workCentres, clock),
    draftRouting: new DraftRouting(routingDependencies),
    reviseRouting: new ReviseRouting(routingDependencies),
    approveRouting: new ApproveRouting(routingDependencies),
    makeRoutingObsolete: new MakeRoutingObsolete(routingDependencies),
    routings: new RoutingQueries(),
  }
}
