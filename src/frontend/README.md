# Frontend ELMS

Ứng dụng React 19, TypeScript, Vite, React Router 7, Tailwind CSS 4 và MUI 6. Chạy tại `src/frontend`:

```powershell
npm install
npm run dev
npm run build
```

Từ thư mục gốc repo, chạy `npm --prefix src/frontend install` một lần, sau đó dùng `npm run dev` hoặc `npm run build`. `package.json` ở thư mục gốc chuyển lệnh tới frontend.

## Cấu trúc đang dùng

| Thư mục | Vai trò |
| --- | --- |
| `routes/` | URL và khai báo màn hình; `/` chuyển tới quản lý license. |
| `layouts/` | Khung chung: header, sidebar, `Outlet`. |
| `pages/` | Các trang license list/detail, budget, analytics, users. |
| `sections/` | Khối giao diện theo nghiệp vụ: bảng license, drawer renewal. |
| `components/` | Thành phần giao diện dùng lại và biểu đồ. |
| `types/` | Model mà giao diện tiêu thụ. Đây chưa phải kiểu dữ liệu backend. |
| `data/mock/` | Tất cả dữ liệu mẫu của các màn hình đang hoạt động. |
| `data/repositories/` | Giao diện đọc/ghi dữ liệu và bản triển khai mẫu. `index.ts` chọn nguồn dữ liệu. |
| `data/useRepositoryData.ts` | Hook tải dữ liệu với trạng thái loading/error. |
| `data/licenses.tsx` | React context cho hai route license, gọi repository và chia sẻ dữ liệu giữa list/detail. |
| `utils/` | Định dạng tiền, ngày, tính toán và đọc CSV. |
| `theme/`, `index.css`, `portal.css` | Theme và CSS. |

Luồng hiện tại: `page/section → hook hoặc LicenseProvider → repository → mock/localStorage`. Không có lệnh gọi HTTP tới backend. `browserLicenseRepository` lấy seed từ `data/mock/licenses.ts` khi chưa có dữ liệu, rồi lưu các thay đổi vào khóa `vfast-license-records-v1` của trình duyệt. Xóa dữ liệu site trong trình duyệt sẽ trở lại seed. Users, budget và analytics được trả về bởi `mockDashboardRepository`; các mảng ví dụ nằm trong `data/mock/`.

`LicenseDetailDrawer` trong `sections/licenses` có giá trị mặc định minh họa, nhưng router hiện dùng `LicenseDetailPage`; drawer đó không tham gia luồng màn hình hiện tại. Các chữ/profile mẫu trong header, sidebar và settings vẫn là placeholder giao diện.
`components/layout/` là bộ layout khác chưa được router dùng; router đang dùng `layouts/`. `BudgetKpiSection` và các model `LicenseItem`, `UserAccount` cũng chưa nằm trong luồng màn hình đang chạy, nên không nên lấy chúng làm hợp đồng API.

Quy tắc chữ, bảng và màu trạng thái: [docs/frontend-ui-guidelines.md](../../docs/frontend-ui-guidelines.md).

## Nối backend

Hợp đồng HTTP cần được thống nhất với backend trước khi viết adapter. Bản đề xuất về endpoint, trường, kiểu, đơn vị và quy tắc dữ liệu nằm ở [docs/frontend-api-contract.md](../../docs/frontend-api-contract.md). Tên endpoint và tên trường trong tài liệu là **đề xuất**, chưa phải API đã tồn tại.

Khi backend sẵn sàng:

1. Chốt OpenAPI/JSON schema, ví dụ response thực tế, quyền truy cập, phân trang, lỗi và quy ước `null`/ngày/tiền với backend.
2. Tạo `apiLicenseRepository` và `apiDashboardRepository` trong `data/repositories/`. Mỗi adapter gọi HTTP, kiểm tra response và ánh xạ DTO backend sang model trong `types/`. Không ép kiểu trực tiếp bằng `as LicenseRecord`.
3. Chuyển binding trong `data/repositories/index.ts` sang adapter HTTP. `LicenseProvider`, các page và section tiếp tục gọi cùng interface. Cấu hình base URL/auth và xử lý 401/403, retry, loading/error theo môi trường.
4. Với license, map `GET list`, `PATCH một license`, `POST import CSV/batch` và `GET granted accounts`. Backend phải kiểm tra quyền và ghi audit. Không gửi lại toàn bộ collection để sửa một record.
5. Đối soát tổng/KPI giữa các màn: hiện các fixture được tạo độc lập nên số budget/analytics không khớp danh sách 5 license. Với API thật cần một nguồn tính chung hoặc endpoint dashboard nhất quán.

Trạng thái hiện tại chỉ là UI demo. CSV được parse ở frontend rồi lưu trong browser; ngân sách, analytics, user và profile chưa có thao tác ghi vào backend. Nút FY, currency, budget và export hiện mới là phần giao diện hoặc chưa được nối nghiệp vụ.
