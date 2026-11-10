# VFast – Software License Management, Usage Analytics & Budget Optimization

VFast helps a company plan its software license budget, see who is assigned each license and who really uses it, judge cost efficiency, and find where to cut waste. It works across many providers (Microsoft, Google, Adobe, JetBrains, Oracle, OpenAI, Anthropic, AWS, VPN, specialized software) and every license model: seat, concurrent, device, core/server, consumption, enterprise.

VFast only reads, analyzes, warns, and recommends. It never assigns, revokes, buys, renews, or changes a subscription on a provider, so every connection needs read-only access.

Status: draft awaiting team confirmation (2026-11-10).

## 1. Mind map

![VFast mind map](docs/mindmap.png)

The four bold branches are the screens in the current phase. Editable source: [`docs/mindmap/vfast.xmind`](docs/mindmap/vfast.xmind) (open with XMind); `docs/mindmap.png` is exported from it.

## 2. Problem

License and usage data are scattered across each provider's system, which causes five problems:

1. No central system for license information and cost.
2. Hard to tell who is assigned a license and whether they really use it.
3. No automatic way to measure usage, consumption, and cost efficiency.
4. Hard to compare the planned budget with licenses purchased, assigned, and actually used.
5. No data to find surplus or inefficient licenses and to plan budget optimization.

## 3. Roles

| Role | Responsibility |
|---|---|
| **Manager** | Plans license purchases for their unit (how many people, how much money); monitors licenses, usage, and budget; reviews month-end warnings |
| **Admin** | Administers the system: accounts and roles, data-source configuration, sync monitoring; can view every unit |
| **Staff** | A license holder; sees only their own licenses and usage status |
| **Scheduler** | System actor: collects data daily, normalizes it, computes metrics, runs the month-end check |

## 4. Use cases

![VFast use case diagram](docs/diagrams/out/uc_vfast.png)

| ID | Use case | Screen | Primary actor |
|---|---|---|---|
| UC01 | View License Overview Metrics | License Management | Manager |
| UC02 | View License List | License Management | Manager |
| UC03 | View License Detail | License Management | Manager |
| UC04 | View Analytics KPIs | Analytics | Manager |
| UC05 | View Application Usage | Analytics | Manager |
| UC06 | View Spend by Department | Analytics | Manager |
| UC07 | View Subscription Usage by Month | Analytics | Manager |
| UC08 | View Budget Overview | Budget | Manager |
| UC09 | Manage Budget Plan | Budget | Manager |
| UC10 | Manage Budget Lines | Budget | Manager |
| UC11 | View Budget vs Actual | Budget | Manager |
| UC12 | Review Month-end Warnings | Warnings | Manager, Scheduler |
| UC13 | View My Licenses | My Licenses | Staff |
| UC14 | Login / Logout | Login | Admin, Manager, Staff |

The diagram shows the primary actors from this table. Admin can also view UC01–UC12 across every unit without editing plans or recording warning decisions, and every role can open UC13 for their own licenses; the Admin part is a proposal awaiting confirmation (section 4 of the project definition). Not yet specified: account management and data-source configuration for Admin, Staff confirming they still need a license, license declaration, manual data import, advanced optimization.

Diagram source: [`docs/diagrams/out/uc_vfast.drawio`](docs/diagrams/out/uc_vfast.drawio) (open with draw.io); the PNG and SVG are exported from it.

## 5. Key design points

- **One model for every license:** three independent axes (measurement archetype, commercial term, collection method) and four archetypes: Allocation, Concurrent, Metered, Capacity. Adding a provider needs a connector, not new analysis logic.
- **Budget reconciliation chain:** Planned → Purchased → Assigned → Used → Actual cost, per unit and per license. Each gap is a different problem.
- **Shared statuses:** Active, Inactive, No activity, Not monitored, Unassigned, with a 60-day inactivity threshold. Missing data is `Unknown`, never zero.
- **Data collection:** one connector per license. Microsoft 365 uses the Graph API; a provider without a usage API gets a self-written API that returns simulated data, marked `simulated`. Sync runs daily and is read-only.

## Documentation

- [Project definition](docs/01-project-definition.md) (Vietnamese) — problem, goals, scope, roles and permissions, automation pipeline, unified license model, data collection, specifications of UC01–UC14, success criteria, open questions
