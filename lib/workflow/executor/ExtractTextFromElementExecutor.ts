import { ExecutionEnviornment } from "@/lib/types";
import * as cheerio from "cheerio";
import { ExtractTextFromElementTask } from "../task/ExtractTextFromElement";

export async function ExtractTextFromElement(
  enviornment: ExecutionEnviornment<typeof ExtractTextFromElementTask>,
): Promise<boolean> {
  try {
    const selector = enviornment.getInput("Selector");
    if (!selector) {
      enviornment.log.error("Selector not defined");
      return false;
    }

    const html = enviornment.getInput("Html");
    if (!html) {
      enviornment.log.error("HTML not defined");
      return false;
    }

    enviornment.log.info(`Extracting text from selector: ${selector}`);

    const $ = cheerio.load(html);
    const element = $(selector);

    if (element.length === 0) {
      enviornment.log.error(`Element not found for selector: ${selector}`);
      return false;
    }

    // FIXED: Correct cheerio usage - use .text() method on the element
    const extractedText = element.text().trim();

    if (!extractedText) {
      enviornment.log.error(
        `Element has no text content for selector: ${selector}`,
      );
      return false;
    }

    enviornment.log.info(
      `Successfully extracted ${extractedText.length} characters`,
    );
    enviornment.setOutput("Extracted Text", extractedText);

    return true;
  } catch (error: any) {
    enviornment.log.error(`Extraction error: ${error.message}`);
    return false;
  }
}
