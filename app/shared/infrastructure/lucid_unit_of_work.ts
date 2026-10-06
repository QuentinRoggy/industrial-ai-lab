import {
  transactionMarker,
  type Transaction,
  type UnitOfWork,
} from '#shared/application/unit_of_work'
import db from '@adonisjs/lucid/services/db'
import type { TransactionClientContract } from '@adonisjs/lucid/types/database'

class LucidTransaction implements Transaction {
  readonly [transactionMarker] = true as const

  constructor(readonly client: TransactionClientContract) {}
}

export class LucidUnitOfWork implements UnitOfWork {
  run<T>(work: (transaction: Transaction) => Promise<T>): Promise<T> {
    return db.transaction((client) => work(new LucidTransaction(client)))
  }
}

/**
 * Gives infrastructure code the Lucid client behind a transaction opened by
 * `LucidUnitOfWork`.
 */
export function lucidClient(transaction: Transaction): TransactionClientContract {
  if (!(transaction instanceof LucidTransaction)) {
    throw new Error('The transaction was not opened by LucidUnitOfWork')
  }

  return transaction.client
}
