export const moduleNames = [
  'iam',
  'organization',
  'catalog',
  'methods',
  'inventory',
  'purchasing',
  'sales',
  'planning',
  'manufacturing',
  'quality',
  'documents',
  'simulation',
  'lab',
] as const

export type ModuleName = (typeof moduleNames)[number]
