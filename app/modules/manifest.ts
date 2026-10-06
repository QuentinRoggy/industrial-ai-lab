export const moduleNames = [
  'iam',
  'organization',
  'catalog',
  'methods',
  'inventory',
  'purchasing',
  'sales',
  'manufacturing',
  'quality',
  'documents',
  'simulation',
  'lab',
] as const

export type ModuleName = (typeof moduleNames)[number]
