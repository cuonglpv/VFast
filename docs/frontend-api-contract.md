# Đề xuất hợp đồng API cho frontend ELMS

Tài liệu này mô tả **nhu cầu của frontend hiện tại**, chưa khẳng định backend đã có các endpoint hoặc tên trường bên dưới. Chốt cùng backend bằng OpenAPI và ví dụ response trước khi tích hợp. Các model trong `src/frontend/types/` là view model, không phải DTO HTTP.

## Quy ước chung cần chốt

- ID ổn định dạng string; ngày không có giờ dùng `YYYY-MM-DD`, thời điểm hoạt động dùng ISO 8601 UTC. Frontend tự định dạng `lastActive` theo locale.
- Tiền dùng `{ amount, currency }` hoặc minor units rõ ràng; không gửi chuỗi `"$28,400"`. Nếu hỗ trợ USD/VND phải thống nhất nguồn tỷ giá và thời điểm quy đổi.
- Dữ liệu đo chưa có hoặc sync lỗi trả `null` kèm trạng thái nguồn; không biến thành `0`. Đặc biệt tránh tạo kết luận "không sử dụng" từ dữ liệu thiếu.
- Danh sách có `items`, `total`, `page`, `pageSize` (hoặc cursor), hỗ trợ search/filter/sort. Quyền và phạm vi dữ liệu do backend thực thi; `401` chưa xác thực, `403` không đủ quyền.
- Lỗi ghi trả mã lỗi và thông điệp có thể hiển thị. Cập nhật một bản ghi cần version/ETag hoặc quy tắc chống ghi đè. Mọi thay đổi nghiệp vụ phải được audit.

## License

Endpoint đề xuất: `GET /api/licenses`, `GET /api/licenses/{id}`, `PATCH /api/licenses/{id}`, `GET /api/licenses/{id}/accounts`, `POST /api/licenses/import`.

| Trường view model hiện tại | Kiểu | Ý nghĩa cần xác nhận với backend |
| --- | --- | --- |
| `id` | string | ID license/entitlement, không phải ID phần mềm hay hợp đồng. |
| `softwareName`, `publisher`, `vendor` | string | Tên phần mềm, nhà phát hành, nhà bán; có thể cần object/ID riêng. |
| `category`, `subcategory`, `description`, `licenseType`, `tiers` | string | Metadata catalog; `tiers` hiện là chuỗi hiển thị, có thể là mảng SKU/tier. |
| `complianceStatus` | enum | Hiện UI dùng `Compliant`, `At Risk`, `Over-allocated`; cần thống nhất rule tính. |
| `purchasedAmount`, `monthlyCost` | number | Giá trị tiền, hiện giả định USD; cần định nghĩa kỳ tính và currency. |
| `entitlementSeats`, `activeUsers`, `totalUsers` | number | Số quyền mua, người hoạt động, người được gán; cần chốt kỳ đo và nullable khi không có usage. |
| `expiryDate` | date | Ngày hết hạn/gia hạn; UI hiện dùng một trường cho cả hai khái niệm. |
| `contracts` | number | Số hợp đồng, có thể nên trả danh sách ID/hợp đồng để kiểm chứng. |

Ví dụ response tối thiểu sau khi thống nhất tên trường (minh họa, không phải response thật):

```json
{
  "items": [{
    "id": "lic-m365-01",
    "softwareName": "Microsoft 365",
    "publisher": "Microsoft",
    "vendor": "Microsoft Corporation",
    "category": "Productivity",
    "subcategory": "Office & Collaboration",
    "description": "Enterprise productivity suite",
    "licenseType": "Subscription",
    "tiers": "E3, E5",
    "complianceStatus": "Compliant",
    "purchasedAmount": 48000,
    "monthlyCost": 15000,
    "currency": "USD",
    "entitlementSeats": 500,
    "activeUsers": 470,
    "totalUsers": 470,
    "expiryDate": "2027-05-31",
    "contracts": 3
  }],
  "total": 1,
  "page": 1,
  "pageSize": 20
}
```

`PATCH` chỉ gửi trường được phép sửa (hiện: description, category, subcategory, monthlyCost, contracts, tiers, expiryDate). `POST import` nên nhận file CSV hoặc batch sau khi backend quyết định cách xử lý trùng lặp, validation và response từng dòng. Roster account cần `userId`, tên, email (view model hiện cho phép thiếu), tenant, tier, allocated date, usage status. Khi API phân trang, response cần `items` và `total` do backend xác nhận; không dùng activeUsers để đặt tổng số tài khoản trong roster. Hiện repository trả toàn bộ mảng, nên tìm kiếm/lọc/phân trang roster chạy phía frontend và tổng lấy từ độ dài mảng thực nhận.

Trang Detail hiển thị Assigned Users = totalUsers, Active Users = activeUsers, Available Seats = max(0, entitlementSeats − totalUsers). Lượng vượt số ghế mua hiển thị riêng nếu có; không coi các tài khoản đã gán nhưng chưa active là ghế trống.

## Users, budget, analytics

| Endpoint đề xuất | Trường frontend cần | Cần làm rõ |
| --- | --- | --- |
| `GET /api/users` | `id`, `name`, `email`, `department`, `role`, `assignedLicensesCount`, `lastActive`, `status` | Trả thời điểm `lastActiveAt`, frontend tạo chuỗi "12m ago"; avatar initials/màu tạo ở UI. |
| `GET /api/budget/dashboard?fiscalYear=...&scope=...` | `allocatedBudget`, `actualSpendMtd`, `remainingBudget`, `renewalCommitmentPercentage`, `burnRatePercentage`, `recoverableWaste`, `idleSeats`, `categoryShares`, `ledger`, `monthlySpend`, `renewals` | Kỳ ngân sách, đơn vị tiền, công thức từng KPI, phạm vi P&L/department và ngày chốt dữ liệu. |
| `GET /api/analytics/license-health?period=...&scope=...` | Annual spend, managed licenses, idle accounts, wasted spend; usage/spend theo đơn vị; series trạng thái seat theo tháng | Backend trả số thô và `asOf`, frontend định dạng nhãn, phần trăm và biểu đồ. |
| `GET /api/analytics/application-usage?period=...&scope=...` | Toàn bộ các dòng `{ id, label, value }` cho trang chi tiết Application Usage | Hiện fixture nhóm theo phòng ban như biểu đồ gốc; phải chốt định nghĩa và đơn vị Usage, kỳ đo và phạm vi trước khi nối API. |
| `GET /api/analytics/department-spend?period=...&scope=...` | Toàn bộ các dòng `{ id, label, value }` cho trang chi tiết Department Spend | `value` là số tiền thô; thống nhất USD/currency, kỳ báo cáo và phạm vi với biểu đồ top. |

Hai trang chi tiết gọi `DashboardRepository.getAnalyticsBreakdown(kind)`, dùng toàn bộ dữ liệu trả về để tìm kiếm, sắp xếp, tính tổng/tỷ trọng và phân trang. Dashboard chỉ lấy top 6; không dùng mảng top để tính tổng của trang chi tiết. Mock hiện có 6 phòng ban, nên full detail cũng có 6 dòng; không tự tạo các phòng ban hoặc quan hệ ứng dụng–phòng ban khác. Nếu API chỉ trả một trang, repository phải chuyển sang truy vấn tìm kiếm/sắp xếp/phân trang phía server và lấy `total` cùng các tổng aggregate do backend trả về, không coi tổng một trang là tổng toàn bộ.

Các fixture budget/analytics hiện chứa chuỗi đã format và số liệu độc lập. Ví dụ 5 license trong inventory nhưng analytics hiển thị 1.284; budget có 4 renewal nhưng trước đây badge ghi 6. Khi tích hợp API, tính KPI từ cùng bộ dữ liệu hoặc một endpoint tổng hợp đáng tin cậy. Đừng dùng fixture làm định nghĩa nghiệp vụ.
