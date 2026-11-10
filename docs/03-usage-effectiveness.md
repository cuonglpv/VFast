# Usage Effectiveness Measurement

There is no single metric for all software: the license model decides what to measure and where the data comes from. The solution assigns each software product to one of 7 groups. Each group has its own usage source, activity signal and inactivity threshold. This is a system rule, not a use case: UC03 to UC05 display the statuses it produces (see [Use cases](02-use-cases.md)).

**Link to UC01–UC05.** Groups 1 to 3 have concrete accounts or devices, so the result maps to the statuses Active, Inactive and No activity, and the viewing use cases work as they are. Groups 4 to 7 have no per-person accounts, so they are measured at license level with a usage ratio shown in UC03, and are not added to Underutilized accounts in UC04.

**Rules**
- Each license belongs to exactly one group.
- A license not yet assigned to a group uses the default rule, threshold 60 days.
- A group with no usage source: its accounts are Not monitored.

## 1. Metrics common to every group

| Metric | Formula | Question it answers |
|---|---|---|
| Allocation rate | Allocated / Purchased | Is what was bought being handed out? |
| Usage rate | Actually in use / Allocated | Is what was handed out being used? |
| Wasted cost | (Purchased − Actually in use) × unit price | How much money is lost? |
| Cost per real user | Total cost / Number of real users | What does one real user actually cost? |

"Actually in use" is the part that differs between groups.

## 2. How to measure by software group

| Group | Examples | Usage data source | Definition of "in use" | Group-specific metric | Sign of low effectiveness |
|---|---|---|---|---|---|
| 1. Office and collaboration SaaS, per user | Microsoft 365, Google Workspace, Zoom, Slack | Usage reports from the vendor admin API; SSO sign-in logs | Activity within 30 days | Number of services in the plan the user really uses | No activity for 30–60 days; high plan but only email used |
| 2. Specialized SaaS, per seat | Salesforce, Jira, Figma, Adobe Creative Cloud | Vendor API; SSO | Signed in and did business actions (create, edit) within 60–90 days | Active days per month; view-only versus edit ratio | Paid seat used only to view; no sign-in for 90 days |
| 3. Installed software, per device or user | Perpetual Office, Visio, Project, standalone AutoCAD | Agent or endpoint management tool recording running processes | Application opened within 90 days | Days opened per month; run time | Installed but not opened for 90 days; installed on a machine with no user |
| 4. Concurrent/floating | MATLAB, ANSYS, network AutoCAD | License server logs | Licenses held at the same time | Peak concurrent / Total licenses; number of denials for lack of license | A peak far below the total means surplus; many denials mean shortage |
| 5. Server, per core, CPU or instance | Windows Server, SQL Server, Oracle DB, VMware | Server inventory and virtualization platform | Instance running with load | Cores purchased versus cores deployed | Instance with no load; deployment above purchased cores |
| 6. Consumption-based | AI tools, pay-per-use APIs, credits | Vendor API and billing reports | Consumption in the period | Consumption / Purchased commitment | Far below commitment, or above it and billed overage |
| 7. Enterprise/site, unlimited quantity | Antivirus, company-wide bundles | Endpoint inventory; staff list | Installed or activated | Coverage: deployed / allowed or total staff | Low coverage: paying company-wide but few places use it |

The day thresholds are starting suggestions to tune per product. For example, tax-settlement software used only quarterly would be flagged wrongly by a 30-day threshold.

## 3. Approach: three measurement levels, easy to hard

- **Level 1, accessed or not.** Use the last sign-in from SSO or the last time the application was opened. One source covers many products, enough to find abandoned licenses.
- **Level 2, heavy or light use.** Use frequency and activity from the vendor API, agents and license server logs. Needs a separate connection per product, so start with the expensive ones.
- **Level 3, right plan or not.** Compare features used with the plan purchased to recommend a downgrade. Applies only to a few products with several plan tiers.
