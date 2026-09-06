# SparkleSmile Design System (`DESIGN.md`)

## 1. Visual Identity & Design Philosophy
SparkleSmile is a modern, high-end teeth whitening and oral wellness brand. The design balances **clinical efficacy** (clean, trustworthy, dentist-approved) with **lifestyle luxury** (approachable, radiant, gentle, and modern).

### Key Brand Tenets:
- **Purity & Freshness**: Generous whitespace, clean gradients, and subtle teal/aqua tones reflecting pristine oral health.
- **Trust & Evidence**: Prominent rating stars, clinical badges, verified buyer proof, and clear ingredient transparency.
- **Modern Smoothness**: Rounded forms (`rounded-3xl`, `rounded-full`), soft micro-shadows, and fluid transition interactions.

---

## 2. Color Palette & Semantic Tokens

### Primary Brand Colors (Teal / Medical Cyan)
- `brand-50`: `#eefcfa` — Ultra-light tint for card backgrounds and pill badges.
- `brand-100`: `#d5f7f2` — Subtle borders and hover states.
- `brand-200`: `#aeefe9` — Highlight accents.
- `brand-300`: `#79e2db` — Glow and secondary accents.
- `brand-400`: `#3fcfc7` — Interactive elements.
- `brand-500`: `#1db5ae` — Primary logo spark, key buttons, and active indicators.
- `brand-600`: `#0f938f` — Primary CTA button background and active link color.
- `brand-700`: `#0e7773` — Hover state for primary buttons.
- `brand-800`: `#0f5f5c` — Deep text contrast on bright backgrounds.
- `brand-900`: `#0e4f4d` — Dark brand text accents.

### Accent Palette (Warm Amber / Gold)
- `accent-400`: `#fbbf6e` — Glowing highlights.
- `accent-500`: `#f59e2e` — Star ratings, sale banners, and review highlights.
- `accent-600`: `#d97d10` — High-contrast badges and discount flags.

### Neutral System
- Background: `#fbfcfd` (Canvas background for high readability).
- Surface: `#ffffff` (Pure white card containers with 1px `border-gray-100`).
- Text Primary: `gray-900` (`#111827`) — Headlines, prices, primary labels.
- Text Secondary: `gray-600` (`#4b5563`) — Paragraph body, descriptions.
- Text Muted: `gray-400` (`#9ca3af`) — Metadata, dates, review counts.
- Dark Accent / Slate: `gray-950` (`#030712`) — Admin navigation, premium black banners.

### Status Colors
- **Success / Paid**: Background `#ecfdf5`, Text `#047857` (`emerald-700`).
- **Warning / Pending**: Background `#fffbeb`, Text `#b45309` (`amber-700`).
- **Info / Shipped**: Background `#eff6ff`, Text `#1d4ed8` (`blue-700`).
- **Accent / Delivered**: Background `#eefcfa`, Text `#0f938f` (`brand-600`).
- **Danger / Low Stock**: Background `#fef2f2`, Text `#b91c1c` (`red-700`).

---

## 3. Typography System

### Typefaces
- **Headlines & Numbers**: `Plus Jakarta Sans` (`font-display`, weights 700, 800)
  - Geometric, cheerful, modern, and distinctively premium.
- **Body & Controls**: `Inter` (`font-sans`, weights 400, 500, 600)
  - Clean, legible at small sizes, optimal for e-commerce tables and checkout fields.

### Scale & Hierarchy
- Hero Title: `text-4xl md:text-[56px] font-extrabold leading-[1.08] tracking-tight`
- Page Headers: `text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight`
- Section Titles: `text-2xl font-bold text-gray-900`
- Product Card Title: `font-display font-bold text-gray-900 text-base leading-snug`
- Badges & Pills: `text-[11px] font-extrabold uppercase tracking-wider`
- Body Text: `text-sm text-gray-500 leading-relaxed`

---

## 4. Component Standards

### Product Card
- **Container**: `bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-brand-100/50 hover:-translate-y-1 transition-all duration-300`
- **Image Box**: `aspect-square bg-gray-50 relative overflow-hidden flex items-center justify-center`
- **Badges**:
  - Sale: Floating `absolute top-3 left-3 bg-red-500 text-white text-[11px] font-extrabold px-2.5 py-1 rounded-full shadow-sm`
  - Stock: `absolute inset-x-3 bottom-3 bg-gray-900/80 text-white text-xs font-bold py-1.5 rounded-full text-center backdrop-blur`

### Interactive Buttons
- **Primary Action**: `bg-brand-600 text-white font-bold px-8 py-3.5 rounded-full hover:bg-brand-700 hover:shadow-lg hover:shadow-brand-200 transition-all`
- **Secondary / Outline**: `border-2 border-gray-200 text-gray-700 font-bold px-8 py-3.5 rounded-full hover:border-brand-500 hover:text-brand-600 transition-all`
- **Danger**: `bg-red-50 text-red-600 font-semibold px-4 py-2 rounded-full hover:bg-red-100 transition-colors`

### Data Tables (Admin & Account)
- **Wrapper**: `bg-white border border-gray-100 rounded-2xl md:rounded-3xl overflow-hidden shadow-sm`
- **Header**: `bg-gray-50/80 text-left text-[11px] text-gray-400 font-bold uppercase tracking-wider px-6 py-4`
- **Rows**: `border-t border-gray-50 hover:bg-gray-50/50 transition-colors`

---

## 5. Admin Panel Interface Guidelines

1. **Sidebar Navigation**:
   - Palette: Deep charcoal / slate (`bg-gray-950`).
   - Active Items: Highlighted with `bg-brand-500 text-gray-950 font-bold shadow-lg shadow-brand-500/20`.
   - Inactive Items: `text-gray-400 hover:bg-gray-800/60 hover:text-white`.
   - Footer: User profile info with role indicator (`Administrator`) and logout trigger.

2. **Metrics & Stats**:
   - 2-to-4 column grid of `rounded-3xl` cards with gradient icon containers.
   - Distinctive typography: Large `3xl` bold metrics with descriptive label beneath.
   - Status indicators (growth percentage, inventory warnings).

3. **Data Management & Modals**:
   - Filter bar with search input and rounded status/category chips.
   - Modal dialogs with dark backdrop blur (`bg-black/40 backdrop-blur-sm`).
   - Form inputs with clear hover/focus states (`focus:border-brand-500 focus:ring-2 focus:ring-brand-100`).

---

## 6. Product Photography Asset Specifications
- Ratio: `1:1` square aspect ratio.
- Subject: Clean product isolation or contextual wellness setting on minimal neutral/pastel backgrounds.
- Fallback: Any unassigned product resolves gracefully via `getProductImage()` utility to high-res category-appropriate photography.
