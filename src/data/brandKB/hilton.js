// Hilton brand knowledge base
export const HILTON_KB = `
# HILTON REFERENCE

## Brand Overview
Hilton Worldwide is one of the largest global hospitality companies, with a portfolio spanning luxury, full-service, focused-service, and extended-stay segments. Hilton operates a single integrated sales, distribution, and technology stack (the Lobby, OnQ/PEP, GDM, Hilton Honors) across all its franchise and managed hotels, giving sellers at any Hilton property access to global systems and corporate account programs.

## Brand Family / Tiers
Hilton's Family of Brands is organized by segment:
- Luxury: Waldorf Astoria, LXR Hotels & Resorts, Conrad
- Lifestyle: Canopy by Hilton, Curio Collection, Tapestry Collection, Tempo by Hilton, Motto by Hilton
- Full Service: Hilton Hotels & Resorts, Signia by Hilton
- Focused Service: Hilton Garden Inn, Hampton by Hilton, Tru by Hilton, Spark by Hilton
- All Suites: Embassy Suites, Homewood Suites, Home2 Suites
- Upscale / Upper Midscale: DoubleTree by Hilton

## Loyalty Program
Hilton Honors is Hilton's guest loyalty program. Tiers: Member (base), Silver, Gold, and Diamond. Members earn points on qualifying stays and eligible co-branded credit card spend; points can be redeemed for free nights, experiences, and transfer partners. Status match and fast-track offers are periodically available through Hilton Honors promotions.

Key links:
- https://www.hilton.com/en/hilton-honors/
- https://www.hilton.com/en/hilton-honors/member-benefits/

## Key Systems & Portals
- The Lobby: Hilton's main information and application portal. Primary entry point for sales, reporting, content, and access management. (lobbylite.hilton.com)
- OnQ: Legacy Hilton front desk / property management system. Being retired; Hilton Technology will fully decommission OnQ PM by mid 2026.
- PEP (Property Engagement Platform): New cloud-based PMS replacing OnQ. Cheaper to install (25% less), cheaper to maintain (10%+ less annually), and easier to learn. Deployed primarily through remote, automated migrations. Integrated with TrainKey for just-in-time, in-app training.
- Vantage: Citrix Gateway remote-work platform. Hosts legacy apps like GDM Webforms, Cognos, OnQ R&I, PEP remote access. Most Vantage-hosted systems are migrating to the Lobby by EOY 2025; Vantage will remain the only remote path for PEP and OnQ R&I.
- OnQ R&I: Rate & Inventory program for managing availability, inventory restrictions, and building/maintaining Group and Local SRPs. Not the revenue management system (GRO is). Requires 40+ hours of training; typically owned by GM or Revenue Manager.
- OnQSM (OnQ Solicitation Management): Where properties receive and respond to corporate RFPs. Check weekly. Accessed via the Lobby or Vantage under My Apps/Reports.
- GRO: Hilton's Revenue Management system. Pushes updates to R&I (R&I updates CRS immediately, while GRO lags).
- GDM (Global Distribution Management): Includes GDM Webforms used to load LNR Rate Forms and submit CARPs. Revenue Manager typically loads the LNR rate form.
- Content Gateway: Tool in the Lobby for creating and testing Corporate Code URL and Attendee Reservation booking links. Recommend saving the booking link submission page to favorites.
- Hilton Reporting Hub (HRH): Modern reporting platform replacing legacy Cognos-era systems by EOY 2025. Accessible remotely without Vantage. Intuitive and highly configurable.
- ID and Application Management: Lobby tool for requesting access. "Add Applications" to request access to new functions; "Add Facilities" to add access at a new property under an existing Hilton ID.

## Rate Plans & Programs
- CARP (Corporate Account Request to Participate): A business case submission requesting preferred hotel consideration or loading as an expedited courtesy rate for Hilton Worldwide Sales-managed global accounts. Open year-round; review the Minimum Account Parameter Report to time submission with account RFP cycles. Submitted via GDM Webforms on Vantage or via Lobby (Americas Sales > CARP > Submit CARP — Vantage still required).
- LNR (Locally Negotiated Rates) / corporate negotiated rates: Loaded via GDM Web Forms. The LNR Rate Form should be completed by the property Revenue Manager.
- Corporate RFP submission: Handled through OnQSM. Responses include participation decision, cancellation policy, property contact info, seasons, rates (LRA/NLRA, static/dynamic), blackout/fair dates, and GBTA custom questions.

Key URLs:
- CARP Qualifier: https://hilton.sharepoint.com/sites/LS_GlobalSales/SitePages/HWS-Americas-BTS-CARP-Corporate-Account-Request-Participate-Qualifier.aspx
- 2025 RFP Hub: https://lobbylite.hilton.com/sites/rfp-hub
- HRH Report Mapping: https://lobbylite.hilton.com/hs3/etfbc4sa/hilton_reporting_hub-report_mapping_platform_comparison.pdf

## Sales Support
HWS (Hilton Worldwide Sales) is the corporate sales arm. Account Guardian is Hilton's term for the Account Manager owning a given corporate relationship.

Org path in the Lobby: Lobby > Departments > Global Sales > Americas Sales > Business Travel Sales. From Global Sales you can search Account Profile Libraries (HWS Corporate Transient Account Profiles A-E, F-O, P-Z) and access the HWS Americas Master Account List (Excel).

Best Guest CRM report: Primary tool for pulling arrivals, in-house, and departures each day — the go-to report for prospecting and targeting onsite.

## Sales Process
Typical steps for taking on a new Hilton property:
1. Request the Lobby login; go to ID and Application Management and use "Add Applications" / "Add Facilities" to request access at the new property. Recommended apps: CRM Best Guest Reports, HRH (Operational Reporting), OnQ Solicitation Management.
2. Set up booking links through Content Gateway (Corporate Code URL or Attendee Reservation URL); test every link before sending.
3. Under Global Sales, pull the Account Profile Library and Master Account List; print-to-PDF (don't save) per Hilton guidance.
4. Submit CARPs in GDM Webforms (Vantage) or via Lobby > Americas Sales > CARP > Submit CARP. Include a compelling business case focused on how the hotel benefits the account's travelers (location, differentiated amenities, value-add services, testimonials).
5. Monitor OnQSM weekly for corporate RFP invites. Respond before the deadline following the RFP Submission Playbook.
6. Use HRH for hotel marketing reports: Top 50 Corporate Accounts by Month, Corporate Accounts by Rate Plan, Corporate Accounts SRP Analysis, Stay Date Reports Dashboard, Booking Reports Dashboard.

## RFP Response Flow (OnQSM)
1. BTS Contact email in OnQ SM Property Maintenance receives the invitation; use a shared SALESADM/DS email with distribution list, not personal email.
2. In OnQSM > Solicitation Response, search by client name (wrap in asterisks, e.g., *McKinsey*) or Solicitation ID; tick the box and Search.
3. Open the Hotel Cover Memo — read every tab (Main Menu, Customer Summary, Custom Questions, T&Cs, T&Cs Markup, City Spend, Office Locations, Groups & Meetings). Mandatory amenities not offered = likely rejection.
4. Choose Participate or Non-Participate (give a detailed reason if declining).
5. Confirm cancellation policy, tax treatment (do not override the property default unless OnQ PM supports it), property contact info.
6. Add seasons covering the entire contract period; add rates per season (LRA/NLRA, room types, rate type static or Percent Off). Never enter fake rates like 9999.
7. Add blackout / fair dates as allowed by the client's Hotel Cover Memo.
8. Complete GBTA and client-specific custom questions (no special characters, no commas/apostrophes/%).
9. Review & Submit; confirm the submission pop-up appears.

DCP (% off BAR) RFPs are run as separate solicitations and are LRA-only. If the client has a set %, no seasons/rates entry is required; if not, complete seasons and rates as normal.

## Business Case (CARP) Best Practices
- Lead with traveler benefit, not hotel benefit.
- Use local, differentiated facts: proximity to the client's office, construction impacts at comp hotels, shuttle and transport services, complimentary amenities, on-site F&B or adjacent restaurants.
- Include local market intel (Agency 360 room-night data, renovations, new office openings, project travel).
- Include testimonials from local contacts or current guests.
- Reference the Lobby CARP page and "How to Work with Hilton Worldwide Sales" for additional resources.

## Key Acronyms & Terms
HWS (Hilton Worldwide Sales), Account Guardian (Hilton Account Manager), GDM (Global Distribution Management), OnQ (legacy front desk / PMS), OnQ R&I (Rate & Inventory), OnQSM (OnQ Solicitation Management, corporate RFPs), GRO (Revenue Management system), PEP (Property Engagement Platform, new PMS), Lobby (main Hilton info portal), Vantage (Citrix remote-work platform), Best Guest CRM (arrivals/in-house/departures report), CARP (Corporate Account Request to Participate — business case), HRH (Hilton Reporting Hub), Merlin (legacy reporting tool referenced in cross-brand portal docs), LRA/NLRA (Last Room Availability / Non-LRA), DCP (Dynamic Corporate Pricing — % off BAR), BTS (Business Travel Sales), SRP (Special Rate Plan), GBTA (Global Business Travel Association standard question set), TrainKey (PEP's in-app training system). Search "Jargon Buster" in the Lobby for the full PDF reference.

## Chain Codes (GDS / CCRA)
Hilton-family chain codes used in the GDS:
- EH — Hilton All Brands
- HL — Hilton International
- HI — Hilton Hotels (US)
- HX — Hampton Inns
- DT — Doubletree Hotels
- ES — Embassy Suites
- HG — Homewood Suites
- GI — Hilton Garden Inn (listed in cross-brand references as part of Hilton portfolio)

## National Accounts / Corporate IDs
Hilton corporate accounts use two CID columns in the National Accounts master:
- "Hilton, HGI" (for Hilton-branded and Hilton Garden Inn rates)
- "Hampton, Homewood, Doubletree, Embassy" (for focused-service and all-suites brands)

Examples (Hilton/HGI CID | Hampton/Homewood/DT/Embassy CID):
- 3M: 1542 | 232757100
- Accenture: 156333 | 560001833
- AT&T: 46 | 322768100
- Bank of America: 710081 | 52752100
- Boeing: 95 | 472863100
- Cisco: 886721 | 560003082
- Deloitte: 601560 | 383264100
- Ernst & Young: 1055 | 352869100
- General Electric: 1398 | 72799100
- IBM: 901452 | 322807100
- Johnson & Johnson: 991356 | 301022100
- JP Morgan Chase: 1356 | 550000068
- McKinsey: 303047 | 560009845
- Microsoft: 1040268 | 472919100
- Oracle / Nestle / Pfizer etc. — see full master list in the HWS Americas Master Account List.

Full list (306 accounts) lives in "National Accounts - Corporate ID Numbers - All brands.xlsx" and in the HWS Corporate Transient Account Profile Library on the Lobby.

## Common Questions & Quick Answers

**How do I request access to a new property in the Lobby?**
Lobby > ID and Application Management > Add Facilities (to extend existing Hilton ID to a new property) or Add Applications (for new apps like Best Guest, HRH, OnQSM).

**What's CARP and when do I submit one?**
Corporate Account Request to Participate — a business case to get the hotel considered for preferred status or loaded with an expedited courtesy rate for HWS-managed accounts. Open year-round; submit via GDM Webforms on Vantage, or Lobby > Americas Sales > CARP > Submit CARP. Check the Minimum Account Parameter Report for account RFP timing.

**How do I pull an HRH (formerly Merlin-era) report?**
Lobby > My Applications > Hilton Reporting Hub > Get Started with HRH. Key hotel marketing reports: Top 50 Corporate Accounts by Month, Corporate Accounts by Rate Plan, Corporate Accounts SRP Analysis, Stay Date Reports Dashboard, Booking Reports Dashboard.

**How do I create a corporate booking link?**
Lobby > Content Gateway > Booking Links > Corporate Code URL or Attendee Reservation URL. Always test the link. Save the submission page to favorites.

**Where do corporate RFPs show up?**
OnQSM (OnQ Solicitation Management), accessed through the Lobby or Vantage under My Apps/Reports. Check weekly. Also under the Action Required list on the OnQSM homepage, though searching Solicitation Response is more reliable.

**What's the difference between OnQ and PEP?**
OnQ is the legacy front desk system being retired by mid 2026. PEP is the new cloud-based PMS — cheaper, easier to use, evolves via agile releases, and uses TrainKey for in-app real-time training.

**How do I see who's arriving, in-house, or departing today?**
Best Guest CRM report (accessed via Lobby or Vantage). The go-to prospecting and on-property targeting report.

**What's the Account Guardian?**
Hilton's term for the Account Manager owning a global or national corporate relationship inside Hilton Worldwide Sales.

**What's Vantage and is it going away?**
Vantage is the Citrix Gateway remote-work platform that still hosts PEP and OnQ R&I remote access. Most legacy apps on Vantage are migrating to the Lobby by EOY 2025, but PEP and R&I remote access will remain Vantage-only.

**Where do I find the HWS Americas Master Account List?**
Lobby > Departments > Global Sales > Americas Sales. The Excel master list and Account Profile Library (A-E, F-O, P-Z) are published there. Print to PDF — do not save locally per Hilton guidance.
`;
