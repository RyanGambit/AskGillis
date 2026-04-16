import { supabase } from './supabase.js';

// All dashboard queries go through this file.
// Privacy rule (per Tammy's April 10 call):
// - Leaders see aggregated data for their pod only, never individual attribution + question content
// - Executives see the same aggregation across all pods, with optional pod filter
// - Raw session messages are NEVER returned to dashboards
//
// Returns shape:
// {
//   source: 'supabase' | 'mock' | 'error',
//   data: { ... } | null,
//   error: string | null,
// }

function daysAgo(n) {
  return new Date(Date.now() - n * 864e5).toISOString();
}

/**
 * Pod-level stats for a leader.
 * Returns aggregated numbers — never individual user_id alongside question content.
 *
 * @param {string[]} podIds - pods the leader has visibility into
 * @returns {Promise<{source, data, error}>}
 */
export async function getPodDashboardData(podIds) {
  if (!supabase || !podIds || podIds.length === 0) {
    return { source: 'mock', data: null, error: null };
  }

  try {
    // Stats row: active sellers, total sessions, avg per seller, top module
    const weekAgo = daysAgo(7);

    // Query engagement per seller in visible pods (attribution OK — it's activity level, not question content)
    const { data: engagement, error: engErr } = await supabase
      .from('seller_engagement')
      .select('*')
      .in('pod_id', podIds);

    if (engErr) throw engErr;

    // Query topic aggregates (NO attribution — just counts)
    const { data: topics, error: topErr } = await supabase
      .from('session_pod_aggregates')
      .select('*')
      .in('pod_id', podIds)
      .gte('day', weekAgo);

    if (topErr) throw topErr;

    // Aggregate stats
    const sellers = engagement || [];
    const activeThisWeek = sellers.filter(s => (s.sessions_week || 0) > 0).length;
    const totalSessions = (topics || []).reduce((a, t) => a + t.session_count, 0);
    const avgPerSeller = sellers.length ? (totalSessions / sellers.length).toFixed(1) : 0;

    // Top module
    const moduleCounts = {};
    (topics || []).forEach(t => {
      moduleCounts[t.module] = (moduleCounts[t.module] || 0) + t.session_count;
    });
    const topModule = Object.entries(moduleCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || null;

    // Top topics (for "what your pod is asking about" — aggregated, no attribution)
    const topicCounts = {};
    (topics || []).forEach(t => {
      if (t.topic) topicCounts[t.topic] = (topicCounts[t.topic] || 0) + t.session_count;
    });
    const topTopics = Object.entries(topicCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([topic, count]) => ({ topic, count }));

    // 14-day activity (aggregated count per day, no attribution)
    const byDay = {};
    const twoWeeksAgo = daysAgo(14);
    const { data: dailyAgg, error: dayErr } = await supabase
      .from('session_pod_aggregates')
      .select('day, session_count')
      .in('pod_id', podIds)
      .gte('day', twoWeeksAgo);
    if (dayErr) throw dayErr;

    (dailyAgg || []).forEach(d => {
      const dayKey = d.day.slice(0, 10);
      byDay[dayKey] = (byDay[dayKey] || 0) + d.session_count;
    });

    const activityChart = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date(Date.now() - i * 864e5);
      const key = d.toISOString().slice(0, 10);
      activityChart.push({
        date: d,
        dateLabel: d.toLocaleDateString('en-US', { weekday: 'short' }),
        sessions: byDay[key] || 0,
      });
    }

    // Seller table — attribution OK here since it's only sessionsCount/lastActive/topModule
    // (no question content attached to individual user)
    const memberRows = sellers.map(s => ({
      email: s.email,
      fullName: s.full_name,
      sessionsThisWeek: s.sessions_week || 0,
      sessionsMonth: s.sessions_month || 0,
      lastActive: s.last_active,
      topModule: s.top_module,
      engagementLevel:
        (s.sessions_week || 0) >= 5 ? 'high' :
        (s.sessions_week || 0) >= 2 ? 'medium' : 'low',
    })).sort((a, b) => b.sessionsThisWeek - a.sessionsThisWeek);

    return {
      source: 'supabase',
      data: {
        memberCount: sellers.length,
        activeThisWeek,
        totalSessions,
        avgPerMember: parseFloat(avgPerSeller),
        topModule,
        topTopics,
        activityChart,
        members: memberRows,
      },
      error: null,
    };
  } catch (error) {
    console.error('Pod dashboard query failed:', error);
    return { source: 'error', data: null, error: error.message };
  }
}

/**
 * Org-wide stats for executives.
 * Same structure as pod dashboard but across all pods.
 * Includes per-pod breakdown for the pod comparison grid.
 */
export async function getOrgDashboardData() {
  if (!supabase) return { source: 'mock', data: null, error: null };

  try {
    const weekAgo = daysAgo(7);

    const { data: engagement, error: engErr } = await supabase
      .from('seller_engagement')
      .select('*');
    if (engErr) throw engErr;

    const { data: orgAgg, error: orgErr } = await supabase
      .from('session_org_aggregates')
      .select('*')
      .gte('day', weekAgo);
    if (orgErr) throw orgErr;

    const sellers = engagement || [];
    const activeThisWeek = sellers.filter(s => (s.sessions_week || 0) > 0).length;
    const totalSessions = (orgAgg || []).reduce((a, t) => a + t.session_count, 0);
    const avgPerSeller = sellers.length ? (totalSessions / sellers.length).toFixed(1) : 0;

    // Top module org-wide
    const moduleCounts = {};
    (orgAgg || []).forEach(t => {
      moduleCounts[t.module] = (moduleCounts[t.module] || 0) + t.session_count;
    });
    const moduleTotal = Object.values(moduleCounts).reduce((a, b) => a + b, 0) || 1;
    const moduleBreakdown = Object.entries(moduleCounts)
      .map(([module, count]) => ({
        module,
        count,
        percentage: Math.round((count / moduleTotal) * 100),
      }))
      .sort((a, b) => b.count - a.count);
    const trendingModule = moduleBreakdown[0]?.module || null;

    // Top topics org-wide (aggregated, no attribution)
    const topicCounts = {};
    (orgAgg || []).forEach(t => {
      if (t.topic) topicCounts[t.topic] = (topicCounts[t.topic] || 0) + t.session_count;
    });
    const topTopics = Object.entries(topicCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([topic, count]) => ({ topic, count }));

    // Per-pod breakdown (for the pod comparison grid)
    // Query the pod aggregate view without pod filter — executives see all pods
    const { data: podBreakdown, error: podErr } = await supabase
      .from('session_pod_aggregates')
      .select('pod_id, session_count, unique_sellers')
      .gte('day', weekAgo);
    if (podErr) throw podErr;

    const podStats = {};
    (podBreakdown || []).forEach(row => {
      if (!row.pod_id) return;
      if (!podStats[row.pod_id]) podStats[row.pod_id] = { sessions: 0, sellers: new Set() };
      podStats[row.pod_id].sessions += row.session_count;
    });
    // Most active pod
    const pods = Object.entries(podStats);
    const mostActivePodId = pods.sort((a, b) => b[1].sessions - a[1].sessions)[0]?.[0] || null;

    // Engagement leaderboard (top 10 sellers) — attribution OK here, it's just activity counts
    const topSellers = [...sellers]
      .sort((a, b) => (b.sessions_week || 0) - (a.sessions_week || 0))
      .slice(0, 10)
      .map(s => ({
        fullName: s.full_name,
        email: s.email,
        sessionsThisWeek: s.sessions_week || 0,
        podId: s.pod_id,
      }));

    // 14-day activity chart
    const twoWeeksAgo = daysAgo(14);
    const { data: dailyAgg, error: dayErr } = await supabase
      .from('session_org_aggregates')
      .select('day, session_count')
      .gte('day', twoWeeksAgo);
    if (dayErr) throw dayErr;

    const byDay = {};
    (dailyAgg || []).forEach(d => {
      const key = d.day.slice(0, 10);
      byDay[key] = (byDay[key] || 0) + d.session_count;
    });
    const activityChart = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date(Date.now() - i * 864e5);
      const key = d.toISOString().slice(0, 10);
      activityChart.push({
        date: d,
        dateLabel: d.toLocaleDateString('en-US', { weekday: 'short' }),
        sessions: byDay[key] || 0,
      });
    }

    return {
      source: 'supabase',
      data: {
        totalSellers: sellers.length,
        activeThisWeek,
        totalSessions,
        avgPerSeller: parseFloat(avgPerSeller),
        mostActivePodId,
        trendingModule,
        moduleBreakdown,
        topTopics,
        podStats,
        activityChart,
        topSellers,
      },
      error: null,
    };
  } catch (error) {
    console.error('Org dashboard query failed:', error);
    return { source: 'error', data: null, error: error.message };
  }
}

// Human-readable labels for topic buckets (used in dashboards)
export const TOPIC_LABELS = {
  objection_handling:    'Objection handling',
  prospecting:           'Prospecting',
  call_prep:             'Call prep',
  follow_up:             'Follow-up',
  role_play:             'Role play',
  account_management:    'Account management',
  email_drafting:        'Email drafting',
  rfp:                   'RFP response',
  confidence_motivation: 'Confidence & motivation',
  methodology:           'Methodology',
  brand_specific:        'Brand-specific',
  linkedin_social:       'LinkedIn & social',
  weekly_planning:       'Weekly planning',
  onboarding:            'Onboarding',
  operations:            'Operations',
  general:               'General',
};
