import type { WorkCentre } from '#modules/methods/domain/work_centre'
import type { Transaction } from '#shared/application/unit_of_work'

export interface WorkCentreRepository {
  existsWithCode(transaction: Transaction, code: string): Promise<boolean>
  missingIds(transaction: Transaction, ids: readonly string[]): Promise<string[]>
  add(transaction: Transaction, workCentre: WorkCentre, createdAt: Date): Promise<void>
}
