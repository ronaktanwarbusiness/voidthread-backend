# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm install          # install dependencies
pnpm run start:dev    # development with hot reload
pnpm run build        # compile TypeScript to dist/
pnpm run start:prod   # run compiled build
pnpm run lint         # eslint with auto-fix
pnpm run format       # prettier format
pnpm run test         # unit tests (*.spec.ts in src/)
pnpm run test:e2e     # e2e tests
pnpm run test:cov     # coverage report
```

To run a single test file:
```bash
pnpm run test -- --testPathPattern=auth
```

## Required Environment Variables

```
MONGO_URI
JWT_SECRET
SESSION_SECRET
REDIS_HOST
REDIS_PORT
REDIS_USERNAME
REDIS_PASSWORD
CASHFREE_CLIENT_ID
CASHFREE_CLIENT_SECRET
PORT               # defaults to 3000
NODE_ENV           # set to PROD to enable secure cookies
```

## Architecture

**Stack**: NestJS v11, MongoDB (Mongoose), Redis (session store), Cashfree payment gateway.

**Global prefix**: All routes are under `/api/v1`.

### Module structure

Each feature module lives in `src/modules/<name>/` with a controller, service, and module file. DTOs are in a `dtos/` subfolder. Mongoose schemas are centralized in `src/database/schemas/` — not inside modules.

### Auth — dual mechanism (important)

The app uses **both** JWT tokens and Redis-backed express-session cookies simultaneously:

- Login and register store `user_id` in the session cookie via `@SetSession()` and also return a JWT token in the response body.
- Most protected routes read identity from the session using the custom `@GetSession('user_id')` param decorator (`src/decorators/session.ts`), **not** from a JWT guard.
- Session decorators: `@GetSession(key?)`, `@SetSession()`, `@LogoutSession()` — all in `src/decorators/session.ts`.
- `rawBody: true` is set on NestFactory so the webhook controller can verify Cashfree HMAC signatures against the raw request body.

### Admin vs Core split

- `admin` module: write operations (create/edit products, variants, collections). No auth guard is wired yet.
- `core` module: public read operations (list products, get variants by product slug, get products in a collection by slug).

### Data model relationships

- **Product** → **Variant**: one-to-many. Variants hold size (`S/M/L/XL/XXL`), color (`BLACK/WHITE/RED/GREEN/BLUE`), SKU (unique), stock, and status (`ACTIVE/INACTIVE/OUT_OF_STOCK`).
- **Collection** → **Product**: many-to-many via `product_ids[]` array with ObjectId refs. Collections have a `status` field (`ACTIVE/INACTIVE`); `core` module only returns `ACTIVE` collections.
- **Cart**: one per user, stores `[{ product_id, variant_id, quantity }]`. Cart price calculation applies a hardcoded 5% tax (`TAX_PERCENTAGE` in `cart.service.ts`).
- **Transaction**: created at payment initiation with status `PENDING`, updated to `SUCCESS` or `FAILED` via the Cashfree webhook. Stores a snapshot of the cart items and price breakup at the time of payment.

### Payment flow

1. `POST /api/v1/payment/create` — reads cart from session user, creates a Cashfree order (currently hardcoded to `CFEnvironment.SANDBOX`), saves a `PENDING` transaction.
2. `POST /api/v1/webhook/cashfree` — verifies HMAC-SHA256 signature (`x-webhook-signature` + `x-webhook-timestamp` headers against raw body), then updates the transaction status.

### Stub modules

`inventory`, `order`, `coupon`, and `category` modules exist with empty services — they are scaffolded but not yet implemented.
