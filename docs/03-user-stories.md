# User Stories Specification
## Project: VFast – Enterprise License Management System (ELMS)
### Reference: Software Requirements Specification (SRS v1.0)

---

## 1. INVEST Methodology & Standardization Criteria

All 25 User Stories of the VFast ELMS system are developed and verified based on the **INVEST** principles of agile software engineering:

| INVEST Criterion | Quality Verification Meaning | Implementation in VFast ELMS |
| :--- | :--- | :--- |
| **I – Independent** | Each story can be developed, tested, and delivered independently without hard dependencies on other stories. | Data entry workflows for Staff (expense entry) and Employee (request submission) are processed independently via intermediate status tables. |
| **N – Negotiable** | Captures the essence of business objectives without being tightly coupled to specific technical implementations. | Focuses on business rules and desired outcomes, allowing the technical team flexibility in technology choices during sprints. |
| **V – Valuable** | Delivers direct value to users or helps the organization save costs and maintain compliance. | Every story directly serves one of the 3 pillars: License Management, Budget Control, or Cost Optimization. |
| **E – Estimable** | Sufficiently clear for the development team to estimate complexity and effort. | Accompanied by mandatory data fields, business constraints, and concrete acceptance scenarios. |
| **S – Small** | Sized appropriately to be completed within 1 to 2 developer working days. | Separates single manual operations (P0) from bulk CSV/Excel import features (P1). |
| **T – Testable** | Features clear acceptance criteria enabling QA/QC and end users to verify correctness. | 100% of User Stories include standard **Given - When - Then** acceptance scenarios (Gherkin format). |

---

## 2. Allocation Table of 25 User Stories by 3 Roles & Priority Levels (P0 / P1)

Standardized according to **Section 6 of SRS v1.0**, all 25 User Stories are categorized into 3 user groups:

```mermaid
pie title Breakdown of 25 User Stories by Role
    "Manager (14 Stories)" : 14
    "Staff (6 Stories)" : 6
    "Employee (5 Stories)" : 5
```

| Role Group | Story Code | User Story Name | Priority | Linked Use Cases |
| :--- | :--- | :--- | :---: | :---: |
| **Manager** | **US-M01** | Manage Standard Software Product Catalog | **P0** | UC01, UC02 |
| | **US-M02** | Register & Manage Entitlements (SaaS & Perpetual) | **P0** | UC02, UC03 |
| | **US-M03** | Manage Legal License Procurement Contracts | P1 | UC04 |
| | **US-M04** | Review License Request List from Employees | **P0** | UC07 |
| | **US-M05** | Approve or Reject License Requests | **P0** | UC08 |
| | **US-M06** | Assign Licenses to Employees | **P0** | UC09, UC11 |
| | **US-M07** | Revoke Licenses to Release Capacity | **P0** | UC10 |
| | **US-M08** | Set Up and Manage Software Budgets | **P0** | UC12, UC14 |
| | **US-M09** | Review and Manage Actual Expense Records | **P0** | UC13, UC14 |
| | **US-M10** | Monitor License Compliance and Detect Overuse | **P0** | UC05, UC21, UC25 |
| | **US-M11** | Track Contract Expirations and Renewal Plans | **P0** | UC15, UC16, UC17, UC18 |
| | **US-M12** | Evaluate Cost Optimization Recommendations | P1 | UC19, UC20, UC22 |
| | **US-M13** | View Management Dashboards for Assets and Finances | **P0** | UC23, UC24, UC25, UC26 |
| | **US-M14** | Administer User Accounts and 3-Role Permissions | **P0** | UC27, UC28, UC29, UC30 |
| **Staff** | **US-S01** | Input Actual License Usage Data | **P0** | UC29, UC31 |
| | **US-S02** | Import License Usage Data from CSV/Excel Files | P1 | UC32 |
| | **US-S03** | Record Incurred Actual Expenses | **P0** | UC33, UC13 |
| | **US-S04** | Import Expense Data from CSV/Excel Files | P1 | UC34 |
| | **US-S05** | Upload Invoices and Supporting Document Attachments | P1 | UC35 |
| | **US-S06** | View and Verify All Submitted Data | **P0** | UC26, UC36 |
| **Employee** | **US-U01** | View Available Software Catalog | **P0** | UC29, UC37 |
| | **US-U02** | Submit New License Requests | **P0** | UC06 |
| | **US-U03** | Track Own Request Processing Status | **P0** | UC38 |
| | **US-U04** | View List of Currently Assigned Licenses | **P0** | UC39, UC11 |
| | **US-U05** | View Personal License Validity and Expiration Dates | P1 | UC39 |

The "Linked Use Cases" column matches the Traceability Matrix in Section 4.

**P0 Scope for Stories Linking P1 Use Cases (D3 in [MVP](01-MVP.md)):** `US-M01` delivers the `UC01` portion in P0; `US-M02` delivers the `UC03` portion in P0, with Vendor per D1; `US-M10` delivers the `UC05`, `UC21` portion in P0; `US-M11` delivers the `UC15`, `UC18` portion in P0; `US-M13` delivers the `UC23`, `UC24` portion in P0; `US-S06` delivers the `UC36` portion in P0. Remaining P1 use cases (`UC02`, `UC16`, `UC17`, `UC25`, `UC26`) are delivered in P1.

---

## 3. Detailed Specification of Each User Story (Given - When - Then)

### Common Authorization and Error Scenarios (Applicable to All Stories)

The scenarios below constitute acceptance criteria for **every** story, tested against each API endpoint used by the story. Individual stories below only list their specific scenarios.

- **Scenario C1: Unauthenticated Request**
  - *Given:* A request without a valid session.
  - *When:* The request invokes the story's API.
  - *Then:* The system returns `401` and makes no data modifications.
- **Scenario C2: Unauthorized Role**
  - *Given:* A user whose role is not granted permission according to the permission matrix in README (e.g., an Employee calling the request approval API, or Staff modifying Entitlements or Budgets per BR-09).
  - *When:* The user invokes that API, including direct API calls bypassing the UI.
  - *Then:* The system returns `403`, makes no data modifications, and does not rely merely on hiding UI buttons.
- **Scenario C3: Accessing Another User's Data**
  - *Given:* Employee A and Employee B both have requests and licenses; Staff A and Staff B both have submitted data.
  - *When:* User A attempts to access User B's record using the record identifier.
  - *Then:* The system returns `404` and does not disclose whether the record exists (BR-08).
- **Scenario C4: Deactivated Account**
  - *Given:* An account is deactivated while an active session exists.
  - *When:* The user sends the next request.
  - *Then:* The system rejects the request (BR-18).
- **Scenario C5: Invalid Data**
  - *Given:* Submitted data is missing mandatory fields or has an invalid format.
  - *When:* The user submits the form or calls the API.
  - *Then:* The system returns `422` with field-level errors and does not persist the data.

---

### Group 1: User Stories for MANAGER Role (14 Stories)

#### US-M01: Manage Standard Software Product Catalog
- **Code:** `US-M01` | **Priority:** `P0`
- **User Story:**
  > *As a Manager, I want to manage software products, so that the company maintains a centralized software catalog.*
- **Acceptance Criteria:**
  - **Scenario 1: Successfully create new software product**
    - *Given:* Manager is on the Software Catalog Management screen (`UC01`).
    - *When:* Enters Product Name = "Figma", Vendor = "Figma Inc", Category = "Design", License Type = "SaaS Subscription", Status = "Active", and clicks Save.
    - *Then:* The software record is saved successfully with a unique identifier and displayed in the standard catalog.
  - **Scenario 2: Duplicate software product error**
    - *Given:* The product "Figma" from vendor "Figma Inc" already exists in the database.
    - *When:* Manager attempts to create a new product with the same name and vendor.
    - *Then:* The system rejects the creation and displays an error message: *"Software product already exists in the catalog."*

#### US-M02: Register & Manage Entitlements (SaaS & Perpetual)
- **Code:** `US-M02` | **Priority:** `P0`
- **User Story:**
  > *As a Manager, I want to register SaaS and Perpetual entitlements, so that I can track company-owned licenses.*
- **Acceptance Criteria (per Section 6.4 SRS):**
  - **Scenario 1: Register valid SaaS subscription package**
    - *Given:* Manager has permission to create Entitlements.
    - *When:* Manager creates a SaaS Entitlement with Name = "Microsoft 365 E3", Quantity = 100 seats, Billing Cycle = Annual, Start Date = 2026-01-01, End Date = 2026-12-31.
    - *Then:* The system stores subscription details, initializing `purchased_quantity = 100`, `available_quantity = 100`.
  - **Scenario 2: Register Perpetual license**
    - *Given:* Manager selects software "AutoCAD 2026".
    - *When:* Creates a Perpetual Entitlement with Quantity = 10 licenses, Purchase Date = 2026-01-15, Maintenance Expiry = 2027-01-15.
    - *Then:* The system stores perpetual license information and manages maintenance terms in a separate field (BR-12), without automatically assigning an expiration date to the perpetual license.
  - **Scenario 3: Validate mandatory fields and record Audit Log**
    - *Given:* Manager is creating a SaaS Entitlement.
    - *When:* Manager leaves the Expiration Date field empty and clicks Save.
    - *Then:* The system rejects the save and reports an error requiring the expiration date; upon entering a valid date and saving successfully, the action is recorded in the Audit Log.

#### US-M03: Manage Legal License Procurement Contracts
- **Code:** `US-M03` | **Priority:** `P1`
- **User Story:**
  > *As a Manager, I want to manage contracts, so that I can track legal agreements and license terms.*
- **Acceptance Criteria:**
  - *Given:* Manager has a PDF procurement contract for Oracle software.
  - *When:* Creates a new Contract record, enters Contract Number, Value, Signing Date, and attaches the PDF file.
  - *Then:* The contract is securely saved and successfully linked to related Entitlements (`UC04`).

#### US-M04: Review License Request List from Employees
- **Code:** `US-M04` | **Priority:** `P0`
- **User Story:**
  > *As a Manager, I want to review license requests, so that I can understand employees' software needs.*
- **Acceptance Criteria:**
  - *Given:* There are license requests in `Pending` status in the system.
  - *When:* Manager accesses the Request Management page (`UC07`).
  - *Then:* Displays full details: Request ID, Employee Name, Department, Requested Software, Justification, Submission Timestamp, and remaining available seats in inventory.

#### US-M05: Approve or Reject License Requests
- **Code:** `US-M05` | **Priority:** `P0`
- **User Story:**
  > *As a Manager, I want to approve or reject requests, so that license distribution follows company policy.*
- **Acceptance Criteria (per Section 6.4 SRS):**
  - **Scenario 1: Approve pending request**
    - *Given:* A request is in `Pending` status.
    - *When:* Manager clicks the "Approve" button.
    - *Then:* The request status changes to `Approved`, records the approver, approval timestamp, and sends a notification to the Employee.
  - **Scenario 2: Reject request requires justification**
    - *Given:* A request is in `Pending` status.
    - *When:* Manager clicks the "Reject" button.
    - *Then:* The system mandates entering a rejection reason; saves status as `Rejected` with the explanation reason.
  - **Scenario 3: Prevent re-processing already handled requests**
    - *Given:* A request is already in `Approved` or `Rejected` status.
    - *When:* A user attempts to approve or reject it again.
    - *Then:* The system blocks the action and displays an error: *"Request has already been processed and cannot be reviewed again."* (BR-19).

#### US-M06: Assign Licenses to Employees
- **Code:** `US-M06` | **Priority:** `P0`
- **User Story:**
  > *As a Manager, I want to assign licenses, so that approved requests can be fulfilled.*
- **Acceptance Criteria (per Section 6.4 SRS):**
  - **Scenario 1: Successful assignment when capacity is available**
    - *Given:* A valid Entitlement exists with $\text{Available Quantity} > 0$.
    - *When:* Manager assigns a license to an approved employee.
    - *Then:* Creates a `LicenseAssignment` record, increments `allocated_quantity` by 1 unit (`available_quantity` computed decreases by 1), and transitions the associated request to `Fulfilled`.
  - **Scenario 2: Prevent assignment exceeding purchased quantity**
    - *Given:* An Entitlement has $\text{Available Quantity} = 0$.
    - *When:* Manager attempts to assign an additional seat to an employee.
    - *Then:* The system rejects the transaction and displays an error message: *"Allocated quantity cannot exceed available license quantity."* (BR-05).
  - **Scenario 3: Concurrent assignment for the last available seat**
    - *Given:* An Entitlement has only $\text{Available Quantity} = 1$.
    - *When:* Two Managers simultaneously submit assignment requests for two different employees.
    - *Then:* Only one transaction succeeds; the other transaction is rejected per BR-05, and `allocated_quantity` does not exceed `purchased_quantity`.
  - **Scenario 4: Prevent duplicate assignment**
    - *Given:* An employee already has an `Active` assignment for that software, or the request is already in `Fulfilled` status.
    - *When:* Manager attempts to assign another license to that employee or against that request.
    - *Then:* The system rejects the transaction without altering seat counts.

#### US-M07: Revoke Licenses to Release Capacity
- **Code:** `US-M07` | **Priority:** `P0`
- **User Story:**
  > *As a Manager, I want to revoke license assignments, so that unused licenses can be released.*
- **Acceptance Criteria:**
  - *Given:* Employee A is currently assigned 1 seat of Slack Pro.
  - *When:* Manager clicks "Revoke" and inputs Reason = "Employee changed project".
  - *Then:* The assignment status transitions to `Revoked`, available inventory capacity increases by 1 unit, and the assignment history is retained in the system for auditing (BR-13). If the assignment was already revoked previously, the system reports an error and does not return the seat a second time.

#### US-M08: Set Up and Manage Software Budgets
- **Code:** `US-M08` | **Priority:** `P0`
- **User Story:**
  > *As a Manager, I want to manage budgets, so that software spending can be controlled.*
- **Acceptance Criteria:**
  - *Given:* Manager is in the Budget Management module (`UC12`).
  - *When:* Sets Fiscal Year 2026 Budget for Engineering Department = 500,000,000 VND.
  - *Then:* The system stores the budget limit and automatically links it to actual incurred expenses.

#### US-M09: Review and Manage Actual Expense Records
- **Code:** `US-M09` | **Priority:** `P0`
- **User Story:**
  > *As a Manager, I want to review expense records, so that I can monitor software costs.*
- **Acceptance Criteria:**
  - *Given:* Staff has submitted software procurement and renewal expense records.
  - *When:* Manager opens the expense list (`UC13`).
  - *Then:* Displays detailed amount, payment date, invoice number, and beneficiary department; supports filtering by software or vendor.

#### US-M10: Monitor License Compliance and Detect Overuse
- **Code:** `US-M10` | **Priority:** `P0`
- **User Story:**
  > *As a Manager, I want to monitor license compliance, so that I can identify overuse risks.*
- **Acceptance Criteria:**
  - *Given:* A software package has 50 purchased seats, but recorded data indicates 53 people are actively using it.
  - *When:* Manager accesses the Compliance Monitoring page (`UC05`, `UC21`).
  - *Then:* The system displays a red warning label `Overused: +3 seats`, flagging contract violation risk for the Manager to purchase additional seats or revoke assignments.

#### US-M11: Track Contract Expirations and Renewal Plans
- **Code:** `US-M11` | **Priority:** `P0`
- **User Story:**
  > *As a Manager, I want to monitor license expiration, so that I can prepare renewal decisions.*
- **Acceptance Criteria:**
  - *Given:* Zoom Pro subscription contract expires in 20 days.
  - *When:* Manager logs into the system.
  - *Then:* The system categorizes this contract under the "Upcoming" expiration alert group on the Dashboard to prepare for renewal (`UC15`).

#### US-M12: Evaluate Cost Optimization Recommendations
- **Code:** `US-M12` | **Priority:** `P1`
- **User Story:**
  > *As a Manager, I want to review optimization recommendations, so that I can identify cost-saving opportunities.*
- **Acceptance Criteria:**
  - *Given:* The system detects 15 software seats with no usage activity for more than 60 days.
  - *When:* Manager opens the Optimization page (`UC22`).
  - *Then:* The system displays recommendation: *"Consider revoking 15 inactive seats to achieve estimated monthly cost savings."*

#### US-M13: View Management Dashboards for Assets and Finances
- **Code:** `US-M13` | **Priority:** `P0`
- **User Story:**
  > *As a Manager, I want to view management dashboards, so that I can understand the overall license and budget situation.*
- **Acceptance Criteria:**
  - *Given:* Manager accesses the system home page (`UC23`, `UC24`).
  - *When:* Dashboard loads.
  - *Then:* Fully displays key metrics: Total Software Products, Seat Allocation Rate, Budget Utilization Rate (`Budget Utilization`), Compliance Alerts, and Upcoming Expirations.

#### US-M14: Administer User Accounts and 3-Role Permissions
- **Code:** `US-M14` | **Priority:** `P0`
- **User Story:**
  > *As a Manager, I want to manage users and roles, so that system access follows company policies.*
- **Acceptance Criteria:**
  - *Given:* Manager is on the User Management screen (`UC27`, `UC28`).
  - *When:* Assigns role `Staff` to a new IT employee.
  - *Then:* The account is granted permissions to input Usage and Expense, with no authority to approve requests or modify Entitlements.
  - **Account Deactivation (BR-18):**
    - *Given:* A user currently has an active login session.
    - *When:* Manager deactivates that account.
    - *Then:* The user's next request is rejected, the session is revoked, and the action is recorded in the Audit Log.

---

### Group 2: User Stories for STAFF Role (6 Stories)

#### US-S01: Input Actual License Usage Data
- **Code:** `US-S01` | **Priority:** `P0`
- **User Story:**
  > *As a Staff member, I want to input license usage data, so that actual software consumption can be monitored.*
- **Acceptance Criteria:**
  - *Given:* Staff is on the Usage Entry screen (`UC31`).
  - *When:* Selects employee, software, enters Last Activity Date, Usage Level, and clicks Save.
  - *Then:* Usage record is created successfully, automatically setting `created_by = Staff_ID` and system timestamp.

#### US-S02: Import License Usage Data from CSV/Excel Files
- **Code:** `US-S02` | **Priority:** `P1`
- **User Story:**
  > *As a Staff member, I want to import usage data from CSV/Excel, so that large amounts of usage information can be updated efficiently.*
- **Acceptance Criteria:**
  - *Given:* An Excel file containing monthly activity data exported from an SSO admin portal.
  - *When:* Staff uploads the file to the system (`UC32`).
  - *Then:* The system validates row by row, reports the number of valid rows, and loads them into the database.
  - **Error Scenario: File contains invalid rows**
    - *Given:* The import file contains at least one invalid row (e.g., non-existent employee or invalid date format).
    - *When:* Staff uploads the file to the system.
    - *Then:* The system imports zero rows and returns an error list with row numbers and reasons (D16).

#### US-S03: Record Incurred Actual Expenses
- **Code:** `US-S03` | **Priority:** `P0`
- **User Story:**
  > *As a Staff member, I want to input expense records, so that software-related costs are recorded.*
- **Acceptance Criteria:**
  - *Given:* The enterprise just paid the renewal expense for GitHub Enterprise.
  - *When:* Staff inputs Amount = 20,000,000 VND, Payment Date = 2026-03-05, Invoice Number = "HD-8812", and clicks Save (`UC33`).
  - *Then:* The expense record is saved successfully and automatically factored into the period's actual spending (`Actual Spending`).

#### US-S04: Import Expense Data from CSV/Excel Files
- **Code:** `US-S04` | **Priority:** `P1`
- **User Story:**
  > *As a Staff member, I want to import expense data from CSV/Excel, so that financial records can be updated efficiently.*
- **Acceptance Criteria:**
  - **Scenario 1: Successful import**
    - *Given:* Staff has a CSV/Excel template file where each row contains Amount, Currency, Payment Date, Software, Department, and Invoice Number.
    - *When:* Staff uploads the file to the system (`UC34`).
    - *Then:* The system validates each row per BR-10, imports all rows, sets `created_by = Staff_ID`, reports the count of loaded records, and includes these amounts in `Actual Spending`.
  - **Scenario 2: File contains invalid rows**
    - *Given:* The file contains at least one row missing currency, with amount $\le 0$, or missing payment date.
    - *When:* Staff uploads the file to the system.
    - *Then:* The system imports zero rows and returns an error list with row numbers and reasons (D16).
  - **Scenario 3: Unauthorized user rejection**
    - *Given:* A user is logged in with role `Employee`.
    - *When:* The user invokes the expense import API.
    - *Then:* The system returns `403` and does not import data.

#### US-S05: Upload Invoices and Supporting Document Attachments
- **Code:** `US-S05` | **Priority:** `P1`
- **User Story:**
  > *As a Staff member, I want to upload invoices and supporting documents, so that expense records have corresponding evidence.*
- **Acceptance Criteria:**
  - *Given:* Staff is creating an expense record for AWS software.
  - *When:* Staff uploads a PDF electronic VAT invoice (`UC35`).
  - *Then:* The file is securely stored in the system and linked to the corresponding expense record.

#### US-S06: View and Verify All Submitted Data
- **Code:** `US-S06` | **Priority:** `P0`
- **User Story:**
  > *As a Staff member, I want to view submitted data, so that I can verify information I have entered.*
- **Acceptance Criteria:**
  - *Given:* Staff has submitted multiple usage and expense records during the day.
  - *When:* Opens the "Submitted Data" screen (`UC36`).
  - *Then:* Displays a list of records created by themselves along with submission status and timestamps.

---

### Group 3: User Stories for EMPLOYEE Role (5 Stories)

#### US-U01: View Available Software Catalog
- **Code:** `US-U01` | **Priority:** `P0`
- **User Story:**
  > *As an Employee, I want to view available software, so that I can identify software relevant to my work.*
- **Acceptance Criteria:**
  - *Given:* Employee logs into the system.
  - *When:* Opens the software catalog (`UC37`).
  - *Then:* The system displays only software name, publisher, description, and request button; **never displays pricing or license keys**.

#### US-U02: Submit New License Requests
- **Code:** `US-U02` | **Priority:** `P0`
- **User Story:**
  > *As an Employee, I want to submit a license request, so that I can request required software access.*
- **Acceptance Criteria:**
  - *Given:* Employee selects "Postman Professional" from the catalog.
  - *When:* Enters Reason = "Perform API testing for Mobile App project" and clicks Submit Request (`UC06`).
  - *Then:* The request is recorded in `Pending` status, generates a REQ ID, and is forwarded to the Manager review queue.

#### US-U03: Track Own Request Processing Status
- **Code:** `US-U03` | **Priority:** `P0`
- **User Story:**
  > *As an Employee, I want to view my request status, so that I know whether my request has been approved or rejected.*
- **Acceptance Criteria:**
  - *Given:* A license request was just approved or rejected by Manager.
  - *When:* Employee opens the "My Requests" page (`UC38`).
  - *Then:* Displays the corresponding status (`Approved`, `Fulfilled` once assigned, or `Rejected` with explanatory reason).

#### US-U04: View List of Currently Assigned Licenses
- **Code:** `US-U04` | **Priority:** `P0`
- **User Story:**
  > *As an Employee, I want to view my assigned licenses, so that I know which software I am authorized to use.*
- **Acceptance Criteria:**
  - *Given:* Employee has been assigned 2 licenses by Manager: Microsoft 365 and JetBrains.
  - *When:* Employee opens the "My Licenses" page (`UC39`, `UC11`).
  - *Then:* Displays the list of both software licenses along with assignment start dates; does not display license keys or pricing.
  - **Privacy Scenario:**
    - *Given:* Employee B is also assigned licenses.
    - *When:* Employee A opens the "My Licenses" page.
    - *Then:* The list contains only A's licenses; B's licenses never appear (BR-08).

#### US-U05: View Personal License Validity and Expiration Dates
- **Code:** `US-U05` | **Priority:** `P1`
- **User Story:**
  > *As an Employee, I want to view license expiration information, so that I know when my assigned license is due to expire.*
- **Acceptance Criteria:**
  - *Given:* Employee's SaaS license has an expiration date of 2026-12-31.
  - *When:* Employee views details of the assigned license (`UC39`).
  - *Then:* Clearly displays the expiration date of the granted license.

---

## 4. Traceability Matrix (Use Cases and User Stories)

The traceability matrix ensures **100% of Use Cases (UC01 through UC39)** are completely covered by the **25 User Stories**:

| Use Case ID | Use Case Name in SRS v1.0 | Linked User Stories | Primary Actor | Priority |
| :---: | :--- | :--- | :---: | :---: |
| **UC01** | Manage Software Catalog | **US-M01** | Manager | P0 |
| **UC02** | Manage Vendor | **US-M01, US-M02** | Manager | P1 |
| **UC03** | Manage License Entitlement (SaaS & Perpetual) | **US-M02** | Manager | P0 |
| **UC04** | Manage Contract | **US-M03** | Manager | P1 |
| **UC05** | Check License Compliance | **US-M10** | Manager | P0 |
| **UC06** | Submit License Request | **US-U02** | Employee | P0 |
| **UC07** | Review License Request | **US-M04** | Manager | P0 |
| **UC08** | Approve / Reject Request | **US-M05** | Manager | P0 |
| **UC09** | Assign License | **US-M06** | Manager | P0 |
| **UC10** | Revoke License | **US-M07** | Manager | P0 |
| **UC11** | Track License Allocation | **US-M06, US-U04** | Manager / Employee | P0 |
| **UC12** | Manage Budget | **US-M08** | Manager | P0 |
| **UC13** | Manage Expense | **US-M09, US-S03** | Manager / Staff | P0 |
| **UC14** | Monitor Budget Utilization | **US-M08, US-M09** | Manager | P0 |
| **UC15** | Track License Expiration | **US-M11** | Manager | P0 |
| **UC16** | Manage Renewal | **US-M11** | Manager | P1 |
| **UC17** | Track Maintenance | **US-M11** | Manager | P1 |
| **UC18** | Generate Lifecycle Notification | **US-M11** *(System trigger)* | System | P0 |
| **UC19** | Detect Unallocated Licenses | **US-M12** | Manager | P1 |
| **UC20** | Detect Inactive Assignments | **US-M12** | Manager | P1 |
| **UC21** | Detect License Overuse | **US-M10** | Manager | P0 |
| **UC22** | Review Optimization Recommendations | **US-M12** | Manager | P1 |
| **UC23** | View License Dashboard | **US-M13** | Manager | P0 |
| **UC24** | View Financial Dashboard | **US-M13** | Manager | P0 |
| **UC25** | View Compliance Dashboard | **US-M10, US-M13** | Manager | P1 |
| **UC26** | Export Reports | **US-M13, US-S06** | Manager / Staff | P1 |
| **UC27** | Manage Users | **US-M14** | Manager | P0 |
| **UC28** | Manage Roles | **US-M14** | Manager | P0 |
| **UC29** | Login / Logout | **US-M14, US-S01, US-U01** | All Roles | P0 |
| **UC30** | View Audit Logs | **US-M14** | Manager | P0 |
| **UC31** | Input License Usage | **US-S01** | Staff | P0 |
| **UC32** | Import License Usage (CSV/Excel) | **US-S02** | Staff | P1 |
| **UC33** | Input Expense Data | **US-S03** | Staff | P0 |
| **UC34** | Import Expense Data (CSV/Excel) | **US-S04** | Staff | P1 |
| **UC35** | Upload Supporting Documents (Invoices) | **US-S05** | Staff | P1 |
| **UC36** | View Submitted Data | **US-S06** | Staff | P0 |
| **UC37** | View Available Software | **US-U01** | Employee | P0 |
| **UC38** | View Own Request Status | **US-U03** | Employee | P0 |
| **UC39** | View Own Assigned Licenses | **US-U04, US-U05** | Employee | P0 |
