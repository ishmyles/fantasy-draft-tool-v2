import { chromium } from "playwright";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to parse stats securely
const parseNum = (val) => {
  if (!val || val === "--" || val === "-") return 0;
  return parseFloat(val);
};

// Parse positions like "PG, SG" into an array
const parsePositions = (posText) => {
  if (!posText) return [];
  return posText.split(",").map((p) => p.trim());
};

// Generate a random jitter in milliseconds between min and max seconds
const getRandomJitter = (minSec = 7, maxSec = 13) => {
  const minMs = minSec * 1000;
  const maxMs = maxSec * 1000;
  return Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
};

async function getPlayerData() {
  // Launch browser
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log("Navigating to ESPN projections...");
  await page.goto("https://fantasy.espn.com/basketball/players/projections");
  await page.waitForSelector(".player-name");

  // --- Step 1: Define Extraction Logic for Main Tab ---
  async function scrapeMainTab() {
    const playerName = await page.locator(".player-name a").allTextContents();
    const teamName = await page.locator(".player-teamname").allTextContents();
    const playerPosition = await page
      .locator(".position-eligibility")
      .allTextContents();
    const imageSrcs = await page
      .locator(".player-headshot img")
      .evaluateAll((imgs) => imgs.map((img) => img.getAttribute("src")));

    // Preious Season Stats (data-idx='0')
    const gpLast = await page
      .locator("[data-idx='0'] [title='Games Played']")
      .allTextContents();
    const minsLast = await page
      .locator("[data-idx='0'] [title='Minutes']")
      .allTextContents();
    const fgLast = await page
      .locator("[data-idx='0'] [title='Field Goal Percentage']")
      .allTextContents();
    const ftLast = await page
      .locator("[data-idx='0'] [title='Free Throw Percentage']")
      .allTextContents();
    const tpmLast = await page
      .locator("[data-idx='0'] [title='Three Pointers Made']")
      .allTextContents();
    const rebLast = await page
      .locator("[data-idx='0'] [title='Rebounds']")
      .allTextContents();
    const assistLast = await page
      .locator("[data-idx='0'] [title='Assists']")
      .allTextContents();
    const atoRatioLast = await page
      .locator("[data-idx='0'] [title='Assists To Turnover Ratio']")
      .allTextContents();
    const stealsLast = await page
      .locator("[data-idx='0'] [title='Steals']")
      .allTextContents();
    const blocksLast = await page
      .locator("[data-idx='0'] [title='Blocks']")
      .allTextContents();
    const toLast = await page
      .locator("[data-idx='0'] [title='Turnovers']")
      .allTextContents();
    const ptsLast = await page
      .locator("[data-idx='0'] [title='Points']")
      .allTextContents();

    // Upcoming Season Stat Predictions (data-idx='1')
    const gpPred = await page
      .locator("[data-idx='1'] [title='Games Played']")
      .allTextContents();
    const minsPred = await page
      .locator("[data-idx='1'] [title='Minutes']")
      .allTextContents();
    const fgPred = await page
      .locator("[data-idx='1'] [title='Field Goal Percentage']")
      .allTextContents();
    const ftPred = await page
      .locator("[data-idx='1'] [title='Free Throw Percentage']")
      .allTextContents();
    const tpmPred = await page
      .locator("[data-idx='1'] [title='Three Pointers Made']")
      .allTextContents();
    const rebPred = await page
      .locator("[data-idx='1'] [title='Rebounds']")
      .allTextContents();
    const assistPred = await page
      .locator("[data-idx='1'] [title='Assists']")
      .allTextContents();
    const atoRatioPred = await page
      .locator("[data-idx='1'] [title='Assists To Turnover Ratio']")
      .allTextContents();
    const stealsPred = await page
      .locator("[data-idx='1'] [title='Steals']")
      .allTextContents();
    const blocksPred = await page
      .locator("[data-idx='1'] [title='Blocks']")
      .allTextContents();
    const toPred = await page
      .locator("[data-idx='1'] [title='Turnovers']")
      .allTextContents();
    const ptsPred = await page
      .locator("[data-idx='1'] [title='Points']")
      .allTextContents();

    const outlook = await page
      .locator(".full-projection-player-outlook__content.mt2.n8")
      .allTextContents();

    let pageData = [];
    for (let i = 0; i < playerName.length; i++) {
      const match = imageSrcs[i]?.match(/\/full\/(\d+)\.png/);
      const espnId = match ? match[1] : String(i);

      pageData.push({
        id: espnId,
        name: playerName[i],
        team: teamName[i],
        position: parsePositions(playerPosition[i]),
        statsLastSeason: {
          gamesPlayed: parseNum(gpLast[i]),
          minutesPerGame: parseNum(minsLast[i]),
          fieldGoalPct: parseNum(fgLast[i]),
          freeThrowPct: parseNum(ftLast[i]),
          threePointersMade: parseNum(tpmLast[i]),
          reboundsPerGame: parseNum(rebLast[i]),
          assistsPerGame: parseNum(assistLast[i]),
          assistToTurnoverRatio: parseNum(atoRatioLast[i]),
          stealsPerGame: parseNum(stealsLast[i]),
          blocksPerGame: parseNum(blocksLast[i]),
          turnoversPerGame: parseNum(toLast[i]),
          pointsPerGame: parseNum(ptsLast[i]),
          fieldGoalsMade: 0, // Placeholder
          fieldGoalAttempts: 0, // Placeholder
        },
        statsPrediction: {
          gamesPlayed: parseNum(gpPred[i]),
          minutesPerGame: parseNum(minsPred[i]),
          fieldGoalPct: parseNum(fgPred[i]),
          freeThrowPct: parseNum(ftPred[i]),
          threePointersMade: parseNum(tpmPred[i]),
          reboundsPerGame: parseNum(rebPred[i]),
          assistsPerGame: parseNum(assistPred[i]),
          assistToTurnoverRatio: parseNum(atoRatioPred[i]),
          stealsPerGame: parseNum(stealsPred[i]),
          blocksPerGame: parseNum(blocksPred[i]),
          turnoversPerGame: parseNum(toPred[i]),
          pointsPerGame: parseNum(ptsPred[i]),
          fieldGoalsMade: 0, // Placeholder
          fieldGoalAttempts: 0, // Placeholder
        },
        playerOutlook: outlook[i] || "",
      });
    }
    return pageData;
  }

  // --- Step 2: Define Extraction Logic for Secondary Tab (FGM/FGA) ---
  async function scrapeSecondaryTab() {
    // const playerName = await page
    //   .locator(".player-column__info .player-column__athlete.truncate")
    //   .allTextContents();

    // The secondary tab only has prediction data
    const fgPredStr = await page
      .locator("tbody [title='Field Goals Made & Field Goals Attempted']")
      .allTextContents();

    let pageData = [];
    for (let i = 0; i < fgPredStr.length; i++) {
      const fgmPred = fgPredStr[i] ? parseNum(fgPredStr[i].split("/")[0]) : 0;
      const fgaPred = fgPredStr[i] ? parseNum(fgPredStr[i].split("/")[1]) : 0;

      pageData.push({
        // name: playerName[i],
        statsPrediction: {
          fieldGoalsMade: fgmPred,
          fieldGoalAttempts: fgaPred,
        },
      });
    }
    return pageData;
  }

  // --- Step 3: Pagination Runner ---
  async function scrapeAllPages(extractorFunc, waitSelector) {
    let allData = [];
    let hasNextPage = true;
    let count = 1; // TODO: Remove
    while (hasNextPage) {
      // Pause with randomized jitter (7-13s) before continuing
      const jitter = getRandomJitter(7, 13);
      console.log(
        `Pausing ${(jitter / 1000).toFixed(1)}s before continuing...`,
      );
      await page.waitForTimeout(jitter);

      // 1. Wait for table
      await page.waitForSelector(waitSelector);

      // 2. Extract data
      const pageData = await extractorFunc();
      allData = allData.concat(pageData);
      count++; // TODO: Remove

      // 3. Check for and click Next Page
      const nextBtn = page.locator("button.Pagination__Button--next");
      const isNextDisabled = await nextBtn.isDisabled().catch(() => true);

      if (!isNextDisabled && count <= 3) {
        // REMOVE COUNT  && count <= 4
        console.log("Moving to next page...");
        await nextBtn.click();
      } else {
        hasNextPage = false;
      }
    }
    return allData;
  }

  // --- Step 4: Execute Workflow ---
  console.log("--- Scraping Main Tab ---");
  const mainData = await scrapeAllPages(scrapeMainTab, ".player-name");

  // console.log("--- Resetting to Page 1 ---");
  // await page.goto("https://fantasy.espn.com/basketball/players/projections");
  // await page.waitForSelector(".player-name");

  console.log("--- Switching to Secondary Tab ---");
  await page
    .getByRole("button", { name: "Sortable Projections" })
    .click({ force: true });
  await page.waitForTimeout(5000); // Wait for tab switch

  console.log("--- Scraping Secondary Tab ---");
  const secondaryData = await scrapeAllPages(
    scrapeSecondaryTab,
    "tbody [title='Field Goals Made & Field Goals Attempted']",
  );

  // --- Step 5: Merge Data ---
  console.log("--- Merging Datasets ---");
  const mergedPlayers = mainData.map((mainPlayer, index) => {
    // Use index instead of name to map datasets directly
    const secPlayer = secondaryData[index];

    if (secPlayer) {
      mainPlayer.statsPrediction.fieldGoalsMade =
        secPlayer.statsPrediction.fieldGoalsMade;
      mainPlayer.statsPrediction.fieldGoalAttempts =
        secPlayer.statsPrediction.fieldGoalAttempts;
    }

    return {
      rank: index + 1,
      ...mainPlayer,
    };
  });

  // Save the data
  const outputPath = path.resolve(__dirname, "../src/data/players.js");
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  const fileContent = `const players = ${JSON.stringify(mergedPlayers, null, 2)};\n\nexport default players;\n`;
  await fs.writeFile(outputPath, fileContent, "utf-8");

  console.log(
    `Successfully saved ${mergedPlayers.length} merged players to ${outputPath}`,
  );
  await browser.close();
}

getPlayerData().catch(console.error);
