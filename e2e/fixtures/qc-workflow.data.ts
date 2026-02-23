/**
 * Dynamic test data generator for QC workflow tests.
 * Generates random data per run to avoid stale/colliding test state.
 */

function randomSuffix(): string {
  return Math.random().toString(36).substring(2, 8);
}

function randomTimestamp(): number {
  return Date.now();
}

export function generateSessionData(): {
  name: string;
  description: string;
} 

{
  const suffix = randomSuffix();
  return {
    name: `QC-Session-${suffix}-${randomTimestamp()}`,
    description: `Auto-generated QC test session ${suffix}`,
  };
}

export function generateApprovalLevelData(): {
  levelCount: number;
  maxLevels: number;
} {
  return {
    levelCount: Math.floor(Math.random() * 3) + 1, // 1-3 random levels
    maxLevels: 5,
  };
}

export const QC_FIXTURE = {
  session: generateSessionData,
  approvalLevel: generateApprovalLevelData,
} as const;
