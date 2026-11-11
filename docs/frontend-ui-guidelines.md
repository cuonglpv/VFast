# Quy tắc hiển thị frontend ELMS

## Chữ

Inter là font chung. Cỡ chữ được khai báo trong `src/frontend/index.css` và dùng lại trong `src/frontend/portal.css` cùng MUI theme:

| Cấp | Cỡ / chiều cao dòng | Dùng cho |
| --- | --- | --- |
| Page | 24 / 32px, 700 | Tiêu đề trang |
| Section | 18 / 26px, 600 | Tiêu đề section, card |
| Body | 14 / 22px | Nội dung, nút, bộ lọc |
| Label | 12 / 18px | Nội dung ô bảng, chú thích, badge |
| Table header | 11 / 16px, 600 | Tiêu đề cột viết hoa |
| KPI | 28 / 36px, 700 | Số KPI chính |

Số tiền và số lượng dùng `font-variant-numeric: tabular-nums`. Mã định danh có thể dùng monospace; email, thời gian và giá trị nghiệp vụ dùng Inter.

## Điều hướng chi tiết license

Nhấn dòng hoặc tên license mở trang Detail trong vùng nội dung chính, giữ header/sidebar và mục License Management đang chọn. Tên license là liên kết màu xanh có gạch chân, hỗ trợ thao tác bàn phím và mở tab mới; bấm các ô còn lại cũng mở Detail. Bôi chọn chữ trong bảng không kích hoạt điều hướng. Nút Back to License Management luôn dẫn về danh sách, kể cả khi mở URL chi tiết trực tiếp. `LicenseWorkspaceLayout` giữ tìm kiếm, bộ lọc, số dòng, trang hiện tại, vị trí cuộn dọc và cuộn ngang bảng trong lúc chuyển giữa danh sách và Detail; khi tải lại trình duyệt thì dùng trạng thái mặc định. Sáu ô tổng quan, metadata và bảng tài khoản vẫn nằm trên cùng trang. Bảng tài khoản có tìm kiếm tên/email khi có dữ liệu email, lọc trạng thái và phân trang mặc định 10 dòng.

## Bảng và trạng thái

Các bảng dùng lớp `portal-table` hoặc `data-table`: header cao 42px, chữ 11px viết hoa; hàng dữ liệu tối thiểu 60px, chữ 12px, padding dọc 18px và ngang 12px. Các cột căn trái như mẫu giao diện; số tiền, số lượng và ngày vẫn dùng tabular-nums. Nền trắng, header xám rất nhạt, đường phân cách mảnh, không có đường kẻ dọc. Bảng rộng cuộn ngang ở màn hình hẹp. Header dùng `scope="col"`. Dữ liệu thiếu hiển thị `Unknown` hoặc thông báo chưa có dữ liệu theo ngữ cảnh, không tự đổi thành 0.

Trong bảng, trạng thái hiển thị dạng chữ, không có nền hoặc viền badge. Trạng thái thông thường và loại license/vai trò dùng màu chữ của ô; cảnh báo, lỗi và trạng thái chờ giữ màu ngữ nghĩa để dễ nhận biết. Cột Total Users trong inventory hiển thị số được gán / số ghế đã mua, ví dụ 470 / 500. Dropdown mặc định phải hiện nhãn All Categories / All Compliance ngay cả khi giá trị lọc là chuỗi rỗng.

`StatusBadge` trong `src/frontend/components/StatusBadge.tsx` là thành phần duy nhất quyết định màu trạng thái. Cùng nhãn `Inactive` có ý nghĩa khác nhau: tài khoản không hoạt động là trung tính, còn seat không sử dụng là cảnh báo. Vai trò và loại license dùng badge trung tính, không mang màu cảnh báo.

| Ý nghĩa | Chữ | Nền | Ví dụ |
| --- | --- | --- | --- |
| Tốt | `#166534` | `#F0FDF4` | Compliant, Active, Healthy |
| Cần chú ý | `#92400E` | `#FFFBEB` | At Risk, Inactive usage, Warning |
| Lỗi hoặc vượt mức | `#B42318` | `#FEF3F2` | Over-allocated, Critical |
| Chờ xử lý | `#1D4ED8` | `#EFF6FF` | Pending |
| Trung tính hoặc chưa rõ | `#334155` | `#F1F5F9` | Role, license type, Unknown, Not monitored |

Màu không được là tín hiệu duy nhất: badge luôn có chữ. Quy tắc nghiệp vụ quyết định status từ dữ liệu; frontend chỉ ánh xạ status sang nhãn và màu. Ngưỡng cảnh báo budget, compliance và usage cần được thống nhất với backend trước khi có API thật.
