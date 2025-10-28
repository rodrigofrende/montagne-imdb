/**
 * Updates README.md with screenshots after capture
 * 
 * Usage: node scripts/update-readme-screenshots.js
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const README_PATH = join(__dirname, '../README.md');
const SCREENSHOTS_DIR = 'screenshots';

// Screenshot sections to add
const SCREENSHOTS_SECTION = `
## 📸 Screenshots

### 🖥️ Desktop Experience

#### Homepage with Curated Collections
![Homepage Desktop](./screenshots/01-homepage-desktop.png)
*Random movie collections on every visit - discover new films effortlessly*

#### Search Results
![Search Results Desktop](./screenshots/02-search-results-desktop.png)
*Fast, intuitive search with smart pagination (12 results per page)*

#### Movie Details Modal
![Movie Details Desktop](./screenshots/03-movie-modal-desktop.png)
*Comprehensive movie information with ratings, cast, plot, and awards*

#### Recent Searches Feature
![Recent Searches Desktop](./screenshots/04-recent-searches-desktop.png)
*Persistent search history with autocomplete - powered by localStorage*

#### Keyboard Shortcuts in Action
![Keyboard Shortcuts Desktop](./screenshots/05-keyboard-shortcut-desktop.png)
*Press \`/\` to focus search, \`Escape\` to clear - GitHub-style UX*

---

### 📱 Mobile Experience

<p align="center">
  <img src="./screenshots/06-homepage-mobile.png" width="250" alt="Mobile Homepage" />
  <img src="./screenshots/07-search-results-mobile.png" width="250" alt="Mobile Search Results" />
  <img src="./screenshots/08-movie-modal-mobile.png" width="250" alt="Mobile Movie Details" />
</p>

*Fully responsive design - beautiful on all devices*

---

### ⚠️ Error Handling

![Error State](./screenshots/09-error-state-desktop.png)
*User-friendly error messages with helpful suggestions*

---
`;

function updateReadme() {
  console.log('📝 Updating README.md with screenshots...\n');

  // Check if screenshots exist
  const screenshotsExist = [
    '01-homepage-desktop.png',
    '02-search-results-desktop.png',
    '03-movie-modal-desktop.png',
    '04-recent-searches-desktop.png',
    '05-keyboard-shortcut-desktop.png',
    '06-homepage-mobile.png',
    '07-search-results-mobile.png',
    '08-movie-modal-mobile.png',
    '09-error-state-desktop.png'
  ].every(file => existsSync(join(__dirname, '..', SCREENSHOTS_DIR, file)));

  if (!screenshotsExist) {
    console.error('❌ Some screenshots are missing!');
    console.log('📸 Run: npm run screenshots');
    process.exit(1);
  }

  // Read current README
  const readme = readFileSync(README_PATH, 'utf-8');

  // Check if screenshots section already exists
  if (readme.includes('## 📸 Screenshots')) {
    console.log('⚠️  Screenshots section already exists in README');
    console.log('📝 Replacing existing section...\n');
    
    // Remove old screenshots section
    const beforeScreenshots = readme.split('## 📸 Screenshots')[0];
    const afterScreenshots = readme.split(/## 📸 Screenshots[\s\S]*?---\n\n---\n/)[1] || 
                            readme.split(/## 📸 Screenshots[\s\S]*$/)[1] ||
                            readme.split('## 🛠️ Tech Stack')[1] ? '\n## 🛠️ Tech Stack' + readme.split('## 🛠️ Tech Stack')[1] : '';
    
    const updatedReadme = beforeScreenshots + SCREENSHOTS_SECTION + '\n' + afterScreenshots;
    writeFileSync(README_PATH, updatedReadme);
  } else {
    // Find where to insert (after the header section, before Tech Stack)
    const insertAfter = '[![Coverage](https://img.shields.io/badge/coverage-70%25-yellow)]()';
    const insertBefore = '## 🛠️ Tech Stack';
    
    if (readme.includes(insertAfter) && readme.includes(insertBefore)) {
      const parts = readme.split(insertBefore);
      const beforeTechStack = parts[0];
      const afterTechStack = insertBefore + parts[1];
      
      const updatedReadme = beforeTechStack + '\n' + SCREENSHOTS_SECTION + '\n' + afterTechStack;
      writeFileSync(README_PATH, updatedReadme);
    } else {
      console.error('❌ Could not find insertion point in README');
      process.exit(1);
    }
  }

  console.log('✅ README.md updated successfully!');
  console.log('\n📋 Screenshots section added:');
  console.log('  • Desktop homepage, search, modal, features');
  console.log('  • Mobile responsive views (3 screenshots)');
  console.log('  • Error state handling');
  console.log('\n✨ Check your README.md to see the changes!');
  console.log('📤 Commit and push to see them on GitHub');
}

// Run the update
updateReadme();

