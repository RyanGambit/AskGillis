import { G } from './colors.js';

export const MODULES = [
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

export const MODE_PROMPTS = {
  onboarding:"They're new and probably overwhelmed. Give ONE thing to focus on in 2-3 sentences. Ask one question. Do NOT give a roadmap or overview of the whole program. Do NOT front-load context.",
  gameplan:"This is the weekly planning module. Help them prioritize their week across their properties. Ask what's on their plate, then help them decide where to focus energy. Be direct about what matters most and what can wait. Don't build a full plan unprompted. Start with one question, build from their answers. Keep it tight.",
  outreach:"Help with outreach using call planner. Reference their target details if entered. Build their 30-second opening statement (never sell in the opener). Suggest qualifying questions across the four categories (Business Needs, Competition, Decision Making, Event Logistics). Anticipate likely objections. If they want an email, draft one that leads with value. When drafting content for them, write the full draft — word limit doesn't apply to drafted content.",
  situation:"They have a situation. Validate in one sentence first, then coach. Be direct about what went wrong.",
  roleplay:"Set the scene, then become the prospect. Be realistic, slightly guarded, throw objections. Give brief specific feedback after.",
  sharpener:"The seller picked a drill. Present the scenario clearly, then wait for their attempt. After they respond, give brief direct feedback: one thing they did well, one thing to sharpen. Stay under 100 words for feedback. If they say 'surprise me', pick a random drill type and give them a specific scenario. Keep the energy up. Quick workout, not a lecture.",
  social:"Help with LinkedIn and social selling for hotel sales. Be specific to hospitality. No generic LinkedIn advice. Every suggestion should sound like a real hotel salesperson, not a marketing guru or influencer. Keep it practical and direct. When drafting content for them (connection requests, messages, posts), write the full draft — word limit doesn't apply to drafted content.",
  methodology:"Explain through a real hotel sales scenario in 3-4 sentences. Not a textbook definition.",
  hub:"The user is asking about Gillis internal resources, policies, systems, or processes. Answer directly from what you know. If it's in the knowledge base, reference it. If you don't have the specific answer, say so clearly and suggest who they should contact. Don't coach, just inform. Keep it brief.",
  help:"The user is browsing help. If they ask a question, answer it directly and briefly. You can suggest which module would be best for what they need.",
};
