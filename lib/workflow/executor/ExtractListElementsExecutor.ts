import { ExecutionEnviornment } from "@/lib/types";
import * as cheerio from "cheerio";
import { ExtractListElementsTask } from "../task/ExtractListElements";

export async function ExtractListElementsExecutor(
  enviornment: ExecutionEnviornment<typeof ExtractListElementsTask>,
): Promise<boolean> {
  try {
    const selector = enviornment.getInput("Selector");
    if (!selector) {
      enviornment.log.error("Selector is not defined");
      return false;
    }

    const html = enviornment.getInput("Html");
    if (!html) {
      enviornment.log.error("HTML is not defined");
      return false;
    }

    const rawAttributes = enviornment.getInput("Extract Attributes") || "";
    const requestedAttributes = rawAttributes
      .split(",")
      .map((attr) => attr.trim())
      .filter(Boolean);

    enviornment.log.info(
      `Extracting list elements for selector: ${selector}`,
    );

    const $ = cheerio.load(html);
    const elements = $(selector);

    if (elements.length === 0) {
      enviornment.log.error(`No elements found for selector: ${selector}`);
      return false;
    }

    const extractedList: Array<Record<string, any>> = [];

    elements.each((index, el) => {
      const $el = $(el);
      const item: Record<string, any> = {
        index,
        text: $el.text().trim(),
      };

      if (requestedAttributes.length > 0) {
        requestedAttributes.forEach((attr) => {
          item[attr] = $el.attr(attr) || null;
        });
      }

      extractedList.push(item);
    });

    enviornment.log.info(
      `Successfully extracted ${extractedList.length} items`,
    );

    enviornment.setOutput(
      "Extracted List JSON",
      JSON.stringify(extractedList, null, 2),
    );

    return true;
  } catch (error: any) {
    enviornment.log.error(`List extraction error: ${error.message}`);
    return false;
  }
}
