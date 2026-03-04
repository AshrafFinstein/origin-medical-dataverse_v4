import common from './common.json';
import epic from './epic.json';
import project from './project.json';
import session from './session.json';
import dataLabelling from './dataLabelling.json';
import clinicalEvaluation from './clinicalEvaluation.json';
import label from './label.json';
import annotation from './annotation.json';
import copyAnnotation from './copyAnnotation.json';
import taxonomy from './taxonomy.json';
import structure from './structure.json';
import sessionCodes from './sessionCodes.json';
import users from './users.json';
import userGroup from './userGroup.json';
import qcWorkflow from './qcWorkflow.json';
import login from './login.json';
import sessionLock from './sessionLock.json';
import userRoles from './userRoles.json';
import rolePermissions from './rolePermissions.json';
import da27Annotation from './da27Annotation.json';

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
  copyAnnotation: typeof copyAnnotation;
  taxonomy: typeof taxonomy;
  structure: typeof structure;
  sessionCodes: typeof sessionCodes;
  users: typeof users;
  userGroup: typeof userGroup;
  qcWorkflow: typeof qcWorkflow;
  login: typeof login;
  sessionLock: typeof sessionLock;
  userRoles: typeof userRoles;
  rolePermissions: typeof rolePermissions;
  da27Annotation: typeof da27Annotation;
}

// Granular exports
export const CommonSelectors = common;
export const EpicSelectors = epic;
export const ProjectSelectors = project;
export const SessionSelectors = session;
export const DataLabellingSelectors = dataLabelling;
export const ClinicalEvaluationSelectors = clinicalEvaluation;
export const LabelSelectors = label;
export const AnnotationSelectors = annotation;
export const CopyAnnotationSelectors = copyAnnotation;
export const TaxonomySelectors = taxonomy;
export const StructureSelectors = structure;
export const SessionCodeSelectors = sessionCodes;
export const UsersSelectors = users;
export const UserGroupSelectors = userGroup;
export const QcWorkflowSelectors = qcWorkflow;
export const LoginSelectors = login;
export const SessionLockSelectors = sessionLock;
export const UserRolesSelectors = userRoles;
export const RolePermissionsSelectors = rolePermissions;
export const Da27AnnotationSelectors = da27Annotation;

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
  copyAnnotation,
  taxonomy,
  structure,
  sessionCodes,
  users,
  userGroup,
  qcWorkflow,
  login,
  sessionLock,
  userRoles,
  rolePermissions,
  da27Annotation,
};

/**
 * Helper function to replace dynamic placeholders like ${index} in selector values.
 *
 * Usage:
 * const selector = getDynamicSelector(TaxonomySelectors['taxonomy-annotation-row-${index}'], { index: 0 });
 * // Returns: 'taxonomy-annotation-row-0'
 */
export function getDynamicSelector(
  selector: string,
  replacements: Record<string, string | number>
): string {
  let result = selector;
  for (const [key, value] of Object.entries(replacements)) {
    result = result.replace(new RegExp(`\\$\\{${key}\\}`, 'g'), value.toString());
    result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), value.toString());
  }
  return result;
}

export default Selectors;
