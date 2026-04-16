import { supabase } from './supabase.js';

// Topic bucketing for privacy-preserving dashboards.
// Raw first_message is stored, but leaders see these buckets, not raw text.
const TOPIC_KEYWORDS = [
  { topic: 'objection_handling',   patterns: ['objection', 'push back', 'pushback', "send me your info", 'not interested', 'happy with', 'too expensive', 'rate is too', 'price', 'budget', 'call back', 'next quarter'] },
  { topic: 'prospecting',          patterns: ['prospect', 'cold call', 'find lead', 'generate lead', 'who should i call', 'new account', 'list of', 'new hotel', 'parking lot'] },
  { topic: 'call_prep',            patterns: ['prepare for', 'opening statement', 'call planner', 'prep a call', 'discovery call', 'qualifying question', 'first call'] },
  { topic: 'follow_up',            patterns: ['follow up', 'follow-up', 'voicemail', 'cold outreach', 'no response', 'not calling back', 'ghosted', 'gone cold', 'cold', 'silent'] },
  { topic: 'role_play',            patterns: ['role play', 'roleplay', "let's practice", 'practice a', 'be the prospect', 'pretend'] },
  { topic: 'account_management',   patterns: ['existing account', 'grow the account', 'client relationship', 'gm is frustrated', 'retain', 'renewal', 'expand'] },
  { topic: 'email_drafting',       patterns: ['write an email', 'draft an email', 'email template', 'follow up email', 'outreach email'] },
  { topic: 'rfp',                  patterns: ['rfp', 'response to rfp', 'business case', 'carp', 'cbc'] },
  { topic: 'confidence_motivation', patterns: ['tough week', 'rough', 'pressure', 'not hitting numbers', 'scattered', 'overwhelmed', 'stuck', 'discouraged'] },
  { topic: 'methodology',          patterns: ['4a model', 'hunter vs farmer', 'strategy before tactics', 'business vs sales', 'swot', 'explain the', 'what is the'] },
  { topic: 'brand_specific',       patterns: ['hilton', 'marriott', 'ihg', 'choice', 'wyndham', 'best western', 'hyatt', 'portal', 'merlin', 'concerto', 'rmas', 'carp', 'onq', 'chain code', 'corporate id'] },
  { topic: 'linkedin_social',      patterns: ['linkedin', 'connection request', 'linkedin post', 'dm on linkedin', 'social selling'] },
  { topic: 'weekly_planning',      patterns: ['plan my week', 'gameplan', 'what worked last week', 'prioritize', 'focus on this week'] },
  { topic: 'onboarding',           patterns: ["i'm new", 'just started', 'onboarding', 'new hire', 'first week', 'first day'] },
  { topic: 'operations',           patterns: ['expense', 'pto', 'time off', 'policy', 'hr', 'incentive plan', 'mileage'] },
];

export function bucketTopic(firstMessage, module) {
  if (!firstMessage) return 'general';
  const text = firstMessage.toLowerCase();
  for (const { topic, patterns } of TOPIC_KEYWORDS) {
    for (const p of patterns) {
      if (text.includes(p)) return topic;
    }
  }
  // Fall back to module-based default
  const moduleMap = {
    onboarding: 'onboarding',
    gameplan: 'weekly_planning',
    outreach: 'call_prep',
    situation: 'confidence_motivation',
    roleplay: 'role_play',
    sharpener: 'methodology',
    social: 'linkedin_social',
    methodology: 'methodology',
    hub: 'operations',
    brands: 'brand_specific',
  };
  return moduleMap[module] || 'general';
}

/**
 * Log a session to Supabase.
 * Skipped for guest sessions (GILLIS2026 logins) and dev mode to avoid polluting data.
 *
 * @param {object} session - { module, category, first_message, message_count, duration, messages, brand_slug }
 * @param {object} auth - { user, profile, isGuestSession, devOverride }
 */
export async function logSession(session, auth) {
  if (!supabase) return { skipped: 'no-supabase' };
  if (!auth?.user?.id) return { skipped: 'no-user' };
  if (auth.isGuestSession) return { skipped: 'guest-session' };
  if (auth.devOverride) return { skipped: 'dev-override' };
  // Only log sessions with actual interaction
  if (!session.message_count || session.message_count < 2) return { skipped: 'empty-session' };

  const topic = bucketTopic(session.first_message, session.module);

  const row = {
    user_id: auth.user.id,
    module: session.module || 'unknown',
    category: session.category || null,
    topic,
    first_message: session.first_message || null,
    message_count: session.message_count || 0,
    duration: session.duration || 0,
    messages: session.messages || null,
    brand_slug: session.brand_slug || null,
  };

  const { error } = await supabase.from('sessions').insert(row);
  if (error) {
    console.error('Failed to log session:', error);
    return { error };
  }
  return { success: true };
}
