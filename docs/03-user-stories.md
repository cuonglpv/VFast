# Tài liệu Đặc tả Câu chuyện Người dùng (User Stories Specification)
## Dự án: VFast – Enterprise License Management System (ELMS)
### Căn cứ: Bản Đặc tả Yêu cầu Phần mềm (SRS v1.0)

---

## 1. Phương pháp luận & Tiêu chí Chuẩn hóa INVEST

Toàn bộ 25 User Stories của hệ thống VFast ELMS được xây dựng và thẩm định dựa trên bộ nguyên lý **INVEST** của kỹ nghệ phát triển phần mềm linh hoạt:

| Tiêu chuẩn INVEST | Ý nghĩa kiểm định chất lượng | Cách thức hiện thực hóa trong VFast ELMS |
| :--- | :--- | :--- |
| **I – Independent** *(Độc lập)* | Mỗi story có thể được lập trình, kiểm thử và chuyển giao riêng lẻ mà không bị phụ thuộc cứng vào story khác. | Các luồng nạp dữ liệu của Staff (nhập expense) và Employee (gửi request) được xử lý độc lập qua bảng trạng thái trung gian. |
| **N – Negotiable** *(Có thể thương lượng)* | Nắm bắt bản chất mục tiêu nghiệp vụ, không trói buộc cứng vào giải pháp kỹ thuật chi tiết. | Tập trung vào quy tắc kinh doanh và kết quả cần đạt, cho phép đội ngũ kỹ thuật lựa chọn công nghệ phù hợp trong sprint. |
| **V – Valuable** *(Có giá trị rõ ràng)* | Mang lại giá trị trực tiếp cho người dùng hoặc giúp tổ chức tiết kiệm chi phí, kiểm soát tuân thủ. | Mỗi story đều phục vụ trực tiếp một trong 3 trụ cột: Quản lý bản quyền, Kiểm soát ngân sách hoặc Tối ưu hóa chi phí. |
| **E – Estimable** *(Có thể ước lượng)* | Đủ rõ ràng để đội ngũ phát triển ước tính độ phức tạp và thời gian thực hiện. | Đi kèm các trường dữ liệu bắt buộc, ràng buộc nghiệp vụ và kịch bản nghiệm thu cụ thể. |
| **S – Small** *(Kích thước phù hợp)* | Đủ nhỏ gọn để hoàn thành trong 1 đến 2 ngày làm việc của lập trình viên. | Tách biệt giữa các thao tác nhập tay đơn lẻ (P0) và tính năng import hàng loạt từ file Excel/CSV (P1). |
| **T – Testable** *(Có thể kiểm thử)* | Có tiêu chuẩn nghiệm thu rõ ràng để QA/QC và người dùng cuối xác nhận tính đúng đắn. | 100% User Stories có kịch bản nghiệm thu chuẩn **Given - When - Then** (Gherkin format). |

---

## 2. Bảng Phân bổ 25 User Stories theo 3 Role & Mức độ Ưu tiên (P0 / P1)

Theo chuẩn hóa tại **Mục 6 của bản SRS v1.0**, toàn bộ 25 User Stories được chia thành 3 nhóm người dùng:

```mermaid
pie title Phân bổ 25 User Stories theo Vai trò
    "Manager (14 Stories)" : 14
    "Staff (6 Stories)" : 6
    "Employee (5 Stories)" : 5
```

| Nhóm Vai trò | Mã Story | Tên User Story | Độ ưu tiên | Liên kết Use Cases |
| :--- | :--- | :--- | :---: | :---: |
| **Manager** | **US-M01** | Quản lý danh mục sản phẩm phần mềm chuẩn | **P0** | UC01, UC02 |
| | **US-M02** | Đăng ký & quản lý Entitlement (SaaS & Perpetual) | **P0** | UC02, UC03 |
| | **US-M03** | Quản lý hợp đồng pháp lý mua sắm license | P1 | UC04 |
| | **US-M04** | Xem xét danh sách License Request từ nhân viên | **P0** | UC07 |
| | **US-M05** | Phê duyệt hoặc từ chối License Request | **P0** | UC08 |
| | **US-M06** | Cấp phát (Assign) license cho nhân viên | **P0** | UC09, UC11 |
| | **US-M07** | Thu hồi (Revoke) license để giải phóng dung lượng | **P0** | UC10 |
| | **US-M08** | Thiết lập và quản lý ngân sách phần mềm | **P0** | UC12, UC14 |
| | **US-M09** | Rà soát và quản lý các bản ghi chi phí thực tế | **P0** | UC13, UC14 |
| | **US-M10** | Giám sát tuân thủ bản quyền và phát hiện Overuse | **P0** | UC05, UC21, UC25 |
| | **US-M11** | Theo dõi hạn hết hạn hợp đồng và kế hoạch gia hạn | **P0** | UC15, UC16, UC17, UC18 |
| | **US-M12** | Đánh giá các đề xuất tối ưu hóa chi phí | P1 | UC19, UC20, UC22 |
| | **US-M13** | Xem Dashboard tổng quan về tài sản và tài chính | **P0** | UC23, UC24, UC25, UC26 |
| | **US-M14** | Quản trị tài khoản người dùng và phân quyền 3 role | **P0** | UC27, UC28, UC29, UC30 |
| **Staff** | **US-S01** | Nhập dữ liệu mức độ sử dụng license thực tế | **P0** | UC29, UC31 |
| | **US-S02** | Import dữ liệu License Usage từ file CSV/Excel | P1 | UC32 |
| | **US-S03** | Ghi nhận các khoản chi phí phát sinh thực tế | **P0** | UC33, UC13 |
| | **US-S04** | Import dữ liệu Expense từ file CSV/Excel | P1 | UC34 |
| | **US-S05** | Tải lên hóa đơn và chứng từ thanh toán đính kèm | P1 | UC35 |
| | **US-S06** | Xem và kiểm tra lại toàn bộ dữ liệu đã nạp | **P0** | UC26, UC36 |
| **Employee** | **US-U01** | Xem danh mục các phần mềm khả dụng | **P0** | UC29, UC37 |
| | **US-U02** | Gửi yêu cầu xin cấp phát license mới | **P0** | UC06 |
| | **US-U03** | Theo dõi trạng thái tiến độ xử lý yêu cầu cá nhân | **P0** | UC38 |
| | **US-U04** | Xem danh sách các license đang được cấp phát | **P0** | UC39, UC11 |
| | **US-U05** | Xem thời hạn và thông tin hết hạn license cá nhân | P1 | UC39 |

Cột "Liên kết Use Cases" khớp với ma trận truy vết ở Mục 4.

**Phạm vi P0 của các story liên kết cả use case P1 (D3 tại [MVP](01-MVP.md)):** `US-M01` giao ở P0 phần `UC01`; `US-M02` giao ở P0 phần `UC03`, Vendor theo D1; `US-M10` giao ở P0 phần `UC05`, `UC21`; `US-M11` giao ở P0 phần `UC15`, `UC18`; `US-M13` giao ở P0 phần `UC23`, `UC24`; `US-S06` giao ở P0 phần `UC36`. Các use case P1 còn lại (`UC02`, `UC16`, `UC17`, `UC25`, `UC26`) giao ở P1.

---

## 3. Đặc tả Chi tiết Từng User Story (Given - When - Then)

### Kịch bản chung về phân quyền và lỗi (áp dụng cho mọi story)

Các kịch bản dưới đây là tiêu chí chấp nhận của **mọi** story, kiểm thử trên từng API mà story sử dụng. Từng story bên dưới chỉ ghi thêm kịch bản riêng của nó.

- **Kịch bản C1: Chưa đăng nhập**
  - *Given:* Request không có phiên hợp lệ.
  - *When:* Request gọi API của story.
  - *Then:* Hệ thống trả về `401` và không thay đổi dữ liệu.
- **Kịch bản C2: Sai vai trò**
  - *Given:* Người dùng có role không được cấp quyền theo ma trận phân quyền trong README, ví dụ Employee gọi API duyệt request, hoặc Staff sửa Entitlement hay Budget (BR-09).
  - *When:* Người dùng gọi API đó, kể cả khi gọi trực tiếp không qua giao diện.
  - *Then:* Hệ thống trả về `403`, không thay đổi dữ liệu và không dựa vào việc ẩn nút trên giao diện.
- **Kịch bản C3: Truy cập dữ liệu của người khác**
  - *Given:* Employee A và Employee B đều có yêu cầu và license; Staff A và Staff B đều có dữ liệu đã nạp.
  - *When:* A truy cập bản ghi của B bằng mã bản ghi.
  - *Then:* Hệ thống trả về `404` và không tiết lộ bản ghi có tồn tại hay không (BR-08).
- **Kịch bản C4: Tài khoản bị vô hiệu hóa**
  - *Given:* Tài khoản đã bị vô hiệu hóa trong lúc còn phiên đăng nhập.
  - *When:* Người dùng gửi request kế tiếp.
  - *Then:* Hệ thống từ chối request (BR-18).
- **Kịch bản C5: Dữ liệu không hợp lệ**
  - *Given:* Dữ liệu gửi lên thiếu trường bắt buộc hoặc sai định dạng.
  - *When:* Người dùng gửi form hoặc gọi API.
  - *Then:* Hệ thống trả về `422` kèm lỗi theo từng trường và không lưu dữ liệu.

---

### Nhóm 1: User Stories cho vai trò MANAGER (14 Stories)

#### US-M01: Quản lý Danh mục Sản phẩm Phần mềm Chuẩn
- **Mã:** `US-M01` | **Độ ưu tiên:** `P0`
- **User Story:**
  > *As a Manager, I want to manage software products, so that the company maintains a centralized software catalog.*
  > *(Là một Manager, tôi muốn quản lý danh mục sản phẩm phần mềm chuẩn hóa, để công ty duy trì một danh mục phần mềm tập trung duy nhất).*
- **Tiêu chí chấp nhận (Acceptance Criteria):**
  - **Kịch bản 1: Tạo mới phần mềm thành công**
    - *Given:* Manager đang ở màn hình Quản lý danh mục phần mềm (`UC01`).
    - *When:* Nhập Tên phần mềm = "Figma", Vendor = "Figma Inc", Danh mục = "Design", Loại license = "SaaS Subscription", Trạng thái = "Active" và nhấn Lưu.
    - *Then:* Bản ghi phần mềm được lưu thành công với mã định danh duy nhất và hiển thị trong danh mục chuẩn.
  - **Kịch bản 2: Báo lỗi khi tạo phần mềm trùng lặp**
    - *Given:* Sản phẩm "Figma" từ nhà cung cấp "Figma Inc" đã tồn tại trong cơ sở dữ liệu.
    - *When:* Manager cố tình tạo một sản phẩm mới có cùng tên và cùng vendor trên.
    - *Then:* Hệ thống từ chối lưu và hiển thị thông báo lỗi: *"Sản phẩm phần mềm đã tồn tại trong danh mục."*

#### US-M02: Đăng ký & Quản lý Entitlement (SaaS & Perpetual)
- **Mã:** `US-M02` | **Độ ưu tiên:** `P0`
- **User Story:**
  > *As a Manager, I want to register SaaS and Perpetual entitlements, so that I can track company-owned licenses.*
  > *(Là một Manager, tôi muốn đăng ký và quản lý các khoản quyền sử dụng cả SaaS và Perpetual, để theo dõi chính xác tài sản bản quyền mà công ty đang sở hữu).*
- **Tiêu chí chấp nhận (theo Mục 6.4 SRS):**
  - **Kịch bản 1: Khai báo gói thuê bao SaaS hợp lệ**
    - *Given:* Manager có quyền tạo Entitlement.
    - *When:* Manager tạo Entitlement SaaS với Tên = "Microsoft 365 E3", Số lượng = 100 seats, Chu kỳ = Hằng năm, Ngày bắt đầu = 01/01/2026, Ngày kết thúc = 31/12/2026.
    - *Then:* Hệ thống lưu trữ thông tin thuê bao, khởi tạo `purchased_quantity = 100`, `available_quantity = 100`.
  - **Kịch bản 2: Khai báo bản quyền vĩnh viễn Perpetual**
    - *Given:* Manager chọn phần mềm "AutoCAD 2026".
    - *When:* Tạo Entitlement Perpetual với Số lượng = 10 licenses, Ngày mua = 15/01/2026, Hạn bảo trì = 15/01/2027.
    - *Then:* Hệ thống lưu thông tin license vĩnh viễn và lưu thông tin bảo trì ở trường riêng biệt (BR-12), không tự động gán ngày hết hạn bản quyền vĩnh viễn.
  - **Kịch bản 3: Kiểm tra trường bắt buộc và ghi Audit Log**
    - *Given:* Manager đang tạo Entitlement SaaS.
    - *When:* Manager để trống trường Ngày hết hạn và nhấn Lưu.
    - *Then:* Hệ thống từ chối lưu và báo lỗi bắt buộc nhập ngày hết hạn; khi Manager nhập ngày hợp lệ và lưu thành công, thao tác được ghi vào Audit Log.

#### US-M03: Quản lý Hợp đồng Pháp lý Bản quyền
- **Mã:** `US-M03` | **Độ ưu tiên:** `P1`
- **User Story:**
  > *As a Manager, I want to manage contracts, so that I can track legal agreements and license terms.*
  > *(Là một Manager, tôi muốn quản lý hợp đồng, để theo dõi các thỏa thuận pháp lý và điều khoản cấp phép).*
- **Tiêu chí chấp nhận:**
  - *Given:* Manager có tệp PDF hợp đồng mua sắm phần mềm Oracle.
  - *When:* Tạo bản ghi Contract mới, nhập Số hợp đồng, Giá trị, Ngày ký và đính kèm file PDF.
  - *Then:* Hợp đồng được lưu an toàn và liên kết thành công với các Entitlement liên quan (`UC04`).

#### US-M04: Xem xét Danh sách Yêu cầu Cấp License
- **Mã:** `US-M04` | **Độ ưu tiên:** `P0`
- **User Story:**
  > *As a Manager, I want to review license requests, so that I can understand employees' software needs.*
  > *(Là một Manager, tôi muốn xem xét các yêu cầu xin cấp license, để hiểu rõ nhu cầu phần mềm của nhân viên).*
- **Tiêu chí chấp nhận:**
  - *Given:* Có các yêu cầu cấp license đang ở trạng thái `Pending` trong hệ thống.
  - *When:* Manager truy cập trang Quản lý yêu cầu (`UC07`).
  - *Then:* Hiển thị đầy đủ thông tin: Mã REQ, Tên nhân viên, Phòng ban, Phần mềm xin cấp, Lý do sử dụng, Thời điểm gửi và số seat còn trống trong kho.

#### US-M05: Phê duyệt hoặc Từ chối License Request
- **Mã:** `US-M05` | **Độ ưu tiên:** `P0`
- **User Story:**
  > *As a Manager, I want to approve or reject requests, so that license distribution follows company policy.*
  > *(Là một Manager, tôi muốn phê duyệt hoặc từ chối các yêu cầu, để việc phân bổ license tuân thủ đúng chính sách công ty).*
- **Tiêu chí chấp nhận (theo Mục 6.4 SRS):**
  - **Kịch bản 1: Phê duyệt yêu cầu đang chờ**
    - *Given:* Yêu cầu đang ở trạng thái `Pending`.
    - *When:* Manager nhấn nút "Phê duyệt (Approve)".
    - *Then:* Trạng thái yêu cầu đổi thành `Approved`, lưu người duyệt, thời điểm duyệt và gửi thông báo cho Employee.
  - **Kịch bản 2: Từ chối yêu cầu bắt buộc có lý do**
    - *Given:* Yêu cầu đang ở trạng thái `Pending`.
    - *When:* Manager nhấn nút "Từ chối (Reject)".
    - *Then:* Hệ thống yêu cầu bắt buộc phải nhập lý do từ chối; lưu trạng thái `Rejected` kèm lý do giải trình.
  - **Kịch bản 3: Chặn phê duyệt lại yêu cầu đã xử lý**
    - *Given:* Yêu cầu đã ở trạng thái `Approved` hoặc `Rejected`.
    - *When:* Người dùng cố gắng thực hiện lại thao tác duyệt.
    - *Then:* Hệ thống chặn lại và báo lỗi: *"Yêu cầu đã được xử lý trước đó, không thể phê duyệt lại."* (BR-19).

#### US-M06: Cấp phát (Assign) License cho Nhân viên
- **Mã:** `US-M06` | **Độ ưu tiên:** `P0`
- **User Story:**
  > *As a Manager, I want to assign licenses, so that approved requests can be fulfilled.*
  > *(Là một Manager, tôi muốn cấp phát license, để hoàn tất các yêu cầu đã được phê duyệt).*
- **Tiêu chí chấp nhận (theo Mục 6.4 SRS):**
  - **Kịch bản 1: Cấp phát thành công khi kho còn bản quyền**
    - *Given:* Tồn tại Entitlement hợp lệ có $\text{Available Quantity} > 0$.
    - *When:* Manager thực hiện cấp phát license cho nhân viên đã được duyệt.
    - *Then:* Tạo bản ghi `LicenseAssignment`, tăng `allocated_quantity` lên 1 đơn vị (`available_quantity` tính ra giảm 1) và chuyển yêu cầu liên quan sang `Fulfilled`.
  - **Kịch bản 2: Ngăn chặn cấp phát vượt quá số lượng mua**
    - *Given:* Entitlement có $\text{Available Quantity} = 0$.
    - *When:* Manager cố gắng cấp phát thêm một seat cho nhân viên.
    - *Then:* Hệ thống từ chối giao dịch, hiển thị thông báo lỗi: *"Số lượng phân bổ không được vượt quá số lượng bản quyền khả dụng."* (BR-05).
  - **Kịch bản 3: Hai Manager cùng cấp seat cuối cùng**
    - *Given:* Entitlement chỉ còn $\text{Available Quantity} = 1$.
    - *When:* Hai Manager gửi yêu cầu cấp phát cho hai nhân viên khác nhau cùng lúc.
    - *Then:* Chỉ một giao dịch thành công; giao dịch còn lại bị từ chối theo BR-05 và `allocated_quantity` không vượt `purchased_quantity`.
  - **Kịch bản 4: Chặn cấp trùng**
    - *Given:* Nhân viên đang có assignment `Active` cho phần mềm đó, hoặc yêu cầu đã ở trạng thái `Fulfilled`.
    - *When:* Manager cấp phát thêm cho nhân viên đó hoặc theo yêu cầu đó.
    - *Then:* Hệ thống từ chối giao dịch, không thay đổi số lượng seat.

#### US-M07: Thu hồi (Revoke) License
- **Mã:** `US-M07` | **Độ ưu tiên:** `P0`
- **User Story:**
  > *As a Manager, I want to revoke license assignments, so that unused licenses can be released.*
  > *(Là một Manager, tôi muốn thu hồi các lượt gán license, để giải phóng các bản quyền không còn sử dụng về kho).*
- **Tiêu chí chấp nhận:**
  - *Given:* Nhân viên A đang được gán 1 seat phần mềm Slack Pro.
  - *When:* Manager nhấn "Thu hồi (Revoke)" và nhập lý do = "Nhân viên chuyển dự án".
  - *Then:* Lượt gán chuyển sang trạng thái `Revoked`, dung lượng khả dụng của kho tăng thêm 1 đơn vị, lịch sử gán vẫn được lưu vết đầy đủ trong hệ thống (BR-13). Nếu lượt gán đã bị thu hồi trước đó, hệ thống báo lỗi và không hoàn trả seat lần hai.

#### US-M08: Thiết lập & Quản lý Ngân sách Phần mềm
- **Mã:** `US-M08` | **Độ ưu tiên:** `P0`
- **User Story:**
  > *As a Manager, I want to manage budgets, so that software spending can be controlled.*
  > *(Là một Manager, tôi muốn quản lý ngân sách, để kiểm soát chặt chẽ các khoản chi tiêu phần mềm).*
- **Tiêu chí chấp nhận:**
  - *Given:* Manager đang ở phân hệ Quản lý Ngân sách (`UC12`).
  - *When:* Thiết lập Ngân sách năm 2026 cho Phòng Kỹ thuật = 500.000.000 VNĐ.
  - *Then:* Hệ thống lưu hạn mức ngân sách và tự động liên kết với các khoản chi phí phát sinh thực tế.

#### US-M09: Rà soát & Quản lý Chi phí Thực tế (Expense)
- **Mã:** `US-M09` | **Độ ưu tiên:** `P0`
- **User Story:**
  > *As a Manager, I want to review expense records, so that I can monitor software costs.*
  > *(Là một Manager, tôi muốn rà soát các bản ghi chi phí, để theo dõi sát sao tình hình chi tiêu phần mềm).*
- **Tiêu chí chấp nhận:**
  - *Given:* Staff đã nạp các khoản chi phí mua sắm và gia hạn phần mềm.
  - *When:* Manager mở danh sách chi phí (`UC13`).
  - *Then:* Hiển thị chi tiết số tiền, ngày thanh toán, mã hóa đơn và phòng ban thụ hưởng; hỗ trợ lọc theo phần mềm hoặc vendor.

#### US-M10: Giám sát Tuân thủ Bản quyền & Phát hiện Overuse
- **Mã:** `US-M10` | **Độ ưu tiên:** `P0`
- **User Story:**
  > *As a Manager, I want to monitor license compliance, so that I can identify overuse risks.*
  > *(Là một Manager, tôi muốn giám sát tính tuân thủ bản quyền, để nhận diện kịp thời các nguy cơ sử dụng vượt quyền).*
- **Tiêu chí chấp nhận:**
  - *Given:* Gói phần mềm mua 50 seat, nhưng dữ liệu ghi nhận có 53 người đang sử dụng.
  - *When:* Manager truy cập trang Giám sát Tuân thủ (`UC05`, `UC21`).
  - *Then:* Hệ thống gắn nhãn cảnh báo đỏ `Overused: +3 seats`, cảnh báo rủi ro vi phạm hợp đồng để Manager xử lý mua thêm hoặc thu hồi.

#### US-M11: Theo dõi Hết hạn Hợp đồng & Kế hoạch Gia hạn
- **Mã:** `US-M11` | **Độ ưu tiên:** `P0`
- **User Story:**
  > *As a Manager, I want to monitor license expiration, so that I can prepare renewal decisions.*
  > *(Là một Manager, tôi muốn theo dõi ngày hết hạn của license, để chủ động chuẩn bị các quyết định gia hạn kịp thời).*
- **Tiêu chí chấp nhận:**
  - *Given:* Hợp đồng thuê bao Zoom Pro sẽ hết hạn sau 20 ngày nữa.
  - *When:* Manager đăng nhập hệ thống.
  - *Then:* Hệ thống xếp hợp đồng này vào nhóm cảnh báo "Sắp đến hạn (Upcoming)" trên Dashboard để chuẩn bị gia hạn (`UC15`).

#### US-M12: Xem & Đánh giá Đề xuất Tối ưu hóa Chi phí
- **Mã:** `US-M12` | **Độ ưu tiên:** `P1`
- **User Story:**
  > *As a Manager, I want to review optimization recommendations, so that I can identify cost-saving opportunities.*
  > *(Là một Manager, tôi muốn xem xét các đề xuất tối ưu hóa, để phát hiện các cơ hội cắt giảm lãng phí ngân sách).*
- **Tiêu chí chấp nhận:**
  - *Given:* Hệ thống phát hiện 15 seat phần mềm không phát sinh hoạt động sử dụng trong hơn 60 ngày qua.
  - *When:* Manager mở trang Optimization (`UC22`).
  - *Then:* Hệ thống hiển thị đề xuất: *"Xem xét thu hồi 15 seat không hoạt động để tiết kiệm chi phí ước tính hằng tháng."*

#### US-M13: Xem Dashboard Điều hành Tổng quan
- **Mã:** `US-M13` | **Độ ưu tiên:** `P0`
- **User Story:**
  > *As a Manager, I want to view management dashboards, so that I can understand the overall license and budget situation.*
  > *(Là một Manager, tôi muốn xem bảng điều khiển quản trị, để nắm bắt toàn diện bức tranh bản quyền và ngân sách).*
- **Tiêu chí chấp nhận:**
  - *Given:* Manager truy cập trang chủ hệ thống (`UC23`, `UC24`).
  - *When:* Tải Dashboard.
  - *Then:* Hiển thị đầy đủ các chỉ số: Tổng số phần mềm, Tỷ lệ gán seat, Tỷ lệ giải ngân ngân sách (`Budget Utilization`), Cảnh báo tuân thủ và Hợp đồng sắp hết hạn.

#### US-M14: Quản trị Người dùng & Phân quyền 3 Role
- **Mã:** `US-M14` | **Độ ưu tiên:** `P0`
- **User Story:**
  > *As a Manager, I want to manage users and roles, so that system access follows company policies.*
  > *(Là một Manager, tôi muốn quản lý người dùng và phân quyền, để việc truy cập hệ thống tuân thủ chính sách bảo mật).*
- **Tiêu chí chấp nhận:**
  - *Given:* Manager đang ở màn hình Quản trị Người dùng (`UC27`, `UC28`).
  - *When:* Gán vai trò `Staff` cho nhân viên IT mới.
  - *Then:* Tài khoản đó được cấp quyền nạp Usage và Expense, không có quyền duyệt request hay chỉnh sửa Entitlement.
  - **Vô hiệu hóa tài khoản (BR-18):**
    - *Given:* Người dùng đang có phiên đăng nhập hợp lệ.
    - *When:* Manager vô hiệu hóa tài khoản đó.
    - *Then:* Request kế tiếp của người dùng bị từ chối, phiên bị thu hồi và thao tác được ghi Audit Log.

---

### Nhóm 2: User Stories cho vai trò STAFF (6 Stories)

#### US-S01: Nhập Dữ liệu Mức độ Sử dụng License Thực tế
- **Mã:** `US-S01` | **Độ ưu tiên:** `P0`
- **User Story:**
  > *As a Staff member, I want to input license usage data, so that actual software consumption can be monitored.*
  > *(Là một Staff, tôi muốn nhập dữ liệu sử dụng license, để mức độ tiêu thụ phần mềm thực tế được theo dõi chính xác).*
- **Tiêu chí chấp nhận:**
  - *Given:* Staff đang ở màn hình Nhập liệu Usage (`UC31`).
  - *When:* Chọn nhân viên, phần mềm, nhập Ngày hoạt động gần nhất, Mức độ sử dụng và nhấn Lưu.
  - *Then:* Bản ghi usage được tạo thành công, gắn tự động `created_by = Staff_ID` và dấu thời gian hệ thống.

#### US-S02: Import Dữ liệu Usage từ File CSV/Excel
- **Mã:** `US-S02` | **Độ ưu tiên:** `P1`
- **User Story:**
  > *As a Staff member, I want to import usage data from CSV/Excel, so that large amounts of usage information can be updated efficiently.*
  > *(Là một Staff, tôi muốn nạp dữ liệu usage từ file CSV/Excel, để cập nhật nhanh chóng khối lượng lớn thông tin sử dụng).*
- **Tiêu chí chấp nhận:**
  - *Given:* File Excel chứa dữ liệu hoạt động hàng tháng kết xuất từ cổng quản trị SSO.
  - *When:* Staff tải file lên hệ thống (`UC32`).
  - *Then:* Hệ thống xác thực từng dòng, báo cáo số dòng hợp lệ và nạp toàn bộ vào cơ sở dữ liệu.
  - **Kịch bản lỗi: File có dòng không hợp lệ**
    - *Given:* File import có ít nhất một dòng sai, ví dụ nhân viên không tồn tại hoặc ngày sai định dạng.
    - *When:* Staff tải file lên hệ thống.
    - *Then:* Hệ thống không nạp dòng nào và trả về danh sách lỗi kèm số dòng và lý do (D16).

#### US-S03: Ghi nhận Bản ghi Chi phí Thực tế (Expense)
- **Mã:** `US-S03` | **Độ ưu tiên:** `P0`
- **User Story:**
  > *As a Staff member, I want to input expense records, so that software-related costs are recorded.*
  > *(Là một Staff, tôi muốn ghi nhận các bản ghi chi phí, để các khoản chi tiêu phần mềm được ghi nhận đầy đủ).*
- **Tiêu chí chấp nhận:**
  - *Given:* Doanh nghiệp vừa thanh toán chi phí gia hạn phần mềm GitHub Enterprise.
  - *When:* Staff nhập Số tiền = 20.000.000 VNĐ, Ngày thanh toán = 05/03/2026, Mã hóa đơn = "HD-8812" và nhấn Lưu (`UC33`).
  - *Then:* Bản ghi chi phí được lưu thành công và tự động tính vào chi phí thực tế (`Actual Spending`) của kỳ.

#### US-S04: Import Dữ liệu Expense từ File CSV/Excel
- **Mã:** `US-S04` | **Độ ưu tiên:** `P1`
- **User Story:**
  > *As a Staff member, I want to import expense data from CSV/Excel, so that financial records can be updated efficiently.*
  > *(Là một Staff, tôi muốn import dữ liệu chi phí từ bảng tính, để cập nhật nhanh các chứng từ tài chính).*
- **Tiêu chí chấp nhận:**
  - **Kịch bản 1: Import thành công**
    - *Given:* Staff có file CSV/Excel theo mẫu, mỗi dòng có Số tiền, Tiền tệ, Ngày thanh toán, Phần mềm, Phòng ban và Số hóa đơn.
    - *When:* Staff tải file lên hệ thống (`UC34`).
    - *Then:* Hệ thống xác thực từng dòng theo BR-10, nạp toàn bộ các dòng, gắn `created_by = Staff_ID` và báo số bản ghi đã nạp; các khoản này được tính vào `Actual Spending`.
  - **Kịch bản 2: File có dòng không hợp lệ**
    - *Given:* File có ít nhất một dòng thiếu tiền tệ, có số tiền nhỏ hơn hoặc bằng 0, hoặc thiếu ngày thanh toán.
    - *When:* Staff tải file lên hệ thống.
    - *Then:* Hệ thống không nạp dòng nào và trả về danh sách lỗi kèm số dòng và lý do (D16).
  - **Kịch bản 3: Từ chối người không có quyền**
    - *Given:* Người dùng đăng nhập với role `Employee`.
    - *When:* Người dùng gọi API import chi phí.
    - *Then:* Hệ thống trả về `403` và không nạp dữ liệu.

#### US-S05: Tải lên Hóa đơn và Tài liệu Chứng minh Đính kèm
- **Mã:** `US-S05` | **Độ ưu tiên:** `P1`
- **User Story:**
  > *As a Staff member, I want to upload invoices and supporting documents, so that expense records have corresponding evidence.*
  > *(Là một Staff, tôi muốn tải lên hóa đơn và chứng từ hỗ trợ, để các khoản chi phí đều có bằng chứng đối soát pháp lý).*
- **Tiêu chí chấp nhận:**
  - *Given:* Staff đang tạo bản ghi chi phí phần mềm AWS.
  - *When:* Staff tải lên tệp PDF hóa đơn điện tử VAT (`UC35`).
  - *Then:* Tệp được lưu trữ an toàn trong hệ thống và liên kết chặt chẽ với bản ghi chi phí tương ứng.

#### US-S06: Xem lại Toàn bộ Dữ liệu Đã nạp vào Hệ thống
- **Mã:** `US-S06` | **Độ ưu tiên:** `P0`
- **User Story:**
  > *As a Staff member, I want to view submitted data, so that I can verify information I have entered.*
  > *(Là một Staff, tôi muốn xem lại các dữ liệu đã nạp, để kiểm tra và xác nhận tính chính xác của thông tin do mình đưa vào).*
- **Tiêu chí chấp nhận:**
  - *Given:* Staff đã nạp nhiều bản ghi usage và expense trong ngày.
  - *When:* Mở màn hình "Dữ liệu đã nạp (Submitted Data)" (`UC36`).
  - *Then:* Hiển thị danh sách các bản ghi do chính mình tạo ra kèm trạng thái và thời gian nạp.

---

### Nhóm 3: User Stories cho vai trò EMPLOYEE (5 Stories)

#### US-U01: Xem Danh mục Phần mềm Khả dụng
- **Mã:** `US-U01` | **Độ ưu tiên:** `P0`
- **User Story:**
  > *As an Employee, I want to view available software, so that I can identify software relevant to my work.*
  > *(Là một Employee, tôi muốn xem danh sách các phần mềm khả dụng, để nhận biết các công cụ phù hợp với công việc).*
- **Tiêu chí chấp nhận:**
  - *Given:* Employee đăng nhập vào hệ thống.
  - *When:* Mở danh mục phần mềm (`UC37`).
  - *Then:* Hệ thống chỉ hiển thị tên phần mềm, nhà phát hành, mô tả và nút gửi yêu cầu; **tuyệt đối không hiển thị giá tiền hoặc license key**.

#### US-U02: Gửi Yêu cầu Cấp License Mới
- **Mã:** `US-U02` | **Độ ưu tiên:** `P0`
- **User Story:**
  > *As an Employee, I want to submit a license request, so that I can request required software access.*
  > *(Là một Employee, tôi muốn gửi yêu cầu cấp license, để được cấp quyền sử dụng phần mềm khi có nhu cầu).*
- **Tiêu chí chấp nhận:**
  - *Given:* Employee chọn phần mềm "Postman Professional" từ danh mục.
  - *When:* Nhập lý do = "Thực hiện kiểm thử API cho dự án Mobile App" và nhấn Gửi yêu cầu (`UC06`).
  - *Then:* Yêu cầu được ghi nhận ở trạng thái `Pending`, sinh mã REQ và chuyển đến hàng đợi của Manager.

#### US-U03: Theo dõi Trạng thái Yêu cầu Cá nhân
- **Mã:** `US-U03` | **Độ ưu tiên:** `P0`
- **User Story:**
  > *As an Employee, I want to view my request status, so that I know whether my request has been approved or rejected.*
  > *(Là một Employee, tôi muốn theo dõi trạng thái yêu cầu của mình, để biết yêu cầu đã được duyệt hay bị từ chối).*
- **Tiêu chí chấp nhận:**
  - *Given:* Yêu cầu cấp license vừa được Manager phê duyệt hoặc từ chối.
  - *When:* Employee mở trang "Yêu cầu của tôi" (`UC38`).
  - *Then:* Hiển thị trạng thái tương ứng (`Approved`, `Fulfilled` khi đã được cấp, hoặc `Rejected` kèm lý do giải trình).

#### US-U04: Xem Danh sách License Đang được Cấp phát
- **Mã:** `US-U04` | **Độ ưu tiên:** `P0`
- **User Story:**
  > *As an Employee, I want to view my assigned licenses, so that I know which software I am authorized to use.*
  > *(Là một Employee, tôi muốn xem danh sách các license đang được cấp cho bản thân, để biết mình được phép sử dụng những phần mềm nào).*
- **Tiêu chí chấp nhận:**
  - *Given:* Employee đã được Manager cấp phát 2 license: Microsoft 365 và JetBrains.
  - *When:* Employee mở trang "License của tôi" (`UC39`, `UC11`).
  - *Then:* Hiển thị đầy đủ danh sách 2 phần mềm trên kèm ngày bắt đầu được cấp, không hiển thị license key hoặc giá.
  - **Kịch bản riêng tư:**
    - *Given:* Employee B cũng được cấp license.
    - *When:* Employee A mở trang "License của tôi".
    - *Then:* Danh sách chỉ có license của A; license của B không xuất hiện (BR-08).

#### US-U05: Xem Thời hạn Bản quyền Cá nhân
- **Mã:** `US-U05` | **Độ ưu tiên:** `P1`
- **User Story:**
  > *As an Employee, I want to view license expiration information, so that I know when my assigned license is due to expire.*
  > *(Là một Employee, tôi muốn xem thông tin ngày hết hạn của license được cấp, để chủ động kế hoạch công việc trước khi hết hạn).*
- **Tiêu chí chấp nhận:**
  - *Given:* License SaaS của nhân viên có thời hạn đến 31/12/2026.
  - *When:* Employee xem chi tiết license cá nhân (`UC39`).
  - *Then:* Hiển thị rõ ràng ngày hết hạn của bản quyền được cấp.

---

## 4. Ma trận Ánh xạ Use Cases và User Stories (Traceability Matrix)

Bảng ma trận truy xuất nguồn gốc đảm bảo **100% Use Cases (UC01 đến UC39)** được bao phủ hoàn chỉnh bởi **25 User Stories**:

| Use Case ID | Tên Use Case trong SRS v1.0 | User Stories liên kết | Tác nhân chính | Độ ưu tiên |
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
