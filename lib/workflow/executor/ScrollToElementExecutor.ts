import { ExecutionEnviornment } from "@/lib/types";
import { ScrollToElementTask } from "../task/ScrollToElement";

const SCROLL_TIMEOUT = 10000;

export async function ScrollToElementExecutor(
  enviornment: ExecutionEnviornment<typeof ScrollToElementTask>,
): Promise<boolean> {
  const selector = enviornment.getInput("Selector");

  try {
    if (!selector) {
      enviornment.log.error("input -> selector is not defined");
      return false;
    }

    const page = enviornment.getPage();
    if (!page) {
      enviornment.log.error("No page instance available");
      return false;
    }

    enviornment.log.info(`Scrolling to element: ${selector}`);

    // Wait for element to exist
    await page.waitForSelector(selector, { timeout: SCROLL_TIMEOUT });

    // Scroll to element
    await page.evaluate((eleSelector) => {
      const element = document.querySelector(eleSelector);
      if (!element) {
        throw new Error(`Element not found: ${eleSelector}`);
      }

      // Scroll element into view with smooth behavior
      element.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }, selector);

    // Wait a bit for smooth scroll to complete
    await new Promise((resolve) => setTimeout(resolve, 500));

    enviornment.log.info(`Successfully scrolled to: ${selector}`);

    return true;
  } catch (error: any) {
    if (error.message?.includes("timeout")) {
      enviornment.log.error(`Element not found for scrolling: ${selector}`);
    } else {
      enviornment.log.error(`Scroll error: ${error.message}`);
    }
    return false;
  }
}
