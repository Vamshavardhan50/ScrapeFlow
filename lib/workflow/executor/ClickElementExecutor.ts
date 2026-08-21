import { ExecutionEnviornment } from "@/lib/types";
import { ClickElementTask } from "../task/ClickElement";

const CLICK_TIMEOUT = 10000;

export async function ClickElementExecutor(
  enviornment: ExecutionEnviornment<typeof ClickElementTask>,
): Promise<boolean> {
  try {
    const selector = enviornment.getInput("Selector");
    if (!selector) {
      enviornment.log.error("input -> selector is not defined");
      return false;
    }

    const page = enviornment.getPage();
    if (!page) {
      enviornment.log.error("No page instance available");
      return false;
    }

    enviornment.log.info(`Clicking element: ${selector}`);

    // Wait for element to be visible before clicking
    await page.waitForSelector(selector, {
      visible: true,
      timeout: CLICK_TIMEOUT,
    });

    await page.click(selector);
    enviornment.log.info(`Successfully clicked: ${selector}`);

    return true;
  } catch (error: any) {
    if (error.message?.includes("timeout")) {
      enviornment.log.error(
        `Element not found or not clickable: ${error.message}`,
      );
    } else {
      enviornment.log.error(`Click error: ${error.message}`);
    }
    return false;
  }
}
