// Marriott brand knowledge base
export const MARRIOTT_KB = `
# MARRIOTT REFERENCE

## Brand Overview
Marriott International is the world's largest hotel company with a portfolio of 30+ brands spanning every tier from ultra-luxury to economy, plus extended stay and all-inclusive. Marriott's scale, loyalty program (Bonvoy), and deployed Global Sales Organization make it the dominant chain in B2B corporate, group, and intermediary channels. Marriott is transitioning its core technology stack under "The Power of M" — retiring legacy systems (MARSHA, FOSSE, LightSpeed) and moving to Amadeus CRS and Agilysys Stay / OPERA Cloud PMS platforms. Extended Stay brands will migrate in 2027.

## Brand Family / Tiers

**Luxury**
- The Ritz-Carlton
- Ritz-Carlton Reserve
- St. Regis
- JW Marriott
- The Luxury Collection
- W Hotels
- EDITION
- Bulgari Hotels & Resorts

**Premium**
- Marriott Hotels
- Sheraton
- Marriott Vacation Club
- Delta Hotels
- Le Méridien
- Westin
- Renaissance Hotels
- Gaylord Hotels
- Autograph Collection
- Tribute Portfolio
- Design Hotels

**Select / Midscale**
- Courtyard by Marriott
- Four Points by Sheraton
- SpringHill Suites
- Protea Hotels
- Fairfield by Marriott
- AC Hotels
- Aloft
- Moxy Hotels
- City Express by Marriott (acquired)

**Longer Stays / Extended Stay**
- Marriott Executive Apartments
- Apartments by Marriott Bonvoy
- Residence Inn
- Element
- TownePlace Suites
- Homes & Villas by Marriott International (rentals)

## Loyalty Program
**Marriott Bonvoy** — https://www.marriott.com/loyalty.mi
- Tiers: Member → Silver Elite → Gold Elite → Platinum Elite → Titanium Elite → Ambassador Elite
- Earning: 10 points per $1 spent at most brands
- Exceptions: Residence Inn, TownePlace Suites, and Element earn 5 points per $1
- Non-participating brands: Marriott Executive Apartments, Design Hotels, Bulgari, and Homes & Villas do NOT participate in Bonvoy Rewarding Events

## Key Systems & Portals

- **MGS (Marriott Global Source)** — the Marriott brand portal (equivalent of Merlin/Lobby). Home base for everything.
- **MBTC** — Marriott Business Travel Center
- **GSO** — Global Sales Organization
- **NGS** — National Group Sales
- **MARSHA** — Marriott's Automated Reservations System for Hotel Accommodations (legacy CRS, sunsetting under Power of M, being replaced by Amadeus)
- **FOSSE** — Legacy Property Management System (sunsetting; being replaced by Agilysys Stay for most hotels)
- **OPERA Cloud** — New PMS replacing OPERA 5.6 properties
- **HPP** — High Performance Pricing (used for key accounts)
- **MarRFP** — Marriott's RFP system for National Accounts and CBCs
- **OneSource** — Group and catering RFP system (similar to Meeting Broker)
- **Empower** — Online reservation system with Guest Planning Screen for reservation search, arrivals, past stays, and guest info
- **MiNT (Marriott Intelligence)** — Reporting platform; replaced MRDW. Requires Island Browser.
- **Island Browser** — Must be downloaded to access MiNT and other Marriott systems
- **DLZ** — Digital Learning Center (training)
- **ServiceNow** — Used for access requests, cluster code requests, technology support
- **EID** — Marriott Enterprise ID (gateway credential for all Marriott systems)
- **Identity Shoppe** — Self-service portal to request app access (Empower, OneSource, MarRFP, MiNT, Sales & Catering, Group Housing Solutions)
- **GBAM** — Global Brand & Marketing
- **ReslinkDirect** — Booking link generator for group and corporate rates
- **Group Housing Solutions** — Group booking tool

## Rate Plans & Programs

- **Rate Program / Rate Codes** — Marriott's term for rate offers tied to accounts
- **Room Pool** — Sets of room types grouped by amenities (hotels may have multiple)
- **Cluster Code** — The 3- or 5-digit Corporate ID number that enables corporate rate bookings (GDS or non-GDS)
- **CBC (Compelling Business Case)** — Formal hotel-initiated request to be added to an account's RFP program
- **Courtesy / Squatter Rates** — Local negotiated rates loaded by the Revenue Manager when a CBC isn't supported; recommended to load as NLRA
- **GPP (Global Pricing Program)** — Participating hotels automatically included; no CBC collection
- **MPB (Marriott Preferred Business)** — Similar to GPP; participating hotels auto-included
- **LNR** — Locally Negotiated Rate
- **SAPP Report** — Sales Administration Account Plan report showing account details, % off, cluster codes, participation requirements, and assigned GSO/ASO contacts

## Sales Support

**Global Sales Organization (GSO)**
- Manages Marriott's largest B2B accounts across all brands and revenue streams (BT, group, extended stay, leisure)
- Partners with NGS to handle smaller meetings and extended stay
- Global Account Directory: https://mgscloud.marriott.com/mgs/marrdocs/mgs/common/salesmktgrevmgmt/toolsresources/globalaccountdirectory/index.html

**National Group Sales (NGS)**
- Manages and maintains accounts not handled by the on-property Marriott sales team
- https://mgscloud.marriott.com/common/sales-mktg-and-rev-mgmt/global-sales-team/national-group-sales.html

**Hotel-Level Contacts** (for Gillis outreach)
- Area Director
- Market Sales Leader
- Area Sales Leader

## Sales Process

**Accessing the Marriott World**
1. Get your EID from the property.
2. Use Identity Shoppe to request access to specific applications (Empower, OneSource, MarRFP, Sales & Catering Solutions, MiNT, Group Housing Solutions).
3. Install Island Browser to access MiNT.

**MarRFP Workflow**
- Log into MGS → MarRFP → Pricing → select property → continue through to Account Center
- Use the Account Legend to decode symbols
- Click the blue Account Name to review details; click "Price" to complete the RFP
- Complete every screen with a red checkmark; always SAVE
- Click "Return to Account Center" and Save again
- "A" in Account Status = accepted; "SR" in Rebid Status = rebid
- Marriott does NOT provide city volume by city — volume is in each account profile

**CBC (Compelling Business Case) Submission**
- Completed in MarRFP. Hotels can submit up to 5 CBCs per pricing year (excluding Account Leader requests).
- GPP and MPB accounts do NOT collect CBCs — participating hotels are auto-included.
- CBCs collected in two waves: Main (late June → mid-July) and Late (first half of November for off-cycle accounts).
- Before submitting, review the BT Account Overview in the SAPP to confirm account is open to CBCs, you meet the room night threshold, you have a local influencer, and you meet amenity requirements (LRA, WiFi, Cancellation, Breakfast).
- After submission: Global Account Leaders use CBC info + GAP Analysis + Agency 360 to determine who gets presented. Final status updated in MarRFP around January.
- Note: Most Marriott Revenue Managers do NOT support CBCs unless there's a local contact with 100+ room nights, because of existing discounts on corporate accounts.

**Rate Loading**
- Revenue Manager initiates. Hotel fills out Rate Loading Form (from RDOS Toolkit) and submits. Turnaround is a few days.
- Returned rate programs/codes are tied to specific room pools.

**Cluster Code Requests**
- Use ServiceNow: https://marriott.service-now.com/esc?id=ec_dashboard
- Separate request forms for GDS vs. non-GDS cluster codes

**Booking Links (ReslinkDirect)**
- Group links: group must first be built in Fosse/MARSHA with code created — https://www.marriott.com/reslink/event-details.mi?flow=create&reslinkType=grp
- Corporate links: requires the 3- or 5-digit cluster code — https://www.marriott.com/reslink/event-details.mi?flow=create&reslinkType=corp

**End-of-Month Reporting in MiNT**
- Analytical Account Tracking — replaced ATR1. Select property, start/end month, change Account Hierarchy to "Subsidiary," Execute Report, export to Excel via HTML dropdown.
- Analytical Demand Analysis Dynamic Selection — replaced DAT 1. Select Month + Year + Property, choose metrics (Current Room Nights, Revenue, ADR, % of Total), select "Transient/Rentals" market category, columns = Rate Program / Rate Plan. Same report toggles for Groups.

## FedRooms & Government
- Marriott does NOT support hotels participating in FedRooms, CWT Sato, ADTRAV, or DOD Preferred for transient BT (compliance issues, fees, commissionable rates, rate integrity concerns).
- Marriott DOES recommend participating in FedRooms Group Opportunities via Cvent.

## Key Acronyms & Terms

- **MGS** — Marriott Global Source (brand portal)
- **MBTC** — Marriott Business Travel Center
- **GSO** — Global Sales Organization
- **NGS** — National Group Sales
- **MARSHA** — legacy central reservations system
- **FOSSE** — legacy property management system
- **Power of M** — Marriott's system modernization initiative (Amadeus CRS, Agilysys Stay PMS, OPERA Cloud)
- **HPP** — High Performance Pricing
- **MarRFP** — Marriott's RFP system
- **Rate Program / Rate Code** — rate offer identifier
- **Room Pool** — set of room types grouped by amenities
- **Cluster Code** — Corporate ID number
- **OneSource** — Group/catering RFP system
- **DLZ** — Digital Learning Center (training)
- **ServiceNow** — Access/cluster code request portal
- **GBAM** — Global Brand & Marketing
- **Bonvoy** — Loyalty program
- **Island Browser** — required for MiNT access
- **Empower** — reservation system
- **MiNT** — Marriott Intelligence reporting
- **EID** — Enterprise ID credential
- **CBC** — Compelling Business Case
- **GPP** — Global Pricing Program
- **MPB** — Marriott Preferred Business
- **SAPP** — Sales Administration Account Plan report
- **NLRA** — Non-Last Room Availability (used for loading courtesy rates)
- **LRA** — Last Room Availability

## Chain Codes (GDS / CCRA)

- **EM** — Marriott All Brands
- **MC** — Marriott Hotels
- **RZ** — Ritz Carlton Hotels
- **MD** — Le Meridien Hotels & Resorts
- **CY** — Courtyard by Marriott
- **FN** — Fairfield Inn by Marriott
- **TO** — TownePlace Suites
- **XV** — SpringHill Suites
- **DE** — Delta Hotels
- **DS** — Design Hotels
- **BR** — Renaissance Hotels International
- **WH** — W Hotels
- **WI** — Westin Hotels
- **SI** — Sheraton Hotels
- **AL** — Aloft
- **EL** — Element

## National Accounts / Corporate IDs (Cluster Codes sample)
Marriott uses Cluster Codes (the company's "CID") to identify National Accounts. Sample from the National Accounts list:
- 3M: MMM
- Abbott Labs: ABL
- Accenture: ACC
- ADP: AD9
- Aetna: AET
- AIG: AIG
- Amazon: (use Hyatt/others; Marriott code not listed in current CID file)
- AT&T: ATT
- Bank of America: BOA
- Boeing: BOE
- Cisco: CIS
- Deloitte: DTC
- Disney: (not listed for Marriott in current file)
- Eli Lilly: ELI
- Ernst & Young: EYC
- FedEx: FED
- Ford: FOM
- GE: GEE
- Google: GGL
- IBM: IBM
- Johnson & Johnson: JOH
- JP Morgan Chase: JCH
- Kaiser Permanente: KAI
- KPMG: PEA
- Lockheed Martin: LK6
- McDonald's: MDC
- McKinsey: MCK
- Merck: MRK
- Microsoft: MCO
- Nestle: NST
- Pfizer, UPS, Walmart, etc. — refer to National Accounts CID file for full list.

Full list of 300+ National Account cluster codes lives in "National Accounts - Corporate ID Numbers - All brands.xlsx" and the Marriott Cluster Codes Sept 2024.xlsx file.

## Common Questions & Quick Answers

**Q: How do I get access to Marriott systems?**
A: Start by getting your EID from the property. Then go to Identity Shoppe (https://ssm-marriottms.saviyntcloud.com/ECMv6/request/requestHome) to request the specific apps you need (Empower, OneSource, MarRFP, MiNT, Sales & Catering, Group Housing Solutions). Install Island Browser to access MiNT.

**Q: What's a CBC and when should I submit one?**
A: A Compelling Business Case is a hotel-initiated request to be added to an account's RFP program. Submit if: (1) the account is open to CBCs (check BT Account Overview in SAPP), (2) you meet the room night threshold, (3) you have a local contact/influencer, (4) you meet mandatory amenity requirements. You get up to 5 CBCs per pricing year. Note: most Marriott RMs only support CBCs with 100+ RN local contact opportunity because of existing discounts on major accounts.

**Q: How do I submit a rate offer / request a rate code?**
A: Work with your Revenue Manager. Fill out the Rate Loading Form from the RDOS Toolkit and submit to RM. Returns in a few days with rate programs/codes per room pool.

**Q: How do I get a cluster code for a new corporate client?**
A: Submit through ServiceNow. There are separate links for GDS and non-GDS cluster codes. Existing cluster codes are in the Marriott Cluster Codes spreadsheet, but new ones are added daily.

**Q: How do I create a corporate booking link?**
A: You need the 3- or 5-digit cluster code first. Then go to MGS → Group Housing Solutions → ResLink, or use: https://www.marriott.com/reslink/event-details.mi?flow=create&reslinkType=corp

**Q: Where do I find account information and % off with the brand?**
A: SAPP Reports in MarRFP. Pricing → Sales Administration → View Account Plan (SAPP). Shows account info, % off, cluster codes, requirements, and assigned GSO/ASO contacts.

**Q: Who do I contact at Marriott for National Accounts?**
A: Use the Global Account Directory on MGS to identify the Sales Account Executive for each National Account. GSO handles the largest accounts; NGS handles smaller groups and extended stay.

**Q: Does Marriott support FedRooms?**
A: Not for transient BT — compliance, fees, and rate integrity concerns. Yes for FedRooms Group Opportunities via Cvent.

**Q: What's Power of M and why does it matter?**
A: Marriott's system modernization — retiring MARSHA, FOSSE, and LightSpeed; introducing Amadeus CRS, Agilysys Stay PMS, and OPERA Cloud. Most hotels are transitioning now; Extended Stay transitions in 2027. Impacts where reservations are pulled, how groups are built, and which PMS you're trained on.

**Q: Which brands earn fewer Bonvoy points?**
A: Residence Inn, TownePlace Suites, and Element earn 5 points per $1 (vs. 10 for most brands). Marriott Executive Apartments, Design Hotels, Bulgari, and Homes & Villas don't participate in Bonvoy Rewarding Events.

**Q: Where can I find MiNT reports?**
A: Must use Island Browser. MiNT replaced MRDW. Key reports: Analytical Account Tracking (replaced ATR1) and Analytical Demand Analysis Dynamic Selection (replaced DAT 1).
`;
