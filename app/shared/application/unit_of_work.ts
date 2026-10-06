export const transactionMarker: unique symbol = Symbol('Transaction')

/**
 * Opaque handle on the current business transaction. Repositories and the
 * outbox receive it so that every write of a use case commits or rolls back
 * together.
 */
export interface Transaction {
  readonly [transactionMarker]: true
}

export interface UnitOfWork {
  run<T>(work: (transaction: Transaction) => Promise<T>): Promise<T>
}
