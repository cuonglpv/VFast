# VFast – Enterprise License Management System (ELMS)

VFast ELMS is a system for managing software licenses centrally inside a company. It brings the software catalog, license entitlements, the request → approval → assignment → revocation flow, actual usage data, budgets and expenses, expiry alerts, compliance checks, and an audit log into one place — **the number of assigned seats can never exceed the number purchased, every important action is recorded, and every cost-optimization recommendation needs Manager approval before it is carried out**.

## 1. Requirements — Research, INVEST, Use Cases, and Permissions

Requirements are derived top-down: business problem → goals → scope → feature groups → use cases → user stories. Each story is reviewed with INVEST and has Given/When/Then acceptance criteria.

### 1.1 Top-down problem analysis

![VFast ELMS mind map](docs/mindmap.png)

The map has five branches: **License Management** (catalog & entitlement, allocation, lifecycle & compliance), **Budget Management**, **Optimization**, **Analytics**, and **User & Organization**.

Editable source: [`docs/mindmap/vfast-elms.xmind`](docs/mindmap/vfast-elms.xmind) (open with XMind). `docs/mindmap.png` is exported from it.

The system manages two license models:

- **SaaS Subscription:** cloud subscriptions with a term and recurring cost (Microsoft 365, Google Workspace, Adobe CC, Zoom, Slack, Figma, …).
- **Perpetual License:** a one-time purchase of long-term usage rights (AutoCAD, Windows Pro, VMware, …), possibly with a maintenance or upgrade-support agreement.

In practice, license information is scattered across Excel files, paper contracts, accounting invoices, and each vendor's own admin portal. This produces seven core problems:

| # | Problem | Symptom |
|---|---|---|
| P1 | Fragmented data | Software, license, contract, and expense data live in different places, with no single source of truth |
| P2 | Weak license control | It is hard to know exactly how many licenses are purchased (`Purchased`), assigned (`Allocated`), and free (`Available`) |
| P3 | No usage monitoring | Nobody knows who is using what, which licenses are forgotten, or who uses more than they are entitled to |
| P4 | Hard to control budget | Subscription, perpetual, and maintenance costs are not consolidated against the plan |
| P5 | Expiry risk | No early warning before contracts and maintenance agreements end, so service can stop suddenly |
| P6 | No approval process | Software is requested by email or word of mouth, with no review and no history |
| P7 | Hard to optimize cost | Not enough data to find unassigned licenses or "zombie seats" held by people who left or changed role |

| Goal | Measured by |
|---|---|
| G1 Centralize licenses | SaaS and Perpetual licenses both registered and tracked in one system |
| G2 Control allocation | Closed loop Request → Approve → Assign → Revoke; `Purchased`, `Allocated`, and `Available` 100% accurate per license metric |
| G3 Monitor usage | `Usage` data recorded and aggregated completely |
| G4 Manage budget | `Expense` recorded completely; `Budget Utilization` computed per year, period, and department |
| G5 Manage lifecycle | Alerts for contracts and maintenance expiring within 30, 15, and 7 days |
| G6 License compliance | `Over-allocation` ($Allocated > Purchased$) and `Overuse` detected correctly |
| G7 Optimize cost | Unassigned and inactive licenses found, with saving recommendations |
| G8 Management analytics | License, Financial, and Compliance dashboards and reports |

In addition, every important business action must reach an immutable Audit Log, and the three-role permissions must be enforced on the backend.

What makes this project different:

1. **Never over-assign** — assignment runs in a transaction with row locking; $\text{Allocated} \le \text{Purchased}$ holds even when several Managers act at once (BR-05).
2. **One source for two license models** — the SaaS term and the Perpetual maintenance term are two independent fields (BR-12).
3. **Missing data is not guessed** — missing usage is never read as zero; compliance checks need valid usage (BR-14, BR-15).
4. **Decisions have an owner** — only a Manager approves requests, assigns, and revokes; optimization recommendations need data evidence and Manager approval (BR-06, BR-07, BR-16).
5. **History is kept** — revoked assignments stay for audit; the Audit Log records Actor, Action, and Timestamp and cannot be edited (BR-13, BR-17).
6. **Currencies are not mixed carelessly** — costs in different currencies are summed only with an explicit conversion policy (BR-10, BR-11).

### Scope

- **Delivery goal.** The MVP is a Production Pilot delivered in 2 weeks (14 days) for one company's internal use.
- **Eight feature groups.**

| Code | Group | Main content |
|:---:|---|---|
| F01 | License Management | Software Catalog, Vendor, Entitlement, Contract, Compliance |
| F02 | License Allocation | Request, approval, Assign, Revoke, allocation tracking |
| F03 | Budget Management | Budget per year or period, Expense, invoices, Budget Utilization |
| F04 | Lifecycle Management | Contract and maintenance dates, Renewal, expiry notifications |
| F05 | License Optimization | Unassigned and inactive licenses, Overuse, saving recommendations |
| F06 | Analytics & Reporting | License, Financial, Compliance dashboards; report export |
| F07 | User & Role Management | Accounts, departments, three-role permissions |
| F08 | System Administration | Login/logout, sessions, Audit Log, data import |

- **Priority.**
  - **P0 — required for the pilot:** login and RBAC; Catalog; SaaS/Perpetual Entitlement; Request – Approve/Reject; Assign/Revoke with quantity control; Budget and Expense; Usage entry; expiry tracking; core Dashboard; Audit Log.
  - **P1 — right after the core flow:** Vendor and Contract; CSV/Excel import; invoice upload; detection of unassigned licenses and licenses inactive for 60 days or more; Compliance Dashboard; report export.
  - **P2 — future:** automatic vendor integration, advanced SSO, AI optimization.
- **Out of scope for the first release:** synchronizing with vendor APIs, auto-provisioning or revoking accounts on the vendor's system, ERP or accounting integration, automatic payment, AI/ML optimization, multi-level approval, auto-revoking inactive licenses without a Manager, and multi-tenancy.

Detailed MVP scope, the 20 business rules (BR-01 to BR-20), non-functional requirements, the 12-entity data model, and the 14 acceptance criteria: [MVP specification](docs/01-MVP.md).

### 1.2 INVEST requirements

The backlog has **25 user stories** (19 P0, 6 P1) grouped by role: Manager 14, Staff 6, Employee 5. Every story passes the INVEST review and has Given/When/Then scenarios.

| Criterion | Meaning in VFast ELMS |
|---|---|
| **Independent** | Each story produces a demonstrable outcome; the Staff's data entry and the Employee's requests run independently through intermediate status tables. |
| **Negotiable** | Layout and implementation may change while outcome, permissions, and business rules stay fixed. |
| **Valuable** | Each story serves one of three pillars: license control, budget control, or cost optimization. |
| **Estimable** | Required fields, business constraints, and acceptance scenarios are explicit. |
| **Small** | Fits in 1–2 working days; manual entry of single records (P0) is separate from bulk CSV/Excel import (P1). |
| **Testable** | 100% of stories have Given/When/Then criteria, including authorization and error cases. |

```text
US-M01–M03   Manager: software catalog, entitlements, contracts
US-M04–M07   Manager: view requests, approve/reject, assign, revoke
US-M08–M09   Manager: budgets, review expense records
US-M10–M11   Manager: compliance and overuse, expiry and renewal
US-M12       Manager: optimization recommendations (P1)
US-M13       Manager: management dashboard
US-M14       Manager: users and role assignment
US-S01–S02   Staff: enter usage, import usage CSV/Excel (P1)
US-S03–S05   Staff: enter expense, import expense (P1), upload invoices (P1)
US-S06       Staff: review submitted data
US-U01–U03   Employee: view catalog, submit request, track request status
US-U04–U05   Employee: view assigned licenses, view expiry (P1)
```

Backlog, story ↔ use case traceability matrix, and acceptance criteria: [User stories](docs/03-user-stories.md).

### 1.3 Use cases

The use case diagram follows UML: actors as stick figures, one system boundary, and one ellipse per capability. Each ellipse groups related use cases and names them (for example UC07–11), so the 39 use cases fit in one picture. All roles log in and out with UC29. The Lifecycle Scheduler is the system actor (Lifecycle Notification System) that runs UC18.

![VFast ELMS use case overview](docs/diagrams/out/uc_overview.png)

Diagram source: [`docs/diagrams/ve_elms.py`](docs/diagrams/ve_elms.py), drawn with [`srsdiagram.py`](docs/diagrams/srsdiagram.py); also available as SVG and an editable draw.io file in [`docs/diagrams/out/`](docs/diagrams/out/). Regenerate with `python ve_elms.py` from `docs/diagrams` (needs Pillow, Playwright with Chromium, and the Liberation Sans font). Detailed diagrams with one ellipse per use case, per actor: [Use cases](docs/02-use-cases.md).

There are **39 use cases** (25 P0, 14 P1). Three main business flows:

1. **Request and allocation:** Employee views the catalog (UC37) → submits a request (UC06) → Manager reviews (UC07) → Approve/Reject (UC08) → checks the entitlement has free seats → Assign (UC09) → Employee sees the license (UC39).
2. **Usage and expense:** Staff enters or imports Usage (UC31, UC32) and Expense with invoices (UC33–35) → reviews submitted data (UC36) → Manager reconciles (UC13) → the system computes financial and compliance figures.
3. **Budget and lifecycle:** Manager sets a Budget (UC12) → Expenses are entered → the system computes `Actual Spending`, `Remaining Budget`, and `Budget Utilization` (UC14) → a cron job scans expiry dates (UC18) → Manager decides to Renew, Downsize, or Cancel (UC16).

Full list of 39 use cases, diagrams per role, sequence diagrams, and specifications of the P0 use cases: [Use cases](docs/02-use-cases.md).

### 1.4 Roles and permissions

There are three user roles. The Lifecycle Notification System is a system actor with no account.

| Capability | Manager | Staff | Employee |
|---|---|---|---|
| Software Catalog | CRUD | Read | Read (no price, no key) |
| Vendor | CRUD | Read | No access |
| License Entitlement | CRUD | Read | No access |
| Contract | CRUD | Read | No access |
| License Compliance | Manage / read | Read | No access |
| License Request | Review / approve | No access | Create / own |
| License Assignment | CRUD | No access | Read own |
| License Revocation | Manage | No access | No access |
| Budget | CRUD | Read | No access |
| Expense | CRUD | Enter / update | No access |
| License Usage | Read / manage | Enter / update | No access |
| Lifecycle | Manage | Read | Read own expiry |
| Optimization Insights | Manage / review | Read | No access |
| Dashboard and reports | Full | Related data only | Personal only |
| User and Role admin | CRUD | No access | No access |
| Audit Log | Read | Own actions | No access |
| Data Import | Manage | Execute | No access |

**System actor:** the Lifecycle Notification System scans SaaS expiry dates and Perpetual maintenance dates daily and sends alerts to Managers.

The backend must enforce RBAC, the Employee's access to personal data only (BR-08), and the rule that a Staff member cannot change an Entitlement or Budget (BR-09); hiding frontend controls serves UI/UX only.

## Documentation

- [MVP specification](docs/01-MVP.md) — scope, 20 business rules, NFRs, 12 entities, 14 acceptance criteria
- [Use cases](docs/02-use-cases.md) — 39 use cases, three business flows, sequence diagrams
- [User stories](docs/03-user-stories.md) — 25 user stories, Given/When/Then, traceability matrix
