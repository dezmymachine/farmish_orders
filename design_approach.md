# Farm Orders - UX-Centered Design Approach

## Executive Summary

Farm Orders is a quote-based agricultural produce ordering platform connecting Ghanaian farmers with customers. This document outlines a comprehensive UX redesign strategy to improve user acquisition, engagement, and conversion.

---

## Current App Flow Analysis

### Customer Journey
```
Landing Page → Sign Up/Login → Order Form → Success → Dashboard → Order Detail → Quotes
```

### Admin Journey
```
Admin Dashboard → Order List → Order Detail → Status Update / Send Quote
```

---

## Identified UX Pain Points

### 1. High Friction at Entry
- **Problem**: Account creation required before viewing products or placing order
- **Impact**: High drop-off rate before users understand value proposition
- **Evidence**: No preview of product catalog; forced authentication barrier

### 2. Unclear Quote Model Communication
- **Problem**: Quote-based pricing model not explained upfront
- **Impact**: User confusion about why no prices are shown; expectation mismatch
- **Evidence**: Hero mentions "quote" but doesn't explain the model

### 3. Product Discovery Limitations
- **Problem**: Plain text grid with no imagery or descriptions
- **Impact**: Low engagement, no emotional connection to products
- **Evidence**: Products displayed as name + unit only; no category landing

### 4. Disconnected Order-Quote Relationship
- **Problem**: Quotes live in separate `/dashboard/quotes` section
- **Impact**: Users miss quotes; poor visibility into order progress
- **Evidence**: Two separate pages with no cross-linking

### 5. Static Status Experience
- **Problem**: Manual page refresh needed to see status changes
- **Impact**: Poor perceived reliability; users don't know when to check back
- **Evidence**: No real-time subscriptions or polling

### 6. Mobile Optimization Gaps
- **Problem**: Tables not responsive; cart sidebar not optimized for mobile
- **Impact**: Poor mobile conversion; 60%+ of users likely on mobile
- **Evidence**: Tables overflow; no mobile-specific layouts

### 7. No Onboarding or Guidance
- **Problem**: First-time users see empty states with no direction
- **Impact**: Confusion about how the platform works
- **Evidence**: Empty dashboard shows "Place Your First Order" but no context

---

## Proposed UX-Centered Approach

### Phase 1: Reduce Entry Friction

#### 1.1 Guest Browse Mode
Allow unauthenticated users to:
- View full product catalog
- Build a cart
- Only require authentication at checkout

```
New Flow:
Landing → Browse Products → Add to Cart → [Auth Gate] → Checkout → Success
```

#### 1.2 Progressive Disclosure
- Show quote explanation modal on first product interaction
- Use inline tooltips explaining "Why no prices?"

#### 1.3 Streamlined Sign-Up
- Reduce form fields to email only (passwordless option)
- Collect delivery details post-order
- Social auth options (Google, Apple)

### Phase 2: Enhance Product Experience

#### 2.1 Visual Product Cards
Replace grid with card-based layout:
```
┌─────────────────────────┐
│ [Product Image]         │
│ ─────────────────────── │
│ Maize                   │
│ Premium Quality         │
│ per kg                  │
│ [Quantity Input]        │
└─────────────────────────┘
```

#### 2.2 Category Landing
Create browsable category pages:
- `/products/grains-cereals`
- `/products/vegetables`
- `/products/spices-herbs`

#### 2.3 Product Search & Filters
- Search bar with autocomplete
- Filter by category, availability
- Sort by popularity (most ordered)

### Phase 3: Unified Order-Quote Experience

#### 3.1 Order Timeline with Integrated Quotes
Replace separate pages with unified order view:
```
Order #ORD-12345
├── Items (expandable)
├── Status Timeline
│   ├── ✓ Pending
│   ├── ✓ Quote Sent [View Quote →]
│   ├── ○ Confirmed
│   ├── ○ Processing
│   ├── ○ Out for Delivery
│   └── ○ Delivered
└── Quote Card (if available)
    ├── Item breakdown with prices
    ├── Service fee breakdown
    ├── Total
    └── [Accept] [Request Revision]
```

#### 3.2 Quote Notifications
- Email notification when quote is sent
- In-app notification badge
- Optional SMS/WhatsApp for quote alerts

#### 3.3 Quote Actions
- Accept quote → moves to "confirmed"
- Request revision → adds notes for admin
- Compare multiple quotes side-by-side

### Phase 4: Real-Time Status Tracking

#### 4.1 Live Status Updates
- Supabase Realtime subscriptions for status changes
- Visual progress bar with animations
- Estimated time to next status

#### 4.2 Status Notifications
- Push notification when status changes
- Email digest for daily status summary
- Telegram notification option for customers

#### 4.3 Delivery Tracking
- Map integration for "Out for Delivery"
- Driver contact info when applicable
- Estimated delivery time window

### Phase 5: Mobile-First Redesign

#### 5.1 Responsive Tables → Cards
On mobile, transform tables to stacked cards:
```
┌─────────────────────────┐
│ ORD-12345               │
│ 12/05/2026              │
│ 5 items                 │
│ [PENDING]               │
│ [View] [Edit] [Cancel]  │
└─────────────────────────┘
```

#### 5.2 Bottom Sheet Cart
Replace sidebar with slide-up bottom sheet:
- Always visible "View Cart (3 items)" button
- Swipe up to see full cart
- Swipe down to continue browsing

#### 5.3 Touch-Optimized Inputs
- Larger touch targets (min 44px)
- Stepper buttons for quantity (+ / -)
- Swipe gestures for common actions

### Phase 6: Onboarding & Education

#### 6.1 Welcome Flow
For new users:
```
Step 1: "How it works"
┌─────────────────────────┐
│ 📋 Browse & Order       │
│ Select products,        │
│ no prices shown yet     │
└─────────────────────────┘

Step 2: "We review"
┌─────────────────────────┐
│ 💰 Get Your Quote       │
│ Within 24-48 hours,     │
│ we send pricing         │
└─────────────────────────┘

Step 3: "Confirm & receive"
┌─────────────────────────┐
│ 🚚 Track Delivery       │
│ Real-time updates       │
│ to your door            │
└─────────────────────────┘
```

#### 6.2 Contextual Tooltips
- First product click: "Add quantity and we'll include it in your quote"
- First cart view: "We'll review your order and send pricing within 24-48 hours"
- First quote view: "Accept to confirm your order, or request changes"

#### 6.3 Empty State Guidance
Replace "No orders yet" with:
```
┌─────────────────────────┐
│ 🌱 Start Your First     │
│    Order                │
│                         │
│ Browse fresh produce    │
│ from Ghanaian farms     │
│                         │
│ [Browse Products]       │
└─────────────────────────┘
```

---

## Information Architecture Redesign

### Current Structure
```
/
├── login
├── signup
├── order (product grid + cart)
├── dashboard
│   ├── [orderId]
│   └── quotes
└── admin
    ├── products
    └── orders/[orderId]
```

### Proposed Structure
```
/
├── products (browse without auth)
│   └── [category]
├── cart (persisted locally)
├── checkout (auth gate here)
│   ├── auth (login/signup inline)
│   └── delivery
├── account
│   ├── orders
│   │   └── [orderId] (includes quotes)
│   ├── profile
│   └── settings
├── admin
│   ├── dashboard
│   ├── orders
│   │   └── [orderId]
│   └── products
└── auth
    ├── login
    └── signup
```

---

## Component-Level Improvements

### Order Form Redesign

**Current Issues:**
- Products grouped by category but visually flat
- No indication of product availability
- Quantity input is small and easy to miss

**Proposed Changes:**
1. Category tabs at top for quick navigation
2. Product cards with subtle shadows
3. Prominent quantity stepper: `[-] 5 [+]`
4. "Added to cart" animation feedback
5. Floating cart preview: `3 items | View Cart`

### Dashboard Redesign

**Current Issues:**
- Profile buried in dashboard
- Order actions not prominent
- Status badges lack visual hierarchy

**Proposed Changes:**
1. Split into tabs: Orders | Profile | Settings
2. Order cards with primary action button
3. Color-coded status with icons:
   - Pending: amber clock icon
   - Confirmed: blue check
   - Processing: purple gear
   - Out for Delivery: orange truck
   - Delivered: green check

### Quote Presentation

**Current Issues:**
- No clear total prominence
- No action to accept/confirm
- Service fee breakdown hidden in table

**Proposed Changes:**
1. Hero number: Large, prominent total
2. Clear breakdown:
   ```
   Subtotal:      GHS 150.00
   Service Fee:   GHS   7.50
   Transport:     GHS  20.00
   ─────────────────────────
   TOTAL:         GHS 177.50
   ```
3. Primary CTA: "Accept & Confirm Order"
4. Secondary: "Request Changes"

---

## Technical Implementation Notes

### Real-Time Updates
```typescript
// Subscribe to order status changes
const channel = supabase
  .channel('order-updates')
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'orders',
    filter: `user_id=eq.${userId}`
  }, (payload) => {
    updateOrderStatus(payload.new)
  })
  .subscribe()
```

### Guest Cart Persistence
```typescript
// Store cart in localStorage before auth
const guestCart = useLocalStorage('guest_cart', [])

// Merge on auth
async function mergeGuestCart(userId: string) {
  const localCart = localStorage.getItem('guest_cart')
  if (localCart) {
    await syncCartToDatabase(userId, JSON.parse(localCart))
    localStorage.removeItem('guest_cart')
  }
}
```

### Progressive Form
```typescript
// Multi-step checkout
const steps = ['review', 'auth', 'delivery', 'confirm']
const [currentStep, setCurrentStep] = useState(0)

// Only require auth at step 1
if (currentStep === 1 && !user) {
  return <AuthGate onSuccess={() => setCurrentStep(2)} />
}
```

---

## Success Metrics

### User Acquisition
- Reduce signup-to-order time by 50%
- Increase guest-to-registered conversion by 30%

### Engagement
- Increase orders per user by 20%
- Reduce quote acceptance time by 40%

### Satisfaction
- Target NPS score of 50+
- Reduce support inquiries about pricing by 60%

---

## Implementation Priority

### P0 - Critical (Week 1-2)
1. Quote explanation on landing page
2. Order-quote unified view
3. Mobile table → card transformation

### P1 - High (Week 3-4)
1. Guest browse mode
2. Real-time status updates
3. Product card redesign

### P2 - Medium (Week 5-6)
1. Onboarding flow
2. Category pages
3. Search & filters

### P3 - Nice to Have (Week 7+)
1. Delivery tracking map
2. WhatsApp notifications
3. Product imagery

---

## Design System Updates

### New Components Needed
- `ProductCard` - Visual product display
- `OrderCard` - Mobile-friendly order summary
- `QuoteCard` - Prominent quote display
- `StatusTimeline` - Animated progress indicator
- `BottomSheet` - Mobile cart container
- `OnboardingStep` - Welcome flow step
- `EmptyState` - Guided empty states

### Enhanced Components
- `Badge` - Add icons to status badges
- `StepperInput` - Replace quantity number input
- `Toast` - Real-time notifications
- `Skeleton` - Better loading states

---

## Conclusion

This UX-centered approach prioritizes:

1. **Lowering barriers** - Let users browse before committing
2. **Clear communication** - Explain the quote model upfront
3. **Unified experience** - Bring quotes into the order flow
4. **Real-time feedback** - Show progress, not just states
5. **Mobile-first** - Design for the primary device

By implementing these changes, Farm Orders will transform from a functional tool into an engaging platform that users trust and enjoy using.
