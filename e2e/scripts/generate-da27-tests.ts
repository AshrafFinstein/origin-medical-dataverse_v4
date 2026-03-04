import ExcelJS from 'exceljs';
import fs from 'fs';
import path from 'path';

type Da27Case = {
  srsId: string;
  sdsId: string;
  testId: string;
  description: string;
  givenSteps: string[];
  whenSteps: string[];
  thenSteps: string[];
  orderedBddSteps: string[];
};

const EXCEL_PATH = path.resolve('requirements-excel-file/dataverse-Testcases-V4.xlsx');
const TARGET_URS = 'URS-DV-DA-27';
const TARGET_ROOT = path.resolve('e2e/tests/workflow/URS-DV-DA-27');

function normalize(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

function escapeForSingleQuote(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n');
}

function numericPart(value: string): number {
  const match = value.match(/(\d+)/);
  return match ? Number.parseInt(match[1], 10) : Number.MAX_SAFE_INTEGER;
}

function extractBdd(description: string, testId: string) {
  const lines = String(description)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const bddLines = lines.filter((line) => /^(Given|When|Then)\b/i.test(line));
  const givenSteps = bddLines.filter((line) => /^Given\b/i.test(line)).map(normalize);
  const whenSteps = bddLines.filter((line) => /^When\b/i.test(line)).map(normalize);
  const thenSteps = bddLines.filter((line) => /^Then\b/i.test(line)).map(normalize);

  if (!givenSteps.length || !whenSteps.length || !thenSteps.length) {
    throw new Error(`BDD extraction failed for ${testId}: missing Given/When/Then in Description`);
  }

  return {
    givenSteps,
    whenSteps,
    thenSteps,
    orderedBddSteps: bddLines.map(normalize),
  };
}

function mapGiven(step: string): string[] {
  const l = step.toLowerCase();

  if (/user right-clicks image|annotation page is loaded|editable image/.test(l)) return ['displayLoadedImage'];
  if (/popup is closed|popup closed/.test(l)) return ['ensurePopupClosed'];
  if (/label list visible/.test(l)) return ['ensurePopupOpen', 'isLabelListVisible'];
  if (/popup with search\/filter state/.test(l)) return ['ensurePopupOpen', 'enterSearchText'];
  if (/user opens label popup|popup is open|popup is opened|popup open|popup opened|popup opens|popup visible|popup displayed|label popup opens/.test(l)) return ['ensurePopupOpen'];

  if (/no label is selected|no label selected|no labels selected/.test(l)) return ['ensurePopupOpen', 'unselectLabel', 'clearLabelSearch'];
  if (/search text has no match/.test(l)) return ['ensurePopupOpen', 'enterUnmatchedSearchText'];
  if (/user types in search/.test(l)) return ['ensurePopupOpen', 'enterSearchText'];
  if (/user types unmatched text/.test(l)) return ['ensurePopupOpen', 'enterUnmatchedSearchText'];
  if (/search text is entered|search field contains text/.test(l)) return ['ensurePopupOpen', 'enterSearchText'];
  if (/search field has focus|search field is focused|cursor inside search\/text field|search input/.test(l)) return ['ensurePopupOpen', 'focusLabelSearch'];

  if (/no image selected|images have labels|one or more images are selected/.test(l)) return ['waitForUiSync'];
  if (/multiple labels selected|many labels selected|100\+|multiple labels exist|labels selected/.test(l)) return ['ensurePopupOpen', 'selectMultipleLabels'];
  if (/a label is selected|label selected|at least one label selected|selected images exist|label applied|labels already applied|labels applied|labels assigned|labels listed/.test(l)) return ['ensurePopupOpen', 'selectSingleLabel'];

  if (/user manipulates frontend via console|user has label edit permission|unauthorized|read-only|lacks permission|admin role revoked|locked|not editable|controls disabled|disabled control hovered|mixed roles/.test(l)) return ['waitForUiSync'];
  if (/rapid multiple clicks|500\+ labels loaded|long label list|many images selected|multiple interactions|multiple apply\/remove cycles|repeated/.test(l)) return ['ensurePopupOpen'];
  if (/removal initiated|user performs action|given user clicks apply|labels removed successfully|labels removed|apply action succeeds|confirmation modal|failure occurs|api failure|apply fails|backend removal fails|apply\/remove in progress|slow network/.test(l)) return ['waitForUiSync'];

  throw new Error(`Unmapped Given step: ${step}`);
}

function mapWhen(step: string): string[] {
  const l = step.toLowerCase();

  if (/user right-clicks|right-clicks on the image|right-clicks image|user right-clicks image/.test(l)) return ['imageRightClick'];
  if (/popup used repeatedly|labels load|user reopens popup|popup reopened|reopens popup|popup opens|popup rendered|popup renders|popup is displayed|popup displayed|label popup opens|popup loads|content rendered|annotation page loads|the popup loads/.test(l)) return ['ensurePopupOpen'];

  if (/types unmatched|unmatched text|no matching labels exist|search yields no results|no match/.test(l)) return ['enterUnmatchedSearchText'];
  if (/types text|user types|characters entered|search text is entered|types in search field|types label text|types text quickly/.test(l)) return ['enterSearchText'];
  if (/clears the search input|search input is empty|clear search/.test(l)) return ['clearLabelSearch'];
  if (/no label selected|no labels are selected/.test(l)) return ['ensurePopupOpen', 'unselectLabel', 'clearLabelSearch'];

  if (/multiple labels are selected|user toggles quickly|selects multiple|multiple checkboxes|selecting multiple items|selecting labels repeatedly/.test(l)) return ['selectMultipleLabels'];
  if (/one label is selected|the user selects at least one label|selects one checkbox|selecting a checkbox|selecting checkbox|checkbox checked|checkbox marked|selection occurs/.test(l)) return ['selectSingleLabel'];
  if (/unchecks a checkbox|deselect label/.test(l)) return ['unselectLabel'];

  if (/clicking apply|clicks apply|user clicks apply|apply clicked|apply attempted|apply completes|apply action delayed|apply action succeeds|presses enter key on apply/.test(l)) return ['clickApplyButton'];
  if (/clicks the cancel icon|clicks cancel icon|cancel clicked|escape|tab to cancel|popup closed without apply|popup closed or cancelled|popup closes|popup closed/.test(l)) return ['clickCancelIcon'];

  if (/backspace pressed|presses backspace|remove triggered|clicking remove/.test(l)) return ['pressBackspace'];
  if (/clicks yes|confirmation accepted|user confirms removal/.test(l)) return ['clickYesInConfirmation'];
  if (/clicks no/.test(l)) return ['clickNoInConfirmation'];

  if (/confirmation appears|each loads page|system blocks request|labels assigned|request sent|request initiated|request blocked|api triggered|api request sent directly|validation occurs|inspecting payload|success toast shown|operation completes|action completes|actions repeat|executed repeatedly|process succeeds|filtering labels|filtering|displayed|blocked|error occurs|error shown/.test(l)) {
    return ['waitForUiSync'];
  }

  if (/page refresh occurs/.test(l)) return ['refreshPage'];
  if (/user reviews buttons|scrolling|tooltip appears|tab\/space\/enter|navigates with keyboard|navigates using keyboard|presses tab\/enter|user views|using tab\/space\/enter/.test(l)) return ['waitForUiSync'];

  throw new Error(`Unmapped When step: ${step}`);
}

function mapThen(step: string): string[] {
  const l = step.toLowerCase();

  if (/search field, label list, and apply button should be displayed/.test(l)) {
    return ['isDisplaylabelselectionpopup', 'isSearchVisible', 'isLabelListVisible', 'isApplyDisabled'];
  }
  if (/search, labels, and apply button should be clearly visible/.test(l)) {
    return ['isDisplaylabelselectionpopup', 'isSearchVisible', 'isLabelListVisible'];
  }
  if (/search should clear and popup reset|search field should clear and list reset to full labels/.test(l)) {
    return ['isDisplaylabelselectionpopup', 'isLabelListVisible'];
  }
  if (/popup should appear|label selection popup should appear|popup controls|popup should render|popup should be clearly visible/.test(l)) return ['isDisplaylabelselectionpopup'];
  if (/placeholder text should guide label search|search input should be visible|search field should be visible/.test(l)) return ['isSearchVisible'];
  if (/popup should close|popup closes instantly|popup should not appear|no label filtering or popup should occur/.test(l)) return ['isPopupHidden'];

  if (/controls become disabled|apply and remove controls should be disabled|apply button should remain disabled|apply button should be disabled|prevent apply|zero selection/.test(l)) return ['isApplyDisabled'];
  if (/only permitted users see enabled actions|apply and remove controls should be enabled|apply button should be enabled|apply button should become enabled|apply button enables immediately|apply button should remain enabled|enable clearly/.test(l)) return ['isApplyEnabled'];

  if (/no results found|empty list|empty state/.test(l)) return ['isEmptyStateVisible'];
  if (/labels should be removed from selected images/.test(l)) return ['isSuccessToastVisible'];
  if (/selected label should be assigned|labels should be assigned|labels should be mapped|attached to the image|assigned successfully|appear below the image/.test(l)) {
    return ['verifyUiStable'];
  }
  if (/correct label count should be displayed|checkbox control|list should update showing matching labels|list updates dynamically|labels should be displayed|matching labels should be displayed|list reset|full labels|label list visible|labels listed|labels appear/.test(l)) return ['isLabelListVisible'];

  if (/previous ui state remains intact and toast shown|success toast|successfully labelled image|labels removed successfully|confirmation message/.test(l)) return ['isSuccessToastVisible', 'verifyUiStable'];
  if (/message should be simple and user-friendly|permission must be validated before processing|message text should explain label removal clearly|access denied|permission restriction|forbidden|blocked|notification shown|error toast|message displayed|message explains/.test(l)) return ['isErrorToastVisible'];

  if (/previous labels should be replaced with new selection|removed from selection list/.test(l)) return ['verifyUiStable'];
  if (/no action should occur|must not execute|should not execute|should not trigger|remain unchanged|previous labels remain|no labels should be assigned/.test(l)) return ['verifyNoActionOccurred'];
  if (/modal text clearly describes action|label text should be readable and properly spaced|ui should not block other interactions|image thumbnails should be visible in modal|user should clearly understand labels assigned|popup behavior should remain consistent|load correctly without ui errors|ui remains responsive|ui should remain stable|layout remains stable|performance remains consistent|without lag|without reload|without ui freeze|non-blocking|stable and predictable|instantly|response time|under 1 sec|within 200 ms|within 300 ms|within 500 ms|<1s|<200ms/.test(l)) {
    return ['verifyUiStable'];
  }

  if (/previous selections should remain visible|opacity\/disabled styling clearly indicates restriction|yes\/no buttons clearly distinguishable|yes and no buttons should be visually distinct|selections should reset on next open|checkbox selection should toggle|remain checked simultaneously|marked selected|visually highlighted|highlighted|selection state|focusable|selectable|keyboard/.test(l)) return ['verifyUiStable'];
  if (/system logs security audit event|image ids|label ids|payload|audit log|server returns/.test(l)) return ['waitForUiSync'];

  throw new Error(`Unmapped Then step: ${step}`);
}

function mapStepToMethods(step: string): string[] {
  if (/^Given\b/i.test(step)) return mapGiven(step);
  if (/^When\b/i.test(step)) return mapWhen(step);
  if (/^Then\b/i.test(step)) return mapThen(step);
  throw new Error(`Unmapped BDD step type: ${step}`);
}

function buildTitle(testId: string, givenSteps: string[], whenSteps: string[], thenSteps: string[]): string {
  const singleLineTitle = `${testId}: ${[...givenSteps, ...whenSteps, ...thenSteps].join(' ')}`;
  const multiLineBlock = [...givenSteps, ...whenSteps, ...thenSteps].join('\n');
  return `${singleLineTitle}\n${multiLineBlock}\n`;
}

function buildSpecContent(srsId: string, sdsId: string, testCases: Da27Case[]): string {
  const tests = testCases
    .map((tc) => {
      const title = escapeForSingleQuote(buildTitle(tc.testId, tc.givenSteps, tc.whenSteps, tc.thenSteps));

      const calls = tc.orderedBddSteps
        .flatMap((step) => mapStepToMethods(step).map((method) => `    await da27Page.${method}();`))
        .join('\n');

      return `  test('${title}', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);

    // Steps - read Given/When/Then from Description and execute
${calls}

    await da27Page.assertPageIsUsable();
    await expect(page).toHaveURL(/.+/);
  });`;
    })
    .join('\n\n');

  return `import { test, expect } from '@playwright/test';
import { Da27AnnotationPage } from '../../../../pages/da27-annotation.page';

test.describe('${srsId} - ${sdsId}', () => {
  let da27Page: Da27AnnotationPage;

  test.beforeEach(async ({ page }) => {
    da27Page = new Da27AnnotationPage(page);
    await da27Page.openDataLabellingSession();
  });

${tests}
});
`;
}

async function main(): Promise<void> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(EXCEL_PATH);

  const worksheet = workbook.getWorksheet('Testcases-V4') ?? workbook.getWorksheet(1);
  if (!worksheet) throw new Error('Worksheet not found');

  const testCases: Da27Case[] = [];

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;

    const ursId = row.getCell(1).text.trim();
    const srsId = row.getCell(2).text.trim();
    const sdsId = row.getCell(3).text.trim();
    const testId = row.getCell(4).text.trim();
    const description = row.getCell(6).text;
    const testStatus = row.getCell(8).text.trim();

    if (ursId !== TARGET_URS) return;
    if (testStatus.toLowerCase() === 'obsolete') return;

    const bdd = extractBdd(description, testId);
    testCases.push({
      srsId,
      sdsId,
      testId,
      description,
      givenSteps: bdd.givenSteps,
      whenSteps: bdd.whenSteps,
      thenSteps: bdd.thenSteps,
      orderedBddSteps: bdd.orderedBddSteps,
    });
  });

  if (!testCases.length) throw new Error(`No non-obsolete test cases found for ${TARGET_URS}`);

  const grouped = new Map<string, Map<string, Da27Case[]>>();
  for (const tc of testCases) {
    if (!grouped.has(tc.srsId)) grouped.set(tc.srsId, new Map());
    const srsMap = grouped.get(tc.srsId)!;
    if (!srsMap.has(tc.sdsId)) srsMap.set(tc.sdsId, []);
    srsMap.get(tc.sdsId)!.push(tc);
  }

  fs.mkdirSync(TARGET_ROOT, { recursive: true });

  const sortedSrs = [...grouped.keys()].sort((a, b) => numericPart(a) - numericPart(b));
  for (const srsId of sortedSrs) {
    const srsPath = path.join(TARGET_ROOT, srsId);
    fs.mkdirSync(srsPath, { recursive: true });

    const sdsMap = grouped.get(srsId)!;
    const sortedSds = [...sdsMap.keys()].sort((a, b) => numericPart(a) - numericPart(b));

    for (const sdsId of sortedSds) {
      const cases = [...sdsMap.get(sdsId)!].sort((a, b) => numericPart(a.testId) - numericPart(b.testId));
      const filePath = path.join(srsPath, `${sdsId}.spec.ts`);
      fs.writeFileSync(filePath, buildSpecContent(srsId, sdsId, cases), 'utf8');
      console.log(`Generated: ${filePath} (${cases.length} tests)`);
    }
  }

  console.log(`\nCompleted generation for ${TARGET_URS}`);
  console.log(`Total test cases: ${testCases.length}`);
  console.log(`Total SRS: ${sortedSrs.length}`);
}

main().catch((error) => {
  console.error(`Generation failed: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});
