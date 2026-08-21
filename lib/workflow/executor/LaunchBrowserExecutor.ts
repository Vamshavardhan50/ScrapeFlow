import { ExecutionEnviornment } from "@/lib/types";
import puppeteer from "puppeteer";
import { LaunchBrowserTask } from "../task/LaunchBrowser";

// Configuration with fallback to environment variables
const BROWSER_WS_ENDPOINT = process.env.BROWSER_WS_ENDPOINT;
const PUPPETEER_HEADLESS = process.env.PUPPETEER_HEADLESS !== "false";
const PUPPETEER_TIMEOUT = parseInt(process.env.PUPPETEER_TIMEOUT || "30000");
const PUPPETEER_ARGS = process.env.PUPPETEER_ARGS
  ? process.env.PUPPETEER_ARGS.split(",")
  : [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
    ];

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;

/**
 * Delays execution for specified milliseconds
 */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Launch browser with retry logic
 */
async function launchBrowserWithRetry(
  retries: number = MAX_RETRIES,
): Promise<any> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      // Use remote browser if endpoint is configured (e.g., BrightData proxy)
      if (BROWSER_WS_ENDPOINT) {
        return await puppeteer.connect({
          browserWSEndpoint: BROWSER_WS_ENDPOINT,
        });
      }

      // Otherwise launch local browser
      return await puppeteer.launch({
        headless: PUPPETEER_HEADLESS,
        args: PUPPETEER_ARGS,
        defaultViewport: null,
      });
    } catch (error: any) {
      if (attempt === retries) {
        throw error;
      }
      console.warn(`Browser launch attempt ${attempt} failed, retrying...`);
      await delay(RETRY_DELAY * attempt);
    }
  }
}

export async function LaunchBrowserExecutor(
  enviornment: ExecutionEnviornment<typeof LaunchBrowserTask>,
): Promise<boolean> {
  try {
    const websiteUrl = enviornment.getInput("Website Url");

    if (!websiteUrl) {
      enviornment.log.error("Website URL is required");
      return false;
    }

    // Validate URL format
    try {
      new URL(websiteUrl);
    } catch (e) {
      enviornment.log.error(`Invalid URL format: ${websiteUrl}`);
      return false;
    }

    enviornment.log.info(`Launching browser for URL: ${websiteUrl}`);

    // Launch browser with retry logic
    const browser = await launchBrowserWithRetry();
    enviornment.log.info("Browser started successfully");
    enviornment.setBrowser(browser);

    // Create new page with configuration
    const page = await browser.newPage();

    // Set realistic viewport
    await page.setViewport({ width: 1920, height: 1080 });

    // Set user agent to avoid bot detection
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    );

    // Set extra HTTP headers
    await page.setExtraHTTPHeaders({
      "Accept-Language": "en-US,en;q=0.9",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    });

    // Navigate to URL with timeout and wait conditions
    enviornment.log.info(`Navigating to: ${websiteUrl}`);
    await page.goto(websiteUrl, {
      timeout: PUPPETEER_TIMEOUT,
      waitUntil: "networkidle2", // Wait until network is idle
    });

    enviornment.setPage(page);
    enviornment.log.info(`Successfully loaded page: ${websiteUrl}`);

    return true;
  } catch (error: any) {
    // Enhanced error logging
    const errorMessage = error.message || "Unknown error occurred";

    if (error.message?.includes("timeout")) {
      enviornment.log.error(
        `Navigation timeout after ${PUPPETEER_TIMEOUT}ms: ${errorMessage}`,
      );
    } else if (error.message?.includes("net::ERR")) {
      enviornment.log.error(`Network error: ${errorMessage}`);
    } else if (error.message?.includes("Failed to launch")) {
      enviornment.log.error(
        `Browser launch failed: ${errorMessage}. Check Puppeteer installation.`,
      );
    } else {
      enviornment.log.error(`Browser error: ${errorMessage}`);
    }

    return false;
  }
}
