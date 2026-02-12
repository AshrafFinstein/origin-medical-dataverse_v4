# Page Objects - Dataverse E2E Framework

This directory contains all page object models for the Dataverse application, organized by module.

## 📁 Directory Structure

```
pages/
├── base.page.ts                      # Base page class with common methods
├── epic.page.ts                      # Epic management
├── project.page.ts                   # Project management
├── session.page.ts                   # Session management (DL & CE)
├── data-labelling.page.ts            # Data Labeling session interactions
├── clinical-evaluation.page.ts       # Clinical Evaluation session interactions
├── masters/                          # Master data pages
│   ├── label.page.ts                 # Label master
│   ├── annotation.page.ts            # Annotation master
│   └── taxonomy.page.ts              # Taxonomy master
├── index.ts                          # Central export file
└── README.md                         # This file
```

## 🎯 Page Object Overview

### Core Module Pages

| Page Object | Module | Purpose | Key Methods |
|-------------|--------|---------|-------------|
| **EpicPage** | Epic Management | Top-level organizational units | `createEpic()`, `searchEpic()`, `deleteEpic()` |
| **ProjectPage** | Project Management | Projects within Epics | `createProject()`, `searchProject()`, `removeUserFromProject()` |
| **SessionPage** | Session Management | DL and CE sessions | `createSession()`, `searchSession()`, `configureSessionCodes()` |
| **DataLabellingPage** | Data Labeling | Image annotation and labeling | `createAnnotation()`, `selectLabel()`, `lockVisualization()` |
| **ClinicalEvaluationPage** | Clinical Evaluation | Clinical data evaluation | `recordMeasurement()`, `selectAssessmentOption()`, `addComment()` |

### Masters Pages

| Page Object | Module | Purpose | Key Methods |
|-------------|--------|---------|-------------|
| **LabelPage** | Label Master | Classification labels | `createLabel()`, `exportLabels()` |
| **AnnotationPage** | Annotation Master | Annotation types | `createAnnotation()`, `updateAnnotation()` |
| **TaxonomyPage** | Taxonomy Master | Hierarchical classifications | `createTaxonomy()`, `addAnnotationToTaxonomy()` |

## 🚀 Quick Start

### Basic Usage

```typescript
import { test, expect } from '../fixtures/auth.fixture';
import { EpicPage, ProjectPage } from '../pages';

test('Create Epic and Project', async ({ authenticatedPage }) => {
  // Create Epic
  const epicPage = new EpicPage(authenticatedPage);
  await epicPage.goto();
  await epicPage.createEpic({
    name: 'Test Epic',
    description: 'Epic description'
  });

  // Navigate to Epic and create Project
  await epicPage.navigateToEpic(1);

  const projectPage = new ProjectPage(authenticatedPage);
  await projectPage.createProject({
    name: 'Test Project',
    assignees: ['all']
  });
});
```

## 📖 Detailed Documentation

### BasePage

All page objects extend `BasePage` which provides common functionality:

**Navigation Methods:**
- `goto(url)` - Navigate to URL and wait for page load
- `navigateBack()` - Navigate back
- `waitForPageLoad()` - Wait for DOM and network idle

**Interaction Methods:**
- `click(selector)` - Click element
- `fill(selector, value)` - Fill input field
- `selectOption(selector, value)` - Select dropdown option
- `check(selector)` / `uncheck(selector)` - Checkbox operations

**Wait Helpers:**
- `waitForSelector(selector)` - Wait for element
- `waitForToast(type)` - Wait for success/error toast
- `waitForLoadingComplete()` - Wait for loading spinners
- `waitForModalOpen()` / `waitForModalClose()` - Wait for modals

**Table Helpers:**
- `getTableRowCount(tableSelector)` - Get row count
- `getTableCellText(tableSelector, row, col)` - Get cell text
- `clickTableCell(tableSelector, row, col)` - Click cell

---

### EpicPage

**Purpose:** Manage Epics (top-level organizational units)

**Constructor:**
```typescript
const epicPage = new EpicPage(page);
```

**Methods:**

```typescript
// Navigation
await epicPage.goto();
await epicPage.navigateToEpic(rowIndex);
await epicPage.navigateToEpicByName('Epic Name');

// CRUD Operations
await epicPage.createEpic({
  name: 'Epic Name',
  description: 'Description'
});

await epicPage.updateEpic(index, { name: 'New Name' });
await epicPage.deleteEpic(index);

// Search
await epicPage.searchEpic({ searchTerm: 'search term' });

// Validation
const exists = await epicPage.epicExists('Epic Name');
const count = await epicPage.getEpicCount();
const name = await epicPage.getEpicName(0);
```

**Example:**
```typescript
test('Epic CRUD operations', async ({ authenticatedPage }) => {
  const epicPage = new EpicPage(authenticatedPage);
  await epicPage.goto();

  // Create
  await epicPage.createEpic({
    name: `Test Epic ${Date.now()}`,
    description: 'Test description'
  });

  // Verify
  expect(await epicPage.epicExists('Test Epic')).toBe(true);

  // Search
  await epicPage.searchEpic({ searchTerm: 'Test' });
});
```

---

### ProjectPage

**Purpose:** Manage Projects within Epics

**Constructor:**
```typescript
const projectPage = new ProjectPage(page);
```

**Methods:**

```typescript
// Navigation
await projectPage.goto(epicId);
await projectPage.navigateBack();
await projectPage.navigateToHome();
await projectPage.navigateToProject(rowIndex);

// CRUD Operations
await projectPage.createProject({
  name: 'Project Name',
  description: 'Description',
  assignees: ['user1', 'user2'] // or ['all']
});

// Search
await projectPage.searchProject({ searchTerm: 'search term' });

// User Management
await projectPage.removeUserFromProject();
await projectPage.cancelUserRemoval();

// Delete
await projectPage.deleteProject('Project Name');
await projectPage.cancelProjectDeletion();
```

**Example:**
```typescript
test('Create project with assignees', async ({ authenticatedPage }) => {
  const projectPage = new ProjectPage(authenticatedPage);
  await projectPage.goto();

  await projectPage.createProject({
    name: 'Test Project',
    description: 'Project for testing',
    assignees: ['all']
  });

  expect(await projectPage.projectExists('Test Project')).toBe(true);
});
```

---

### SessionPage

**Purpose:** Manage Data Labeling and Clinical Evaluation sessions

**Constructor:**
```typescript
const sessionPage = new SessionPage(page);
```

**Methods:**

```typescript
// Navigation
await sessionPage.goto(projectId);
await sessionPage.navigateBack();
await sessionPage.navigateToHome();

// Create Session
await sessionPage.createSession({
  name: 'Session Name',
  description: 'Description',
  autoGenerate: false,
  status: 'active',
  sessionCodes: {
    projectCode: 'PC01',
    subProjectCode: 'SPC01'
  },
  assignees: ['all'],
  reviewers: ['reviewer1'],
  labels: ['label1', 'label2']
});

// Generate name automatically
await sessionPage.generateSessionName();

// Search
await sessionPage.searchSession({ searchTerm: 'session' });
await sessionPage.searchImages({ searchTerm: 'image', count: 10 });

// Import/Export
await sessionPage.importCSV('/path/to/file.csv');
await sessionPage.uploadToS3('s3://bucket/key');

// Session Labels
await sessionPage.createSessionLabel('Label Name', 'Description', '#FF0000');

// Delete
await sessionPage.requestSessionDeletion('Deletion reason');

// Session Codes
await sessionPage.navigateToSessionCodesTab('project');
```

**Example:**
```typescript
test('Create DL session with codes', async ({ authenticatedPage }) => {
  const sessionPage = new SessionPage(authenticatedPage);
  await sessionPage.goto();

  await sessionPage.createSession({
    name: 'DL Session Test',
    autoGenerate: true,
    sessionCodes: {
      projectCode: 'PC01',
      useCaseCode: 'UC01'
    },
    assignees: ['all'],
    labels: ['Tumor', 'Normal']
  });
});
```

---

### DataLabellingPage

**Purpose:** Interact with Data Labeling sessions (image annotation)

**Constructor:**
```typescript
const dlPage = new DataLabellingPage(page);
```

**Methods:**

```typescript
// Visualization
await dlPage.lockVisualization();
await dlPage.unlockVisualization();
await dlPage.invertColors(true);

// Annotation
await dlPage.openAnnotationTools();
await dlPage.createAnnotation({
  label: 'Tumor',
  coordinates: { x: 100, y: 100, width: 50, height: 50 }
});

await dlPage.selectLabel('Label Name');
await dlPage.toggleMarkerMode();

// Annotation Management
await dlPage.deleteAnnotation(true);
await dlPage.copyAnnotation(false);

// Navigation
await dlPage.navigateToNextImage();
await dlPage.navigateToPreviousImage();
await dlPage.navigateToImage(5);

// Save/Discard
await dlPage.handleUnsavedChanges('save');
await dlPage.handleUnsavedChangesBeforeQC('save');

// Keyboard Shortcuts
await dlPage.useShortcut('delete');
await dlPage.useShortcut('undo');

// Validation
const count = await dlPage.getAnnotationCount();
const imageInfo = await dlPage.getCurrentImageInfo();
```

**Example:**
```typescript
test('Create annotations', async ({ authenticatedPage }) => {
  const dlPage = new DataLabellingPage(authenticatedPage);
  await dlPage.goto('session-id');

  await dlPage.waitForImageLoad();

  await dlPage.createAnnotation({
    label: 'Tumor',
    coordinates: { x: 100, y: 100, width: 200, height: 200 }
  });

  expect(await dlPage.getAnnotationCount()).toBeGreaterThan(0);
});
```

---

### ClinicalEvaluationPage

**Purpose:** Perform clinical evaluations with measurements and assessments

**Constructor:**
```typescript
const cePage = new ClinicalEvaluationPage(page);
```

**Methods:**

```typescript
// Form
await cePage.openEditForm();
const isOpen = await cePage.isEditFormVisible();

// Comments
await cePage.addComment('Clinical findings...');
const comment = await cePage.getComment();

// Sections
await cePage.toggleSectionVisibility(0);
const legend = await cePage.getSectionLegend(0);

// Measurements
await cePage.recordMeasurement({
  sectionIndex: 0,
  measurementIndex: 0,
  value: 12.5,
  isUnreliable: false,
  visibility: true
});

await cePage.markMeasurementAsUnreliable({
  sectionIndex: 0,
  measurementIndex: 0,
  unreliable: true
});

// Assessments
await cePage.selectAssessmentOption({
  sectionIndex: 0,
  assessmentIndex: 0,
  optionName: 'Normal'
});

// Complete Evaluation
await cePage.completeClinicalEvaluation({
  comment: 'All measurements normal',
  measurements: { /* measurement data */ },
  assessments: { /* assessment data */ }
});

// Navigation
await cePage.navigateToNextCase();
await cePage.saveEvaluation();

// Validation
const isComplete = await cePage.areRequiredFieldsCompleted();
const errors = await cePage.getValidationErrors();
```

**Example:**
```typescript
test('Complete clinical evaluation', async ({ authenticatedPage }) => {
  const cePage = new ClinicalEvaluationPage(authenticatedPage);
  await cePage.goto('session-id');

  await cePage.addComment('Patient evaluation');

  await cePage.recordMeasurement({
    sectionIndex: 0,
    measurementIndex: 0,
    value: 15.2
  });

  await cePage.saveEvaluation();
});
```

---

### LabelPage, AnnotationPage, TaxonomyPage

**Purpose:** Manage master data for labels, annotations, and taxonomies

**Common Pattern:**

```typescript
// Label
const labelPage = new LabelPage(page);
await labelPage.goto();
await labelPage.createLabel({
  name: 'Tumor',
  abbreviation: 'TUM'
});
await labelPage.exportLabels();

// Annotation
const annotationPage = new AnnotationPage(page);
await annotationPage.goto();
await annotationPage.createAnnotation({
  name: 'Circle',
  abbreviation: 'CIR',
  taxonomyType: 'Point',
  color: '#FF0000'
});

// Taxonomy
const taxonomyPage = new TaxonomyPage(page);
await taxonomyPage.goto();
await taxonomyPage.createTaxonomy({
  name: 'Cardiac Structures',
  annotations: [
    { annotation: 'Left Ventricle', color: '#FF0000' },
    { annotation: 'Right Ventricle', color: '#00FF00' }
  ]
});
```

## 🎨 Best Practices

### 1. Always Use Page Objects

```typescript
// ✅ Good
const epicPage = new EpicPage(page);
await epicPage.createEpic({ name: 'Test' });

// ❌ Bad
await page.click('[data-testid="epic-create-button"]');
```

### 2. Use Type-Safe Data Interfaces

```typescript
// ✅ Good
const epicData: EpicData = {
  name: 'Test Epic',
  description: 'Description'
};
await epicPage.createEpic(epicData);

// ❌ Bad
await epicPage.createEpic({ name: 'Test' } as any);
```

### 3. Wait for Operations to Complete

```typescript
// ✅ Good
await epicPage.createEpic({ name: 'Test' });
await epicPage.waitForEpicTable();
expect(await epicPage.epicExists('Test')).toBe(true);

// ❌ Bad
await epicPage.createEpic({ name: 'Test' });
expect(await epicPage.epicExists('Test')).toBe(true); // Might fail due to timing
```

### 4. Use Descriptive Variable Names

```typescript
// ✅ Good
const epicPage = new EpicPage(authenticatedPage);
const projectPage = new ProjectPage(authenticatedPage);

// ❌ Bad
const page1 = new EpicPage(authenticatedPage);
const page2 = new ProjectPage(authenticatedPage);
```

## 🔧 Extending Page Objects

### Adding New Methods

```typescript
// In epic.page.ts
export class EpicPage extends BasePage {
  // ... existing methods

  /**
   * Your new method
   */
  async customMethod() {
    // Implementation
  }
}
```

### Creating New Page Objects

1. Create file: `e2e/pages/your-module.page.ts`
2. Extend `BasePage`
3. Add selectors from `e2e/selectors/`
4. Implement methods
5. Export from `index.ts`

Example:
```typescript
import { Page } from '@playwright/test';
import { BasePage } from './base.page';

export class YourModulePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await super.goto('/your-module');
  }

  // Your methods here
}
```

## 📚 Resources

- [Playwright Page Object Model](https://playwright.dev/docs/pom)
- [Base Page Source](./base.page.ts)
- [Selectors Documentation](../selectors/README.md)
- [Test Examples](../tests/generated/README.md)

---

**Created by Playwright E2E Automation Framework**
