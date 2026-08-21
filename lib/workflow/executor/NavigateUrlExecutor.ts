import { ExecutionEnviornment } from "@/lib/types";
import { NavigateUrlTask } from "../task/NavigateUrl";

const PUPPETEER_TIMEOUT = parseInt(process.env.PUPPETEER_TIMEOUT || "30000");
const MAX_RETRIES = 2;
const RETRY_DELAY = 1500;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function NavigateUrlExecutor(
  enviornment: ExecutionEnviornment<typeof NavigateUrlTask>,
): Promise<boolean> {
  try {
    const url = enviornment.getInput("Url");
    if (!url) {
      enviornment.log.error("input -> Url is not defined");
      return false;
    }

    // Validate URL format
    try {
      new URL(url);
    } catch (e) {
      enviornment.log.error(`Invalid URL format: ${url}`);
      return false;
    }

    const page = enviornment.getPage();
    if (!page) {
      enviornment.log.error(
        "No page instance available. Launch browser first.",
      );
      return false;
    }

    // Navigate with retry logic
    let lastError: Error | null = null;
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        enviornment.log.info(`Navigating to: ${url} (attempt ${attempt})`);

        await page.goto(url, {
          timeout: PUPPETEER_TIMEOUT,
          waitUntil: "networkidle2",
        });

        enviornment.log.info(`Successfully navigated to ${url}`);
        return true;
      } catch (error: any) {
        lastError = error;

        if (attempt < MAX_RETRIES) {
          enviornment.log.info(
            `Navigation failed, retrying in ${RETRY_DELAY}ms...`,
          );
          await delay(RETRY_DELAY * attempt);
        }
      }
    }

    // All retries failed
    if (lastError?.message?.includes("timeout")) {
      enviornment.log.error(
        `Navigation timeout after ${PUPPETEER_TIMEOUT}ms: ${url}`,
      );
    } else if (lastError?.message?.includes("net::ERR")) {
      enviornment.log.error(
        `Network error navigating to ${url}: ${lastError.message}`,
      );
    } else {
      enviornment.log.error(
        `Failed to navigate to ${url}: ${lastError?.message}`,
      );
    }

    return false;
  } catch (error: any) {
    enviornment.log.error(error.message);
    return false;
  }
}
