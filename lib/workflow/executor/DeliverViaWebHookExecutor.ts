import { ExecutionEnviornment } from "@/lib/types";
import { DeliverViaWebHookTask } from "../task/DeliverViaWebHook";

const WEBHOOK_TIMEOUT = 15000;
const MAX_RETRIES = 2;
const RETRY_DELAY = 1000;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function DeviverViaWebHookExecutor(
  enviornment: ExecutionEnviornment<typeof DeliverViaWebHookTask>,
): Promise<boolean> {
  try {
    const targetUrl = enviornment.getInput("Target url");
    if (!targetUrl) {
      enviornment.log.error("input -> targetUrl is not defined");
      return false;
    }

    // Validate URL
    try {
      new URL(targetUrl);
    } catch (e) {
      enviornment.log.error(`Invalid webhook URL: ${targetUrl}`);
      return false;
    }

    const body = enviornment.getInput("Body");
    if (!body) {
      enviornment.log.error("input -> Body is not defined");
      return false;
    }

    // Parse body if it's a string
    let parsedBody;
    try {
      parsedBody = typeof body === "string" ? JSON.parse(body) : body;
    } catch (e) {
      enviornment.log.error("Invalid JSON body format");
      return false;
    }

    enviornment.log.info(`Sending webhook to: ${targetUrl}`);

    // Retry logic for webhook delivery
    let lastError: Error | null = null;
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), WEBHOOK_TIMEOUT);

        const res = await fetch(targetUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "User-Agent": "FlowScrape-Webhook/1.0",
          },
          body: JSON.stringify(parsedBody),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        const resStatus = res.status;

        // Success status codes (200-299)
        if (resStatus >= 200 && resStatus < 300) {
          try {
            const resBody = await res.json();
            enviornment.log.info(
              `Webhook delivered successfully (${resStatus})`,
            );
            enviornment.log.info(JSON.stringify(resBody, null, 2));
          } catch (e) {
            // Response might not be JSON
            const textBody = await res.text();
            enviornment.log.info(
              `Webhook delivered successfully (${resStatus}): ${textBody}`,
            );
          }
          return true;
        }

        // Handle error status codes
        const errorText = await res.text();
        if (attempt < MAX_RETRIES && resStatus >= 500) {
          // Retry on server errors
          enviornment.log.info(`Server error (${resStatus}), retrying...`);
          await delay(RETRY_DELAY * attempt);
          continue;
        }

        enviornment.log.error(
          `Webhook failed with status ${resStatus}: ${errorText}`,
        );
        return false;
      } catch (error: any) {
        lastError = error;

        if (error.name === "AbortError") {
          enviornment.log.error(`Webhook timeout after ${WEBHOOK_TIMEOUT}ms`);
          return false;
        }

        if (attempt < MAX_RETRIES) {
          enviornment.log.info(
            `Request failed, retrying... (${error.message})`,
          );
          await delay(RETRY_DELAY * attempt);
        }
      }
    }

    enviornment.log.error(
      `Webhook delivery failed after ${MAX_RETRIES} attempts: ${lastError?.message}`,
    );
    return false;
  } catch (error: any) {
    enviornment.log.error(`Webhook error: ${error.message}`);
    return false;
  }
}
