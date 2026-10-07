import { duplicateWorkCentreCode, type WorkCentre } from '#modules/methods/domain/work_centre'
import type { WorkCentreRepository } from '#modules/methods/domain/work_centre_repository'
import { WorkCentreRecord } from '#modules/methods/infrastructure/work_centre_record'
import type { Transaction } from '#shared/application/unit_of_work'
import { lucidClient } from '#shared/infrastructure/lucid_unit_of_work'
import { isUniqueViolation } from '#shared/infrastructure/unique_violation'
import { DateTime } from 'luxon'

export class LucidWorkCentreRepository implements WorkCentreRepository {
  async existsWithCode(transaction: Transaction, code: string): Promise<boolean> {
    const record = await WorkCentreRecord.query({ client: lucidClient(transaction) })
      .where('code', code)
      .first()
    return record !== null
  }

  async missingIds(transaction: Transaction, ids: readonly string[]): Promise<string[]> {
    const unique = [...new Set(ids)]
    const found = await WorkCentreRecord.query({ client: lucidClient(transaction) })
      .whereIn('id', unique)
      .select('id')
    const foundIds = new Set(found.map((record) => record.id))
    return unique.filter((id) => !foundIds.has(id))
  }

  async add(transaction: Transaction, workCentre: WorkCentre, createdAt: Date): Promise<void> {
    try {
      await WorkCentreRecord.create(
        {
          id: workCentre.id,
          code: workCentre.code,
          name: workCentre.name,
          createdAt: DateTime.fromJSDate(createdAt),
        },
        { client: lucidClient(transaction) }
      )
    } catch (error) {
      if (isUniqueViolation(error)) throw duplicateWorkCentreCode(workCentre.code)
      throw error
    }
  }
}
