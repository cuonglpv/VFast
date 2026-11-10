# Use Cases

## 1. Actors

- **Admin** (primary): the license manager. The only human role in this phase.
- **Scheduled Job** (secondary): the system actor that runs automatic sync for UC07.

Employees, procurement, and accounting appear only as data sources or owners of data; they have no use cases here.

## 2. Use case diagram

The diagram follows the team's diagram skill (`ve-diagram-srs`): one system boundary, one ellipse per use case, names in English as in the specification, no reference codes on the figure.

![License Management System use case diagram](diagrams/out/uc_license_management.png)

Source: [`diagrams/ve_license.py`](diagrams/ve_license.py), drawn with [`srsdiagram.py`](diagrams/srsdiagram.py); SVG and an editable draw.io file are in [`diagrams/out/`](diagrams/out/). Regenerate with `python ve_license.py` from `docs/diagrams` (needs Pillow, Playwright with Chromium, and Liberation Sans or Arial).

## 3. Inventory

UC01 to UC05 are kept as in the team's specification. UC06 merges two original use cases (View Spend by Department and View Subscription Usage by Month). UC07 and UC08 are additions for the two assigned tasks: automating data intake and measuring usage effectiveness.

| ID | Use case | Screen | Goal | Source |
|---|---|---|---|---|
| UC01 | View License Overview Metrics | License Management | Grasp the size and structure of the license portfolio quickly | Team |
| UC02 | View License List | License Management | See all licenses in one table and find the ones that need attention | Team |
| UC03 | View License Detail | License Management | See cost, quantity, users and usage status of one application | Team |
| UC04 | View Analytics KPIs | Analytics | See total cost and the amount of waste across the whole portfolio | Team |
| UC05 | View Application Usage | Analytics | Find the applications with the most unused accounts | Team |
| UC06 | View Spend and Usage Breakdown | Analytics | Analyze cost and usage status along a chosen dimension: department, month, company, category | Merge of original UC06 and UC07 |
| UC07 | Upload and Sync License Data | Data Sources | Bring license, account and activity data into the system: manual upload is the base, automatic sync the priority direction | Addition |
| UC08 | Measure License Usage Effectiveness | Settings | Measure each license in the way that fits its software group | Addition |

Only UC06, UC07 and UC08 are specified below. UC01 to UC05 stay in the team's own specification, which is not part of this repository.

### 3.1 Company filter (cross-cutting requirement)

Every screen has one shared Company filter, defaulting to the whole group. Choosing a subsidiary recomputes all figures of UC01 to UC06 within that company. This is a general requirement, not a separate use case.

## 4. UC06 – View Spend and Usage Breakdown

Merges View Spend by Department and View Subscription Usage by Month: department and month become dimensions the Admin chooses. The two originals measure different things (money, and subscriptions by status), so the merged use case has two selections: metric and dimension.

**Goal:** the Admin analyzes cost and usage status along a chosen dimension.

**Precondition:** the Admin opens the Analytics screen.

**Main flow**
1. The Admin chooses a metric: Spend or Subscription usage.
2. The Admin chooses a dimension: Department, Month, Company or Category.
3. The system shows a chart. For Spend: one bar per group, sorted by cost descending. For Subscription usage: stacked bars by status Active, Inactive, No activity, Not monitored, and a separate bar for Unassigned.
4. The Admin changes the year, or toggles a status in the legend.
5. The Admin hovers a bar to see the amount or subscription count and its share of the total.

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

**Open point:** merging creates two combinations the originals did not have: Spend by Month and Subscription usage by Department. The first needs monthly cost history; if it is not needed yet, state that it is deferred.

## 5. UC07 – Upload and Sync License Data

**Goal:** the Admin gets license, account and activity data into the system. Manual upload is always available; automatic sync is the priority direction and gradually replaces upload for each source.

**Precondition:** the Admin opens the Data Sources screen.

**Main flow (manual upload)**
1. The Admin downloads the template for the data type to import: licenses and contracts, assigned accounts, or usage activity.
2. The Admin uploads the filled Excel or CSV file.
3. The system checks format, required fields and duplicates, and shows a preview: rows to add, rows to update, rows with errors.
4. The Admin confirms; the system writes the data, matching accounts to employees and application names to the catalog.
5. The Admin adds or edits a single record on a form when uploading a whole file is not needed.
6. The Admin views the upload history: who, when, which file, how many rows.

**Extension flow (automatic sync, priority)**
1. The Admin connects a source: HR, IdP/SSO, a vendor API, or an endpoint management tool.
2. The system syncs on a schedule, daily by default, with the same validation and matching steps as an upload. The Scheduled Job runs this.
3. The Admin views the status of each source: last sync, record count, error count.

**Alternative flows**
- File has the wrong format or misses required fields: reject the whole file and point to the error rows.
- A record cannot be matched: put it in a pending list for the Admin to assign manually.
- An automatic source fails: keep the data of the last run and mark it Stale; the Admin can upload a replacement file.
- An application has no usage data from either way: its accounts are Not monitored.

**Rules**
- For each application, each data type has one primary source at a time: upload or sync. When sync is turned on, synced data replaces uploaded data of that type.
- Every record stores its origin (upload, form, or automatic source name) and a timestamp.
- Uploaded data can be edited in the system; data from an automatic source is edited at the source.
- Accounts that cannot be matched are shown per the UC03 rule (provider identity, Unknown department).

**Postcondition:** data of UC01 to UC06 is updated; the update time is recorded and shown in UC04.

## 6. UC08 – Measure License Usage Effectiveness

**Goal:** the system measures the usage effectiveness of each license in the way that fits its software group, instead of one global threshold. The Admin can change the measurement method and thresholds. The 7 groups and their rules are in [Usage effectiveness](03-usage-effectiveness.md).

**Precondition:** the license is already in the catalog.

**Main flow**
1. The system shows the list of software groups with default rules: usage source, activity signal, inactivity threshold.
2. The Admin assigns a license to a group.
3. The Admin changes the signal or threshold for a group, or only for one license.
4. The system previews how many accounts will change status.
5. The Admin saves; the system recomputes the statuses.

**Alternative flows**
- License not yet assigned to a group: use the default rule, threshold 60 days.
- A group has no usage source: its accounts are Not monitored.
- A license that is not account-based: measure at license level with a usage ratio (see [Usage effectiveness](03-usage-effectiveness.md)).

**Rules**
- Each license belongs to exactly one group.
- A rule set on a license takes priority over the group rule.
- Changing a rule does not recompute past months in UC06.
- Every change records who made it and when.

**Postcondition:** account statuses in UC03, UC04, UC05 and UC06 follow the new rule.

## 7. How the use cases depend on each other

- UC07 feeds all other use cases: it supplies licenses, accounts and activity.
- UC08 decides how statuses are computed; UC03 to UC06 only display them.
- UC03 to UC06 share the Company filter (section 3.1).

## 8. Points to adjust in the original use cases

- Status names: UC01 and UC05 use "Never used", the others use "No activity". Pick one.
- The 60-day threshold in UC05: change to "threshold from UC08, default 60 days".
- Applications with several price plans: UC04 (unit price of one seat) and UC06 (cost split among seats) should use the price of each Subscription type.
- Duplication: the top 5 Application Usage appears in both UC01 and UC05, and Total Licenses in UC01 equals Managed licenses in UC04. Keep them if the two screens are intentionally different.
- Licenses that are not seat-based: today they only show "—"; add a license-level metric per UC08.

Sections 6.4, 7.4, 7.5 and principle A4 of the team's specification, which the use cases refer to, have not been reviewed yet. Some points above may already be handled there.
