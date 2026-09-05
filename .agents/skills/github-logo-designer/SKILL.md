---
name: Github SVG Logo Designer
description: Kỹ năng giúp Agent thiết kế logo chuẩn Github (SVG, Minimalist, Hỗ trợ Dark/Light mode) cho các repository hoặc blog công nghệ.
---

# Github SVG Logo Designer Skill

Kỹ năng này định hướng Agent cách tạo logo chuẩn kỹ thuật phần mềm (Software Engineering) thông qua mã nguồn **SVG (Scalable Vector Graphics)** thay vì tạo ảnh PNG/JPG bằng AI Image Generator. 

Việc dùng SVG là tiêu chuẩn của các Github Repository và Next.js App, vì nó nhẹ, sắc nét ở mọi kích cỡ và dễ dàng đưa thẳng vào file mã nguồn (như `icon.tsx`).

## 1. Tiêu Chuẩn Thiết Kế (Design Principles)

Khi được yêu cầu thiết kế logo, Agent phải tuân thủ các quy tắc sau:
- **Minimalist (Tối giản):** Không vẽ các chi tiết thừa thãi. Sử dụng các hình khối hình học cơ bản (Circle, Polygon, Path) để tạo thành logo.
- **Tech-Vibe (Hơi thở công nghệ):** Logo nên cách điệu từ các ký tự như ngoặc nhọn `< >`, ngoặc vuông `[ ]`, các node mạng lưới, terminal, hoặc cách điệu chữ cái đầu tiên của thương hiệu.
- **Bảng màu:**
  - Nền (Background): Trong suốt (`transparent`) hoặc gradient tối.
  - Màu nhấn (Accent colors): Cyan (`#06b6d4`), Electric Blue (`#3b82f6`), hoặc Neon Purple (`#8b5cf6`).

## 2. Kỹ Thuật Mã Hóa SVG

Agent tuyệt đối không dùng tool `generate_image`, mà phải viết code SVG trực tiếp (hoặc viết vào component React/Next.js) theo khung sau:

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%">
  <!-- Định nghĩa Gradient màu sắc -->
  <defs>
    <linearGradient id="techGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3b82f6" />
      <stop offset="100%" stop-color="#8b5cf6" />
    </linearGradient>
  </defs>
  
  <!-- Vẽ Logo bằng các thẻ Path, Rect, Circle -->
  <!-- Ví dụ: Một chữ B cách điệu từ các node mạng lưới -->
  <path d="..." fill="url(#techGrad)" />
</svg>
```

## 3. Ứng Dụng Vào Next.js (`icon.tsx`)

Khi áp dụng logo cho Next.js App Router (như file `src/app/icon.tsx`), Agent phải chuyển đổi mã SVG sang JSX element (bọc trong thẻ `<div>` hoặc dùng trực tiếp SVG namespace).

Ví dụ:

```tsx
import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <svg viewBox="0 0 100 100" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
         {/* Nhúng code SVG design vào đây */}
      </svg>
    ),
    { ...size }
  );
}
```

## 4. Hỗ Trợ Dark/Light Mode trên Github README

Khi cung cấp logo cho README.md, Agent cần tạo ra 2 phiên bản (sáng/tối) và hướng dẫn user sử dụng thẻ `<picture>` để tự động đổi logo theo giao diện Github:

```html
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./public/logo-dark.svg">
  <img alt="Project Logo" src="./public/logo-light.svg">
</picture>
```

Agent sẽ dùng skill này bất cứ khi nào User yêu cầu "tạo logo", "thiết kế icon" cho Github Repo hoặc Blog.
