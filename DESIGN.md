---
name: Món Nhỏ Handmade
description: Nền tảng thương mại điện tử trang sức handmade — ấm áp, tinh tế, chân thật.
colors:
  brand-cream: "#fffaf7"
  brand-pink: "#ffcdc2"
  brand-purple: "#9b7bae"
  brand-dark: "#5e4b6e"
  brand-text: "#4a4a4a"
  brand-rose-scroll: "#e2948a"
  surface-white: "#ffffff"
  surface-nav: "#f8f4f9"
  border-subtle: "#f3f4f6"
  border-pink: "#ffcdc2"
  danger: "#ef4444"
typography:
  display:
    fontFamily: "'Playfair Display', Georgia, serif"
    fontSize: "clamp(3rem, 8vw, 4.5rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "'Playfair Display', Georgia, serif"
    fontSize: "clamp(1.75rem, 4vw, 2.5rem)"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "normal"
  title:
    fontFamily: "'Inter', sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "normal"
  body:
    fontFamily: "'Inter', sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.7
    letterSpacing: "normal"
  label:
    fontFamily: "'Inter', sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.01em"
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  full: "9999px"
spacing:
  xs: "8px"
  sm: "16px"
  md: "24px"
  lg: "40px"
  xl: "64px"
  section: "96px"
components:
  button-primary:
    backgroundColor: "{colors.brand-purple}"
    textColor: "{colors.surface-white}"
    rounded: "{rounded.full}"
    padding: "12px 24px"
    typography: "{typography.title}"
  button-primary-hover:
    backgroundColor: "{colors.brand-dark}"
    textColor: "{colors.surface-white}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.brand-purple}"
    rounded: "{rounded.full}"
    padding: "10px 24px"
  button-secondary-hover:
    backgroundColor: "{colors.brand-purple}"
    textColor: "{colors.surface-white}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.brand-purple}"
    rounded: "{rounded.sm}"
    padding: "8px 16px"
  card-product:
    backgroundColor: "{colors.surface-white}"
    rounded: "{rounded.lg}"
    padding: "0"
  card-product-hover:
    backgroundColor: "{colors.surface-white}"
  input-field:
    backgroundColor: "{colors.surface-white}"
    textColor: "{colors.brand-text}"
    rounded: "{rounded.md}"
    padding: "12px 16px"
  nav:
    backgroundColor: "{colors.surface-nav}"
    height: "60px"
---

## Overview

**Hệ thống thiết kế: "Vườn Thủ Công"**

Một không gian mua sắm có hồn, như bước vào xưởng nhỏ của người thợ thủ công. Mọi thứ được chăm chút tay — từ khoảng trắng đủ rộng để sản phẩm thở, đến typography serif gợi cảm xúc, đến màu tím mộng mơ như vệt lụa nhạt.

Cảm giác: **lặng, ấm, thật**. Không cần hét to. Sản phẩm nói thay.

Anti-references: không phải Shopee (quá rối), không phải flash sale TikTok (áp lực), không phải SaaS landing page (lạnh kỹ thuật).

Background mặc định là `brand-cream (#fffaf7)` — không bao giờ dùng trắng thuần. Nav trong suốt khi ở đầu trang, chuyển thành `surface-nav` khi cuộn.

## Colors

**Chiến lược màu: Restrained** — nền kem tím tinted + một accent tím làm vai chính, hồng đào dùng điểm nhấn thứ cấp.

| Slug | Hex | Vai trò |
|---|---|---|
| `brand-cream` | `#fffaf7` | Nền trang chính — kem ấm, không bao giờ trắng thuần |
| `brand-pink` | `#ffcdc2` | Accent thứ cấp — hồng đào, dùng cho badge, border nhẹ, hover link |
| `brand-purple` | `#9b7bae` | Accent chính — tím bụi nhạt, buttons, icon, active states |
| `brand-dark` | `#5e4b6e` | Tím đậm — headings lớn, hover state của purple |
| `brand-text` | `#4a4a4a` | Body text — xám đậm, không đen hoàn toàn |
| `brand-rose-scroll` | `#e2948a` | Scrollbar thumb — hồng đất |
| `surface-white` | `#ffffff` | Bề mặt card, input |
| `surface-nav` | `#f8f4f9` | Nav sau khi cuộn — trắng tím tính |
| `border-subtle` | `#f3f4f6` | Border card mặc định — cực nhạt |
| `danger` | `#ef4444` | Badge giỏ hàng, lỗi |

Không dùng gradient text (vi phạm design law). Không dùng màu xanh hay vàng — không thuộc bảng màu thương hiệu.

## Typography

**Hai họ font làm bộ đôi** — Playfair Display (serif, cảm xúc) và Inter (sans-serif, rõ ràng).

- **Display / Headline**: Playfair Display. Dùng cho hero title, tên section lớn. Cỡ chữ hero dùng `clamp()` để co giãn mượt trên mọi màn hình.
- **Body**: Inter. Mọi paragraph, label, navigation.
- **Tỉ lệ scale**: ≥ 1.25 giữa các bậc. Tránh scale phẳng.
- **Line length**: Body tối đa 65–75ch. Heading có thể ngắn hơn.
- **Mobile minimum**: 16px body. Heading nhỏ nhất 24px.

Italic Playfair Display dùng rất hạn chế — chỉ cho quote hoặc tagline ngắn đặc biệt.

## Elevation

Hệ thống **phẳng có trọng lượng** (flat-with-weight): không dùng shadow đậm, elevation thể hiện qua tonal layering và chuyển động.

- **Mặc định**: `box-shadow: 0 1px 3px rgb(0 0 0 / 0.06)` — shadow nhẹ gần như vô hình
- **Hover card**: `0 25px 30px -15px rgba(155, 123, 174, 0.15)` + `translateY(-8px)` — lift tím nhạt
- **Nav (sau cuộn)**: `box-shadow: 0 1px 8px rgb(0 0 0 / 0.08)`
- **Không dùng**: shadow đen đậm, multiple layers, glassmorphism decorative

Elevation chính là **chuyển động**, không phải shadow. Card lift khi hover là signature của hệ thống.

## Components

### Buttons

Ba variant, tất cả dùng `border-radius: 9999px` (pill shape):

- **Primary**: `bg-brand-purple`, text trắng. Hover: `bg-brand-dark` + `translateY(-2px)` + `shadow-lg shadow-brand-purple/25`. Active: trở về vị trí.
- **Secondary**: border 2px `brand-purple`, text `brand-purple`, nền trong suốt. Hover: fill `brand-purple`, text trắng.
- **Ghost**: text `brand-purple`, nền trong suốt. Hover: `bg-brand-purple/10`. Dùng cho navigation inline.

Transition: `300ms ease-out` cho tất cả button.

### Cards (ProductCard)

- `border-radius: 16px` (rounded-2xl), nền trắng, border `border-subtle`
- Hover: lift `translateY(-8px)`, shadow tím nhạt, `transition: 400ms cubic-bezier(0.2, 0, 0, 1)`
- Image zoom: `scale(1.08)` khi hover card, `transition: 600ms cubic-bezier(0.2, 0, 0, 1)`
- Featured card: layout ngang (image trái 40%, nội dung phải 60%) trên màn hình ≥ sm

### Inputs

- `border-radius: 12px`, border `border-gray-300`
- Focus: `ring-2 ring-brand-purple/50`, border đổi thành `brand-purple`
- Placeholder: `text-gray-400`
- Padding: 12px 16px

### Navigation (Header)

- Fixed, full-width, `z-index: 40`
- Trong suốt trên đầu trang → `surface-nav` + `shadow` sau khi cuộn 50px
- Logo: Playfair Display bold, `brand-purple`, icon gem hồng đào
- Cart badge: đỏ (`#ef4444`), animation `bounce-pop` khi số thay đổi

### Badges / Tags

- Pill shape (`border-radius: 9999px`), background `white/90`, text `brand-purple` hoặc `red-500`
- Border `border-pink` khi dùng làm announcement badge

### Scroll Reveal (fade-up)

Các section có hiệu ứng fade-up: `opacity: 0, translateY(30px)` → `opacity: 1, translateY(0)`, `800ms cubic-bezier(0.16, 1, 0.3, 1)` khi vào viewport.

## Do's and Don'ts

**Do:**
- Dùng Playfair Display cho tất cả heading có cảm xúc (hero, tên section, tên sản phẩm)
- Để khoảng trắng thở — `py-16` tối thiểu cho mỗi section
- Dùng `brand-cream` làm nền, không bao giờ `#ffffff` thuần cho toàn trang
- Dùng `translateY` lift cho card hover — đây là signature animation
- Dùng tiếng Việt chân thật trong copy — không dịch máy

**Don't:**
- Không dùng gradient text (`background-clip: text`) — vi phạm absolute ban
- Không dùng side-stripe border (`border-left` > 1px làm accent)
- Không xếp card grid giống hệt nhau không giới hạn — nhóm theo category, dùng featured layout
- Không dùng đen thuần `#000` hay trắng thuần `#fff` cho text hoặc background chính
- Không thêm màu xanh / vàng / cam vào bảng màu — ngoài hệ thống tím-hồng-kem
- Không animate `width`, `height`, hoặc `padding` — chỉ animate `transform` và `opacity`
