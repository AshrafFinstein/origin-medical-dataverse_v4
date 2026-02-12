import common from './common.json';
import epic from './epic.json';
import project from './project.json';
import session from './session.json';
import dataLabelling from './dataLabelling.json';
import clinicalEvaluation from './clinicalEvaluation.json';
import label from './label.json';
import annotation from './annotation.json';
import taxonomy from './taxonomy.json';
import structure from './structure.json';
import sessionCodes from './sessionCodes.json';
import users from './users.json';
import userGroup from './userGroup.json';

// Type-safe selector interfaces
export interface Selectors {
  common: typeof common;
  epic: typeof epic;
  project: typeof project;
  session: typeof session;
  dataLabelling: typeof dataLabelling;
  clinicalEvaluation: typeof clinicalEvaluation;
  label: typeof label;
  annotation: typeof annotation;
  taxonomy: typeof taxonomy;
  structure: typeof structure;
  sessionCodes: typeof sessionCodes;
  users: typeof users;
  userGroup: typeof userGroup;
}

// Granular exports as requested
export const CommonSelectors = common;
export const EpicSelectors = epic;
export const ProjectSelectors = project;
export const SessionSelectors = session;
export const DataLabellingSelectors = dataLabelling;
export const ClinicalEvaluationSelectors = clinicalEvaluation;
export const LabelSelectors = label;
export const AnnotationSelectors = annotation;
export const TaxonomySelectors = taxonomy;
export const StructureSelectors = structure;
export const SessionCodeSelectors = sessionCodes;
export const UsersSelectors = users;
export const UserGroupSelectors = userGroup;

// Combined export
export const Selectors: Selectors = {
  common,
  epic,
  project,
  session,
  dataLabelling,
  clinicalEvaluation,
  label,
  annotation,
  taxonomy,
  structure,
  sessionCodes,
  users,
  userGroup,
};

/**
 * Helper function to replace dynamic placeholders like {index}, ${index}, etc.
 *
 * Usage:
 * const selector = getDynamicSelector('[data-testid="epic-table-row-${index}"]', { index: 0 });
 * // Returns: '[data-testid="epic-table-row-0"]'
 *
 * @param selector - The selector string with placeholders
 * @param replacements - Object mapping placeholder names to values
 * @returns The selector with all placeholders replaced
 */
export function getDynamicSelector(
  selector: string,
  replacements: Record<string, string | number>
): string {
  let result = selector;
  for (const [key, value] of Object.entries(replacements)) {
    // Replace both {key} and ${key} formats
    result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), value.toString());
    result = result.replace(new RegExp(`\\$\\{${key}\\}`, 'g'), value.toString());
  }
  return result;
}

/**
 * Helper function to get a nested selector by path
 *
 * Usage:
 * const selector = getSelector(Selectors, 'epic.epic-create.button');
 * // Returns: '[data-testid="epic-create-button"]'
 *
 * @param selectors - The selectors object
 * @param path - Dot-separated path to the selector
 * @returns The selector string
 */
export function getSelector(selectors: Selectors, path: string): string {
  const parts = path.split('.');
  let current: any = selectors;

  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      throw new Error(`Selector not found: ${path}`);
    }
  }

  if (typeof current !== 'string') {
    throw new Error(`Selector path does not resolve to a string: ${path}`);
  }

  return current;
}

export default Selectors;
