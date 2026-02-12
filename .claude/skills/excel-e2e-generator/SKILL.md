# 📘 Skill: excel-e2e-generator

## Skill ID

excel-e2e-generator

------------------------------------------------------------------------

## 🧠 Skill Name

Excel to Playwright E2E Automation Generator

------------------------------------------------------------------------

## 🎯 Purpose

The `excel-e2e-generator` skill enables automated conversion of
structured Excel test cases into scalable Playwright E2E test
specifications.

It supports strict traceability using:

URS → SRS → SDS → UTC mapping

Designed for enterprise automation systems with 2000--3000+ test cases.

------------------------------------------------------------------------

## 📌 Scope of Responsibility

-   Read and parse `.xlsx` files
-   Extract structured test case rows
-   Validate URS/SRS/SDS/UTC mapping
-   Generate Playwright `.spec.ts` files
-   Group test cases by hierarchy
-   Enforce naming conventions
-   Prevent duplicate test generation

------------------------------------------------------------------------

## 📥 Expected Input

Structured Excel columns:

  Column                Description
  --------------------- -------------------------
  URS ID                Requirement ID
  SRS ID                System Requirement ID
  SDS ID                Software Design Spec ID
  UTC ID                Unique Test Case ID
  Summary               Short description
  Description           Steps
  Acceptance Criteria   Expected Result

------------------------------------------------------------------------

## 📤 Expected Output

### Folder Structure

e2e/ ├── tests/ │ ├── URS-DV-QC-1/ │ │ ├── SRS-1/ │ │ │ ├──
SDS-1.spec.ts

------------------------------------------------------------------------

### Generated Playwright Format

``` ts
import { test, expect } from '@playwright/test';

test.describe('@URS-DV-QC-1 @SRS-1 @SDS-1', () => {

  test('TC-DV-QC-1-01-01-001 Verify Login Functionality', async ({ page }) => {
    // TODO: Implement steps from Excel
  });

});
```

------------------------------------------------------------------------

## ⚙ Core Capabilities

### Excel Parsing

-   Use `exceljs`
-   Detect worksheet automatically
-   Validate mandatory columns
-   Skip malformed rows
-   Handle large datasets

### Mapping Logic

-   Group by URS → SRS → SDS
-   One spec file per SDS
-   Insert UTC tests inside file

### Naming Convention

TC-`<URS>`{=html}-`<SRS>`{=html}-`<SDS>`{=html}-`<UTC>`{=html}

Example: TC-DV-QC-1-01-01-001

------------------------------------------------------------------------

## 🧼 Clean Code Rules

Generated code must: - Use TypeScript - Avoid hardcoded selectors -
Avoid duplicate imports - Include test tags - Follow SonarQube-friendly
structure - Add TODO placeholders only

------------------------------------------------------------------------

## 🔍 Validation Rules

-   Reject missing mappings
-   Detect duplicate UTC IDs
-   Validate naming consistency
-   Prevent overwriting manual files

------------------------------------------------------------------------

## 🛠 Required Tooling

npm install exceljs\
npm install typescript

------------------------------------------------------------------------

## 🔐 Constraints

Must NOT: - Overwrite manual test logic - Inject selectors
automatically - Guess missing mappings - Modify framework config

------------------------------------------------------------------------

## 🚀 Success Criteria

-   All Excel rows converted
-   Hierarchy preserved
-   No duplicate test cases
-   CI-ready output
-   SonarQube compliant

------------------------------------------------------------------------

## 📌 Usage

Use skill: excel-e2e-generator\
Input: testcases.xlsx\
Output: Structured Playwright spec files grouped by URS/SRS/SDS.
