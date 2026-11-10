# Scope Proposal – Internal License Management

## 1. Summary

The project is a set of analysis documents for a self-built license management system. It serves the license manager of a group of subsidiaries and covers every kind of license. The scope has three parts:

1. **8 use cases** for the license manager: 6 for viewing and analyzing, 2 additions.
2. **A usage-effectiveness solution** that measures usage across 7 software groups.
3. **A data-intake solution**: manual upload is the base, automation is the priority direction.

Nothing is implemented yet. Two confirmed pain points set the priority: allocation is entered by hand, and nobody can tell whether issued licenses are used.

## 2. Pain points

P1 and P2 are confirmed. P3 to P6 are problems that usually come with Excel-based management.

| # | Pain point | Symptom | Use case |
|---|---|---|---|
| P1 | Manual entry of license allocation (confirmed) | The department head records every grant and revocation in Excel; data is late and drifts from reality | UC07 |
| P2 | Usage effectiveness not tracked (confirmed) | Nobody knows whether an issued license is used, and how much | UC08 (measure), UC03–UC06 (display) |
| P3 | No overall picture | Each subsidiary and department has its own Excel file; the group cannot consolidate | UC01, UC02, UC06 |
| P4 | Compliance and audit risk | Use beyond what was bought; no figures when a vendor audits | UC02 (Compliance status column) |
| P5 | Passive renewal | Renewing the old quantity although demand changed; missed deadlines | UC02 (Expiring soon flag) |
| P6 | Shadow IT | Departments buy or install on their own, outside IT | None yet, later phase |

Confirmed current state: licenses are managed in Excel, owned by the department head. The symptoms of P3 to P6 are generic descriptions that are not yet verified at the company.

## 3. Scope

The scope is analysis documents, not a running product: use cases for the manager, how to measure usage effectiveness, and how to automate data intake.

| Item | In scope | Out of scope |
|---|---|---|
| Deliverables | Scope document, use case list, effectiveness solution, intake-automation solution, mind map | Code, deployment, detailed technology choices |
| Main user | License manager (a single role) | Detailed use cases for employees, procurement, accounting (secondary actors only) |
| License types | All: per-user SaaS, installed software per device or user, concurrent/floating, server per core, enterprise/site, consumption-based | Hardware, cloud infrastructure cost |
| Organization | Group of subsidiaries; data separated per company and aggregated at group level | |
| Business | View catalog and detail, analyze cost and usage effectiveness, collect data automatically, configure how usage is measured | Grant or revoke actions in the system; procurement, payment, contract negotiation |
| Automation | Solution and approach per data source, proposed roadmap | Building real connectors |

In this phase the system only observes and analyzes: there is no grant or revoke action. Data enters in two ways (UC07): manual upload is always available, and automatic sync is the priority direction to reduce manual entry over time.

## 4. Open questions

Three directions are settled: self-built (documents only), all license types, a group of subsidiaries. The questions below still affect the measurement and automation solutions.

- [ ] Does the group have a central IdP/SSO (Entra ID, Google, Okta), or one system per subsidiary?
- [ ] Is there a shared HR system and a consistent employee ID across subsidiaries?
- [ ] Is an endpoint management tool (Intune, SCCM or equivalent) already in place?
- [ ] What are the 10–20 most expensive software products, and which of the 7 groups do they belong to?
- [ ] Which columns does the current Excel file have? Can we get a masked sample?
- [ ] Do subsidiaries buy licenses separately, or does the group buy together and split? (affects cost splitting in UC06 and the Company filter)
- [ ] Besides the manager, will anyone else use the system later? (decides whether permissions are needed)
- [ ] What do sections 6.4, 7.4, 7.5 and principle A4 of the team's specification say? They need to be read to align UC07 and UC08 with them.

## 5. References

- The team's specification of the 7 original use cases (text file attached in the conversation)
