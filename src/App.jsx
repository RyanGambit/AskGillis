import { useState, useRef, useEffect, useMemo } from "react";
import { SYSTEM_PROMPT } from "./prompt.js";
import { KNOWLEDGE_BASE } from "./knowledgebase.js";
import { OPERATIONAL_KB } from "./operational-kb.js";

const INVITATION_CODE = "GILLIS2026";

// ---- Feedback: paste your Google Apps Script web app URL here ----
const FEEDBACK_SHEET_URL = "https://script.google.com/macros/s/AKfycbyFSCGAPoKO8xw9LFnuW-6nFdP1e65kCB2Bm0MUJjkxbj_Uj_CGLsq16bsJx1tSt6jL/exec";

const G = {
  bg:"#F5F4F8", white:"#FFFFFF",
  purple:"#3D2B6B", purpleLight:"#F3F0FA", purpleBorder:"#D8D0ED", purpleDark:"#2d1f5e",
  teal:"#1ABBA6", tealLight:"#EEFBF9", tealBorder:"#B0E8E0", tealDark:"#0E8A7A",
  orange:"#E8875B", orangeLight:"#FFF4EE", orangeBorder:"#F5C9B0",
  gold:"#D4A843", goldLight:"#FDF8EC", goldBorder:"#E8D49C",
  lilac:"#7C6BC4", lilacLight:"#F0EDFA", lilacBorder:"#C4BBE8",
  dark:"#2c2540", text:"#5a5370", muted:"#8a839a", dim:"#b5b0c0",
  border:"#eae8f0", borderLight:"#f0eef4",
};

const MODULES = [
  {id:"onboarding",label:"Onboarding",icon:"M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",color:G.teal},
  {id:"gameplan",label:"Weekly Game Plan",icon:"M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2M12 12h.01M8 12h.01M16 12h.01M12 16h.01M8 16h.01M16 16h.01",color:"#8B5CF6"},
  {id:"outreach",label:"Outreach Support",icon:"M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z",color:G.teal},
  {id:"situation",label:"Situation",icon:"M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 8v4M12 16h.01",color:G.lilac},
  {id:"roleplay",label:"Role Play",icon:"M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",color:G.orange},
  {id:"sharpener",label:"Daily Sharpener",icon:"M13 2L3 14h9l-1 8 10-12h-9l1-8z",color:G.gold},
  {id:"social",label:"LinkedIn & Social",icon:"M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",color:"#3B82F6"},
  {id:"methodology",label:"Methodology",icon:"M4 6h16M4 10h16M4 14h10M4 18h7",color:G.muted},
  {id:"hub",label:"Gillis Hub",icon:"M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10",color:"#6B7280"},
];

const ONBOARDING_ITEMS = [
  {id:"ob1",label:"Gillis brand, values, and culture",tammy:true,prompt:"Tell me about Gillis brand values and culture.",week:"Week 1"},
  {id:"ob2",label:"ASM role and hotel portfolio overview",tammy:true,prompt:"Explain the ASM role. What does my day look like?",week:"Week 1"},
  {id:"ob3",label:"Room to Grow: Gillis Strategic Selling",tammy:true,prompt:"Introduce the Gillis Strategic Selling approach.",week:"Week 2"},
  {id:"ob4",label:"Hotel onboarding process",tammy:true,prompt:"Walk me through onboarding a new hotel property.",week:"Week 2"},
  {id:"ob5",label:"Time management and Dynamic Market Assessment",tammy:true,prompt:"Explain time management and the Dynamic Market Assessment.",week:"Week 2"},
  {id:"ob6",label:"Prospecting fundamentals",tammy:true,prompt:"Teach me the basics of prospecting. Where do I start?",week:"Week 3"},
  {id:"ob7",label:"Brand training deep-dives",tammy:true,prompt:"How does my brand affect my sales approach?",week:"Week 3"},
  {id:"ob8",label:"Computer and system setup",tammy:false,note:"IT",week:"Welcome"},
  {id:"ob9",label:"Self-directed learning",tammy:false,note:"Academy",week:"Welcome"},
  {id:"ob10",label:"Meet and greet with leadership",tammy:false,note:"Your manager",week:"Welcome"},
  {id:"ob11",label:"Gillis Academy course intro",tammy:false,note:"Gillis Academy",week:"Welcome"},
  {id:"ob12",label:"HR policies, health and safety",tammy:false,note:"HR",week:"Week 1"},
  {id:"ob13",label:"Systems and tools overview",tammy:false,note:"Your manager",week:"Week 1"},
  {id:"ob14",label:"Salesforce and client setup",tammy:false,note:"RDOS",week:"Week 2"},
  {id:"ob15",label:"Call observations",tammy:false,note:"Your pod",week:"Week 3"},
  {id:"ob16",label:"Final Salesforce review",tammy:false,note:"RDOS",week:"Week 3"},
];

const SITUATION_CATEGORIES = [
  {
    category: "Objections & Pushback",
    items: [
      {label:"\"Send me your info\"",desc:"They brushed you off with the most common deflection.",prompt:"A prospect just hit me with 'send me your info' to get me off the phone. How do I handle this?"},
      {label:"\"We're happy with our current hotel\"",desc:"Loyalty objection. They won't even hear you out.",prompt:"I called a prospect and they said they're happy with their current hotel and don't need to look at alternatives. What do I do?"},
      {label:"\"Your rate is too high\"",desc:"Price objection before you've built any value.",prompt:"A prospect says our rate is too high before I've even had a chance to show them what we offer. How should I respond?"},
      {label:"\"Call me back next quarter\"",desc:"Stall tactic. They're trying to get rid of you.",prompt:"A prospect keeps telling me to call back next quarter. I've heard it twice now. How do I break through this?"},
    ]
  },
  {
    category: "Stalled Accounts",
    items: [
      {label:"Prospect went cold",desc:"They were engaged, now they're ghosting you.",prompt:"I had a prospect who was responding and seemed interested, but now they've gone completely cold. No replies to emails or calls."},
      {label:"Multiple voicemails, no callback",desc:"The grind of unanswered outreach.",prompt:"I've left at least 10 voicemails for this prospect over the past few weeks and gotten nothing back. Should I keep going or change my approach?"},
      {label:"Lost the deal and don't know why",desc:"It slipped away and you need to understand what happened.",prompt:"I just found out we lost a piece of business I thought we had. I don't really know what went wrong."},
    ]
  },
  {
    category: "Calls & Conversations",
    items: [
      {label:"Call didn't land",desc:"You got through but it didn't go the way you wanted.",prompt:"I just got off a call that didn't go well. I had the prospect on the phone but I don't think I made any progress."},
      {label:"Went transactional instead of consultative",desc:"You pitched features instead of having a business conversation.",prompt:"I just realized I spent the whole call talking about our hotel's amenities instead of understanding their business. How do I fix this next time?"},
      {label:"Didn't know what questions to ask",desc:"You had the meeting but missed the depth.",prompt:"I had a meeting with a prospect but I ran out of things to ask after a few minutes. I know I didn't dig deep enough."},
    ]
  },
  {
    category: "Confidence & Motivation",
    items: [
      {label:"Don't know where to focus today",desc:"Too many hotels, too many leads, feeling scattered.",prompt:"I'm managing multiple properties and I honestly don't know where to put my energy today. Everything feels equally urgent."},
      {label:"Pressure from leadership",desc:"Numbers aren't where they need to be.",prompt:"My GM is putting pressure on me about my numbers this month. I'm doing the activity but the results aren't showing yet."},
      {label:"Having a tough week",desc:"Sometimes you just need to reset.",prompt:"It's been a rough week. A lot of rejection, not a lot of wins. I just need some help getting my head back in the game."},
    ]
  },
  {
    category: "Client & Account Issues",
    items: [
      {label:"Client relationship is strained",desc:"Something's off with a hotel you manage.",prompt:"I'm having some tension with one of my hotel clients. The GM seems frustrated with our results and I'm not sure how to address it."},
      {label:"Hotel isn't giving me what I need",desc:"Property issues making your job harder.",prompt:"One of my hotels has some real issues that make it hard to sell. The product isn't where it needs to be and prospects keep bringing it up."},
    ]
  },
];

const METHODOLOGY_ITEMS = [
  {title:"Business vs Sales Conversations",desc:"Shift from pitching features to understanding what the customer is buying.",color:G.teal},
  {title:"Call Planner",desc:"4-step framework: synthesize research, set objectives, opening statement, qualifying questions.",color:G.teal},
  {title:"4A Objection Handling",desc:"Acknowledge, Ask, Answer, Accept. The best response to any objection is a question.",color:G.lilac},
  {title:"Hunter vs Farmer",desc:"Different roles need different strengths. Don't put a farmer in a hunter seat.",color:G.orange},
  {title:"Strategy Before Tactics",desc:"Strategy is the what. Tactics are the how. Most sellers skip straight to tactics.",color:G.gold},
  {title:"The Sales Reality",desc:"Marathon not sprint. 18 dials to connect. 12 touches to close. 90% quit at 3-4.",color:G.purple},
  {title:"Everybody Sells",desc:"Front desk, night audit, housekeeping. Culture is your differentiator.",color:G.teal},
  {title:"SWOT by Segment",desc:"Do a SWOT for each competitor by market segment. Vanilla is not a sales strategy.",color:G.lilac},
];

const SHARPENER_CATEGORIES = [
  {
    category:"Opening Statements",desc:"30 seconds to earn their attention. No selling in the opener.",color:"#1ABBA6",
    items:[
      {label:"Construction company lead",scenario:"A general contractor just won the bid for a new recreation complex 2 miles from your hotel. Crews will need rooms for 6+ months. Write your opening statement."},
      {label:"Corporate travel manager",scenario:"You found out a Fortune 500 company is opening a regional office 10 minutes from your property. You have the travel manager's name from LinkedIn. Write your opening statement."},
      {label:"Sports team coordinator",scenario:"A college basketball tournament is coming to your city in 3 months. You found the athletics coordinator's contact through the CVB. Write your opening statement."},
      {label:"Warm referral",scenario:"Your GM just told you that a guest at breakfast mentioned their company is relocating 50 employees to the area over the next 6 months. You got their card. Write your opening statement."},
      {label:"Re-engaging a lost account",scenario:"A company that used to book 40 room nights a month stopped 6 months ago. You don't know why. You're calling the old contact. Write your opening statement."},
    ]
  },
  {
    category:"Objection Handling",desc:"Use the 4A model: Acknowledge, Ask, Answer, Accept.",color:"#7C6BC4",
    items:[
      {label:"\"Send me your info\"",scenario:"You're 15 seconds into a cold call and the prospect says 'Just send me your info and I'll take a look.' Respond using the 4A model."},
      {label:"\"We're happy with our current hotel\"",scenario:"A corporate travel manager says 'We've been using the Hilton downtown for years and everyone's happy.' Respond using the 4A model."},
      {label:"\"Your rate is too high\"",scenario:"You quoted $139/night for a group block and the prospect says 'That's way above our budget. The Hampton down the road is at $109.' Respond."},
      {label:"\"We don't have any upcoming needs\"",scenario:"A prospect says 'We really don't have anything coming up right now.' You know their industry typically has seasonal travel. Respond."},
      {label:"\"I need to run this by my boss\"",scenario:"You thought you were talking to the decision maker but they say 'This sounds good but I'd need to get approval from our VP of Operations.' Respond."},
    ]
  },
  {
    category:"Business vs Sales Conversation",desc:"Rewrite the pitch. Lead with their business, not your hotel.",color:"#E8875B",
    items:[
      {label:"Fix the features pitch",scenario:"Rewrite this as a business conversation: 'Hi, I'm calling from the Courtyard Marriott. We're a newly renovated hotel with free breakfast, parking, and a fitness center. Do you have any travel needs in our area?'"},
      {label:"Fix the rate pitch",scenario:"Rewrite this as a business conversation: 'Hi, I wanted to let you know we're running a special corporate rate of $119 per night through the end of the quarter. Can I send you our rate sheet?'"},
      {label:"Fix the group pitch",scenario:"Rewrite this as a business conversation: 'We have a great ballroom that seats 200 and we can offer complimentary AV for groups over 50. Would you like to schedule a site tour?'"},
      {label:"Fix the follow-up email",scenario:"Rewrite this follow-up email as a business conversation: 'Hi, I'm following up on my voicemail from last week. I'd love to tell you about our hotel and see if there's an opportunity to earn your business.'"},
    ]
  },
  {
    category:"Qualifying Questions",desc:"Go deeper. Business Needs, Competition, Decision Making, Event Logistics.",color:"#D4A843",
    items:[
      {label:"Corporate relocation",scenario:"A company is moving 30 employees to your market over the next 4 months. You're meeting with their HR director. Write 4 qualifying questions, one from each category: Business Needs, Competition, Decision Making, Event Logistics."},
      {label:"Wedding season",scenario:"A wedding planner has inquired about room blocks for upcoming weddings. Before quoting, write 4 qualifying questions across all four categories."},
      {label:"Government contract",scenario:"A government agency is sending inspectors to your area for a 3-month project. Write 4 qualifying questions across all four categories."},
      {label:"Annual conference",scenario:"A mid-size company holds an annual leadership retreat for 75 people. They're exploring new venues. Write 4 qualifying questions across all four categories."},
    ]
  },
  {
    category:"Voicemails & Follow-Up",desc:"You get 30 seconds. Make it count.",color:"#3B82F6",
    items:[
      {label:"First voicemail to a cold prospect",scenario:"You're calling a prospect for the first time. They didn't pick up. Leave a voicemail that's under 30 seconds and gives them a reason to call back. Don't pitch your hotel."},
      {label:"Third voicemail, no callback yet",scenario:"This is your third voicemail to the same prospect. The first two got no response. Leave a message that changes the angle without sounding desperate."},
      {label:"Follow-up after a good call",scenario:"You had a strong discovery call yesterday. The prospect seemed engaged. Write a follow-up email that reinforces the conversation without being pushy. Keep it under 100 words."},
      {label:"Re-engage after going silent",scenario:"A prospect you were in active conversation with hasn't responded in 3 weeks. Write a short re-engagement message that creates a reason to reconnect."},
    ]
  },
];

const HUB_CATEGORIES = [
  {
    category:"Systems & Tools",
    items:[
      {type:"link",label:"Salesforce Login",desc:"Open Salesforce CRM",url:"#",placeholder:true},
      {type:"link",label:"Delphi / Event Temple",desc:"Booking and event management",url:"#",placeholder:true},
      {type:"link",label:"ZoomInfo",desc:"Contact and company research",url:"#",placeholder:true},
      {type:"link",label:"Gillis Academy",desc:"Self-directed learning modules",url:"#",placeholder:true},
      {type:"ask",label:"How do I get access to a system?",prompt:"I need access to one of the Gillis systems. Who do I contact and what's the process?"},
      {type:"ask",label:"I'm locked out of a system",prompt:"I'm locked out of one of my systems. Who do I contact to get back in?"},
    ]
  },
  {
    category:"Brand & Marketing",
    items:[
      {type:"link",label:"Brand Assets & Templates",desc:"Logos, one-pagers, marketing materials",url:"#",placeholder:true},
      {type:"document",label:"Gillis Brand Infographic",desc:"Brand positioning and value proposition",filename:"Gillis_Brand_Infographic.pdf"},
      {type:"document",label:"Communication Guide — Tone & Voice",desc:"How to represent the Gillis brand",filename:"Communication_Guide.pdf"},
      {type:"ask",label:"How should I position Gillis to a prospect?",prompt:"How should I describe Gillis to a prospect who's never heard of us? What's our value prop in plain language?"},
    ]
  },
  {
    category:"HR & Policies",
    items:[
      {type:"link",label:"Submit Expense Report",desc:"Open expense submission portal",url:"#",placeholder:true},
      {type:"link",label:"Request Time Off",desc:"PTO request form",url:"#",placeholder:true},
      {type:"ask",label:"What's the PTO policy?",prompt:"What's the PTO policy at Gillis? How much do I get and how do I request it?"},
      {type:"ask",label:"Health and safety policies",prompt:"Where do I find Gillis health and safety policies? What do I need to know?"},
      {type:"ask",label:"How does mileage reimbursement work?",prompt:"What's the process for mileage reimbursement at Gillis?"},
    ]
  },
  {
    category:"Programs & Incentives",
    items:[
      {type:"document",label:"Quarterly Incentive Plan",desc:"Current incentive structure and targets",filename:"RDOS_Quarterly_Incentive_Plan_2025.pdf"},
      {type:"document",label:"Employee Referral Program",desc:"Refer someone, get rewarded",filename:"Employee_Referral_Program_2024.pdf"},
      {type:"document",label:"Hotel Lead Referral Program",desc:"Refer a hotel, get rewarded",filename:"Hotel_Lead_Referral_Program_2024.pdf"},
      {type:"document",label:"Kudos Program",desc:"Recognition and rewards",filename:"Kudos_Information.pdf"},
      {type:"ask",label:"How is my performance measured?",prompt:"What metrics and criteria are used to evaluate my performance at Gillis? Walk me through the performance checklist."},
    ]
  },
  {
    category:"Onboarding & Training Docs",
    items:[
      {type:"document",label:"ASM Onboarding Checklist",desc:"New hire onboarding steps",filename:"ASM_Hotel_Onboarding_Check_List.docx"},
      {type:"document",label:"RDOS Onboarding Checklist",desc:"Manager onboarding steps",filename:"RDOS_Hotel_Onboarding_Check_List_2025.docx"},
      {type:"document",label:"Hotel Onboarding Timeline — Internal",desc:"Timeline for onboarding a new property",filename:"2026_Hotel_Onboarding_Timeline_Internal.pdf"},
      {type:"document",label:"Hotel Onboarding Timeline — External",desc:"Client-facing onboarding timeline",filename:"2026_Hotel_Onboarding_Timeline_External.pdf"},
      {type:"document",label:"RDOS Performance Checklist",desc:"Performance evaluation criteria",filename:"RDOS_Performance_Checklist_Oct_2025.docx"},
      {type:"document",label:"Post Kick-Off Email Template",desc:"Email template after hotel onboarding kick-off",filename:"ASM_Post_Kick_Off_Email.docx"},
    ]
  },
  {
    category:"Contacts & Support",
    items:[
      {type:"ask",label:"Who's my RDOS?",prompt:"How do I find out who my RDOS is?"},
      {type:"ask",label:"IT support",prompt:"How do I contact IT support at Gillis? What's the process for tech issues?"},
      {type:"ask",label:"HR contact",prompt:"How do I reach HR at Gillis?"},
      {type:"ask",label:"I don't know who to ask",prompt:"I have a question but I don't know who to ask at Gillis. Can you help me figure out the right person?"},
    ]
  },
];

const HELP_TIPS = [
  {title:"Be specific",body:"\"Help me with outreach\" gets you generic advice. \"I'm calling a construction company GM who just broke ground 3 miles from my Courtyard\" gets you a real game plan."},
  {title:"Tell her your segment",body:"Corporate, construction, sports, SMERF, government \u2014 each one requires a different approach. The more Tammy knows about who you're targeting, the sharper her coaching."},
  {title:"Share what happened",body:"If a call went sideways, walk her through it. What did you say? What did they say? The more detail you give, the more specific her feedback."},
  {title:"Use the modules",body:"Don't just type into the chat. The modules give Tammy context about what you're trying to do. Outreach Support tells her you're prepping a call. Role Play tells her to become the prospect. The right module gets you better answers."},
  {title:"Push back on her",body:"If her suggestion doesn't feel right for your situation, say so. \"That won't work because...\" gives her what she needs to adjust. She's coaching you, not lecturing you."},
  {title:"Keep it conversational",body:"You don't need to write formal questions. Talk to her like you'd talk to a colleague. \"I've got a weird one for you\" works just as well as a detailed brief."},
];

const HELP_MODULE_GUIDE = [
  {name:"Onboarding",when:"You're new to Gillis or hotel sales. Work through the checklist at your own pace.",color:G.teal},
  {name:"Weekly Game Plan",when:"Monday morning. Figure out where your energy goes across your properties this week.",color:"#8B5CF6"},
  {name:"Outreach Support",when:"You have a specific target and need to build your approach, opening statement, or email.",color:G.teal},
  {name:"Situation",when:"Something happened and you need help. An objection, a stalled account, a rough call, or just a tough day.",color:G.lilac},
  {name:"Role Play",when:"You want to practice before a real call. Tammy plays the prospect and gives you feedback after.",color:G.orange},
  {name:"Daily Sharpener",when:"Five minutes to build your sales muscle. Pick a drill, give it a shot, get feedback.",color:G.gold},
  {name:"LinkedIn & Social",when:"Writing connection requests, messages, posts, or engaging with prospects on LinkedIn.",color:"#3B82F6"},
  {name:"Methodology",when:"You want to understand a Gillis framework. 4A model, call planner, business conversations, etc.",color:G.muted},
  {name:"Gillis Hub",when:"Systems, policies, contacts, expense reports, IT help, HR questions, and anything internal.",color:"#6B7280"},
];

const HELP_FAQS = [
  {q:"Does Tammy know about my specific hotel?",a:"Only if you tell her. She doesn't have access to your CRM or property data. But when you share details about your hotel, market, or prospects, she uses that context to give specific advice. The more you share, the better she gets."},
  {q:"Are my conversations private?",a:"Your conversations are stored locally on your device for session history. They're not shared with other users. Your manager can see usage stats (which modules you're using and how often) but not the content of your conversations."},
  {q:"Who is Tammy?",a:"Tammy Gillis is the founder of Gillis Sales with 28 years of hospitality sales experience. AskGillis is powered by her methodology, her book \"Room to Grow,\" and the training materials used across 350+ hotel properties. The AI is trained to coach the way she would."},
  {q:"Can Tammy write emails and scripts for me?",a:"Yes. Use Outreach Support to prep calls and draft emails. Use LinkedIn & Social for connection requests and messages. Just give her context about who you're targeting and she'll draft something specific."},
  {q:"What if Tammy gives me advice I disagree with?",a:"Push back. Tell her why it won't work for your situation. She'll adjust. This is a conversation, not a lecture."},
  {q:"How is this different from ChatGPT?",a:"ChatGPT gives you generic sales advice. Tammy knows hotel sales specifically: the segments, the terminology, the objection patterns, the follow-up cadences, the reality of managing multiple properties. She coaches from the Gillis methodology, not generic best practices."},
  {q:"I'm not a Gillis employee. Can I still use this?",a:"Yes. AskGillis works for any hotel salesperson. The methodology is universal to hospitality B2B sales. You don't need to know the Gillis framework in advance \u2014 Tammy teaches it to you through the coaching."},
];

const SOCIAL_ITEMS = [
  {
    category:"Your Profile",
    items:[
      {label:"Review my LinkedIn headline & summary",desc:"Most hotel sellers have 'Sales Manager at Marriott.' That tells a prospect nothing.",prompt:"I want to improve my LinkedIn profile. Right now my headline is just my job title. How should a hotel salesperson position themselves on LinkedIn so prospects actually want to connect?",input:true,inputLabel:"Paste your current headline and summary (optional)",inputPlaceholder:"e.g. Sales Manager | Hilton Garden Inn | Hospitality Professional"},
    ]
  },
  {
    category:"Connection Requests",
    items:[
      {label:"Write a connection request",desc:"Target someone specific without sounding like every other sales bot.",prompt:"I want to send a LinkedIn connection request to a prospect. Help me write one that doesn't sound like a generic sales pitch.",input:true,inputLabel:"Who are you connecting with and why?",inputPlaceholder:"e.g. Corporate travel manager at a manufacturing company expanding into my market"},
      {label:"Connect after meeting someone in person",desc:"You met at a conference, site visit, or networking event. Now bridge it to LinkedIn.",prompt:"I met someone at an event and want to connect on LinkedIn. How do I write a request that references our conversation without being awkward?"},
      {label:"Reconnect with a cold contact",desc:"Someone you haven't talked to in months. Re-engage without being weird about it.",prompt:"I have a LinkedIn connection I haven't spoken to in a while. They're at a company that could be a good fit. How do I re-engage without it feeling random?"},
    ]
  },
  {
    category:"Messages & DMs",
    items:[
      {label:"First message after they accept",desc:"They accepted your request. Now what? Don't blow it with a pitch.",prompt:"A prospect just accepted my LinkedIn connection request. What should my first message say? I don't want to immediately pitch them.",input:true,inputLabel:"Who are they and what's your angle?",inputPlaceholder:"e.g. Event planner at a tech company, they host quarterly offsites"},
      {label:"Follow up on a message they haven't replied to",desc:"You sent a message, crickets. How to nudge without being pushy.",prompt:"I sent a LinkedIn message to a prospect a week ago and they haven't replied. Should I follow up? What do I say?"},
      {label:"Turn a LinkedIn conversation into a real call",desc:"The bridge from online chat to offline business.",prompt:"I've been messaging back and forth with a prospect on LinkedIn. How do I move this to a phone call or meeting without being too aggressive?"},
    ]
  },
  {
    category:"Posting & Content",
    items:[
      {label:"Write a post that positions me as an expert",desc:"Not 'we have 80 rooms and free parking.' Something a prospect would actually read.",prompt:"Help me write a LinkedIn post that positions me as someone worth talking to in hotel sales. I don't want it to sound like an ad for my hotel.",input:true,inputLabel:"What do you know a lot about? Any recent wins or stories?",inputPlaceholder:"e.g. I just helped a construction company house 200 workers for 6 months"},
      {label:"Share an industry insight without being boring",desc:"Market trends, local developments, hospitality news. Make it relevant.",prompt:"I want to share something about what's happening in my market on LinkedIn. Help me make it interesting and useful to the people I'm trying to reach."},
      {label:"Celebrate a win without being cringey",desc:"You closed a big group or earned a client. Share it without the humble brag.",prompt:"I want to post about a recent win on LinkedIn but I don't want it to sound like a humble brag. How do I share it in a way that's genuine and also attracts prospects?"},
    ]
  },
  {
    category:"Engaging with Prospects",
    items:[
      {label:"Comment on a prospect's post",desc:"They posted something. How to engage without sounding like a salesperson.",prompt:"A prospect I want to connect with just posted on LinkedIn. How do I comment in a way that starts a relationship without being obviously salesy?"},
      {label:"React to a company announcement",desc:"They're expanding, hiring, or launching something. Use it as an opening.",prompt:"A target company just posted about an expansion into my market. How do I use this as an opening on LinkedIn?"},
      {label:"Engage with a prospect's content over time",desc:"The long game. Build familiarity before you ever reach out directly.",prompt:"I want to warm up a prospect before sending a connection request. How do I engage with their content over a few weeks so when I do reach out, they recognize my name?"},
    ]
  },
];

const GAMEPLAN_STARTERS = [
  {
    category:"Start Your Week",
    items:[
      {label:"Plan my week",desc:"Sit down with Tammy and figure out where your energy goes across your properties.",prompt:"I want to plan my week. Help me figure out where to focus.",input:true,inputLabel:"What properties or accounts are on your plate right now?",inputPlaceholder:"e.g. 3 hotels in the Denver market, one new onboard, two established"},
      {label:"I have too much going on",desc:"Feeling scattered across too many properties or leads. Get clarity.",prompt:"I'm managing a lot right now and I feel scattered. Help me figure out what actually matters this week."},
    ]
  },
  {
    category:"Prioritize Accounts",
    items:[
      {label:"Which accounts should I focus on?",desc:"You have a pipeline. Tammy helps you figure out where effort turns into meetings.",prompt:"I have a handful of accounts I'm working. Help me think about which ones deserve my energy this week and which ones can wait.",input:true,inputLabel:"List a few accounts and where they stand",inputPlaceholder:"e.g. Johnson Controls (cold, no response), ABC Manufacturing (had a good call), City Sports League (sent proposal)"},
      {label:"New hotel onboarding this week",desc:"Just picked up a property. Figure out where to start.",prompt:"I just got assigned a new hotel property. Help me plan my first week of prospecting for it.",input:true,inputLabel:"What do you know about the property?",inputPlaceholder:"e.g. 120-room Courtyard in a suburban market, near an industrial park"},
      {label:"One property is eating all my time",desc:"Unbalanced portfolio. One hotel is demanding everything.",prompt:"One of my properties is taking up all my time and my other hotels are suffering. How do I rebalance?"},
    ]
  },
  {
    category:"Follow-Up Planning",
    items:[
      {label:"Who do I follow up with this week?",desc:"Review your pending outreach and decide what's worth another touch.",prompt:"I have a bunch of prospects I need to follow up with. Help me think about who to prioritize and what to say differently this time.",input:true,inputLabel:"Who's pending?",inputPlaceholder:"e.g. Left 3 voicemails for a travel manager, emailed a construction company twice, waiting on a proposal response"},
      {label:"Decide what to drop",desc:"Not every lead is worth chasing forever. Know when to move on.",prompt:"I have some accounts I've been chasing for a while with no traction. Help me decide which ones to keep working and which ones to let go."},
      {label:"Plan my outreach sequence for the week",desc:"Map out who gets called, emailed, or messaged and in what order.",prompt:"Help me build an outreach plan for this week. I want to know who I'm contacting each day and through what channel.",input:true,inputLabel:"How many prospects are you actively working?",inputPlaceholder:"e.g. About 12 active prospects across 3 properties"},
    ]
  },
  {
    category:"Reflect & Adjust",
    items:[
      {label:"What worked last week?",desc:"Before planning forward, look back. What landed and what didn't.",prompt:"Let's look at last week. Help me think about what worked, what didn't, and what I should do differently this week."},
      {label:"I'm not hitting my numbers",desc:"Activity is up but results aren't following. Diagnose the gap.",prompt:"I'm doing the work but my numbers aren't where they need to be. Help me figure out if it's a volume problem, a targeting problem, or a quality problem."},
      {label:"Set my goals for the week",desc:"Get specific about what you want to accomplish, not just activity counts.",prompt:"Help me set real goals for this week. Not just 'make 50 calls' but actual outcomes I'm working toward."},
    ]
  },
];

const MODE_PROMPTS = {
  onboarding:"They're new and probably overwhelmed. Give ONE thing to focus on in 2-3 sentences. Ask one question. Do NOT give a roadmap or overview of the whole program. Do NOT front-load context.",
  gameplan:"This is the weekly planning module. Help them prioritize their week across their properties. Ask what's on their plate, then help them decide where to focus energy. Be direct about what matters most and what can wait. Don't build a full plan unprompted. Start with one question, build from their answers. Keep it tight.",
  outreach:"Help with outreach using call planner. Reference their target details if entered. Build their 30-second opening statement (never sell in the opener). Suggest qualifying questions across the four categories (Business Needs, Competition, Decision Making, Event Logistics). Anticipate likely objections. If they want an email, draft one that leads with value. When drafting content for them, write the full draft — word limit doesn't apply to drafted content.",
  situation:"They have a situation. Validate in one sentence first, then coach. Be direct about what went wrong.",
  roleplay:"Set the scene, then become the prospect. Be realistic, slightly guarded, throw objections. Give brief specific feedback after.",
  sharpener:"The seller picked a drill. Present the scenario clearly, then wait for their attempt. After they respond, give brief direct feedback: one thing they did well, one thing to sharpen. Stay under 100 words for feedback. If they say 'surprise me', pick a random drill type and give them a specific scenario. Keep the energy up. Quick workout, not a lecture.",
  social:"Help with LinkedIn and social selling for hotel sales. Be specific to hospitality. No generic LinkedIn advice. Every suggestion should sound like a real hotel salesperson, not a marketing guru or influencer. Keep it practical and direct. When drafting content for them (connection requests, messages, posts), write the full draft — word limit doesn't apply to drafted content.",
  methodology:"Explain through a real hotel sales scenario in 3-4 sentences. Not a textbook definition.",
  hub:"The user is asking about Gillis internal resources, policies, systems, or processes. Answer directly from what you know. If it's in the knowledge base, reference it. If you don't have the specific answer, say so clearly and suggest who they should contact. Don't coach, just inform. Keep it brief.",
};

// ---- UI Components ----
const GillisLogo = ({size=32}) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <rect width="40" height="40" rx="10" fill={G.purple}/>
    <path d="M20 8L28 14V22L20 28L12 22V14L20 8Z" fill={G.teal} opacity="0.9"/>
    <path d="M20 12L25 16V22L20 26L15 22V16L20 12Z" fill={G.purple}/>
    <text x="20" y="22" textAnchor="middle" fill="white" fontSize="10" fontWeight="700" fontFamily="system-ui">G</text>
  </svg>
);

const NavIcon = ({path, color, size=18}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={path}/></svg>
);

const TammyAvatar = ({size=32}) => (
  <div style={{width:size,height:size,borderRadius:"50%",background:`linear-gradient(135deg,${G.purple},${G.lilac})`,display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontSize:size*0.38,fontWeight:600,flexShrink:0}}>TG</div>
);

// ---- Storage (localStorage for real deployment) ----
function loadSessions() {
  try { return JSON.parse(localStorage.getItem("ag-sessions") || "[]"); } catch { return []; }
}
function saveSessions(s) {
  try { localStorage.setItem("ag-sessions", JSON.stringify(s.slice(0, 30))); } catch {}
}
function loadTeamData() {
  try { return JSON.parse(localStorage.getItem("ag-team") || "{}"); } catch { return {}; }
}
function logTeamActivity(name, mod, role, extra) {
  try {
    const d = loadTeamData();
    if (!d[name]) d[name] = { sessions: [], lastActive: "", role: role || "seller" };
    d[name].role = role || d[name].role || "seller";
    d[name].sessions.push({ module: mod, date: new Date().toISOString(), category: extra?.category || mod, firstMessage: extra?.firstMessage || "", messageCount: extra?.messageCount || 0, duration: extra?.duration || 0 });
    d[name].sessions = d[name].sessions.slice(-200);
    d[name].lastActive = new Date().toISOString();
    localStorage.setItem("ag-team", JSON.stringify(d));
  } catch {}
}

// Session category detection
function detectCategory(module, firstMsg) {
  if (module === "onboarding") return "onboarding";
  if (module === "outreach") return "call_prep";
  if (module === "roleplay") return "role_play";
  if (module === "sharpener") return "skill_drill";
  if (module === "methodology") return "methodology_learning";
  if (module === "social") return "social_selling";
  if (module === "gameplan") return "weekly_planning";
  if (module === "situation") {
    const m = (firstMsg || "").toLowerCase();
    if (m.includes("objection") || m.includes("send me your info") || m.includes("rate is too") || m.includes("call me back")) return "objection_handling";
    if (m.includes("cold") || m.includes("voicemail") || m.includes("lost the deal")) return "stalled_account";
    if (m.includes("call") || m.includes("transactional") || m.includes("questions to ask")) return "call_debrief";
    if (m.includes("focus") || m.includes("tough week") || m.includes("rough")) return "motivation";
    if (m.includes("pressure") || m.includes("numbers")) return "leadership_pressure";
    if (m.includes("client") || m.includes("hotel isn't")) return "client_issue";
    return "situation_general";
  }
  return module;
}

// KB: defaults from imported file, overrides stored in localStorage
function getKB() {
  try {
    const override = localStorage.getItem("ag-kb-override");
    if (override) return override;
  } catch {}
  return KNOWLEDGE_BASE;
}
function setKBOverride(text) {
  try { localStorage.setItem("ag-kb-override", text); } catch {}
}
function clearKBOverride() {
  try { localStorage.removeItem("ag-kb-override"); } catch {}
}

// ---- Manager Dashboard ----
function ManagerDashboard({ teamData, userName, onSelectUser }) {
  const users = Object.entries(teamData);
  const now = new Date();
  const weekAgo = new Date(now - 7 * 864e5);
  const monthAgo = new Date(now - 30 * 864e5);
  const totalSessions = users.reduce((s, [, u]) => s + u.sessions.length, 0);
  const weekSessions = users.reduce((s, [, u]) => s + u.sessions.filter(x => new Date(x.date) > weekAgo).length, 0);
  const activeWeek = users.filter(([, u]) => u.sessions.some(s => new Date(s.date) > weekAgo)).length;
  const avgPerSeller = users.length ? Math.round(weekSessions / users.length * 10) / 10 : 0;

  // Activity last 14 days
  const dayBuckets = Array.from({length:14},(_,i) => {const d = new Date(now); d.setDate(d.getDate()-13+i); return d.toISOString().slice(0,10);});
  const dayCounts = dayBuckets.map(day => users.reduce((s,[,u]) => s + u.sessions.filter(x => x.date?.slice(0,10) === day).length, 0));
  const maxDay = Math.max(...dayCounts, 1);

  // Insights
  const insights = [];
  users.forEach(([name, u]) => {
    const da = Math.floor((now - new Date(u.lastActive)) / 864e5);
    if (da >= 7) insights.push({type:"inactive",text:`${name} hasn't logged in for ${da} days`});
  });
  const catCounts = {};
  users.forEach(([,u]) => u.sessions.filter(s => new Date(s.date) > weekAgo).forEach(s => { catCounts[s.category||s.module] = (catCounts[s.category||s.module]||0)+1; }));
  const topCat = Object.entries(catCounts).sort((a,b)=>b[1]-a[1]);
  if (topCat.length) insights.push({type:"pattern",text:`${topCat[0][0].replace(/_/g," ")} is the most common topic this week (${topCat[0][1]} sessions)`});
  const unusedMods = MODULES.filter(m => !users.some(([,u]) => u.sessions.some(s => s.module === m.id && new Date(s.date) > weekAgo)));
  if (unusedMods.length && unusedMods.length < MODULES.length) insights.push({type:"gap",text:`${unusedMods[0].label} had zero usage this week`});

  if (!users.length) {
    return (
      <div style={{padding:"32px 40px",maxWidth:600}}>
        <h2 style={{fontSize:22,fontWeight:600,margin:"0 0 4px"}}>Team Overview</h2>
        <p style={{fontSize:13,color:G.muted,margin:"0 0 28px"}}>Activity across your team. Updates as sellers use the platform.</p>
        <div style={{background:G.white,border:`1px solid ${G.tealBorder}`,borderRadius:14,padding:"36px 32px",textAlign:"center"}}>
          <div style={{fontSize:32,marginBottom:14}}>&#128075;</div>
          <div style={{fontSize:16,fontWeight:600,color:G.dark,marginBottom:8}}>Welcome to your dashboard</div>
          <div style={{fontSize:13,color:G.text,lineHeight:1.7,maxWidth:420,margin:"0 auto"}}>As your team starts using AskGillis, you'll see their activity, patterns, and coaching opportunities here. In the meantime, try switching to Seller Mode to explore the platform yourself and see what your team will experience.</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{padding:"32px 40px",maxWidth:860}}>
      <h2 style={{fontSize:22,fontWeight:600,margin:"0 0 4px"}}>Team Overview</h2>
      <p style={{fontSize:13,color:G.muted,margin:"0 0 28px"}}>Activity across your team. Updates as sellers use the platform.</p>

      <div className="stats-grid" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:28}}>
        {[{l:"Team members",v:users.length,c:G.purple},{l:"Active this week",v:`${activeWeek}`,s:users.length?`${Math.round(activeWeek/users.length*100)}%`:"",c:G.teal},{l:"Sessions this week",v:weekSessions,c:G.teal},{l:"Avg/seller this week",v:avgPerSeller,c:G.muted}].map((s,i) => (
          <div key={i} style={{background:G.white,border:`1px solid ${G.border}`,borderRadius:10,padding:"18px 16px"}}>
            <div style={{fontSize:11,color:G.muted,marginBottom:6,fontWeight:500,textTransform:"uppercase",letterSpacing:"0.04em"}}>{s.l}</div>
            <div style={{fontSize:28,fontWeight:600,color:s.c}}>{s.v}{s.s && <span style={{fontSize:12,fontWeight:500,color:G.muted,marginLeft:6}}>{s.s}</span>}</div>
          </div>
        ))}
      </div>

      {/* 14-day activity chart */}
      <div style={{background:G.white,border:`1px solid ${G.border}`,borderRadius:12,padding:"22px 24px",marginBottom:24}}>
        <div style={{fontSize:13,fontWeight:600,marginBottom:16}}>Activity (Last 14 Days)</div>
        <div style={{display:"flex",alignItems:"flex-end",gap:4,height:60}}>
          {dayCounts.map((c,i) => (
            <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
              <div style={{width:"100%",height:Math.max(2,c/maxDay*50),background:c>0?G.teal:G.borderLight,borderRadius:3,transition:"height 0.3s"}}/>
              <div style={{fontSize:8,color:G.dim}}>{dayBuckets[i].slice(8,10)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Team members */}
      <div style={{background:G.white,border:`1px solid ${G.border}`,borderRadius:12,padding:"22px 24px",marginBottom:24}}>
        <div style={{fontSize:13,fontWeight:600,marginBottom:16}}>Team Members</div>
        {users.length ? users.sort((a,b) => new Date(b[1].lastActive) - new Date(a[1].lastActive)).map(([name, u], i) => {
          const wc = u.sessions.filter(s => new Date(s.date) > weekAgo).length;
          const mc = {}; u.sessions.forEach(s => { mc[s.module] = (mc[s.module]||0)+1; });
          const topMod = Object.entries(mc).sort((a,b)=>b[1]-a[1])[0];
          const ml = topMod ? MODULES.find(x => x.id === topMod[0]) : null;
          const isMe = name === userName;
          const da = Math.floor((now - new Date(u.lastActive)) / 864e5);
          const rc = da === 0 ? "Today" : da === 1 ? "Yesterday" : `${da}d ago`;
          const statusColor = da <= 7 ? G.teal : da <= 14 ? G.gold : "#ef4444";
          return (
            <div key={i} onClick={() => onSelectUser(name)} style={{display:"flex",alignItems:"center",gap:14,padding:"12px 0",borderBottom:i<users.length-1?`1px solid ${G.borderLight}`:"none",cursor:"pointer"}}
              onMouseEnter={e => e.currentTarget.style.background=G.bg} onMouseLeave={e => e.currentTarget.style.background="transparent"}>
              <div style={{position:"relative"}}>
                <div style={{width:32,height:32,borderRadius:"50%",background:isMe?G.tealLight:G.purpleLight,border:`1.5px solid ${isMe?G.tealBorder:G.purpleBorder}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:600,color:isMe?G.teal:G.purple}}>
                  {name.split(" ").map(w=>w[0]).join("").slice(0,2)}
                </div>
                <div style={{position:"absolute",bottom:-1,right:-1,width:8,height:8,borderRadius:"50%",background:statusColor,border:"2px solid white"}}/>
              </div>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:500}}>{name}{isMe && <span style={{fontSize:10,color:G.teal,marginLeft:6}}>you</span>}</div>
                <div style={{fontSize:11,color:G.muted,display:"flex",gap:8}}>
                  {ml && <span style={{color:ml.color}}>Top: {ml.label}</span>}
                  <span>{u.sessions.length} total</span>
                </div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:13,fontWeight:600,color:wc>0?G.teal:G.dim}}>{wc}/wk</div>
                <div style={{fontSize:10,color:G.dim}}>{rc}</div>
              </div>
            </div>
          );
        }) : <div style={{fontSize:13,color:G.dim}}>No team members yet.</div>}
      </div>

      {/* Insights */}
      {insights.length > 0 && (
        <div style={{background:G.white,border:`1px solid ${G.border}`,borderRadius:12,padding:"18px 24px"}}>
          <div style={{fontSize:13,fontWeight:600,marginBottom:12}}>Quick Insights</div>
          {insights.slice(0,4).map((ins,i) => (
            <div key={i} style={{fontSize:12,color:G.text,padding:"6px 0",borderBottom:i<insights.length-1?`1px solid ${G.borderLight}`:"none",display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:14}}>{ins.type==="inactive"?"⚠️":ins.type==="pattern"?"📊":"💡"}</span>{ins.text}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---- Individual Seller View ----
function SellerDetail({ name, data, onBack }) {
  const now = new Date();
  const weekAgo = new Date(now - 7 * 864e5);
  const weekSessions = data.sessions.filter(s => new Date(s.date) > weekAgo).length;
  const totalDuration = data.sessions.reduce((s,x) => s + (x.duration||0), 0);
  const mc = {}; data.sessions.forEach(s => { mc[s.module] = (mc[s.module]||0)+1; });
  const modEntries = Object.entries(mc).sort((a,b)=>b[1]-a[1]);
  const maxMC = modEntries.length ? modEntries[0][1] : 1;
  const topMod = modEntries.length ? MODULES.find(x => x.id === modEntries[0][0]) : null;
  const cc = {}; data.sessions.forEach(s => { const c = s.category||s.module; cc[c]=(cc[c]||0)+1; });
  const catEntries = Object.entries(cc).sort((a,b)=>b[1]-a[1]);
  const totalCat = catEntries.reduce((s,[,v])=>s+v,0) || 1;

  return (
    <div style={{padding:"32px 40px",maxWidth:860}}>
      <button onClick={onBack} style={{background:"none",border:"none",cursor:"pointer",fontSize:12,color:G.teal,fontFamily:"inherit",padding:0,marginBottom:16,display:"flex",alignItems:"center",gap:4}}>← Back to Team</button>
      <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:28}}>
        <div style={{width:44,height:44,borderRadius:"50%",background:G.purpleLight,border:`2px solid ${G.purpleBorder}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:600,color:G.purple}}>
          {name.split(" ").map(w=>w[0]).join("").slice(0,2)}
        </div>
        <div>
          <h2 style={{fontSize:20,fontWeight:600,margin:0}}>{name}</h2>
          <div style={{fontSize:12,color:G.muted}}>Role: {data.role||"seller"} · Last active: {data.lastActive ? new Date(data.lastActive).toLocaleDateString() : "Never"}</div>
        </div>
      </div>

      <div className="stats-grid" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:28}}>
        {[{l:"Total sessions",v:data.sessions.length,c:G.purple},{l:"This week",v:weekSessions,c:G.teal},{l:"Top module",v:topMod?topMod.label:"—",c:topMod?topMod.color:G.dim,small:true},{l:"Total time",v:totalDuration>3600?Math.round(totalDuration/3600)+"h":Math.round(totalDuration/60)+"m",c:G.muted}].map((s,i) => (
          <div key={i} style={{background:G.white,border:`1px solid ${G.border}`,borderRadius:10,padding:"18px 16px"}}>
            <div style={{fontSize:11,color:G.muted,marginBottom:6,fontWeight:500,textTransform:"uppercase",letterSpacing:"0.04em"}}>{s.l}</div>
            <div style={{fontSize:s.small?16:28,fontWeight:600,color:s.c}}>{s.v}</div>
          </div>
        ))}
      </div>

      {/* Module breakdown */}
      <div style={{background:G.white,border:`1px solid ${G.border}`,borderRadius:12,padding:"22px 24px",marginBottom:24}}>
        <div style={{fontSize:13,fontWeight:600,marginBottom:16}}>Module Breakdown</div>
        {modEntries.length ? modEntries.map(([mod, count], i) => {
          const m = MODULES.find(x => x.id === mod);
          return (
            <div key={i} style={{display:"flex",alignItems:"center",gap:12,marginBottom:10}}>
              <div style={{width:120,fontSize:12,fontWeight:500}}>{m ? m.label : mod}</div>
              <div style={{flex:1,height:8,background:G.bg,borderRadius:4,overflow:"hidden"}}>
                <div style={{width:`${(count/maxMC)*100}%`,height:"100%",background:m?m.color:G.teal,borderRadius:4}}/>
              </div>
              <div style={{width:40,fontSize:12,fontWeight:600,color:G.muted,textAlign:"right"}}>{count}</div>
            </div>
          );
        }) : <div style={{fontSize:13,color:G.dim}}>No activity yet.</div>}
      </div>

      {/* Category breakdown */}
      <div style={{background:G.white,border:`1px solid ${G.border}`,borderRadius:12,padding:"22px 24px",marginBottom:24}}>
        <div style={{fontSize:13,fontWeight:600,marginBottom:16}}>What They're Working On</div>
        {catEntries.length ? catEntries.slice(0,8).map(([cat, count], i) => (
          <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 0",borderBottom:i<catEntries.length-1?`1px solid ${G.borderLight}`:"none"}}>
            <span style={{fontSize:12,fontWeight:500,textTransform:"capitalize"}}>{cat.replace(/_/g," ")}</span>
            <span style={{fontSize:12,fontWeight:600,color:G.teal}}>{Math.round(count/totalCat*100)}%</span>
          </div>
        )) : <div style={{fontSize:13,color:G.dim}}>No data.</div>}
      </div>

      {/* Recent sessions */}
      <div style={{background:G.white,border:`1px solid ${G.border}`,borderRadius:12,padding:"22px 24px"}}>
        <div style={{fontSize:13,fontWeight:600,marginBottom:16}}>Recent Sessions</div>
        {data.sessions.slice(-20).reverse().map((s,i) => {
          const m = MODULES.find(x => x.id === s.module);
          const d = s.date ? new Date(s.date) : null;
          return (
            <div key={i} style={{padding:"10px 0",borderBottom:i<19?`1px solid ${G.borderLight}`:"none",display:"flex",alignItems:"center",gap:12}}>
              <div style={{width:4,height:4,borderRadius:"50%",background:m?m.color:G.teal,flexShrink:0}}/>
              <div style={{flex:1}}>
                <div style={{fontSize:12,fontWeight:500}}>{m?m.label:s.module}{s.category && s.category !== s.module ? <span style={{fontSize:10,color:G.dim,marginLeft:8,textTransform:"capitalize"}}>{s.category.replace(/_/g," ")}</span> : ""}</div>
                {s.firstMessage && <div style={{fontSize:11,color:G.muted,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",maxWidth:400}}>{s.firstMessage}</div>}
              </div>
              <div style={{fontSize:10,color:G.dim,flexShrink:0}}>{d?d.toLocaleDateString():""}</div>
              <div style={{fontSize:10,color:G.dim,flexShrink:0}}>{s.messageCount||0} msgs</div>
            </div>
          );
        })}
        {!data.sessions.length && <div style={{fontSize:13,color:G.dim}}>No sessions yet.</div>}
      </div>
    </div>
  );
}

// ---- Patterns & Topics ----
function PatternsView({ teamData }) {
  const now = new Date();
  const weekAgo = new Date(now - 7 * 864e5);
  const users = Object.entries(teamData);
  const allWeekSessions = users.flatMap(([,u]) => u.sessions.filter(s => new Date(s.date) > weekAgo));

  // Top categories
  const catCounts = {};
  allWeekSessions.forEach(s => { const c = s.category||s.module; catCounts[c]=(catCounts[c]||0)+1; });
  const topCats = Object.entries(catCounts).sort((a,b)=>b[1]-a[1]);

  // Module usage
  const modCounts = {};
  allWeekSessions.forEach(s => { modCounts[s.module]=(modCounts[s.module]||0)+1; });
  const modEntries = Object.entries(modCounts).sort((a,b)=>b[1]-a[1]);
  const maxMod = modEntries.length ? modEntries[0][1] : 1;

  // Recent first messages
  const recentMsgs = users.flatMap(([name,u]) => u.sessions.filter(s => s.firstMessage && new Date(s.date) > weekAgo).map(s => ({name,msg:s.firstMessage,date:s.date,module:s.module})))
    .sort((a,b) => new Date(b.date) - new Date(a.date)).slice(0,10);

  // Time of day
  const hours = {Morning:0,Midday:0,Afternoon:0,Evening:0};
  allWeekSessions.forEach(s => {
    if (!s.date) return;
    const h = new Date(s.date).getHours();
    if (h < 12) hours.Morning++; else if (h < 14) hours.Midday++; else if (h < 18) hours.Afternoon++; else hours.Evening++;
  });
  const maxH = Math.max(...Object.values(hours), 1);

  return (
    <div style={{padding:"32px 40px",maxWidth:860}}>
      <h2 style={{fontSize:22,fontWeight:600,margin:"0 0 4px"}}>Patterns & Topics</h2>
      <p style={{fontSize:13,color:G.muted,margin:"0 0 28px"}}>What your team is working on this week.</p>

      <div className="patterns-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,marginBottom:24}}>
        <div style={{background:G.white,border:`1px solid ${G.border}`,borderRadius:12,padding:"22px 24px"}}>
          <div style={{fontSize:13,fontWeight:600,marginBottom:14}}>Top Topics This Week</div>
          {topCats.length ? topCats.slice(0,8).map(([cat,count],i) => (
            <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:i<topCats.length-1?`1px solid ${G.borderLight}`:"none"}}>
              <span style={{fontSize:12,textTransform:"capitalize"}}>{cat.replace(/_/g," ")}</span>
              <span style={{fontSize:12,fontWeight:600,color:G.teal}}>{count}</span>
            </div>
          )) : <div style={{fontSize:13,color:G.dim}}>No data this week.</div>}
        </div>

        <div style={{background:G.white,border:`1px solid ${G.border}`,borderRadius:12,padding:"22px 24px"}}>
          <div style={{fontSize:13,fontWeight:600,marginBottom:14}}>Time of Day</div>
          {Object.entries(hours).map(([label,count],i) => (
            <div key={i} style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
              <div style={{width:70,fontSize:12}}>{label}</div>
              <div style={{flex:1,height:8,background:G.bg,borderRadius:4,overflow:"hidden"}}><div style={{width:`${(count/maxH)*100}%`,height:"100%",background:G.teal,borderRadius:4}}/></div>
              <div style={{width:30,fontSize:11,color:G.muted,textAlign:"right"}}>{count}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{background:G.white,border:`1px solid ${G.border}`,borderRadius:12,padding:"22px 24px",marginBottom:24}}>
        <div style={{fontSize:13,fontWeight:600,marginBottom:14}}>Module Usage This Week</div>
        {modEntries.length ? modEntries.map(([mod,count],i) => {
          const m = MODULES.find(x => x.id === mod);
          return (
            <div key={i} style={{display:"flex",alignItems:"center",gap:12,marginBottom:10}}>
              <div style={{width:120,fontSize:12,fontWeight:500}}>{m?m.label:mod}</div>
              <div style={{flex:1,height:8,background:G.bg,borderRadius:4,overflow:"hidden"}}><div style={{width:`${(count/maxMod)*100}%`,height:"100%",background:m?m.color:G.teal,borderRadius:4}}/></div>
              <div style={{width:40,fontSize:12,fontWeight:600,color:G.muted,textAlign:"right"}}>{count}</div>
            </div>
          );
        }) : <div style={{fontSize:13,color:G.dim}}>No data.</div>}
      </div>

      <div style={{background:G.white,border:`1px solid ${G.border}`,borderRadius:12,padding:"22px 24px"}}>
        <div style={{fontSize:13,fontWeight:600,marginBottom:14}}>What Sellers Are Asking</div>
        {recentMsgs.length ? recentMsgs.map((r,i) => {
          const m = MODULES.find(x => x.id === r.module);
          return (
            <div key={i} style={{padding:"8px 0",borderBottom:i<recentMsgs.length-1?`1px solid ${G.borderLight}`:"none"}}>
              <div style={{fontSize:12,color:G.text,lineHeight:1.5,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>"{r.msg}"</div>
              <div style={{fontSize:10,color:G.dim,marginTop:2}}>{r.name} · {m?m.label:r.module}</div>
            </div>
          );
        }) : <div style={{fontSize:13,color:G.dim}}>No conversations this week.</div>}
      </div>
    </div>
  );
}

// ---- KB Admin ----
function KBAdmin({ kbWords, hasOverride, onUpdate, onReset }) {
  const fileRef = useRef(null);
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setStatus("Reading file...");
    setSaving(true);
    try {
      const text = await file.text();
      setKBOverride(text);
      onUpdate(text);
      setStatus(`Saved! ${text.split(/\s+/).length.toLocaleString()} words loaded.`);
    } catch (err) {
      setStatus("Error: " + err.message);
    }
    setSaving(false);
    setTimeout(() => setStatus(""), 4000);
  };

  const handleReset = () => {
    clearKBOverride();
    onReset();
    setStatus("Reset to default KB from repo.");
    setTimeout(() => setStatus(""), 3000);
  };

  return (
    <div style={{padding:"32px 40px",maxWidth:800}}>
      <h2 style={{fontSize:22,fontWeight:600,margin:"0 0 4px"}}>Knowledge Base</h2>
      <p style={{fontSize:13,color:G.muted,margin:"0 0 24px"}}>
        Tammy's reference material. Default comes from the repo file. Upload a .txt to override, or edit the repo file directly.
      </p>

      <div style={{padding:"14px 18px",borderRadius:10,background:G.tealLight,border:`1px solid ${G.tealBorder}`,marginBottom:24}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <span style={{fontSize:13,fontWeight:600,color:G.teal}}>
              {hasOverride ? "Custom KB Active" : "Using Default KB"}
            </span>
            <span style={{fontSize:12,color:G.muted,marginLeft:12}}>
              {kbWords.toLocaleString()} words
            </span>
          </div>
          {hasOverride && (
            <button onClick={handleReset} style={{fontSize:11,color:G.orange,background:"none",border:"none",cursor:"pointer",fontFamily:"inherit"}}>
              Reset to default
            </button>
          )}
        </div>
      </div>

      <div
        onClick={() => fileRef.current?.click()}
        style={{border:`2px dashed ${G.border}`,borderRadius:12,padding:"48px 24px",textAlign:"center",cursor:"pointer",background:G.white,transition:"border-color 0.2s"}}
        onMouseEnter={e => e.currentTarget.style.borderColor = G.teal}
        onMouseLeave={e => e.currentTarget.style.borderColor = G.border}
      >
        <div style={{fontSize:32,marginBottom:12,opacity:0.3}}>&#8593;</div>
        <div style={{fontSize:14,fontWeight:500,color:G.dark,marginBottom:4}}>
          {saving ? "Processing..." : "Click to upload replacement .txt file"}
        </div>
        <div style={{fontSize:12,color:G.muted}}>Or edit src/knowledgebase.js in the repo directly</div>
        <input ref={fileRef} type="file" accept=".txt" onChange={handleFile} style={{display:"none"}} />
      </div>

      {status && (
        <div style={{marginTop:16,padding:"10px 16px",borderRadius:8,background:status.includes("Saved")||status.includes("Reset")?G.tealLight:G.bg,border:`1px solid ${status.includes("Saved")||status.includes("Reset")?G.tealBorder:G.border}`,fontSize:13,color:status.includes("Saved")||status.includes("Reset")?G.teal:G.text}}>
          {status}
        </div>
      )}
    </div>
  );
}

// ---- Main App ----
export default function App() {
  const [screen, setScreen] = useState("login");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");
  const [userRole, setUserRole] = useState("");
  const [mode, setMode] = useState("seller");
  const [mgrView, setMgrView] = useState("team");
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeModule, setActiveModule] = useState(() => {
    try {
      const last = localStorage.getItem("ag-last-module");
      if (last && last !== "help") return last;
    } catch {}
    return new Date().getDay() === 1 ? "gameplan" : "onboarding";
  });
  const [chatOpen, setChatOpen] = useState(() => typeof window !== "undefined" ? window.innerWidth >= 1024 : true);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [od, setOd] = useState({company:"",segment:"",contact:"",notes:""});
  const [rp, setRp] = useState({who:"",segment:"",objective:""});
  // drill state removed — sharpener now uses categorized drills
  const [sessions, setSessions] = useState([]);
  const [teamData, setTeamData] = useState({});
  const [kbWords, setKbWords] = useState(0);
  const [hasKBOverride, setHasKBOverride] = useState(false);
  const [fbOpen, setFbOpen] = useState(false);
  const [fbText, setFbText] = useState("");
  const [fbSending, setFbSending] = useState(false);
  const [fbToast, setFbToast] = useState("");
  const [checked, setChecked] = useState(() => {
    try { return JSON.parse(localStorage.getItem("ag-ob-checked") || "[]"); } catch { return []; }
  });
  const toggleCheck = (id) => {
    setChecked(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      try { localStorage.setItem("ag-ob-checked", JSON.stringify(next)); } catch {}
      return next;
    });
  };
  const [socialExpanded, setSocialExpanded] = useState(null);
  const [socialInput, setSocialInput] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef(null);
  const [faqOpen, setFaqOpen] = useState(null);
  const [winW, setWinW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  const [loginPhase, setLoginPhase] = useState(0); // 0=splash, 1=transition, 2=login
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = winW < 768;
  const isTablet = winW >= 768 && winW < 1024;
  const isCompact = winW < 1024;

  const kbRef = useRef(null);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const convRef = useRef([]);
  const streamTickerRef = useRef(null);
  const prevModuleRef = useRef(activeModule);

  const userName = email ? email.split("@")[0].replace(/[._]/g," ").replace(/\b\w/g, l => l.toUpperCase()) : "";

  // Global search index
  const searchIndex = useMemo(() => {
    const items = [];
    // Modules as navigation targets
    MODULES.forEach(m => items.push({text:m.label,module:m.id,type:"module",action:"navigate",color:m.color}));
    // Onboarding items
    ONBOARDING_ITEMS.filter(x=>x.tammy).forEach(x => items.push({text:x.label,module:"onboarding",type:"Onboarding",action:"prompt",prompt:x.prompt,color:G.teal}));
    // Game Plan
    GAMEPLAN_STARTERS.forEach(cat => cat.items.forEach(x => items.push({text:x.label,desc:x.desc,module:"gameplan",type:"Weekly Game Plan",action:"prompt",prompt:x.prompt,color:"#8B5CF6"})));
    // Situation
    SITUATION_CATEGORIES.forEach(cat => cat.items.forEach(x => items.push({text:x.label,desc:x.desc,module:"situation",type:"Situation",action:"prompt",prompt:x.prompt,color:G.lilac})));
    // Sharpener
    SHARPENER_CATEGORIES.forEach(cat => cat.items.forEach(x => items.push({text:x.label,module:"sharpener",type:"Daily Sharpener",action:"drill",scenario:x.scenario,category:cat.category,color:cat.color})));
    // Social
    SOCIAL_ITEMS.forEach(cat => cat.items.forEach(x => items.push({text:x.label,desc:x.desc,module:"social",type:"LinkedIn & Social",action:"prompt",prompt:x.prompt,color:"#3B82F6"})));
    // Methodology
    METHODOLOGY_ITEMS.forEach(x => items.push({text:x.title,desc:x.desc,module:"methodology",type:"Methodology",action:"prompt",prompt:"Explain "+x.title+" with a real hotel sales example.",color:x.color}));
    // Hub
    HUB_CATEGORIES.forEach(cat => cat.items.forEach(x => {
      if (x.type==="ask") items.push({text:x.label,desc:x.desc,module:"hub",type:"Gillis Hub",action:"prompt",prompt:x.prompt,color:"#6B7280"});
      else if (x.type==="link"&&!x.placeholder) items.push({text:x.label,desc:x.desc,module:"hub",type:"Gillis Hub",action:"link",url:x.url,color:"#3B82F6"});
      else if (x.type==="document") items.push({text:x.label,desc:x.desc,module:"hub",type:"Gillis Hub",action:"doc",filename:x.filename,color:G.teal});
    }));
    // FAQ
    HELP_FAQS.forEach(x => items.push({text:x.q,module:"help",type:"FAQ",action:"navigate",color:G.muted}));
    return items;
  }, []);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    const words = q.split(/\s+/).filter(Boolean);
    return searchIndex
      .map(item => {
        const hay = (item.text + " " + (item.desc||"") + " " + (item.type||"")).toLowerCase();
        const score = words.reduce((s,w) => s + (hay.includes(w) ? 1 : 0), 0);
        return {...item, score};
      })
      .filter(x => x.score > 0)
      .sort((a,b) => b.score - a.score)
      .slice(0, 12);
  }, [searchQuery, searchIndex]);

  // Login animation phases
  useEffect(() => {
    if (screen !== "login") return;
    const t1 = setTimeout(() => setLoginPhase(1), 2800);
    const t2 = setTimeout(() => setLoginPhase(2), 3800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [screen]);

  // Responsive: track window width
  useEffect(() => {
    const onResize = () => setWinW(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Cmd+K / Ctrl+K global search shortcut
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k" && screen === "platform") { e.preventDefault(); setSearchOpen(true); setSearchQuery(""); }
      if (e.key === "Escape" && searchOpen) { setSearchOpen(false); setSearchQuery(""); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [searchOpen, screen]);

  // Load KB on mount
  useEffect(() => {
    const kb = getKB();
    kbRef.current = kb;
    setKbWords(kb.split(/\s+/).length);
    try { setHasKBOverride(!!localStorage.getItem("ag-kb-override")); } catch {}
  }, []);

  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [messages, loading]);
  useEffect(() => { if (chatOpen) setTimeout(() => inputRef.current?.focus(), 200); }, [chatOpen]);
  useEffect(() => {
    if (screen === "platform") {
      if (streamTickerRef.current) { clearInterval(streamTickerRef.current); streamTickerRef.current = null; }
      if (messages.length >= 2) saveSession();
      prevModuleRef.current = activeModule;
      setMessages([]);
      convRef.current = [];
      sessionStartRef.current = null;
      setSocialExpanded(null);
      setSocialInput("");
      if (activeModule !== "help" && activeModule !== "__mgr") {
        try { localStorage.setItem("ag-last-module", activeModule); } catch {}
      }
    }
  }, [activeModule]);
  useEffect(() => {
    if (screen === "platform") {
      setSessions(loadSessions());
      setTeamData(loadTeamData());
    }
  }, [screen]);

  const handleLogin = () => {
    if (code.toUpperCase().trim() !== INVITATION_CODE) { setErr("Invalid invitation code."); return; }
    if (!email.includes("@")) { setErr("Please enter a valid email."); return; }
    // If role already stored, go straight to platform
    setScreen("role-select");
  };

  const selectRole = (role) => {
    setUserRole(role);
    try { localStorage.setItem("ag-role-" + email.trim().toLowerCase(), role); } catch {}
    setMode(role === "manager" ? "manager" : "seller");
    setChatOpen(window.innerWidth >= 1024);
    setScreen("platform");
  };

  const sessionStartRef = useRef(null);

  const saveSession = () => {
    if (messages.length < 2) return;
    const fm = messages.find(m => !m.isTammy);
    const firstMsg = fm ? fm.text : "";
    const duration = sessionStartRef.current ? Math.round((Date.now() - sessionStartRef.current) / 1000) : 0;
    const mod4save = prevModuleRef.current || activeModule;
    const cat = detectCategory(mod4save, firstMsg);
    const s = {
      id: Date.now().toString(),
      module: mod4save,
      moduleLabel: MODULES.find(m => m.id === mod4save)?.label || mod4save,
      summary: fm ? fm.text.slice(0, 55) + "..." : "Session",
      date: new Date().toISOString(),
      messageCount: messages.length,
      messages: messages.slice(0, 50),
    };
    const updated = [s, ...sessions].slice(0, 30);
    setSessions(updated);
    saveSessions(updated);
    // Log rich session to team data
    logTeamActivity(userName, mod4save, userRole, { category: cat, firstMessage: firstMsg.slice(0, 120), messageCount: messages.length, duration });
    setTeamData(loadTeamData());
  };

  const getCtx = () => {
    let c = "MODULE: " + (MODULES.find(m => m.id === activeModule)?.label || activeModule);
    if (activeModule === "outreach" && od.company) c += "\nTARGET: " + od.company + ". Segment: " + od.segment + ". Contact: " + od.contact + ". Notes: " + od.notes;
    if (activeModule === "roleplay" && rp.who) c += "\nROLE PLAY: Calling: " + rp.who + ". Segment: " + rp.segment + ". Objective: " + rp.objective;
    return c;
  };

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setMessages(p => [...p, { text: msg, isTammy: false }]);
    if (!text) setInput("");
    setLoading(true);
    if (!sessionStartRef.current) sessionStartRef.current = Date.now();
    convRef.current.push({ role: "user", content: msg });

    const kbContent = kbRef.current || "";
    const roleContext = userRole === "manager"
      ? "\n\nUSER ROLE: This person is a manager/RDOS who oversees sellers. If they ask about their own selling, coach them normally. If they ask about managing their team, coaching their sellers, or how to help a struggling rep, shift to coaching-the-coach mode. Help them diagnose seller issues and suggest how to address them in one-on-ones."
      : "\n\nUSER ROLE: This person is a seller.";
    const sys = SYSTEM_PROMPT
      + "\n\nSALES KNOWLEDGE BASE:\n" + kbContent
      + "\n\nGILLIS OPERATIONS KNOWLEDGE BASE:\n" + OPERATIONAL_KB
      + roleContext
      + "\n\nMODE: " + (MODE_PROMPTS[activeModule] || "")
      + "\n\n" + getCtx()
      + "\n\nToday: " + new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-opus-4-6", max_tokens: 1000, system: sys, messages: [...convRef.current] }),
      });

      // Error response — not streaming
      if (!res.ok) {
        let errMsg = "Something went wrong. Try again.";
        try { const data = JSON.parse(await res.text()); errMsg = data.error?.message || errMsg; } catch {}
        convRef.current.push({ role: "assistant", content: errMsg });
        setMessages(p => [...p, { text: errMsg, isTammy: true }]);
        setLoading(false);
        setTimeout(() => inputRef.current?.focus(), 100);
        return;
      }

      // Clean up any previous streaming ticker
      if (streamTickerRef.current) { clearInterval(streamTickerRef.current); streamTickerRef.current = null; }

      // Streaming with fixed-interval typewriter
      setMessages(p => [...p, { text: "", isTammy: true }]);
      setLoading(false);
      let fullText = "";
      let displayed = 0;
      let streamDone = false;
      let aborted = false;

      // Fixed 12ms interval releases characters at a steady, even pace
      const ticker = setInterval(() => {
        if (aborted) { clearInterval(ticker); streamTickerRef.current = null; return; }
        if (displayed >= fullText.length) {
          if (streamDone) {
            clearInterval(ticker);
            streamTickerRef.current = null;
            convRef.current.push({ role: "assistant", content: fullText || "Empty response." });
          }
          return;
        }
        const next = fullText.indexOf(" ", displayed + 1);
        displayed = next === -1 ? fullText.length : Math.min(next + 1, fullText.length);
        setMessages(p => { if (p.length === 0) { aborted = true; return p; } const u = p.slice(); u[u.length - 1] = { text: fullText.slice(0, displayed), isTammy: true }; return u; });
      }, 12);
      streamTickerRef.current = ticker;

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      const processLines = (text) => {
        buffer += text;
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const payload = line.slice(6).trim();
          if (!payload || payload === "[DONE]") continue;
          try {
            const evt = JSON.parse(payload);
            if (evt.type === "content_block_delta" && evt.delta?.text) {
              fullText += evt.delta.text;
            }
          } catch {}
        }
      };

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          processLines(decoder.decode(value, { stream: true }));
        }
        if (buffer.trim()) processLines("\n");
      } catch { /* stream interrupted — use what we have */ }
      streamDone = true;

      // Wait for the ticker to finish displaying (with timeout safety)
      await new Promise(resolve => {
        let waited = 0;
        const check = setInterval(() => {
          waited += 20;
          if (aborted || displayed >= fullText.length || waited > 10000) { clearInterval(check); resolve(); }
        }, 20);
      });
      if (!aborted && fullText) {
        setMessages(p => { if (p.length === 0) return p; const u = p.slice(); u[u.length - 1] = { text: fullText, isTammy: true }; return u; });
      }
    } catch (e) {
      if (streamTickerRef.current) { clearInterval(streamTickerRef.current); streamTickerRef.current = null; }
      setMessages(p => [...p, { text: "Connection error. Please try again.", isTammy: true }]);
      setLoading(false);
    }
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  // ---- FEEDBACK ----
  const submitFeedback = async () => {
    if (!fbText.trim() || fbSending) return;
    setFbSending(true);
    const transcript = messages.map(m => (m.isTammy ? "Tammy: " : "User: ") + m.text).join("\n\n");
    const payload = {
      timestamp: new Date().toISOString(),
      email: email,
      mode: mode,
      module: MODULES.find(m => m.id === activeModule)?.label || activeModule,
      context: getCtx(),
      feedback: fbText.trim(),
      conversation: transcript || "(no conversation yet)",
      messageCount: messages.length,
    };
    try {
      if (FEEDBACK_SHEET_URL) {
        // Use hidden form + iframe to avoid CORS issues with Apps Script redirects
        const form = document.createElement("form");
        form.method = "POST";
        form.action = FEEDBACK_SHEET_URL;
        form.target = "fb_iframe";
        form.style.display = "none";
        const addField = (name, value) => {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = name;
          input.value = value;
          form.appendChild(input);
        };
        Object.entries(payload).forEach(([k, v]) => addField(k, v));
        let iframe = document.getElementById("fb_iframe");
        if (!iframe) {
          iframe = document.createElement("iframe");
          iframe.name = "fb_iframe";
          iframe.id = "fb_iframe";
          iframe.style.display = "none";
          document.body.appendChild(iframe);
        }
        document.body.appendChild(form);
        form.submit();
        form.remove();
      }
      setFbToast("Feedback sent! Thank you.");
      setFbText("");
      setFbOpen(false);
    } catch {
      setFbToast("Could not send feedback. Please try again.");
    }
    setFbSending(false);
    setTimeout(() => setFbToast(""), 4000);
  };

  // ---- LOGIN ----
  if (screen === "login") {
    return (
      <div style={{position:"relative",height:"100vh",overflow:"hidden",fontFamily:"'DM Sans',system-ui,sans-serif"}}>
        {/* Background layers */}
        <div style={{position:"absolute",inset:0,background:"linear-gradient(160deg,#1a1035 0%,#2d1f5e 40%,#3D2B6B 70%,#1a1035 100%)",opacity:loginPhase>=1?0.6:1,transition:"opacity 1.4s ease"}}/>
        <div style={{position:"absolute",inset:0,backgroundImage:"url(/images/photo-1759038086397-2b7b1535da04.jpg)",backgroundSize:"cover",backgroundPosition:"center 40%",filter:"grayscale(100%)",opacity:loginPhase>=1?0.35:0,transform:loginPhase>=1?"scale(1)":"scale(1.03)",transition:"opacity 1.4s ease, transform 8s cubic-bezier(0.16,1,0.3,1)"}}/>
        <div style={{position:"absolute",inset:0,background:"rgba(61,43,107,0.55)",mixBlendMode:"multiply",opacity:loginPhase>=1?1:0,transition:"opacity 1.2s ease 0.2s"}}/>
        <div style={{position:"absolute",inset:0,opacity:0.03,backgroundImage:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",backgroundSize:"128px",mixBlendMode:"overlay",pointerEvents:"none"}}/>

        {/* Splash screen */}
        <div style={{position:"absolute",inset:0,zIndex:10,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",opacity:loginPhase>=1?0:1,transform:loginPhase>=1?"scale(0.95)":"scale(1)",transition:"opacity 0.5s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1)",pointerEvents:loginPhase>=1?"none":"auto"}}>
          <div style={{opacity:0,animation:"loginLogoIn 0.7s cubic-bezier(0.16,1,0.3,1) 0.2s forwards"}}>
            <img src="/images/gillis-logo-white.png" alt="Gillis" style={{height:64}}/>
          </div>
        </div>

        {/* Top-left logo */}
        <div style={{position:"absolute",top:32,left:32,zIndex:6,opacity:loginPhase>=2?1:0,transition:"opacity 0.6s ease 1s"}}>
          <img src="/images/gillis-logo-white.png" alt="Gillis" style={{height:36,opacity:0.6}}/>
        </div>

        {/* Login form */}
        <div style={{position:"absolute",inset:0,zIndex:5,display:"flex",alignItems:"center",justifyContent:"center",padding:"40px 28px",opacity:loginPhase>=2?1:0,pointerEvents:loginPhase>=2?"auto":"none",transition:"opacity 0.7s cubic-bezier(0.16,1,0.3,1) 0.15s"}}>
          <div style={{width:"100%",maxWidth:400,textAlign:"center"}}>
            <div className={loginPhase>=2?"login-anim login-d1":"login-anim"} style={{opacity:0,transform:"translateY(20px)"}}>
              <h1 style={{fontSize:32,fontWeight:800,color:"white",margin:"0 0 8px",letterSpacing:"-0.02em"}}>AskGillis</h1>
            </div>
            <div className={loginPhase>=2?"login-anim login-d2":"login-anim"} style={{opacity:0,transform:"translateY(20px)"}}>
              <p style={{fontSize:16,fontWeight:400,color:"rgba(255,255,255,0.7)",margin:"0 0 28px",lineHeight:1.5}}>AI-powered sales coaching built on 28 years of hospitality expertise.</p>
            </div>
            <div className={loginPhase>=2?"login-anim login-d3":"login-anim"} style={{opacity:0,transform:"translateY(20px)"}}>
              <div style={{background:"rgba(15,12,25,0.88)",backdropFilter:"blur(30px)",WebkitBackdropFilter:"blur(30px)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:16,padding:"32px 28px",textAlign:"left"}}>
                <div style={{marginBottom:18}}>
                  <label style={{display:"block",fontSize:11,fontWeight:600,color:"rgba(255,255,255,0.6)",marginBottom:8,letterSpacing:"0.06em",textTransform:"uppercase"}}>Email</label>
                  <input type="email" value={email} onChange={e => {setEmail(e.target.value);setErr("");}} placeholder="you@hotel.com"
                    onKeyDown={e => {if(e.key==="Enter")handleLogin();}}
                    style={{width:"100%",padding:"14px 16px",borderRadius:10,border:"1px solid rgba(255,255,255,0.18)",background:"rgba(255,255,255,0.1)",color:"white",fontSize:15,fontWeight:500,outline:"none",boxSizing:"border-box",fontFamily:"inherit",transition:"background 0.2s, border-color 0.2s"}}/>
                </div>
                <div style={{marginBottom:24}}>
                  <label style={{display:"block",fontSize:11,fontWeight:600,color:"rgba(255,255,255,0.6)",marginBottom:8,letterSpacing:"0.06em",textTransform:"uppercase"}}>Invitation Code</label>
                  <input type="text" value={code} onChange={e => {setCode(e.target.value);setErr("");}} placeholder="Enter your code"
                    onKeyDown={e => {if(e.key==="Enter")handleLogin();}}
                    style={{width:"100%",padding:"14px 16px",borderRadius:10,border:`1px solid ${err?"rgba(255,100,100,0.5)":"rgba(255,255,255,0.18)"}`,background:"rgba(255,255,255,0.1)",color:"white",fontSize:15,fontWeight:500,outline:"none",boxSizing:"border-box",fontFamily:"inherit",transition:"background 0.2s, border-color 0.2s"}}/>
                  {err && <p style={{color:"#ff7b7b",fontSize:12,marginTop:6,marginBottom:0}}>{err}</p>}
                </div>
                <button onClick={handleLogin} style={{width:"100%",padding:"15px",borderRadius:10,border:"none",background:`linear-gradient(135deg,${G.teal},${G.tealDark})`,color:"white",fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"inherit",boxShadow:"0 4px 24px rgba(26,187,166,0.25)",transition:"transform 0.15s, box-shadow 0.15s"}}
                  onMouseEnter={e => {e.currentTarget.style.transform="translateY(-1px)";e.currentTarget.style.boxShadow="0 6px 30px rgba(26,187,166,0.35)";}}
                  onMouseLeave={e => {e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="0 4px 24px rgba(26,187,166,0.25)";}}>Get Started</button>
              </div>
            </div>
            <div className={loginPhase>=2?"login-anim login-d6":"login-anim"} style={{opacity:0,transform:"translateY(20px)"}}>
              <p style={{marginTop:20,fontSize:12,color:"rgba(255,255,255,0.35)",fontWeight:500}}>Need access? Contact your Gillis representative.</p>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes loginLogoIn{0%{opacity:0;transform:scale(0.85)}100%{opacity:1;transform:scale(1)}}
          @keyframes loginFadeUp{0%{opacity:0;transform:translateY(20px)}100%{opacity:1;transform:translateY(0)}}
          .login-anim{opacity:0;transform:translateY(20px)}
          .login-d1{animation:loginFadeUp 0.55s cubic-bezier(0.16,1,0.3,1) 0.3s forwards}
          .login-d2{animation:loginFadeUp 0.55s cubic-bezier(0.16,1,0.3,1) 0.4s forwards}
          .login-d3{animation:loginFadeUp 0.55s cubic-bezier(0.16,1,0.3,1) 0.5s forwards}
          .login-d6{animation:loginFadeUp 0.55s cubic-bezier(0.16,1,0.3,1) 0.85s forwards}
          .login-anim input:focus{background:rgba(255,255,255,0.14)!important;border-color:rgba(26,187,166,0.5)!important}
        `}</style>
      </div>
    );
  }

  // ---- ROLE SELECTION ----
  if (screen === "role-select") {
    return (
      <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:`linear-gradient(160deg,#1a1035 0%,${G.purpleDark} 40%,${G.purple} 70%,#1a1035 100%)`,padding:20}}>
        <div style={{width:"100%",maxWidth:520}}>
          <div style={{textAlign:"center",marginBottom:32}}>
            <div style={{display:"inline-flex",alignItems:"center",gap:12,marginBottom:16}}>
              <GillisLogo size={34}/><span style={{fontSize:22,fontWeight:700,color:"white"}}>AskGillis</span>
            </div>
            <p style={{color:"rgba(255,255,255,0.7)",fontSize:16,fontWeight:500,margin:"0 0 4px"}}>Welcome, {userName}.</p>
            <p style={{color:"rgba(255,255,255,0.4)",fontSize:14,margin:0}}>How will you be using AskGillis?</p>
          </div>
          <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr",gap:16}}>
            <button onClick={() => selectRole("seller")} style={{padding:"32px 24px",borderRadius:14,border:"1px solid rgba(255,255,255,0.1)",background:"rgba(255,255,255,0.04)",cursor:"pointer",fontFamily:"inherit",textAlign:"center",transition:"all 0.2s"}}
              onMouseEnter={e => {e.currentTarget.style.borderColor=G.teal;e.currentTarget.style.background="rgba(26,187,166,0.08)";}}
              onMouseLeave={e => {e.currentTarget.style.borderColor="rgba(255,255,255,0.1)";e.currentTarget.style.background="rgba(255,255,255,0.04)";}}>
              <div style={{fontSize:28,marginBottom:12}}>&#127919;</div>
              <div style={{fontSize:16,fontWeight:600,color:"white",marginBottom:6}}>I'm a Seller</div>
              <div style={{fontSize:12,color:"rgba(255,255,255,0.4)",lineHeight:1.5}}>Coaching, drills, and outreach support.</div>
            </button>
            <button onClick={() => selectRole("manager")} style={{padding:"32px 24px",borderRadius:14,border:"1px solid rgba(255,255,255,0.1)",background:"rgba(255,255,255,0.04)",cursor:"pointer",fontFamily:"inherit",textAlign:"center",transition:"all 0.2s"}}
              onMouseEnter={e => {e.currentTarget.style.borderColor="#8B5CF6";e.currentTarget.style.background="rgba(139,92,246,0.08)";}}
              onMouseLeave={e => {e.currentTarget.style.borderColor="rgba(255,255,255,0.1)";e.currentTarget.style.background="rgba(255,255,255,0.04)";}}>
              <div style={{fontSize:28,marginBottom:12}}>&#128202;</div>
              <div style={{fontSize:16,fontWeight:600,color:"white",marginBottom:6}}>I'm a Manager / Leader</div>
              <div style={{fontSize:12,color:"rgba(255,255,255,0.4)",lineHeight:1.5}}>Team insights, patterns, and coaching tools.</div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---- PLATFORM ----
  const mod = MODULES.find(m => m.id === activeModule) || {id:"help",label:"Help & FAQ",icon:"M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01",color:G.muted};
  const sB = "rgba(255,255,255,0.08)";
  const sT = "rgba(255,255,255,0.55)";

  return (
    <div style={{display:"flex",height:"100dvh",color:G.dark,background:G.bg,position:"relative",overflow:"hidden"}}>
      {/* SIDEBAR BACKDROP (mobile/tablet) */}
      {isCompact && sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",zIndex:90}}/>}
      {/* SIDEBAR */}
      <div style={{width:220,background:G.purple,display:"flex",flexDirection:"column",flexShrink:0,...(isCompact?{position:"fixed",left:sidebarOpen?0:-240,top:0,bottom:0,zIndex:95,transition:"left 0.25s ease",boxShadow:sidebarOpen?"4px 0 20px rgba(0,0,0,0.3)":"none"}:{})}}>
        <div style={{padding:"18px 20px",borderBottom:`0.5px solid ${sB}`,display:"flex",alignItems:"center",gap:10}}>
          <GillisLogo size={28}/>
          <div><div style={{fontSize:15,fontWeight:600,color:"#E5E5E5"}}>AskGillis</div><div style={{fontSize:9,fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase",color:G.teal}}>{mode === "manager" ? "Manager Dashboard" : "Sales Platform"}</div></div>
        </div>

        {/* KB indicator (hidden, functionality preserved) */}

        {mode === "seller" ? <>
          <div style={{flex:1,padding:"14px 10px",overflowY:"auto"}}>
            <div style={{fontSize:9,fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase",color:"rgba(255,255,255,0.2)",padding:"0 12px",marginBottom:8}}>Training</div>
            {MODULES.filter(m => m.id !== "hub").map(m => {
              const a = activeModule === m.id;
              return <button key={m.id} onClick={() => {setActiveModule(m.id);if(isCompact)setSidebarOpen(false);}} style={{width:"100%",padding:"10px 14px",borderRadius:8,border:"none",textAlign:"left",cursor:"pointer",fontFamily:"inherit",background:a?"rgba(26,187,166,0.1)":"transparent",color:a?G.teal:sT,fontSize:12.5,fontWeight:a?600:400,marginBottom:2,display:"flex",alignItems:"center",gap:10}}>
                <NavIcon path={m.icon} color={a?G.teal:sT} size={16}/>{m.label}
              </button>;
            })}
            <div style={{borderTop:`0.5px solid ${sB}`,margin:"10px 12px 8px",paddingTop:10}}>
              <div style={{fontSize:9,fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase",color:"rgba(255,255,255,0.2)",marginBottom:8}}>Resources</div>
              {(() => { const m = MODULES.find(x => x.id === "hub"); const a = activeModule === "hub"; return m ? <button onClick={() => {setActiveModule("hub");if(isCompact)setSidebarOpen(false);}} style={{width:"100%",padding:"10px 14px",borderRadius:8,border:"none",textAlign:"left",cursor:"pointer",fontFamily:"inherit",background:a?"rgba(255,255,255,0.06)":"transparent",color:a?"rgba(255,255,255,0.7)":sT,fontSize:12.5,fontWeight:a?600:400,marginBottom:2,display:"flex",alignItems:"center",gap:10}}>
                <NavIcon path={m.icon} color={a?"rgba(255,255,255,0.7)":sT} size={16}/>{m.label}
              </button> : null; })()}
            </div>
            {sessions.length > 0 && <>
              <div style={{fontSize:9,fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase",color:"rgba(255,255,255,0.2)",padding:"12px 12px 0",marginTop:8,marginBottom:8,borderTop:`0.5px solid ${sB}`}}>Recent</div>
              {sessions.slice(0,5).map((s,i) => {
                const sm = MODULES.find(x => x.id === s.module);
                const ago = Math.floor((Date.now() - new Date(s.date)) / 36e5);
                const t = ago < 1 ? "Just now" : ago < 24 ? `${ago}h ago` : `${Math.floor(ago/24)}d ago`;
                return (
                  <button key={i} onClick={() => {setActiveModule(s.module);setMessages(s.messages||[]);convRef.current=(s.messages||[]).filter((_,j)=>j>0).map(m=>({role:m.isTammy?"assistant":"user",content:m.text}));setChatOpen(true);}}
                    style={{width:"100%",padding:"8px 12px",borderRadius:7,border:"none",textAlign:"left",cursor:"pointer",fontFamily:"inherit",background:"transparent",marginBottom:1}}>
                    <div style={{fontSize:11,color:sT,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{s.summary}</div>
                    <div style={{fontSize:9,color:"rgba(255,255,255,0.25)",marginTop:2,display:"flex",gap:6}}>
                      <span style={{color:sm?.color||G.teal}}>{s.moduleLabel}</span><span>{t}</span>
                    </div>
                  </button>
                );
              })}
            </>}
          </div>
          <div style={{padding:"10px 10px"}}>
            <button onClick={() => {if(messages.length>=2)saveSession();setChatOpen(p=>!p);}} style={{width:"100%",padding:"10px 14px",borderRadius:8,border:`0.5px solid ${chatOpen?"rgba(26,187,166,0.3)":sB}`,background:chatOpen?"rgba(26,187,166,0.08)":"transparent",color:chatOpen?G.teal:sT,fontSize:12,fontWeight:500,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:8,justifyContent:"center"}}>
              <TammyAvatar size={18}/>{chatOpen ? "Close Tammy" : "Talk to Tammy"}
            </button>
          </div>
        </> : <>
          <div style={{flex:1,padding:"14px 10px",overflowY:"auto"}}>
            <div style={{fontSize:9,fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase",color:"rgba(255,255,255,0.2)",padding:"0 12px",marginBottom:8}}>Dashboard</div>
            {[{id:"team",label:"Team Overview"},{id:"patterns",label:"Patterns & Topics"},{id:"kb",label:"Knowledge Base"}].map(n => {
              const a = mgrView === n.id && !selectedUser && activeModule !== "help";
              return <button key={n.id} onClick={() => {setMgrView(n.id);setSelectedUser(null);setActiveModule("__mgr");if(isCompact)setSidebarOpen(false);}} style={{width:"100%",padding:"10px 14px",borderRadius:8,border:"none",textAlign:"left",cursor:"pointer",fontFamily:"inherit",background:a?"rgba(26,187,166,0.1)":"transparent",color:a?G.teal:sT,fontSize:12.5,fontWeight:a?600:400,marginBottom:2}}>{n.label}</button>;
            })}
          </div>
          <div style={{padding:"10px 10px"}}>
            <button onClick={() => setChatOpen(p=>!p)} style={{width:"100%",padding:"10px 14px",borderRadius:8,border:`0.5px solid ${chatOpen?"rgba(26,187,166,0.3)":sB}`,background:chatOpen?"rgba(26,187,166,0.08)":"transparent",color:chatOpen?G.teal:sT,fontSize:12,fontWeight:500,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:8,justifyContent:"center"}}>
              <TammyAvatar size={18}/>{chatOpen ? "Close Tammy" : "Talk to Tammy"}
            </button>
          </div>
        </>}

        <div style={{padding:"6px 10px 0"}}>
          <button onClick={() => {setActiveModule("help");if(isCompact)setSidebarOpen(false);}} style={{width:"100%",padding:"7px 14px",borderRadius:7,border:"none",background:activeModule==="help"?"rgba(255,255,255,0.06)":"transparent",cursor:"pointer",fontFamily:"inherit",color:activeModule==="help"?"rgba(255,255,255,0.7)":sT,fontSize:11.5,fontWeight:400,display:"flex",alignItems:"center",gap:8,textAlign:"left"}}
            onMouseEnter={e => e.currentTarget.style.color="rgba(255,255,255,0.7)"}
            onMouseLeave={e => e.currentTarget.style.color=activeModule==="help"?"rgba(255,255,255,0.7)":sT}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01"/></svg>
            Help & FAQ
          </button>
        </div>
        <div style={{padding:"4px 10px"}}>
          <button onClick={() => {if(mode==="seller"){setMode("manager");setMgrView("team");setSelectedUser(null);setActiveModule("__mgr");setChatOpen(false);}else{setMode("seller");setActiveModule("onboarding");setChatOpen(true);}}}
            style={{width:"100%",padding:"6px 14px",borderRadius:7,border:"none",background:"transparent",cursor:"pointer",fontFamily:"inherit",color:"rgba(255,255,255,0.25)",fontSize:10.5,textAlign:"left"}}
            onMouseEnter={e => e.currentTarget.style.color="rgba(255,255,255,0.5)"}
            onMouseLeave={e => e.currentTarget.style.color="rgba(255,255,255,0.25)"}>
            {mode === "seller" ? (userRole === "manager" ? "Switch to Manager" : "") : "Switch to Seller Mode"}
          </button>
        </div>
        <div style={{padding:"6px 20px 14px",borderTop:`0.5px solid ${sB}`}}>
          <div style={{fontSize:11,color:"rgba(255,255,255,0.3)"}}>{userName}</div>
        </div>
      </div>

      {/* CENTER CONTENT */}
      <div style={{flex:1,display:"flex",flexDirection:"column",minWidth:0}}>
        <div style={{padding:isMobile?"10px 14px":"12px 28px",borderBottom:`1px solid ${G.border}`,background:G.white,display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            {isCompact && <button onClick={() => setSidebarOpen(true)} style={{background:"none",border:"none",cursor:"pointer",padding:4,display:"flex",alignItems:"center",color:G.dark}}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
            </button>}
            {!isCompact && (mode === "seller" || activeModule === "help") && <NavIcon path={mod.icon} color={mod.color} size={18}/>}
            <span style={{fontSize:isMobile?14:15,fontWeight:600}}>{activeModule === "help" ? "Help & FAQ" : mode === "manager" ? (selectedUser ? selectedUser : mgrView === "kb" ? "Knowledge Base" : mgrView === "patterns" ? "Patterns & Topics" : "Team Overview") : mod.label}</span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:isMobile?4:8}}>
            <button onClick={() => {setSearchOpen(true);setSearchQuery("");}} title="Search" style={{padding:isMobile?"6px":"6px 10px",borderRadius:8,border:`1px solid ${G.border}`,background:G.white,color:G.muted,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:5}}
              onMouseEnter={e => {e.currentTarget.style.borderColor=G.teal;e.currentTarget.style.color=G.teal;}}
              onMouseLeave={e => {e.currentTarget.style.borderColor=G.border;e.currentTarget.style.color=G.muted;}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
              {!isMobile && <>Search<span style={{fontSize:9,color:G.dim,marginLeft:2}}>&#8984;K</span></>}
            </button>
            <button onClick={() => setFbOpen(true)} title="Send Feedback" style={{padding:"6px 10px",borderRadius:8,border:`1px solid ${G.border}`,background:G.white,color:G.muted,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:5}}
              onMouseEnter={e => {e.currentTarget.style.borderColor=G.teal;e.currentTarget.style.color=G.teal;}}
              onMouseLeave={e => {e.currentTarget.style.borderColor=G.border;e.currentTarget.style.color=G.muted;}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              Feedback
            </button>
            {!chatOpen && !isMobile && <button onClick={() => setChatOpen(true)} style={{padding:"6px 14px",borderRadius:8,border:"none",background:G.teal,color:"white",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:6}}><TammyAvatar size={16}/>Ask Tammy</button>}
          </div>
        </div>

        <div style={{flex:1,overflowY:"auto",padding:(mode==="manager" && activeModule!=="help")?"0":isMobile?"20px 16px":"28px 36px",paddingBottom:isMobile?"80px":"28px"}}>
          {/* Manager views */}
          {mode === "manager" && activeModule !== "help" && !selectedUser && mgrView === "team" && <ManagerDashboard teamData={teamData} userName={userName} onSelectUser={name => setSelectedUser(name)}/>}
          {mode === "manager" && activeModule !== "help" && selectedUser && teamData[selectedUser] && <SellerDetail name={selectedUser} data={teamData[selectedUser]} onBack={() => setSelectedUser(null)}/>}
          {mode === "manager" && activeModule !== "help" && selectedUser && !teamData[selectedUser] && <div style={{padding:"32px 40px"}}><button onClick={() => setSelectedUser(null)} style={{background:"none",border:"none",cursor:"pointer",fontSize:12,color:G.teal,fontFamily:"inherit",padding:0}}>← Back to Team</button><p style={{fontSize:13,color:G.muted,marginTop:16}}>This team member's data is no longer available.</p></div>}
          {mode === "manager" && activeModule !== "help" && !selectedUser && mgrView === "patterns" && <PatternsView teamData={teamData}/>}
          {mode === "manager" && activeModule !== "help" && !selectedUser && mgrView === "kb" && <KBAdmin kbWords={kbWords} hasOverride={hasKBOverride} onUpdate={(text) => {kbRef.current=text;setKbWords(text.split(/\s+/).length);setHasKBOverride(true);}} onReset={() => {kbRef.current=KNOWLEDGE_BASE;setKbWords(KNOWLEDGE_BASE.split(/\s+/).length);setHasKBOverride(false);}}/>}

          {/* Onboarding */}
          {mode === "seller" && activeModule === "onboarding" && (
            <div>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4}}>
                <h2 style={{fontSize:20,fontWeight:600,margin:0}}>Your Onboarding Checklist</h2>
                <span style={{fontSize:13,fontWeight:600,color:G.teal}}>{checked.length}/{ONBOARDING_ITEMS.length}</span>
              </div>
              <p style={{fontSize:13,color:G.muted,margin:"0 0 8px"}}>Work through these at your own pace. Click any teal item to learn it with Tammy.</p>
              <div style={{height:4,background:G.border,borderRadius:2,marginBottom:24,overflow:"hidden"}}><div style={{height:"100%",background:G.teal,borderRadius:2,width:(checked.length/ONBOARDING_ITEMS.length*100)+"%",transition:"width 0.3s"}}/></div>

              <div style={{fontSize:11,fontWeight:600,color:G.teal,letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:10}}>Learn with Tammy</div>
              <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:28}}>
                {ONBOARDING_ITEMS.filter(x => x.tammy).map(item => { const done = checked.includes(item.id); return (
                  <div key={item.id} style={{display:"flex",alignItems:"center",gap:12,background:G.white,border:`1px solid ${done ? G.tealBorder : G.border}`,borderRadius:10,padding:"14px 16px",transition:"all 0.15s"}}>
                    <div onClick={() => toggleCheck(item.id)} style={{width:20,height:20,borderRadius:6,border:`2px solid ${done ? G.teal : G.border}`,background:done ? G.teal : "transparent",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all 0.15s"}}>
                      {done && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>}
                    </div>
                    <div onClick={() => {setChatOpen(true);sendMessage(item.prompt);}} style={{flex:1,cursor:"pointer"}}
                      onMouseEnter={e => e.currentTarget.querySelector('.ob-label').style.color = G.teal}
                      onMouseLeave={e => e.currentTarget.querySelector('.ob-label').style.color = done ? G.dim : G.dark}>
                      <div className="ob-label" style={{fontSize:13,fontWeight:500,color:done ? G.dim : G.dark,textDecoration:done ? "line-through" : "none",transition:"color 0.15s"}}>{item.label}</div>
                      <div style={{fontSize:11,color:G.dim,marginTop:2}}>Suggested: {item.week}</div>
                    </div>
                    <div style={{fontSize:10,fontWeight:600,color:G.teal,background:G.tealLight,padding:"3px 8px",borderRadius:12,flexShrink:0}}>Ask Tammy</div>
                  </div>
                );})}
              </div>

              <div style={{fontSize:11,fontWeight:600,color:G.muted,letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:10}}>Complete on your own</div>
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                {ONBOARDING_ITEMS.filter(x => !x.tammy).map(item => { const done = checked.includes(item.id); return (
                  <div key={item.id} style={{display:"flex",alignItems:"center",gap:12,background:G.white,border:`1px solid ${G.border}`,borderRadius:10,padding:"12px 16px"}}>
                    <div onClick={() => toggleCheck(item.id)} style={{width:20,height:20,borderRadius:6,border:`2px solid ${done ? G.teal : G.border}`,background:done ? G.teal : "transparent",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all 0.15s"}}>
                      {done && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>}
                    </div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:13,fontWeight:500,color:done ? G.dim : G.dark,textDecoration:done ? "line-through" : "none"}}>{item.label}</div>
                      <div style={{fontSize:11,color:G.dim,marginTop:2}}>Suggested: {item.week}</div>
                    </div>
                    <div style={{fontSize:10,color:G.dim,background:G.bg,padding:"3px 8px",borderRadius:12,flexShrink:0}}>{item.note}</div>
                  </div>
                );})}
              </div>
            </div>
          )}

          {/* Weekly Game Plan */}
          {mode === "seller" && activeModule === "gameplan" && (
            <div>
              <h2 style={{fontSize:20,fontWeight:600,margin:"0 0 4px"}}>Weekly Game Plan</h2>
              <p style={{fontSize:13,color:G.text,lineHeight:1.7,margin:"0 0 28px",maxWidth:540}}>Monday morning starts here. Figure out where your energy goes, which accounts deserve your attention, and what you're actually trying to accomplish this week.</p>
              {GAMEPLAN_STARTERS.map((cat, ci) => (
                <div key={ci} style={{marginTop:ci > 0 ? 28 : 0}}>
                  <div style={{fontSize:11,fontWeight:600,color:G.muted,letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:10}}>{cat.category}</div>
                  <div style={{display:"flex",flexDirection:"column",gap:8}}>
                    {cat.items.map((s, si) => {
                      const key = "gp-" + ci + "-" + si;
                      const isExpanded = socialExpanded === key;
                      return (
                        <div key={si} style={{borderRadius:10,border:`1px solid ${isExpanded ? "#8B5CF6" : G.border}`,background:isExpanded ? "#F5F3FF" : G.white,transition:"all 0.15s",overflow:"hidden"}}>
                          <div onClick={() => {
                            if (s.input) { setSocialExpanded(isExpanded ? null : key); setSocialInput(""); }
                            else { setChatOpen(true); sendMessage(s.prompt); }
                          }}
                            style={{padding:"16px 18px",cursor:"pointer",fontFamily:"inherit",textAlign:"left"}}
                            onMouseEnter={e => { if (!isExpanded) { e.currentTarget.parentElement.style.borderColor = "#8B5CF6"; e.currentTarget.parentElement.style.background = "#F5F3FF"; }}}
                            onMouseLeave={e => { if (!isExpanded) { e.currentTarget.parentElement.style.borderColor = G.border; e.currentTarget.parentElement.style.background = G.white; }}}>
                            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                              <div style={{fontSize:13,fontWeight:600,color:G.dark,marginBottom:3}}>{s.label}</div>
                              {s.input && <div style={{fontSize:10,fontWeight:600,color:"#8B5CF6",background:"#EDE9FE",padding:"2px 8px",borderRadius:12,flexShrink:0,marginLeft:12}}>{isExpanded ? "Close" : "Add context"}</div>}
                            </div>
                            <div style={{fontSize:12,color:G.muted,lineHeight:1.5}}>{s.desc}</div>
                          </div>
                          {isExpanded && s.input && (
                            <div style={{padding:"0 18px 16px 18px"}}>
                              <label style={{display:"block",fontSize:11,fontWeight:600,color:G.muted,marginBottom:6,letterSpacing:"0.04em"}}>{s.inputLabel}</label>
                              <textarea value={socialInput} onChange={e => setSocialInput(e.target.value)} placeholder={s.inputPlaceholder} rows={2}
                                style={{width:"100%",boxSizing:"border-box",resize:"none",border:`1px solid ${G.border}`,borderRadius:8,padding:"10px 12px",fontSize:13,fontFamily:"inherit",color:G.dark,lineHeight:1.5,outline:"none",background:G.white}}
                                onFocus={e => e.currentTarget.style.borderColor = "#8B5CF6"}
                                onBlur={e => e.currentTarget.style.borderColor = G.border}
                                autoFocus/>
                              <button onClick={() => {
                                const msg = socialInput.trim() ? s.prompt + "\n\nContext: " + socialInput.trim() : s.prompt;
                                setChatOpen(true); sendMessage(msg); setSocialExpanded(null); setSocialInput("");
                              }} style={{marginTop:10,padding:"8px 18px",borderRadius:8,border:"none",background:"#8B5CF6",color:"white",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Ask Tammy</button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Outreach */}
          {mode === "seller" && activeModule === "outreach" && (
            <div>
              <h2 style={{fontSize:20,fontWeight:600,margin:"0 0 4px"}}>Outreach Prep</h2>
              <p style={{fontSize:13,color:G.muted,margin:"0 0 24px"}}>Fill in what you know. Tammy builds the rest.</p>
              <div style={{background:G.white,border:`1px solid ${G.border}`,borderRadius:12,padding:"24px"}}>
                {[{k:"company",l:"Company / Account",p:"e.g. Johnson Controls"},{k:"segment",l:"Segment",p:"e.g. Corporate, Construction, Sports"},{k:"contact",l:"Contact",p:"e.g. Jane Smith, VP Operations"},{k:"notes",l:"What do you know?",p:"e.g. Crews in area, found in parking lot...",m:true}].map(f => (
                  <div key={f.k} style={{marginBottom:18}}>
                    <label style={{display:"block",fontSize:11,fontWeight:600,color:G.muted,marginBottom:6,letterSpacing:"0.04em",textTransform:"uppercase"}}>{f.l}</label>
                    {f.m ? <textarea value={od[f.k]} onChange={e => setOd(p=>({...p,[f.k]:e.target.value}))} placeholder={f.p} rows={3} style={{width:"100%",padding:"10px 14px",border:`1px solid ${G.border}`,borderRadius:8,fontSize:13,fontFamily:"inherit",outline:"none",color:G.dark,resize:"none",boxSizing:"border-box"}}/>
                    : <input value={od[f.k]} onChange={e => setOd(p=>({...p,[f.k]:e.target.value}))} placeholder={f.p} style={{width:"100%",padding:"10px 14px",border:`1px solid ${G.border}`,borderRadius:8,fontSize:13,fontFamily:"inherit",outline:"none",color:G.dark,boxSizing:"border-box"}}/>}
                  </div>
                ))}
                <button onClick={() => {setChatOpen(true);sendMessage("I've entered my target details. Help me build my approach.");}} disabled={!od.company.trim()} style={{padding:"12px 24px",borderRadius:9,border:"none",background:od.company.trim()?G.teal:G.borderLight,color:od.company.trim()?"white":G.dim,fontSize:13,fontWeight:600,cursor:od.company.trim()?"pointer":"default",fontFamily:"inherit"}}>Build my approach with Tammy</button>
                {!od.company.trim() && <p style={{fontSize:11,color:G.dim,margin:"10px 0 0"}}>Enter at least a company name to get started.</p>}
              </div>
            </div>
          )}

          {/* Situation */}
          {mode === "seller" && activeModule === "situation" && (
            <div>
              <h2 style={{fontSize:20,fontWeight:600,margin:"0 0 4px"}}>What's going on?</h2>
              <p style={{fontSize:13,color:G.text,lineHeight:1.7,margin:"0 0 28px",maxWidth:540}}>Sales is a grind. Some days the calls don't land, the pipeline stalls, or the pressure builds. Pick what's closest to your situation and Tammy will coach you through it.</p>
              {SITUATION_CATEGORIES.map((cat, ci) => (
                <div key={ci} style={{marginTop:ci > 0 ? 28 : 0}}>
                  <div style={{fontSize:11,fontWeight:600,color:G.muted,letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:10}}>{cat.category}</div>
                  <div style={{display:"flex",flexDirection:"column",gap:8}}>
                    {cat.items.map((s, si) => (
                      <button key={si} onClick={() => {setChatOpen(true);sendMessage(s.prompt);}}
                        style={{padding:"16px 18px",borderRadius:10,border:`1px solid ${G.border}`,background:G.white,cursor:"pointer",fontFamily:"inherit",textAlign:"left",transition:"all 0.15s",width:"100%"}}
                        onMouseEnter={e => {e.currentTarget.style.borderColor=G.lilac;e.currentTarget.style.background=G.lilacLight;}}
                        onMouseLeave={e => {e.currentTarget.style.borderColor=G.border;e.currentTarget.style.background=G.white;}}>
                        <div style={{fontSize:13,fontWeight:600,color:G.dark,marginBottom:3}}>{s.label}</div>
                        <div style={{fontSize:12,color:G.muted,lineHeight:1.5}}>{s.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              <div style={{marginTop:28,padding:"18px 20px",borderRadius:10,border:`1px dashed ${G.border}`,background:G.white,textAlign:"center"}}>
                <div style={{fontSize:13,fontWeight:500,color:G.text,marginBottom:8}}>Something else on your mind?</div>
                <button onClick={() => {setChatOpen(true);sendMessage("I have a situation I need help with.");}} style={{padding:"8px 18px",borderRadius:8,border:"none",background:G.lilac,color:"white",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Just tell Tammy</button>
              </div>
            </div>
          )}

          {/* Role Play */}
          {mode === "seller" && activeModule === "roleplay" && (
            <div>
              <h2 style={{fontSize:20,fontWeight:600,margin:"0 0 4px"}}>Set the Scene</h2>
              <p style={{fontSize:13,color:G.muted,margin:"0 0 24px"}}>Tell Tammy who you're calling.</p>
              <div style={{background:G.white,border:`1px solid ${G.border}`,borderRadius:12,padding:"24px"}}>
                {[{k:"who",l:"Who are you calling?",p:"e.g. Travel manager at a manufacturing company"},{k:"segment",l:"Segment",p:"e.g. Corporate, Construction, Sports"},{k:"objective",l:"Your objective",p:"e.g. Get them to agree to a site inspection"}].map(f => (
                  <div key={f.k} style={{marginBottom:18}}>
                    <label style={{display:"block",fontSize:11,fontWeight:600,color:G.muted,marginBottom:6,letterSpacing:"0.04em",textTransform:"uppercase"}}>{f.l}</label>
                    <input value={rp[f.k]} onChange={e => setRp(p=>({...p,[f.k]:e.target.value}))} placeholder={f.p} style={{width:"100%",padding:"10px 14px",border:`1px solid ${G.border}`,borderRadius:8,fontSize:13,fontFamily:"inherit",outline:"none",color:G.dark,boxSizing:"border-box"}}/>
                  </div>
                ))}
                <button onClick={() => {setChatOpen(true);sendMessage(`Ready to role play. Calling ${rp.who}${rp.segment?" in "+rp.segment:""}. Objective: ${rp.objective||"get a meeting"}. Play the prospect.`);}} disabled={!rp.who.trim()} style={{padding:"12px 24px",borderRadius:9,border:"none",background:rp.who.trim()?G.orange:G.borderLight,color:rp.who.trim()?"white":G.dim,fontSize:13,fontWeight:600,cursor:rp.who.trim()?"pointer":"default",fontFamily:"inherit"}}>Start Role Play</button>
                {!rp.who.trim() && <p style={{fontSize:11,color:G.dim,margin:"10px 0 0"}}>Tell Tammy who you're calling to get started.</p>}
              </div>
            </div>
          )}

          {/* Sharpener */}
          {mode === "seller" && activeModule === "sharpener" && (
            <div>
              <h2 style={{fontSize:20,fontWeight:600,margin:"0 0 4px"}}>Daily Sharpener</h2>
              <p style={{fontSize:13,color:G.text,lineHeight:1.7,margin:"0 0 24px",maxWidth:540}}>Pick a drill. Give it your best shot. Tammy gives you feedback. Five minutes, real reps, real improvement.</p>

              <button onClick={() => {
                const cat = SHARPENER_CATEGORIES[Math.floor(Math.random() * SHARPENER_CATEGORIES.length)];
                const pick = cat.items[Math.floor(Math.random() * cat.items.length)];
                setChatOpen(true); sendMessage("Here's my drill (" + cat.category + "):\n\n" + pick.scenario + "\n\nLet me give it a shot.");
              }}
                style={{width:"100%",padding:"16px 18px",borderRadius:10,border:`1.5px solid ${G.goldBorder}`,background:`linear-gradient(135deg,${G.goldLight},${G.white})`,cursor:"pointer",fontFamily:"inherit",textAlign:"left",transition:"all 0.15s",marginBottom:28}}
                onMouseEnter={e => {e.currentTarget.style.borderColor=G.gold;e.currentTarget.style.background=G.goldLight;}}
                onMouseLeave={e => {e.currentTarget.style.borderColor=G.goldBorder;e.currentTarget.style.background=`linear-gradient(135deg,${G.goldLight},${G.white})`;}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <span style={{fontSize:18}}>&#9889;</span>
                  <div>
                    <div style={{fontSize:14,fontWeight:700,color:G.dark}}>Surprise me</div>
                    <div style={{fontSize:12,color:G.muted}}>Random drill from any category. Tammy picks.</div>
                  </div>
                </div>
              </button>

              {SHARPENER_CATEGORIES.map((cat, ci) => (
                <div key={ci} style={{marginTop:ci > 0 ? 28 : 0}}>
                  <div style={{fontSize:11,fontWeight:600,color:G.muted,letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:2}}>{cat.category}</div>
                  <div style={{fontSize:12,color:G.dim,marginBottom:10}}>{cat.desc}</div>
                  <div style={{display:"flex",flexDirection:"column",gap:6}}>
                    {cat.items.map((item, si) => (
                      <button key={si} onClick={() => {
                        setChatOpen(true); sendMessage("Here's my drill:\n\n" + item.scenario + "\n\nLet me give it a shot.");
                      }}
                        style={{padding:"12px 16px",borderRadius:8,border:`1px solid ${G.border}`,borderLeft:`3px solid ${cat.color}`,background:G.white,cursor:"pointer",fontFamily:"inherit",textAlign:"left",transition:"all 0.15s",width:"100%"}}
                        onMouseEnter={e => {e.currentTarget.style.borderColor=cat.color;e.currentTarget.style.background=cat.color+"0D";}}
                        onMouseLeave={e => {e.currentTarget.style.borderColor=G.border;e.currentTarget.style.borderLeftColor=cat.color;e.currentTarget.style.background=G.white;}}>
                        <div style={{fontSize:13,fontWeight:600,color:G.dark}}>{item.label}</div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* LinkedIn & Social */}
          {mode === "seller" && activeModule === "social" && (
            <div>
              <h2 style={{fontSize:20,fontWeight:600,margin:"0 0 4px"}}>LinkedIn & Social</h2>
              <p style={{fontSize:13,color:G.text,lineHeight:1.7,margin:"0 0 28px",maxWidth:540}}>Most hotel sellers either ignore LinkedIn or use it like a billboard. This is where you learn to use it like a salesperson. Pick what you need and Tammy will help you craft something that sounds like you, not a bot.</p>
              {SOCIAL_ITEMS.map((cat, ci) => (
                <div key={ci} style={{marginTop:ci > 0 ? 28 : 0}}>
                  <div style={{fontSize:11,fontWeight:600,color:G.muted,letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:10}}>{cat.category}</div>
                  <div style={{display:"flex",flexDirection:"column",gap:8}}>
                    {cat.items.map((s, si) => {
                      const key = ci + "-" + si;
                      const isExpanded = socialExpanded === key;
                      return (
                        <div key={si} style={{borderRadius:10,border:`1px solid ${isExpanded ? "#3B82F6" : G.border}`,background:isExpanded ? "#EFF6FF" : G.white,transition:"all 0.15s",overflow:"hidden"}}>
                          <div onClick={() => {
                            if (s.input) { setSocialExpanded(isExpanded ? null : key); setSocialInput(""); }
                            else { setChatOpen(true); sendMessage(s.prompt); }
                          }}
                            style={{padding:"16px 18px",cursor:"pointer",fontFamily:"inherit",textAlign:"left"}}
                            onMouseEnter={e => { if (!isExpanded) { e.currentTarget.parentElement.style.borderColor = "#3B82F6"; e.currentTarget.parentElement.style.background = "#EFF6FF"; }}}
                            onMouseLeave={e => { if (!isExpanded) { e.currentTarget.parentElement.style.borderColor = G.border; e.currentTarget.parentElement.style.background = G.white; }}}>
                            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                              <div style={{fontSize:13,fontWeight:600,color:G.dark,marginBottom:3}}>{s.label}</div>
                              {s.input && <div style={{fontSize:10,fontWeight:600,color:"#3B82F6",background:"#DBEAFE",padding:"2px 8px",borderRadius:12,flexShrink:0,marginLeft:12}}>{isExpanded ? "Close" : "Add context"}</div>}
                            </div>
                            <div style={{fontSize:12,color:G.muted,lineHeight:1.5}}>{s.desc}</div>
                          </div>
                          {isExpanded && s.input && (
                            <div style={{padding:"0 18px 16px 18px"}}>
                              <label style={{display:"block",fontSize:11,fontWeight:600,color:G.muted,marginBottom:6,letterSpacing:"0.04em"}}>{s.inputLabel}</label>
                              <textarea value={socialInput} onChange={e => setSocialInput(e.target.value)} placeholder={s.inputPlaceholder} rows={2}
                                style={{width:"100%",boxSizing:"border-box",resize:"none",border:`1px solid ${G.border}`,borderRadius:8,padding:"10px 12px",fontSize:13,fontFamily:"inherit",color:G.dark,lineHeight:1.5,outline:"none",background:G.white}}
                                onFocus={e => e.currentTarget.style.borderColor = "#3B82F6"}
                                onBlur={e => e.currentTarget.style.borderColor = G.border}
                                autoFocus/>
                              <button onClick={() => {
                                const msg = socialInput.trim() ? s.prompt + "\n\nContext: " + socialInput.trim() : s.prompt;
                                setChatOpen(true); sendMessage(msg); setSocialExpanded(null); setSocialInput("");
                              }} style={{marginTop:10,padding:"8px 18px",borderRadius:8,border:"none",background:"#3B82F6",color:"white",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Ask Tammy</button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Methodology */}
          {mode === "seller" && activeModule === "methodology" && (
            <div>
              <h2 style={{fontSize:20,fontWeight:600,margin:"0 0 4px"}}>Gillis Methodology</h2>
              <p style={{fontSize:13,color:G.muted,margin:"0 0 24px"}}>Click any to explore with Tammy.</p>
              <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr",gap:12}}>
                {METHODOLOGY_ITEMS.map((m,i) => (
                  <button key={i} onClick={() => {setChatOpen(true);sendMessage(`Explain ${m.title} with a real hotel sales example.`);}}
                    style={{padding:"20px 18px",borderRadius:10,border:`1px solid ${G.border}`,background:G.white,cursor:"pointer",fontFamily:"inherit",textAlign:"left",transition:"all 0.15s"}}
                    onMouseEnter={e => e.currentTarget.style.borderColor=m.color}
                    onMouseLeave={e => e.currentTarget.style.borderColor=G.border}>
                    <div style={{width:6,height:6,borderRadius:"50%",background:m.color,marginBottom:10}}/>
                    <div style={{fontSize:13,fontWeight:600,color:G.dark,marginBottom:4}}>{m.title}</div>
                    <div style={{fontSize:12,color:G.muted,lineHeight:1.5}}>{m.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Gillis Hub */}
          {mode === "seller" && activeModule === "hub" && (
            <div>
              <h2 style={{fontSize:20,fontWeight:600,margin:"0 0 4px"}}>Gillis Hub</h2>
              <p style={{fontSize:13,color:G.text,lineHeight:1.7,margin:"0 0 20px",maxWidth:540}}>Your go-to for anything Gillis. Systems, policies, contacts, forms, and answers.</p>
              <div style={{display:"flex",gap:8,marginBottom:28}}>
                <input value={socialInput} onChange={e => setSocialInput(e.target.value)} placeholder="Search for anything..." onKeyDown={e => {if(e.key==="Enter"&&socialInput.trim()){setChatOpen(true);sendMessage(socialInput.trim());setSocialInput("");}}}
                  style={{flex:1,padding:"11px 16px",border:`1px solid ${G.border}`,borderRadius:10,fontSize:13,fontFamily:"inherit",color:G.dark,outline:"none",background:G.white}}
                  onFocus={e => e.currentTarget.style.borderColor="#6B7280"}
                  onBlur={e => e.currentTarget.style.borderColor=G.border}/>
                <button onClick={() => {if(socialInput.trim()){setChatOpen(true);sendMessage(socialInput.trim());setSocialInput("");}}} disabled={!socialInput.trim()}
                  style={{padding:"11px 20px",borderRadius:10,border:"none",background:socialInput.trim()?"#6B7280":G.borderLight,color:socialInput.trim()?"white":G.dim,fontSize:13,fontWeight:600,cursor:socialInput.trim()?"pointer":"default",fontFamily:"inherit"}}>Ask</button>
              </div>
              {HUB_CATEGORIES.map((cat, ci) => (
                <div key={ci} style={{marginTop:ci > 0 ? 24 : 0}}>
                  <div style={{fontSize:11,fontWeight:600,color:G.muted,letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:8}}>{cat.category}</div>
                  <div style={{display:"flex",flexDirection:"column",gap:6}}>
                    {cat.items.map((item, si) => {
                      const borderColor = item.type === "link" ? "#3B82F6" : item.type === "document" ? G.teal : G.lilac;
                      const isPlaceholder = item.placeholder;
                      const isDocHosted = item.type === "document";
                      return (
                        <div key={si}
                          onClick={() => {
                            if (isPlaceholder) return;
                            if (item.type === "link") { window.open(item.url, "_blank"); }
                            else if (item.type === "document" && isDocHosted) { window.open("/docs/" + item.filename, "_blank"); }
                            else if (item.type === "document") { setChatOpen(true); sendMessage("Tell me about the " + item.label + ". What's in it and what do I need to know?"); }
                            else { setChatOpen(true); sendMessage(item.prompt); }
                          }}
                          style={{display:"flex",alignItems:"center",gap:14,padding:"12px 16px",borderRadius:8,border:`1px solid ${G.border}`,borderLeft:`3px solid ${isPlaceholder ? G.dim : borderColor}`,background:G.white,cursor:isPlaceholder?"default":"pointer",opacity:isPlaceholder?0.5:1,transition:"all 0.15s"}}
                          onMouseEnter={e => {if(!isPlaceholder){e.currentTarget.style.borderColor=borderColor;e.currentTarget.style.background=borderColor+"0A";}}}
                          onMouseLeave={e => {if(!isPlaceholder){e.currentTarget.style.borderColor=G.border;e.currentTarget.style.borderLeftColor=isPlaceholder?G.dim:borderColor;e.currentTarget.style.background=G.white;}}}>
                          <div style={{flex:1}}>
                            <div style={{fontSize:13,fontWeight:600,color:isPlaceholder?G.dim:G.dark}}>{item.label}</div>
                            {item.desc && <div style={{fontSize:11.5,color:G.muted,marginTop:1}}>{item.desc}</div>}
                          </div>
                          <div style={{flexShrink:0}}>
                            {isPlaceholder ? (
                              <span style={{fontSize:9,fontWeight:600,color:G.dim,background:G.bg,padding:"3px 8px",borderRadius:10}}>Coming soon</span>
                            ) : item.type === "link" ? (
                              <span style={{fontSize:9,fontWeight:600,color:"#3B82F6",background:"#EFF6FF",padding:"3px 8px",borderRadius:10}}>Open &#8599;</span>
                            ) : item.type === "document" && isDocHosted ? (
                              <span style={{fontSize:9,fontWeight:600,color:G.teal,background:G.tealLight,padding:"3px 8px",borderRadius:10}}>Download</span>
                            ) : item.type === "document" ? (
                              <span style={{fontSize:9,fontWeight:600,color:G.lilac,background:G.lilacLight,padding:"3px 8px",borderRadius:10}}>Ask Tammy</span>
                            ) : (
                              <span style={{fontSize:9,fontWeight:600,color:G.lilac,background:G.lilacLight,padding:"3px 8px",borderRadius:10}}>Ask Tammy</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Help & FAQ */}
          {activeModule === "help" && (
            <div style={{maxWidth:620}}>
              <h2 style={{fontSize:20,fontWeight:600,margin:"0 0 4px"}}>Help & FAQ</h2>
              <p style={{fontSize:13,color:G.muted,margin:"0 0 32px"}}>Everything you need to know about using AskGillis.</p>

              <div style={{marginBottom:36}}>
                <div style={{fontSize:15,fontWeight:600,color:G.dark,marginBottom:10}}>What is AskGillis?</div>
                <p style={{fontSize:13,color:G.text,lineHeight:1.8,margin:0}}>AskGillis is your AI-powered sales coach, built on 28 years of Gillis hospitality sales methodology. Tammy is available 24/7 to help you prepare for calls, handle objections, practice scenarios, plan your week, and sharpen your skills.</p>
                <p style={{fontSize:13,color:G.text,lineHeight:1.8,margin:"10px 0 0"}}>She's not a generic chatbot. She knows hotel sales inside and out: the terminology, the segments, the grind of prospecting, and the Gillis way of doing things. Think of her as a senior colleague who's always available and never too busy to help.</p>
              </div>

              <div style={{marginBottom:36}}>
                <div style={{fontSize:15,fontWeight:600,color:G.dark,marginBottom:16}}>How to get the best answers from Tammy</div>
                <div style={{display:"flex",flexDirection:"column",gap:0}}>
                  {HELP_TIPS.map((tip, i) => (
                    <div key={i} style={{padding:"14px 0",borderBottom:i < HELP_TIPS.length - 1 ? `1px solid ${G.borderLight}` : "none"}}>
                      <div style={{fontSize:13,fontWeight:600,color:G.dark,marginBottom:4}}>{tip.title}</div>
                      <div style={{fontSize:13,color:G.text,lineHeight:1.7}}>{tip.body}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{marginBottom:36}}>
                <div style={{fontSize:15,fontWeight:600,color:G.dark,marginBottom:14}}>Module Guide</div>
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {HELP_MODULE_GUIDE.map((m, i) => (
                    <div key={i} style={{display:"flex",gap:12,alignItems:"flex-start",padding:"10px 14px",background:G.white,border:`1px solid ${G.border}`,borderRadius:8}}>
                      <div style={{width:4,height:4,borderRadius:"50%",background:m.color,marginTop:7,flexShrink:0}}/>
                      <div>
                        <span style={{fontSize:13,fontWeight:600,color:G.dark}}>{m.name}</span>
                        <span style={{fontSize:13,color:G.muted,marginLeft:8}}>{m.when}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{marginBottom:20}}>
                <div style={{fontSize:15,fontWeight:600,color:G.dark,marginBottom:14}}>FAQ</div>
                <div style={{display:"flex",flexDirection:"column",gap:4}}>
                  {HELP_FAQS.map((faq, i) => {
                    const open = faqOpen === i;
                    return (
                      <div key={i} style={{background:G.white,border:`1px solid ${G.border}`,borderRadius:8,overflow:"hidden"}}>
                        <button onClick={() => setFaqOpen(open ? null : i)} style={{width:"100%",padding:"12px 16px",border:"none",background:"transparent",cursor:"pointer",fontFamily:"inherit",textAlign:"left",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                          <span style={{fontSize:13,fontWeight:600,color:G.dark}}>{faq.q}</span>
                          <span style={{fontSize:16,color:G.dim,flexShrink:0,marginLeft:12,transform:open?"rotate(180deg)":"rotate(0)",transition:"transform 0.2s"}}>&#9662;</span>
                        </button>
                        {open && (
                          <div style={{padding:"0 16px 14px",fontSize:13,color:G.text,lineHeight:1.7}}>{faq.a}</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* TAMMY CHAT PANEL */}
      {chatOpen && (
        <div style={{...(isCompact?{position:"fixed",top:0,right:0,bottom:0,width:isMobile?"100%":420,zIndex:85,boxShadow:"-4px 0 20px rgba(0,0,0,0.15)"}:{width:420,flexShrink:0}),borderLeft:isCompact?"none":`1px solid ${G.border}`,background:G.white,display:"flex",flexDirection:"column"}}>
          <div style={{padding:"12px 16px",borderBottom:`1px solid ${G.border}`,display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
            <TammyAvatar size={30}/>
            <div style={{flex:1}}>
              <div style={{fontSize:13,fontWeight:600}}>Tammy</div>
              <div style={{fontSize:9,fontWeight:600,letterSpacing:"0.06em",textTransform:"uppercase",color:mode==="manager"?"#8B5CF6":mod.color}}>{mode==="manager"?"Coaching the Coach":("Coaching: "+mod.label)}</div>
            </div>
            {messages.length > 0 && <button onClick={() => {if(messages.length>=2)saveSession();setMessages([]);convRef.current=[];sessionStartRef.current=null;}} title="New conversation" style={{background:"none",border:"none",cursor:"pointer",color:G.muted,padding:4,display:"flex",alignItems:"center"}}
              onMouseEnter={e => e.currentTarget.style.color=G.teal}
              onMouseLeave={e => e.currentTarget.style.color=G.muted}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
            </button>}
            <button onClick={() => setFbOpen(true)} title="Send Feedback" style={{background:"none",border:"none",cursor:"pointer",color:G.muted,padding:4,display:"flex",alignItems:"center"}}
              onMouseEnter={e => e.currentTarget.style.color=G.teal}
              onMouseLeave={e => e.currentTarget.style.color=G.muted}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            </button>
            <button onClick={() => {if(messages.length>=2)saveSession();setChatOpen(false);}} style={{background:"none",border:"none",cursor:"pointer",fontSize:16,color:G.muted,padding:4}}>x</button>
          </div>

          <div ref={scrollRef} style={{flex:1,overflowY:"auto",padding:"14px 12px",display:"flex",flexDirection:"column",gap:10}}>
            {!messages.length && (
              <div style={{padding:"20px 10px",textAlign:"center"}}>
                <TammyAvatar size={40}/>
                <div style={{fontSize:13,fontWeight:600,marginTop:10,marginBottom:4}}>I'm right here</div>
                <div style={{fontSize:12,color:G.muted,lineHeight:1.6,marginBottom:14}}>I can see what you're working on. Ask me anything.</div>
                <div style={{display:"flex",flexDirection:"column",gap:5}}>
                  {(mode==="manager"?["One of my sellers is struggling with objections","How do I coach a rep who's not hitting numbers?","What should I look for in my one-on-ones this week?"]
                    :activeModule==="onboarding"?["What should I focus on first?","Explain the Gillis approach","What does a typical day look like?"]
                    :activeModule==="gameplan"?["Plan my week","Which accounts should I focus on?","What worked last week?"]
                    :activeModule==="outreach"?["Help me write an opening statement","What qualifying questions should I ask?","Draft an outreach email"]
                    :activeModule==="situation"?["I keep hitting the same objection","My pipeline is drying up","I had a rough call"]
                    :activeModule==="roleplay"?["Let's practice a cold call","Throw me a tough objection","Practice a follow-up"]
                    :activeModule==="sharpener"?["Surprise me with a drill","Practice opening statements","Work on objection handling"]
                    :activeModule==="social"?["Fix my LinkedIn headline","Write a connection request","Help me write a post"]
                    :activeModule==="hub"?["Where do I submit expenses?","Tell me about the incentive plan","Who do I contact for help?"]
                    :activeModule==="help"?["How do I get started?","What module should I use?","Give me a quick tip"]
                    :["Explain the 4A model","When should I hunt vs farm?","What makes a good opening statement?"]
                  ).map((q,i) => (
                    <button key={i} onClick={() => sendMessage(q)} style={{padding:"7px 11px",borderRadius:7,border:`1px solid ${G.border}`,background:G.white,color:G.text,fontSize:11.5,textAlign:"left",cursor:"pointer",fontFamily:"inherit"}}
                      onMouseEnter={e => e.currentTarget.style.borderColor = G.teal}
                      onMouseLeave={e => e.currentTarget.style.borderColor = G.border}>{q}</button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m,i) => m.isTammy ? (
              <div key={i} style={{display:"flex",gap:8,alignItems:"flex-start",position:"relative"}} className="tammy-msg">
                <TammyAvatar size={24}/>
                <div style={{flex:1,padding:"10px 13px",background:G.bg,border:`1px solid ${G.border}`,borderRadius:"2px 12px 12px 12px",fontSize:12.5,color:G.text,lineHeight:1.7,whiteSpace:"pre-wrap"}}>{m.text}</div>
                {m.text && <button onClick={() => {try{navigator.clipboard.writeText(m.text);const btn=document.querySelector(`[data-copy="${i}"]`);if(btn){btn.textContent="Copied!";setTimeout(()=>btn.textContent="Copy",1500);}}catch{}}} data-copy={i}
                  style={{position:"absolute",top:2,right:2,padding:"2px 6px",borderRadius:4,border:"none",background:G.borderLight,color:G.dim,fontSize:9,cursor:"pointer",fontFamily:"inherit",opacity:0,transition:"opacity 0.15s"}}
                  onMouseEnter={e => e.currentTarget.style.opacity=1}
                >Copy</button>}
              </div>
            ) : (
              <div key={i} style={{display:"flex",justifyContent:"flex-end"}}>
                <div style={{maxWidth:"85%",padding:"10px 13px",background:G.purpleLight,border:`1px solid ${G.purpleBorder}`,borderRadius:"12px 2px 12px 12px",fontSize:12.5,color:G.dark,lineHeight:1.65,whiteSpace:"pre-wrap"}}>{m.text}</div>
              </div>
            ))}

            {loading && (
              <div style={{display:"flex",gap:8,alignItems:"flex-start"}}>
                <TammyAvatar size={24}/>
                <div style={{padding:"10px 13px",background:G.bg,border:`1px solid ${G.border}`,borderRadius:"2px 12px 12px 12px",display:"flex",gap:4}}>
                  {[0,1,2].map(i => <div key={i} style={{width:6,height:6,borderRadius:3,background:G.teal,opacity:0.4,animation:`pulse 1.4s ease ${i*0.2}s infinite`}}/>)}
                </div>
              </div>
            )}
          </div>

          <div style={{padding:"10px 12px",borderTop:`1px solid ${G.border}`,flexShrink:0}}>
            <div style={{display:"flex",gap:8,alignItems:"flex-end",background:G.bg,border:`1px solid ${G.border}`,borderRadius:10,padding:"4px 4px 4px 12px"}}>
              <textarea ref={inputRef} value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => {if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendMessage();}}}
                placeholder="Ask Tammy..." rows={1}
                style={{flex:1,resize:"none",border:"none",background:"transparent",color:G.dark,fontSize:12.5,fontFamily:"inherit",outline:"none",padding:"8px 0",lineHeight:1.4,maxHeight:80}}/>
              <button onClick={() => sendMessage()} disabled={!input.trim()||loading}
                style={{width:30,height:30,borderRadius:8,border:"none",background:input.trim()&&!loading?G.teal:G.borderLight,color:input.trim()&&!loading?"#fff":G.dim,fontSize:13,cursor:input.trim()&&!loading?"pointer":"default",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
                &#8593;
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MOBILE FLOATING TAMMY BUTTON */}
      {isMobile && !chatOpen && (
        <button onClick={() => setChatOpen(true)} style={{position:"fixed",bottom:20,right:16,width:52,height:52,borderRadius:"50%",background:`linear-gradient(135deg,${G.teal},${G.tealDark})`,border:"none",boxShadow:"0 4px 16px rgba(26,187,166,0.4)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",zIndex:80}}>
          <TammyAvatar size={32}/>
        </button>
      )}

      {/* SEARCH OVERLAY */}
      {searchOpen && (
        <div style={{position:"fixed",inset:0,background:"rgba(44,37,64,0.5)",zIndex:999,display:"flex",alignItems:"flex-start",justifyContent:"center",paddingTop:"12vh"}} onClick={() => {setSearchOpen(false);setSearchQuery("");}}>
          <div style={{background:G.white,borderRadius:16,width:540,maxWidth:"90vw",boxShadow:"0 20px 60px rgba(0,0,0,0.25)",overflow:"hidden"}} onClick={e => e.stopPropagation()}>
            <div style={{display:"flex",alignItems:"center",gap:12,padding:"16px 20px",borderBottom:`1px solid ${G.border}`}}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={G.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
              <input ref={searchRef} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search modules, drills, resources, questions..." autoFocus
                onKeyDown={e => {
                  if (e.key === "Escape") { setSearchOpen(false); setSearchQuery(""); }
                  if (e.key === "Enter" && searchResults.length) {
                    const r = searchResults[0];
                    setSearchOpen(false); setSearchQuery("");
                    if (r.action === "navigate") { setActiveModule(r.module); }
                    else if (r.action === "link") { window.open(r.url, "_blank"); }
                    else if (r.action === "doc") { window.open("/docs/" + r.filename, "_blank"); }
                    else if (r.action === "drill") { setActiveModule("sharpener"); setTimeout(() => {setChatOpen(true);sendMessage("Here's my drill (" + r.category + "):\n\n" + r.scenario + "\n\nLet me give it a shot.");}, 300); }
                    else if (r.action === "prompt") { setActiveModule(r.module); setTimeout(() => {setChatOpen(true);sendMessage(r.prompt);}, 300); }
                  }
                }}
                style={{flex:1,border:"none",outline:"none",fontSize:15,color:G.dark,fontFamily:"inherit",background:"transparent"}}/>
              <span style={{fontSize:10,color:G.dim,background:G.bg,padding:"3px 8px",borderRadius:5,fontFamily:"inherit"}}>ESC</span>
            </div>
            <div style={{maxHeight:400,overflowY:"auto"}}>
              {searchQuery.trim() && !searchResults.length && (
                <div style={{padding:"32px 20px",textAlign:"center",color:G.dim,fontSize:13}}>No results for "{searchQuery}"</div>
              )}
              {!searchQuery.trim() && (
                <div style={{padding:"20px",color:G.muted,fontSize:12,lineHeight:1.6}}>
                  <div style={{fontWeight:600,marginBottom:8,color:G.text}}>Quick tips</div>
                  Try "objection", "expense", "LinkedIn", "opening statement", "incentive plan", or any topic.
                </div>
              )}
              {searchResults.map((r, i) => (
                <div key={i} onClick={() => {
                  setSearchOpen(false); setSearchQuery("");
                  if (r.action === "navigate") { setActiveModule(r.module); }
                  else if (r.action === "link") { window.open(r.url, "_blank"); }
                  else if (r.action === "doc") { window.open("/docs/" + r.filename, "_blank"); }
                  else if (r.action === "drill") { setActiveModule("sharpener"); setTimeout(() => {setChatOpen(true);sendMessage("Here's my drill (" + r.category + "):\n\n" + r.scenario + "\n\nLet me give it a shot.");}, 100); }
                  else if (r.action === "prompt") { setActiveModule(r.module); setTimeout(() => {setChatOpen(true);sendMessage(r.prompt);}, 100); }
                }} style={{padding:"12px 20px",cursor:"pointer",display:"flex",alignItems:"center",gap:12,borderBottom:`1px solid ${G.borderLight}`,transition:"background 0.1s"}}
                  onMouseEnter={e => e.currentTarget.style.background=G.bg}
                  onMouseLeave={e => e.currentTarget.style.background="transparent"}>
                  <div style={{width:4,height:4,borderRadius:"50%",background:r.color,flexShrink:0}}/>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:13,fontWeight:500,color:G.dark,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{r.text}</div>
                    {r.desc && <div style={{fontSize:11,color:G.dim,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{r.desc}</div>}
                  </div>
                  <div style={{flexShrink:0}}>
                    <span style={{fontSize:9,fontWeight:600,color:r.action==="doc"?G.teal:r.action==="link"?"#3B82F6":G.muted,background:r.action==="doc"?G.tealLight:r.action==="link"?"#EFF6FF":G.bg,padding:"3px 8px",borderRadius:10}}>
                      {r.action==="navigate"?"Go to":r.action==="link"?"Open":r.action==="doc"?"Download":r.action==="drill"?"Drill":"Ask Tammy"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* FEEDBACK MODAL */}
      {fbOpen && (
        <div style={{position:"fixed",inset:0,background:"rgba(44,37,64,0.45)",zIndex:999,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={() => {setFbOpen(false);setFbText("");}}>
          <div style={{background:G.white,borderRadius:16,width:440,maxWidth:"90vw",padding:"28px 30px",boxShadow:"0 20px 60px rgba(0,0,0,0.18)"}} onClick={e => e.stopPropagation()}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:32,height:32,borderRadius:8,background:G.tealLight,display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={G.teal} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                </div>
                <div>
                  <div style={{fontSize:16,fontWeight:700,color:G.dark}}>Feedback</div>
                  <div style={{fontSize:11,color:G.muted}}>Your conversation context is included automatically</div>
                </div>
              </div>
              <button onClick={() => {setFbOpen(false);setFbText("");}} style={{background:"none",border:"none",cursor:"pointer",fontSize:18,color:G.muted,padding:4}}>&times;</button>
            </div>
            <textarea value={fbText} onChange={e => setFbText(e.target.value)} placeholder="What's on your mind? Tell us what's working, what's not, or what you'd change..." rows={5}
              style={{width:"100%",boxSizing:"border-box",resize:"vertical",border:`1px solid ${G.border}`,borderRadius:10,padding:"12px 14px",fontSize:13,fontFamily:"inherit",color:G.dark,lineHeight:1.6,outline:"none",background:G.bg}}
              onFocus={e => e.currentTarget.style.borderColor=G.teal}
              onBlur={e => e.currentTarget.style.borderColor=G.border}
              autoFocus/>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:14}}>
              <div style={{fontSize:11,color:G.dim}}>{messages.length ? `Includes ${messages.length} message${messages.length !== 1 ? "s" : ""} from ${mod.label}` : "No conversation to attach"}</div>
              <div style={{display:"flex",gap:8}}>
                <button onClick={() => {setFbOpen(false);setFbText("");}} style={{padding:"8px 16px",borderRadius:8,border:`1px solid ${G.border}`,background:G.white,color:G.text,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Cancel</button>
                <button onClick={submitFeedback} disabled={!fbText.trim()||fbSending}
                  style={{padding:"8px 20px",borderRadius:8,border:"none",background:fbText.trim()&&!fbSending?G.teal:G.borderLight,color:fbText.trim()&&!fbSending?"#fff":G.dim,fontSize:12,fontWeight:600,cursor:fbText.trim()&&!fbSending?"pointer":"default",fontFamily:"inherit"}}>
                  {fbSending ? "Sending..." : "Send Feedback"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FEEDBACK TOAST */}
      {fbToast && (
        <div style={{position:"fixed",bottom:24,left:"50%",transform:"translateX(-50%)",background:G.purple,color:"#fff",padding:"10px 22px",borderRadius:10,fontSize:13,fontWeight:600,zIndex:1000,boxShadow:"0 4px 20px rgba(0,0,0,0.15)",animation:"fadeInUp 0.3s ease"}}>
          {fbToast}
        </div>
      )}

      <style>{`@keyframes pulse{0%,80%,100%{transform:scale(0.6);opacity:0.3}40%{transform:scale(1);opacity:0.8}}@keyframes fadeInUp{from{opacity:0;transform:translateX(-50%) translateY(10px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}.tammy-msg:hover button[data-copy]{opacity:1!important}@media(max-width:767px){.stats-grid{grid-template-columns:1fr 1fr!important}.patterns-grid{grid-template-columns:1fr!important}}`}</style>
    </div>
  );
}
