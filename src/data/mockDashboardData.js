// Mock dashboard data generator for AskGillis
// Generates deterministic, realistic usage data tied to real users/pods

import { USERS, PODS } from '../data/userSeed.js';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const MODULES = [
  'onboarding', 'gameplan', 'outreach', 'situation',
  'roleplay', 'sharpener', 'social', 'methodology', 'hub',
];

const MODULE_LABELS = {
  onboarding: 'Onboarding',
  gameplan: 'Weekly Game Plan',
  outreach: 'Outreach Support',
  situation: 'Situation',
  roleplay: 'Role Play',
  sharpener: 'Daily Sharpener',
  social: 'LinkedIn & Social',
  methodology: 'Methodology',
  hub: 'Gillis Hub',
};

const MODULE_COLORS = {
  onboarding: '#1ABBA6',
  gameplan: '#8B5CF6',
  outreach: '#1ABBA6',
  situation: '#7C6BC4',
  roleplay: '#E8875B',
  sharpener: '#D4A843',
  social: '#3B82F6',
  methodology: '#8a839a',
  hub: '#6B7280',
};

// Target distribution percentages for module usage
const MODULE_WEIGHTS = {
  outreach: 25,
  situation: 20,
  sharpener: 15,
  roleplay: 10,
  gameplan: 10,
  social: 8,
  onboarding: 7,
  methodology: 3,
  hub: 2,
};

// Session categories per module
const MODULE_CATEGORIES = {
  onboarding: ['Welcome Tour', 'Profile Setup', 'First Steps', 'Platform Intro'],
  gameplan: ['Weekly Planning', 'Goal Setting', 'Pipeline Review', 'Priority Alignment'],
  outreach: ['Email Draft', 'Call Prep', 'Follow-Up Strategy', 'Prospect Research', 'Cold Outreach'],
  situation: ['Discovery Call', 'Objection Handling', 'Negotiation', 'Closing Strategy', 'RFP Response'],
  roleplay: ['Cold Call Practice', 'Pitch Rehearsal', 'Objection Drill', 'Closing Scenario'],
  sharpener: ['Daily Tip', 'Quick Quiz', 'Micro Lesson', 'Skill Check'],
  social: ['LinkedIn Post', 'Profile Optimization', 'Connection Strategy', 'Content Ideas'],
  methodology: ['Framework Review', 'Best Practices', 'Process Guide'],
  hub: ['Resource Search', 'Document Lookup'],
};

// ---------------------------------------------------------------------------
// Seeded random number generator (deterministic per-string seed)
// ---------------------------------------------------------------------------

function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + ch;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

function seededRandom(seed) {
  let s = typeof seed === 'string' ? hashCode(seed) : seed;
  // Simple LCG
  return function next() {
    s = (s * 1664525 + 1013904223) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

// Utility: pick an integer in [min, max] inclusive using a rng function
function randInt(rng, min, max) {
  return Math.floor(rng() * (max - min + 1)) + min;
}

// Utility: pick a random item from an array
function pickOne(rng, arr) {
  return arr[Math.floor(rng() * arr.length)];
}

// Utility: weighted random pick from MODULE_WEIGHTS
function pickWeightedModule(rng) {
  const entries = Object.entries(MODULE_WEIGHTS);
  const total = entries.reduce((s, [, w]) => s + w, 0);
  let r = rng() * total;
  for (const [mod, w] of entries) {
    r -= w;
    if (r <= 0) return mod;
  }
  return entries[entries.length - 1][0];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const sellers = USERS.filter(u => u.role === 'seller');

function today() {
  return new Date();
}

function daysAgo(n) {
  const d = today();
  d.setDate(d.getDate() - n);
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatShortDate(d) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return `${days[d.getDay()]} ${d.getMonth() + 1}/${d.getDate()}`;
}

function formatISO(d) {
  return d.toISOString();
}

function isWeekday(d) {
  const day = d.getDay();
  return day !== 0 && day !== 6;
}

function getPodLeader(podId) {
  const pod = PODS.find(p => p.id === podId);
  if (!pod) return null;
  return USERS.find(u => u.email === pod.leaderEmail);
}

function getPodSellers(podId) {
  return sellers.filter(s => s.podId === podId);
}

// Generate a module breakdown object for a given total session count
function generateModuleBreakdown(rng, totalSessions) {
  const breakdown = {};
  let remaining = totalSessions;
  const mods = Object.keys(MODULE_WEIGHTS);

  for (let i = 0; i < mods.length; i++) {
    const mod = mods[i];
    if (i === mods.length - 1) {
      breakdown[mod] = Math.max(0, remaining);
    } else {
      // Use weight with some per-seller variance
      const weight = MODULE_WEIGHTS[mod] / 100;
      const variance = 0.4 + rng() * 1.2; // 0.4x to 1.6x
      const count = Math.round(totalSessions * weight * variance);
      const clamped = Math.min(count, remaining);
      breakdown[mod] = clamped;
      remaining -= clamped;
    }
  }
  return breakdown;
}

// ---------------------------------------------------------------------------
// Exported functions
// ---------------------------------------------------------------------------

/**
 * Org-wide aggregated stats for the executive dashboard.
 */
export function getMockOrgStats() {
  const rng = seededRandom('org-stats-v1');
  const totalSellers = sellers.length;
  const activePercent = 0.70 + rng() * 0.20; // 70-90%
  const activeSellersThisWeek = Math.round(totalSellers * activePercent);
  const totalSessionsThisWeek = randInt(rng, 120, 200);
  const avgPerSeller = Math.round((totalSessionsThisWeek / activeSellersThisWeek) * 10) / 10;

  // Pick most active pod deterministically
  const podOptions = PODS.filter(p => p.id !== 'executive_team');
  const mostActivePod = pickOne(rng, podOptions);

  // Pick trending module
  const trendingModule = pickOne(rng, Object.keys(MODULE_WEIGHTS));

  return {
    totalSellers,
    activeSellersThisWeek,
    totalSessionsThisWeek,
    avgPerSeller,
    mostActivePod: mostActivePod.name,
    mostActivePodId: mostActivePod.id,
    trendingModule: MODULE_LABELS[trendingModule],
    trendingModuleKey: trendingModule,
  };
}

/**
 * Pod-level stats including member detail rows.
 */
export function getMockPodStats(podId) {
  const pod = PODS.find(p => p.id === podId);
  if (!pod) return null;

  const leader = getPodLeader(podId);
  const podSellers = getPodSellers(podId);
  const rng = seededRandom(`pod-${podId}`);

  const memberCount = podSellers.length;
  const activeThisWeek = Math.max(1, Math.round(memberCount * (0.70 + rng() * 0.25)));
  const totalSessions = randInt(rng, memberCount * 2, memberCount * 8);
  const avgPerMember = memberCount > 0 ? Math.round((totalSessions / memberCount) * 10) / 10 : 0;
  const topModule = pickWeightedModule(rng);

  const members = podSellers.map(seller => {
    const mRng = seededRandom(`member-${seller.email}`);
    const sessionsThisWeek = randInt(mRng, 0, 15);
    const daysBack = randInt(mRng, 0, 13);
    const lastActiveDate = daysAgo(daysBack);
    // Add a random time of day
    lastActiveDate.setHours(randInt(mRng, 7, 18), randInt(mRng, 0, 59), 0, 0);

    const memberTopModule = pickWeightedModule(mRng);
    let engagementLevel;
    if (sessionsThisWeek >= 8) engagementLevel = 'high';
    else if (sessionsThisWeek >= 3) engagementLevel = 'medium';
    else engagementLevel = 'low';

    return {
      email: seller.email,
      fullName: seller.fullName,
      title: seller.title,
      lastActive: formatISO(lastActiveDate),
      sessionsThisWeek,
      topModule: memberTopModule,
      topModuleLabel: MODULE_LABELS[memberTopModule],
      engagementLevel,
    };
  });

  // Sort by sessions descending
  members.sort((a, b) => b.sessionsThisWeek - a.sessionsThisWeek);

  return {
    podId,
    podName: pod.name,
    leaderName: leader ? leader.fullName : 'Unknown',
    leaderEmail: pod.leaderEmail,
    memberCount,
    activeThisWeek,
    totalSessions,
    avgPerMember,
    topModule,
    topModuleLabel: MODULE_LABELS[topModule],
    members,
  };
}

/**
 * Detailed seller profile data for the individual drill-down view.
 */
export function getMockSellerDetail(email) {
  const user = USERS.find(u => u.email === email);
  if (!user) return null;

  const rng = seededRandom(`seller-${email}`);

  const totalSessions = randInt(rng, 50, 200);
  const streak = randInt(rng, 1, 30);
  const avgPerWeek = Math.round((2 + rng() * 10) * 10) / 10; // 2.0 - 12.0

  // Module breakdown
  const moduleBreakdown = generateModuleBreakdown(rng, totalSessions);

  // Recent sessions (last 10)
  const recentSessions = [];
  for (let i = 0; i < 10; i++) {
    const sessionDate = daysAgo(i);
    // Vary time of day
    sessionDate.setHours(randInt(rng, 7, 19), randInt(rng, 0, 59), randInt(rng, 0, 59), 0);
    const mod = pickWeightedModule(rng);
    const categories = MODULE_CATEGORIES[mod];
    const category = pickOne(rng, categories);
    const duration = randInt(rng, 30, 900); // 30s to 15min

    recentSessions.push({
      date: formatISO(sessionDate),
      module: mod,
      moduleLabel: MODULE_LABELS[mod],
      moduleColor: MODULE_COLORS[mod],
      category,
      duration,
    });
  }

  // Weekly activity (last 14 days)
  const weeklyActivity = [];
  for (let i = 13; i >= 0; i--) {
    const d = daysAgo(i);
    const weekday = isWeekday(d);
    // Weekdays get more activity; weekends much less
    const maxSessions = weekday ? 8 : 2;
    const baseChance = weekday ? 0.75 : 0.25;
    const active = rng() < baseChance;
    const sessions = active ? randInt(rng, 1, maxSessions) : 0;

    weeklyActivity.push({
      date: formatISO(d),
      dateLabel: formatShortDate(d),
      sessions,
    });
  }

  return {
    email: user.email,
    fullName: user.fullName,
    title: user.title,
    role: user.role,
    podId: user.podId,
    podName: PODS.find(p => p.id === user.podId)?.name || 'Unassigned',
    totalSessions,
    streak,
    avgPerWeek,
    moduleBreakdown,
    recentSessions,
    weeklyActivity,
  };
}

/**
 * Activity chart data for a given number of recent days.
 * Returns an array suitable for charting: { date, dateLabel, sessions }.
 */
export function getMockActivityChart(days = 14) {
  const rng = seededRandom(`activity-chart-${days}`);
  const data = [];

  for (let i = days - 1; i >= 0; i--) {
    const d = daysAgo(i);
    const weekday = isWeekday(d);
    // Org-wide sessions per day
    const baseSessions = weekday ? randInt(rng, 18, 45) : randInt(rng, 2, 12);
    data.push({
      date: formatISO(d),
      dateLabel: formatShortDate(d),
      sessions: baseSessions,
    });
  }

  return data;
}

/**
 * Org-wide module usage breakdown (percentages).
 * Returns object keyed by module id with percentage values and metadata.
 */
export function getMockModuleBreakdown() {
  return Object.entries(MODULE_WEIGHTS).map(([mod, pct]) => ({
    module: mod,
    label: MODULE_LABELS[mod],
    color: MODULE_COLORS[mod],
    percentage: pct,
  }));
}

// ---------------------------------------------------------------------------
// Re-export constants for consumers that need them
// ---------------------------------------------------------------------------

export { MODULE_LABELS, MODULE_COLORS, MODULE_WEIGHTS, MODULE_CATEGORIES, MODULES };
