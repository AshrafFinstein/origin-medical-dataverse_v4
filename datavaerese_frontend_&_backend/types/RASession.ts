import type { Prisma } from '@prisma/client'

export type RASessionWithUsers = Prisma.RASessionGetPayload<{
  include: { users: true }
}>

export type RASessionWithUsersAndWithoutTemplate = Prisma.RASessionGetPayload<{
  select: {
    id: true
    createdAt: true
    updatedAt: true
    name: true
    description: true
    priority: true
    users: true
  }
}>

export interface DropdownSelection {
  options: string[]
  value: string
}

export class Template {
  optimal: boolean | null = null
  normal: boolean | null = null
  agree: boolean | null = null
  bmi = ''
  ga = ''
  comment = ''
  query = false
  anomalyType: DropdownSelection = {
    options: [],
    value: '',
  }

  anomalyCode: DropdownSelection = {
    options: [],
    value: '',
  }

  reportIssue: DropdownSelection = {
    options: [],
    value: '',
  }

  doppler = false
  scanApproach: DropdownSelection = {
    options: [],
    value: '',
  }

  constructor(anomalyType?: DropdownSelection,
    anomalyCode?: DropdownSelection,
    reportIssue?: DropdownSelection,
    scanApproach?: DropdownSelection) {
    this.anomalyType = anomalyType ?? this.anomalyType
    this.anomalyCode = anomalyCode ?? this.anomalyCode
    this.reportIssue = reportIssue ?? this.reportIssue
    this.scanApproach = scanApproach ?? this.scanApproach
  }
}
