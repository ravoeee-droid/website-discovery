# DG Website Discovery

High-end adaptive discovery funnel for Digitale Gewinner.

## What it does

- Prefills company/contact data via URL query parameters
- Captures goals, target groups and preferred conversion paths
- Activates a recruiting / employer-branding branch when relevant
- Captures available media and visual direction
- Configures optional AI assistant responsibilities
- Captures automation, CRM and follow-up requirements
- Handles multi-location and multilingual requirements
- Builds structured recommendations for the later website engine
- Saves progress locally in the browser
- Submits a validated JSON payload through `/api/discovery`
- Can forward submissions to any CRM / automation endpoint through a webhook

## Prefilled client links

Example:

```text
/?company=Walterhof&website=https%3A%2F%2Fexample.de&contact=Frau%20Hammer&email=info%40example.de
```

Supported query params:

- `company`
- `website`
- `contact`
- `email`

## Local development

```bash
npm install
npm run dev
```

Quality gate:

```bash
npm run check
```

## Submission webhook

Copy `.env.example` to `.env.local` and configure:

```bash
DISCOVERY_WEBHOOK_URL=https://your-endpoint.example/webhook
DISCOVERY_WEBHOOK_SECRET=optional-shared-secret
```

The secret is sent as `X-DG-Discovery-Secret`.

Without a webhook, the app still completes successfully and provides the structured briefing to the visitor, but submissions are not persistently stored server-side.

## Architecture

```text
Client link / prefill
  -> adaptive discovery flow
  -> recommendation engine
  -> validated API route
  -> optional webhook / CRM / automation
  -> structured JSON for DG Website Engine
```

## Production notes

- The page is intentionally `noindex`.
- Security headers are configured in `next.config.ts`.
- The UI supports `prefers-reduced-motion`.
- The final production integration should send the webhook into the chosen CRM / database and trigger the later Demo / Production Website Engine.
