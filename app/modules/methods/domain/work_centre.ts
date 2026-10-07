import { parseCode } from '#shared/domain/code'
import { DomainError } from '#shared/domain/domain_error'
import { generateId } from '#shared/domain/identifier'

export class WorkCentre {
  private constructor(
    readonly id: string,
    readonly code: string,
    readonly name: string
  ) {}

  static create(code: string, name: string): WorkCentre {
    const trimmed = name.trim()
    if (trimmed === '') {
      throw new DomainError('methods.work_centre_without_name', 'A work centre needs a name')
    }

    return new WorkCentre(
      generateId(),
      parseCode(code, {
        maxLength: 20,
        invalid: () =>
          new DomainError('methods.invalid_work_centre_code', `Invalid work centre code "${code}"`),
      }),
      trimmed
    )
  }
}

export function duplicateWorkCentreCode(code: string): DomainError {
  return new DomainError(
    'methods.duplicate_work_centre_code',
    `Work centre code "${code}" is already used`
  )
}
