# Farmish Project Overview and Redesign Inputs

This document reviews the existing Farmish/Farm Orders project and extracts the practical inputs needed to generate high-quality redesign prompts. It is based on the current codebase, `README.md`, `design_approach.md`, route structure, product/category data, Supabase schema, and implementation patterns.

## Assumptions

- The public brand name should be **Farmish**, based on `src/app/layout.tsx`, `Navbar.tsx`, and the logo alt text. The repository and some auth screens still use **Farm Orders**.
- The primary market is Ghana, with delivery and sourcing across Ghanaian farms and districts.
- The business model is quote-based: customers submit desired produce and quantities, then admins calculate and send prices later.
- No inspiration screenshots were found in the repo. The inspiration analysis below uses the current screens as the main visual reference and public competitor positioning as secondary reference.
- The existing client restriction of zero border radius should be preserved unless the redesign brief explicitly changes it.

## 1. What The Business Does

Farmish is a quote-based agricultural produce ordering platform. It lets customers request fresh produce such as vegetables, grains, spices, tubers, legumes, fruits, processed staples, oils, condiments, and proteins sourced from Ghanaian farms. Customers do not see fixed prices at order time. Instead, they select items and quantities, provide delivery details, and wait for an admin-reviewed quote.

Admins manage the operational side: product availability, incoming orders, order status, district-based quote line items, service fee, transport cost, exports, and customer notifications by email and Telegram.

The core value proposition is not instant grocery checkout. It is reliable sourcing, transparent review, and custom pricing for fresh local produce.

## 2. Who The Users Are

Primary users:

- Household buyers in Ghana who want fresh produce delivered without market visits.
- Restaurants, caterers, food vendors, schools, offices, and institutions that buy produce in repeat or bulk quantities.
- Diaspora or remote buyers arranging food delivery for people in Ghana.
- Health-conscious customers who care about fresh, local sourcing.

Admin users:

- Farmish operations staff who review orders, price items, source produce, add transport fees, and update statuses.
- Product/catalog managers who control available products and units.
- Customer support or fulfillment staff who need order exports and customer contact details.

## 3. What Action The Website/App Must Drive

The app must drive customers to submit a quote request with enough information for Farmish to price and fulfill the order.

Primary conversion:

- Customer selects produce quantities and submits an order request.

Secondary conversions:

- Customer creates/signs into an account.
- Customer completes profile information: name, organisation, phone, alternate contact, location.
- Customer returns to view quotes and order status.
- Admin creates a quote quickly and moves orders through fulfillment statuses.

The redesign should reduce hesitation around the no-price model by explaining the quote flow before checkout: select produce, submit request, receive quote, confirm, receive delivery.

## 4. What Pages/Screens Are Needed

Existing screens:

- `/` landing page with hero, farm image, trust strip, CTA.
- `/login` sign-in.
- `/signup` account creation.
- `/order` product selection and cart/order submission.
- `/dashboard` customer profile and order history.
- `/dashboard/[orderId]` customer order detail and status timeline.
- `/dashboard/quotes` customer quote list.
- `/admin` admin order dashboard.
- `/admin/products` product management.
- `/admin/orders/[orderId]` admin order detail, quote visibility, status updates.
- `/admin/orders/[orderId]/quote` create/update quote page.

Recommended redesigned screens:

- Public landing/home.
- Public browse catalog or order-start screen before auth.
- Quote-model explainer section or modal.
- Product/category browser with search, filters, quantity steppers, and custom item entry.
- Mobile cart bottom sheet and desktop cart panel.
- Checkout/auth gate with delivery details.
- Order submitted success screen.
- Customer dashboard with unified orders and quotes.
- Customer order detail with timeline and embedded quote.
- Profile settings.
- Admin order dashboard with queue priorities and filters.
- Admin order detail with customer, delivery, items, status, quote history.
- Admin quote builder optimized for line-item pricing.
- Admin product/catalog management.
- Empty, loading, error, and permission states.

## 5. User Stories

Customer stories:

- As a first-time customer, I want to understand why prices are not shown before I invest time building an order.
- As a customer, I want to browse available produce by category so I can quickly find staples.
- As a customer, I want to add exact quantities and units so Farmish can send a useful quote.
- As a customer, I want to request an item that is not listed so I do not abandon the order.
- As a customer, I want to save my delivery address and contact details so repeat orders are faster.
- As a customer, I want to see whether my order is pending, confirmed, processing, out for delivery, or delivered.
- As a customer, I want quotes connected to the exact order so I do not need to hunt through a separate quotes page.
- As a customer, I want to export or download order/quote details for record keeping.
- As a customer with a pending order, I want to edit or cancel before Farmish starts processing.

Admin stories:

- As an admin, I want to see new pending orders immediately so quotes can be prepared quickly.
- As an admin, I want to search and filter by status, customer, and order number.
- As an admin, I want to create a quote from order items without retyping product names or quantities.
- As an admin, I want to set district, unit price, service fee, transport, and notes so the customer quote is complete.
- As an admin, I want to update order status and notify customers.
- As an admin, I want to export orders and quotes as CSV, XLSX, or PDF.
- As an admin, I want to manage product availability without deleting historical order data.

## 6. Competitors

Direct or adjacent Ghana-focused competitors and references:

- [Just A Farm](https://www.just-a-farm.com/) - fresh Ghanaian produce, traceability, farm story, household/retailer/restaurant supply.
- [AgroHub](https://www.agrohub.farm/) - African farm products marketplace with verified producers and origin information.
- [The Harvest Bridge](https://harvestbridge.net/) - agricultural marketplace connecting farmers, buyers, and drivers in Ghana.
- [Farmer Zone](https://www.farmerzone.org/) - farm-to-table platform for vegetables, fruits, roots, tubers, restaurants, retailers, and households.
- [Gonadoor](https://www.gonadoor.com/) - Ghana grocery/farm produce delivery with farmer-driver-consumer linkage.
- [Dromjor Ventures](https://dromjor.com/) - fresh farm produce delivery in Ghana.
- [Digrocer](https://digrocer.com/) - Accra grocery delivery with large catalog and speed promise.
- [Complete Farmer](https://www.completefarmer.com/) - B2B agricultural sourcing and supply-chain positioning.
- Local alternatives: open markets, supermarkets, WhatsApp vendors, Instagram/TikTok produce sellers, neighborhood shops, hired market shoppers.

Competitive implication: Farmish should not compete only on "fresh produce." It should own **structured quote-based sourcing for Ghanaian produce**, especially for buyers whose orders vary by quantity, district, availability, and delivery needs.

## 7. Inspiration Screenshot Analysis

No inspiration screenshot assets were present in the repository. The analysis below treats the current app screens as screenshots and extracts what works or fails visually.

Current landing page:

- Strongest element: editorial split between large typographic headline and real farm image.
- Useful cues: deep black nav, green accent, warm off-white background, trust statistics.
- Weakness: CTA says "Place an Order" but subcopy says users must sign in, so the page creates motivation and friction in the same moment.
- Weakness: quote turnaround is inconsistent: desktop says "4-5 days" while mobile says "48H"; this must be resolved.
- Opportunity: add a visible three-step quote explanation above the fold or immediately below it.

Current order screen:

- Strongest element: products grouped by useful categories.
- Useful cue: selected products receive a light green background.
- Weakness: product cards are text-only and small; they feel like admin rows rather than a shopping/order experience.
- Weakness: quantity inputs require typing, which is slow on mobile.
- Weakness: cart is a sticky sidebar, which does not translate well to mobile.
- Opportunity: use product cards with photo/illustration, unit badge, plus/minus steppers, category tabs, search, and a persistent cart summary.

Current dashboard:

- Strongest element: profile, exports, order history, edit/cancel for pending orders.
- Weakness: the profile section dominates the page before the order queue.
- Weakness: order table is desktop-first and information-light on mobile.
- Weakness: "My Quotes" is separate from "My Orders," creating a broken mental model.
- Opportunity: show a customer home dashboard with quote alerts, active order cards, and next action.

Current order detail:

- Strongest element: clear status sequence.
- Weakness: timeline is visually minimal and does not show timestamps, quote step, delivery expectation, or next action.
- Opportunity: integrate quote cards into the order detail and make the current stage unmistakable.

Current admin dashboard:

- Strongest element: useful top stats, filters, search, export.
- Weakness: all orders are table rows with limited prioritization.
- Weakness: no obvious "needs quote" queue, SLA indicator, or bulk operational overview.
- Opportunity: add queue sections such as Needs Quote, Awaiting Customer, In Progress, and Delivered Today.

Current quote builder:

- Strongest element: practical pricing table with district, unit price, service fee, transport, total, and notes.
- Weakness: the table is very wide and likely difficult on small screens.
- Opportunity: keep it dense on desktop, but switch to line-item cards on mobile or use horizontally pinned totals.

## 8. What To Borrow From Each Inspiration

From the current Farmish landing:

- Keep real farm photography and high-contrast editorial typography.
- Keep the warm off-white, deep green, black, and utilitarian table language.
- Keep the trust strip, but make the numbers accurate and consistent.

From marketplace competitors:

- Borrow verified sourcing, origin, and farm-to-door reassurance.
- Borrow clear product categorization and product discovery patterns.
- Borrow confidence cues: freshness promise, local sourcing, reliable delivery, quality checks.

From grocery delivery competitors:

- Borrow fast search, visible categories, cart persistence, and mobile-first quantity controls.
- Do not borrow the expectation of instant fixed-price checkout unless Farmish can operationally support it.

From B2B sourcing platforms:

- Borrow structured quote language, supply reliability, exportable records, and organisation/profile fields.
- Make repeat ordering feel efficient for restaurants and institutions.

From admin/operations software:

- Borrow queue-based dashboards, status filters, compact tables, inline actions, and clear exception handling.
- Keep admin visuals quieter and denser than the customer experience.

## 9. Brand Mood

Farmish should feel:

- Fresh but not cute.
- Ghanaian and local without using generic "organic farm" tropes.
- Operationally reliable, not lifestyle-only.
- Direct, structured, and practical.
- Warm enough for households, robust enough for restaurants and bulk buyers.

Visual direction:

- Off-white background: `#F7F5F0`.
- Surface white: `#FFFFFF`.
- Ink black: `#0F0F0F`.
- Agricultural green: `#2D5016`.
- Muted clay/stone text: `#5C5751`, `#9C9690`, `#D9D4C7`.
- Status accents already exist: amber, blue, purple, orange, danger red.
- Typography: Barlow Condensed for headings/actions, IBM Plex Sans for body, IBM Plex Mono for order numbers.
- Shape: zero-radius, squared controls, strong borders.

Avoid:

- Rounded pill-heavy grocery app aesthetics.
- Beige-only or green-only palettes.
- Decorative farm icons as the main visual system.
- Huge marketing sections that delay the ordering workflow.
- Ambiguous claims like "best quality" without operational proof.

## 10. Content/Copy Direction

Primary message:

> Order fresh Ghanaian produce. We source, price, and send you a quote before fulfillment.

Quote model explanation:

- "Choose produce and quantities."
- "Farmish reviews availability, source location, and delivery."
- "You receive a clear quote with item prices, service fee, and transport."
- "Confirm and track your order."

CTA language:

- Primary: "Start an Order"
- Secondary: "Browse Produce"
- Auth gate: "Sign in to submit your request"
- Quote page: "Review Quote"
- Admin: "Create Quote", "Update Status", "Export"

Tone:

- Direct and transparent.
- Avoid overpromising same-day delivery unless operationally true.
- Use Ghana-specific terms where product names already do: waakye leaves, tombrown, cassava dough, local spices.
- Resolve inconsistent quote timing. Use one promise such as "Quote timing varies by order size" until a true SLA is known.

## 11. Tech Stack And Implementation Constraints

Current stack:

- Next.js `16.2.2` App Router with route groups.
- React `19.2.4`.
- TypeScript.
- Tailwind CSS v4.
- shadcn UI components and `@base-ui/react`.
- Supabase Auth, Supabase SSR, Supabase PostgreSQL.
- Resend with React Email templates.
- Telegram Bot API notifications.
- Export support through `xlsx`, `jspdf`, and `jspdf-autotable`.
- Lucide React icons.
- Google fonts loaded through `next/font`: Barlow Condensed, IBM Plex Sans, IBM Plex Mono.

Implementation constraints:

- This is Next 16, not older Next.js. Read `node_modules/next/dist/docs/` before framework-level changes.
- Protected routes are handled through `src/proxy.ts` using Next's `proxy` convention, not old `middleware.ts`.
- `/order`, `/dashboard`, and `/admin` currently require authentication.
- The current product model has no image, description, price, popularity, inventory, or farm/source fields.
- Quote pricing exists separately from products and order submission.
- Current order statuses are fixed: `pending`, `confirmed`, `processing`, `out_for_delivery`, `delivered`.
- Product units are simple strings: kg, liter, bundle, bottle, bunch, piece, pack.
- District selection uses local JSON data from `src/data/ghana-districts.json`.
- Existing design globally forces `border-radius: 0 !important`.
- Current UI relies heavily on client components and Supabase client calls.
- Public assets are limited to `public/group_farmers.jpg` and `public/logo.png`.

## 12. Client Restrictions Or Assumptions

Known restrictions:

- Preserve the quote-based model. Do not show product prices at browse/order time unless the business changes.
- Preserve admin-only monetary controls.
- Preserve the sharp, corporate, zero-radius design language unless explicitly approved otherwise.
- Keep Ghanaian farm sourcing central to the brand.
- Keep email and Telegram notification workflows.
- Keep exports for operational users.

Assumptions:

- Mobile is a major conversion surface and should be designed first for customer ordering.
- Restaurants and institutions are valuable enough to support organisation fields and repeat ordering.
- Farmish can use product imagery eventually, but the current database cannot store it yet.
- Quote acceptance is likely needed, but not currently implemented in the codebase.
- Public browsing before authentication would improve conversion, but it requires proxy/routing changes and local cart persistence.

# Generated Redesign Assets

## A. Redesign Brief

Redesign Farmish into a conversion-focused quote-request platform for fresh Ghanaian produce. The primary experience should help customers understand the quote model, browse produce quickly, select quantities, submit a delivery request, and return to review quotes and status updates.

The design should preserve Farmish's sharp agricultural editorial identity: real Ghanaian farm imagery, off-white surfaces, deep green accents, black navigation, squared controls, condensed uppercase headings, and dense operational clarity. It should not become a generic grocery marketplace with rounded cards and fixed-price checkout.

Key redesign goals:

- Explain the quote model before users encounter missing prices.
- Let users browse products before forcing sign-in where technically feasible.
- Improve mobile ordering with search, category tabs, quantity steppers, and cart bottom sheet.
- Unify orders and quotes so every quote is visible from its related order.
- Make dashboards action-oriented: pending quote, quote ready, in progress, delivered.
- Make admin screens faster for quote creation and fulfillment tracking.

Primary success metric:

- More completed quote requests from landing/order visitors.

Secondary success metrics:

- Fewer abandoned order forms.
- Faster admin quote creation.
- More customers returning to view quotes.
- Fewer support questions about missing prices or order status.

## B. UX Diagnosis

High-priority UX issues:

- Authentication blocks ordering too early. Users must sign in before they can browse products or understand the catalog.
- The quote-based model is under-explained. Users may interpret missing prices as broken or incomplete.
- Product discovery is functional but visually thin. Text-only product rows do not communicate freshness, quality, or product range.
- Mobile ordering is not optimized. Quantity typing and sticky sidebar patterns are weaker on small screens.
- Quotes are separated from orders. This adds cognitive load and makes quote follow-up easier to miss.
- Dashboard hierarchy is off. Profile data appears before the main order/task context.
- Status timeline lacks timestamps, current-stage emphasis, and next-step guidance.
- Admin quote builder is practical but wide. It needs responsive behavior and stronger review/submit affordances.

What is already strong:

- Clear quote-based data model.
- Useful product categories.
- Working customer and admin workflows.
- Export functionality.
- Email and Telegram notifications.
- Strong visual foundation with real imagery, typography, and restrained color.

## C. Prioritized Screen List

1. Landing/home with quote-model explanation and direct "Start an Order" CTA.
2. Product/order screen with category browsing, search, quantity steppers, custom item, and responsive cart.
3. Checkout/auth gate and delivery details.
4. Order success screen with clear next step and expected quote timing.
5. Customer dashboard with active order/quote cards first.
6. Customer order detail with timeline and embedded quote.
7. Customer quote review screen or quote section within order detail.
8. Admin order dashboard with queue filters and priority indicators.
9. Admin order detail with quote/status actions.
10. Admin quote builder with line-item pricing, district, service fee, transport, notes, and total summary.
11. Product management.
12. Login/signup/profile settings.

## D. Component List

Customer-facing components:

- Global top nav with logo, auth state, and mobile menu.
- Hero section with real farm image, CTA, trust strip, and quote-model summary.
- How-it-works strip: Select, We Quote, You Confirm, We Deliver.
- Category tabs or segmented category filter.
- Product search input.
- Product card with name, category, unit badge, optional image, quantity stepper.
- Custom item request form.
- Desktop cart panel.
- Mobile cart bottom sheet with item count and submit CTA.
- Delivery details form.
- Order success confirmation.
- Order status badge.
- Order timeline with current stage and timestamps.
- Quote summary card with subtotal, service fee, transport, total.
- Quote line item table/card.
- Empty state card for no orders/no quotes.
- Profile summary/edit dialog.

Admin components:

- Admin side/top navigation.
- KPI stat tiles.
- Queue filter tabs.
- Search and export toolbar.
- Responsive order table and mobile order cards.
- Status update modal.
- Customer/delivery info panel.
- Admin quote builder table.
- Quote item row with district select, unit price input, total.
- Sticky quote total summary.
- Product table with availability toggle.
- Product add/edit dialog.
- Toast/error/success alerts.

## E. Google Stitch Prompt

Design high-fidelity responsive screens for **Farmish**, a Ghanaian fresh produce quote-request platform. Farmish lets households, restaurants, caterers, offices, schools, and institutions request fresh local produce from Ghanaian farms. Customers choose products and quantities without seeing prices, submit delivery details, then Farmish reviews availability, source location, service fee, and transport before sending a quote.

Create a conversion-focused redesign, not a generic grocery checkout. The key customer action is **submit a quote request**.

Brand and visual system:

- Name: Farmish.
- Mood: fresh, Ghanaian, direct, operationally reliable, warm but not cute.
- Use real farm/produce photography prominently, especially on the landing page.
- Palette: warm off-white `#F7F5F0`, white surfaces, ink black `#0F0F0F`, agricultural green `#2D5016`, muted stone `#D9D4C7`, text gray `#5C5751`, muted gray `#9C9690`, with restrained status colors.
- Typography: condensed uppercase headings similar to Barlow Condensed; readable sans body similar to IBM Plex Sans; monospace for order numbers.
- Shape language: square corners, strong black rules, no rounded pill-heavy grocery UI.
- Avoid decorative gradient backgrounds, beige-only layouts, and generic organic leaf icon clutter.

Generate these screens:

1. Desktop landing page: black top nav with logo, hero using real Ghanaian farm image, H1 "Order fresh Ghanaian produce", subcopy explaining quote-based ordering, primary CTA "Start an Order", secondary "How Quotes Work", trust strip with product range/local sourcing/quote review, and a visible 4-step explanation: Choose produce, Farmish reviews, Receive quote, Confirm delivery.
2. Mobile landing page: image-first but CTA visible without excessive scrolling, compact how-it-works strip, persistent top nav.
3. Product/order screen desktop: left/main product browser with search, category tabs, product cards grouped by category, unit badges, quantity plus/minus steppers, selected state in light green; right sticky cart panel with selected items, custom item request, delivery address, notes, and "Submit Quote Request".
4. Product/order screen mobile: category tabs, search, product cards, bottom cart bar showing item count, bottom sheet cart with custom item, delivery details, and submit CTA.
5. Customer dashboard: active orders and quote alerts first, then profile summary, then order history. Use cards on mobile and compact table on desktop. Show statuses pending, confirmed, processing, out for delivery, delivered.
6. Customer order detail: order number, status timeline, item list, delivery info, and embedded quote card with item prices, district, service fee, transport, total, and export button. Make next action clear.
7. Admin order dashboard: dense operational layout with KPI tiles, filters for All/Pending/Confirmed/Processing/Out for delivery/Delivered, search, export, queue emphasis for orders needing quotes.
8. Admin quote builder: desktop table with product, qty, unit, district select, unit price, line total; sticky total summary with subtotal, 5% service fee, transport, grand total, notes, and Create/Update Quote button. Include a mobile line-item card version.
9. Admin products screen: table/list with product name, category, unit, availability toggle, edit action, add product dialog.

UX requirements:

- Explain why prices are not shown at product selection.
- Make quote request feel intentional and trustworthy.
- Optimize mobile quantity selection with steppers, not typing-only inputs.
- Keep quotes connected to orders.
- Make admin screens dense, scannable, and fast for repeated use.
- Include practical empty, loading, and error states where relevant.

## F. Figma Make Prompt

Build a high-fidelity responsive UI prototype for **Farmish**, a Ghanaian farm produce quote-request web app.

Product context:

Farmish sources fresh produce from Ghanaian farms. Customers select products and quantities, provide delivery details, and submit a request. Prices are not shown upfront. Admins review each request, create a quote with item prices, 5% service fee, transport, and district/source details, then update order status through pending, confirmed, processing, out for delivery, and delivered.

Create a practical app UI with these frames:

- Landing desktop and mobile.
- Product/order desktop and mobile.
- Customer dashboard.
- Customer order detail with quote.
- Admin order dashboard.
- Admin quote builder.
- Admin product manager.
- Login/signup.

Design constraints:

- Use square corners throughout.
- Use a warm editorial farm-commerce style: off-white background, black header/rules, deep green accents, white panels, compact tables.
- Use condensed uppercase headings, clear body text, monospace order numbers.
- Use real produce/farm photography placeholders, not abstract illustration.
- Avoid glossy grocery-app styling, rounded pills, and vague marketing blocks.
- Prioritize conversion and operational clarity.

Detailed screen behavior:

- Landing must show the quote model above the fold or immediately below: "Choose produce", "We source and price", "Receive a clear quote", "Confirm delivery".
- Product/order screen must show categories such as Vegetables, Grains & Cereals, Tubers & Roots, Spices & Herbs, Legumes, Fruits, Processed, Oils & Fats, Condiments. Product examples: Maize, Onion, Green Pepper, Cassava, Tomatoes, Tombrown, Ginger, Garlic, Beans, Waakye Leaves, Palm Oil, Plantain, Okro, Cassava Dough.
- Product cards must include name, unit, category, quantity stepper, selected state, and a note that pricing is provided after review.
- Cart must include selected items, custom item option, delivery address, notes, submit quote request button, and clear validation states.
- Customer dashboard must lead with active order cards and quote-ready alerts, not profile details.
- Customer order detail must combine items, delivery details, status timeline, and quote details in one place.
- Admin dashboard must be dense and queue-like with stats, filters, search, status badges, and export.
- Quote builder must make totals impossible to miss: subtotal, 5% service fee, transport, total.

Use sample content:

- Brand: Farmish.
- CTA: Start an Order, Submit Quote Request, Review Quote, Create Quote, Update Status.
- Quote copy: "No upfront prices. Farmish reviews availability, source location, and delivery before sending a clear quote."
- Order number format: ORD-8CHARID.
- Currency: GHS.

Output should be polished enough for developer implementation in Next.js, React, Tailwind CSS, and shadcn-style components.

## G. Developer Handoff Notes

Routing and architecture:

- Current app uses Next `16.2.2` App Router. Read `node_modules/next/dist/docs/` before changing framework conventions.
- Protected routes are controlled by `src/proxy.ts`. Public browse-before-auth requires changing the matcher so product browsing is public while order submission stays protected.
- Keep route groups: `(auth)`, `(customer)`, `admin`.

Data model gaps for redesign:

- Product images require new fields, likely `image_url`, `description`, `origin_note`, and maybe `popular` or `sort_order`.
- Public browse with cart persistence requires local storage or server-side draft orders.
- Quote acceptance/request revision is not implemented. Add statuses or quote action fields if the redesigned quote screen includes accept/reject behavior.
- Quote timing/SLA needs a single product decision before copy is finalized.

Implementation priorities:

1. Unify brand naming from "Farm Orders" to "Farmish" across auth, dashboard, metadata, README, and navigation.
2. Resolve quote turnaround copy inconsistency.
3. Refactor `/order` into mobile-first product browser plus responsive cart.
4. Add quote-model explainer to landing and order screens.
5. Merge quote visibility into `/dashboard/[orderId]` or add strong cross-links and alerts.
6. Improve dashboard order cards for mobile.
7. Improve admin dashboard queue states and quote builder responsiveness.
8. Add product image support only after schema and storage plan are defined.

Design system notes:

- Preserve CSS variables in `src/app/globals.css`.
- Keep zero-radius unless client approves a broader design change.
- Use `lucide-react` icons for actions.
- Keep Barlow Condensed, IBM Plex Sans, and IBM Plex Mono.
- Avoid nested cards and decorative backgrounds; use full-width sections and compact panels.

Testing/checks:

- Verify responsive behavior at mobile, tablet, and desktop widths.
- Test authenticated and unauthenticated flows.
- Test order creation, edit, cancellation, quote creation, quote display, status update, product availability toggle, and exports.
- Check Supabase RLS policies before exposing any public product or order draft features.
- Ensure email and Telegram notification failures do not break critical order creation unless intentionally required.

