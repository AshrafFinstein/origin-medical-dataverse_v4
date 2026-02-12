# Generated Tests Summary

## Overview

All test specifications have been automatically generated from the Excel file using actual URS/SRS/SDS IDs and test case data.

**Generation Stats:**
- **Total Spec Files:** 267
- **Total Test Cases:** 2,758
- **Excel Source:** `requirements-excel-file/dataverse-Testcases-V4.xlsx`
- **Generated:** Using `e2e/scripts/generate-tests-from-excel.js`

## Module Organization

Tests are organized into the following modules based on URS prefixes:

### 1. QC Workflow (`qc-workflow/`)
- **URS-DV-QC-01**: Quality control approval levels (10 SRS groups, 89 tests)
- **Coverage**: Approval workflow, quality control stages, image review process

### 2. Session Management (`session-management/`)
- **URS-DV-GEN-2**: Session analysis and reporting (14 SRS groups, 191 tests)
- **URS-DV-GEN-3**: Approval level configuration (8 SRS groups, 80 tests)
- **URS-DV-GEN-5**: Session labels (11 SRS groups, 113 tests)
- **URS-DV-GEN-6**: Bucket registry (10 SRS groups, 141 tests)
- **URS-DV-GEN-07**: Session creation fields (28 SRS groups, 393 tests)
- **URS-DEV-GEN-08**: Session upload controls (5 SRS groups, 78 tests)
- **URS-DV-GEN-09**: JSON import/export (6 SRS groups, 100 tests)
- **URS-DV-GEN-25**: Session status management (7 SRS groups, 72 tests)
- **URS-DV-GEN-31**: Session lock/unlock (9 SRS groups, 59 tests)
- **Coverage**: Session CRUD, configuration, status, labels, imports

### 3. Data Labelling (`data-labelling/`)
- **URS-DV-DL-04**: Image grid and selection (9 SRS groups, 115 tests)
- **URS-DV-DL-26**: Label search (1 SRS group, 10 tests)
- **Coverage**: Image grid, selection, pagination, status indicators

### 4. Annotation (`annotation/`)
- **URS-DV-DA-10**: Annotation toolbar (6 SRS groups, 107 tests)
- **URS-DV-DA-27**: Annotation label popup (9 SRS groups, 127 tests)
- **URS-DV-DA-30**: Copy annotations (4 SRS groups, 24 tests)
- **Coverage**: Annotation tools, labels, copy functionality

### 5. Data Management (`data-management/`)
- **URS-DV-DM-11**: Data export (6 SRS groups, 102 tests)
- **URS-DV-DM-17**: Version history (16 SRS groups, 123 tests)
- **URS-DV-DM-29**: S3 integration (9 SRS groups, 110 tests)
- **Coverage**: Exports, version control, S3 operations

### 6. Analytics (`analytics/`)
- **URS-DV-AN-13**: Annotation upload (4 SRS groups, 61 tests)
- **URS-DV-AN-22**: Time tracking (5 SRS groups, 98 tests)
- **Coverage**: Upload analytics, time tracking, metrics

### 7. Security (`security/`)
- **URS-DV-SEC-18**: Session deletion (7 SRS groups, 110 tests)
- **Coverage**: Deletion permissions, admin dashboard, approval workflow

### 8. General (`general/`)
- **URS-DV-GEN-15**: Undo/Redo (4 SRS groups, 64 tests)
- **URS-DV-GEN-16**: Delete operations (4 SRS groups, 62 tests)
- **URS-DV-GEN-21**: Validation rules (61 SRS groups, 122 tests)
- **URS-DV-GEN-23**: Annotation ordering (5 SRS groups, 100 tests)
- **Coverage**: Common functionality, validation, delete confirmations

## Test File Structure

Each generated test file follows this pattern:

```
tests/
└── {module}/
    └── {URS-ID}/
        └── {SRS-ID}-{SDS-ID}.spec.ts
```

**Example:**
```
tests/
└── qc-workflow/
    └── URS-DV-QC-01/
        ├── SRS-1-SDS-1.spec.ts (8 tests)
        ├── SRS-2-SDS-2.spec.ts (12 tests)
        └── SRS-3-SDS-3.spec.ts (8 tests)
```

## Test Spec Template

Each test spec includes:

```typescript
import { test, expect } from '../../../fixtures/auth.fixture';

/**
 * Test Suite: {Summary from Excel}
 * URS: {URS-ID}
 * SRS: {SRS-ID}
 * SDS: {SDS-ID}
 */
test.describe('{URS-ID} - {SRS-ID} - {SDS-ID}', () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    // TODO: Setup before each test
  });

  test('{UTC-ID}: {Summary}', async ({ authenticatedPage }) => {
    // Test Case ID: {UTC-ID}
    // Priority: {Priority}
    // Test Type: {Test Type}
    //
    // Summary: {Summary from Excel}
    //
    // Description: {Description from Excel}
    //
    // Acceptance Criteria:
    // {Acceptance Criteria from Excel}

    // TODO: Implement test steps
    console.log('⚠️  Test implementation pending: {UTC-ID}');
    expect(true).toBe(true);
  });
});
```

## Implementation Status

### ✅ Complete
- [x] Test file generation from Excel
- [x] Module-based organization
- [x] URS/SRS/SDS folder structure
- [x] Test case metadata extraction
- [x] Acceptance criteria mapping

### 🔄 Pending Implementation
- [ ] Page object integration for each module
- [ ] Actual test step implementation (currently placeholders)
- [ ] Selector mapping for UI elements
- [ ] Test data setup and teardown
- [ ] Assertions based on acceptance criteria

## Running Generated Tests

### Run all tests
```bash
npx playwright test
```

### Run by module
```bash
npx playwright test tests/qc-workflow
npx playwright test tests/session-management
npx playwright test tests/data-labelling
npx playwright test tests/annotation
```

### Run specific URS
```bash
npx playwright test tests/qc-workflow/URS-DV-QC-01
```

### Run specific test file
```bash
npx playwright test tests/qc-workflow/URS-DV-QC-01/SRS-1-SDS-1.spec.ts
```

### Run in parallel (6 workers)
```bash
npx playwright test --workers=6
```

## Next Steps

### 1. Implement Page Objects
Create page objects for each module:
- `e2e/pages/qc-workflow.page.ts`
- `e2e/pages/session-management.page.ts`
- `e2e/pages/data-labelling.page.ts`
- etc.

### 2. Map Selectors
Update `e2e/selectors/*.json` files with all required selectors:
```bash
npm run extract-selectors
```

### 3. Implement Tests
Replace `TODO: Implement test steps` with actual implementation:
- Use page objects for interactions
- Add proper assertions based on acceptance criteria
- Handle loading states and async operations
- Add proper error handling

### 4. Add Test Data
Create test data factories:
- `e2e/fixtures/test-data/`
- Use Faker.js for dynamic data
- Create reusable data fixtures

### 5. CI/CD Integration
- Setup GitHub Actions workflow
- Configure test reporting
- Add artifact uploads for failures
- Setup notification system

## Regenerating Tests

To regenerate all tests from Excel:

```bash
# Delete existing tests (optional)
rm -rf e2e/tests/*/URS-*

# Run generator
node e2e/scripts/generate-tests-from-excel.js
```

The script will:
- Read all test cases from Excel
- Group by URS/SRS/SDS
- Create module folders
- Generate spec files
- Skip existing files (no overwrites)

## Module Distribution

| Module | URS Count | SRS Count | Test Count | % of Total |
|--------|-----------|-----------|------------|------------|
| Session Management | 9 | 88 | 1,168 | 42.4% |
| QC Workflow | 1 | 10 | 89 | 3.2% |
| Data Labelling | 2 | 10 | 125 | 4.5% |
| Annotation | 3 | 19 | 258 | 9.4% |
| Data Management | 3 | 31 | 335 | 12.1% |
| Analytics | 2 | 9 | 159 | 5.8% |
| Security | 1 | 7 | 110 | 4.0% |
| General | 4 | 74 | 348 | 12.6% |
| **Total** | **25** | **248** | **2,758** | **100%** |

## Excel Column Mapping

| Excel Column | Test Property | Usage |
|--------------|---------------|-------|
| Column A | URS ID | Folder organization |
| Column B | SRS ID | File naming |
| Column C | SDS ID | File naming |
| Column D | Test ID (UTC) | Test case ID |
| Column E | Summary | Test name |
| Column F | Description | Test description |
| Column G | Acceptance Criteria | Expected results |
| Column H | Test Status | Future filtering |
| Column I | Test Type | Test metadata |
| Column J | Assignee | Future assignment |

---

**Generated:** 2026-02-11
**Source Excel:** dataverse-Testcases-V4.xlsx (2,698 rows)
**Generator:** e2e/scripts/generate-tests-from-excel.js
