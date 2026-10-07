import type { DefinitionStatus } from '#modules/methods/domain/routing_version'

export interface WorkCentreView {
  id: string
  code: string
  name: string
}

export interface OperationView {
  sequence: number
  workCentreId: string
  setupMinutes: string
  runMinutesPerUnit: string
}

export interface RoutingView {
  id: string
  itemId: string
  number: number
  status: DefinitionStatus
  effectiveFrom: string | null
  operations: OperationView[]
}
