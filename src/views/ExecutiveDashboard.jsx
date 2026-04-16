import { useState, useMemo, useEffect } from 'react';
import { G } from '../constants/colors.js';
import { USERS, PODS } from '../data/userSeed.js';
import { getOrgDashboardData, TOPIC_LABELS } from '../lib/dashboardQueries.js';
import {
  getMockOrgStats,
  getMockPodStats,
  getMockActivityChart,
  getMockModuleBreakdown,
  MODULE_LABELS,
  MODULE_COLORS,
} from '../data/mockDashboardData.js';

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function StatCard({ label, value, subtitle, accentColor }) {
  return (
    <div style={{
      flex: '1 1 0',
      minWidth: 140,
      background: G.white,
      borderRadius: 12,
      padding: '18px 20px',
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      border: `1px solid ${G.borderLight}`,
    }}>
      <div style={{
        fontSize: 11,
        fontWeight: 600,
        color: G.muted,
        marginBottom: 6,
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
      }}>
        {label}
      </div>
      <div style={{ fontSize: 24, fontWeight: 700, color: accentColor || G.dark, lineHeight: 1.1 }}>
        {value}
      </div>
      {subtitle && (
        <div style={{ fontSize: 12, color: G.muted, marginTop: 4 }}>{subtitle}</div>
      )}
    </div>
  );
}

function TimeRangeToggle({ selected, onChange }) {
  const options = ['This Week', 'This Month', 'All Time'];
  return (
    <div style={{ display: 'flex', gap: 4, background: G.bg, borderRadius: 8, padding: 3 }}>
      {options.map(opt => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          style={{
            padding: '6px 14px',
            fontSize: 12,
            fontWeight: 600,
            borderRadius: 6,
            border: 'none',
            cursor: 'pointer',
            background: selected === opt ? G.white : 'transparent',
            color: selected === opt ? G.purple : G.muted,
            boxShadow: selected === opt ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
            transition: 'all 0.15s',
          }}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

function ActivityChart({ data, maxHeight = 120 }) {
  const maxVal = Math.max(...data.map(d => d.sessions), 1);
  return (
    <div style={{
      background: G.white,
      borderRadius: 12,
      padding: '20px 24px',
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      border: `1px solid ${G.borderLight}`,
    }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: G.dark, marginBottom: 16 }}>
        Org Activity (Last 14 Days)
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: maxHeight }}>
        {data.map((d, i) => {
          const h = Math.max(4, (d.sessions / maxVal) * maxHeight);
          return (
            <div key={i} style={{ flex: '1 1 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{ fontSize: 10, color: G.muted, fontWeight: 600 }}>{d.sessions}</div>
              <div
                style={{
                  width: '100%',
                  maxWidth: 32,
                  height: h,
                  borderRadius: '4px 4px 0 0',
                  background: `linear-gradient(180deg, ${G.lilac} 0%, ${G.purple} 100%)`,
                  transition: 'height 0.3s',
                }}
                title={`${d.dateLabel}: ${d.sessions} sessions`}
              />
              <div style={{ fontSize: 9, color: G.dim, whiteSpace: 'nowrap' }}>
                {d.dateLabel.split(' ')[0]}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PodComparisonGrid({ pods, onPodClick }) {
  return (
    <div style={{
      background: G.white,
      borderRadius: 12,
      padding: '20px 24px',
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      border: `1px solid ${G.borderLight}`,
    }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: G.dark, marginBottom: 16 }}>
        Pod Overview
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14 }}>
        {pods.map(pod => (
          <div
            key={pod.podId}
            onClick={() => onPodClick && onPodClick(pod.podId)}
            style={{
              background: G.bg,
              borderRadius: 10,
              padding: 16,
              border: `1px solid ${G.borderLight}`,
              cursor: onPodClick ? 'pointer' : 'default',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = G.purpleBorder; e.currentTarget.style.boxShadow = '0 2px 8px rgba(61,43,107,0.08)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = G.borderLight; e.currentTarget.style.boxShadow = 'none'; }}
          >
            <div style={{ fontSize: 15, fontWeight: 700, color: G.dark, marginBottom: 4 }}>
              {pod.podName}
            </div>
            <div style={{ fontSize: 11, color: G.muted, marginBottom: 12 }}>
              Led by {pod.leaderName}
            </div>
            <div style={{ display: 'flex', gap: 10, fontSize: 12, flexWrap: 'wrap' }}>
              <div style={{
                padding: '3px 10px',
                borderRadius: 8,
                background: G.purpleLight,
                color: G.purple,
                fontWeight: 600,
              }}>
                {pod.memberCount} members
              </div>
              <div style={{
                padding: '3px 10px',
                borderRadius: 8,
                background: G.tealLight,
                color: G.tealDark,
                fontWeight: 600,
              }}>
                {pod.totalSessions} sessions
              </div>
              <div style={{
                padding: '3px 10px',
                borderRadius: 8,
                background: G.goldLight,
                color: G.gold,
                fontWeight: 600,
              }}>
                {pod.memberCount > 0 ? Math.round((pod.activeThisWeek / pod.memberCount) * 100) : 0}% engaged
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ModuleAdoption({ data }) {
  const maxSessions = Math.max(...data.map(d => d.percentage), 1);
  return (
    <div style={{
      background: G.white,
      borderRadius: 12,
      padding: '20px 24px',
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      border: `1px solid ${G.borderLight}`,
    }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: G.dark, marginBottom: 16 }}>
        Module Adoption
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {data.map(mod => (
          <div key={mod.module} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 120, fontSize: 12, fontWeight: 600, color: G.text, textAlign: 'right', flexShrink: 0 }}>
              {mod.label}
            </div>
            <div style={{ flex: 1, height: 22, background: G.bg, borderRadius: 6, overflow: 'hidden', position: 'relative' }}>
              <div style={{
                height: '100%',
                width: `${(mod.percentage / maxSessions) * 100}%`,
                background: mod.color,
                borderRadius: 6,
                transition: 'width 0.4s',
                minWidth: 2,
              }} />
            </div>
            <div style={{ width: 36, fontSize: 12, fontWeight: 600, color: G.muted, textAlign: 'right' }}>
              {mod.percentage}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EngagementLeaderboard({ onSellerClick }) {
  // Build leaderboard from all sellers
  const leaderboard = useMemo(() => {
    const allSellers = USERS.filter(u => u.role === 'seller');
    // Use pod stats to get sessions
    const sellerMap = new Map();
    PODS.forEach(pod => {
      const stats = getMockPodStats(pod.id);
      if (stats && stats.members) {
        stats.members.forEach(m => {
          if (!sellerMap.has(m.email) || m.sessionsThisWeek > sellerMap.get(m.email).sessionsThisWeek) {
            sellerMap.set(m.email, m);
          }
        });
      }
    });
    return Array.from(sellerMap.values())
      .sort((a, b) => b.sessionsThisWeek - a.sessionsThisWeek)
      .slice(0, 10);
  }, []);

  return (
    <div style={{
      background: G.white,
      borderRadius: 12,
      padding: '20px 24px',
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      border: `1px solid ${G.borderLight}`,
    }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: G.dark, marginBottom: 16 }}>
        Engagement Leaderboard (This Week)
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {leaderboard.map((seller, i) => {
          const rankColors = ['#D4A843', '#8a839a', '#CD7F32']; // gold, silver, bronze
          const rankColor = i < 3 ? rankColors[i] : G.dim;
          return (
            <div
              key={seller.email}
              onClick={() => onSellerClick && onSellerClick(seller.email)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '10px 12px',
                borderRadius: 8,
                cursor: onSellerClick ? 'pointer' : 'default',
                transition: 'background 0.1s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = G.bg}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              {/* Rank */}
              <div style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                fontWeight: 700,
                color: G.white,
                background: rankColor,
                flexShrink: 0,
              }}>
                {i + 1}
              </div>

              {/* Name */}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: G.dark }}>{seller.fullName}</div>
              </div>

              {/* Sessions */}
              <div style={{ fontSize: 14, fontWeight: 700, color: G.purple }}>
                {seller.sessionsThisWeek}
              </div>

              {/* Streak indicator */}
              {seller.sessionsThisWeek >= 5 && (
                <div style={{
                  fontSize: 10,
                  fontWeight: 600,
                  padding: '2px 8px',
                  borderRadius: 10,
                  background: G.orangeLight,
                  color: G.orange,
                }}>
                  On Fire
                </div>
              )}
              {seller.sessionsThisWeek >= 3 && seller.sessionsThisWeek < 5 && (
                <div style={{
                  fontSize: 10,
                  fontWeight: 600,
                  padding: '2px 8px',
                  borderRadius: 10,
                  background: G.tealLight,
                  color: G.tealDark,
                }}>
                  Steady
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export default function ExecutiveDashboard({ profile, onPodClick, onSellerClick, onSwitchToSeller }) {
  const [timeRange, setTimeRange] = useState('This Week');

  // Try real Supabase data first
  const [liveData, setLiveData] = useState(null);
  const [isLive, setIsLive] = useState(false);
  useEffect(() => {
    let cancelled = false;
    getOrgDashboardData().then(result => {
      if (cancelled) return;
      if (result.source === 'supabase' && result.data && result.data.totalSessions > 0) {
        setLiveData(result.data);
        setIsLive(true);
      } else {
        setIsLive(false);
      }
    });
    return () => { cancelled = true; };
  }, []);

  const mockOrgStats = useMemo(() => getMockOrgStats(), []);
  const orgStats = isLive && liveData ? {
    totalSellers: liveData.totalSellers,
    activeThisWeek: liveData.activeThisWeek,
    totalSessionsThisWeek: liveData.totalSessions,
    avgPerSeller: liveData.avgPerSeller,
    mostActivePod: PODS.find(p => p.id === liveData.mostActivePodId)?.name || '—',
    trendingModule: liveData.trendingModule,
  } : mockOrgStats;
  const chartData = isLive && liveData ? liveData.activityChart : getMockActivityChart(14);
  const moduleData = isLive && liveData ? liveData.moduleBreakdown.map(m => ({
    module: m.module,
    label: m.module,
    percentage: m.percentage,
  })) : getMockModuleBreakdown();

  // Top-level pods: real data if available, mock otherwise
  const topLevelPods = useMemo(() => {
    return PODS
      .filter(p => !p.parentPodId && p.id !== 'executive_team')
      .map(p => getMockPodStats(p.id))
      .filter(Boolean);
  }, []);

  const totalUsers = USERS.filter(u => u.role !== 'none').length;

  return (
    <div style={{ padding: '24px 32px', maxWidth: 1200, margin: '0 auto', fontFamily: 'inherit' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: G.dark, margin: 0 }}>
            Gillis Sales Organization
          </h1>
          <div style={{ fontSize: 13, color: G.muted, marginTop: 4 }}>
            {totalUsers} active users across {PODS.length} pods
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <TimeRangeToggle selected={timeRange} onChange={setTimeRange} />
          {onSwitchToSeller && (
            <button
              onClick={onSwitchToSeller}
              style={{
                padding: '8px 18px',
                fontSize: 13,
                fontWeight: 600,
                borderRadius: 8,
                border: `1px solid ${G.purpleBorder}`,
                background: G.purpleLight,
                color: G.purple,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = G.purple; e.currentTarget.style.color = G.white; }}
              onMouseLeave={e => { e.currentTarget.style.background = G.purpleLight; e.currentTarget.style.color = G.purple; }}
            >
              Seller Mode
            </button>
          )}
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'flex', gap: 14, marginBottom: 24, flexWrap: 'wrap' }}>
        <StatCard
          label="Active Sellers"
          value={`${orgStats.activeSellersThisWeek}/${orgStats.totalSellers}`}
          accentColor={G.teal}
        />
        <StatCard
          label="Sessions This Week"
          value={orgStats.totalSessionsThisWeek}
          accentColor={G.purple}
        />
        <StatCard
          label="Avg Per Seller"
          value={orgStats.avgPerSeller}
          accentColor={G.lilac}
        />
        <StatCard
          label="Most Active Pod"
          value={orgStats.mostActivePod}
          accentColor={G.gold}
        />
        <StatCard
          label="Trending Module"
          value={orgStats.trendingModule}
          accentColor={G.orange}
        />
      </div>

      {/* Pod Comparison Grid */}
      <div style={{ marginBottom: 24 }}>
        <PodComparisonGrid pods={topLevelPods} onPodClick={onPodClick} />
      </div>

      {/* Activity Chart + Module Adoption side by side on wide screens */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        <ActivityChart data={chartData} />
        <ModuleAdoption data={moduleData} />
      </div>

      {/* Training Gaps / Topics across org (aggregated — no attribution) */}
      {isLive && liveData?.topTopics?.length > 0 && (
        <div style={{ marginTop: 24, padding: '20px 24px', background: G.white, border: `1px solid ${G.border}`, borderRadius: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: G.dark, margin: 0 }}>Training Gaps — What Sellers Are Asking About</h3>
            <span style={{ fontSize: 10, color: G.muted, fontStyle: 'italic' }}>Aggregated across all pods</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 10 }}>
            {liveData.topTopics.map(t => {
              const label = TOPIC_LABELS[t.topic] || t.topic;
              return (
                <div key={t.topic} style={{ padding: '12px 14px', background: G.bg, border: `1px solid ${G.borderLight}`, borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 13, color: G.text }}>{label}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: G.teal }}>{t.count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {!isLive && (
        <div style={{ marginTop: 16, padding: '10px 14px', background: '#FDF8EC', border: `1px solid #E8D49C`, borderRadius: 8, fontSize: 12, color: G.text }}>
          Showing sample data. Real usage will appear here once sellers start using the platform.
        </div>
      )}

      {/* Engagement Leaderboard */}
      <EngagementLeaderboard onSellerClick={onSellerClick} />
    </div>
  );
}
