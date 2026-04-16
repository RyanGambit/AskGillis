import { G } from './colors.js';

export const LOGIN_QUOTES = [
  {text:"It takes 18 dials to reach one buyer. The ones who win are the ones who make dial 19.",attr:"Room to Grow"},
  {text:"Strategy is the what. Tactics are the how. Most sellers skip straight to tactics and wonder why nothing sticks.",attr:"Gillis Methodology"},
  {text:"The best response to any objection is a question. Acknowledge, Ask, Answer, Accept.",attr:"The 4A Model"},
  {text:"Your opening statement has 30 seconds. Don't sell in it. Earn the right to keep talking.",attr:"Call Planner"},
  {text:"Stop pitching your hotel. Start understanding their business. That's the shift from sales to strategy.",attr:"Business vs Sales Conversations"},
  {text:"A prospect who says 'send me your info' isn't interested yet. They're giving you a chance to earn their attention differently.",attr:"Objection Handling"},
  {text:"90% of sellers quit after 3-4 touches. It takes 12 to close. The math is simple. The discipline isn't.",attr:"The Sales Reality"},
  {text:"You don't need more leads. You need better conversations with the leads you have.",attr:"Gillis Methodology"},
  {text:"Every hotel has rooms and meeting space. That's not your differentiator. Your knowledge of their business is.",attr:"Room to Grow"},
  {text:"The parking lot is a goldmine. License plates, company logos, contractor trucks. Your next client is already staying at your hotel.",attr:"Prospecting"},
  {text:"Don't ask 'do you have any travel needs?' Ask 'what's driving the expansion into this market?' One gets a no. The other gets a conversation.",attr:"Qualifying Questions"},
  {text:"A follow-up email that says 'just checking in' tells the prospect you have nothing new to offer. Lead with value every time.",attr:"Follow-Up Strategy"},
  {text:"Culture is your differentiator. Front desk, night audit, housekeeping. Everybody sells.",attr:"Everybody Sells"},
  {text:"Do your SWOT by segment, not by hotel. Vanilla is not a sales strategy.",attr:"SWOT Analysis"},
  {text:"The seller who prepares wins. Research the company, know the contact, plan your questions. Then pick up the phone.",attr:"Call Planner"},
];

export const ONBOARDING_ITEMS = [
  {id:"ob1",label:"Gillis brand, values, and culture",tammy:true,prompt:"Tell me about Gillis brand values and culture.",week:"Week 1"},
  {id:"ob2",label:"RDOS role and hotel portfolio overview",tammy:true,prompt:"Explain the RDOS role. What does my day look like?",week:"Week 1"},
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

export const SITUATION_CATEGORIES = [
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

export const METHODOLOGY_ITEMS = [
  {title:"Business vs Sales Conversations",desc:"Shift from pitching features to understanding what the customer is buying.",color:G.teal},
  {title:"Call Planner",desc:"4-step framework: synthesize research, set objectives, opening statement, qualifying questions.",color:G.teal},
  {title:"4A Objection Handling",desc:"Acknowledge, Ask, Answer, Accept. The best response to any objection is a question.",color:G.lilac},
  {title:"Hunter vs Farmer",desc:"Different roles need different strengths. Don't put a farmer in a hunter seat.",color:G.orange},
  {title:"Strategy Before Tactics",desc:"Strategy is the what. Tactics are the how. Most sellers skip straight to tactics.",color:G.gold},
  {title:"The Sales Reality",desc:"Marathon not sprint. 18 dials to connect. 12 touches to close. 90% quit at 3-4.",color:G.purple},
  {title:"Everybody Sells",desc:"Front desk, night audit, housekeeping. Culture is your differentiator.",color:G.teal},
  {title:"SWOT by Segment",desc:"Do a SWOT for each competitor by market segment. Vanilla is not a sales strategy.",color:G.lilac},
];

export const SHARPENER_CATEGORIES = [
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

export const HUB_CATEGORIES = [
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
      {type:"document",label:"Brand One-Pager",desc:"8.5x11 brand infographic for print",filename:"Brand_Infographic_One_Pager_8_5_x_11_-_FINAL.pdf"},
      {type:"document",label:"Communication Guide \u2014 Tone & Voice",desc:"How to represent the Gillis brand",filename:"Communication_Guide-_Tone___Voice_.pdf"},
      {type:"document",label:"Core Values Compass",desc:"Gillis core values and guiding principles",filename:"Gillis_Core_Values_Compass.pdf"},
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
      {type:"document",label:"Employee Referral Program",desc:"Refer someone, get rewarded",filename:"Employee_Referral_Program_-_2024.pdf"},
      {type:"document",label:"Hotel Lead Referral Program",desc:"Refer a hotel, get rewarded",filename:"Hotel_Lead_Referral_Program_-_2024.pdf"},
      {type:"document",label:"Kudos Program",desc:"Recognition and rewards",filename:"Kudos_Information.pdf"},
      {type:"ask",label:"How is my performance measured?",prompt:"What metrics and criteria are used to evaluate my performance at Gillis? Walk me through the performance checklist."},
    ]
  },
  {
    category:"Onboarding & Training Docs",
    items:[
      {type:"document",label:"RDOS Onboarding Checklist (New Hire)",desc:"New hire onboarding steps",filename:"ASM_Hotel_Onboarding_Check_List.docx"},
      {type:"document",label:"RDOS Onboarding Checklist",desc:"Manager onboarding steps",filename:"RDOS_Hotel_Onboarding_Check_List_2025.docx"},
      {type:"document",label:"Hotel Onboarding Timeline \u2014 Internal",desc:"Timeline for onboarding a new property",filename:"2026_Hotel_Onboarding_Timeline_-_Internal_Team.pdf"},
      {type:"document",label:"Hotel Onboarding Timeline \u2014 External",desc:"Client-facing onboarding timeline",filename:"2026_Hotel_Onboarding_Timeline-_External.pdf"},
      {type:"document",label:"RDOS Performance Checklist",desc:"Performance evaluation criteria",filename:"RDOS_Performance_Checklist_Oct_2025.docx"},
      {type:"document",label:"Post Kick-Off Email Template",desc:"Email template after hotel onboarding kick-off",filename:"ASM_Post_Kick_Off_Email.docx"},
      {type:"document",label:"Onboarding Checklist \u2014 Sample",desc:"Sample onboarding checklist template",filename:"Onboarding_Checklist_-_Sample.pdf"},
    ]
  },
  {
    category:"Sales Tools & Frameworks",
    items:[
      {type:"document",label:"Sales Call Planner",desc:"Call planning worksheet and template",filename:"Sales_Call_Planner.pdf"},
      {type:"document",label:"Client Journey",desc:"The full Gillis client journey from first contact to partnership",filename:"Client_Journey.pdf"},
      {type:"document",label:"Learner Journey",desc:"New hire learning path from Welcome to Achievement",filename:"Learner_Journey.pdf"},
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

export const HELP_TIPS = [
  {title:"Be specific",body:"\"Help me with outreach\" gets you generic advice. \"I'm calling a construction company GM who just broke ground 3 miles from my Courtyard\" gets you a real game plan."},
  {title:"Tell her your segment",body:"Corporate, construction, sports, SMERF, government \u2014 each one requires a different approach. The more Tammy knows about who you're targeting, the sharper her coaching."},
  {title:"Share what happened",body:"If a call went sideways, walk her through it. What did you say? What did they say? The more detail you give, the more specific her feedback."},
  {title:"Use the modules",body:"Don't just type into the chat. The modules give Tammy context about what you're trying to do. Outreach Support tells her you're prepping a call. Role Play tells her to become the prospect. The right module gets you better answers."},
  {title:"Push back on her",body:"If her suggestion doesn't feel right for your situation, say so. \"That won't work because...\" gives her what she needs to adjust. She's coaching you, not lecturing you."},
  {title:"Keep it conversational",body:"You don't need to write formal questions. Talk to her like you'd talk to a colleague. \"I've got a weird one for you\" works just as well as a detailed brief."},
];

export const HELP_MODULE_GUIDE = [
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

export const HELP_FAQS = [
  {q:"Does Tammy know about my specific hotel?",a:"Only if you tell her. She doesn't have access to your CRM or property data. But when you share details about your hotel, market, or prospects, she uses that context to give specific advice. The more you share, the better she gets."},
  {q:"Are my conversations private?",a:"Your conversations are stored locally on your device for session history. They're not shared with other users. Your manager can see usage stats (which modules you're using and how often) but not the content of your conversations."},
  {q:"Who is Tammy?",a:"Tammy Gillis is the founder of Gillis Sales with 28 years of hospitality sales experience. AskGillis is powered by her methodology, her book \"Room to Grow,\" and the training materials used across 350+ hotel properties. The AI is trained to coach the way she would."},
  {q:"Can Tammy write emails and scripts for me?",a:"Yes. Use Outreach Support to prep calls and draft emails. Use LinkedIn & Social for connection requests and messages. Just give her context about who you're targeting and she'll draft something specific."},
  {q:"What if Tammy gives me advice I disagree with?",a:"Push back. Tell her why it won't work for your situation. She'll adjust. This is a conversation, not a lecture."},
  {q:"How is this different from ChatGPT?",a:"ChatGPT gives you generic sales advice. Tammy knows hotel sales specifically: the segments, the terminology, the objection patterns, the follow-up cadences, the reality of managing multiple properties. She coaches from the Gillis methodology, not generic best practices."},
  {q:"I'm not a Gillis employee. Can I still use this?",a:"Yes. AskGillis works for any hotel salesperson. The methodology is universal to hospitality B2B sales. You don't need to know the Gillis framework in advance \u2014 Tammy teaches it to you through the coaching."},
];

export const SOCIAL_ITEMS = [
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

export const GAMEPLAN_STARTERS = [
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

export const FEEDBACK_SHEET_URL = "https://script.google.com/macros/s/AKfycbyFSCGAPoKO8xw9LFnuW-6nFdP1e65kCB2Bm0MUJjkxbj_Uj_CGLsq16bsJx1tSt6jL/exec";
