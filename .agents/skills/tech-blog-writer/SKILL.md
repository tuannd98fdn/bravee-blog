---
name: Tech Blog Writer (Visual & Storytelling)
description: Khung tiêu chuẩn (Framework) để viết các bài Technical Blog chất lượng cao, hấp dẫn, dễ hiểu thông qua nghệ thuật kể chuyện (Storytelling) và trực quan hóa (Visuals) bằng Mermaid.
---

# Hướng dẫn viết bài Technical Blog hấp dẫn

Khi được yêu cầu viết bài blog về công nghệ (System Design, DevOps, AI, v.v.), bạn **BẮT BUỘC** phải tuân thủ bộ kỹ năng này để tránh việc bài viết trở nên khô khan, thuần kỹ thuật và nhàm chán.

## 1. Nghệ thuật Kể Chuyện (Storytelling)

Đừng ném thẳng lý thuyết vào mặt người đọc. Hãy sử dụng mô hình **PAS (Problem - Agitate - Solve)** để dẫn dắt:

- **Problem (Vấn đề):** Bắt đầu bằng một bối cảnh thực tế hoặc một "nỗi đau" mà lập trình viên hay hệ thống thường gặp phải (Ví dụ: Hệ thống bị sập do quá tải, dữ liệu bất đồng bộ, code quá rối rắm).
- **Agitate (Xát muối):** Khoét sâu vào hậu quả của vấn đề đó (Ví dụ: Mất tiền, mất khách hàng, dev thức trắng đêm, công ty phá sản). Làm cho người đọc cảm thấy mức độ nghiêm trọng.
- **Solve (Giải quyết):** Đưa công nghệ / giải pháp cốt lõi vào như một "vị cứu tinh". Phân tích cách nó giải quyết triệt để vấn đề ở trên.

### Giọng văn (Tone)
- Chuyên nghiệp (Senior level) nhưng vẫn phải có tính "nhân bản" (Humanize).
- Không ngại đề cập đến những sai lầm, những tình huống "dở khóc dở cười" trong thực tế.
- Khúc chiết, tránh dùng từ ngữ sáo rỗng. 

## 2. Tư Duy Hình Ảnh (Visual-First & Show, Don't Tell)

Bài viết kỹ thuật **BẮT BUỘC** phải có hình ảnh mô phỏng. Tuyệt đối không dùng các khối text ASCII (`---`, `+---+`) vì chúng không đẹp và khó tùy biến.

- Sử dụng **Mermaid.js** để vẽ sơ đồ trực tiếp. Đặt code Mermaid vào trong block ````mermaid ... ````.
- Dùng Mermaid để vẽ các loại sơ đồ sau tùy theo ngữ cảnh:
  - **Sơ đồ kiến trúc (Architecture Map)**: Flowchart (đồ thị hướng).
  - **Sơ đồ luồng (Sequence Diagram)**: Thể hiện giao tiếp giữa các Microservices.
  - **Gantt / State Diagram**: Thể hiện vòng đời, trạng thái của luồng dữ liệu.
- **Quy tắc "Sandwich" cho hình ảnh:**
  1. Giới thiệu rõ sơ đồ bên dưới nói về cái gì.
  2. Chèn khối code Mermaid.
  3. Phân tích cụ thể một điểm nhấn (ví dụ: mũi tên A, node B) trong sơ đồ để kết nối với nội dung bài.

## 3. Cấu Trúc Khung Bài Viết (Formatting)

- **The Hook:** Mở bài phải giật gân, khơi gợi sự tò mò.
- **Inverted Pyramid:** Đưa những thông tin/giải pháp quan trọng nhất lên đầu bài (TL;DR) rồi mới giải thích chi tiết.
- Sử dụng `<Callout type="tip" title="...">` hoặc `<Callout type="warning" title="...">` cho những cảnh báo, lưu ý sinh tử.
- Các Heading phải ngắn gọn, dễ quét mắt (Scanability). Sử dụng Bullet points thường xuyên thay cho các đoạn văn dài.

Khi đã nắm vững skill này, các bài viết của bạn sẽ có sức thuyết phục tuyệt đối.
