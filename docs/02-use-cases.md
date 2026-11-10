# Use Cases

## 1. Actors

- **Manager** (primary): the license manager. The only human role in this phase.
- **Scheduled Job** (secondary): the system actor that runs automatic sync for UC06.

Employees, procurement, and accounting appear only as data sources or owners of data; they have no use cases here.

## 2. Use case diagram

One system boundary, one ellipse per use case, names in English as in the specification, no reference codes on the figure. Use cases are grouped by the screen they belong to.

![License Management System use case diagram](diagrams/out/uc_license_management.png)

Source: [`diagrams/out/uc_license_management.drawio`](diagrams/out/uc_license_management.drawio) (open with draw.io); the PNG and SVG are exported from it.

## 3. Inventory

UC01 to UC04 are kept as in the team's specification. UC05 merges three original use cases: View Application Usage, View Spend by Department and View Subscription Usage by Month. UC06 is an addition for the assigned task of automating data intake.

| ID | Use case | Screen | Goal | Source |
|---|---|---|---|---|
| UC01 | View License Overview Metrics | License Management | Grasp the size and structure of the license portfolio quickly | Team |
| UC02 | View License List | License Management | See all licenses in one table and find the ones that need attention | Team |
| UC03 | View License Detail | License Management | See cost, quantity, users and usage status of one application | Team |
| UC04 | View Analytics KPIs | Analytics | See total cost and the amount of waste across the whole portfolio | Team |
| UC05 | View Application Usage Breakdown | Analytics | Analyze cost and usage status along a chosen dimension: application, department, month, company, category; find the applications with the most unused accounts | Merge of 3 original use cases |
| UC06 | Upload and Sync License Data | Data Sources | Bring license, account and activity data into the system: manual upload is the base, automatic sync the priority direction | Addition |

Only UC05 and UC06 are specified below. UC01 to UC04 stay in the team's own specification, which is not part of this repository.

How usage status (Active, Inactive, No activity, Not monitored) is computed is a system rule, not a use case: each license belongs to one of 7 software groups with its own usage source and inactivity threshold. See [Usage effectiveness](03-usage-effectiveness.md).

### 3.1 Company filter (cross-cutting requirement)

Every screen has one shared Company filter, defaulting to the whole group. Choosing a subsidiary recomputes all figures of UC01 to UC05 within that company. This is a general requirement, not a separate use case.

## 4. UC05 – View Application Usage Breakdown

Merges View Application Usage, View Spend by Department and View Subscription Usage by Month: application, department and month become dimensions the Manager chooses. The originals measure different things (money, and subscriptions by status), so the merged use case has two selections: metric and dimension.

**Goal:** the Manager analyzes cost and usage status along a chosen dimension, and finds the applications with the most unused accounts.

**Precondition:** the Manager opens the Analytics screen.

**Main flow**
1. The Manager chooses a metric: Spend or Subscription usage.
2. The Manager chooses a dimension: Application, Department, Month, Company or Category.
3. The system shows a chart. For Spend: one bar per group, sorted by cost descending. For Subscription usage: stacked bars by status Active, Inactive, No activity, Not monitored, and a separate bar for Unassigned. With the dimension Application, bars are sorted by unused accounts (Inactive plus No activity) descending.
4. The Manager changes the year, or toggles a status in the legend.
5. The Manager hovers a bar to see the amount or subscription count and its share of the total.

**Alternative flows**
- Account without a department: put it in the group Unknown department.
- Unassigned seat: put its cost in the group Unallocated.
- Missing exchange rate: show each currency separately.
- Dimension Month: months not yet reached are hidden; the current month is marked as incomplete; a month with no data shows "No data", never a zero bar.

**Rules**
- Metric Spend: license cost is divided among seats; each seat counts toward the department and company of the person it is assigned to. Whatever the dimension, the total of all groups equals Total annual spend in UC04.
- Metric Subscription usage by Month: the status is evaluated on the last day of the month; the stacked total plus Unassigned equals the subscriptions purchased at that month end.
- Not monitored is never merged into Inactive or No activity.
- The latest month matches Underutilized accounts in UC04.

**Postcondition:** no data changes.

**Open point:** merging creates combinations the originals did not have, for example Spend by Month and Subscription usage by Department. Spend by Month needs monthly cost history; if it is not needed yet, state that it is deferred.

## 5. UC06 – Upload and Sync License Data

**Goal:** the Manager gets license, account and activity data into the system. Manual upload is always available; automatic sync is the priority direction and gradually replaces upload for each source.

**Precondition:** the Manager opens the Data Sources screen.

**Main flow (manual upload)**
1. The Manager downloads the template for the data type to import: licenses and contracts, assigned accounts, or usage activity.
2. The Manager uploads the filled Excel or CSV file.
3. The system checks format, required fields and duplicates, and shows a preview: rows to add, rows to update, rows with errors.
4. The Manager confirms; the system writes the data, matching accounts to employees and application names to the catalog.
5. The Manager adds or edits a single record on a form when uploading a whole file is not needed.
6. The Manager views the upload history: who, when, which file, how many rows.

**Extension flow (automatic sync, priority)**
1. The Manager connects a source: HR, IdP/SSO, a vendor API, or an endpoint management tool.
2. The system syncs on a schedule, daily by default, with the same validation and matching steps as an upload. The Scheduled Job runs this.
3. The Manager views the status of each source: last sync, record count, error count.

**Alternative flows**
- File has the wrong format or misses required fields: reject the whole file and point to the error rows.
- A record cannot be matched: put it in a pending list for the Manager to assign manually.
- An automatic source fails: keep the data of the last run and mark it Stale; the Manager can upload a replacement file.
- An application has no usage data from either way: its accounts are Not monitored.

**Rules**
- For each application, each data type has one primary source at a time: upload or sync. When sync is turned on, synced data replaces uploaded data of that type.
- Every record stores its origin (upload, form, or automatic source name) and a timestamp.
- Uploaded data can be edited in the system; data from an automatic source is edited at the source.
- Accounts that cannot be matched are shown per the UC03 rule (provider identity, Unknown department).

**Postcondition:** data of UC01 to UC05 is updated; the update time is recorded and shown in UC04.

## 6. How the use cases depend on each other

- UC06 feeds all other use cases: it supplies licenses, accounts and activity.
- UC03 to UC05 display usage statuses computed by the software-group rules in [Usage effectiveness](03-usage-effectiveness.md).
- UC01 to UC05 share the Company filter (section 3.1).

## 7. Points to adjust in the original use cases

- Status names: UC01 and the original View Application Usage use "Never used", the others use "No activity". Pick one.
- The fixed 60-day threshold of the original View Application Usage: change to "threshold of the license's software group, default 60 days".
- Applications with several price plans: UC04 (unit price of one seat) and UC05 (cost split among seats) should use the price of each Subscription type.
- Duplication: the top 5 Application Usage in UC01 overlaps UC05 with the dimension Application, and Total Licenses in UC01 equals Managed licenses in UC04. Keep them if the two screens are intentionally different.
- Licenses that are not seat-based: today they only show "—"; add a license-level usage ratio (see [Usage effectiveness](03-usage-effectiveness.md)).

Sections 6.4, 7.4, 7.5 and principle A4 of the team's specification, which the use cases refer to, have not been reviewed yet. Some points above may already be handled there.
