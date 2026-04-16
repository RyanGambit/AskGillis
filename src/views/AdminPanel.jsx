import { useState, useMemo } from 'react';
import { G } from '../constants/colors.js';
import { USERS, PODS } from '../data/userSeed.js';
import { useIsMobile } from '../hooks/useIsMobile.js';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const ROLE_BADGE = {
  executive: { bg: G.purpleLight, color: G.purple, border: G.purpleBorder },
  leader:    { bg: G.tealLight,   color: G.tealDark, border: G.tealBorder },
  seller:    { bg: G.lilacLight,  color: G.lilac,    border: G.lilacBorder },
  admin:     { bg: G.goldLight,   color: G.gold,     border: G.goldBorder },
  none:      { bg: G.bg,          color: G.muted,    border: G.border },
};

const TABS = ['Users', 'Pods'];

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function RoleBadge({ role }) {
  const style = ROLE_BADGE[role] || ROLE_BADGE.none;
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 10px',
      borderRadius: 12,
      fontSize: 11,
      fontWeight: 600,
      color: style.color,
      background: style.bg,
      border: `1px solid ${style.border}`,
      textTransform: 'capitalize',
    }}>
      {role}
    </span>
  );
}

function TabBar({ active, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 4, background: G.bg, borderRadius: 8, padding: 3, marginBottom: 20 }}>
      {TABS.map(tab => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          style={{
            padding: '8px 20px',
            fontSize: 13,
            fontWeight: 600,
            borderRadius: 6,
            border: 'none',
            cursor: 'pointer',
            background: active === tab ? G.white : 'transparent',
            color: active === tab ? G.purple : G.muted,
            boxShadow: active === tab ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
            transition: 'all 0.15s',
          }}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

function UsersTable({ users, sortField, onSort }) {
  const podMap = useMemo(() => {
    const m = {};
    PODS.forEach(p => { m[p.id] = p.name; });
    return m;
  }, []);

  const sortedUsers = useMemo(() => {
    const copy = [...users];
    if (sortField === 'role') {
      const order = { executive: 0, leader: 1, admin: 2, seller: 3, none: 4 };
      copy.sort((a, b) => (order[a.role] || 99) - (order[b.role] || 99));
    }
    return copy;
  }, [users, sortField]);

  const headerStyle = (field) => ({
    textAlign: 'left',
    padding: '10px 14px',
    fontSize: 11,
    fontWeight: 600,
    color: G.muted,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    whiteSpace: 'nowrap',
    cursor: field ? 'pointer' : 'default',
    userSelect: 'none',
  });

  return (
    <div style={{
      background: G.white,
      borderRadius: 12,
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      border: `1px solid ${G.borderLight}`,
      overflow: 'hidden',
    }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${G.borderLight}` }}>
              <th style={headerStyle()}>Name</th>
              <th style={headerStyle()}>Email</th>
              <th
                style={headerStyle('role')}
                onClick={() => onSort('role')}
              >
                Role {sortField === 'role' ? ' \u2193' : ''}
              </th>
              <th style={headerStyle()}>Pod</th>
              <th style={headerStyle()}>Title</th>
            </tr>
          </thead>
          <tbody>
            {sortedUsers.map(u => (
              <tr
                key={u.email}
                style={{ borderBottom: `1px solid ${G.borderLight}` }}
              >
                <td style={{ padding: '10px 14px', fontWeight: 500, color: G.dark }}>
                  {u.fullName}
                </td>
                <td style={{ padding: '10px 14px', color: G.text, fontSize: 12 }}>
                  {u.email}
                </td>
                <td style={{ padding: '10px 14px' }}>
                  <RoleBadge role={u.role} />
                </td>
                <td style={{ padding: '10px 14px', color: G.text }}>
                  {podMap[u.podId] || '\u2014'}
                </td>
                <td style={{ padding: '10px 14px', color: G.muted, fontSize: 12 }}>
                  {u.title}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ padding: '10px 16px', fontSize: 12, color: G.muted, borderTop: `1px solid ${G.borderLight}` }}>
        {sortedUsers.length} users
      </div>
    </div>
  );
}

function PodsTable() {
  const podData = useMemo(() => {
    return PODS.map(pod => {
      const leader = USERS.find(u => u.email === pod.leaderEmail);
      const memberCount = USERS.filter(u => u.podId === pod.id && u.role === 'seller').length;
      const parentPod = pod.parentPodId ? PODS.find(p => p.id === pod.parentPodId) : null;
      return {
        id: pod.id,
        name: pod.name,
        leaderName: leader ? leader.fullName : '\u2014',
        memberCount,
        parentPodName: parentPod ? parentPod.name : '\u2014',
      };
    });
  }, []);

  const headerStyle = {
    textAlign: 'left',
    padding: '10px 14px',
    fontSize: 11,
    fontWeight: 600,
    color: G.muted,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    whiteSpace: 'nowrap',
  };

  return (
    <div style={{
      background: G.white,
      borderRadius: 12,
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      border: `1px solid ${G.borderLight}`,
      overflow: 'hidden',
    }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${G.borderLight}` }}>
              <th style={headerStyle}>Pod Name</th>
              <th style={headerStyle}>Leader</th>
              <th style={headerStyle}>Member Count</th>
              <th style={headerStyle}>Parent Pod</th>
            </tr>
          </thead>
          <tbody>
            {podData.map(pod => (
              <tr key={pod.id} style={{ borderBottom: `1px solid ${G.borderLight}` }}>
                <td style={{ padding: '10px 14px', fontWeight: 600, color: G.dark }}>
                  {pod.name}
                </td>
                <td style={{ padding: '10px 14px', color: G.text }}>
                  {pod.leaderName}
                </td>
                <td style={{ padding: '10px 14px', color: G.text }}>
                  <span style={{
                    display: 'inline-block',
                    padding: '2px 10px',
                    borderRadius: 10,
                    fontSize: 12,
                    fontWeight: 600,
                    background: G.purpleLight,
                    color: G.purple,
                  }}>
                    {pod.memberCount}
                  </span>
                </td>
                <td style={{ padding: '10px 14px', color: G.muted }}>
                  {pod.parentPodName}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ padding: '10px 16px', fontSize: 12, color: G.muted, borderTop: `1px solid ${G.borderLight}` }}>
        {podData.length} pods
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export default function AdminPanel({ profile }) {
  const [activeTab, setActiveTab] = useState('Users');
  const [sortField, setSortField] = useState('role');
  const isMobile = useIsMobile();

  // Show only active users (role !== 'none')
  const activeUsers = useMemo(() => USERS.filter(u => u.role !== 'none'), []);

  return (
    <div style={{ padding: isMobile ? '12px 14px' : '24px 32px', maxWidth: 1100, margin: '0 auto', fontFamily: 'inherit' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: G.dark, margin: 0 }}>
          Platform Administration
        </h1>
        <div style={{ fontSize: 13, color: G.muted, marginTop: 4 }}>
          Manage users, pods, and platform settings
        </div>
      </div>

      {/* Tabs */}
      <TabBar active={activeTab} onChange={setActiveTab} />

      {/* Content */}
      {activeTab === 'Users' && (
        <UsersTable
          users={activeUsers}
          sortField={sortField}
          onSort={setSortField}
        />
      )}

      {activeTab === 'Pods' && <PodsTable />}

      {/* Footer note */}
      <div style={{
        marginTop: 24,
        padding: '14px 20px',
        background: G.goldLight,
        borderRadius: 10,
        border: `1px solid ${G.goldBorder}`,
        fontSize: 13,
        color: G.text,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}>
        <span style={{ fontSize: 18 }}>&#9432;</span>
        <span>
          Full editing capabilities coming soon. Contact Ryan for changes.
        </span>
      </div>
    </div>
  );
}
