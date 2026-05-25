# Farmish Orders — Style Reference
> Fresh produce sourcing, made trustworthy. A clean Ghanaian agricultural interface built around clarity, quote confidence, and fast ordering.

**Theme:** light

Farmish Orders should feel like a reliable farm produce sourcing desk: practical, fresh, calm, and conversion-focused. The interface uses a restrained white foundation with a deep agricultural green as the primary brand signal. White remains the secondary color and the main canvas, while subtle neutral borders, soft earth tints, and real produce imagery give the product warmth without making it feel cluttered. The goal is to make customers understand the quote-based ordering process quickly, trust Farmish to source produce locally, and submit an order request with confidence.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Farm Green | `#2D5016` / `rgb(45, 80, 22)` | `--color-farm-green` | Primary brand color, CTA buttons, active states, key icons, selected navigation, status highlights |
| White Canvas | `#ffffff` | `--color-white-canvas` | Secondary brand color, page backgrounds, card surfaces, modal surfaces, inverted text on dark green elements |
| Ink | `#11140f` | `--color-ink` | Primary body text, labels, table content, general UI copy |
| Deep Leaf | `#1f3810` | `--color-deep-leaf` | Darker green for hover states, strong headings on light backgrounds, admin emphasis |
| Fresh Mist | `#f6faf3` | `--color-fresh-mist` | Soft green-tinted section backgrounds, dashboard panels, quote-process backgrounds |
| Harvest Cream | `#fffaf0` | `--color-harvest-cream` | Warm supporting backgrounds, produce category cards, gentle callout sections |
| Field Border | `#e5eadf` | `--color-field-border` | Subtle borders, dividers, card outlines, table lines |
| Muted Leaf | `#66735c` | `--color-muted-leaf` | Secondary text, helper text, descriptions, empty state copy |
| Soil Brown | `#7a5630` | `--color-soil-brown` | Small illustrative accents, produce tags, farm-related highlights only |
| Warning Amber | `#d98a14` | `--color-warning-amber` | Quote pending states, notifications, admin attention badges |
| Success Green | `#3f7d20` | `--color-success-green` | Fulfilled states, success badges, confirmation messages |
| Error Red | `#b42318` | `--color-error-red` | Validation errors, destructive actions, failed states |

## Tokens — Typography

### Inter — The primary typeface for the whole product · `--font-inter`
Inter keeps the product modern, readable, and easy to implement in Next.js. It should be used across marketing pages, forms, dashboards, tables, and admin screens. Large headings should use slightly negative letter spacing to feel polished, while captions and labels should use slight positive spacing for clarity.

- **Substitute:** system-ui
- **Weights:** 400, 500, 600, 700
- **Sizes:** 12px, 13px, 14px, 16px, 18px, 20px, 24px, 36px, 48px, 56px
- **Line height:** 1.10, 1.15, 1.25, 1.35, 1.50, 1.65
- **Letter spacing:** -0.030em at 56px, -0.020em at 48px/36px, -0.010em at 24px, 0.040em at 12px/13px
- **Role:** Clean, trustworthy, practical typography for a fresh produce ordering product where users need to understand actions and status quickly.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| overline | 12px | 1.65 | 0.48px | `--text-overline` |
| caption | 13px | 1.65 | 0.52px | `--text-caption` |
| small | 14px | 1.5 | — | `--text-small` |
| body | 16px | 1.5 | — | `--text-body` |
| subheading | 18px | 1.35 | — | `--text-subheading` |
| heading-sm | 20px | 1.30 | — | `--text-heading-sm` |
| heading | 24px | 1.20 | -0.24px | `--text-heading` |
| heading-lg | 36px | 1.15 | -0.72px | `--text-heading-lg` |
| display | 56px | 1.10 | -1.68px | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** comfortable and conversion-focused

Farmish Orders should feel spacious enough to build trust, but compact enough that users can complete forms quickly. Marketing pages can use larger vertical rhythm. Dashboards and order tables should use tighter spacing without becoming cramped.

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 6 | 6px | `--spacing-6` |
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 96 | 96px | `--spacing-96` |
| 120 | 120px | `--spacing-120` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 999px |
| cards | 20px |
| inputs | 12px |
| buttons | 999px |
| largeElements | 28px |
| modals | 24px |
| tables | 16px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| sm | `0px 1px 2px rgba(17, 20, 15, 0.06)` | `--shadow-sm` |
| md | `0px 8px 24px rgba(45, 80, 22, 0.08)` | `--shadow-md` |
| lg | `0px 20px 48px rgba(45, 80, 22, 0.12)` | `--shadow-lg` |
| focus | `0px 0px 0px 4px rgba(45, 80, 22, 0.14)` | `--shadow-focus` |

### Layout

- **Container max width:** 1180px
- **Marketing section gap:** 80px
- **Dashboard section gap:** 32px
- **Card padding:** 20-28px
- **Form field gap:** 16px
- **Grid gap:** 20-24px
- **Mobile page padding:** 20px
- **Desktop page padding:** 32px

## Components

### Text Link
**Role:** Navigation, inline links, secondary actions

backgroundColor=transparent, color=Farm Green (#2D5016), borderRadius=999px, paddingTop=0px, paddingRight=0px, paddingBottom=0px, paddingLeft=0px. Text links should be simple and readable. On hover, underline or shift to Deep Leaf (#1f3810). Use for “How it works”, “View produce list”, “Back to orders”, and inline help text.

### Primary Button
**Role:** Main conversion action

backgroundColor=Farm Green (#2D5016), color=White Canvas (#ffffff), borderColor=Farm Green (#2D5016), borderRadius=999px, paddingTop=12px, paddingRight=20px, paddingBottom=12px, paddingLeft=20px, fontWeight=600. Use for “Place an Order”, “Submit Request”, “Send Quote”, and “Confirm Quote”. Hover state should use Deep Leaf (#1f3810). Focus state should use `--shadow-focus`.

### Secondary Button
**Role:** Supporting action in light contexts

backgroundColor=White Canvas (#ffffff), color=Farm Green (#2D5016), borderColor=Field Border (#e5eadf), borderRadius=999px, paddingTop=12px, paddingRight=20px, paddingBottom=12px, paddingLeft=20px, fontWeight=600. Use for “How It Works”, “View Produce”, “Cancel”, and “Save Draft”.

### Ghost Button
**Role:** Low-emphasis navigation and dashboard actions

backgroundColor=transparent, color=Ink (#11140f), borderColor=transparent, borderRadius=999px, paddingTop=10px, paddingRight=16px, paddingBottom=10px, paddingLeft=16px. On hover, use Fresh Mist (#f6faf3). Use for top navigation, filters, admin table actions, and icon actions.

### Input Field
**Role:** Forms, order requests, search, customer details

backgroundColor=White Canvas (#ffffff), color=Ink (#11140f), borderColor=Field Border (#e5eadf), borderRadius=12px, paddingTop=12px, paddingRight=14px, paddingBottom=12px, paddingLeft=14px. Focus state should use Farm Green border and focus shadow. Inputs should never feel hidden. The ordering flow depends on clear form completion.

### Select Field
**Role:** Buyer type, quantity unit, delivery preference, status filtering

Use the same styling as Input Field. Include clear placeholder text and chevron icon in Muted Leaf (#66735c). Active and selected states should use Farm Green (#2D5016).

### Textarea
**Role:** Produce notes, delivery instructions, internal admin notes

backgroundColor=White Canvas (#ffffff), color=Ink (#11140f), borderColor=Field Border (#e5eadf), borderRadius=16px, paddingTop=14px, paddingRight=14px, paddingBottom=14px, paddingLeft=14px. Minimum height should be 112px.

### Produce Category Card
**Role:** Help users understand what they can order

backgroundColor=White Canvas (#ffffff), borderColor=Field Border (#e5eadf), borderRadius=20px, padding=24px, shadow=`--shadow-sm`. Include a produce image or simple monoline icon, category name, examples, and a small “Add to request” affordance. Use Farm Green for icon backgrounds or selected states.

### Order Request Card
**Role:** Customer dashboard summary

backgroundColor=White Canvas (#ffffff), borderColor=Field Border (#e5eadf), borderRadius=20px, padding=24px, shadow=`--shadow-sm`. Include order ID, date, item count, status badge, quote status, and primary action. Status should be scannable without reading long text.

### Status Badge
**Role:** Order state, quote state, admin workflow state

borderRadius=999px, paddingTop=6px, paddingRight=10px, paddingBottom=6px, paddingLeft=10px, fontSize=13px, fontWeight=600.

- Submitted: background Fresh Mist (#f6faf3), text Farm Green (#2D5016)
- Under Review: background Harvest Cream (#fffaf0), text Soil Brown (#7a5630)
- Quote Sent: background `#fff4dd`, text Warning Amber (#d98a14)
- Confirmed: background Fresh Mist (#f6faf3), text Success Green (#3f7d20)
- Fulfilled: background `#eef8e8`, text Success Green (#3f7d20)
- Cancelled: background `#fff1f0`, text Error Red (#b42318)

### Quote Summary Card
**Role:** Display quote before customer commitment

backgroundColor=Fresh Mist (#f6faf3), borderColor=rgba(45,80,22,0.18), borderRadius=24px, padding=24px. Show item subtotal, delivery cost, total estimate, quote notes, expiry date, and confirmation CTA. The message must clearly say: “Review this quote before confirming. No payment is taken until you approve.”

### Admin Table
**Role:** Manage incoming requests

backgroundColor=White Canvas (#ffffff), borderColor=Field Border (#e5eadf), borderRadius=16px. Header cells use Fresh Mist (#f6faf3), text Muted Leaf (#66735c), fontSize=13px, textTransform=uppercase, letterSpacing=0.52px. Rows should have clear hover states and status badges.

## Do's and Don'ts

### Do
- Use Farm Green (#2D5016 / rgb(45, 80, 22)) as the primary color for CTAs, active states, icons, selected filters, and major status indicators.
- Use White Canvas (#ffffff) as the secondary color and default background. The interface should feel clean, fresh, and breathable.
- Explain the request-and-quote process clearly above the fold. Users must know that they submit a request first and receive a quote before committing.
- Use real-feeling Ghanaian farm, market, produce crate, delivery, and packaging imagery where possible.
- Design the order form as a guided multi-step flow, not one long form.
- Use clear labels and helper text for quantities, units, delivery location, quote turnaround, and payment expectations.
- Keep dashboards practical. Show order status, quote status, date, item count, and next action clearly.
- Use warm off-white and soft green-tinted backgrounds to separate sections without breaking the white-first brand system.
- Make mobile ordering easy. Many buyers may place requests from phones.
- Use Tailwind-friendly spacing, shadcn/ui-compatible components, and accessible focus states.

### Don't
- Do not make the product look like a generic SaaS dashboard with blue gradients and abstract tech graphics.
- Do not overuse green. Farm Green should guide attention, not flood every section.
- Do not hide form inputs with overly minimal styling. This product depends on accurate order submission.
- Do not imply instant checkout if the workflow is request-and-quote.
- Do not use inconsistent stats or timelines. Choose one clear quote turnaround promise.
- Do not use foreign-looking agriculture stock imagery that feels disconnected from Ghana.
- Do not make the homepage too wordy. Use short, direct copy and visual explanations.
- Do not make admin screens decorative. Admin needs speed, clarity, filters, and status control.
- Do not use low-contrast green text on green backgrounds.

## Elevation

- **Cards on white:** `0px 1px 2px rgba(17, 20, 15, 0.06)`
- **Important panels:** `0px 8px 24px rgba(45, 80, 22, 0.08)`
- **Hero/dashboard feature card:** `0px 20px 48px rgba(45, 80, 22, 0.12)`
- **Focus ring:** `0px 0px 0px 4px rgba(45, 80, 22, 0.14)`

## Imagery

The visual language should use authentic, practical agricultural imagery rather than abstract SaaS illustrations. Photography should feel local, fresh, and believable: Ghanaian farm produce, packed crates, vegetables, grains, spices, farm workers, market preparation, sorting tables, and delivery preparation. Use imagery to support trust and clarity, not decoration alone.

Recommended image types:
- Fresh produce in crates or baskets
- Farm workers sorting or harvesting produce
- Close-up produce photography on white or soft neutral backgrounds
- Bulk order packaging scenes
- Restaurant or food business sourcing moments
- Delivery handoff moments

Icon style:
- Simple monoline icons
- Rounded stroke endings
- Use Farm Green for active icons
- Use Muted Leaf for supporting icons

Avoid:
- Futuristic AI-style illustrations
- Generic foreign farm stock photos
- Overly saturated food photography
- Random decorative blobs that do not explain the product

## Layout

The layout should use a max-width contained structure with generous spacing and clear conversion hierarchy. The homepage should open with a strong hero section that explains the quote-based order flow immediately. The hero can use a 2-column layout: left side copy and CTAs, right side a produce/order summary visual card. Below the hero, use structured sections for trust indicators, how it works, produce categories, buyer types, FAQs, and final CTA.

Recommended page structure:

1. Sticky top navigation
2. Hero section with CTA
3. Trust indicator strip
4. How it works section
5. Produce category grid
6. Buyer type section
7. Quote process explainer
8. FAQ section
9. Final CTA
10. Footer

Dashboard layout:
- Sidebar or top tabs depending on screen size
- Main content max width for customer dashboard
- Admin dashboard can use full-width content with tables
- Use status tabs and filters before large tables
- Keep important actions above the fold

## Product-Specific Screens

### Homepage
- Headline: “Fresh produce sourcing made simple”
- Subheadline: “Order vegetables, grains, spices, and other farm produce directly from trusted Ghanaian farms. Submit your request, receive a clear quote, and confirm when you are ready.”
- Primary CTA: “Place an Order”
- Secondary CTA: “How It Works”
- Trust strip: Local sourcing, Quote before payment, Fresh produce, Bulk orders supported

### Order Request Form
- Use a 4-step form: Buyer Details, Order Details, Delivery Details, Review
- Allow multiple produce items
- Each produce item needs: produce name, quantity, unit, notes
- Buyer type options: Household, Restaurant, Caterer, Hotel, Retailer, Food Vendor, Other
- Add reassurance text: “You will receive a quote before making any payment.”
- Final CTA: “Submit Request”

### Customer Dashboard
- Show user’s recent order requests
- Show status badges clearly
- Add “Place New Order” CTA
- Include empty state for first-time users
- Include order details page with timeline

### Admin Dashboard
- Show total requests, pending review, quotes sent, confirmed orders
- Include order table with search, filters, and status badges
- Include quote builder with item prices, delivery cost, notes, and send quote button
- Include internal notes and customer contact details

## Agent Prompt Guide

### Quick Color Reference
- Primary: Farm Green (#2D5016 / rgb(45, 80, 22))
- Secondary: White Canvas (#ffffff)
- Text: Ink (#11140f)
- Heading: Deep Leaf (#1f3810)
- Border: Field Border (#e5eadf)
- Soft Background: Fresh Mist (#f6faf3)
- Warm Accent Background: Harvest Cream (#fffaf0)

### 3-5 Example Component Prompts

1. Create a Hero Section: Use a white background with a soft Fresh Mist (#f6faf3) produce-themed visual panel on the right. Left side headline: “Fresh produce sourcing made simple” in Inter weight 700, size 56px, Deep Leaf (#1f3810), letterSpacing -1.68px. Subhead: “Order vegetables, grains, spices, and other farm produce directly from trusted Ghanaian farms. Submit your request, receive a clear quote, and confirm when you are ready.” in Inter weight 400, size 18px, Ink (#11140f). Add primary CTA “Place an Order” with Farm Green (#2D5016) background and white text, plus secondary CTA “How It Works” with white background and Farm Green border.

2. Create a Navigation Bar: Sticky top navigation with White Canvas (#ffffff) background, subtle Field Border (#e5eadf) bottom border, Farmish Orders logo in Farm Green (#2D5016), navigation links “How it works”, “Produce”, “FAQ”, and “Sign in”. Add a right-aligned pill CTA “Place an Order” using Farm Green background and white text.

3. Create a Produce Category Card: White Canvas (#ffffff) background, Field Border (#e5eadf) border, borderRadius 20px, padding 24px. Include a small produce image/icon, category title “Vegetables” in Inter weight 600, size 20px, Deep Leaf (#1f3810), examples text “Tomatoes, onions, garden eggs, peppers” in Muted Leaf (#66735c), and a small Farm Green text link “Add to request”.

4. Create an Order Request Form: Multi-step card layout with progress indicator at the top. Use steps Buyer Details, Order Details, Delivery Details, Review. Use rounded 12px input fields, clear labels, helper text, and a repeated produce item row with produce name, quantity, unit, and notes. Add a persistent right-side summary card on desktop and a bottom sticky summary on mobile. Primary CTA says “Submit Request”.

5. Create an Admin Orders Table: White card with 16px radius and Field Border. Add top filter tabs for All, Submitted, Under Review, Quote Sent, Confirmed, Fulfilled, Cancelled. Table columns: Order ID, Customer, Buyer Type, Items, Location, Status, Date, Action. Status badges use the status badge color system. Add a primary “Create Quote” action for orders under review.

## Similar Brands / References

- **Farmish main marketplace** — Keep the agricultural marketplace context, but make orders feel more structured and conversion-ready.
- **Modern grocery delivery interfaces** — Borrow clarity around categories, availability, and ordering, but avoid instant-checkout assumptions.
- **B2B procurement dashboards** — Borrow order status tracking, quote flow, and admin tables.
- **Linear / Vercel-style restraint** — Borrow spacing discipline, clean typography, and focused interface hierarchy, but replace the tech aesthetic with authentic agricultural warmth.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-farm-green: #2D5016;
  --color-white-canvas: #ffffff;
  --color-ink: #11140f;
  --color-deep-leaf: #1f3810;
  --color-fresh-mist: #f6faf3;
  --color-harvest-cream: #fffaf0;
  --color-field-border: #e5eadf;
  --color-muted-leaf: #66735c;
  --color-soil-brown: #7a5630;
  --color-warning-amber: #d98a14;
  --color-success-green: #3f7d20;
  --color-error-red: #b42318;

  /* Typography — Font Families */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-overline: 12px;
  --leading-overline: 1.65;
  --tracking-overline: 0.48px;
  --text-caption: 13px;
  --leading-caption: 1.65;
  --tracking-caption: 0.52px;
  --text-small: 14px;
  --leading-small: 1.5;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 18px;
  --leading-subheading: 1.35;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.3;
  --text-heading: 24px;
  --leading-heading: 1.2;
  --tracking-heading: -0.24px;
  --text-heading-lg: 36px;
  --leading-heading-lg: 1.15;
  --tracking-heading-lg: -0.72px;
  --text-display: 56px;
  --leading-display: 1.1;
  --tracking-display: -1.68px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-120: 120px;

  /* Layout */
  --container-max-width: 1180px;
  --section-gap: 80px;
  --dashboard-gap: 32px;
  --card-padding: 24px;

  /* Border Radius */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 20px;
  --radius-2xl: 24px;
  --radius-3xl: 28px;
  --radius-full: 999px;

  /* Named Radii */
  --radius-tags: 999px;
  --radius-cards: 20px;
  --radius-inputs: 12px;
  --radius-buttons: 999px;
  --radius-largeelements: 28px;

  /* Shadows */
  --shadow-sm: 0px 1px 2px rgba(17, 20, 15, 0.06);
  --shadow-md: 0px 8px 24px rgba(45, 80, 22, 0.08);
  --shadow-lg: 0px 20px 48px rgba(45, 80, 22, 0.12);
  --shadow-focus: 0px 0px 0px 4px rgba(45, 80, 22, 0.14);
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-farm-green: #2D5016;
  --color-white-canvas: #ffffff;
  --color-ink: #11140f;
  --color-deep-leaf: #1f3810;
  --color-fresh-mist: #f6faf3;
  --color-harvest-cream: #fffaf0;
  --color-field-border: #e5eadf;
  --color-muted-leaf: #66735c;
  --color-soil-brown: #7a5630;
  --color-warning-amber: #d98a14;
  --color-success-green: #3f7d20;
  --color-error-red: #b42318;

  /* Typography */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-overline: 12px;
  --leading-overline: 1.65;
  --tracking-overline: 0.48px;
  --text-caption: 13px;
  --leading-caption: 1.65;
  --tracking-caption: 0.52px;
  --text-small: 14px;
  --leading-small: 1.5;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 18px;
  --leading-subheading: 1.35;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.3;
  --text-heading: 24px;
  --leading-heading: 1.2;
  --tracking-heading: -0.24px;
  --text-heading-lg: 36px;
  --leading-heading-lg: 1.15;
  --tracking-heading-lg: -0.72px;
  --text-display: 56px;
  --leading-display: 1.1;
  --tracking-display: -1.68px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-120: 120px;

  /* Border Radius */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 20px;
  --radius-2xl: 24px;
  --radius-3xl: 28px;
  --radius-full: 999px;

  /* Shadows */
  --shadow-sm: 0px 1px 2px rgba(17, 20, 15, 0.06);
  --shadow-md: 0px 8px 24px rgba(45, 80, 22, 0.08);
  --shadow-lg: 0px 20px 48px rgba(45, 80, 22, 0.12);
  --shadow-focus: 0px 0px 0px 4px rgba(45, 80, 22, 0.14);
}
```
