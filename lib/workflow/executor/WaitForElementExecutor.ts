import { ExecutionEnviornment } from "@/lib/types";
import { WaitForElementTask } from "../task/WaitForElement";

const WAIT_TIMEOUT = parseInt(process.env.PUPPETEER_TIMEOUT || "30000");

export async function WaitForElementExecutor(
  enviornment: ExecutionEnviornment<typeof WaitForElementTask>,
): Promise<boolean> {
  const selector = enviornment.getInput("Selector");
  const visibility = enviornment.getInput("Visiblity");

  try {
    if (!selector) {
      enviornment.log.error("input -> selector is not defined");
      return false;
    }
    if (!visibility) {
      enviornment.log.error("input -> visibility is not defined");
      return false;
    }

    const page = enviornment.getPage();
    if (!page) {
      enviornment.log.error("No page instance available");
      return false;
    }

    enviornment.log.info(
      `Waiting for element to be ${visibility}: ${selector}`,
    );

    await page.waitForSelector(selector, {
      visible: visibility === "visible",
      hidden: visibility === "hidden",
      timeout: WAIT_TIMEOUT,
    });

    enviornment.log.info(`Element ${selector} is now: ${visibility}`);

    return true;
  } catch (error: any) {
    if (error.message?.includes("timeout")) {
      enviornment.log.error(
        `Timeout waiting for element ${visibility}: ${selector}`,
      );
    } else {
      enviornment.log.error(`Wait error: ${error.message}`);
    }
    return false;
  }
}
