import { ExecutionEnviornment } from "@/lib/types";
import { FillInputTask } from "../task/FillInput";

const FILL_TIMEOUT = 10000;

export async function FillInputExecutor(
  enviornment: ExecutionEnviornment<typeof FillInputTask>,
): Promise<boolean> {
  try {
    const selector = enviornment.getInput("Selector");
    if (!selector) {
      enviornment.log.error("input -> selector is not defined");
      return false;
    }

    const value = enviornment.getInput("Value");
    if (!value) {
      enviornment.log.error("input -> value is not defined");
      return false;
    }

    const page = enviornment.getPage();
    if (!page) {
      enviornment.log.error("No page instance available");
      return false;
    }

    enviornment.log.info(`Filling input: ${selector}`);

    // Wait for element to be visible
    await page.waitForSelector(selector, {
      visible: true,
      timeout: FILL_TIMEOUT,
    });

    // Clear existing value first
    await page.click(selector, { clickCount: 3 }); // Select all
    await page.keyboard.press("Backspace");

    // Type new value with realistic delay
    await page.type(selector, value, { delay: 50 });

    enviornment.log.info(
      `Successfully filled input with ${value.length} characters`,
    );

    return true;
  } catch (error: any) {
    if (error.message?.includes("timeout")) {
      enviornment.log.error(`Input element not found: ${error.message}`);
    } else {
      enviornment.log.error(`Fill input error: ${error.message}`);
    }
    return false;
  }
}
