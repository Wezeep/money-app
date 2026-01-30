Build this product using the complete BuildKit specification below.

PRODUCT OVERVIEW:
Kickoff helps International diaspora users and expatriates aged 20-45 in emerging markets and developing economies who send money across borders 2-5+ times monthly to support families or pay international obligations, regularly split expenses with friends socially, and pay bills online; employed professionals or entrepreneurs valuing instant settlement speed, transparent pricing with clear fee/exchange rate visibility, social integration for sharing payment requests and splitting bills, multi-currency flexibility, and consolidated money management within a single platform. solve International diaspora users and expatriates aged 20-45 in emerging markets currently fragment their money movement across multiple apps—juggling separate platforms for remittances, bill payments, expense splitting, and local transfers. They experience hidden fees, poor exchange rate transparency, slow settlement (1-3 days with traditional banking), and lack of engaging social features. This multi-app friction reduces their ability to consolidate finances and understand true transaction costs. by Wezeep provides a unified mobile-first platform consolidating international transfers, local P2P payments, bill payments, and bill splitting with three core differentiators: (1) Speed—instant settlement in seconds through native Wezeep Wallet as primary delivery method versus traditional 1-3 day bank transfers; (2) Cost—flat transaction fees on transfers and competitive forex margins on conversions with transparent fee/exchange rate display at every step; (3) Social Functions—integrated P2P requests with group sharing (WhatsApp, Messenger, SMS, Email), gamified rewards with personalized seasonal messaging ('One more transfer for coffee on us!', Valentine's themes in February), and bill splitting with group links and playful community messaging. The home screen displays wallet balance in both USD and local currency with privacy toggle for public settings, monthly send/receive analytics, reward progress with personalized earning instructions, and customizable CTAs based on seasonal offers. Core MVP flows deliver: Send Money (international country picker, recipient search with recent 3 contacts as clickable bubble avatars, dual-currency display showing exchange rates and flat transaction fees, multiple delivery methods defaulting to Wezeep Wallet with 'Fastest & works for USD/local!' badge, automatic fallback to secondary payment methods if primary has insufficient balance), P2P Requests (shareable links with fixed or variable amounts, 45-second expiration for open-amount requests, social sharing with WhatsApp/Messenger/SMS/Email), Bill Payments (QR code scanning, Wezeep ID entry, or search limited to pre-registered system vendors only, tip options, custom transaction tagging), and Split Bills (equal or custom split calculator, group link generation with multi-recipient support up to 100 participants, QR code collection, editable amounts post-creation, unpaid split reminders). All screens feature persistent bottom navigation (Home, Contacts, Wallet, Rewards), dynamic personalization injecting recipient names into transaction flow prompts (e.g., 'How would you like to pay John?'), comprehensive confirmation pages summarizing sender details, conversion/fees breakdown, delivery method with speed estimate, recipient details, and payment method before final confirmation. Technical performance targets: API responses under 200ms with 60fps animations across all interactions. Real-time FX rate updates refresh every 30-60 seconds with automatic re-acceptance prompt if rates shift >1% between quote and confirmation. System persists transaction drafts if app closes during confirmation (resumable within 24-hour window), verifies payment method balance before confirmation with display of alternative available balances if insufficient funds, supports fuzzy contact search on names/phone numbers/Wezeep IDs, enables user-defined transaction tagging (minimum 1 tag, maximum 10 tags per transaction) for bill history filtering and analytics, automatically attempts payment method fallback without exposing intermediate failures to user, sends split bill reminders for unpaid participants, and tracks real-time reward progress. Multi-payment provider integration handles balance verification and settlement webhook reconciliation per provider. Recipient delivery method availability determined by country with unavailable options grayed out and 'Not available in [country]' messaging showing ranked alternatives sorted by speed estimate (Instant / <1 hour / 1-2 business days). Monetization via flat transaction fees on transfers (LetAIDecide: 1.5-3% range based on volume tier), forex margins on currency conversions, and bill payment fee structure to be determined post-launch. Architecture requires real-time FX data feed with >1% change detection triggering user re-acceptance, multi-payment provider integration with balance verification and reconciliation webhooks, personalization engine dynamically injecting recipient names at every transaction step, seasonal/promotional message templating with A/B testing support, QR code generation and scanning (containing destination country, Wezeep ID, transaction ID, optional fixed amount, expiration time), group split bill link persistence until marked complete, contact management with fuzzy matching on names/phone/Wezeep ID, transaction tagging system supporting user-defined categories, rate limiting at LetAIDecide: 5-10 requests per minute per user, session management supporting extended login LetAIDecide: 30-90 days with automatic token refresh across transactions without re-authentication, and payment method sequential fallback attempting each method in user-specified order until one succeeds with retry logic never exposing intermediate failures..

BUILD PROCESS:

1. READ COMPLETELY FIRST
   Read all 8 BuildKit sections before writing any code.
   Understand the full picture, edge cases, and priorities.

2. DATA MODEL IS FOUNDATION
   Implement the data model EXACTLY as specified:
   - All tables, fields, and relationships
   - Run migrations and verify schema
   - This is your foundation—everything builds on it

3. REAL IMPLEMENTATIONS ONLY
   - No mock/placeholder/dummy data
   - No TODO comments or partial implementations
   - Build complete, working features
   - For [TBD] items: use reasonable defaults based on context

4. BUILD IN PRIORITY ORDER
   P0 features → P1 features → P2 features
   Complete each feature fully before moving to next:
   - Implement frontend + backend
   - Handle ALL edge cases listed
   - Test the user flow end-to-end

5. PRODUCTION-READY CODE
   - Proper error handling
   - Security best practices (auth, validation, XSS prevention)
   - Edge cases covered

6. TECH STACK
   Use recommended stack: [Frontend] + [Backend] + [Database]
   Adapt if needed for your environment (explain changes)

VERIFICATION:
After each P0 feature, verify it works completely before continuing.

COMPLETE BUILDKIT SPECIFICATION:
# BuildKit

## The Brief

**Revenue Streams:**
- Flat transaction fees on money transfers (percentage LetAIDecide: 1.5-3% range based on volume tier)
- Forex margin on currency conversions (transparent percentage display at each step)
- Bill payment fee structure (deferred to post-launch, system supports dynamic per-vendor or per-method configuration)

**Pricing Strategy:** No premium tier; monetization purely through transaction and conversion fees with transparent disclosure at every step

**Target Markets:** International diaspora and expatriates aged 20-45 in emerging markets and developing economies

## Problem & Solution

**Problem:** International diaspora users and expatriates aged 20-45 in emerging markets currently fragment their money movement across multiple apps—juggling separate platforms for remittances, bill payments, expense splitting, and local transfers. They experience hidden fees, poor exchange rate transparency, slow settlement (1-3 days with traditional banking), and lack of engaging social features. This multi-app friction reduces their ability to consolidate finances and understand true transaction costs.

**Solution:** Wezeep provides a unified mobile-first platform consolidating international transfers, local P2P payments, bill payments, and bill splitting with three core differentiators: (1) Speed—instant settlement in seconds through native Wezeep Wallet as primary delivery method versus traditional 1-3 day bank transfers; (2) Cost—flat transaction fees on transfers and competitive forex margins on conversions with transparent fee/exchange rate display at every step; (3) Social Functions—integrated P2P requests with group sharing (WhatsApp, Messenger, SMS, Email), gamified rewards with personalized seasonal messaging ('One more transfer for coffee on us!', Valentine's themes in February), and bill splitting with group links and playful community messaging. The home screen displays wallet balance in both USD and local currency with privacy toggle for public settings, monthly send/receive analytics, reward progress with personalized earning instructions, and customizable CTAs based on seasonal offers. Core MVP flows deliver: Send Money (international country picker, recipient search with recent 3 contacts as clickable bubble avatars, dual-currency display showing exchange rates and flat transaction fees, multiple delivery methods defaulting to Wezeep Wallet with 'Fastest & works for USD/local!' badge, automatic fallback to secondary payment methods if primary has insufficient balance), P2P Requests (shareable links with fixed or variable amounts, 45-second expiration for open-amount requests, social sharing with WhatsApp/Messenger/SMS/Email), Bill Payments (QR code scanning, Wezeep ID entry, or search limited to pre-registered system vendors only, tip options, custom transaction tagging), and Split Bills (equal or custom split calculator, group link generation with multi-recipient support up to 100 participants, QR code collection, editable amounts post-creation, unpaid split reminders). All screens feature persistent bottom navigation (Home, Contacts, Wallet, Rewards), dynamic personalization injecting recipient names into transaction flow prompts (e.g., 'How would you like to pay John?'), comprehensive confirmation pages summarizing sender details, conversion/fees breakdown, delivery method with speed estimate, recipient details, and payment method before final confirmation. Technical performance targets: API responses under 200ms with 60fps animations across all interactions. Real-time FX rate updates refresh every 30-60 seconds with automatic re-acceptance prompt if rates shift >1% between quote and confirmation. System persists transaction drafts if app closes during confirmation (resumable within 24-hour window), verifies payment method balance before confirmation with display of alternative available balances if insufficient funds, supports fuzzy contact search on names/phone numbers/Wezeep IDs, enables user-defined transaction tagging (minimum 1 tag, maximum 10 tags per transaction) for bill history filtering and analytics, automatically attempts payment method fallback without exposing intermediate failures to user, sends split bill reminders for unpaid participants, and tracks real-time reward progress. Multi-payment provider integration handles balance verification and settlement webhook reconciliation per provider. Recipient delivery method availability determined by country with unavailable options grayed out and 'Not available in [country]' messaging showing ranked alternatives sorted by speed estimate (Instant / <1 hour / 1-2 business days). Monetization via flat transaction fees on transfers (LetAIDecide: 1.5-3% range based on volume tier), forex margins on currency conversions, and bill payment fee structure to be determined post-launch. Architecture requires real-time FX data feed with >1% change detection triggering user re-acceptance, multi-payment provider integration with balance verification and reconciliation webhooks, personalization engine dynamically injecting recipient names at every transaction step, seasonal/promotional message templating with A/B testing support, QR code generation and scanning (containing destination country, Wezeep ID, transaction ID, optional fixed amount, expiration time), group split bill link persistence until marked complete, contact management with fuzzy matching on names/phone/Wezeep ID, transaction tagging system supporting user-defined categories, rate limiting at LetAIDecide: 5-10 requests per minute per user, session management supporting extended login LetAIDecide: 30-90 days with automatic token refresh across transactions without re-authentication, and payment method sequential fallback attempting each method in user-specified order until one succeeds with retry logic never exposing intermediate failures.

**Target Users:** International diaspora users and expatriates aged 20-45 in emerging markets and developing economies who send money across borders 2-5+ times monthly to support families or pay international obligations, regularly split expenses with friends socially, and pay bills online; employed professionals or entrepreneurs valuing instant settlement speed, transparent pricing with clear fee/exchange rate visibility, social integration for sharing payment requests and splitting bills, multi-currency flexibility, and consolidated money management within a single platform.

## Core User Flows

**Name:** Send Money - International Flow

**Steps:**
- User taps 'Send Money' button on home screen
- System presents choice: 'Send worldwide or locally (to other Wezeep users)?'
- User selects 'Send worldwide'
- System opens country picker interface
- User selects destination country
- System displays search bar to find recipients
- User searches for recipient by name or Wezeep ID
- System shows recent 3 recipients as bubble avatars, plus empty bubble to add new contact
- User selects recipient (existing or new)
- System personalizes prompt: 'How much money would you like to send to [recipient name]?'
- User enters amount in their preferred currency
- System displays dual boxes: amount sender pays (with currency) and amount recipient receives after conversion (with currency)
- System displays exchange rate, flat transaction fee breakdown (showing percentage and absolute amount), and refreshes rates every 30-60 seconds
- System asks 'How would you like the recipient to get the money?'
- System highlights 'Wezeep Wallet' as default delivery method with badge 'Fastest & works for USD/local!'
- System lists alternative delivery methods with speed estimates and fees
- User selects delivery method
- System personalizes prompt: 'How would you like to pay [recipient name]?'
- System highlights 'Wezeep Wallet' as default payment method with 'Fastest & works for USD/local!' badge
- System lists alternative payment methods with speed estimates and fees
- User selects payment method
- System verifies sufficient balance in selected payment method
- System displays confirmation page with scannable blocks: sender details (name, Wezeep ID), conversion/fees breakdown (amount sent with currency, exchange rate, flat transaction fee with percentage and absolute amount, FX margin if applicable, total recipient amount with currency), delivery method with speed estimate, recipient details (name, Wezeep ID, country), payment method with available balance verification status
- User reviews and taps 'Confirm' button
- System processes payment through selected payment method provider
- System routes funds through selected delivery method to recipient
- System displays success confirmation with transaction reference and receipt within 5 seconds

**Edge Cases:**
- WHEN user searches for non-existent recipient -> THEN show 'No results found. Create new contact?' with button to add new recipient with fields for name, Wezeep ID, and contact method
- WHEN user has recent recipients -> THEN display recent 3 recipients as clickable bubble avatars above search results for quick selection
- WHEN recipient country does not support selected delivery method -> THEN gray out that option and show 'Not available in [country]. Choose from:' with available alternatives ranked by speed estimate
- WHEN exchange rate fluctuates more than 1% between quote and confirmation -> THEN automatically refresh rate and show 'Exchange rate updated: [old rate] → [new rate]. Tap to accept or go back.' requiring explicit user confirmation before proceeding
- WHEN user has insufficient balance in selected payment method -> THEN show 'Insufficient balance in [payment method]. Available: [balance]. Select another payment method?' with list of alternatives showing available balances
- WHEN payment processing fails on primary payment method -> THEN automatically attempt alternative payment methods in sequence without showing intermediate failures; if all fail show 'Payment failed. Last attempted method: [method]. Tap to retry manually.' with error detail
- WHEN user closes app during confirmation step -> THEN save draft transaction with all entered details and show 'Resume sending $[amount] to [recipient name]?' prompt when reopening within 24 hours; if draft expires after 24 hours prompt user to start new transaction
- WHEN user selects currency different from recipient's home currency -> THEN show dual-currency boxes with conversion rate and FX margin percentage displayed separately
- WHEN multiple delivery methods available for destination -> THEN rank Wezeep Wallet first with 'Fastest & most flexible' badge, then alternatives sorted by speed with estimates and per-transaction fees
- WHEN Wezeep Wallet is selected as delivery method -> THEN show 'Recipient can receive in USD or [their local currency]' note
- WHEN user has not added any payment method -> THEN show 'Add a payment method to send money' with button to add new payment method before proceeding

## Design & UX

**Brand Vibe:** Modern, approachable, and socially conscious. Wezeep feels like a trusted financial companion that makes money movement feel effortless and even enjoyable. The brand balances professionalism (handling real money, transparent fees, instant settlement) with warmth and personality (social features, community-driven, seasonal themes). Think: confident fintech meets friendly community platform. The vibe is inclusive and understanding of diaspora users' financial patterns—never cold or corporate, always human and relatable.

**Tone Of Voice:** Conversational, action-oriented, and encouraging. Speak directly to users with clear, jargon-free language that builds confidence in financial decisions. Use personalization extensively (recipient names injected into prompts like 'How would you like to pay John?') to make interactions feel human. Celebrate milestones with genuine enthusiasm ('One more transfer for coffee on us!') and make fee/exchange rate explanations transparent without overwhelming. For diaspora users, tone is inclusive, supportive, and understanding of their financial goals. Never patronizing—assume users understand money matters and value speed and cost efficiency.

**Visual Aesthetic:** Clean, modern fintech design with social personality. Reference design: Stripe's clarity and precision combined with Venmo's warmth and approachability. Vibrant accent colors for CTAs and seasonal themes (Valentine's red in February, holiday golds during festive seasons) balanced with abundant white space and calm neutral palette for core interface. Data visualization (exchange rates, fees, dual-currency amounts) uses crisp typography with clear visual hierarchy. Currency amounts need visual distinction using subtle background colors, icons, or badges so users immediately understand conversion math. Seasonal/promotional customization visible through color, messaging, and thematic illustrations without disrupting core functionality. Micro-interactions (recipient bubble selection, payment method swipes) feel snappy and responsive. Avatar bubbles for recent 3 recipients should be visually distinct and instantly recognizable.

**Interaction Style:** Immediate, responsive, and feedback-rich. One-tap actions for recent recipients and saved payment methods minimize friction. Real-time exchange rate updates with smooth transitions between quote refresh and confirmation—if rates shift >1%, prompt user to accept new rate. Smooth animations for modal opens/closes and screen transitions (intentional but never gratuitous). Drag-and-drop or swipe patterns for contact bubbles and custom split bill adjustments. Form inputs validate in real-time with visual feedback (green checkmarks for valid amounts, immediate error messaging). Success confirmations feel rewarding but brief using encouraging language ('Money sent!' vs. 'Transaction complete'). Payment method and delivery method selections use visual comparison (side-by-side speed/fee badges) rather than dense text lists. Failed transactions trigger immediate manual retry with clear error explanation and fallback options.

**Layout Philosophy:** Home-first dashboard architecture with clear visual hierarchy. Primary focal points above fold: wallet balance in dual currencies (USD and local) with privacy toggle, monthly send/receive analytics summary, and reward progress with next milestone messaging. Transaction flows follow linear, step-by-step progression with visual progress indicators (e.g., 'Step 2 of 4'). Recent contacts and quick actions (Resume Transaction, Quick Resend, Reminders) prominently featured. Bottom navigation (Home, Contacts, Wallet, Rewards) persistent across every screen, tap-friendly with minimum 48px touch targets. Payment method and delivery method selections use side-by-side visual comparison with clear speed and fee indicators. Confirmation page summarizes everything in scannable blocks with clear visual separation: sender details, conversion/fees breakdown, delivery method + speed estimate, recipient details, payment method. Transaction history pages support filtering and tagging by type for easy navigation.

**Responsive Approach:** Mobile-first design philosophy (primary device for diaspora users and professionals on-the-go). Core transaction flows optimized for 6-inch mobile screens with single-column, thumb-friendly layout. Desktop responsive experience adapts with multi-column layout for transaction history, analytics, and contact management while maintaining mobile-first interaction patterns. Tablet landscape support includes side-by-side dual-currency display and payment method comparison. All touch targets minimum 44px height for easy mobile interaction. Bottom navigation remains sticky on mobile and repositions horizontally on desktop without disrupting transaction flows.

**Accessibility Baseline:** WCAG 2.1 AA compliance as minimum standard. High contrast mode support for all currency amounts, CTAs, and critical information. All transaction flows fully keyboard-navigable (Tab, Enter, Arrow keys sufficient to complete any flow). Color never sole indicator (e.g., fees must include icon or label, not color alone). Screen reader support for exchange rate explanations, fee breakdowns, payment method speed indicators, delivery method comparisons, and seasonal promotional messaging. Semantic HTML and ARIA labels for form inputs and dynamic content. 'Reduce motion' preference respected—disable animations for users with motion sensitivity. Alt text provided for country flags, currency icons, and thematic illustrations. Form error messages clearly associated with inputs and visible to screen readers with proper focus management. Transaction confirmation page scannable by screen readers in logical order: sender info, conversion details, fees, delivery method, recipient info, payment method.

## Data Model

**Name:** User

**Fields:**
- id: uuid, primary key, auto-generated
- email: string, unique, validated, required
- phoneNumber: string, unique, validated, required
- firstName: string, required, max 100 chars
- lastName: string, required, max 100 chars
- weezeeId: string, unique, required, alphanumeric, max 50 chars
- homeCountry: string, required, ISO 3166-1 alpha-2 country code
- preferredCurrency: enum (USD|localCurrency), default USD
- privacyToggleEnabled: boolean, default false, persisted across sessions
- sessionExpiryDays: integer, default 45, range 30-90
- createdAt: timestamp, auto-generated
- updatedAt: timestamp, auto-generated
- lastActivityAt: timestamp, tracks inactivity for session expiration

**Relationships:**
- User has many Wallets (one-to-many, foreign key: userId)
- User has many Transactions as sender (one-to-many, foreign key: senderId)
- User has many Transactions as recipient (one-to-many, foreign key: recipientId)
- User has many PaymentMethods (one-to-many, foreign key: userId)
- User has many Contacts (one-to-many, foreign key: userId)
- User has many MoneyRequests as requester (one-to-many, foreign key: requesterId)
- User has many MoneyRequests as recipient (one-to-many, foreign key: recipientId)
- User has many SplitBills as creator (one-to-many, foreign key: creatorId)
- User has many SplitBillParticipants (one-to-many, foreign key: userId)
- User has one RewardAccount (one-to-one, foreign key: userId)

**Constraints:**
- Email must be unique and RFC 5322 validated
- Phone number must be unique and country-format validated
- Wezeep ID must be unique, alphanumeric, max 50 chars
- First and last names cannot be empty
- Home country must be valid ISO 3166-1 alpha-2 code
- Privacy toggle setting persists across sessions and devices using encrypted storage

## Key Features

**Name:** Home Dashboard - Wallet Balance Display

**Outcome:** Users view their account balance in both USD and local currency at a glance, with option to hide amounts for privacy in public settings

**Constraints:**
- Display wallet balance in dual currencies (USD and user's local currency based on country selection during onboarding)
- Provide privacy toggle to hide/show balance amounts on home screen with persistence across sessions and devices
- Currency conversion uses real-time exchange rates (LetAIDecide: updated every 5/15/60 minutes based on volatility tolerance)
- Local currency determined by user's selected country during onboarding
- Balance data encrypted at rest (LetAIDecide: AES-256 or equivalent)

**Edge Case Behavior:**
- WHEN privacy toggle is enabled -> THEN replace balance amounts with masked dots or 'Hidden' text while keeping currency labels visible
- WHEN user switches between USD and local currency view -> THEN use latest cached exchange rate and show rate timestamp
- WHEN exchange rate fails to load -> THEN display last known rate with 'Rate may be outdated' indicator and retry button
- WHEN user closes app with privacy toggle on -> THEN preference persists across sessions and devices
- WHEN balance updates in real-time -> THEN animate change smoothly (60fps) with visual indicator showing new amount

**Must:**
- Display balance in two currencies simultaneously
- Implement privacy toggle functionality that persists across sessions
- Show real-time exchange rates with timestamp

**Should:**
- Animate balance updates when funds are received
- Display rate timestamp showing when rate was last updated
- Quick-access currency swap button to switch primary display currency
- Show balance loading skeleton while fetching latest rates

**Must Not:**
- Store unencrypted balance data in local storage or browser cache
- Display balance by default in public/demo mode
- Show balance without indicating which currency is primary
- Leak balance visibility setting to external logs or analytics

## What Makes This Special

**Headline:** Wezeep: A unified mobile-first fintech platform consolidating international transfers, local P2P payments, bill payments, and bill splitting with instant settlement, transparent pricing, and social engagement features.

**Differentiator:** Speed

**Description:** Instant settlement in seconds through native Wezeep Wallet as primary delivery method versus traditional 1-3 day bank transfers

**Differentiator:** Cost Transparency

**Description:** Flat transaction fees on transfers and competitive forex margins on conversions with transparent display at every step of transaction flow

**Differentiator:** Social Functions

**Description:** Integrated P2P requests with social sharing (WhatsApp, Messenger, SMS, Email), gamified rewards with personalized seasonal messaging, and bill splitting with group links and playful community engagement

**Target Market:** International diaspora and expatriates aged 20-45 in emerging markets who perform 2-5+ monthly cross-border transfers, value instant settlement, demand transparent pricing with clear fee/exchange rate visibility, and seek consolidated money management in a single platform rather than juggling multiple apps

## Technical Architecture

**Name:** Ayobami

**Email:** ayobami@ayobamiadewole.com



---

## Integration Documentation

*Auto-detected integrations with official documentation links for AI agents and developers.*

### Stripe Payments

- **[Stripe API Reference](https://docs.stripe.com/api)** - Complete REST API documentation
- **[Payment Intents](https://docs.stripe.com/payments/payment-intents)** - Accept one-time payments securely
- **[Subscriptions](https://docs.stripe.com/billing/subscriptions/overview)** - Set up recurring billing
- **[Webhooks](https://docs.stripe.com/webhooks)** - Handle asynchronous payment events

### Supabase

- **[Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)** - Complete JavaScript SDK reference
- **[Authentication](https://supabase.com/docs/guides/auth)** - User authentication and authorization
- **[Database & Queries](https://supabase.com/docs/guides/database/overview)** - PostgreSQL database with Row Level Security
- **[Realtime](https://supabase.com/docs/guides/realtime)** - Subscribe to database changes in real-time

### Twilio

- **[Twilio API Reference](https://www.twilio.com/docs/usage/api)** - Complete API documentation
- **[SMS Messaging](https://www.twilio.com/docs/sms)** - Send and receive SMS messages
- **[SendGrid Email API](https://docs.sendgrid.com/api-reference/how-to-use-the-sendgrid-v3-api)** - Email delivery service

### Redis

- **[Redis Documentation](https://redis.io/docs/)** - In-memory data structure store
- **[Redis Commands](https://redis.io/commands/)** - Complete command reference

### WebSocket

- **[WebSocket API (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)** - Browser WebSocket API reference
- **[Socket.IO Documentation](https://socket.io/docs/v4/)** - Real-time bidirectional communication



Ready to build. Starting with data model.
