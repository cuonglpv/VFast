# Enterprise License Management System (ELMS) — team VFast

ELMS brings software licenses from every provider (Microsoft, Google, Adobe, JetBrains, Oracle, OpenAI, Anthropic, AWS, VPN, specialized software) and every license model into one place. It keeps the catalog, vendors, entitlements, contracts, and expenses; plans and monitors the license budget; detects unused, inactive, and overused licenses; turns them into recommendations with evidence; and shows everything on dashboards — **without ever assigning, revoking, or changing anything on a provider**.

## 1. Requirements — Research, Use Cases, and INVEST

Requirements are derived top-down: business problem → stakeholders → goals → license models and data sources → epics (mind map) → use cases → user stories. Each story is reviewed with INVEST and has Given/When/Then acceptance criteria.

### 1.1 Mind map

![ELMS mind map](docs/mindmap.png)

The map has five branches: **License Management** (catalog & entitlement), **Budget Management** (planning & cost allocation, spending & monitoring), **Optimization** (detection, savings & recommendation), **Analytics** (four dashboards), and **User & Organization**. Each of the 22 leaves is one use case (UC01–UC22, in branch order); UC23 View My Licenses and UC24 Login / Logout are self-service use cases every role has.

Editable source: [`docs/mindmap/vfast.xmind`](docs/mindmap/vfast.xmind) (open with XMind); `docs/mindmap.png` is exported from it.

### 1.2 Top-down problem analysis

License and usage data are scattered across each provider's admin portal, and every provider counts in its own unit: seats, sessions, devices, cores, tokens, or contract terms. Nobody can say what the company owns, who uses it, or how far reality is from the budget plan.

| Goal | Measured by |
|---|---|
| G1 Centralize licenses | Every license from every provider listed with vendor, model, quantity, cost, and expiry in one catalog |
| G2 Know who uses what | Every assigned seat has exactly one status: `Active`, `Inactive`, `No activity`, or `Not monitored` |
| G3 Measure automatically | License, assignment, and usage data refresh daily for providers with an API |
| G4 Express waste as money | Underutilized accounts and their annual cost on one screen |
| G5 Plan and reconcile the budget | Planned, Purchased, Assigned, Used, and Actual cost compared per unit and license |
| G6 Turn waste into savings | Every unused, inactive, or overused license becomes a recommendation with evidence and an estimated saving |
| G7 Trustworthy figures | Numbers match across screens; missing data is `Unknown`, never zero |

What makes this project different:

1. **One model for every license** — each license is a combination of three axes (measurement archetype, commercial term, collection method) and one of four archetypes: Allocation, Concurrent, Metered, Capacity.
2. **Budget reconciliation chain** — Planned → Purchased → Assigned → Used → Actual cost; each gap is a different problem with a different fix.
3. **Missing data is not guessed** — a failed sync is `Unknown`, never usage 0, so it never creates a false waste finding.
4. **Decisions stay with people** — every recommendation shows evidence and a saving, and a Manager accepts or rejects it; ELMS only reads from providers.

Full analysis, license-model research, data-source feasibility, scope, and risks: [Top-down research](docs/01-research-top-down.md).

### 1.3 Use cases

There are four roles. One diagram per actor shows every use case that actor can start; shared use cases (View My Licenses, Login / Logout) appear in each actor's diagram.

| Role | Use cases |
|---|---|
| **Employee** (every employee) | UC23 View My Licenses · UC24 Login / Logout |
| **Staff** (reports to a Manager; hands-on data entry) | UC01–UC04 License Management · UC07 Manage Expenses · UC23, UC24 |
| **Manager** (manager of a P&L or a department; plans and decides) | UC05, UC06, UC08, UC09 Budget · UC10–UC14 Optimization · UC15–UC18 Analytics · UC23, UC24 |
| **Admin** (system operator) | UC19–UC22 User & Organization (users, P&Ls and departments, roles, permissions) · UC23, UC24 |

| | |
|---|---|
| ![Employee](docs/diagrams/out/uc_employee.png) | ![Staff](docs/diagrams/out/uc_staff.png) |
| ![Manager](docs/diagrams/out/uc_manager.png) | ![Admin](docs/diagrams/out/uc_admin.png) |

Diagram sources are draw.io files in [`docs/diagrams/out/`](docs/diagrams/out/). Role × feature matrix, 18 business rules, and the specification of all 24 use cases: [Use cases](docs/02-use-cases.md).

### 1.4 Roles and permissions

There are four roles; each account has exactly one. Every account belongs to a real employee, matched by company email.

| Role | Who | Responsibility | Data scope |
|---|---|---|---|
| **Employee** | Every employee of the group | Sees the licenses assigned to them and whether they are recorded as used | Own licenses only, without price or cost |
| **Staff** | License management team member, reports to a Manager | Hands-on work: enters and corrects license data, holders and usage where there is no connector, and expenses | Every license and expense; no budget, no dashboards |
| **Manager** | Manager of a P&L (subsidiary) or a department | Plans the budget, monitors spending, reviews waste, decides on recommendations | Only the P&Ls or departments assigned to them |
| **Admin** | System operator | Users, P&Ls and departments, roles, permissions | Access settings only; no license, budget, or cost data |

| Capability | Admin | Manager | Staff | Employee |
|---|---|---|---|---|
| Software catalog, vendors | — | — | Create / edit | — |
| License entitlements, contracts | — | — | Create / edit | — |
| License holders and usage (where there is no connector) | — | — | Create / edit / import | — |
| Expenses and invoices | — | — | Create / edit / import | — |
| Budget plan | — | Create / edit, own units | — | — |
| Cost allocation, budget monitoring, forecast | — | Read, own units | — | — |
| Unused, inactive, overuse detection | — | Read, own units | — | — |
| Cost optimization, recommendations | — | Read / decide, own units | — | — |
| License, financial, compliance, optimization dashboards | — | Read, own units | — | — |
| Users, roles, permissions | Create / edit | — | — | — |
| P&Ls and departments | Create / edit | — | — | — |
| My licenses | Read own | Read own | Read own | Read own |

- The backend enforces every cell of this table and the data scope; hiding a button in the interface is not enough, and a call outside the role returns `403`.
- ELMS never writes to a provider: "edit" here changes data in ELMS only.
- Every change to license data, expenses, budgets, recommendations, and access is recorded with who, old value, new value, and time.

Staff and Manager compared, and the full role × feature matrix with the business rules: [Use cases](docs/02-use-cases.md#staff-and-manager).

### 1.5 INVEST requirements

The backlog contains **24 user stories (92 story points)**, one per use case (USxx implements UCxx). Every story passes the INVEST review and has Given/When/Then acceptance criteria.

| Criterion | Meaning in ELMS |
|---|---|
| **Independent** | Each story produces a demonstrable outcome; analytics and detection stories run on seeded data without waiting for connectors. |
| **Negotiable** | Layout and implementation may change while outcome, permissions, and business rules stay fixed. |
| **Valuable** | Each story names the benefit for one role: Employee, Staff, Manager, or Admin. |
| **Estimable** | Inputs, outputs, roles, data scope, and failure outcomes are explicit; every story is estimated in points. |
| **Small** | One mind-map leaf per story; only US03 (entitlements plus manual usage entry) reaches 8 points. |
| **Testable** | Every story has observable criteria, including rules that tie figures across screens. |

```text
US01–US04   License Management: catalog, vendors, entitlements, contracts       Staff
US05–US09   Budget: plan, cost allocation, expenses, monitoring, forecast       Manager (US07: Staff)
US10–US14   Optimization: unused, inactive, overuse, savings, recommendations   Manager
US15–US18   Analytics: license, financial, compliance, optimization dashboards  Manager
US19–US22   User & Organization: users, P&Ls and departments, roles, permissions Admin
US23–US24   My licenses, login / logout                                         Every role
```

Backlog, per-story INVEST review, and acceptance criteria: [INVEST requirements](docs/03-invest-requirements.md).

## 2. Database design

The target schema is PostgreSQL, 41 tables in seven groups: organization and access, license catalog, collection pipeline, holders and usage, budget and expenses, optimization, audit. A license is a plan (tier/SKU); each purchase is an entitlement line; missing data is `Unknown`, never 0; history is kept as frozen daily snapshots and monthly cost allocations.

![Entity overview](docs/database/diagrams/erd_overview.png)

Entity overview, one ERD per group, rule-to-schema traceability, and the decisions still to confirm (D5–D15): [Database design](docs/database/README.md). Source [`elms.dbml`](docs/database/elms.dbml), reference DDL [`schema.sql`](docs/database/schema.sql), draw.io files in [`docs/database/diagrams/`](docs/database/diagrams/).

## Documentation

- [Top-down research](docs/01-research-top-down.md) — problem, stakeholders, goals, license models, data sources, process, epics, scope, risks
- [Use cases](docs/02-use-cases.md) — actors, role × feature matrix, business rules, use case diagrams per role, 24 use cases
- [INVEST requirements](docs/03-invest-requirements.md) — 24 user stories, INVEST review, acceptance criteria
- [Information architecture](docs/04-information-architecture-manager.md) — screens, views, and navigation: License Management, Analytics Hub (license health and budget analytics), User Management
- [Database design](docs/database/README.md) — conventions, entity overview, ERD per group, rule-to-schema traceability, proposed decisions D5–D15
