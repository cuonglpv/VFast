# Kiến trúc Thông tin & Đặc tả Thiết kế Giao diện Phân hệ Quản trị (Manager)
## Dự án: VFast – Enterprise License Management System (ELMS)
### Căn cứ: SRS v1.0, MVP Specification (01-MVP.md), Use Cases (02-use-cases.md), User Stories (03-use-stories.md)

---

## 1. Tổng quan Kiến trúc Thông tin & Mô hình Điều hướng (Information Architecture & Navigation)

Tài liệu này xác lập **Kiến trúc Thông tin (Information Architecture - IA)** và **Đặc tả Thiết kế Giao diện (View Specifications)** toàn diện dành riêng cho vai trò **Manager (Quản trị viên / Quản lý cấp cao)** đối với ba phân hệ nghiệp vụ hạt nhân:
1. **Module 1: License Management (Quản lý Quyền sở hữu Bản quyền / Entitlements)**
2. **Module 2: License Assignment Management (Quản lý Phân bổ & Gán License cho Nhân viên)**
3. **Module 3: Budget Management (Quản lý Ngân sách, Chi phí & Báo cáo Tài chính)**

### 1.1. Bản đồ Cấu trúc Cây Thông tin (Sitemap Tree for Manager)

```mermaid
flowchart TD
    Root["Manager Portal Root (/)"] --> Dash["Dashboard Tổng quan (/manager/dashboard)"]
    Root --> M1["Module 1: License Management (/manager/licenses)"]
    Root --> M2["Module 2: Assignment Management (/manager/assignments)"]
    Root --> M3["Module 3: Budget Management (/manager/budget)"]
    Root --> M4["Module 4: Optimization & Compliance (/manager/compliance)"]
    Root --> M5["Module 5: System Admin & Audit Logs (/manager/settings)"]

    %% Module 1 Sub-views
    M1 --> M1_List["1.1 License List View<br/>(Bộ lọc, KPI Cards, Bảng tra cứu)"]
    M1 --> M1_Create["1.2 Add License Drawer/Modal<br/>(SaaS Subscription & Perpetual)"]
    M1 --> M1_Detail["1.3 License Detail View (/manager/licenses/:id)"]
    M1_Detail --> M1_Tab_Gen["Tab 1: Thông tin chung & Hợp đồng"]
    M1_Detail --> M1_Tab_Alloc["Tab 2: Danh sách người đang được gán"]
    M1_Detail --> M1_Tab_History["Tab 3: Lịch sử cấp phát/thu hồi"]
    M1_Detail --> M1_Tab_Audit["Tab 4: Nhật ký thay đổi bản ghi (Audit Log)"]
    M1_Detail --> M1_Edit["1.4 Edit License Drawer/Modal"]
    M1_Detail --> M1_Delete["1.5 Delete/Decommission Modal (Safe Check)"]

    %% Module 2 Sub-views
    M2 --> M2_Hub["2.1 Assignment Hub (/manager/assignments)"]
    M2_Hub --> M2_View_Emp["View A: Theo Nhân viên (By Employee)"]
    M2_Hub --> M2_View_Soft["View B: Theo Phần mềm & Seat (By Software/Seat)"]
    M2_Hub --> M2_View_Avail["View C: Bảng Kiểm tra Seat Còn trống (Availability Monitor)"]
    M2_Hub --> M2_View_Hist["View D: Sổ Lịch sử Cấp phát Toàn hệ thống (Global History)"]
    M2_Hub --> M2_Assign["2.2 Assign License Drawer/Modal (Seat Check)"]
    M2_Hub --> M2_Revoke["2.3 Revoke License Modal (Reclaim to Pool)"]
    M2_Hub --> M2_Change["2.4 Change License Type Modal (Atomic Flow)"]
    M2_Hub --> M2_Tracking["2.5 Active User Tracking (Inactive >= 60d)"]

    %% Module 3 Sub-views
    M3 --> M3_Plan["3.1 Budget Planning (/manager/budget/planning)<br/>(Annual, Monthly, Dept, Vendor/Software)"]
    M3 --> M3_Exp["3.2 Expense Tracking (/manager/budget/expenses)<br/>(Monthly, Annual, Paid, Unpaid, Projected)"]
    M3 --> M3_Mon["3.3 Budget Monitoring (/manager/budget/monitoring)<br/>(5 Metrics, Threshold Alerts, Burn-down)"]
    M3 --> M3_Rep["3.4 Financial Reporting (/manager/budget/reports)<br/>(Monthly, Vendor, Variance, Renewal Forecast)"]
```

---

### 1.2. Sơ đồ Luồng Điều hướng Người dùng (Manager User Journey Flow)

```mermaid
sequenceDiagram
    autonumber
    actor Mgr as Manager
    participant Nav as Navigation Sidebar
    participant M1_UI as Module 1: License Views
    participant M2_UI as Module 2: Assignment Views
    participant Engine as Validation & Business Engine (BR-01..20)
    participant DB as System Database

    Note over Mgr, Nav: Quản lý Kho License (Module 1)
    Mgr->>Nav: Chọn menu "License Management"
    Nav->>M1_UI: Hiển thị License List View (/manager/licenses)
    M1_UI->>Engine: Lấy dữ liệu + Tính toán Seat khả dụng (BR-04)
    Engine->>DB: Query Entitlements + Count(Assignments)
    DB-->>M1_UI: Render danh sách + KPI Cards (Total, Active, Expiring)
    
    alt Tạo License Mới
        Mgr->>M1_UI: Nhấn "Thêm License Mới"
        M1_UI-->>Mgr: Mở Add License Drawer (SaaS / Perpetual Form)
        Mgr->>M1_UI: Nhập thông tin và Submit
        M1_UI->>Engine: Xác thực tính duy nhất + Ngày hiệu lực (BR-02, BR-12)
        Engine->>DB: INSERT into entitlements & audit_logs (BR-17)
    else Xem Chi tiết & Lịch sử
        Mgr->>M1_UI: Chọn 1 dòng License -> Xem Chi tiết
        M1_UI-->>Mgr: Điều hướng tới /manager/licenses/:id (Detail View)
        Mgr->>M1_UI: Chuyển giữa các Tabs (Active Users / History / Change Logs)
    end

    Note over Mgr, Nav: Phân bổ & Gán License (Module 2)
    Mgr->>Nav: Chọn menu "License Assignments"
    Nav->>M2_UI: Hiển thị Assignment Hub (/manager/assignments)
    
    alt Gán License cho Nhân viên
        Mgr->>M2_UI: Nhấn "Gán License Mới"
        M2_UI-->>Mgr: Mở Assign License Drawer
        Mgr->>M2_UI: Chọn Employee + Chọn Phần mềm & Gói License
        M2_UI->>Engine: Kiểm tra Available Quantity > 0 (BR-04, BR-05)
        Engine-->>M2_UI: Bật cờ sẵn sàng (Seat khả dụng còn trống)
        Mgr->>M2_UI: Nhập ngày hiệu lực + Xác nhận
        M2_UI->>Engine: Giao dịch phân bổ với Khóa dòng Row Locking
        Engine->>DB: INSERT assignment & UPDATE allocated_quantity += 1
    else Thay đổi loại License (Upgrade / Downgrade)
        Mgr->>M2_UI: Nhấn "Đổi loại License" tại tài khoản nhân viên
        M2_UI-->>Mgr: Mở Change License Type Modal
        Mgr->>M2_UI: Chọn gói đích (Check Available > 0)
        M2_UI->>Engine: Thực thi Giao dịch nguyên tử (Atomic Swap)
        Engine->>DB: Thu hồi gói cũ (+1 pool cũ) & Cấp gói mới (-1 pool mới)
    end
```

---

## 2. Ma trận Chức năng & Ràng buộc Nghiệp vụ (Manager Functional Matrix)

| Mã Tính Năng | Tên Chức Năng | Màn hình Hiện diện | Ràng buộc Nghiệp vụ & Quyền hạn |
| :--- | :--- | :--- | :--- |
| **M1-F01** | Xem danh sách License & KPI | `/manager/licenses` | Hiển thị toàn bộ license nội bộ công ty (SaaS & Perpetual). |
| **M1-F02** | Tìm kiếm & Lọc nâng cao | `/manager/licenses` | Lọc theo Vendor, Trạng thái, Loại hình, Hạn sử dụng, Phòng ban. |
| **M1-F03** | Thêm mới License (Create) | Modal / Drawer | Phân loại SaaS vs Perpetual (BR-01, BR-12). Khởi tạo $Available = Purchased$. |
| **M1-F04** | Chỉnh sửa License (Edit) | Modal / Drawer | Không cho phép hạ $Purchased < Allocated$ (BR-05). Yêu cầu nhập lý do đổi. |
| **M1-F05** | Xóa/Hủy License (Delete) | Modal Confirmation | Chặn xóa nếu $Allocated > 0$. Hỗ trợ Soft-delete / Decommission (BR-13). |
| **M1-F06** | Xem chi tiết & Đo lường Seat | `/manager/licenses/:id` | Hiển thị License Key (Masked/Reveal), Thanh tiến độ phân bổ % trực quan. |
| **M1-F07** | Theo dõi Lịch sử Thay đổi | `/manager/licenses/:id#audit` | Xem Audit Log bất biến: Ai đổi, Ngày giờ, Giá trị cũ $\to$ mới (BR-17). |
| **M2-F01** | Kiểm tra License còn trống | `/manager/assignments` | Công thức: $Available = Purchased - Allocated$ (BR-04, BR-05). Cảnh báo Đỏ/Vàng. |
| **M2-F02** | Gán License cho nhân viên | Drawer / Modal | Chỉ Manager có quyền gán (BR-07). Row-locking chống cấp vượt mức. |
| **M2-F03** | Thu hồi License về kho | Modal Confirmation | Hoàn trả +1 seat vào Available. Bắt buộc nhập lý do. Giữ lịch sử (BR-13). |
| **M2-F04** | Thay đổi loại License | Modal Dialog | Chuyển đổi gói (VD: Standard $\to$ Pro). Hoán đổi Atomic Transaction. |
| **M2-F05** | Theo dõi Người đang dùng | `/manager/assignments` | Quản lý trạng thái Active / Idle / Inactive $\ge 60$ ngày phục vụ tối ưu hóa. |
| **M2-F06** | Xem Lịch sử Cấp phát | Tab Lịch sử | Nhật ký cấp phát toàn diện (Assign, Revoke, Upgrade, Downgrade). |
| **M3-F01** | Lập Ngân sách Năm & Tháng | `/manager/budget/planning` | Chỉ Manager có quyền tạo/sửa hạn mức ngân sách (BR-09, UC12). |
| **M3-F02** | Phân bổ Ngân sách theo Dept | `/manager/budget/planning` | Ràng buộc: $\sum Budget_{dept} \le Budget_{annual}$. |
| **M3-F03** | Phân bổ Ngân sách Vendor/Soft | `/manager/budget/planning` | Gán trần ngân sách cho từng vendor hoặc sản phẩm phần mềm. |
| **M3-F04** | Theo dõi Chi phí Tháng & Năm | `/manager/budget/expenses` | Quản lý chi phí chu kỳ SaaS và chi phí mua sắm/bảo trì Perpetual. |
| **M3-F05** | Quản lý Paid / Unpaid / Projected | `/manager/budget/expenses` | Bắt buộc kiểm tra hóa đơn VAT (BR-10) và tỷ giá quy đổi tiền tệ (BR-11). |
| **M3-F06** | Giám sát 5 Chỉ số Ngân sách | `/manager/budget/monitoring`| Giám sát Total, Actual, Committed, Remaining, Utilization. Cảnh báo 80%/100%. |
| **M3-F07** | Báo cáo Đối soát Variance | `/manager/budget/reports` | Phân tích chênh lệch Ngân sách vs Thực tế (Favorable / Unfavorable). |
| **M3-F08** | Dự báo Chi phí Gia hạn | `/manager/budget/reports` | Dự phóng dòng tiền gia hạn 3/6/12 tháng tới kèm khuyến nghị tối ưu (UC22). |

---

## 3. Module 1: License Management (Đặc tả Chi tiết Màn hình)

---

### 3.1. Màn hình 1.1: License List View (`/manager/licenses`)

Màn hình trung tâm quản lý toàn bộ kho bản quyền của doanh nghiệp. Cho phép Manager nắm bắt tức thời số lượng bản quyền sở hữu, tình trạng hết hạn và phân bổ.

#### A. Cấu trúc Thành phần Giao diện (Layout Blueprint)
1. **Header Bar:**
   - Tiêu đề: `Quản lý Bản quyền (License Management)`.
   - Mô tả phụ: `Quản trị danh mục quyền sở hữu phần mềm SaaS và Perpetual tập trung`.
   - Action Buttons:
     - `[Xuất Báo cáo CSV/Excel]` (Secondary button).
     - `[+ Thêm License Mới]` (Primary CTA button - Mở Modal/Drawer M1-Create).
2. **Thẻ Thống kê Tức thời (KPI Summary Cards):**
   - **Card 1 - Tổng License Đang Hoạt động (Active Licenses):** Số lượng bản quyền có trạng thái `Active`.
   - **Card 2 - Tổng Số Seat Sở hữu (Total Purchased Seats):** Tổng dung lượng seat toàn công ty.
   - **Card 3 - Tỷ lệ Phân bổ Trung bình (Allocation Rate):** $\frac{\sum Allocated}{\sum Purchased} \times 100\%$ (Thanh tiến độ màu Xanh/Vàng).
   - **Card 4 - Cảnh báo Sắp Hết hạn (Expiring $\le 30$ Days):** Số license SaaS hoặc bảo trì Perpetual sắp đến hạn.
   - **Card 5 - Vi phạm Hạn ngạch (At Risk / Over-allocated):** Số license bị cờ vi phạm (nếu có).
3. **Thanh Công cụ Tìm kiếm & Bộ lọc Đa chiều (Filter & Search Toolbar):**
   - **Search Input:** Tìm kiếm theo Tên phần mềm, Mã Entitlement ID, License Key hoặc Tên Vendor (Tìm kiếm dạng Instant search với Debounce 300ms).
   - **Bộ lọc Dropdowns:**
     - `Nhà cung cấp (Vendor):` All, Microsoft, Google, JetBrains, Adobe, Autodesk, Atlassian, Oracle,...
     - `Mô hình License (Model):` All, SaaS Subscription, Perpetual License.
     - `Trạng thái (Status):` All, Đang hiệu lực (Active), Sắp hết hạn (Expiring Soon - 30 ngày), Đã hết hạn (Expired), Tạm đình chỉ (Suspended).
     - `Hạn sử dụng (Expiration Date Range):` Tất cả, 7 ngày tới, 30 ngày tới, 90 ngày tới, Tuỳ chọn khoảng ngày (Date Range Picker).
     - `Tình trạng Dung lượng (Seat Availability):` All, Còn trống ($Available > 0$), Đã hết chỗ ($Available = 0$), Dư thừa cao ($Available > 30\%$).
   - **Nút Thao tác Lọc:** `[Áp dụng]` và `[Đặt lại bộ lọc]`.
4. **Bảng Danh sách License (License Data Table):**

| Tên Cột | Kiểu Dữ liệu / Hiển thị | Mô tả & Tương tác |
| :--- | :--- | :--- |
| **Mã License** | Link text (`LIC-2026-001`) | Nhấn để chuyển sang trang Chi tiết (`/manager/licenses/:id`). |
| **Phần mềm & Phiên bản** | Text + Avatar Logo | Tên sản phẩm phần mềm kèm gói/phiên bản (VD: `Microsoft 365 E5`). |
| **Nhà cung cấp** | Badge / Tag | Tên Vendor (VD: `Microsoft Corp`). |
| **Loại hình** | Pill Badge | `SaaS Subscription` (Xanh tím) hoặc `Perpetual` (Cam hổ phách). |
| **Dung lượng Seat** | Thanh tiến độ nhỏ + Số | Hiển thị: `Allocated / Purchased` (VD: `42/50 seats` - 84%). Tô màu đỏ nếu đầy 100%. |
| **Seat Còn trống** | Số nguyên | $Available = Purchased - Allocated$ (Tô xanh lá nếu còn, xám nếu = 0). |
| **Thời hạn / Bảo trì** | Date + Warning Icon | Với SaaS: Ngày hết hạn thuê bao; Với Perpetual: Hạn bảo trì bảo dưỡng. Bật icon cam nếu $\le 30$ ngày. |
| **Trạng thái** | Status Badge | `Active` (Xanh lá), `Expiring Soon` (Cam), `Expired` (Đỏ), `Archived` (Xám). |
| **Hành động (Actions)** | Dropdown Menu `[...]` | - `Xem chi tiết`<br/>- `Cấp phát nhanh (+ Assign)`<br/>- `Chỉnh sửa`<br/>- `Gia hạn hợp đồng`<br/>- `Xóa / Lưu trữ` |

5. **Phân trang & Tùy biến:**
   - Dropdown chọn số bản ghi mỗi trang: `10`, `25`, `50`, `100`.
   - Pagination Controls: Previous, Page Numbers, Next. Hiển thị: `Hiển thị 1-10 của 128 bản ghi`.

---

### 3.2. Màn hình 1.2: Thêm mới License (Add License Modal / Drawer)

Cửa sổ trượt (Side Drawer) bên phải màn hình hoặc Modal lớn cho phép Manager đăng ký mới một quyền sở hữu bản quyền vào hệ thống.

```mermaid
flowchart TD
    Start([Mở Drawer Thêm License]) --> SelectModel{Chọn Mô hình Bản quyền}
    SelectModel -->|SaaS Subscription| SaaSFlow[Form Thuê bao SaaS]
    SelectModel -->|Perpetual License| PerpFlow[Form Mua đứt Perpetual]

    subgraph CommonFields["Thông tin Chung Bắt buộc"]
        F1["Phần mềm (Software Catalog Item)"]
        F2["Nhà cung cấp (Vendor)"]
        F3["Tên Gói / Phiên bản (Edition / Plan)"]
        F4["License Key / Serial Number / Entitlement ID"]
        F5["Số lượng mua (Purchased Quantity >= 1)"]
        F6["Đơn giá & Đơn vị tiền tệ (VND / USD)"]
    end

    subgraph SaaS_Specific["Đặc thù SaaS (BR-01)"]
        S1["Ngày bắt đầu thuê bao (Start Date)"]
        S2["Ngày kết thúc thuê bao (End Date - Bắt buộc)"]
        S3["Chu kỳ thanh toán (Monthly / Yearly)"]
        S4["Tự động gia hạn (Auto-renewal: Yes/No)"]
    end

    subgraph Perp_Specific["Đặc thù Perpetual (BR-12)"]
        P1["Ngày mua bản quyền (Purchase Date)"]
        P2["Thỏa thuận Bảo trì (Maintenance Agreement: Yes/No)"]
        P3["Ngày hết hạn Bảo trì (Maintenance Expiry Date)"]
        P4["Hạn bản quyền: Vô thời hạn (Perpetual - Không gán End Date)"]
    end

    SaaSFlow --> CommonFields --> SaaS_Specific
    PerpFlow --> CommonFields --> Perp_Specific
    SaaS_Specific --> Submit[Lưu License & Khởi tạo Available Quantity = Purchased Quantity]
    Perp_Specific --> Submit
```

#### A. Các Trường Dữ liệu & Quy tắc Xác thực (Validation Rules)
1. **Khối 1: Phân loại & Định danh**
   - `Mô hình License (Radio buttons):` `SaaS Subscription` (Mặc định) | `Perpetual License`.
   - `Sản phẩm phần mềm (Software Dropdown):` Chọn từ Software Catalog đã kích hoạt (hỗ trợ Quick-add nếu phần mềm chưa có).
   - `Nhà cung cấp (Vendor):` Tự động điền theo Catalog hoặc chọn từ danh sách Vendor.
   - `Tên gói / Phiên bản (Plan / Edition):` Text field (VD: `Enterprise`, `Professional`, `Standard`).
   - `Mã bản quyền (License Key / Code):` Input mã kích hoạt hoặc chuỗi Serial. Hỗ trợ nút `[Tự sinh mã ngẫu nhiên]` nếu quản trị theo User Account không có key.
2. **Khối 2: Định lượng & Số chỗ ngồi (Seats)**
   - `Metric tính toán:` Dropdown: `Per User (Seat)` (Mặc định), `Per Core`, `Concurrent User`, `Per Device`.
   - `Số lượng mua (Purchased Quantity):` Số nguyên $> 0$. (Bắt buộc).
   - `Hạn mức chi phí (Unit Cost):` Số thực $\ge 0$.
   - `Tiền tệ:` Dropdown `VND` hoặc `USD` (Tuân thủ BR-10, BR-11).
3. **Khối 3: Thời hạn hiệu lực**
   - **Đối với SaaS Subscription:**
     - `Ngày bắt đầu (Start Date):` Datepicker (Bắt buộc).
     - `Ngày hết hạn (Expiration Date):` Datepicker (Bắt buộc). Ràng buộc: $ExpirationDate \ge StartDate$.
     - `Chu kỳ thanh toán:` Dropdown: `Hàng tháng`, `Hàng năm`, `Đa năm (Multi-year)`.
     - `Tự động gia hạn (Auto-renewal):` Toggle `Bật / Tắt`.
   - **Đối với Perpetual License:**
     - `Ngày mua bản quyền (Purchase Date):` Datepicker (Bắt buộc).
     - `Thời hạn bản quyền gốc:` Hiển thị cố định nhãn `Vĩnh viễn (Perpetual - No Expiry)` (Tuân thủ BR-12).
     - `Có gói bảo trì / nâng cấp không? (Maintenance Agreement):` Checkbox.
     - `Ngày hết hạn bảo trì (Maintenance Expiration Date):` Bắt buộc nếu chọn có gói bảo trì.
4. **Khối 4: Quản lý Chứng từ & Hợp đồng**
   - `Số hợp đồng / Mã PO:` Text field (Liên kết với Contract Management).
   - `Tài liệu đính kèm:` Upload hóa đơn VAT / Hợp đồng quét (PDF, PNG $\le 10$MB).
   - `Ghi chú quản trị:` TextArea (Mục đích mua sắm, dự án cấp ngân sách).
5. **Nút Thao tác Form:**
   - `[Hủy bỏ]` (Đóng Drawer, cảnh báo nếu form đã điền dở).
   - `[Lưu License & Khởi tạo Kho]` (Primary button):
     - Hệ thống khởi tạo: $Allocated = 0$, $Available = Purchased$.
     - Ghi Audit Log hành động `CREATE_LICENSE_ENTITLEMENT` (Actor: Manager, Timestamp).

---

### 3.3. Màn hình 1.3: Chỉnh sửa License (Edit License Modal / Drawer)

Cho phép Manager cập nhật các thông số của License sau khi đã vận hành.

#### A. Phân định Trường Được sửa vs Trường Bất biến (Mutable vs. Immutable Fields)
- **Trường Bất biến (Khóa chết để bảo vệ toàn vẹn dữ liệu):**
  - `Mô hình License (SaaS vs Perpetual):` Không được chuyển đổi loại hình sau khi đã tạo.
  - `Metric tính toán:` Không được sửa đổi (BR-03).
  - `Mã định danh hệ thống (License ID):` Bất biến.
- **Trường Có điều kiện bảo vệ đặc biệt (Conditional Guarded Fields):**
  - `Số lượng mua (Purchased Quantity):`
    - Được phép tăng dung lượng (VD: Mua bổ sung thêm 10 seats).
    - **Ràng buộc hạ dung lượng:** Chỉ được phép giảm $Purchased$ nếu $Purchased_{mới} \ge Allocated_{hiện tại}$. Tuyệt đối cấm hạ số lượng mua xuống thấp hơn số lượng seat đã cấp cho nhân viên (Tuân thủ BR-05). Nếu Manager muốn giảm sâu hơn, hệ thống hiển thị thông báo lỗi: *"Vui lòng thu hồi bớt seat trước khi giảm số lượng license đã mua."*
  - `Ngày hết hạn (Expiration Date):` Cho phép cập nhật khi gia hạn thêm thời gian.
- **Trường Tự do chỉnh sửa:** Tên gói, Ghi chú, Tài liệu hợp đồng đính kèm, Cờ tự động gia hạn.
- **Yêu cầu Bắt buộc khi Lưu Chỉnh sửa:**
  - Bắt buộc điền vào trường: `Lý do thay đổi (Change Reason)` (VD: *"Gia hạn hợp đồng thêm 1 năm theo PO-2026-88"*, *"Mua thêm 15 seats phục vụ tuyển dụng Q3"*).
  - Lưu vào bảng `license_audit_logs` với `diff` chi tiết (Giá trị cũ vs Giá trị mới).

---

### 3.4. Màn hình 1.4: Xóa / Lưu trữ License (Delete / Decommission Modal)

Nhằm đảm bảo dữ liệu không bị thất thoát và không phá vỡ liên kết của nhân viên đang dùng.

#### A. Luồng Thẩm định Điều kiện Chặn (Safety Pre-condition Check)
```mermaid
flowchart TD
    ClickDel[Manager nhấn 'Xóa License'] --> CheckSeats{Kiểm tra số Seat đã cấp:<br/>Allocated Quantity > 0?}
    CheckSeats -->|CÓ (Allocated > 0)| Block["CHẶN XÓA (Error Modal)<br/>'Không thể xóa license đang có người sử dụng'"]
    Block --> Guide["Hướng dẫn: Chuyển sang màn hình Assignment<br/>để Thu hồi toàn bộ seat trước."]
    
    CheckSeats -->|KHÔNG (Allocated = 0)| CheckHistory{Kiểm tra Lịch sử:<br/>Đã từng có Assignment cũ?}
    CheckHistory -->|CÓ từng cấp phát| SoftDelete["Khuyến nghị: Chuyển sang trạng thái 'Archived'<br/>(Lưu trữ bảo toàn lịch sử theo BR-13, BR-20)"]
    CheckHistory -->|KHÔNG (Bản ghi mới tạo nhầm)| HardDelete["Cho phép Xóa hoàn toàn (Hard Delete)"]
    
    SoftDelete --> ConfirmStep[Hộp thoại Xác nhận 2 Bước]
    HardDelete --> ConfirmStep
    ConfirmStep --> TypeCode[Yêu cầu gõ lại Mã License để xác nhận]
    TypeCode --> Done[Ghi Audit Log & Hoàn tất]
```

---

### 3.5. Màn hình 1.5: Chi tiết License (License Detail View - `/manager/licenses/:id`)

Màn hình chi tiết toàn diện của một gói bản quyền. Đây là trung tâm điều phối và theo dõi mọi hoạt động liên quan đến license đó.

```
+----------------------------------------------------------------------------------------------------+
| <-- Quay lại danh sách License            Mã License: LIC-M365-E5-001             [Active] Badge   |
| Microsoft 365 Enterprise E5 (SaaS Subscription) - Vendor: Microsoft Corporation                   |
+----------------------------------------------------------------------------------------------------+
| [KPI 1: Dung lượng]          [KPI 2: Tỷ lệ sử dụng]       [KPI 3: Thời hạn]      [KPI 4: Chi phí]   |
| 45 / 50 Seats Allocated       90% Utilized (High)          Còn 48 Ngày            $1,750 / tháng   |
| [====================----]   (5 seats Available)          Hết hạn: 2026-12-31    Budget: IT Dept   |
|                                                                                                    |
| Thao tác nhanh: [ + Cấp phát Seat mới ]   [ Gia hạn Hợp đồng ]   [ Chỉnh sửa ]   [ ... Khác ]      |
+----------------------------------------------------------------------------------------------------+
| [ Tab 1: Thông tin Chung ] [ Tab 2: Danh sách Phân bổ (45) ] [ Tab 3: Lịch sử Cấp phát ] [ Tab 4: Audit Logs ] |
+----------------------------------------------------------------------------------------------------+
| Nội dung chi tiết tương ứng với từng Tab được kích hoạt...                                         |
+----------------------------------------------------------------------------------------------------+
```

#### A. Thanh Đo Tỷ lệ Lấp đầy Seat (Seat Utilization Gauge)
- Hiển thị trực quan thanh Progress bar phân giải:
  - Màu Xanh dương: Số seat đã cấp cho nhân viên đang hoạt động ($Allocated_{active}$).
  - Màu Vàng: Số seat cấp cho nhân viên đang không dùng / Inactive ($Allocated_{idle}$).
  - Màu Xanh lá: Số seat còn trống sẵn sàng cấp ($Available = Purchased - Allocated$).
- Công thức kiểm soát tính toán (BR-04): $Purchased = Allocated + Available$.

#### B. Cấu trúc 4 Tabs Nghiệp vụ Chuyên sâu

##### 1. Tab 1: Thông tin Chung & Hợp đồng (General & Contract Info)
- **Thông số kỹ thuật:** License Key (chuỗi ẩn dạng `XXXX-XXXX-****-9872` kèm icon con mắt để Manager bấm mở xem khi cần, có ghi log `VIEW_LICENSE_KEY`), Gói dịch vụ, Metric, Server/Host (nếu là on-premise).
- **Hồ sơ tài chính:** Đơn giá mỗi seat, Tổng giá trị hàng năm, Hợp đồng liên kết (`CON-2026-042`), Hóa đơn đính kèm tải về xem trực tiếp.
- **Cấu hình vòng đời:** Ngày kích hoạt, Ngày hết hạn, Trạng thái tự động gia hạn, Người tạo bản ghi, Ngày tạo.

##### 2. Tab 2: Danh sách Phân bổ Đang kích hoạt (Active Assignments Tab)
- Danh sách bảng gồm 45 nhân viên đang nắm giữ seat của license này:
  - Cột 1: Tên nhân viên & Avatar, Email công ty.
  - Cột 2: Phòng ban & Chức danh.
  - Cột 3: Ngày bắt đầu được cấp phát (`Assigned Date`).
  - Cột 4: Mức độ hoạt động thực tế (`Usage Status`): `Active` (Dùng hôm qua), `Idle` (15 ngày chưa mở), `Inactive` (65 ngày không mở - Có cờ cảnh báo đỏ).
  - Cột 5: Hành động nhanh trực tiếp trên dòng:
    - Nút `[Đổi loại]`: Nâng cấp hoặc hạ cấp gói license của nhân viên này.
    - Nút `[Thu hồi (Revoke)]`: Mở popup thu hồi seat về kho ngay lập tức.

##### 3. Tab 3: Lịch sử Cấp phát & Thu hồi của License này (Allocation History Tab)
- Bảng nhật ký toàn bộ sự kiện diễn ra đối với các seat của gói license này (Tuân thủ BR-13):
  - Thời điểm, Loại hành động (`ASSIGN`, `REVOKE`, `UPGRADE`, `DOWNGRADE`), Nhân viên thụ hưởng/bị thu hồi, Manager thực hiện, Lý do nghiệp vụ ghi nhận.

##### 4. Tab 4: Lịch sử Thay đổi Bản quyền (License Change Audit Trail)
- Theo dõi lịch sử cấu hình của chính gói License này (Tuân thủ BR-17):
  - Biến động số lượng mua (VD: từ 40 $\to$ 50 seats vào ngày 15/03/2026).
  - Biến động ngày hết hạn (Gia hạn thêm 12 tháng).
  - Biến động trạng thái (`Draft` $\to$ `Active`, v.v.).
  - Ghi nhận chi tiết: Ai sửa, Giờ sửa, Địa chỉ IP, Giá trị trước và sau.

---

### 3.6. Quản lý Cấp phát & Thu hồi Trực tiếp trong Ngữ cảnh License (Contextual Allocation)

Ngay tại trang chi tiết của License, Manager có thể thực thi 2 hành động tác động trực tiếp vào kho seat:
1. **Quick Assign Seat:** Bấm `[+ Cấp phát Seat mới]` $\to$ Mở Popup gán nhanh đã điền sẵn License hiện tại, Manager chỉ cần gõ tên nhân viên và xác nhận.
2. **Quick Bulk Revoke:** Cho phép chọn checkbox nhiều nhân viên có trạng thái `Inactive $\ge 60$ ngày` trong Tab 2 và nhấn `[Thu hồi các seat đã chọn]` để giải phóng đồng loạt dung lượng về kho khả dụng.

---

## 4. Module 2: License Assignment Management (Đặc tả Chi tiết Màn hình)

---

### 4.1. Màn hình 2.1: Bảng Điều hướng Phân bổ Toàn hệ thống (Assignment Hub - `/manager/assignments`)

Đây là trung tâm điều hành chuyên trách việc phân phối license tới từng con người trong tổ chức.

#### A. Cấu trúc Thành phần Giao diện
1. **Header & Thống kê Phân bổ Tổng thể (Macro Metrics):**
   - **Tổng Seats Đang Cấp Phát (Total Assigned Seats):** $\sum Allocated$ toàn doanh nghiệp.
   - **Tổng Seats Còn Trống Trong Kho (Available Pool):** $\sum Available$ sẵn sàng sử dụng.
   - **Số Nhân Viên Đang Nắm Giữ License (Active Assignees):** Số cá nhân duy nhất.
   - **Cảnh báo Lãng phí (Under-utilized / Inactive Seats):** Số seat cấp phát nhưng nhân viên không dùng $\ge 60$ ngày.
2. **Nút Thao tác Chính (Action Toolbar):**
   - Nút `[+ Gán License Mới]` (Mở Drawer cấp phát chuẩn).
   - Nút `[Thu hồi Hàng loạt (Batch Revoke)]`.
   - Nút `[Xuất Danh sách Phân bổ (Export CSV)]`.
3. **Bộ chuyển đổi 4 Chế độ Xem (4 Perspective Sub-views):**
   - `[Chế độ Xem A: Theo Nhân viên (By Employee)]` (Mặc định).
   - `[Chế độ Xem B: Theo Phần mềm & Seat (By Software & Seat)]`.
   - `[Chế độ Xem C: Bảng Kiểm tra Seat Còn trống (Real-time Availability Checker)]`.
   - `[Chế độ Xem D: Sổ Lịch sử Cấp phát Toàn hệ thống (Global History)]`.

---

### 4.2. Chế độ Xem A: Theo Nhân viên (By Employee Perspective)

Góc nhìn tập trung vào từng cá nhân trong tổ chức.

```
+----------------------------------------------------------------------------------------------------+
| Tìm kiếm: [ Nhập tên, email, phòng ban...           ]   Phòng ban: [ Tất cả v ]   Trạng thái: [ Tất cả v ] |
+----------------------------------------------------------------------------------------------------+
| Nhân viên                   Phòng ban         Tổng License      Danh sách License đang giữ    Thao tác |
+----------------------------------------------------------------------------------------------------+
| [Avatar] Nguyễn Văn A       Kỹ thuật (Tech)   3 Licenses        [M365 E5] [JetBrains] [Figma]  [ + Gán ] |
| a.nguyen@vfast.com          Senior Dev                          (Nhấn để xem chi tiết / sửa)  [ Revoke ] |
+----------------------------------------------------------------------------------------------------+
| [Avatar] Trần Thị B         Thiết kế (Design) 2 Licenses        [Adobe CC] [Figma Pro]        [ + Gán ] |
| b.tran@vfast.com            UI/UX Lead                          (Nhấn để xem chi tiết / sửa)  [ Revoke ] |
+----------------------------------------------------------------------------------------------------+
```

- Khi click mở rộng dòng của một nhân viên (Expand row):
  - Hiển thị danh sách chi tiết các license nhân viên đó đang dùng.
  - Từng dòng license đi kèm nút:
    - `[Đổi loại license]`: Nâng cấp / Hạ cấp gói.
    - `[Thu hồi]`: Thu hồi seat cụ thể này về kho.
    - Thông tin ngày cấp phát và mức dùng gần nhất.

---

### 4.3. Nghiệp vụ Gán License cho Nhân viên (Assign License Flow & Drawer)

Màn hình Side Drawer mở ra khi Manager bấm `[+ Gán License Mới]` hoặc bấm duyệt từ License Request (UC09).

```mermaid
flowchart TD
    Step1["BƯỚC 1: Chọn Nhân viên Thụ hưởng<br/>(Tìm kiếm theo Tên, Email, Dept)"]
    Step1 --> CheckDuplicate{Nhân viên đã có<br/>License này chưa?}
    CheckDuplicate -->|Đã có gói tương đương| DupWarn["Cảnh báo: Nhân viên đã sở hữu license này!<br/>(Gợi ý: Dùng tính năng Đổi loại/Upgrade)"]
    CheckDuplicate -->|Chưa có| Step2["BƯỚC 2: Chọn Phần mềm & Gói License"]

    Step2 --> RealtimeCheck{"Kiểm tra Dung lượng Khả dụng:<br/>Available = Purchased - Allocated > 0 ?"}
    RealtimeCheck -->|Available = 0 (HẾT SEAT)| SeatBlock["CHẶN CẤP PHÁT (Button Disabled)<br/>'Kho license này đã hết chỗ (0 seats available)'<br/>Gợi ý: Mua bổ sung hoặc Thu hồi từ người không dùng."]
    RealtimeCheck -->|Available > 0 (CÒN SEAT)| Step3["BƯỚC 3: Thiết lập Thông số & Điều kiện Gán"]

    Step3 --> Params["- Ngày bắt đầu hiệu lực (Mặc định: Hôm nay)<br/>- Thời hạn cấp (Vô thời hạn HOẶC Dự án tạm thời 3/6 tháng)<br/>- Lý do cấp phát nghiệp vụ<br/>- Liên kết License Request ID (nếu có)"]
    Params --> LockTx["Thực thi Giao dịch Database với Khóa dòng (Row Locking)"]
    LockTx --> Success["Thành công:<br/>1. Tạo bản ghi license_assignments (Active)<br/>2. Tăng allocated_quantity += 1<br/>3. Giảm available_quantity -= 1<br/>4. Ghi Audit Log (ASSIGN_LICENSE)<br/>5. Bắn thông báo cho Employee"]
```

#### A. Các Trường Form Thiết kế trong Drawer
1. **Mục 1: Thông tin Nhân viên (Assignee Selector):**
   - Dropdown hỗ trợ Type-ahead Search (Tìm theo Tên, Email công ty, Mã nhân sự).
   - Card hiển thị tóm tắt: Tên, Chức danh, Phòng ban, Trình trạng hợp đồng lao động (`Chính thức` / `Thử việc`).
   - Danh sách các phần mềm nhân viên này đang sở hữu (Tránh gán thừa/gán trùng).
2. **Mục 2: Chọn License & Kiểm tra Dung lượng Khả dụng (Real-time Seat Validation):**
   - Chọn Sản phẩm phần mềm (Software Catalog).
   - Chọn Gói bản quyền (Entitlement Pool):
     - Hiển thị trực quan: `[Microsoft 365 E5 - PO-2026-01] | Còn 5 / 50 seats khả dụng` (Tag xanh lá).
     - Nếu gói đã hết seat: `[Adobe CC All Apps - PO-2025-99] | Hết chỗ (0/20 seats)` $\to$ Hiển thị màu xám, cấm chọn kèm tooltip giải thích.
3. **Mục 3: Tham số Phân bổ (Assignment Parameters):**
   - `Ngày hiệu lực (Effective Date):` Mặc định ngày hiện tại, cho phép chọn ngày trong tương lai.
   - `Thời hạn phân bổ (Assignment Duration):`
     - Radio: `Theo thời hạn tối đa của License` (Mặc định).
     - Radio: `Phân bổ tạm thời theo dự án` $\to$ Bật Datepicker chọn ngày hết hạn phân bổ (VD: Cấp 3 tháng cho dự án Pilot).
   - `Lý do cấp phát (Purpose / Justification):` Textarea bắt buộc (VD: *"Phục vụ dự án ERP mới cho phòng Kỹ thuật"*).
   - `Mã yêu cầu liên kết (Request ID):` Tự động điền nếu đi từ luồng duyệt yêu cầu của nhân viên.
4. **Nút Thao tác:**
   - `[Hủy bỏ]`.
   - `[Xác nhận Cấp phát]` (Chỉ kích hoạt khi đã thỏa mãn mọi điều kiện kiểm tra).

---

### 4.4. Nghiệp vụ Thu hồi License về Kho (Revoke License Flow & Modal)

Đặc tả hộp thoại xác nhận thu hồi bản quyền (UC10), bảo đảm tính minh bạch và bảo toàn lịch sử kiểm toán.

#### A. Cấu trúc Modal Thu hồi (Revoke Modal Layout)
1. **Tiêu đề:** `Thu hồi Bản quyền Phần mềm (Revoke License Seat)`.
2. **Khối Thông tin Tóm tắt Đối tượng Bị Thu hồi:**
   - Nhân viên: `Nguyễn Văn A (a.nguyen@vfast.com) - Phòng Kỹ thuật`.
   - Phần mềm & Gói: `JetBrains All Products Pack (Per-User Seat)`.
   - Ngày cấp phát: `10/01/2026` (Đã sử dụng: 58 ngày).
   - Mức độ hoạt động gần nhất: `Inactive (Không mở phần mềm 42 ngày qua)`.
3. **Khối Lý do Thu hồi (Bắt buộc chọn & ghi chú):**
   - Dropdown lý do chuẩn hóa:
     - `1. Nhân viên chuyển phòng ban / Thay đổi vị trí công việc`.
     - `2. Nhân viên thôi việc / Chấm dứt hợp đồng lao động`.
     - `3. Tối ưu hóa chi phí: License không hoạt động >= 60 ngày (Theo UC20)`.
     - `4. Dự án kết thúc / Hết thời gian phân bổ tạm thời`.
     - `5. Nhân viên chủ động hoàn trả (Không còn nhu cầu)`.
     - `6. Thu hồi để tái phân bổ cho trường hợp ưu tiên hơn`.
     - `7. Khác (Yêu cầu giải trình chi tiết)`.
   - Ô nhập text: `Ghi chú chi tiết lý do thu hồi` (Bắt buộc tối thiểu 10 ký tự).
4. **Tùy chọn Thông báo (Notification Option):**
   - Checkbox: `[x] Tự động gửi email thông báo cho nhân viên về việc thu hồi này kèm lý do`.
5. **Cơ chế Xử lý Hệ thống (System Effects - BR-04, BR-13, BR-17):**
   - Bản ghi Assignment chuyển trạng thái: `Active` $\to$ `Revoked`. Lưu dấu thời gian `revoked_at` và người thu hồi `revoked_by = Manager_ID`.
   - Bản ghi cũ **KHÔNG bị xóa khỏi cơ sở dữ liệu** (Lưu vết vĩnh viễn phục vụ kiểm toán - BR-13).
   - Hoàn trả tức thì vào kho seat:
     $$\text{Allocated Quantity} = \text{Allocated Quantity} - 1$$
     $$\text{Available Quantity} = \text{Available Quantity} + 1$$
   - Ghi bản ghi Audit Log: `REVOKE_LICENSE_ASSIGNMENT`.

---

### 4.5. Nghiệp vụ Thay đổi Loại License (Change License Type / Upgrade / Downgrade)

Nghiệp vụ cho phép chuyển đổi hạng mức bản quyền của nhân viên một cách liền mạch mà không làm mất lịch sử hoặc gây sai lệch dung lượng kho.

```mermaid
sequenceDiagram
    autonumber
    actor Mgr as Manager
    participant UI as Change License Modal
    participant Engine as Business Rules Engine
    participant DB as PostgreSQL Database

    Mgr->>UI: Nhấn "Đổi loại License" tại nhân viên (VD: Figma Viewer -> Figma Pro)
    UI-->>Mgr: Hiển thị gói hiện tại + Dropdown chọn gói mới
    Mgr->>UI: Chọn gói đích (Figma Pro) + Nhập lý do chuyển đổi
    
    UI->>Engine: Thẩm định tính khả dụng của Gói mới (Target Entitlement)
    Engine->>DB: Check Target Available Quantity > 0
    alt Trường hợp Gói mới hết chỗ (Available = 0)
        DB-->>Engine: Available = 0
        Engine-->>UI: Báo lỗi "Gói đích đã hết seat khả dụng, không thể chuyển đổi!"
    else Trường hợp Gói mới còn chỗ khả dụng (Available > 0)
        DB-->>Engine: Available > 0
        Engine-->>UI: Xác nhận hợp lệ -> Kích hoạt nút thực hiện
        Mgr->>UI: Bấm "Xác nhận Chuyển đổi"
        
        UI->>Engine: Bắt đầu Giao dịch Nguyên tử (Atomic Transaction)
        Engine->>DB: 1. Đóng Assignment cũ (Status='Revoked_Upgraded', revoked_at=NOW)
        Engine->>DB: 2. Hoàn trả seat cũ (Old Entitlement: allocated -= 1)
        Engine->>DB: 3. Tạo Assignment mới (Status='Active', assigned_at=NOW)
        Engine->>DB: 4. Giảm seat mới (New Entitlement: allocated += 1)
        Engine->>DB: 5. Ghi Audit Log kép (UPGRADE_LICENSE_ASSIGNMENT)
        Engine->>DB: Commit Transaction
        DB-->>UI: Chuyển đổi thành công!
        UI-->>Mgr: Hiển thị Toast thông báo thành công
    end
```

#### A. Các Trường Giao diện trong Modal Đổi loại License
- **Khung Bên trái (Hiện tại - Current License):**
  - Gói đang dùng: `Microsoft 365 Business Standard`.
  - Seat ID: `ASSIGN-8821`.
  - Chi phí hiện tại: `$12.50 / tháng`.
- **Icon Chuyển đổi:** Mũi tên chuyển tiếp $\to$
- **Khung Bên phải (Đích đến - Target License):**
  - Dropdown: Chọn gói phần mềm đích tương thích.
  - Hiển thị tình trạng kho đích: `Microsoft 365 Enterprise E5 | Còn 8 seats trống` (Xanh lá).
  - Chi phí mới: `$38.00 / tháng` (Hiển thị phần chênh lệch chi phí: `+$25.50/tháng`).
- **Phân loại Nghiệp vụ:** Hệ thống tự động gán nhãn:
  - `Nâng cấp (Upgrade)` nếu gói mới có tính năng hoặc giá trị cao hơn.
  - `Hạ cấp (Downgrade)` nếu gói mới thấp hơn để tối ưu chi phí.
- **Trường Bắt buộc:** `Lý do thay đổi gói bản quyền`.
- **Nút Thao tác:** `[Hủy bỏ]` và `[Xác nhận Chuyển đổi Ngay]`.

---

### 4.6. Theo dõi Người đang Sử dụng & Phát hiện Không hoạt động (Active User Tracking & Optimization)

Màn hình hỗ trợ Manager theo dõi trực quan mức độ hoạt động của từng nhân viên được cấp bản quyền (Căn cứ UC20, UC21, US-M10).

#### A. Phân loại 4 Cấp độ Trạng thái Hoạt động (Activity Spectrum)
Hệ thống đối chiếu dữ liệu tiêu thụ thực tế (do Editor nạp hoặc tích hợp) để gắn nhãn màu:
1. **Cấp 1 - Đang Sử dụng Tích cực (Active - Xanh lá):**
   - Đăng nhập hoặc phát sinh thao tác trong vòng **7 ngày gần nhất**.
   - Không có nguy cơ lãng phí.
2. **Cấp 2 - Sử dụng Vừa phải (Moderate - Xanh dương):**
   - Phát sinh hoạt động từ **8 đến 30 ngày qua**.
3. **Cấp 3 - Cảnh báo Ngừng trệ (Idle / At Risk - Vàng cam):**
   - Không có hoạt động từ **31 đến 59 ngày qua**.
   - Hệ thống đánh dấu cờ cảnh báo sớm.
4. **Cấp 4 - Không Hoạt động Lãng phí (Inactive / Wasteful - Đỏ đậm):**
   - Hoàn toàn không phát sinh hoạt động $\ge \mathbf{60}$ **ngày liên tục**.
   - Tự động đưa vào danh sách đề xuất: **"Ứng cử viên Thu hồi Seat để Tối ưu Chi phí"** (Căn cứ UC20).
   - Nút thao tác nhanh nổi bật: `[Thu hồi ngay (Reclaim)]`.

#### B. Bộ lọc & Danh sách Tra cứu Trạng thái
- Lọc theo: Tất cả, Chỉ hiện Inactive $\ge 60$ ngày, Theo phần mềm, Theo phòng ban.
- Hiển thị: Tên nhân viên, Phần mềm, Ngày gán, Lần hoạt động cuối (`Last Active Timestamp`), Tổng số ngày không dùng, Chi phí lãng phí ước tính hàng tháng.

---

### 4.7. Kiểm tra Số lượng License Còn trống (Real-time Seat Availability Monitor)

Góc nhìn chuyên biệt giúp Manager kiểm soát tức thời dung lượng kho bản quyền toàn doanh nghiệp, phòng ngừa nguy cơ hết seat hoặc cấp phát quá tải.

#### A. Thước đo Cảnh báo Dung lượng (3-Level Capacity Alert Gauge)
- **Cảnh báo Đỏ (Hết Seat / Nguy cơ Vi phạm):**
  - Điều kiện: $\text{Available Quantity} = 0$ HOẶC $\text{Allocated} > \text{Purchased}$ (Overuse - BR-05).
  - Trạng thái: `Hết chỗ (0 Seats Available)`.
  - Khuyến nghị: Cần mua bổ sung hạn ngạch hoặc thu hồi seat từ nhân viên Inactive.
- **Cảnh báo Vàng (Sắp Hết Seat):**
  - Điều kiện: $\text{Available Quantity} \le 10\%$ tổng số mua.
  - Trạng thái: `Sắp hết (Low Capacity)`.
  - Khuyến nghị: Chuẩn bị đề xuất ngân sách mua thêm.
- **Cảnh báo Xanh Lục (Dung lượng Ổn định):**
  - Điều kiện: $10\% < \text{Available Quantity} \le 30\%$.
  - Trạng thái: `Tối ưu (Optimal)`.
- **Cảnh báo Xanh Lam (Dư thừa Dung lượng Cao):**
  - Điều kiện: $\text{Available Quantity} > 30\%$.
  - Trạng thái: `Dư thừa Lãng phí (Under-allocated)`. Căn cứ UC19 để xem xét cắt giảm khi gia hạn hợp đồng.

#### B. Bảng Đối soát Dung lượng Toàn bộ Phần mềm (Seat Inventory Grid)

| Tên Phần mềm | Gói / Edition | Tổng Mua | Đã Cấp | Còn Trống | Tỷ lệ Lấp đầy | Trạng thái Cảnh báo | Đề xuất Hành động |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **Microsoft 365** | Enterprise E5 | 100 | 98 | **2** | 98% | 🟡 Sắp hết seat | Chuẩn bị mua thêm |
| **JetBrains All Pack**| Commercial | 50 | 50 | **0** | 100% | 🔴 Hết chỗ (Full) | Thu hồi người Inactive / Mua thêm |
| **Figma** | Enterprise | 40 | 22 | **18** | 55% | 🔵 Dư thừa (Underused) | Tối ưu hóa khi gia hạn |
| **AutoCAD 2026** | Perpetual (Maint) | 15 | 11 | **4** | 73% | 🟢 Tối ưu | Ổn định |

---

### 4.8. Xem Lịch sử Cấp phát Toàn hệ thống (Global Assignment History View)

Màn hình sổ nhật ký kiểm toán độc lập ghi nhận toàn bộ hoạt động cấp phát và thu hồi license trong doanh nghiệp (Tuân thủ BR-13, BR-17).

#### A. Bộ Lọc Đa Chiều
- Tìm kiếm theo: Tên nhân viên, Email, Người thực hiện (Manager ID).
- Lọc theo Hành động: `Tất cả`, `ASSIGN (Cấp mới)`, `REVOKE (Thu hồi)`, `UPGRADE (Nâng cấp)`, `DOWNGRADE (Hạ cấp)`.
- Khoảng thời gian: Hôm nay, 7 ngày qua, Tháng này, Quý này, Tùy chọn khoảng ngày.

#### B. Cấu trúc Bảng Lịch sử Cấp phát

| Dấu Thời Gian | Hành Động | Nhân Viên Thụ Hưởng | Phần Mềm & Gói Bản Quyền | Người Thực Hiện | Lý Do Nghiệp Vụ | Mã Giao Dịch |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `09/11/2026 14:30` | `ASSIGN` | Nguyễn Văn A (`TECH-01`) | Microsoft 365 E5 | Manager Dat Nguyen | Cấp mới theo Request REQ-201 | `TX-89012` |
| `08/11/2026 10:15` | `REVOKE` | Lê Thị C (`SALE-04`) | Zoom Pro | Manager Dat Nguyen | Nhân sự thôi việc | `TX-89004` |
| `05/11/2026 16:45` | `UPGRADE` | Trần Văn B (`ENG-12`) | JetBrains Pro $\to$ All Pack | Manager Dat Nguyen | Chuyển sang dự án đa ngôn ngữ | `TX-88941` |

---

## 5. Module 3: Budget Management (Quản lý Ngân sách, Chi phí & Báo cáo Tài chính)

Module 3 cung cấp cho Manager công cụ quản trị tài chính toàn diện xoay quanh tài sản phần mềm, chia thành **4 nhóm nghiệp vụ chiến lược**:
- **A. Budget Planning (Thiết lập & Phân bổ Ngân sách)**
- **B. Expense Tracking (Theo dõi & Đối soát Chi phí)**
- **C. Budget Monitoring (Giám sát Ngân sách & Cảnh báo Ngưỡng)**
- **D. Financial Reporting (Báo cáo Tài chính & Dự báo Dòng tiền)**

```mermaid
flowchart LR
    subgraph M3_Flow["CHU TRÌNH TÀI CHÍNH BẢN QUYỀN (FINANCIAL CYCLE)"]
        direction TB
        A["A. Budget Planning<br/>(Thiết lập Ngân sách Năm, Tháng, Dept, Vendor)"]
        B["B. Expense Tracking<br/>(Ghi nhận Chi phí Tháng, Năm, Paid, Unpaid, Projected)"]
        C["C. Budget Monitoring<br/>(Giám sát 5 Metrics & Cảnh báo Ngưỡng 80% / 100%)"]
        D["D. Financial Reporting<br/>(Báo cáo Chi phí Tháng, Vendor, Variance, Dự báo Gia hạn)"]

        A -->|Thiết lập hạn mức| C
        B -->|Nạp dữ liệu chi tiêu| C
        C -->|Dữ liệu giải ngân| D
        D -->|Căn cứ tối ưu hóa| A
    end
```

---

### 5.1. Nhóm Nghiệp vụ A: Budget Planning (Thiết lập Ngân sách)

Cho phép Manager xác lập và phân bổ các hạn ngạch tài chính trước mỗi năm tài chính hoặc kỳ ngân sách (Tuân thủ **UC12, US-M08, BR-09**).

#### 1. Thiết lập Tổng Ngân sách Hàng năm (Annual Total Budget)
- **Màn hình/Modal thiết lập:** `/manager/budget/planning?action=new-annual`
- **Các trường tham số:**
  - `Năm tài chính (Fiscal Year):` Dropdown chọn năm (VD: `FY2026`, `FY2027`).
  - `Đơn vị tiền tệ cơ sở (Base Currency):` `VND` hoặc `USD` (Cố định cho cả năm tài chính theo **BR-10, BR-11**).
  - `Tổng hạn mức ngân sách phần mềm (Total Annual Ceiling):` Số tiền ngân sách được phê duyệt (VD: `5,000,000,000 VND` hoặc `$200,000 USD`).
  - `Ngày bắt đầu & kết thúc tài khóa:` Mặc định từ `01/01` đến `31/12`.
  - `Mô tả & Căn cứ phê duyệt:` Nhập số tờ trình / nghị quyết HĐQT phê duyệt ngân sách.
  - `Tệp đính kèm:` Upload văn bản phê duyệt kế hoạch ngân sách (PDF).

#### 2. Phân bổ Ngân sách theo Tháng (Monthly Budget Breakdown)
Hỗ trợ 2 phương thức phân bổ 12 tháng:
- **Phương thức 1 – Dàn đều tự động (Even Distribution):** Hệ thống tự động chia đều: $\text{Monthly Budget} = \frac{\text{Total Annual Budget}}{12}$.
- **Phương thức 2 – Phân bổ tùy biến theo chu kỳ (Seasonal / Custom Allocation):**
  - Manager trực tiếp nhập hạn mức cho từng tháng từ Tháng 1 đến Tháng 12.
  - Phù hợp với đặc thù doanh nghiệp thường tập trung thanh toán gia hạn các gói lớn vào các tháng cố định (ví dụ: Tháng 3 gia hạn Microsoft 365, Tháng 11 gia hạn AWS/GCP).
  - **Quy tắc Kiểm tra Ràng buộc (Validation Rule):**
    $$\sum_{m=1}^{12} \text{Monthly Budget}_m \le \text{Total Annual Budget}$$
    Nếu tổng 12 tháng vượt quá ngân sách năm, hệ thống báo đỏ: *"Tổng ngân sách 12 tháng đang vượt quá hạn mức năm X đồng. Vui lòng cân đối lại."*

#### 3. Phân bổ Ngân sách theo Phòng ban (Department Allocation)
- Gán hạn ngạch chi tiêu phần mềm cho từng đơn vị thụ hưởng (Cost Center):
  - Khối Kỹ thuật & Công nghệ (Tech / Engineering)
  - Khối Thiết kế Sản phẩm (Product Design)
  - Khối Kinh doanh & Tiếp thị (Sales & Marketing)
  - Khối Vận hành & Tài chính (Operations & Finance)
  - Khối Nhân sự & Đào tạo (HR & Admin)
- **Bảng Ma trận Phân bổ (Allocation Grid):**
  - Cột: Tên phòng ban, Người phụ trách duyệt (Head of Dept), Hạn mức phân bổ, Tỷ lệ % trên tổng ngân sách, Ngân sách dự phòng chung (Unallocated Buffer).
  - Tự động kiểm tra: $\sum \text{Dept Budget} + \text{Buffer} = \text{Total Annual Budget}$.

#### 4. Phân bổ Ngân sách theo Phần mềm hoặc Vendor (Software / Vendor Bucket Allocation)
- Phân bổ trần ngân sách cho các Nhà cung cấp chiến lược hoặc nhóm phần mềm:
  - *Bucket Vendor:* Microsoft Pool, Adobe Pool, JetBrains Pool, Atlassian Pool, Google Workspace Pool,...
  - *Bucket Nhóm phần mềm:* Phần mềm Văn phòng & Cộng tác, Công cụ Lập trình & Hạ tầng, Phần mềm Đồ họa & Thiết kế, Phần mềm Chuyên dụng Kỹ thuật (CAD/CAM).
- Giúp Manager kiểm soát không cho phép một nhóm vendor chi tiêu vượt quá hạn mức thỏa thuận đầu năm.

#### 5. Quản lý Phiên bản & Lịch sử Điều chỉnh Ngân sách (Budget Revisions & Audit Log)
- Mọi lần điều chỉnh tăng/giảm ngân sách đều tạo một phiên bản mới: `v1.0 (Kế hoạch gốc)`, `v1.1 (Điều chỉnh Q2)`, `v1.2 (Bổ sung ngân sách dự án mới)`.
- Bắt buộc nhập `Lý do điều chỉnh (Revision Justification)` và lưu vết vào `audit_logs` (**BR-17**).

---

### 5.2. Nhóm Nghiệp vụ B: Expense Tracking (Theo dõi Chi phí)

Cung cấp sổ cái theo dõi toàn diện các khoản chi phí phát sinh thực tế từ việc mua mới, gia hạn thuê bao SaaS và duy trì bảo trì Perpetual (**UC13, UC33, UC34, US-M09**).

#### 1. Các Chiều Theo dõi Chi phí Trọng yếu
- **Chi phí License Hàng tháng (Monthly License Expenses):**
  - Tập hợp toàn bộ chi phí phát sinh trong từng tháng của các dịch vụ SaaS trả theo tháng (Monthly billings).
  - Cho phép lọc xem chi tiêu từng tháng riêng biệt hoặc xem lũy kế.
- **Chi phí License Hàng năm (Annual License Expenses):**
  - Các hợp đồng thuê bao SaaS trả theo chu kỳ năm (Yearly commitments) và phí thỏa thuận bảo trì Perpetual License (**BR-12**).
- **Chi phí Đã thanh toán (Paid Expenses):**
  - Các khoản chi phí đã hoàn tất giao dịch thanh toán ngân hàng, có đính kèm hóa đơn VAT hợp lệ và ủy nhiệm chi kế toán.
  - Trạng thái: `PAID`. Đóng góp trực tiếp vào chỉ số **Actual Spending**.
- **Chi phí Chưa thanh toán (Unpaid / Pending Expenses):**
  - Các hóa đơn đã được lập/nhận từ vendor nhưng đang trong thời hạn chờ duyệt thanh toán hoặc đang chờ kế toán giải ngân.
  - Trạng thái: `PENDING` (Trong hạn thanh toán) hoặc `OVERDUE` (Quá hạn thanh toán).
  - Đóng góp vào chỉ số **Committed Spending**.
- **Chi phí Dự kiến trong Tương lai (Projected / Future Commitments):**
  - Chi phí dự kiến phải trả trong các kỳ thanh toán tiếp theo căn cứ trên các hợp đồng SaaS đang hoạt động và hợp đồng bảo trì sắp đến hạn gia hạn.
  - Trạng thái: `PROJECTED`. Giúp Manager chủ động chuẩn bị dòng tiền.

#### 2. Bảng Sổ cái Chi phí (Expense Ledger View - `/manager/budget/expenses`)

| Mã Hóa Đơn / Chi Phí | Tên Phần Mềm & Gói | Nhà Cung Cấp | Số Tiền & Tiền Tệ | Chu Kỳ | Ngày Phát Sinh | Hạn Thanh Toán | Trạng Thái | Chứng Từ VAT | Thao Tác |
| :--- | :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| `EXP-2026-081` | Microsoft 365 E5 | Microsoft Corp | $1,750 USD | Tháng | 01/11/2026 | 15/11/2026 | `PAID` 🟢 | [HD-881.pdf] | Xem |
| `EXP-2026-082` | Figma Enterprise | Figma Inc | $900 USD | Tháng | 05/11/2026 | 20/11/2026 | `PENDING` 🟡 | [HD-892.pdf] | Duyệt chi |
| `EXP-2026-079` | JetBrains All Pack | JetBrains s.r.o | 320,000,000 VND | Năm | 15/10/2026 | 30/10/2026 | `PAID` 🟢 | [VAT-012.pdf]| Xem |
| `EXP-2026-090` | AutoCAD 2026 Maint | Autodesk Inc | 145,000,000 VND | Năm (Bảo trì)| 01/12/2026 | 15/12/2026 | `PROJECTED` 🔵| [Dự thảo PO] | Xem |

#### 3. Quy tắc Nghiệp vụ về Hóa đơn & Tiền tệ (BR-10 & BR-11)
- **Quy tắc BR-10:** Bản ghi Expense hợp lệ bắt buộc phải có: Số tiền $> 0$, Loại tiền tệ xác định (`VND` hoặc `USD`), Ngày thanh toán / phát sinh, Số hóa đơn và Đơn vị thụ hưởng.
- **Quy tắc BR-11:** Các khoản chi phí khác loại tiền tệ tuyệt đối không được cộng gộp trực tiếp. Hệ thống cung cấp bảng tỷ giá tham chiếu (`Exchange Rate Table`, ví dụ: $1 \text{ USD} = 25,400 \text{ VND}$) để quy đổi toàn bộ về đồng tiền cơ sở khi tính toán tổng ngân sách.

---

### 5.3. Nhóm Nghiệp vụ C: Budget Monitoring (Theo dõi Ngân sách & 5 Metrics Cốt lõi)

Màn hình bảng điều hành trung tâm giám sát sức khỏe tài chính bản quyền (`/manager/budget/monitoring`), cung cấp 5 chỉ số then chốt và cơ chế cảnh báo ngưỡng tự động (**UC14, US-M08, US-M13**).

#### 1. Bảng 5 Chỉ số Đo lường Hiệu suất Ngân sách (Core Financial Metrics)

| Tên Chỉ Số (Metric) | Ý Nghĩa Nghiệp Vụ | Công Thức Tính Toán | Mục Đích Quản Trị |
| :--- | :--- | :--- | :--- |
| **1. Total Budget** | Tổng ngân sách được phân bổ cho kỳ tài chính đã duyệt. | $\text{Total Budget} = \sum \text{Department Budgets}$ | Xác lập trần ngân sách pháp lý tối đa được phép chi. |
| **2. Actual Spending** | Chi phí thực tế đã giải ngân và thanh toán xong. | $\text{Actual Spending} = \sum \text{Paid Expenses}$ | Đo lường số tiền thực tế đã rời khỏi tài khoản doanh nghiệp. |
| **3. Committed Spending** | Chi phí đã cam kết phải trả (Hóa đơn chờ trả + Hợp đồng đang chạy). | $\text{Committed} = \sum \text{Pending Expenses} + \sum \text{Active Contracts in Period}$ | Nắm bắt nghĩa vụ tài chính bắt buộc phải chi trả trong kỳ. |
| **4. Remaining Budget** | Ngân sách còn lại khả dụng cho các nhu cầu mua sắm mới. | $\text{Remaining} = \text{Total Budget} - (\text{Actual} + \text{Committed})$ | Biết chính xác doanh nghiệp còn bao nhiêu tiền để mua license mới. |
| **5. Budget Utilization** | Tỷ lệ sử dụng và cam kết ngân sách so với kế hoạch. | $\text{Utilization (\%)} = \left(\frac{\text{Actual} + \text{Committed}}{\text{Total Budget}}\right) \times 100\%$ | Đánh giá tốc độ giải ngân và nguy cơ vượt hạn mức. |

---

#### 2. Hệ thống Cảnh báo Ngưỡng Chi tiêu Tự động (Budget Threshold Alerts - UC14)
Hệ thống giám sát liên tục chỉ số **Budget Utilization** và phân loại cảnh báo:

```mermaid
flowchart LR
    Util["Tỷ lệ Giải ngân<br/>Budget Utilization (%)"] --> Check{Kiểm tra Ngưỡng}
    Check -->|Dưới 80%| Safe["🟢 VÙNG AN TOÀN (SAFE)<br/>Tiến độ chi tiêu ổn định, trong tầm kiểm soát."]
    Check -->|Từ 80% đến 99%| Warn["🟡 CẢNH BÁO SỚM (WARNING)<br/>Đã sử dụng >= 80% ngân sách.<br/>Bật thông báo nhắc nhở Manager."]
    Check -->|Đạt >= 100%| Danger["🔴 BÁO ĐỘNG ĐỎ (OVER-BUDGET)<br/>Vượt trần ngân sách phê duyệt!<br/>Khóa cảnh báo & yêu cầu tờ trình bổ sung."]
```

- **Mức Xanh (Safe - Dưới 80%):** Hoạt động giải ngân bình thường, không có nguy cơ vượt trần.
- **Mức Vàng (Warning - Từ 80% đến 99%):** 
  - Kích hoạt thông báo cảnh báo sớm trên Dashboard của Manager.
  - Gợi ý Manager rà soát các hợp đồng sắp gia hạn và kiểm tra các license không dùng (Inactive) để cắt giảm trước khi vượt trần.
- **Mức Đỏ (Over-budget - Đạt $\ge 100\%$):**
  - Bật cảnh báo nguy hiểm màu đỏ trên toàn bộ phân hệ Manager.
  - Khi Manager cố gắng Approve một License Request mới đòi hỏi phát sinh chi phí, hệ thống hiển thị thông báo chặn mềm: *"Ngân sách phòng ban [Tên Dept] đã vượt trần 100%. Yêu cầu phê duyệt ngoại lệ từ Ban Giám Đốc để tiếp tục."*

#### 3. Biểu đồ Tiến độ Giải ngân Lũy kế (Cumulative Spending Burn-down / Burn-up Chart)
- Đường màu Xám: Đường kế hoạch ngân sách chuẩn (Planned Budget Pace - lũy kế đều 12 tháng).
- Đường màu Xanh dương: Chi phí thực tế đã giải ngân (Actual Spending).
- Đường màu Vàng nét đứt: Chi phí đã cam kết lũy kế (Actual + Committed).
- Trực quan hóa điểm giao cắt và dự báo thời điểm có nguy cơ chạm trần ngân sách trước hạn (nếu có).

---

### 5.4. Nhóm Nghiệp vụ D: Financial Reporting (Báo cáo Tài chính)

Cung cấp các báo cáo phân tích tài chính chuyên sâu phục vụ công tác đối soát kế toán, thẩm định hiệu quả đầu tư phần mềm và lập kế hoạch ngân sách chu kỳ tiếp theo (**UC24, UC26, US-M13**).

#### 1. Báo cáo 1: Chi phí theo Tháng (Monthly Expense Trend Report)
- **Dạng thể hiện:** Biểu đồ cột chồng (Stacked Bar Chart) kết hợp bảng số liệu chi tiết.
- **Dữ liệu phân rã:**
  - Cột thành phần 1: Chi phí thuê bao đám mây (SaaS Subscriptions).
  - Cột thành phần 2: Chi phí mua mới & duy trì bảo trì (Perpetual Maintenance).
  - Cột thành phần 3: Chi phí dịch vụ bổ sung / Support fees.
- **Chỉ số phân tích:**
  - Tốc độ tăng trưởng chi phí hàng tháng (Month-over-Month Growth - MoM %).
  - Tháng có chi phí đột biến và phân tích nguyên nhân gốc rễ (Root cause: do bổ sung dự án mới hay gia hạn tập trung).

#### 2. Báo cáo 2: Chi phí theo Vendor (Expense Breakdown by Vendor)
- **Dạng thể hiện:** Biểu đồ Tròn (Donut Chart) và Biểu đồ Treemap.
- **Nội dung phân tích:**
  - Tỷ trọng ngân sách dành cho từng Vendor: Microsoft (ví dụ 42%), Adobe (18%), JetBrains (14%), Atlassian (10%), Google (8%), Các vendor khác (8%).
  - **Phân tích Top 5 Nhà cung cấp chiếm chi tiêu lớn nhất:** Giúp Manager nhận diện đối tác chiến lược để đàm phán chính sách giá doanh nghiệp lớn (Volume Discount / Enterprise Agreement).

#### 3. Báo cáo 3: So sánh Ngân sách và Chi phí Thực tế (Budget vs. Actual Variance Analysis)
- **Mục tiêu:** Đối chiếu sai lệch giữa kế hoạch ngân sách đề ra đầu năm và chi phí thực tế phát sinh theo từng phòng ban và từng danh mục phần mềm.
- **Cấu trúc Bảng Đối soát Sai lệch (Variance Matrix Grid):**

| Phòng Ban / Danh Mục | Ngân Sách Kế Hoạch (Budget) | Thực Chi (Actual) | Đã Cam Kết (Committed) | Tổng Tiêu Thụ (Total Used) | Chênh Lệch (Variance) | Tỷ Lệ Lệch (% Var) | Đánh Giá Tình Trạng |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Phòng Kỹ thuật (Tech)** | 1,800,000,000 ₫ | 1,420,000,000 ₫ | 180,000,000 ₫ | 1,600,000,000 ₫ | +200,000,000 ₫ | +11.1% | 🟢 Tiết kiệm (Favorable) |
| **Phòng Thiết kế (Design)** | 600,000,000 ₫ | 510,000,000 ₫ | 115,000,000 ₫ | 625,000,000 ₫ | -25,000,000 ₫ | -4.2% | 🔴 Vượt trần (Unfavorable) |
| **Phòng Marketing** | 450,000,000 ₫ | 340,000,000 ₫ | 60,000,000 ₫ | 400,000,000 ₫ | +50,000,000 ₫ | +11.1% | 🟢 Tiết kiệm (Favorable) |
| **Dự phòng Chung (Buffer)**| 300,000,000 ₫ | 0 ₫ | 0 ₫ | 0 ₫ | +300,000,000 ₫ | +100% | 🟢 Khả dụng |

- **Ý nghĩa chỉ số Chênh lệch (Variance):**
  - $\text{Variance} = \text{Budget} - (\text{Actual} + \text{Committed})$.
  - $\text{Variance} > 0$: **Thuận lợi (Favorable - Xanh)** $\to$ Chi tiêu dưới ngân sách, tiết kiệm chi phí.
  - $\text{Variance} < 0$: **Bất lợi (Unfavorable - Đỏ)** $\to$ Chi tiêu vượt ngân sách, cần giải trình.

#### 4. Báo cáo 4: Dự báo Chi phí Gia hạn (Renewal Cost Forecasting)
- **Mục tiêu:** Cung cấp bức tranh dự phóng dòng tiền cần chi trả trong tương lai ngắn hạn và trung hạn để doanh nghiệp không bị bất ngờ về mặt tài chính (**UC15, UC16, UC22**).
- **Khung thời gian dự phóng (Forecasting Horizons):**
  - *Dự báo 30 ngày tới (Next 30 Days):* Các hợp đồng SaaS và hạn bảo trì sắp hết hạn ngay trong tháng.
  - *Dự báo Quý tới (Next Quarter - 90 Days):* Lịch thanh toán các gói lớn trong quý.
  - *Dự báo 12 tháng tới (Next 12 Months):* Dòng tiền dự kiến theo chu kỳ năm tài chính kế tiếp.
- **Tính năng Đề xuất Tối ưu hóa Tích hợp (Integrated Cost Optimization Insight):**
  - Hệ thống tự động liên kết dữ liệu nhân viên **Inactive $\ge 60$ ngày** (từ Module 2) với các hợp đồng sắp gia hạn:
  - *Ví dụ cảnh báo thông minh:* *"Hợp đồng JetBrains All Products Pack sắp gia hạn ngày 15/12/2026 với 50 seats ($15,000). Hệ thống phát hiện có 8 nhân viên không hoạt động trong 60 ngày qua. Nếu cắt giảm 8 seats trước khi gia hạn, doanh nghiệp sẽ tiết kiệm được $2,400 USD/năm."*
- **Xuất Báo cáo Đa định dạng (Exporting Capabilities):**
  - `[Xuất PDF Chuẩn Ban Giám Đốc]`: Trình bày biểu đồ màu sắc, bảng tóm tắt chỉ số và phân tích chuyên sâu.
  - `[Xuất Excel / CSV Thô]`: Đầy đủ dữ liệu chi tiết từng giao dịch phục vụ bộ phận Kế toán / Kiểm toán.

---

## 6. Sơ đồ Luồng Trạng thái & Cơ chế Bảo toàn Dữ liệu (State Machines & Data Integrity)

### 6.1. Vòng đời Trạng thái của License Entitlement (Module 1)

```mermaid
stateDiagram-v2
    [*] --> Draft: Tạo bản ghi nháp
    Draft --> Active: Kích hoạt hiệu lực (Available = Purchased)
    Active --> ExpiringSoon: Còn <= 30 ngày đến hạn (Lifecycle Cron)
    ExpiringSoon --> Active: Gia hạn thành công (Renewed)
    ExpiringSoon --> Expired: Quá ngày hết hạn (Overdue)
    Expired --> Active: Ký hợp đồng gia hạn bổ sung
    Expired --> Archived: Hủy hợp đồng / Ngừng sử dụng
    Active --> Suspended: Tạm đình chỉ (Do tranh chấp / Thanh tra)
    Suspended --> Active: Khôi phục hoạt động
    Active --> Archived: Hết hạn sử dụng & Lưu trữ dữ liệu
    Archived --> [*]
```

---

### 6.2. Vòng đời Trạng thái của Phân bổ Seat - License Assignment (Module 2)

```mermaid
stateDiagram-v2
    [*] --> AvailablePool: Nhập License vào Kho (Available = Purchased)
    
    AvailablePool --> ActiveAssignment: Manager Cấp phát (Assign) cho Employee
    note right of ActiveAssignment
        Allocated Quantity += 1
        Available Quantity -= 1
        (Khóa dòng chống Over-allocation)
    end note
    
    ActiveAssignment --> Revoked: Manager Thu hồi (Revoke) về Kho
    note right of Revoked
        Allocated Quantity -= 1
        Available Quantity += 1
        Bản ghi giữ lại trong Lịch sử (BR-13)
    end note
    
    Revoked --> AvailablePool: Seat hoàn trả sẵn sàng cấp tiếp
    
    ActiveAssignment --> Upgraded: Manager Đổi sang gói cao hơn
    ActiveAssignment --> Downgraded: Manager Đổi sang gói thấp hơn
    Upgraded --> AvailablePool: Hoàn trả seat cũ & Lấy seat mới
    Downgraded --> AvailablePool: Hoàn trả seat cũ & Lấy seat mới
```

---

### 6.3. Vòng đời Trạng thái của Khoản Chi phí - Expense (Module 3)

```mermaid
stateDiagram-v2
    [*] --> Projected: Dự phóng từ hợp đồng SaaS/Perpetual còn hạn
    Projected --> Pending: Nhận hóa đơn / Đến hạn thanh toán (Editor nạp)
    Pending --> Paid: Kế toán thanh toán & Manager xác nhận (Có VAT)
    note right of Paid
        Đóng góp vào Actual Spending
        Giảm Remaining Budget
    end note
    Pending --> Overdue: Quá hạn thanh toán (Quá Due Date)
    Overdue --> Paid: Thanh toán muộn hoàn tất
    Pending --> Cancelled: Hủy bỏ hóa đơn (Sai sót / Đàm phán lại)
    Projected --> Cancelled: Ngừng hợp đồng trước hạn
    Paid --> [*]
    Cancelled --> [*]
```

---

### 6.4. Vòng đời Kế hoạch Ngân sách - Budget Plan (Module 3)

```mermaid
stateDiagram-v2
    [*] --> Draft: Manager lập dự thảo ngân sách năm/dept
    Draft --> UnderReview: Trình Ban Giám Đốc xem xét
    UnderReview --> Approved: Ban Giám Đốc phê duyệt hạn mức
    UnderReview --> Draft: Yêu cầu điều chỉnh cắt giảm
    Approved --> Active: Bắt đầu năm tài chính (Kích hoạt kiểm soát chi)
    Active --> Revised: Điều chỉnh bổ sung hạn mức trong năm (Tạo v1.1, v1.2)
    Revised --> Active: Kích hoạt hạn mức mới
    Active --> Closed: Kết thúc năm tài chính (Chốt sổ đối soát)
    Closed --> Archived: Lưu trữ lịch sử vĩnh viễn (BR-20)
    Archived --> [*]
```

---

## 7. Thiết kế Wireframes Trực quan (UI Layout Wireframes)

### 7.1. Wireframe: License Management List View (`/manager/licenses`)

```text
+--------------------------------------------------------------------------------------------------------------------+
|  VFast ELMS  |  [Dashboard]  [Licenses*]  [Assignments]  [Budgets]  [Optimization]  [Audit Logs]   | (Mgr) Dat Nguyen |
+--------------------------------------------------------------------------------------------------------------------+
| TRANG CHỦ / QUẢN LÝ BẢN QUYỀN                                                                                      |
|                                                                                                                    |
| Quản lý Bản quyền (License Management)                                        [ Xuất Báo Cáo ]  [ + Thêm License ] |
| Theo dõi và quản lý tập trung toàn bộ danh mục license SaaS và Perpetual                                           |
|                                                                                                                    |
| +--------------------+ +--------------------+ +--------------------+ +--------------------+ +--------------------+ |
| | TỔNG LICENSE       | | TỔNG SỐ SEATS      | | TỶ LỆ PHÂN BỔ      | | SẮP HẾT HẠN (30D)  | | CẢNH BÁO OVERUSE   | |
| | 42 Bản quyền       | | 1,250 Seats        | | 86.4% Đã dùng      | | 4 Hợp đồng         | | 0 Vi phạm          | |
| | 36 SaaS - 6 Perp   | | 1,080 / 1,250      | | [=========-] 86%   | | (Cần xem xét gấp)  | | (Hệ thống an toàn) | |
| +--------------------+ +--------------------+ +--------------------+ +--------------------+ +--------------------+ |
|                                                                                                                    |
| BỘ LỌC TÌM KIẾM                                                                                                    |
| [ Tìm theo phần mềm, vendor, key... ] [ Vendor: Tất cả v ] [ Loại: Tất cả v ] [ Trạng thái: Tất cả v ] [ Đặt lại ]  |
|                                                                                                                    |
| DANH SÁCH LICENSE                                                                                                  |
| +----+----------------------+-------------------+-------------+---------------+---------+------------+----------+--+
| |[x] | Phần mềm & Phiên bản | Nhà cung cấp      | Loại hình   | Dung lượng    | Còn lại | Hết hạn    | Trạngthái|..|
| +----+----------------------+-------------------+-------------+---------------+---------+------------+----------+--+
| |[ ] | Microsoft 365 E5     | Microsoft Corp    | SaaS Sub    | 45/50 (90%)   | 5 seats | 31/12/2026 | [Active] |..|
| |[ ] | JetBrains All Pack   | JetBrains s.r.o   | SaaS Sub    | 50/50 (100%)  | 0 seats | 15/10/2026 | [Active] |..|
| |[ ] | Adobe CC All Apps    | Adobe Systems     | SaaS Sub    | 18/20 (90%)   | 2 seats | 25/11/2026 | [ExpSoon]|..|
| |[ ] | AutoCAD 2026 Pro     | Autodesk Inc      | Perpetual   | 11/15 (73%)   | 4 seats | 10/05/2027*| [Active] |..|
| |[ ] | Windows 11 Pro OEM   | Microsoft Corp    | Perpetual   | 120/150 (80%) | 30 seats| Vĩnh viễn  | [Active] |..|
| +----+----------------------+-------------------+-------------+---------------+---------+------------+----------+--+
| Hiển thị 1 - 5 của 42 bản quyền                              [<<] [<] Trang 1 / 9 [>] [>>]   Số dòng: [ 10 / trang v ]
+--------------------------------------------------------------------------------------------------------------------+
```

---

### 7.2. Wireframe: Assignment Hub & Availability Monitor (`/manager/assignments`)

```text
+--------------------------------------------------------------------------------------------------------------------+
|  VFast ELMS  |  [Dashboard]  [Licenses]  [Assignments*]  [Budgets]  [Optimization]  [Audit Logs]   | (Mgr) Dat Nguyen |
+--------------------------------------------------------------------------------------------------------------------+
| TRANG CHỦ / PHÂN BỔ BẢN QUYỀN                                                                                      |
|                                                                                                                    |
| Quản lý Phân bổ Bản quyền (License Assignment Hub)                             [ Thu hồi nhóm ]  [ + Gán License ] |
| Theo dõi nhân viên sử dụng, kiểm tra seat trống và điều chuyển bản quyền                                           |
|                                                                                                                    |
| [ View: Theo Nhân Viên (A) ]  [ View: Theo Phần Mềm & Seat (B) ]  [ Bảng Seat Còn Trống (C) ]  [ Lịch Sử Toàn Cục ]|
|                                                                                                                    |
| +----------------------------------------------------------------------------------------------------------------+ |
| | BẢNG KIỂM TRA SỐ LƯỢNG SEAT CÒN TRỐNG (REAL-TIME SEAT AVAILABILITY MONITOR)                                    | |
| +------------------------------------+-----------+-----------+----------+---------------+----------------+-------+ |
| | Phần mềm & Gói Entitlement         | Tổng mua  | Đã cấp    | Còn trống| Tỷ lệ lấp đầy | Cảnh báo       |Thao tác| |
| +------------------------------------+-----------+-----------+----------+---------------+----------------+-------+ |
| | Microsoft 365 Enterprise E5        | 50 seats  | 45 seats  | 5 seats  | [========-]90%| 🟡 Sắp hết     |[Gán]..| |
| | JetBrains All Products Pack        | 50 seats  | 50 seats  | 0 seats  | [=========]100%| 🔴 Hết chỗ    |[Xem]..| |
| | Adobe Creative Cloud All Apps      | 20 seats  | 18 seats  | 2 seats  | [========-]90%| 🟡 Sắp hết     |[Gán]..| |
| | Figma Enterprise Design            | 40 seats  | 22 seats  | 18 seats | [====-----]55%| 🔵 Dư thừa cao |[Tốiưu]| |
| | AutoCAD 2026 Maintenance           | 15 seats  | 11 seats  | 4 seats  | [======---]73%| 🟢 Tối ưu      |[Gán]..| |
| +------------------------------------+-----------+-----------+----------+---------------+----------------+-------+ |
|                                                                                                                    |
| DANH SÁCH NHÂN VIÊN ĐANG SỬ DỤNG (THEO DÕI ACTIVE / INACTIVE)                                                      |
| Tìm kiếm: [ Nhập tên nhân viên, email, phòng ban... ]           Lọc hoạt động: [ Inactive >= 60 ngày v ]           |
| +----------------------+------------------+---------------------+----------------+------------------+------------+ |
| | Nhân viên            | Phòng ban        | Phần mềm đang giữ   | Hoạt động cuối | Trạng thái dùng  | Thao tác   | |
| +----------------------+------------------+---------------------+----------------+------------------+------------+ |
| | Trần Văn C (c.tran)  | Kỹ thuật (Tech)  | JetBrains All Pack  | 68 ngày trước  | 🔴 Inactive 68d  |[Thu hồi]| |
| | Lê Hoàng D (d.le)    | Thiết kế (Design)| Adobe CC All Apps   | 62 ngày trước  | 🔴 Inactive 62d  |[Thu hồi]| |
| | Vũ Thị E (e.vu)      | Marketing        | Canva Pro           | Hôm qua        | 🟢 Active        |[Đổi loại]  | |
| +----------------------+------------------+---------------------+----------------+------------------+------------+ |
+--------------------------------------------------------------------------------------------------------------------+
```

---

### 7.3. Wireframe: Assign License Drawer (`/manager/assignments/new`)

```text
+-------------------------------------------------------------+
| CẤP PHÁT LICENSE CHO NHÂN VIÊN (ASSIGN SEAT)            [X] |
+-------------------------------------------------------------+
| BƯỚC 1: CHỌN NHÂN VIÊN THỤ HƯỞNG                            |
| Tìm kiếm nhân viên: [ Nguyen Van A                        ] |
| +---------------------------------------------------------+ |
| | [Avatar] Nguyễn Văn A (a.nguyen@vfast.com)              | |
| | Phòng ban: Kỹ thuật (Tech) | Chức danh: Backend Dev     | |
| | License đang sở hữu: [Windows 11 Pro]                   | |
| +---------------------------------------------------------+ |
|                                                             |
| BƯỚC 2: CHỌN PHẦN MỀM & GÓI LICENSE CẤP PHÁT               |
| Phần mềm: [ Microsoft 365                               v ] |
| Gói bản quyền (Entitlement Pool):                           |
| (o) Microsoft 365 E5 (PO-2026-01) - CÒN 5 SEAT TRỐNG 🟢    |
| ( ) Microsoft 365 Business (PO-2025-11) - HẾT CHỖ (0) 🔴   |
|                                                             |
| BƯỚC 3: THIẾT LẬP THAM SỐ GÁN                               |
| Ngày hiệu lực: [ 09/11/2026   📅 ]                           |
| Thời hạn phân bổ:                                           |
| (o) Theo thời hạn hợp đồng license                          |
| ( ) Cấp phát tạm thời theo dự án -> Đến ngày [ 09/02/2027 ] |
|                                                             |
| Lý do cấp phát: (Bắt buộc)                                  |
| [ Cần tài khoản email Enterprise và Teams phục vụ dự án   ] |
| [ VFast Core System trong quý 4                           ] |
|                                                             |
| [!] Lưu ý: Hệ thống sẽ tự động trừ 1 seat trong kho khả dụng|
|     và gửi email thông báo kèm thông tin kích hoạt cho User.|
+-------------------------------------------------------------+
|                       [ Hủy bỏ ]   [ Xác nhận Cấp phát Seat ]|
+-------------------------------------------------------------+
```

---

### 7.4. Wireframe: Change License Type Modal (Upgrade / Downgrade)

```text
+-----------------------------------------------------------------------+
| THAY ĐỔI LOẠI LICENSE (UPGRADE / DOWNGRADE)                       [X] |
+-----------------------------------------------------------------------+
| Nhân viên: Trần Văn B (b.tran@vfast.com) - UI/UX Designer             |
|                                                                       |
| +--------------------------------+   +------------------------------+ |
| | GÓI HIỆN TẠI (CURRENT)         |   | GÓI MỤC TIÊU (TARGET)        | |
| | Figma Viewer Only              |   | Figma Enterprise Editor      | |
| | Trạng thái: Đang sử dụng       |==>| Còn trống: 6 seats khả dụng  | |
| | Chi phí: $0 / tháng            |   | Chi phí mới: $45 / tháng     | |
| +--------------------------------+   +------------------------------+ |
|                       Loại giao dịch: [ ⬆ NÂNG CẤP (UPGRADE) ]        |
|                                                                       |
| Ngày áp dụng thay đổi: [ 10/11/2026   📅 ]                            |
|                                                                       |
| Lý do chuyển đổi loại license: (Bắt buộc)                             |
| [ Nhân sự chuyển sang vị trí Lead Designer, cần quyền chỉnh sửa trực ]|
| [ tiếp toàn bộ thư viện Design System của dự án                      ]|
|                                                                       |
| [i] Cơ chế xử lý nguyên tử:                                           |
|     1. Hoàn trả 1 seat gói Viewer về kho khả dụng (+1).               |
|     2. Trích xuất 1 seat gói Enterprise Editor cấp cho nhân viên (-1).|
|     3. Tự động cập nhật ngân sách phòng Thiết kế.                    |
+-----------------------------------------------------------------------+
|                       [ Hủy bỏ ]   [ Xác nhận Chuyển đổi Ngay ]       |
+-----------------------------------------------------------------------+
```

---

### 7.5. Wireframe: Budget Monitoring Cockpit (`/manager/budget/monitoring`)

```text
+--------------------------------------------------------------------------------------------------------------------+
|  VFast ELMS  |  [Dashboard]  [Licenses]  [Assignments]  [Budgets*]  [Optimization]  [Audit Logs]   | (Mgr) Dat Nguyen |
+--------------------------------------------------------------------------------------------------------------------+
| TRANG CHỦ / QUẢN LÝ NGÂN SÁCH & CHI PHÍ                                                                            |
|                                                                                                                    |
| Bảng Giám sát Ngân sách & Tài chính (Budget Monitoring)                        [ Xuất Báo Cáo ]  [ + Thiết lập Ngân Sách ]|
| Năm tài chính: [ FY2026 (01/01/2026 - 31/12/2026) v ]      Tiền tệ hiển thị: [ VND (Triệu đồng) v ]                |
|                                                                                                                    |
| 5 CHỈ SỐ TÀI CHÍNH CỐT LÕI (CORE FINANCIAL METRICS)                                                                |
| +--------------------+ +--------------------+ +--------------------+ +--------------------+ +--------------------+ |
| | 1. TOTAL BUDGET    | | 2. ACTUAL SPENT    | | 3. COMMITTED       | | 4. REMAINING       | | 5. UTILIZATION     | |
| | 5,000,000,000 ₫    | | 3,450,000,000 ₫    | | 750,000,000 ₫      | | 800,000,000 ₫      | | 84.0% (Warning)    | |
| | Đã duyệt năm 2026  | | Thực tế đã thanh toán| Hóa đơn chờ trả + HĐ| Khả dụng mua mới     | 🟡 Vượt ngưỡng 80%   | |
| +--------------------+ +--------------------+ +--------------------+ +--------------------+ +--------------------+ |
|                                                                                                                    |
| [!] CẢNH BÁO: Tỷ lệ sử dụng và cam kết ngân sách đã đạt 84.0% (Ngưỡng cảnh báo: 80%). Cần kiểm soát chi phí quý 4. |
|                                                                                                                    |
| [ Monitoring Cockpit* ]   [ Budget Planning ]   [ Expense Tracking Ledger ]   [ Financial Reporting Center ]       |
|                                                                                                                    |
| BIỂU ĐỒ TIẾN ĐỘ GIẢI NGÂN LŨY KẾ 12 THÁNG (CUMULATIVE SPENDING BURN-DOWN / BURN-UP)                                |
| 5,000Tr ₫ |-----------------------------------------------------------------------------[ TRẦN NGÂN SÁCH NĂM ]     |
| 4,000Tr ₫ |                                                          /----(Committed 4,200Tr)                     |
| 3,000Tr ₫ |                                         /---------------/ (Actual 3,450Tr)                            |
| 2,000Tr ₫ |                         /--------------/                                                              |
| 1,000Tr ₫ |         /--------------/                                                                              |
|     0 ₫   +---------+---------+---------+---------+---------+---------+---------+---------+---------+---------+    |
|           T1        T2        T3        T4        T5        T6        T7        T8        T9(Now)   T10  T11  T12    |
|           --- Kế hoạch đều (Planned)        === Thực chi (Actual)         ... Đã cam kết (Committed)              |
|                                                                                                                    |
| TIẾN ĐỘ GIẢI NGÂN THEO PHÒNG BAN (DEPARTMENT UTILIZATION PROGRESS)                                                 |
| Khối Kỹ thuật (Tech)     | Budget: 2,200 Tr ₫ | Dùng: 1,920 Tr (87%) | [====================----] 87% 🟡 Cảnh báo |
| Khối Thiết kế (Design)   | Budget:   700 Tr ₫ | Dùng:   650 Tr (93%) | [======================--] 93% 🟡 Cảnh báo |
| Khối Kinh doanh & Sales  | Budget:   900 Tr ₫ | Dùng:   630 Tr (70%) | [================--------] 70% 🟢 An toàn  |
| Khối Vận hành & Chung    | Budget: 1,200 Tr ₫ | Dùng: 1,000 Tr (83%) | [===================-----] 83% 🟡 Cảnh báo |
+--------------------------------------------------------------------------------------------------------------------+
```

---

### 7.6. Wireframe: Budget Planning Matrix (`/manager/budget/planning`)

```text
+--------------------------------------------------------------------------------------------------------------------+
| THIẾT LẬP & PHÂN BỔ NGÂN SÁCH (BUDGET PLANNING)                                                                    |
| Năm tài chính: [ FY2026 v ]    Tổng ngân sách: [ 5,000,000,000 ] VND     [ Tự động chia 12 tháng ] [ Lưu kế hoạch ]|
+--------------------------------------------------------------------------------------------------------------------+
| PHÂN BỔ HẠN MỨC THEO PHÒNG BAN & THEO THÁNG (Đơn vị: Triệu VNĐ)                                                    |
| +--------------------+-------+-------+-------+-------+-------+-------+-------+-------+-------+------+------+------+ |
| | Phòng ban / Tháng  | T1    | T2    | T3*   | T4    | T5    | T6    | T7    | T8    | T9    | T10  | T11* | T12  | |
| +--------------------+-------+-------+-------+-------+-------+-------+-------+-------+-------+------+------+------+ |
| | Kỹ thuật (Tech)    |  150  |  150  |  350  |  150  |  150  |  200  |  150  |  150  |  150  |  150 |  300 |  100 | |
| | Thiết kế (Design)  |   50  |   50  |   80  |   50  |   50  |   60  |   50  |   50  |   50  |   50 |   60 |   40 | |
| | Marketing & Sales  |   70  |   70  |   70  |   70  |   70  |  100  |   70  |   70  |   70  |   70 |   70 |   90 | |
| | Vận hành & HR      |   80  |   80  |  120  |   80  |   80  |   80  |   80  |   80  |   80  |   80 |  120 |  240 | |
| | Dự phòng (Buffer)  |   20  |   20  |   20  |   20  |   20  |   40  |   20  |   20  |   20  |   20  |   20  |   60 | |
| +--------------------+-------+-------+-------+-------+-------+-------+-------+-------+-------+------+------+------+ |
| | TỔNG CỘNG THÁNG    |  370  |  370  |  640  |  370  |  370  |  480  |  370  |  370  |  370  |  370 |  570 |  530 | |
| +--------------------+-------+-------+-------+-------+-------+-------+-------+-------+-------+------+------+------+ |
| (*) Các tháng có gia hạn hợp đồng lớn tập trung (Tháng 3: Microsoft Enterprise; Tháng 11: AWS Cloud & Dev Tools). |
| Tổng phân bổ 12 tháng: 5,000 / 5,000 Triệu ₫ [ HOÀN TOÀN CÂN BẰNG 100% 🟢 ]                                        |
+--------------------------------------------------------------------------------------------------------------------+
```

---

### 7.7. Wireframe: Financial Reporting Center (`/manager/budget/reports`)

```text
+--------------------------------------------------------------------------------------------------------------------+
| BÁO CÁO TÀI CHÍNH BẢN QUYỀN (FINANCIAL REPORTING CENTER)                        [ Xuất PDF Ban GĐ ]  [ Xuất Excel ]|
| Loại báo cáo: (o) Chi phí theo tháng   ( ) Theo Vendor   ( ) So sánh Ngân sách vs Thực tế   ( ) Dự báo chi phí gia hạn|
+--------------------------------------------------------------------------------------------------------------------+
| SO SÁNH NGÂN SÁCH VÀ CHI PHÍ THỰC TẾ (BUDGET VS. ACTUAL VARIANCE ANALYSIS - FY2026)                                |
| +------------------------+------------------+------------------+------------------+----------------+--------------+|
| | Danh mục / Đơn vị      | Ngân sách (Plan) | Thực chi (Actual)| Cam kết (Commit) | Chênh lệch     | Đánh giá     ||
| +------------------------+------------------+------------------+------------------+----------------+--------------+|
| | Khối Kỹ thuật (Tech)   | 2,200,000,000 ₫  | 1,720,000,000 ₫  |   200,000,000 ₫  | +280,000,000 ₫ | 🟢 Tiết kiệm ||
| | Khối Thiết kế (Design) |   700,000,000 ₫  |   580,000,000 ₫  |   140,000,000 ₫  |  -20,000,000 ₫ | 🔴 Vượt trần ||
| | Khối Sales & Marketing |   900,000,000 ₫  |   630,000,000 ₫  |    80,000,000 ₫  | +190,000,000 ₫ | 🟢 Tiết kiệm ||
| | Khối Vận hành (Ops)    | 1,200,000,000 ₫  |   820,000,000 ₫  |   180,000,000 ₫  | +200,000,000 ₫ | 🟢 Tiết kiệm ||
| +------------------------+------------------+------------------+------------------+----------------+--------------+|
| | TOÀN DOANH NGHIỆP      | 5,000,000,000 ₫  | 3,750,000,000 ₫  |   600,000,000 ₫  | +650,000,000 ₫ | 🟢 Dư ngân sách|
| +------------------------+------------------+------------------+------------------+----------------+--------------+|
|                                                                                                                    |
| DỰ BÁO CHI PHÍ GIA HẠN 90 NGÀY TỚI & KHUYẾN NGHỊ TỐI ƯU HÓA (RENEWAL FORECAST & OPTIMIZATION)                      |
| 1. Microsoft 365 E5: Hết hạn 31/12/2026. Chi phí dự kiến gia hạn: $21,000 USD (50 seats).                         |
|    -> Khuyến nghị: Có 5 seats Inactive >= 60 ngày. Giảm xuống 45 seats tiết kiệm: $2,100 USD/năm.                  |
| 2. JetBrains All Pack: Hết hạn 15/10/2026. Chi phí dự kiến gia hạn: 320,000,000 VND (50 seats).                   |
|    -> Khuyến nghị: Có 8 seats Inactive >= 60 ngày. Cắt giảm giúp tiết kiệm: 51,200,000 VND/năm.                   |
+--------------------------------------------------------------------------------------------------------------------+
```

---

## 8. Quy tắc Tương tác Giao diện & Xử lý Ngoại lệ (Interaction & Feedback Guidelines)

### 8.1. Trạng thái Phản hồi Người dùng (Toast Notifications & Dialogs)
- **Cấp phát thành công:** Toast xanh lá: *"Đã cấp phát thành công license [Tên phần mềm] cho nhân viên [Tên NV]. Dung lượng còn lại: X seats."*
- **Thu hồi thành công:** Toast xanh lá: *"Đã thu hồi license [Tên phần mềm] về kho. Dung lượng khả dụng đã tăng +1."*
- **Lỗi hết Seat (BR-05):** Hộp thoại cảnh báo đỏ: *"Cấp phát thất bại: License đã hết dung lượng khả dụng trong kho ($Available = 0$). Vui lòng kiểm tra lại."*
- **Chặn Xóa License (BR-05, BR-13):** Modal cảnh báo: *"Không thể xóa license này vì đang có X nhân viên sử dụng. Vui lòng thu hồi toàn bộ phân bổ trước khi xóa."*
- **Cảnh báo Vượt Ngân sách (UC14):** Toast vàng cam khi đạt 80%: *"Cảnh báo: Ngân sách phòng ban [Dept] đã giải ngân đạt 80%."*

### 8.2. Xử lý Trạng thái Rỗng (Empty States)
- Khi kho chưa có License: Hiển thị minh họa đồ họa + Dòng chữ *"Doanh nghiệp chưa có bản quyền nào trong kho"* + Nút bấm lớn `[+ Đăng ký License Đầu Tiên]`.
- Khi chưa lập Ngân sách năm: Hiển thị *"Chưa có kế hoạch ngân sách cho năm tài chính này"* + Nút `[+ Thiết Lập Ngân Sách Mới]`.
- Khi bộ lọc không có kết quả: Hiển thị *"Không tìm thấy dữ liệu khớp với tiêu chí tìm kiếm"* + Nút `[Xóa bộ lọc]`.

### 8.3. Bảo mật Phân quyền & Giám sát (Security & Audit Trail)
- Mọi nút Cấp phát, Thu hồi, Thêm, Sửa, Xóa, Thiết lập Ngân sách chỉ hiển thị và cho phép thao tác đối với vai trò **Manager** (RBAC Enforcement theo **BR-06, BR-07, BR-09**). Editor và Employee khi truy cập vào URL này sẽ bị hệ thống chặn và trả mã `403 Forbidden`.
- 100% các thao tác thay đổi số lượng, trạng thái, hạn mức ngân sách, cấp phát, thu hồi đều được ghi nhận vào `audit_logs` với các trường: `actor_id`, `actor_role = 'Manager'`, `action`, `target_id`, `old_value`, `new_value`, `ip_address`, `timestamp` (Tuân thủ **BR-17**).
