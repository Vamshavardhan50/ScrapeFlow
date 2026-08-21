/**
 * Browser Configuration Utility
 * Centralizes browser launch configuration for consistency
 */

export const BrowserConfig = {
  // Browser WebSocket endpoint (for remote browsers like BrightData)
  wsEndpoint: process.env.BROWSER_WS_ENDPOINT,

  // Puppeteer headless mode
  headless: process.env.PUPPETEER_HEADLESS !== "false",

  // Navigation and operation timeouts (ms)
  timeout: parseInt(process.env.PUPPETEER_TIMEOUT || "30000"),

  // Chrome launch arguments
  args: process.env.PUPPETEER_ARGS
    ? process.env.PUPPETEER_ARGS.split(",")
    : [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--disable-extensions",
        "--disable-background-timer-throttling",
        "--disable-backgrounding-occluded-windows",
        "--disable-renderer-backgrounding",
      ],

  // Viewport configuration
  viewport: {
    width: 1920,
    height: 1080,
  },

  // User agent to avoid bot detection
  userAgent:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",

  // Extra HTTP headers
  extraHeaders: {
    "Accept-Language": "en-US,en;q=0.9",
    Accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
  },

  // Navigation options
  navigationOptions: {
    waitUntil: "networkidle2" as const,
  },

  // Retry configuration
  retry: {
    maxAttempts: 3,
    delay: 2000, // ms
  },
};

/**
 * Get launch options for Puppeteer
 */
export function getLaunchOptions() {
  if (BrowserConfig.wsEndpoint) {
    // Use remote browser (e.g., BrightData)
    return {
      browserWSEndpoint: BrowserConfig.wsEndpoint,
    };
  }

  // Use local browser
  return {
    headless: BrowserConfig.headless,
    args: BrowserConfig.args,
    defaultViewport: null,
  };
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Create delay promise
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retry wrapper for async functions
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxAttempts: number = BrowserConfig.retry.maxAttempts,
  retryDelay: number = BrowserConfig.retry.delay,
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      if (attempt < maxAttempts) {
        await delay(retryDelay * attempt);
      }
    }
  }

  throw lastError;
}
