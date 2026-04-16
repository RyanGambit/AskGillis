// Choice brand knowledge base
export const CHOICE_KB = `
# CHOICE REFERENCE

## Brand Overview
Choice Hotels International is a global franchisor with 22 distinct brands and more than 7,400 hotel locations worldwide, spanning economy, midscale, upscale, and extended stay. Choice competes primarily on franchise flexibility, its Choice Privileges loyalty program (nearly 38 million members), and strong penetration in secondary and tertiary markets.

## Brand Family / Tiers
- Upscale / Premium: Cambria, Ascend Hotel Collection, Radisson (Choice acquired), Radisson Blu, Radisson RED
- Upper Midscale: Comfort, Comfort Inn, Comfort Suites, Country Inn & Suites, Clarion Pointe
- Midscale: Quality Inn, Clarion, Country Inn & Suites
- Economy: Sleep Inn, Econo Lodge, Rodeway Inn, Park Inn by Radisson
- Extended Stay: MainStay Suites, Suburban Studios, WoodSpring Suites, Everhome Suites, Cambria Suites

## Loyalty Program
Choice Privileges — Choice's award-winning rewards program with ~38M members. Members redeem points for free nights (177M+ redeemed since 1998), gift cards, and airline miles. Hotels must support CP member rates (SCPM) and member-exclusive Advance Purchase rates (SAPR1M / SAPR2M).

## Key Systems & Portals
- ChoiceConnect (brand portal): https://choicehotels.okta.com/ — OKTA SSO required. Houses Resources, Brand Standards, EasyBid, Global Sales tools.
- Choice Central: Brand portal content — SNP/SPC reports, IATA/PCC reports, Rates Center, Global Sales section.
- Choice Advantage (Cloud PMS): www.choiceadvantage.com — reservations, availability, rate, reports, groups.
- ChoiceMax: Comprehensive Revenue Management System (RMS). Requires OKTA and property-granted access. Overview: connect.choicehotels.com/resources (00346-ChoiceMax-Overview).
- Rates Center: https://ratecenter.choiceadvantage.com/ — where Rate Buckets and Rate Plans are created (1 bucket can link to multiple plans).
- ChoiceNOW: Trouble tickets, platform access requests, forms. Accessed via OKTA dashboard.
- Smart Marketing: Brand-compliant local marketing templates. Access request required.
- Medallia: Source of LTR (Likelihood to Recommend) score used by Choice Global Sales.
- CVENT Transient (formerly Lanyon): RFP/business case platform — https://supply.lanyon.com/supplier/loginsupplyportal.aspx
- Rates and Inventory (Everhome): https://apps.choicecentral.com/ratesinvedge/Home.do — via "My Apps" in ChoiceConnect.
- EasyBid: Group RFP tool inside ChoiceConnect — shared view of group RFPs, status tracking, team coordination.

## Rate Plans & Programs (SRPs)
Rate Plan Code conventions:
- Begins with S = Chain Discount (Choice-managed SRP)
- Begins with L = Local Negotiated Rate (LNR)
- Begins with N = National Account

Key SRPs sellers use daily:
- SPC — Choice VIP Preferred Rate. 10% off BAR, commissionable to travel agents (10%), last-room availability. For mega travel agencies, consortia, key corporate.
- SNP — Choice Net VIP Rate. 10% below SPC, net/non-commissionable. Required when SPC is offered. Automatically recalculates when SPC changes.
- SCR — Choice Business Rate. Minimum 5% off BAR (up to 10%), 10% commissionable. For small/medium corporates (<1,000 room nights/yr), requires valid client ID.
- SC5 / SC10 / SC12 / SC15 — Preferred Customer Savings (Mandatory). 5%/10%/12%/15% off BAR, commissionable, for volume-qualified accounts.
- SN15 — Net version of SC15 (non-commissionable).
- SAPR1 / SAPR2 — Advance Purchase (3/7/14/21/30 day). 5%, 10%, or 15% off BAR. Prepaid, non-cancellable. SAPR1M / SAPR2M are member-only variants with added SCPM discount (3-7%).
- SAPR1A/B/G/H/X/P, SAPR2A/B/G/H/X/P — OTA Advance Purchase variants (Agoda, Booking.com, FastPayHotels, GetARoom, Hotelbeds, Expedia, Hopper).
- SBAR — Best Available Rate (non-bookable; feeds Bing Hotel Ads).

Update SPC/SNP discount levels: https://choicehotels.service-now.com/hp?id=sc_cat_item&sys_id=b35bbc84dbbcbf407d3c751c8c9619cd

Direct Pay — Launched August 2022. Not bookable locally on-property; books via choicehotels.com, mobile, GDS, Choice contact centers. Participating hotels get sort-order priority on CID searches.

## Sales Support
- CHI Sales / Global Sales: Handles national, global, and intermediary accounts (AAA, Association, Corporate, Diversity/Religious/Fraternal, Government/Military, Leisure/Motor Coach, Mega Agency & Consortia, Sports, Transportation).
- GAD (Global Account Director): Single account contact for preferred corporate relationships.
- NAM (National Account Manager): Similar function, national scope.
- BPC (Brand Performance Consultant): Hotel-facing consultant, helps with reports, program participation, STAR/Hotelligence access.
- AD (Area Director, US) / RD (Regional Director, CAN): Primary brand contact for RDOS outreach.
- ChoiceRM: Revenue Manager Program through Choice (Area Director, Revenue Manager).
- Inside Sales: Handles group leads (Choice does NOT use Meeting Broker). Email InsideSales@choicehotels.com with property name + INN code to join group lead distribution.
- askglobalsales@choicehotels.com — general Global Sales questions.
- Corporate.RFP@choicehotels.com / (844) 779-8474 — business case and RFP questions.
- RFPSupport@choicehotels.com — new-opening business case requests outside qualifying season.

## Sales Process
Local Sales Handbook structure (what sellers execute):
1. Establish Goals & Objectives — break annual goal into quarterly/monthly; match goals to costs (expect ~5:1 ROI on sales/marketing spend).
2. Understand the Market — SWOT, competitive assessment, CVB / Chamber involvement.
3. Prospecting — identify lead sources internally (front desk intel, existing customers) and externally (Hotelligence, STAR, Travel Agents site on choicehotels.com).
4. Qualifying — gather Company Info, Past Practices, Business Potential, Situational Factors, Objectives.
5. Sales Call — Prospect > Open > Qualify > Identify Needs > Handle Objections > Interest Assessment > Fact Find > Demonstrate > Close.
6. Shifting Share — "Bullseye Board," competitor lot checks, rate shops, walked-guest retention.
7. Measuring — monthly review with BPC / front desk; track via ChoiceAdvantage and Hotelligence.

Business Case / RFP Process (CVENT Transient / Lanyon):
- 2026 RFP Qualifying Season: April 1 – April 30. Start prep in March.
- Standard allotment: 10 business cases per hotel, regardless of LTR score.
- New hotels: up to 25 business cases within 6 months of opening (one-time courtesy). Cases after qualifying season go to RFPSupport@choicehotels.com.
- Accepted business case only guarantees the hotel is presented to the client for possible RFP inclusion — not guaranteed inclusion.

Group Bookings:
- Choice does NOT use Meeting Broker.
- Group leads flow through Choice Inside Sales > RFPs to hotels > managed in EasyBid.

LNR Setup:
- Rate Bucket built first (holds % or rate), then Rate Plan (one per contract) linked to Company Profile in Choice Advantage.
- Revenue Manager builds Rate Plans.
- Booking links for LNR accounts live in Rates Center.

## Key Acronyms & Terms
- AD / RD / GAD / NAM — Area Director / Regional Director / Global Account Director / National Account Manager
- BPC — Brand Performance Consultant
- SRP — Special Rate Plan (Choice rate code)
- LNR — Locally Negotiated Rate
- SPC / SNP / SCR / SCPM / SAPR — core Choice SRPs (see Rate Plans section)
- BAR — Best Available Rate
- CID — Corporate ID (8-digit client identifier)
- CP — Choice Privileges
- CRS — Central Reservations System
- PMS — Property Management System (Choice Advantage)
- LTR — Likelihood to Recommend score (Medallia)
- A360 — account reporting requests (IATA/PCC, SNP/SPC, POI reports) — request from RM or Brand Contact
- POI — Pace of Inventory
- INN Code — Property identifier used with Inside Sales
- BAR / RACK — Public rates (BAR floating, Rack standard published)
- RDOS — Remote Director of Sales (Gillis internal; formerly ASM)

## Chain Codes (GDS / CCRA)
Choice-family GDS chain codes:
- CI — Comfort Inn
- CZ — Comfort Suites
- CC — Clarion Hotels
- QI — Quality Inn
- SZ — Sleep Inns
- EO — Econo Lodge
- RI — Rodeway Inn
- MZ — MainStay Suites
- EC — Exclusively Choice (corporate umbrella distribution code)
- (Radisson-acquired properties still use RD — Radisson Hotels)

## National Accounts / Corporate IDs
Choice National Account List (Franchisee CID) lives at:
Choice Tools > National Account Lists > National Account List (current version, e.g., 8.1.25_FRANCHISEE_CID). SRPs-at-a-glance PDF is the companion reference.

Each account row includes: Account Name, 8-digit Corporate ID, Industry, Formal RFP flag, chainwide discount (usually SPC or SNP; SC15 for some), preferred amenities, chain scale preferences, per-diem requirement, NLRA acceptance, cancel policy, blackout acceptance.

Common examples:
- Bank of America — CID 00010501 — SPC
- Cox Enterprises — CID 00066532 — SPC
- Cummins Inc. — CID 00018630 — SPC
- Pepsico/Yum! Brands — CID 00937586 — SNP
- Conagra Brands — CID 00034800 — SC15
- ALE Solutions — CID 00067492 — SPC
- API (Accommodations Plus Intl) — CID 00067460 — SPC
- CRS Temporary Housing — CID 00769020 — SPC
- ADTRAV — CID 00247870 — SPC
- 3 Step Sports (Apex) — CID 00889630 — SPC

Always pull the current list from SharePoint; CIDs and discounts update regularly.

## Choice Advantage — Go-To Reports
(Choice Advantage > Run > Reports)
- Company History > Top 50 — YoY comparison (requires company profiles)
- Company History > Historical Revenue Detail — monthly tracking
- Marketing Reports > Revenue by Rate Code — monthly revenue by SRP/LNR
- Group Reports > Group Pickup Detail — monthly group tracking
- Reservation Reports > Reservation Activity — who booked a specific rate plan
- Reservation Reports > Occupancy Snapshot — occupancy/ADR for a date range
- Arrivals Report — night before, to welcome/flag key accounts
- Travel Agent Report — top CRS-booked agencies (great prospect source)
- AAA Report (ChoiceCentral > Property Info Manager > Reports) — diamond rating, SA rate plan production

## Common Questions & Quick Answers
1. How do I get access to ChoiceMax? The property must request access for you, and you need OKTA. Request: choicehotels.service-now.com (ChoiceMax access form).
2. Where do I submit business cases? CVENT Transient (formerly Lanyon): supply.lanyon.com. Qualifying Season Apr 1-30. 10 cases standard, 25 for new openings within 6 months.
3. How do I get group leads? Email InsideSales@choicehotels.com with property name + INN code to be added to distribution. Then manage responses in EasyBid.
4. Does Choice use Meeting Broker? No. Group leads flow through Choice Inside Sales.
5. Where do I update SPC/SNP discount? ChoiceNOW service-now form (linked in rate programs). SNP auto-calculates 10% below SPC.
6. Where are rate plans built? Revenue Manager builds them in Rates Center. Rate Bucket first, then Rate Plan, then link to Company Profile in Choice Advantage.
7. How do I pull revenue by rate code? Choice Advantage > Reports > Marketing Reports > Revenue by Rate Code. Look up codes in Choice Connect > Rates Center > Rate Plans.
8. How do I get STAR benchmark access? ChoiceNOW form: choicehotels.service-now.com (STR Benchmark Access request).
9. What does S-, L-, N- prefix mean in a rate code? S = chain SRP, L = locally negotiated rate (LNR), N = national account.
10. My hotel is Everhome — anything different? Yes. Rates and Inventory tool (via ChoiceConnect > My Apps), and request Kalibri Labs access. Local Rate Plans set up via ChoiceNOW.
11. Where do I find an account's CID? National Account List (Franchisee CID) PDF in Choice Tools on SharePoint, or request from BPC/AD.
12. How do Choice Privileges member rates work? SCPM settings on the property drive the additional member discount on top of SAPR1/SAPR2 (typically 3-7%).
`;
