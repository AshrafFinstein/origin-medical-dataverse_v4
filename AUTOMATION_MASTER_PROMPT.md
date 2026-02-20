# 📌 Playwright Spec Generation – Master Prompt (Excel → URS-Based)

## Objective
Create new Playwright automation spec files based on the provided Excel test case file.

## Implementation Rule
Start by generating the spec for **only one URS first**.

After I review and confirm, proceed with the remaining URS test cases and update the entire suite accordingly.

---

## Test Case ID Rule (Mandatory)
For each Playwright test, use the **same UTC test number** from the Excel sheet as the Playwright test case ID.

Example:

```ts
test('UTC-XXX: Verify ...', async ({ page }) => {
  ...
});
```

---

## Required Folder Structure (Strict)
The project follows this exact Playwright + TypeScript structure:

```
pages/
selectors/
test-data/
components/fixtures/
utils/
```

---

## Framework Rules & Expectations

### 1) Common Utilities (utils/)
Inside the `utils/` folder, create reusable utility files such as:

- `randomFunction.ts`
- `errorCodes.ts`
- `dragFunction.ts`

Rules:
- All common reusable logic must be implemented inside these utility files.
- Pages and spec files must import and use these utilities instead of duplicating code.
- Use conditions (`if`, `for`, loops) inside reusable methods wherever needed.

---

### 2) Selectors Handling (selectors/)
Selectors must **NOT** be hardcoded in page files or spec files.

Rules:
- All selectors must be stored in the `selectors/` folder.
- If selector values change, only the selector file should be updated.
- No changes should be required in page files.

---

### 3) Test Data Management (test-data/)
All test data must be stored inside the `test-data/` folder in **JSON format**.

Example test-data files:
- `dashboard.json`
- `tools.json`
- `users.json` (valid and invalid users)
- `workId.json`
- `invalidPasswords.json`
- `siteResources.json`

Store values such as:
- welcome logo text
- numbers
- styles/colors
- invalid values for validation testing

Rules:
- Spec files must import test data from JSON.
- Spec files must never hardcode values.

---

### 4) Spec Execution Behavior (Continuous Run)
Spec files must run continuously.

When the 2nd test starts:
- it should NOT restart the entire flow from the beginning unnecessarily

Rules:
- Use a global approach (global hooks or shared login/session state)
- Tests must run sequentially without repeating setup

---

### 5) Flows + Pages Integration
Create separate flow logic where required.

Rules:
- Create TypeScript page files inside `pages/`
- Use async methods
- Page methods must support reusable logic using loops and conditions
- Spec files should call page methods and flow methods in a structured way

---

### 6) No Hardcoding (Strict)
Do not hardcode:
- selectors
- test values
- locators
- strings
- validation messages
- URLs (unless framework already uses env config)

Everything must be controlled through:
- `selectors/*.json`
- `test-data/*.json`

---

# ✅ Expected Output Format (Strict)

## 1) Spec File Generation Output
For the first step, generate **only one URS spec file**.

The output must include:

### A) Spec File Path (must be exact)
Example:

```
e2e/tests/demo-module/URS-XXX.spec.ts
```

> Only save files inside:  
`e2e/tests/demo-module/`

---

### B) Spec File Naming Rules
- One URS = One spec file
- File name should clearly include the URS number

Examples:
- `URS-001.spec.ts`
- `URS-SessionCreation-001.spec.ts`

---

## 2) Test Case Naming Format (Playwright `test()`)
Each Playwright test must use the **same UTC test number from Excel**.

Format:

```ts
test('UTC-XXX: <Test Case Title from Excel>', async ({ page }) => {
  ...
});
```

Rules:
- `UTC-XXX` must match Excel exactly
- Test title must match Excel description in simple readable form

---

## 3) Spec File Structure (Must Match Sample)
Each spec file must follow the **same structure and style** as the sample spec file already used in the project.

Must include:
- `test.describe()`
- hooks (`beforeAll`, `beforeEach`, etc.) exactly as project standard
- fixture usage as per project structure
- page objects and flows usage as per existing pattern

---

## 4) Mandatory Imports (No Hardcoding)
Each spec must import:

- Pages → from `pages/`
- Selectors → from `selectors/`
- Test Data → from `test-data/`
- Utilities → from `utils/`

---

## 5) Selector + Test Data Format
Selectors must be used like:

```ts
import selectors from '../../selectors/sessionSelectors.json';
```

Test data must be used like:

```ts
import users from '../../test-data/users.json';
```

No selectors or test values should appear directly inside the spec.

---

## 6) Output Must Include These 3 Sections
After generating the spec file code, include a short summary in this format:

### ✅ Implemented
- List of UTC test case IDs implemented in this URS

### ⚠️ Missing / Blocked
- Any selectors not found
- Any page methods missing
- Any unclear test steps from Excel

### 🔧 Required Additions (If required)
- Exact selector keys to add in selector JSON
- Exact test-data keys to add in test-data JSON
- Exact utility methods needed in utils

---

## Notes
- I may provide sample images for reference if required.
- Spec file structure and style must follow the existing project sample spec format.
- Page methods must follow the same structure used in existing page files.
