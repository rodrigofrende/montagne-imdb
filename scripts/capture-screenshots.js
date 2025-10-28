/**
 * Automated Screenshot Capture Script
 * Captures screenshots of the DevMovies app for README documentation
 * 
 * Usage: node scripts/capture-screenshots.js
 */

import { chromium } from '@playwright/test';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const APP_URL = process.env.VITE_APP_URL || 'http://localhost:5173';
const SCREENSHOTS_DIR = join(__dirname, '../screenshots');
const DELAY_MS = 1500; // Wait for animations

// Ensure screenshots directory exists
if (!existsSync(SCREENSHOTS_DIR)) {
  mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

async function captureScreenshots() {
  console.log('🎬 Starting screenshot capture...\n');
  console.log(`📍 App URL: ${APP_URL}`);
  console.log(`💾 Saving to: ${SCREENSHOTS_DIR}\n`);

  const browser = await chromium.launch();
  
  try {
    // Desktop screenshots
    console.log('🖥️  Capturing desktop screenshots...');
    const desktopPage = await browser.newPage({
      viewport: { width: 1920, height: 1080 }
    });

    // 1. Homepage with random collection
    await desktopPage.goto(APP_URL);
    await desktopPage.waitForTimeout(DELAY_MS);
    await desktopPage.screenshot({ 
      path: join(SCREENSHOTS_DIR, '01-homepage-desktop.png'),
      fullPage: true 
    });
    console.log('  ✅ Homepage (desktop)');

    // 2. Search results
    await desktopPage.fill('input[placeholder*="Search movies"]', 'Matrix');
    await desktopPage.press('input[placeholder*="Search movies"]', 'Enter');
    await desktopPage.waitForTimeout(DELAY_MS);
    await desktopPage.screenshot({ 
      path: join(SCREENSHOTS_DIR, '02-search-results-desktop.png'),
      fullPage: true 
    });
    console.log('  ✅ Search results (desktop)');

    // 3. Movie modal
    const firstMovie = desktopPage.locator('article').first();
    await firstMovie.click();
    await desktopPage.waitForTimeout(DELAY_MS);
    await desktopPage.screenshot({ 
      path: join(SCREENSHOTS_DIR, '03-movie-modal-desktop.png'),
      fullPage: false 
    });
    console.log('  ✅ Movie modal (desktop)');

    // Close modal
    await desktopPage.press('body', 'Escape');
    await desktopPage.waitForTimeout(500);

    // 4. Recent searches (focus search bar)
    await desktopPage.click('input[placeholder*="Search movies"]');
    await desktopPage.waitForTimeout(500);
    await desktopPage.screenshot({ 
      path: join(SCREENSHOTS_DIR, '04-recent-searches-desktop.png'),
      clip: { x: 0, y: 0, width: 1920, height: 600 }
    });
    console.log('  ✅ Recent searches (desktop)');

    // 5. Keyboard shortcut in action (focus on search with /)
    await desktopPage.press('body', '/');
    await desktopPage.waitForTimeout(300);
    await desktopPage.screenshot({ 
      path: join(SCREENSHOTS_DIR, '05-keyboard-shortcut-desktop.png'),
      clip: { x: 0, y: 0, width: 1920, height: 400 }
    });
    console.log('  ✅ Keyboard shortcut (desktop)');

    await desktopPage.close();

    // Mobile screenshots
    console.log('\n📱 Capturing mobile screenshots...');
    const mobilePage = await browser.newPage({
      viewport: { width: 375, height: 812 } // iPhone X
    });

    // 6. Homepage mobile
    await mobilePage.goto(APP_URL);
    await mobilePage.waitForTimeout(DELAY_MS);
    await mobilePage.screenshot({ 
      path: join(SCREENSHOTS_DIR, '06-homepage-mobile.png'),
      fullPage: true 
    });
    console.log('  ✅ Homepage (mobile)');

    // 7. Search results mobile
    await mobilePage.fill('input[placeholder*="Search movies"]', 'Avengers');
    await mobilePage.press('input[placeholder*="Search movies"]', 'Enter');
    await mobilePage.waitForTimeout(DELAY_MS);
    await mobilePage.screenshot({ 
      path: join(SCREENSHOTS_DIR, '07-search-results-mobile.png'),
      fullPage: true 
    });
    console.log('  ✅ Search results (mobile)');

    // 8. Movie modal mobile
    const firstMovieMobile = mobilePage.locator('article').first();
    await firstMovieMobile.click();
    await mobilePage.waitForTimeout(DELAY_MS);
    await mobilePage.screenshot({ 
      path: join(SCREENSHOTS_DIR, '08-movie-modal-mobile.png'),
      fullPage: true 
    });
    console.log('  ✅ Movie modal (mobile)');

    await mobilePage.close();

    // Error state screenshot
    console.log('\n⚠️  Capturing error state...');
    const errorPage = await browser.newPage({
      viewport: { width: 1920, height: 1080 }
    });

    await errorPage.goto(APP_URL);
    await errorPage.fill('input[placeholder*="Search movies"]', 'a');
    await errorPage.press('input[placeholder*="Search movies"]', 'Enter');
    await errorPage.waitForTimeout(DELAY_MS);
    await errorPage.screenshot({ 
      path: join(SCREENSHOTS_DIR, '09-error-state-desktop.png'),
      fullPage: true 
    });
    console.log('  ✅ Error state (desktop)');

    await errorPage.close();

    console.log('\n✨ Screenshot capture complete!');
    console.log(`\n📂 Screenshots saved to: ${SCREENSHOTS_DIR}`);
    console.log('\nScreenshots captured:');
    console.log('  1. Homepage (desktop & mobile)');
    console.log('  2. Search results (desktop & mobile)');
    console.log('  3. Movie modal (desktop & mobile)');
    console.log('  4. Recent searches dropdown');
    console.log('  5. Keyboard shortcuts');
    console.log('  6. Error state');

  } catch (error) {
    console.error('\n❌ Error capturing screenshots:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

// Run the script
captureScreenshots().catch(error => {
  console.error(error);
  process.exit(1);
});

