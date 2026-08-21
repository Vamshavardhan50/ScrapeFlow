# Vercel Deployment Checklist

## Prerequisites

- [ ] Vercel account created
- [ ] Remote browser service (BrightData/Browserless) set up
- [ ] Clerk account and API keys ready
- [ ] PostgreSQL database (Vercel Postgres or Neon)

## Environment Variables (Set in Vercel Dashboard)

Required:

- [ ] `DATABASE_URL` - PostgreSQL connection string
- [ ] `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- [ ] `CLERK_SECRET_KEY`
- [ ] `ENCRYPTION_SECRET` - Generate with: `node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"`
- [ ] `BROWSER_WS_ENDPOINT` - Remote browser WebSocket URL (e.g., wss://your-service.com)

Optional:

- [ ] `OPENAI_API_KEY` - For AI extraction feature
- [ ] `STRIPE_SECRET_KEY` - For payment processing
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- [ ] `STRIPE_WEBHOOK_SECRET`

Default (already set):

- [ ] `PUPPETEER_HEADLESS=true`
- [ ] `PUPPETEER_TIMEOUT=30000`

## Deployment Steps

1. **Install Vercel CLI**:

   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:

   ```bash
   vercel login
   ```

3. **Deploy**:

   ```bash
   vercel
   ```

4. **Set Environment Variables** in Vercel Dashboard:
   - Go to Project Settings > Environment Variables
   - Add all required variables above
   - Apply to Production, Preview, and Development

5. **Setup Database**:
   - Create PostgreSQL database (Vercel Postgres or Neon)
   - Update `DATABASE_URL` environment variable
   - The database URL is now configured in `prisma/prisma.config.ts` (Prisma 7)
   - Run migrations:
     ```bash
     npx prisma migrate deploy
     ```

6. **Redeploy**:
   ```bash
   vercel --prod
   ```

## Remote Browser Services

### BrightData (Recommended)

1. Sign up at https://brightdata.com/
2. Create a scraping browser zone
3. Get WebSocket endpoint (format: `wss://brd-customer-xxx-zone-xxx:password@brd.superproxy.io:9222`)
4. Set as `BROWSER_WS_ENDPOINT`

### Browserless.io

1. Sign up at https://www.browserless.io/
2. Get API token
3. WebSocket endpoint: `wss://chrome.browserless.io?token=YOUR_TOKEN`
4. Set as `BROWSER_WS_ENDPOINT`

### Apify

1. Sign up at https://apify.com/
2. Use Web Scraper actor
3. Get API endpoint
4. Set as `BROWSER_WS_ENDPOINT`

## Testing After Deployment

- [ ] Visit your Vercel URL
- [ ] Test authentication (sign up/sign in)
- [ ] Create a simple workflow
- [ ] Test browser launch
- [ ] Test data extraction
- [ ] Check logs in Vercel Dashboard

## Troubleshooting

**Issue**: "Failed to launch browser"

- **Solution**: Verify `BROWSER_WS_ENDPOINT` is set correctly and remote service is active

**Issue**: "Database connection failed"

- **Solution**: Check `DATABASE_URL` is correct PostgreSQL connection string

**Issue**: "Clerk authentication error"

- **Solution**: Verify Clerk API keys and add Vercel domain to Clerk allowed origins

**Issue**: "Timeout errors"

- **Solution**: Increase `PUPPETEER_TIMEOUT` to 60000 or higher

## Post-Deployment

- [ ] Add custom domain (optional)
- [ ] Setup monitoring (Vercel Analytics)
- [ ] Configure Stripe webhooks (if using payments)
- [ ] Test all workflow features
- [ ] Setup backup strategy for database

## Notes

- Vercel serverless functions have 10-60s timeout limits (depending on plan)
- For long-running scrapes, consider using background jobs or Edge Functions
- PostgreSQL is required for production (SQLite won't work on Vercel)
- Remote browser service is mandatory - local Puppeteer won't work

## Support

- Vercel Docs: https://vercel.com/docs
- Clerk Docs: https://clerk.com/docs
- Prisma Docs: https://www.prisma.io/docs
