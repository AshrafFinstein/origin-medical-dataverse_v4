/**
 * Central export file for all page objects
 * Import page objects from here for consistency
 */

// Core Module Pages
export { BasePage } from './base.page';
export { EpicPage } from './epic.page';
export { ProjectPage } from './project.page';
export { SessionPage } from './session.page';
export { DataLabellingPage } from './data-labelling.page';
export { ClinicalEvaluationPage } from './clinical-evaluation.page';

// Masters Pages
export { LabelPage } from './masters/label.page';
export { AnnotationPage } from './masters/annotation.page';
export { TaxonomyPage } from './masters/taxonomy.page';

// Type exports
export type { EpicData, EpicSearchCriteria } from './epic.page';
export type { ProjectData, ProjectSearchCriteria } from './project.page';
export type { SessionData, SessionSearchCriteria, ImageSearchCriteria } from './session.page';
export type { AnnotationData as DLAnnotationData } from './data-labelling.page';
export type { ClinicalEvaluationData,  MeasurementData,  AssessmentData} from './clinical-evaluation.page';
export type { LabelData } from './masters/label.page';
export type { AnnotationData } from './masters/annotation.page';
export type { TaxonomyData } from './masters/taxonomy.page';
