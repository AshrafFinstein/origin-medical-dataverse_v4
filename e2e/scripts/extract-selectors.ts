import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';

interface SelectorMap {
  [key: string]: string | SelectorMap;
}

/**
 * Extract data-testid attributes from Vue components
 * Organizes selectors by module/feature into separate JSON files
 */
async function extractSelectors() {
  const vueFiles = await glob('datavaerese_frontend_&_backend/**/*.vue', {
    ignore: ['**/node_modules/**', '**/dist/**', '**/.nuxt/**'],
    windowsPathsNoEscape: true,
  });

  console.log(`📁 Found ${vueFiles.length} Vue files to scan`);

  const selectors: Record<string, SelectorMap> = {
    common: {},
    epic: {},
    project: {},
    session: {},
    dataLabelling: {},
    clinicalEvaluation: {},
    reportAnalysis: {},
    masters: {},
    label: {},
    annotation: {},
    taxonomy: {},
    structure: {},
    sessionCodes: {},
    users: {},
    userGroup: {},
  };

  // Regex to match data-testid attributes - handles both single and double quotes
  const dataTestIdRegex = /data-testid=["']([^"']+)["']/g;
  let totalSelectors = 0;

  for (const file of vueFiles) {
    const content = fs.readFileSync(file, 'utf8');
    const fileName = path.basename(file, '.vue');
    let match;

    while ((match = dataTestIdRegex.exec(content)) !== null) {
      const testId = match[1];
      totalSelectors++;

      // Categorize by file location
      const category = categorizeSelector(file, testId);

      // Create normalized selector
      const normalizedSelector = `[data-testid="${testId}"]`;

      addToCategory(selectors, category, testId, normalizedSelector);
    }
  }

  console.log(`✅ Extracted ${totalSelectors} selectors`);

  // Write JSON files
  const selectorsDir = 'e2e/selectors';
  if (!fs.existsSync(selectorsDir)) {
    fs.mkdirSync(selectorsDir, { recursive: true });
  }

  let fileCount = 0;
  for (const [category, selectorMap] of Object.entries(selectors)) {
    if (Object.keys(selectorMap).length > 0) {
      const filePath = path.join(selectorsDir, `${category}.json`);
      fs.writeFileSync(filePath, JSON.stringify(selectorMap, null, 2));
      fileCount++;
      console.log(`   📝 ${category}.json (${Object.keys(selectorMap).length} selectors)`);
    }
  }

  console.log(`\n✅ Selectors extracted successfully into ${fileCount} files in ${selectorsDir}/`);
}

/**
 * Categorize selector based on file path and test ID
 */
function categorizeSelector(filePath: string, testId: string): string {
  // Normalize path separators
  const normalizedPath = filePath.replace(/\\/g, '/');

  // Page-based categorization
  if (normalizedPath.includes('pages/index.vue')) return 'epic';
  if (normalizedPath.includes('pages/epic')) return 'project';
  if (normalizedPath.includes('pages/project')) return 'session';
  if (normalizedPath.includes('pages/data-labelling')) return 'dataLabelling';
  if (normalizedPath.includes('pages/clinical-evaluation')) return 'clinicalEvaluation';
  if (normalizedPath.includes('pages/report-analysis')) return 'reportAnalysis';

  // Component-based categorization
  if (normalizedPath.includes('Masters/Label.vue')) return 'label';
  if (normalizedPath.includes('Masters/Annotation.vue')) return 'annotation';
  if (normalizedPath.includes('Masters/Taxonomy.vue')) return 'taxonomy';
  if (normalizedPath.includes('Masters/Structures.vue') || normalizedPath.includes('Masters/Structure.vue')) {
    return 'structure';
  }
  if (normalizedPath.includes('Masters/Users.vue')) return 'users';
  if (normalizedPath.includes('Masters/UserGroup.vue')) return 'userGroup';
  if (normalizedPath.includes('SessionCodeMasters')) return 'sessionCodes';

  // Common components (Header, Footer, Navigation, etc.)
  if (normalizedPath.includes('components/Header.vue')) return 'common';
  if (normalizedPath.includes('components/Navigation.vue')) return 'common';
  if (normalizedPath.includes('components/Footer.vue')) return 'common';
  if (normalizedPath.includes('components/common/')) return 'common';

  // Test ID-based categorization as fallback
  if (testId.startsWith('epic-')) return 'epic';
  if (testId.startsWith('project-')) return 'project';
  if (testId.startsWith('session-')) return 'session';
  if (testId.startsWith('dl-') || testId.startsWith('data-labelling-')) return 'dataLabelling';
  if (testId.startsWith('ce-') || testId.startsWith('clinical-')) return 'clinicalEvaluation';
  if (testId.startsWith('report-')) return 'reportAnalysis';

  // Default to common
  return 'common';
}

/**
 * Add selector to category with hierarchical grouping
 */
function addToCategory(
  selectors: Record<string, SelectorMap>,
  category: string,
  testId: string,
  selector: string
) {
  // Group by common prefixes (e.g., epic-create-button, epic-table-row-0)
  const parts = testId.split('-');

  if (parts.length > 1) {
    // Group by first two parts (e.g., "epic-create", "epic-table")
    const group = parts.slice(0, 2).join('-');
    const key = parts.slice(2).join('-') || 'root';

    if (!selectors[category][group]) {
      selectors[category][group] = {};
    }
    (selectors[category][group] as SelectorMap)[key] = selector;
  } else {
    // Single word test IDs go directly into category
    selectors[category][testId] = selector;
  }
}

// Run the extraction
extractSelectors().catch(console.error);
