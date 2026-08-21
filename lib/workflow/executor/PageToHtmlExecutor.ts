import { ExecutionEnviornment } from "@/lib/types";
import { PageToHtmlTask } from "../task/PageToHtml";

export async function PageToHtmlExecutor(
  enviornment: ExecutionEnviornment<typeof PageToHtmlTask>,
): Promise<boolean> {
  try {
    const page = enviornment.getPage();
    if (!page) {
      enviornment.log.error(
        "No page instance available. Launch browser first.",
      );
      return false;
    }

    enviornment.log.info("Extracting HTML content from page");

    const html = await page.content();

    if (!html || html.length === 0) {
      enviornment.log.error("Page HTML is empty");
      return false;
    }

    enviornment.log.info(
      `Successfully extracted ${html.length} characters of HTML`,
    );
    enviornment.setOutput("HTML", html);

    return true;
  } catch (error: any) {
    enviornment.log.error(`HTML extraction error: ${error.message}`);
    return false;
  }
}
