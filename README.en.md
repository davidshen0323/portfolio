# David Shen — Web & Interaction Portfolio

A bilingual React portfolio with 11 project entries and case studies, ranging from brand sites and automotive sales to e-commerce, business operations, messaging and game flows.

[繁體中文](README.md) · [Architecture decisions](docs/ARCHITECTURE.md) · [Review walkthrough](docs/REVIEW_GUIDE.md)

The experience section describes professional work I participated in. Public projects are independently rebuilt examples using fictional data; they contain no employer source code or assets.

## Run locally

Use Node.js 22 or later:

```bash
npm ci
npm run dev
```

Open the URL printed by Vite. Do not open the source HTML directly from the filesystem.

```bash
npm test
npm run build
npm run preview
```

The build generates 22 static HTML entrypoints. Deploy the contents of `dist/` to a static host. Existing `.html` URLs work without a server rewrite. Use `?lang=en` or `?lang=zh`; the preference is retained in the browser.

## Structure

| Directory                                                    | Responsibility                                                                     |
| ------------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| `src/app`                                                    | Routing, lazy page loading and error boundaries                                    |
| `src/features/portfolio`                                     | Experience, project index and case studies                                         |
| `src/features/commerce`                                      | Cart, address dependencies, promotions, pricing and order persistence              |
| `src/features/operations`                                    | Orders, status workflow, inventory, bookings, reports and support                  |
| `src/features/business`                                      | Contract review, receiving validation and activity records                         |
| `src/features/messages`                                      | Message filtering, read/archive state, progressive loading and events              |
| `src/features/contests`                                      | Contest states, result acknowledgement and dispute flows                           |
| `src/features/gameflow`                                      | Game event rules, deduplication, timers and rendering                              |
| `src/features/brands`, `dealer`, `earthquakes`, `responsive` | Brand sites, vehicle selection, public API and layout repair                       |
| `src/shared`                                                 | UI primitives, hooks, localization, storage and CSV utilities                      |
| `tests`                                                      | Business rules, persistence failures, dependency boundaries and React interactions |

Features use `components`, `hooks`, `domain`, `services` and `data` where needed. Domain functions remain independent of React, browser storage and HTTP. Repositories own persistence; hooks coordinate UI state and resource cleanup.

## Selected implementation decisions

- Checkout and UI share promotion and shipping rules. Regular and add-on quantities share stock and are checked again when placing an order.
- Orders preserve checkout prices and delivery details as snapshots. Historical orders without those fields are shown explicitly, without reconstructing missing fees.
- Order transitions are validated both in UI options and business rules. Valid transitions retain their previous state and timestamp. Completed and cancelled orders are final.
- Receiving adds only accepted units and rejects duplicate processing. Differences or damage require a reason.
- Messages deduplicate incoming IDs without resetting read state. A replaceable local event source supports subscription cleanup; loading requests can be aborted.
- Language changes preserve stored enum values and user-entered text. Localization is rendered through React context.
- CSV exports quote fields and neutralize spreadsheet formulas, including those with leading whitespace.

## Scope

This is a frontend portfolio with browser-local interactions. It has no production authentication, payments, messaging server, immutable audit trail or multi-user transaction lock. Order status changes do not issue refunds, send notifications or restore stock. Storage write failures attempt to restore previous values; this is not a database transaction.

Freebet is a browser recreation of interaction and state flows informed by Flutter experience; the repository is not a Flutter application. Game outcomes and points are local examples. External fonts and USGS data require network access.

For a production service, replace repository and event-source boundaries with authorized backend APIs, enforce inventory and financial rules server-side, and implement delivery, refund and notification workflows.
