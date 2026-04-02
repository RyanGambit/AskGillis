import { useState, useRef, useEffect } from "react";
import { SYSTEM_PROMPT } from "./prompt.js";
import { KNOWLEDGE_BASE } from "./knowledgebase.js";

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
  outreach:"Help with outreach using call planner. Reference their target details if entered. Be specific and actionable.",
  situation:"They have a situation. Validate in one sentence first, then coach. Be direct about what went wrong.",
  roleplay:"Set the scene, then become the prospect. Be realistic, slightly guarded, throw objections. Give brief specific feedback after.",
  sharpener:"The seller picked a drill. Present the scenario clearly, then wait for their attempt. After they respond, give brief direct feedback: one thing they did well, one thing to sharpen. Stay under 100 words for feedback. If they say 'surprise me', pick a random drill type and give them a specific scenario. Keep the energy up. Quick workout, not a lecture.",
  social:"Help with LinkedIn and social selling for hotel sales. Be specific to hospitality. No generic LinkedIn advice. Every suggestion should sound like a real hotel salesperson, not a marketing guru or influencer. Keep it practical and direct.",
  methodology:"Explain through a real hotel sales scenario in 3-4 sentences. Not a textbook definition.",
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
function logTeamActivity(name, mod) {
  try {
    const d = loadTeamData();
    if (!d[name]) d[name] = { sessions: [], lastActive: "" };
    d[name].sessions.push({ module: mod, date: new Date().toISOString() });
    d[name].sessions = d[name].sessions.slice(-200);
    d[name].lastActive = new Date().toISOString();
    localStorage.setItem("ag-team", JSON.stringify(d));
  } catch {}
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
function ManagerDashboard({ teamData, userName }) {
  const users = Object.entries(teamData);
  const now = new Date();
  const weekAgo = new Date(now - 7 * 864e5);
  const totalSessions = users.reduce((s, [, u]) => s + u.sessions.length, 0);
  const weekSessions = users.reduce((s, [, u]) => s + u.sessions.filter(x => new Date(x.date) > weekAgo).length, 0);
  const mc = {};
  users.forEach(([, u]) => u.sessions.forEach(s => { mc[s.module] = (mc[s.module] || 0) + 1; }));
  const topModules = Object.entries(mc).sort((a, b) => b[1] - a[1]);
  const maxMC = topModules.length ? topModules[0][1] : 1;
  const activeWeek = users.filter(([, u]) => u.sessions.some(s => new Date(s.date) > weekAgo)).length;

  return (
    <div style={{padding:"32px 40px",maxWidth:800}}>
      <h2 style={{fontSize:22,fontWeight:600,margin:"0 0 4px"}}>Team Overview</h2>
      <p style={{fontSize:13,color:G.muted,margin:"0 0 28px"}}>Activity across your team.</p>

      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:28}}>
        {[{l:"Team members",v:users.length,c:G.purple},{l:"Active this week",v:activeWeek,c:G.teal},{l:"Sessions this week",v:weekSessions,c:G.teal},{l:"All-time sessions",v:totalSessions,c:G.muted}].map((s,i) => (
          <div key={i} style={{background:G.white,border:`1px solid ${G.border}`,borderRadius:10,padding:"18px 16px"}}>
            <div style={{fontSize:11,color:G.muted,marginBottom:6,fontWeight:500,textTransform:"uppercase",letterSpacing:"0.04em"}}>{s.l}</div>
            <div style={{fontSize:28,fontWeight:600,color:s.c}}>{s.v}</div>
          </div>
        ))}
      </div>

      <div style={{background:G.white,border:`1px solid ${G.border}`,borderRadius:12,padding:"22px 24px",marginBottom:24}}>
        <div style={{fontSize:13,fontWeight:600,marginBottom:16}}>Module Usage</div>
        {topModules.length ? topModules.map(([mod, count], i) => {
          const m = MODULES.find(x => x.id === mod);
          return (
            <div key={i} style={{display:"flex",alignItems:"center",gap:12,marginBottom:10}}>
              <div style={{width:110,fontSize:12,fontWeight:500}}>{m ? m.label : mod}</div>
              <div style={{flex:1,height:8,background:G.bg,borderRadius:4,overflow:"hidden"}}>
                <div style={{width:`${(count/maxMC)*100}%`,height:"100%",background:m?m.color:G.teal,borderRadius:4}}/>
              </div>
              <div style={{width:40,fontSize:12,fontWeight:600,color:G.muted,textAlign:"right"}}>{count}</div>
            </div>
          );
        }) : <div style={{fontSize:13,color:G.dim}}>No activity yet.</div>}
      </div>

      <div style={{background:G.white,border:`1px solid ${G.border}`,borderRadius:12,padding:"22px 24px"}}>
        <div style={{fontSize:13,fontWeight:600,marginBottom:16}}>Team Members</div>
        {users.length ? users.sort((a,b) => new Date(b[1].lastActive) - new Date(a[1].lastActive)).map(([name, u], i) => {
          const wc = u.sessions.filter(s => new Date(s.date) > weekAgo).length;
          const lm = u.sessions.length ? u.sessions[u.sessions.length-1].module : "";
          const ml = MODULES.find(x => x.id === lm);
          const isMe = name === userName;
          const da = Math.floor((now - new Date(u.lastActive)) / 864e5);
          const rc = da === 0 ? "Today" : da === 1 ? "Yesterday" : `${da}d ago`;
          return (
            <div key={i} style={{display:"flex",alignItems:"center",gap:14,padding:"12px 0",borderBottom:i<users.length-1?`1px solid ${G.borderLight}`:"none"}}>
              <div style={{width:32,height:32,borderRadius:"50%",background:isMe?G.tealLight:G.purpleLight,border:`1.5px solid ${isMe?G.tealBorder:G.purpleBorder}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:600,color:isMe?G.teal:G.purple}}>
                {name.split(" ").map(w=>w[0]).join("").slice(0,2)}
              </div>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:500}}>{name}{isMe && <span style={{fontSize:10,color:G.teal,marginLeft:6}}>you</span>}</div>
                <div style={{fontSize:11,color:G.muted}}>{ml ? `Last: ${ml.label}` : ""}</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:13,fontWeight:600,color:wc>0?G.teal:G.dim}}>{wc}/wk</div>
                <div style={{fontSize:10,color:G.dim}}>{rc}</div>
              </div>
            </div>
          );
        }) : <div style={{fontSize:13,color:G.dim}}>No team members yet.</div>}
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
  const [mode, setMode] = useState("seller");
  const [mgrView, setMgrView] = useState("team");
  const [activeModule, setActiveModule] = useState("onboarding");
  const [chatOpen, setChatOpen] = useState(true);
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

  const kbRef = useRef(null);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const convRef = useRef([]);

  const userName = email ? email.split("@")[0].replace(/[._]/g," ").replace(/\b\w/g, l => l.toUpperCase()) : "";

  // Load KB on mount
  useEffect(() => {
    const kb = getKB();
    kbRef.current = kb;
    setKbWords(kb.split(/\s+/).length);
    setHasKBOverride(!!localStorage.getItem("ag-kb-override"));
  }, []);

  useEffect(() => { scrollRef.current?.scrollTop && (scrollRef.current.scrollTop = scrollRef.current.scrollHeight); }, [messages, loading]);
  useEffect(() => { if (chatOpen) setTimeout(() => inputRef.current?.focus(), 200); }, [chatOpen]);
  useEffect(() => {
    if (screen === "platform") {
      setMessages([]);
      convRef.current = [];
      setSocialExpanded(null);
      setSocialInput("");
      logTeamActivity(userName, activeModule);
      setTeamData(loadTeamData());
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
    setScreen("platform");
  };

  const saveSession = () => {
    if (messages.length < 2) return;
    const fm = messages.find(m => !m.isTammy);
    const s = {
      id: Date.now().toString(),
      module: activeModule,
      moduleLabel: MODULES.find(m => m.id === activeModule)?.label || activeModule,
      summary: fm ? fm.text.slice(0, 55) + "..." : "Session",
      date: new Date().toISOString(),
      messageCount: messages.length,
      messages: messages.slice(0, 50),
    };
    const updated = [s, ...sessions].slice(0, 30);
    setSessions(updated);
    saveSessions(updated);
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
    convRef.current.push({ role: "user", content: msg });

    const kbContent = kbRef.current || "";
    const sys = SYSTEM_PROMPT
      + "\n\nKNOWLEDGE BASE:\n" + kbContent
      + "\n\nMODE: " + (MODE_PROMPTS[activeModule] || "")
      + "\n\n" + getCtx()
      + "\n\nToday: " + new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    const timeout = new Promise((_, rej) => setTimeout(() => rej(new Error("Timed out after 90s. Please try again.")), 90000));
    const fetcher = (async () => {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-opus-4-6", max_tokens: 1000, system: sys, messages: [...convRef.current] }),
      });
      return await res.text();
    })();

    try {
      const raw = await Promise.race([fetcher, timeout]);
      const data = JSON.parse(raw);
      if (data.error) {
        convRef.current.push({ role: "assistant", content: data.error.message });
        setMessages(p => [...p, { text: "Error: " + data.error.message, isTammy: true }]);
      } else {
        const t = data.content?.map(b => b.text || "").join("") || "Empty response.";
        convRef.current.push({ role: "assistant", content: t });
        setMessages(p => [...p, { text: t, isTammy: true }]);
      }
    } catch (e) {
      setMessages(p => [...p, { text: e.message, isTammy: true }]);
    }
    setLoading(false);
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
      <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:`linear-gradient(160deg,#1a1035 0%,${G.purpleDark} 40%,${G.purple} 70%,#1a1035 100%)`,padding:20}}>
        <div style={{width:"100%",maxWidth:400}}>
          <div style={{textAlign:"center",marginBottom:36}}>
            <div style={{display:"inline-flex",alignItems:"center",gap:12,marginBottom:20}}>
              <GillisLogo size={38}/><span style={{fontSize:26,fontWeight:700,color:"white"}}>AskGillis</span>
            </div>
            <p style={{color:"rgba(255,255,255,0.5)",fontSize:14,lineHeight:1.6,margin:0}}>AI-powered sales coaching built on 28 years of hospitality expertise.</p>
          </div>
          <div style={{background:"rgba(255,255,255,0.04)",backdropFilter:"blur(20px)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:14,padding:"32px 28px"}}>
            <div style={{marginBottom:18}}>
              <label style={{display:"block",fontSize:11,fontWeight:600,color:"rgba(255,255,255,0.4)",marginBottom:7,letterSpacing:"0.06em",textTransform:"uppercase"}}>Email</label>
              <input type="email" value={email} onChange={e => {setEmail(e.target.value);setErr("");}} placeholder="you@hotel.com"
                onKeyDown={e => {if(e.key==="Enter")handleLogin();}}
                style={{width:"100%",padding:"12px 14px",borderRadius:9,border:"1px solid rgba(255,255,255,0.1)",background:"rgba(255,255,255,0.06)",color:"white",fontSize:14,outline:"none",boxSizing:"border-box",fontFamily:"inherit"}}/>
            </div>
            <div style={{marginBottom:24}}>
              <label style={{display:"block",fontSize:11,fontWeight:600,color:"rgba(255,255,255,0.4)",marginBottom:7,letterSpacing:"0.06em",textTransform:"uppercase"}}>Invitation Code</label>
              <input type="text" value={code} onChange={e => {setCode(e.target.value);setErr("");}} placeholder="Enter code"
                onKeyDown={e => {if(e.key==="Enter")handleLogin();}}
                style={{width:"100%",padding:"12px 14px",borderRadius:9,border:`1px solid ${err?"rgba(255,100,100,0.5)":"rgba(255,255,255,0.1)"}`,background:"rgba(255,255,255,0.06)",color:"white",fontSize:14,outline:"none",boxSizing:"border-box",fontFamily:"inherit"}}/>
              {err && <p style={{color:"#ff7b7b",fontSize:12,marginTop:6,marginBottom:0}}>{err}</p>}
            </div>
            <button onClick={handleLogin} style={{width:"100%",padding:"13px 0",borderRadius:9,border:"none",background:`linear-gradient(135deg,${G.teal},${G.tealDark})`,color:"white",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Get Started</button>
          </div>
        </div>
      </div>
    );
  }

  // ---- PLATFORM ----
  const mod = MODULES.find(m => m.id === activeModule);
  const sB = "rgba(255,255,255,0.08)";
  const sT = "rgba(255,255,255,0.55)";

  return (
    <div style={{display:"flex",height:"100vh",color:G.dark,background:G.bg}}>
      {/* SIDEBAR */}
      <div style={{width:220,background:G.purple,display:"flex",flexDirection:"column",flexShrink:0}}>
        <div style={{padding:"18px 20px",borderBottom:`0.5px solid ${sB}`,display:"flex",alignItems:"center",gap:10}}>
          <GillisLogo size={28}/>
          <div><div style={{fontSize:15,fontWeight:600,color:"#E5E5E5"}}>AskGillis</div><div style={{fontSize:9,fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase",color:G.teal}}>Sales Platform</div></div>
        </div>

        {/* Mode toggle */}
        <div style={{padding:"12px 12px 0"}}>
          <div style={{display:"flex",borderRadius:8,border:`0.5px solid ${sB}`,overflow:"hidden"}}>
            {["seller","manager"].map(m => (
              <button key={m} onClick={() => {setMode(m);if(m==="manager")setMgrView("team");}} style={{flex:1,padding:"7px 0",border:"none",fontSize:10,fontWeight:600,letterSpacing:"0.04em",textTransform:"uppercase",cursor:"pointer",fontFamily:"inherit",background:mode===m?"rgba(26,187,166,0.12)":"transparent",color:mode===m?G.teal:sT}}>{m}</button>
            ))}
          </div>
        </div>

        {/* KB indicator */}
        <div style={{padding:"8px 14px 0"}}>
          <div style={{padding:"5px 10px",borderRadius:6,background:"rgba(26,187,166,0.06)",border:"0.5px solid rgba(26,187,166,0.2)",fontSize:10,color:G.teal,display:"flex",alignItems:"center",gap:6}}>
            <div style={{width:5,height:5,borderRadius:"50%",background:G.teal}}/>KB loaded ({kbWords.toLocaleString()})
          </div>
        </div>

        {mode === "seller" ? <>
          <div style={{flex:1,padding:"14px 10px",overflowY:"auto"}}>
            <div style={{fontSize:9,fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase",color:"rgba(255,255,255,0.2)",padding:"0 12px",marginBottom:8}}>Training</div>
            {MODULES.map(m => {
              const a = activeModule === m.id;
              return <button key={m.id} onClick={() => setActiveModule(m.id)} style={{width:"100%",padding:"10px 14px",borderRadius:8,border:"none",textAlign:"left",cursor:"pointer",fontFamily:"inherit",background:a?"rgba(26,187,166,0.1)":"transparent",color:a?G.teal:sT,fontSize:12.5,fontWeight:a?600:400,marginBottom:2,display:"flex",alignItems:"center",gap:10}}>
                <NavIcon path={m.icon} color={a?G.teal:sT} size={16}/>{m.label}
              </button>;
            })}
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
        </> : <div style={{flex:1,padding:"14px 10px"}}>
          <div style={{fontSize:9,fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase",color:"rgba(255,255,255,0.2)",padding:"0 12px",marginBottom:8}}>Management</div>
          {[{id:"team",label:"Team Overview"},{id:"kb",label:"Knowledge Base"}].map(n => {
            const a = mgrView === n.id;
            return <button key={n.id} onClick={() => setMgrView(n.id)} style={{width:"100%",padding:"10px 14px",borderRadius:8,border:"none",textAlign:"left",cursor:"pointer",fontFamily:"inherit",background:a?"rgba(26,187,166,0.1)":"transparent",color:a?G.teal:sT,fontSize:12.5,fontWeight:a?600:400,marginBottom:2}}>{n.label}</button>;
          })}
        </div>}

        <div style={{padding:"14px 20px",borderTop:`0.5px solid ${sB}`}}>
          <div style={{fontSize:11,color:"rgba(255,255,255,0.3)"}}>{userName}</div>
        </div>
      </div>

      {/* CENTER CONTENT */}
      <div style={{flex:1,display:"flex",flexDirection:"column",minWidth:0}}>
        <div style={{padding:"12px 28px",borderBottom:`1px solid ${G.border}`,background:G.white,display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            {mode === "seller" && <NavIcon path={mod.icon} color={mod.color} size={18}/>}
            <span style={{fontSize:15,fontWeight:600}}>{mode === "manager" ? (mgrView === "kb" ? "Knowledge Base" : "Team Overview") : mod.label}</span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <button onClick={() => setFbOpen(true)} title="Send Feedback" style={{padding:"6px 10px",borderRadius:8,border:`1px solid ${G.border}`,background:G.white,color:G.muted,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:5}}
              onMouseEnter={e => {e.currentTarget.style.borderColor=G.teal;e.currentTarget.style.color=G.teal;}}
              onMouseLeave={e => {e.currentTarget.style.borderColor=G.border;e.currentTarget.style.color=G.muted;}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              Feedback
            </button>
            {mode === "seller" && !chatOpen && <button onClick={() => setChatOpen(true)} style={{padding:"6px 14px",borderRadius:8,border:"none",background:G.teal,color:"white",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:6}}><TammyAvatar size={16}/>Ask Tammy</button>}
          </div>
        </div>

        <div style={{flex:1,overflowY:"auto",padding:mode==="manager"?"0":"28px 36px"}}>
          {/* Manager views */}
          {mode === "manager" && mgrView === "team" && <ManagerDashboard teamData={teamData} userName={userName}/>}
          {mode === "manager" && mgrView === "kb" && <KBAdmin kbWords={kbWords} hasOverride={hasKBOverride} onUpdate={(text) => {kbRef.current=text;setKbWords(text.split(/\s+/).length);setHasKBOverride(true);}} onReset={() => {kbRef.current=KNOWLEDGE_BASE;setKbWords(KNOWLEDGE_BASE.split(/\s+/).length);setHasKBOverride(false);}}/>}

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
                <button onClick={() => {setChatOpen(true);sendMessage("I've entered my target details. Help me build my approach.");}} style={{padding:"12px 24px",borderRadius:9,border:"none",background:G.teal,color:"white",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Build my approach with Tammy</button>
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
                <button onClick={() => {setChatOpen(true);sendMessage(`Ready to role play. Calling ${rp.who||"a prospect"}${rp.segment?" in "+rp.segment:""}. Objective: ${rp.objective||"get a meeting"}. Play the prospect.`);}} style={{padding:"12px 24px",borderRadius:9,border:"none",background:G.orange,color:"white",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Start Role Play</button>
              </div>
            </div>
          )}

          {/* Sharpener */}
          {mode === "seller" && activeModule === "sharpener" && (
            <div>
              <h2 style={{fontSize:20,fontWeight:600,margin:"0 0 4px"}}>Daily Sharpener</h2>
              <p style={{fontSize:13,color:G.text,lineHeight:1.7,margin:"0 0 24px",maxWidth:540}}>Pick a drill. Give it your best shot. Tammy gives you feedback. Five minutes, real reps, real improvement.</p>

              <button onClick={() => {
                const allItems = SHARPENER_CATEGORIES.flatMap(c => c.items);
                const pick = allItems[Math.floor(Math.random() * allItems.length)];
                setChatOpen(true); sendMessage("Here's my drill:\n\n" + pick.scenario + "\n\nLet me give it a shot.");
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
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
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
        </div>
      </div>

      {/* TAMMY CHAT PANEL */}
      {mode === "seller" && chatOpen && (
        <div style={{width:340,borderLeft:`1px solid ${G.border}`,background:G.white,display:"flex",flexDirection:"column",flexShrink:0}}>
          <div style={{padding:"12px 16px",borderBottom:`1px solid ${G.border}`,display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
            <TammyAvatar size={30}/>
            <div style={{flex:1}}>
              <div style={{fontSize:13,fontWeight:600}}>Tammy</div>
              <div style={{fontSize:9,fontWeight:600,letterSpacing:"0.06em",textTransform:"uppercase",color:mod.color}}>Coaching: {mod.label}</div>
            </div>
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
                  {(activeModule==="onboarding"?["What should I focus on first?","Explain the Gillis approach","What does a typical day look like?"]
                    :activeModule==="gameplan"?["Plan my week","Which accounts should I focus on?","What worked last week?"]
                    :activeModule==="outreach"?["Help me write an opening statement","What qualifying questions should I ask?","Draft an outreach email"]
                    :activeModule==="situation"?["I keep hitting the same objection","My pipeline is drying up","I had a rough call"]
                    :activeModule==="roleplay"?["Let's practice a cold call","Throw me a tough objection","Practice a follow-up"]
                    :activeModule==="sharpener"?["Surprise me with a drill","Practice opening statements","Work on objection handling"]
                    :activeModule==="social"?["Fix my LinkedIn headline","Write a connection request","Help me write a post"]
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
              <div key={i} style={{display:"flex",gap:8,alignItems:"flex-start"}}>
                <TammyAvatar size={24}/>
                <div style={{flex:1,padding:"10px 13px",background:G.bg,border:`1px solid ${G.border}`,borderRadius:"2px 12px 12px 12px",fontSize:12.5,color:G.text,lineHeight:1.7,whiteSpace:"pre-wrap"}}>{m.text}</div>
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
              <div style={{fontSize:11,color:G.dim}}>{messages.length} message{messages.length !== 1 ? "s" : ""} in this conversation</div>
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

      <style>{`@keyframes pulse{0%,80%,100%{transform:scale(0.6);opacity:0.3}40%{transform:scale(1);opacity:0.8}}@keyframes fadeInUp{from{opacity:0;transform:translateX(-50%) translateY(10px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}`}</style>
    </div>
  );
}
