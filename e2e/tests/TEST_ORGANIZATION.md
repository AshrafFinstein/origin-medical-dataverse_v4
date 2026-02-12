# Test Organization Guide

## 📁 Module-Based Test Structure

Tests are organized by **functional modules** rather than just URS/SRS/SDS numbers, making them easier to find, understand, and maintain.

```
tests/
├── login/                      # Authentication & Login (URS-DV-AUTH-001)
├── session-management/         # Session CRUD (URS-DV-GEN-002 to 006)
├── data-labelling/            # Data Labeling Tools (URS-DV-DL-007 to 013)
├── annotation/                # Annotation Management (URS-DV-DA-014, 015)
├── image-manipulation/        # Image Tools (URS-DV-GEN-016)
├── qc-workflow/              # Quality Control (URS-DV-QC-017)
├── json-operations/          # JSON Import/Export (URS-DV-GEN-018, 019)
└── shortcuts/                # Keyboard Shortcuts (URS-DV-GEN-020)
```

## 🎯 Module Descriptions

### 1. Login Module (`login/`)
**Purpose**: Authentication and session management

**Coverage**:
- User login/logout
- Session persistence
- Password validation
- Email format validation
- Remember me functionality

**URS Range**: URS-DV-AUTH-001

**Example Tests**:
- Valid credentials login
- Invalid credentials handling
- Empty field validation
- Email format validation

### 2. Session Management (`session-management/`)
**Purpose**: Session creation, configuration, and lifecycle

**Coverage**:
- Create DL and CE sessions
- Session code configuration
- Assignee and reviewer management
- Session status workflow
- Session search and filtering

**URS Range**: URS-DV-GEN-002 to 006

**Example Tests**:
- Create DL session
- Create CE session
- Configure session codes
- Assign users
- Session validation

### 3. Data Labelling (`data-labelling/`)
**Purpose**: Image annotation and labeling tools

**Coverage**:
- Annotation creation (rectangle, polygon, point)
- Label selection and application
- Visualization controls (zoom, pan, lock)
- Color inversion
- Image navigation
- Copy annotations
- Unsaved changes handling

**URS Range**: URS-DV-DL-007 to 013

**Example Tests**:
- Create rectangular annotation
- Lock/unlock visualization
- Navigate between images
- Copy annotations
- Handle unsaved changes

### 4. Annotation (`annotation/`)
**Purpose**: Annotation type master data management

**Coverage**:
- Create annotation types
- Update annotation types
- Color management
- Taxonomy type selection
- Export annotations

**URS Range**: URS-DV-DA-014, 015

**Example Tests**:
- Create annotation with color
- Update annotation
- Export annotations
- Taxonomy type validation

### 5. Image Manipulation (`image-manipulation/`)
**Purpose**: Image processing and manipulation tools

**Coverage**:
- Brightness/contrast adjustment
- Filters and effects
- Image rotation
- Zoom controls
- Reset to original

**URS Range**: URS-DV-GEN-016

**Example Tests**:
- Adjust brightness
- Apply filters
- Rotate image
- Zoom in/out

### 6. QC Workflow (`qc-workflow/`)
**Purpose**: Quality control and review processes

**Coverage**:
- QC approval/rejection
- Review comments
- QC status tracking
- Reviewer assignment
- QC reports

**URS Range**: URS-DV-QC-017

**Example Tests**:
- Approve annotations
- Reject with comments
- QC status transitions
- Generate QC report

### 7. JSON Operations (`json-operations/`)
**Purpose**: Import/export JSON data

**Coverage**:
- Import JSON annotations
- Export JSON annotations
- JSON validation
- Bulk operations

**URS Range**: URS-DV-GEN-018, 019

**Example Tests**:
- Import valid JSON
- Handle invalid JSON
- Export annotations
- Bulk import

### 8. Shortcuts (`shortcuts/`)
**Purpose**: Keyboard shortcuts and hotkeys

**Coverage**:
- Navigation shortcuts
- Annotation shortcuts
- Undo/redo
- Quick actions

**URS Range**: URS-DV-GEN-020

**Example Tests**:
- Arrow key navigation
- Delete annotation
- Undo/redo
- Save shortcut

## 📂 Directory Structure Pattern

Each module follows this structure:

```
module-name/
└── URS-DV-XXX-NNN/
    ├── SRS-NNN-SDS-001.spec.ts
    ├── SRS-NNN-SDS-002.spec.ts
    └── SRS-NNN-SDS-003.spec.ts
```

**Example**:
```
data-labelling/
├── URS-DV-DL-007/
│   ├── SRS-007-SDS-001.spec.ts    # Annotation creation tests
│   └── SRS-007-SDS-002.spec.ts    # Annotation editing tests
├── URS-DV-DL-008/
│   └── SRS-008-SDS-001.spec.ts    # Label management tests
└── URS-DV-DL-009/
    └── SRS-009-SDS-001.spec.ts    # Visualization tests
```

## 🏃 Running Tests by Module

### Run All Tests in a Module
```bash
# All login tests
npx playwright test tests/login

# All session management tests
npx playwright test tests/session-management

# All data labeling tests
npx playwright test tests/data-labelling
```

### Run Specific URS Tests
```bash
# Specific URS
npx playwright test tests/login/URS-DV-AUTH-001

# Specific SDS
npx playwright test tests/login/URS-DV-AUTH-001/SRS-001-SDS-001.spec.ts
```

### Run Tests in Parallel by Module
```bash
# 6 parallel workers for login tests
npx playwright test tests/login --workers=6

# 6 parallel workers for all tests
npx playwright test --workers=6
```

## 📝 Test File Naming Convention

**Format**: `SRS-{number}-SDS-{number}.spec.ts`

**Examples**:
- `SRS-001-SDS-001.spec.ts` - First software requirement, first design spec
- `SRS-002-SDS-001.spec.ts` - Second software requirement, first design spec
- `SRS-002-SDS-002.spec.ts` - Second software requirement, second design spec

## ✅ Test Case Naming Convention

**Format**: `UTC-{MODULE}-{number}`

**Modules**:
- `AUTH` - Authentication
- `SM` - Session Management
- `DL` - Data Labeling
- `ANN` - Annotation
- `IM` - Image Manipulation
- `QC` - Quality Control
- `JSON` - JSON Operations
- `SK` - Shortcuts

**Examples**:
- `UTC-AUTH-001` - Authentication test 1
- `UTC-DL-005` - Data Labeling test 5
- `UTC-QC-012` - QC Workflow test 12

## 🎨 Test Template

Each test file should follow this structure:

```typescript
import { test, expect } from '../../../fixtures/auth.fixture';
import { PageObject } from '../../../pages/page-object.page';

/**
 * Test Suite: [Module Name] - [Feature]
 * URS: URS-DV-XXX-NNN
 * SRS: SRS-NNN
 * SDS: SDS-NNN
 */
test.describe('[Module] - [Feature]', () => {
  let pageObject: PageObject;

  test.beforeEach(async ({ authenticatedPage }) => {
    pageObject = new PageObject(authenticatedPage);
    await pageObject.goto();
  });

  test('UTC-XXX-NNN: [Test description]', async ({ authenticatedPage }) => {
    // Test Case ID: UTC-XXX-NNN
    // Priority: high/medium/low
    // Test Type: Functional/Negative/Validation Testing
    //
    // Summary: [Brief description]
    //
    // Acceptance Criteria:
    // - [Criterion 1]
    // - [Criterion 2]

    // Test implementation
    await pageObject.someAction();

    // Assertions
    expect(result).toBe(expected);

    console.log('✅ Test passed');
  });
});
```

## 📊 Module Coverage Matrix

| Module | URS Count | Test Files | Test Cases | Status |
|--------|-----------|------------|------------|--------|
| Session Management | 9 | 88 | 1,168 | ✅ Generated |
| Data Management | 3 | 31 | 335 | ✅ Generated |
| Annotation | 3 | 19 | 258 | ✅ Generated |
| Data Labelling | 2 | 10 | 125 | ✅ Generated |
| Analytics | 2 | 9 | 159 | ✅ Generated |
| QC Workflow | 1 | 10 | 89 | ✅ Generated |
| Security | 1 | 7 | 110 | ✅ Generated |
| Login | 1 | 1 | 4 | ✅ Manual |
| **Total** | **22** | **175** | **2,248** | **Generated from Excel** |

**Note:** All tests generated from `requirements-excel-file/dataverse-Testcases-V4.xlsx` using actual URS/SRS/SDS IDs.

## 🔍 Finding Tests

### By Feature
If you know the feature you want to test:
1. Identify the module (e.g., "annotation creation" → `data-labelling/`)
2. Look for relevant URS folder
3. Open SDS spec files

### By URS ID
If you have a URS ID:
1. Identify module from URS prefix (e.g., `URS-DV-DL-` → `data-labelling/`)
2. Navigate to URS folder
3. Review SDS files

### By Test Case ID
If you have a test case ID (e.g., `UTC-DL-005`):
1. Extract module (`DL` → Data Labelling)
2. Search in module folder: `grep -r "UTC-DL-005" tests/data-labelling/`

## 🚀 Creating New Tests

### 1. Identify Module
Determine which module your test belongs to.

### 2. Create Directory Structure
```bash
mkdir -p tests/{module}/URS-DV-XXX-NNN
```

### 3. Create Spec File
```bash
touch tests/{module}/URS-DV-XXX-NNN/SRS-NNN-SDS-NNN.spec.ts
```

### 4. Use Template
Copy the test template and fill in:
- Module name and feature
- URS/SRS/SDS numbers
- Test case IDs
- Acceptance criteria
- Implementation

### 5. Import Page Objects
```typescript
import { NeededPage } from '../../../pages/needed.page';
```

## 📚 Best Practices

### 1. Keep Tests Focused
Each test should verify one specific behavior or requirement.

### 2. Use Descriptive Names
Test names should clearly describe what is being tested.

### 3. Follow AAA Pattern
- **Arrange**: Set up test data and state
- **Act**: Perform the action being tested
- **Assert**: Verify the expected outcome

### 4. Use Page Objects
Never use raw selectors in tests - always go through page objects.

### 5. Add Console Logs
Add meaningful console logs for test execution visibility:
```typescript
console.log('✅ Feature X verified');
console.log('⚠️  Feature Y - implementation pending');
```

### 6. Handle Async Operations
Always wait for operations to complete:
```typescript
await page.waitForLoadState('networkidle');
await pageObject.waitForToast('success');
```

## 🔧 Maintenance

### When Adding New Features
1. Identify appropriate module
2. Create new URS folder if needed
3. Add SDS spec files
4. Update coverage matrix

### When Refactoring
1. Keep module structure intact
2. Update test descriptions
3. Maintain URS/SRS/SDS traceability

### When UI Changes
1. Run `npm run extract-selectors`
2. Update page objects
3. Verify tests still pass

## 📈 Progress Tracking

Track test implementation progress:

```bash
# Count tests per module
find tests/login -name "*.spec.ts" | wc -l
find tests/session-management -name "*.spec.ts" | wc -l
find tests/data-labelling -name "*.spec.ts" | wc -l

# Find pending implementations
grep -r "implementation pending" tests/

# Find all test case IDs
grep -r "Test Case ID:" tests/ | cut -d: -f3 | sort
```

## 🎯 Next Steps

1. **Complete remaining modules**:
   - image-manipulation/
   - qc-workflow/
   - json-operations/
   - shortcuts/

2. **Implement pending tests**:
   - Replace `expect(true).toBe(true)` placeholders
   - Add actual assertions
   - Complete page object integration

3. **Add test data**:
   - Create test data factories
   - Use Faker.js for dynamic data
   - Manage test fixtures

4. **Setup CI/CD**:
   - Configure test pipeline
   - Add test reporting
   - Integrate with deployment

---

**This organization makes tests discoverable, maintainable, and aligned with business requirements!** 🚀
