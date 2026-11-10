# Data Intake Automation

This is the approach for the extension flow of UC06 (see [Use cases](02-use-cases.md)). Manual upload is the base and is always available; automation replaces upload source by source following the roadmap below. The main principle: allocation data should be taken from where it really happens, so the Manager only handles exceptions instead of retyping into Excel.

## 1. Data sources and how to get them

| Data needed | Source | How to get it | Automation level |
|---|---|---|---|
| Staff: who, company, department, joins/transfers/leaves | HR system | Daily sync through API, or a periodic export file | Full |
| SaaS allocation: who holds which license | IdP/SSO and vendor admin API | Call the API on a schedule; if licenses are granted by group in the IdP, read the group members | Full |
| Software installed on workstations and servers | Existing endpoint management tool, or an inventory agent | Get the installed-software list per machine and link machines to users | Full |
| Usage | SSO, vendor API, agent, license server logs | Per group, see [Usage effectiveness](03-usage-effectiveness.md) | Full |
| Contracts, POs, invoices | Procurement, accounting, PDF files | Take from the procurement system if there is one; extract from PDF with OCR/AI, then the Manager confirms | Semi-automatic |
| Existing Excel data | Department heads' files | One-time import with a standard template and error checks | One time |
| Software without an API | Manager | Periodic file import with a template; manual entry as the last option | Manual with support |

## 2. Five design rules

- **Source priority:** API first, then periodic export file, then template import, and manual entry last.
- **One common key:** employee ID or company email, to match HR, IdP and the accounts on each software product.
- **Normalize software names:** the same product has several names across sources, so a mapping table to one standard catalog is needed.
- **Automatic on HR events:** when an employee leaves or changes department, the department and account status update by themselves, and the Manager sees it at once in the user table of UC03.
- **Never skip silently:** data that cannot be matched goes to the pending-assignment list in UC06 and is displayed as Unknown department.

## 3. Proposed roadmap

1. Standardize the template and import the existing Excel data to get an initial ledger.
2. Sync HR and IdP to get a clean user list and sign-in data.
3. Connect APIs for the most expensive SaaS products.
4. Inventory workstations and read license server logs for installed and concurrent software.
5. Extract contracts with OCR/AI.

Step 2 removes most manual SaaS allocation entry, provided the group has a central IdP, which is not yet confirmed (see the open questions in [Scope](01-scope.md)).
