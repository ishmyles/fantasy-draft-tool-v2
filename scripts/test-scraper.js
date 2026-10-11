import { chromium } from "playwright";
import {
  scrapeMainTab,
  scrapeSecondaryTab,
  scrapeAllPages,
  mergePlayerData,
  checkIsNextDisabled,
} from "./scrape-players.js";

async function runPreFlightCheck() {
  console.log("========================================================");
  console.log("🚀 STARTING SCRAPER PRE-FLIGHT HEALTH CHECK");
  console.log("   (Using exact functions exported from scrape-players.js)");
  console.log("========================================================\n");

  const errors = [];
  function recordPass(testName) {
    console.log(`  ✓ [PASS] ${testName}`);
  }
  function recordFail(testName, errorMessage) {
    console.error(`  ✗ [FAIL] ${testName}: ${errorMessage}`);
    errors.push({ testName, errorMessage });
  }

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // ------------------------------------------------------------------
    // CRITERIA 1: Verify Targets & 50-Player Merge on Page 1
    // ------------------------------------------------------------------
    console.log(
      "[CRITERIA 1] Checking targets and 50-player merge on Page 1...",
    );

    console.log("  Navigating to ESPN projections...");
    await page.goto("https://fantasy.espn.com/basketball/players/projections");
    await page.waitForSelector(".player-name", { timeout: 15000 });

    // 1. Scrape Main Tab (using exported scrapeMainTab)
    const mainP1 = await scrapeMainTab(page);
    if (mainP1.length === 50) {
      recordPass(
        `Main Tab: scrapeMainTab() extracted 50 players (First: "${mainP1[0]?.name}", ID: "${mainP1[0]?.id}")`,
      );
    } else {
      recordFail(
        "Main Tab Extraction",
        `Expected 50 players from scrapeMainTab(), got ${mainP1.length}`,
      );
    }

    // 2. Switch to Secondary Tab
    console.log("  Switching to Secondary Tab ('Sortable Projections')...");
    await page
      .getByRole("button", { name: "Sortable Projections" })
      .click({ force: true });
    await page.waitForTimeout(5000);
    await page.waitForSelector(
      "tbody [title='Field Goals Made & Field Goals Attempted']",
      { timeout: 15000 },
    );

    // 3. Scrape Secondary Tab (using exported scrapeSecondaryTab)
    const secP1 = await scrapeSecondaryTab(page);
    if (secP1.length === 50) {
      const topFgm = secP1[0]?.statsPrediction?.fieldGoalsMade;
      const topFga = secP1[0]?.statsPrediction?.fieldGoalAttempts;
      if (topFgm > 0 && topFga > 0) {
        recordPass(
          `Secondary Tab: scrapeSecondaryTab() extracted 50 items (Sample: ${topFgm}/${topFga})`,
        );
      } else {
        recordFail(
          "Secondary Tab Stats Parsing",
          `scrapeSecondaryTab() returned 50 items, but FGM/FGA are 0 (Got: ${topFgm}/${topFga})`,
        );
      }
    } else {
      recordFail(
        "Secondary Tab Extraction",
        `Expected 50 items from scrapeSecondaryTab(), got ${secP1.length}`,
      );
    }

    // 4. Merge Datasets (using exported mergePlayerData)
    const mergedP1 = mergePlayerData(mainP1, secP1);
    if (
      mergedP1.length === 50 &&
      mergedP1[0]?.statsPrediction?.fieldGoalsMade > 0 &&
      mergedP1[0]?.id
    ) {
      recordPass(
        `Merge Logic: mergePlayerData() produced 50 complete players (${mergedP1[0].name} | FGM: ${mergedP1[0].statsPrediction.fieldGoalsMade})`,
      );
    } else {
      recordFail(
        "Merge Validation",
        `mergePlayerData() failed to properly combine records. Merged count: ${mergedP1.length}`,
      );
    }

    // ------------------------------------------------------------------
    // CRITERIA 2: Verify Pagination Next Button across Pages 1 -> 2
    // ------------------------------------------------------------------
    console.log(
      "\n[CRITERIA 2] Checking 'Next Page' transitions (first 2 pages)...",
    );

    // Test Main Tab: 2-page pagination with scrapeAllPages
    console.log("  Testing Main Tab across Pages 1 and 2...");
    await page.goto("https://fantasy.espn.com/basketball/players/projections");
    await page.waitForSelector(".player-name", { timeout: 15000 });

    const main2Pages = await scrapeAllPages(
      page,
      scrapeMainTab,
      ".player-name",
      {
        maxPages: 2,
        withJitter: false,
      },
    );

    if (main2Pages.length === 100) {
      const p1First = main2Pages[0]?.name;
      const p2First = main2Pages[50]?.name;
      if (p1First !== p2First) {
        recordPass(
          `Main Tab Pagination: Collected 100 players across 2 pages (Page 1 #1: "${p1First}" | Page 2 #1: "${p2First}")`,
        );
      } else {
        recordFail(
          "Main Tab Pagination Duplicate",
          `Page 2 did not load new data. First player was identical: "${p1First}"`,
        );
      }
    } else {
      recordFail(
        "Main Tab Pagination Count",
        `Expected 100 players across 2 pages, got ${main2Pages.length}`,
      );
    }

    // Test Secondary Tab: 2-page pagination with scrapeAllPages
    console.log("  Testing Secondary Tab across Pages 1 and 2...");
    await page.goto("https://fantasy.espn.com/basketball/players/projections");
    await page.waitForSelector(".player-name", { timeout: 15000 });
    await page
      .getByRole("button", { name: "Sortable Projections" })
      .click({ force: true });
    await page.waitForTimeout(5000);

    const sec2Pages = await scrapeAllPages(
      page,
      scrapeSecondaryTab,
      "tbody [title='Field Goals Made & Field Goals Attempted']",
      { maxPages: 2, withJitter: false },
    );

    if (sec2Pages.length === 100) {
      recordPass(
        `Secondary Tab Pagination: Collected 100 FGM/FGA items across 2 pages successfully`,
      );
    } else {
      recordFail(
        "Secondary Tab Pagination Count",
        `Expected 100 items across 2 pages, got ${sec2Pages.length}`,
      );
    }

    // ------------------------------------------------------------------
    // CRITERIA 3: Verify Final Page Next Button Disabled Termination
    // ------------------------------------------------------------------
    console.log(
      "\n[CRITERIA 3] Checking Page 22 'Next Page' button disabled state...",
    );

    // Dynamically locate the last page link from the pagination bar
    await page.waitForSelector(".Pagination__list a", { timeout: 10000 });
    const paginationLinks = page.locator(".Pagination__list a");
    const lastPageLink = paginationLinks.last();
    const lastPageNum = (await lastPageLink.textContent())?.trim();

    if (lastPageNum) {
      console.log(`  Dynamically detected last page: ${lastPageNum}`);
      await lastPageLink.click();
      await page.waitForTimeout(4000);

      const isNextDisabledLast = await checkIsNextDisabled(page);
      if (isNextDisabledLast) {
        recordPass(
          `Final Page (${lastPageNum}): Next Page button is CONFIRMED DISABLED! (Infinite loop prevented)`,
        );
      } else {
        recordFail(
          "Final Page Disabled Check",
          `CRITICAL: Next Page button on final page (${lastPageNum}) is NOT disabled! Risk of infinite loop.`,
        );
      }
    } else {
      recordFail(
        "Final Page Navigation Link",
        "Could not detect final page link in pagination bar",
      );
    }
  } catch (err) {
    recordFail("Unexpected Runtime Exception", err.stack || err.message);
  } finally {
    await browser.close();
  }

  // ------------------------------------------------------------------
  // Summary & Diagnostic Report
  // ------------------------------------------------------------------
  console.log("\n========================================================");
  if (errors.length === 0) {
    console.log("🎉 PRE-FLIGHT CHECK COMPLETE: ALL CRITERIA PASSED!");
    console.log("   ✓ Scraping targets for Main and Secondary tabs match 100%");
    console.log("   ✓ 50 players merged cleanly with valid IDs and stats");
    console.log("   ✓ Pagination transitions across Pages 1 and 2 verified");
    console.log("   ✓ Final page disabled termination verified (Infinite loop prevented)");
    console.log("\nYou can safely execute the full scraper:");
    console.log("  $ npm run scrape");
    console.log("========================================================\n");
    process.exit(0);
  } else {
    console.error(`❌ PRE-FLIGHT CHECK FAILED WITH ${errors.length} ERROR(S):`);
    errors.forEach((err, idx) => {
      console.error(`   ${idx + 1}. [${err.testName}]: ${err.errorMessage}`);
    });
    console.error(
      "\nPlease review the failures above before running the full scrape.",
    );
    console.log("========================================================\n");
    process.exit(1);
  }
}

runPreFlightCheck();
