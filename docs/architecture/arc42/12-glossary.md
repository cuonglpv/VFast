# 12. Glossary

| Term | Definition |
|---|---|
| ELMS | Enterprise License Management System, this product |
| P&L | A company of the group; the top level of the organization |
| Unit | A node of the fixed hierarchy P&L > Block > Department > Project |
| License | One license a connector reports for one company, e.g. *Microsoft 365 E3* of company A |
| Shared license | A license bought once and used by two or more companies; Staff mark it, each company is charged for its use; its owner P&L is still to be decided (D53) |
| Cloud service | A pay-as-you-go cloud account (Azure, AWS, Google Cloud…) assigned to units |
| Plan | The budget: the license plan from SAP and the cloud budget set by Managers |
| Spend | What was bought, month by month: invoices spread over their terms, and the monthly cloud cost |
| Actual | The value of what is really used: seats in use, or what was consumed |
| Seat status | `Active`, `Inactive` (holder left), `No use`, `Not monitored`, or `Unassigned` |
| Forecast | Projection of Spend to year end against the Plan; never shown as actual |
| Connector | A configured read-only connection to one source (P&L API, ILVG, VinSOC, cloud provider) |
| ECS | The license data contract every P&L API implements ([Connector standard](../../06-connector-standard.md)) |
| ILVG | HR system: employees, units, projects, transfers |
| VinSOC | Application usage on company machines |
| Data scope | What a user may see: their unit and below (Manager), their Manager's units (Staff) |
| Data lake | Store for raw source data, landed before processing (technology TBD) |
| `Unknown` | A missing value; never shown as 0 (BR-04) |
| BR-xx / UCxx | Business rule / use case IDs in [Use cases](../../02-use-cases.md) |

Full definitions: [Use cases — Core concepts](../../02-use-cases.md#core-concepts).
