import { ExecutionEnviornment } from "@/lib/types";
import { TakeScreenshotTask } from "../task/TakeScreenshot";

export async function TakeScreenshotExecutor(
  enviornment: ExecutionEnviornment<typeof TakeScreenshotTask>,
): Promise<boolean> {
  try {
    const page = enviornment.getPage();
    if (!page) {
      enviornment.log.error("No page instance available. Launch browser first.");
      return false;
    }

    const selector = enviornment.getInput("Selector");
    const fullPage = enviornment.getInput("Full Page") === "true";

    enviornment.log.info("Capturing screenshot...");

    let screenshotBuffer: Buffer | string;

    if (selector) {
      enviornment.log.info(`Capturing element screenshot for: ${selector}`);
      await page.waitForSelector(selector, { visible: true, timeout: 10000 });
      const element = await page.$(selector);
      if (!element) {
        enviornment.log.error(`Element not found: ${selector}`);
        return false;
      }
      screenshotBuffer = (await element.screenshot({
        encoding: "base64",
      })) as string;
    } else {
      enviornment.log.info(
        `Capturing page screenshot (fullPage=${fullPage})`,
      );
      screenshotBuffer = (await page.screenshot({
        fullPage,
        encoding: "base64",
      })) as string;
    }

    const base64Data = `data:image/png;base64,${screenshotBuffer}`;
    enviornment.log.info("Screenshot captured successfully");
    enviornment.setOutput("Screenshot Base64", base64Data);

    return true;
  } catch (error: any) {
    enviornment.log.error(`Screenshot error: ${error.message}`);
    return false;
  }
}
