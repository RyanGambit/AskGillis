import { useState, useMemo, useEffect } from 'react';
import { G } from '../constants/colors.js';
import { PODS } from '../data/userSeed.js';
import { getMockPodStats, getMockActivityChart, MODULE_LABELS, MODULE_COLORS } from '../data/mockDashboardData.js';
import { getPodDashboardData, TOPIC_LABELS } from '../lib/dashboardQueries.js';
import { useIsMobile } from '../hooks/useIsMobile.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function relativeTimeLabel(isoString) {
  if (!isoString) return 'Never';
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}

const ENGAGEMENT_DOT = {
  high: '#22c55e',
  medium: '#eab308',
  low: '#ef4444',
};

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function StatCard({ label, value, subtitle, accentColor, accentBg }) {
  return (
    <div style={{
      flex: '1 1 0',
      minWidth: 150,
      background: G.white,
      borderRadius: 12,
      padding: '18px 20px',
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      border: `1px solid ${G.borderLight}`,
    }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: G.muted, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
        {label}
      </div>
      <div style={{ fontSize: 26, fontWeight: 700, color: accentColor || G.dark, lineHeight: 1.1 }}>
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
        Activity (Last 14 Days)
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

function TeamTable({ rows, onSellerClick, isMobile }) {
  // Mobile: render as card list instead of table
  if (isMobile) {
    return (
      <div style={{ background: G.white, borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: `1px solid ${G.borderLight}`, overflow: 'hidden' }}>
        <div style={{ padding: '14px 16px 10px', fontSize: 14, fontWeight: 700, color: G.dark }}>Team Members</div>
        {rows.map(row => (
          <div
            key={row.email}
            onClick={() => onSellerClick && onSellerClick(row.email)}
            style={{
              padding: '12px 16px',
              borderTop: `1px solid ${G.borderLight}`,
              cursor: onSellerClick ? 'pointer' : 'default',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <span style={{
              display: 'inline-block',
              width: 10, height: 10,
              borderRadius: '50%',
              background: ENGAGEMENT_DOT[row.engagementLevel] || ENGAGEMENT_DOT.low,
              flexShrink: 0,
            }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: G.dark, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.fullName}</div>
              <div style={{ fontSize: 11, color: G.muted, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <span>{relativeTimeLabel(row.lastActive)}</span>
                <span>·</span>
                <span><strong style={{color: G.dark}}>{row.sessionsThisWeek}</strong> sessions</span>
                {row.topModule && <>
                  <span>·</span>
                  <span style={{color: MODULE_COLORS[row.topModule] || G.muted, fontWeight: 600}}>{row.topModuleLabel || MODULE_LABELS[row.topModule] || row.topModule}</span>
                </>}
              </div>
            </div>
          </div>
        ))}
        {rows.length === 0 && (
          <div style={{ padding: 24, textAlign: 'center', color: G.muted, fontSize: 13, borderTop: `1px solid ${G.borderLight}` }}>No team members found</div>
        )}
      </div>
    );
  }
  return (
    <div style={{
      background: G.white,
      borderRadius: 12,
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      border: `1px solid ${G.borderLight}`,
      overflow: 'hidden',
    }}>
      <div style={{ padding: '16px 20px 12px', fontSize: 14, fontWeight: 700, color: G.dark }}>
        Team Members
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${G.borderLight}` }}>
              {['Name', 'Last Active', 'Sessions', 'Top Module', 'Engagement'].map(h => (
                <th key={h} style={{
                  textAlign: 'left',
                  padding: '8px 16px',
                  fontSize: 11,
                  fontWeight: 600,
                  color: G.muted,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  whiteSpace: 'nowrap',
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <tr
                key={row.email}
                onClick={() => onSellerClick && onSellerClick(row.email)}
                style={{
                  borderBottom: `1px solid ${G.borderLight}`,
                  cursor: onSellerClick ? 'pointer' : 'default',
                  transition: 'background 0.1s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = G.bg}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ padding: '10px 16px', fontWeight: 500, color: G.dark }}>
                  {row.fullName}
                </td>
                <td style={{ padding: '10px 16px', color: G.muted }}>
                  {relativeTimeLabel(row.lastActive)}
                </td>
                <td style={{ padding: '10px 16px', fontWeight: 600, color: G.dark }}>
                  {row.sessionsThisWeek}
                </td>
                <td style={{ padding: '10px 16px' }}>
                  <span style={{
                    display: 'inline-block',
                    padding: '2px 10px',
                    borderRadius: 12,
                    fontSize: 11,
                    fontWeight: 600,
                    color: MODULE_COLORS[row.topModule] || G.muted,
                    background: (MODULE_COLORS[row.topModule] || G.muted) + '18',
                  }}>
                    {row.topModuleLabel || MODULE_LABELS[row.topModule] || row.topModule}
                  </span>
                </td>
                <td style={{ padding: '10px 16px' }}>
                  <span style={{
                    display: 'inline-block',
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: ENGAGEMENT_DOT[row.engagementLevel] || ENGAGEMENT_DOT.low,
                  }} title={row.engagementLevel} />
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: 24, textAlign: 'center', color: G.muted }}>
                  No team members found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SubPodSection({ subPodIds, onSellerClick }) {
  const [expanded, setExpanded] = useState(false);

  const subPods = useMemo(() => {
    return subPodIds.map(id => getMockPodStats(id)).filter(Boolean);
  }, [subPodIds]);

  if (subPods.length === 0) return null;

  return (
    <div style={{
      background: G.white,
      borderRadius: 12,
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      border: `1px solid ${G.borderLight}`,
      overflow: 'hidden',
    }}>
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: '100%',
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: 14,
          fontWeight: 700,
          color: G.dark,
        }}
      >
        <span>Sub-Pods ({subPods.length})</span>
        <span style={{
          fontSize: 18,
          color: G.muted,
          transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.2s',
        }}>
          &#9662;
        </span>
      </button>
      {expanded && (
        <div style={{ padding: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {subPods.map(sp => (
            <div key={sp.podId} style={{
              background: G.bg,
              borderRadius: 10,
              padding: 16,
              border: `1px solid ${G.borderLight}`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: G.dark }}>{sp.podName}</div>
                  <div style={{ fontSize: 11, color: G.muted }}>Led by {sp.leaderName}</div>
                </div>
                <div style={{
                  padding: '3px 10px',
                  borderRadius: 12,
                  fontSize: 11,
                  fontWeight: 600,
                  background: G.purpleLight,
                  color: G.purple,
                }}>
                  {sp.memberCount} members
                </div>
              </div>
              <div style={{ display: 'flex', gap: 16, fontSize: 12 }}>
                <div>
                  <span style={{ color: G.muted }}>Active: </span>
                  <span style={{ fontWeight: 600, color: G.teal }}>{sp.activeThisWeek}/{sp.memberCount}</span>
                </div>
                <div>
                  <span style={{ color: G.muted }}>Sessions: </span>
                  <span style={{ fontWeight: 600, color: G.purple }}>{sp.totalSessions}</span>
                </div>
                <div>
                  <span style={{ color: G.muted }}>Top: </span>
                  <span style={{ fontWeight: 600, color: MODULE_COLORS[sp.topModule] || G.muted }}>
                    {sp.topModuleLabel}
                  </span>
                </div>
              </div>
              {/* Mini member list */}
              <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 2 }}>
                {sp.members.slice(0, 5).map(m => (
                  <div
                    key={m.email}
                    onClick={() => onSellerClick && onSellerClick(m.email)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '4px 8px',
                      borderRadius: 6,
                      cursor: 'pointer',
                      fontSize: 12,
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = G.white}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <span style={{ color: G.text }}>{m.fullName}</span>
                    <span style={{ fontWeight: 600, color: G.purple }}>{m.sessionsThisWeek}</span>
                  </div>
                ))}
                {sp.members.length > 5 && (
                  <div style={{ fontSize: 11, color: G.muted, paddingLeft: 8 }}>
                    +{sp.members.length - 5} more
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export default function LeaderDashboard({ profile, visiblePodIds, onSellerClick, onSwitchToSeller }) {
  const [timeRange, setTimeRange] = useState('This Week');
  const isMobile = useIsMobile();

  // Determine the leader's own pod
  const ownPodId = profile?.pod_id || (profile?.manages && profile.manages[0]) || '';

  // Try to fetch real Supabase data; fall back to mock when empty or unavailable
  const [liveData, setLiveData] = useState(null);
  const [isLive, setIsLive] = useState(false);
  useEffect(() => {
    let cancelled = false;
    getPodDashboardData(visiblePodIds || [ownPodId]).then(result => {
      if (cancelled) return;
      if (result.source === 'supabase' && result.data && result.data.totalSessions > 0) {
        setLiveData(result.data);
        setIsLive(true);
      } else {
        setIsLive(false);
      }
    });
    return () => { cancelled = true; };
  }, [ownPodId, visiblePodIds]);

  // Derive pod display: real if we have data, otherwise mock
  const mockPodStats = useMemo(() => getMockPodStats(ownPodId), [ownPodId]);
  const podStats = isLive && liveData ? {
    podName: mockPodStats?.podName || PODS.find(p => p.id === ownPodId)?.name || 'Pod',
    leaderName: mockPodStats?.leaderName || profile?.full_name || 'Leader',
    memberCount: liveData.memberCount,
    activeThisWeek: liveData.activeThisWeek,
    totalSessions: liveData.totalSessions,
    avgPerMember: liveData.avgPerMember,
    topModule: liveData.topModule,
    members: liveData.members,
    topTopics: liveData.topTopics,
  } : mockPodStats;

  const chartData = isLive && liveData ? liveData.activityChart : getMockActivityChart(14);

  // Sub-pods: any visible pod that isn't the leader's own
  const subPodIds = useMemo(() => {
    if (!visiblePodIds) return [];
    return visiblePodIds.filter(id => id !== ownPodId);
  }, [visiblePodIds, ownPodId]);

  if (!podStats) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: G.muted }}>
        No pod data available.
      </div>
    );
  }

  return (
    <div style={{ padding: isMobile ? '12px 14px' : '24px 32px', maxWidth: 1100, margin: '0 auto', fontFamily: 'inherit' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: isMobile ? 'flex-start' : 'center', justifyContent: 'space-between', marginBottom: isMobile ? 16 : 24, flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 12 : 0 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: isMobile ? 20 : 24, fontWeight: 700, color: G.dark, margin: 0 }}>
              {podStats.podName}
            </h1>
            <span style={{
              padding: '3px 10px',
              borderRadius: 12,
              fontSize: 12,
              fontWeight: 600,
              background: G.purpleLight,
              color: G.purple,
            }}>
              {podStats.memberCount} members
            </span>
          </div>
          <div style={{ fontSize: 13, color: G.muted, marginTop: 4 }}>Your Pod</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', width: isMobile ? '100%' : 'auto' }}>
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
      <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
        <StatCard
          label="Active Sellers"
          value={`${podStats.activeThisWeek}/${podStats.memberCount}`}
          accentColor={G.teal}
        />
        <StatCard
          label="Sessions This Week"
          value={podStats.totalSessions}
          accentColor={G.purple}
        />
        <StatCard
          label="Avg Per Seller"
          value={podStats.avgPerMember}
          accentColor={G.lilac}
        />
        <StatCard
          label="Top Module"
          value={podStats.topModuleLabel}
          accentColor={G.gold}
        />
      </div>

      {/* Activity Chart */}
      <div style={{ marginBottom: 24 }}>
        <ActivityChart data={chartData} />
      </div>

      {/* Team Table */}
      <div style={{ marginBottom: 24 }}>
        <TeamTable rows={podStats.members} onSellerClick={onSellerClick} isMobile={isMobile} />
      </div>

      {/* What your pod is asking about (topic buckets — no individual attribution) */}
      {podStats.topTopics && podStats.topTopics.length > 0 && (
        <div style={{ marginTop: 24, padding: '20px 24px', background: G.white, border: `1px solid ${G.border}`, borderRadius: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: G.dark, margin: 0 }}>What your pod is asking about</h3>
            <span style={{ fontSize: 10, color: G.muted, fontStyle: 'italic' }}>Aggregated — individual questions are private</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10 }}>
            {podStats.topTopics.map(t => {
              const label = TOPIC_LABELS[t.topic] || t.topic;
              return (
                <div key={t.topic} style={{ padding: '10px 14px', background: G.bg, border: `1px solid ${G.borderLight}`, borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
          Showing sample data. Real usage will appear here once your pod starts using the platform.
        </div>
      )}

      {/* Sub-Pods (if leader has visibility into child pods) */}
      {subPodIds.length > 0 && (
        <SubPodSection subPodIds={subPodIds} onSellerClick={onSellerClick} />
      )}
    </div>
  );
}
