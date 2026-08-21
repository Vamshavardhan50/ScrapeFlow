import { ExecutionEnviornment } from "@/lib/types";
import { EvaluateScriptTask } from "../task/EvaluateScript";

export async function EvaluateScriptExecutor(
  enviornment: ExecutionEnviornment<typeof EvaluateScriptTask>,
): Promise<boolean> {
  try {
    const page = enviornment.getPage();
    if (!page) {
      enviornment.log.error("No page instance available. Launch browser first.");
      return false;
    }

    const script = enviornment.getInput("JavaScript Expression");
    if (!script) {
      enviornment.log.error("JavaScript expression is required");
      return false;
    }

    enviornment.log.info("Executing custom script in page context...");

    // Wrap in async function evaluation in browser
    const evaluationResult = await page.evaluate(async (jsCode: string) => {
      try {
        const fn = new Function(jsCode);
        return await fn();
      } catch (err: any) {
        return { __error: err.message || "Script execution failed" };
      }
    }, script);

    if (evaluationResult && typeof evaluationResult === "object" && evaluationResult.__error) {
      enviornment.log.error(`In-page script error: ${evaluationResult.__error}`);
      return false;
    }

    const resultString =
      typeof evaluationResult === "string"
        ? evaluationResult
        : JSON.stringify(evaluationResult, null, 2);

    enviornment.log.info("Script executed successfully");
    enviornment.setOutput("Result JSON", resultString || "null");

    return true;
  } catch (error: any) {
    enviornment.log.error(`Evaluate script error: ${error.message}`);
    return false;
  }
}
