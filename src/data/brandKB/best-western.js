// Best Western brand knowledge base
// Loaded into Tammy's context when a seller views the Best Western page

export const BEST_WESTERN_KB = `
# BEST WESTERN REFERENCE

## Brand Overview
Best Western Hotels & Resorts (operating as BWH Hotel Group) is a membership-based hotel organization with a global family of brands spanning economy, midscale, upper-midscale, upscale, and boutique/soft-brand segments. Properties are independently owned and governed through a voting membership structure (Voting Members, Governors), which makes selling into Best Western more relationship-driven and membership-focused than traditional franchise brands.

## Brand Family / Tiers
- **Best Western** — Core midscale brand (global flagship)
- **Best Western Plus** — Upper-midscale tier
- **Best Western Premier** — Upscale tier
- **Premier Collection** — Soft brand for upscale independent properties
- **Signature Collection (by Best Western)** — Soft brand for upscale/boutique independents
- **WorldHotels** — Upscale-through-luxury soft-brand collection
- **Aiden (by Best Western)** — Boutique/lifestyle brand
- **Vīb (by Best Western)** — Urban, design-forward midscale lifestyle brand
- **Glo (by Best Western)** — Boutique midscale, purpose-built new builds
- **Executive Residency (by Best Western)** — Extended-stay brand
- **@Home (by Best Western)** — Extended-stay concept
- **SureStay Hotel, SureStay Plus, SureStay Collection, SureStay Studio** — Economy/midscale SureStay family
- **GLō** (same as Glo) and select dual-brand Executive Residency properties

## Loyalty Program
**Best Western Rewards (BWR)** — Global loyalty program. Rate plan "BW" is mandatory at all hotels and gives members minimum 10% off RACK with standard cancel policy mirroring RACK. Members can redeem free nights (rate plan **FX**) where point levels (8,000-36,000) are set monthly based on the hotel's trailing 3-year ADR for that month. Properties must allocate a minimum of 4% of inventory to FX (min 2 rooms/night) and are reimbursed a flat $30 or 30% of ADR (whichever is greater, tax-inclusive) for each free night redeemed. Hotels that supply 300+ FX nights in a fiscal year (Dec 1-Nov 30) earn a bumped $45/45% reimbursement. Rate plan **VR** awards 1,000 bonus points per night (cost to hotel $5.50 per 1,000 points). Status match programs are run periodically via BWR marketing.

## Key Systems & Portals
- **MemberWeb** (main property portal): https://hotelsso.bwhhotelgroup.com/app/bwhhghotels_hotelportal_2/exk6f3mt59nCXFS4V4x7/sso/saml — Corporate ID lookups, Business Advantage signup, Arrivals lists, Corp Accounts report, revenue management
- **QuickSight** — End-of-month reporting, prospecting. Key reports: "RM-Lead Generation" (email domain 30/60/90 + recent stays) and "RES-Marketing Statistics – YTD/Month by Company/Rate Code"
- **STR Benchmarking** — Accessible via MemberWeb top-right drop-down
- **Nexus** — RFP tool used for corporate RFPs, blackout-date submissions, and solicitations
- **PDS (Property Data System)** — In MemberWeb under Property Data; used for product/package loading and annual solicitations (e.g., FI, EP)
- **my.bestwestern.com** — Corporate resource hub (training, partnerships, program details)
- **Brand Portal / Sales Toolkit**: https://hotel.bwhhotelgroup.com/content/hotel/en/n-america/sales/resources/gbl/sales-toolkit.html
- **Sales Champion email distribution**: https://hotel.bwhhotelgroup.com/content/hotel/en/n-america/sales/resources/mem/sales-champion.html — All WWS group and transient leads flow here. Request access: https://bwicommunications.com/forms/sales-champion/
- **EDS (Electronic Distribution Services)**: https://hotel.bwhhotelgroup.com/content/hotel/en/n-america/operations/eds/gbl/eds-forms.html — Email EDS@bestwestern.com for rate changes, blackout dates, linked-plan updates
- **Business Advantage**: https://hotel.bwhhotelgroup.com/content/hotel/en/n-america/sales/programs/gbl/bw-business-advantage.html
- **Group Planners Advantage**: https://hotel.bwhhotelgroup.com/content/hotel/en/n-america/sales/programs/gbl/planners-advantage-program.html
- **eLeads** — Delivered in MemberWeb for group RFPs (10+ rooms) and Worldwide Sales leads

## Rate Plans & Programs
**Flexible / Required**
- **RACK** — Base "Flexible Rate" (formerly BAR). Required for all room types; controls most linked children.
- **BW** — Best Western Rewards Rate (min 10% off RACK)

**Leisure**
- **3A** — AAA/CAA (min 10% off, linked with RP and CK)
- **CK** — Costco (mirrors 3A)
- **RP** — AARP/Senior (mirrors 3A)
- **HY** — Harley-Davidson (min 10% off)
- **LC** — Network Partner Rate (Lockheed, Halliburton, Tyson, etc.)
- **FI** — Global F.I.T. (net, tour program, tax-inclusive, V-Card/Central Bill)
- **92** — Aeroplan (linked 10% above FI)
- **LP1** — Leisure Plan (B2B distributors only)
- **Z9** — VIP Dynamic Net Rate (min 25% off RACK, e-channels only)
- **MR, NN (Facebook), QB (TripAdvisor)** — Property-managed promotions

**Corporate**
- **BBSN** — Best Business Select: 100-499 room nights/year, 10% off RACK
- **BBRN** — Best Business Regional: 500-999 room nights domestic, 15% off RACK
- **XN/XW** — BBW (Best Business Worldwide): 500+ domestic / 1,000+ worldwide room nights. XN is non-commissionable (10% off XW); XW is commissionable (10% off RACK)
- **Z7** — BW Business Advantage: No minimum, SMB-focused, one shared corporate ID
- **X1 / Z2** — Strategic Partnership Accounts (Primary 25% off / Secondary 19% off)
- **BBWE (X/Z varies)** — Best Business Worldwide Elite: 100+ room nights committed, flat negotiated or 15% off
- **X/Z Negotiated** — Property-level negotiated rates via Nexus RFP or self-load via EDS
- **XZ** — Travel Agent Chain & Consortia: 10% off, $3/stay fee on pay-per-stay partners

**Government**
- **GM** — Federal/Military (per-diem based, www.gsa.gov)
- **SG** — State Government
- **CG** — Canadian Government (RFP via Nexus, $150 fee Canadian properties)

**Promotions**
- **2U** — Advance Purchase (non-refundable, full pay)
- **9Q / LO** — Multi-Night Stay (9Q min typically 3 nights, LO for 5+)
- **ES1-3** — Extended Stay (7-13, 14-29, 30+ nights; required for Executive Residency)
- **OI** — Limited Time Offer (promo code only, min 15% off RACK)
- **WS** — Best Value (full pay, min 10% off)

**OTA / 3rd Party**
- **15A-E** — OTA Preferred Partner (linked: 15A=RACK, 15B=WS, 15C=9Q, 15D=2U)
- **BK1-9** — Booking.com rate plans
- **EC1-9 / EX1-5** — Expedia (Expedia Collect / Hotel Collect)
- **ECR / EPR** — Egencia Preferred (Collect / Hotel Collect)
- **PKG** — OTA Package Rate
- **PL / PLZ / D2** — Opaque (Priceline, etc.)
- **SR1-9** — OTA Sell Rates
- **X2** — Net Rate and Dynamic Tour

**Special**
- **EP** — Employee Rate (50% off, cap $100, 2% min allocation)
- **FF** — Friends & Family (min 25% off, tied to X2)
- **TA** — Travel Agent Discount (50% off NA, valid IATAN)
- **Packages** — Load via MemberWeb > PDS > Rates > Packages

**Groups / 2-Way**
- **1G-99G, 0001-9999** — Group 2-Way balancing
- **HP** — House Plan

Groups: 6-9 rooms booked directly by CRO; 10+ rooms delivered to hotel via eLeads in MemberWeb (notifications go to Sales Champion email).

## Sales Support
**HSO (Hotel Sales Organization)** — Best Western's centralized sales support team. Structure per hotel includes:
- **HSO Manager** (district lead)
- **HSO Sr. Manager** (senior district or brand-segment lead)
- **HSO Consultant** (day-to-day sales consultant)
- **HSO Specialist** (execution / support)

Leadership (current as of Jan 2026):
- Heather Bailey — Managing Director of Sales (Heather.bailey@bwh.com, 602-780-6763)
- Lindy Copp, Lauren Reichardt — Associate Program Managers

District structure (Districts I-VII plus Canada, Glo, Executive Residency & @Home, SureStay, Boutique/Upscale, Pre-Activation). Each district has its own HSO Manager and shared Consultant/Specialist pool. See HSO Contact List: https://hotel.bwhhotelgroup.com/content/hotel/en/n-america/sales/resources/gbl/hotel-sales-optimization.html

**Property-side revenue team**:
- **PRM (Property Revenue Manager)** — Assigned RM for each hotel; first call for rate strategy, FX level questions, and promotion strategy
- **RSM (Regional Services Manager)** — Broader regional coverage
- **Governor / Voting Member** — Owner-level representatives in Best Western's membership governance

## Sales Process
1. Introduce yourself to the hotel's assigned HSO Manager/Consultant and PRM. Get on the RM's bi-weekly call summary distribution.
2. Get added to the **Sales Champion** email distribution so all WWS group and transient leads copy you. Use the Sales Champion email for any portal logins you create so credentials stay with the hotel.
3. Confirm room types with the PRM before sending EDS forms (EDS form room codes differ from PMS room codes — resolve upfront to save days).
4. Use the **Sales Toolkit** and **Brand Portal > Sales** tab for program info, Cvent portals, Sales Community Calls, and market segment resources.
5. For new corporate accounts: determine whether they fit BBW, BBSN, BBRN, BBWE, or Z7 (Business Advantage) based on night volume, then load via Nexus RFP or EDS.
6. For groups, monitor eLeads in MemberWeb and respond promptly.
7. When changing rates in PMS, notify EDS (and the Booking.com Account Manager if 2-Way connected) so linked child plans stay in parity.

## Key Acronyms & Terms
- **HSO** — Hotel Sales Optimization (Best Western's sales support org)
- **PRM** — Property Revenue Manager
- **RSM** — Regional Services Manager
- **BWR** — Best Western Rewards
- **BBW / BBSN / BBRN / BBWE** — Best Business Worldwide / Select / Regional / Worldwide Elite
- **EDS** — Electronic Distribution Services (rate loading team, EDS@bestwestern.com)
- **PDS** — Property Data System (in MemberWeb)
- **CRO** — Central Reservations Office
- **LRA / NLRA** — Last Room Availability / Non-LRA
- **BAR** — Best Available Rate (legacy name for RACK/Flexible Rate)
- **PBM** — Performance Based Marketing (10% commission on digital channel bookings)
- **WWS** — Worldwide Sales
- **eLeads** — Group lead delivery tool in MemberWeb
- **Nexus** — Best Western's RFP platform
- **BWH** — BWH Hotel Group (parent company brand name, used in email domains @bwh.com)

## Chain Codes (GDS)
- **BW** — Best Western International (main brand family GDS chain code per CCRA reference)

## National Accounts / Corporate IDs
Best Western is not listed as a separate column in the primary "National Accounts – Corporate ID Numbers – All brands.xlsx" reference (that file covers Starwood, Marriott, IHG, Hilton/HGI, Hampton/Homewood/Doubletree/Embassy, Hyatt, and Wyndham). For Best Western national account CIDs and BBW/BBSN/Z7 client IDs, pull from **MemberWeb > Reports > Corp Accounts** or request from the PRM/HSO Consultant. Major managed accounts driving LC/BBW volume include Lockheed Martin, Halliburton, Tyson Foods, Minor League Baseball, and Royal Canadian Legion.

## Common Questions & Quick Answers

**Q: Where do I load a new negotiated corporate rate?**
A: Through **Nexus** for RFP-driven accounts, or by downloading the Negotiated Rate Form from the EDS page on my.bestwestern.com for property-initiated rates. Rates can be lowered during the year but not raised.

**Q: A corporate client wants to get set up — what program fits?**
A: Under 100 RN/year → Z7 Business Advantage (no minimum). 100-499 RN → BBSN (Best Business Select). 500-999 domestic → BBRN. 500+ domestic or 1,000+ worldwide → XN/XW (BBW). 100+ committed to one property → BBWE.

**Q: How do I submit blackout dates?**
A: Email EDS@bestwestern.com. Most LRA rate plans allow 30 days in up to 10 periods; 3A/CK/RP/HY/BW allow 15 days; CG allows 7. FX (Rewards free nights) allows no blackouts.

**Q: The hotel's FX level seems off — who sets it?**
A: Best Western Rewards sets FX point levels monthly based on the hotel's trailing 3-year average ADR for that month. Levels range from 8,000 (≤$55 ADR) to 36,000 (≥$191 ADR). Ask your PRM if you think it's miscalculated.

**Q: What's the Sales Champion email and why do I need access?**
A: It's the hotel's central inbox for all Worldwide Sales group and transient leads plus eLeads notifications. Request to be added via https://bwicommunications.com/forms/sales-champion/ so you see every lead.

**Q: How do group leads work?**
A: 6-9 rooms → booked by CRO directly. 10+ rooms → delivered to the hotel via eLeads in MemberWeb with notification to the Sales Champion email. The property negotiates and contracts directly with the client.

**Q: Who is my HSO contact?**
A: Check the HSO Contact List at hotel.bwhhotelgroup.com (Sales > Resources > Hotel Sales Optimization). Your HSO team depends on the hotel's district (I-VII, Canada, or segment-specific for Glo, SureStay, Exec Residency, Boutique/Premier/Vīb).

**Q: How do I find a corporate ID or national account profile?**
A: In MemberWeb, go to Reports > Corp Accounts to review all BW National Accounts. You can also use the Corporate ID lookup in MemberWeb.

**Q: Who handles Booking.com and OTA rate issues?**
A: For rate-plan builds and cancel policy changes on BK/EC/EX/15A-E plans, email connectivity@bestwestern.com and EDS@bestwestern.com. If the hotel is 2-Way connected via DerbySoft, also notify the Booking.com Account Manager.

**Q: What's the difference between a Voting Member and a Governor?**
A: Both are owner-level roles in Best Western's membership governance. Voting Members vote on brand ballots (agreements, fees, programs); Governors serve on the elected board representing districts.

**Q: What fees apply to reservations?**
A: GDS bookings carry a $7.90 per-booking GDS fee. 3rd-party bookings via Pegasus/HBSi/Cangooroo are $4.60. XZ (Chain & Consortia) has a $3/night pay-per-stay fee. Expedia/Booking.com via DerbySoft is $2/booking. PBM (Performance-Based Marketing) is 10% commission on approved digital-channel bookings.
`;
