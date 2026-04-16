import { useState, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useDevMode } from '../hooks/useDevMode.js';
import { USERS, PODS } from '../data/userSeed.js';

const G = {
  bg:"#F3F2F7", white:"#FFFFFF",
  purple:"#3D2B6B", purpleLight:"#F0EDFA", purpleBorder:"#D8D0ED", purpleDark:"#2d1f5e",
  teal:"#1ABBA6", tealLight:"#EEFBF9", tealBorder:"#B0E8E0", tealDark:"#0E8A7A",
  orange:"#E8875B", orangeLight:"#FFF4EE", orangeBorder:"#F5C9B0",
  gold:"#D4A843", goldLight:"#FDF8EC", goldBorder:"#E8D49C",
  lilac:"#7C6BC4", lilacLight:"#F0EDFA", lilacBorder:"#C4BBE8",
  dark:"#1e1832", text:"#4a4560", muted:"#8a839a", dim:"#b5b0c0",
  border:"#e4e1ec", borderLight:"#edeaf2",
};

const YELLOW = '#F59E0B';
const YELLOW_LIGHT = '#FFFBEB';
const YELLOW_BORDER = '#FDE68A';

const ROLES = ['executive', 'leader', 'seller', 'admin'];

export default function DevModeSwitcher() {
  const { isDevMode } = useDevMode();
  const { devSetProfile, devClearOverride, devOverride, profile } = useAuth();

  const [selectedRole, setSelectedRole] = useState('seller');
  const [selectedPod, setSelectedPod] = useState('');
  const [selectedEmail, setSelectedEmail] = useState('');
  const [collapsed, setCollapsed] = useState(false);

  const filteredUsers = useMemo(() => {
    let users = USERS.filter(u => u.role === selectedRole);
    if (selectedPod) {
      users = users.filter(u => u.podId === selectedPod);
    }
    return users;
  }, [selectedRole, selectedPod]);

  if (!isDevMode) return null;

  const handleApply = () => {
    if (selectedEmail) {
      devSetProfile(selectedEmail);
    }
  };

  const handleReset = () => {
    devClearOverride();
    setSelectedEmail('');
  };

  const selectStyle = {
    width: '100%',
    padding: '5px 8px',
    fontSize: 12,
    border: `1px solid ${YELLOW_BORDER}`,
    borderRadius: 6,
    background: G.white,
    color: G.text,
    outline: 'none',
    cursor: 'pointer',
  };

  const labelStyle = {
    fontSize: 10,
    fontWeight: 600,
    color: G.muted,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: 2,
  };

  if (collapsed) {
    return (
      <div
        onClick={() => setCollapsed(false)}
        style={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          zIndex: 9999,
          background: YELLOW,
          color: G.white,
          borderRadius: 8,
          padding: '6px 12px',
          fontSize: 11,
          fontWeight: 700,
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          letterSpacing: '0.05em',
        }}
      >
        DEV MODE
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: `max(16px, env(safe-area-inset-bottom))`,
      right: 16,
      left: 'auto',
      zIndex: 9999,
      width: 280,
      maxWidth: 'calc(100vw - 32px)',
      background: G.white,
      border: `2px solid ${YELLOW}`,
      borderRadius: 12,
      boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
      fontFamily: 'inherit',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        background: YELLOW_LIGHT,
        borderBottom: `1px solid ${YELLOW_BORDER}`,
        padding: '8px 12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: YELLOW, letterSpacing: '0.1em' }}>
          DEV MODE
        </span>
        <button
          onClick={() => setCollapsed(true)}
          style={{
            background: 'none',
            border: 'none',
            color: G.muted,
            cursor: 'pointer',
            fontSize: 16,
            lineHeight: 1,
            padding: 0,
          }}
        >
          &minus;
        </button>
      </div>

      <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* Role dropdown */}
        <div>
          <div style={labelStyle}>Role</div>
          <select
            value={selectedRole}
            onChange={e => { setSelectedRole(e.target.value); setSelectedEmail(''); }}
            style={selectStyle}
          >
            {ROLES.map(r => (
              <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
            ))}
          </select>
        </div>

        {/* Pod dropdown */}
        <div>
          <div style={labelStyle}>Pod</div>
          <select
            value={selectedPod}
            onChange={e => { setSelectedPod(e.target.value); setSelectedEmail(''); }}
            style={selectStyle}
          >
            <option value="">All Pods</option>
            {PODS.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        {/* User dropdown */}
        <div>
          <div style={labelStyle}>User</div>
          <select
            value={selectedEmail}
            onChange={e => setSelectedEmail(e.target.value)}
            style={selectStyle}
          >
            <option value="">Select user...</option>
            {filteredUsers.map(u => (
              <option key={u.email} value={u.email}>
                {u.fullName} ({u.email.split('@')[0]})
              </option>
            ))}
          </select>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 6 }}>
          <button
            onClick={handleApply}
            disabled={!selectedEmail}
            style={{
              flex: 1,
              padding: '6px 0',
              fontSize: 12,
              fontWeight: 600,
              background: selectedEmail ? YELLOW : G.border,
              color: selectedEmail ? '#fff' : G.muted,
              border: 'none',
              borderRadius: 6,
              cursor: selectedEmail ? 'pointer' : 'not-allowed',
            }}
          >
            Apply
          </button>
          <button
            onClick={handleReset}
            style={{
              flex: 1,
              padding: '6px 0',
              fontSize: 12,
              fontWeight: 600,
              background: G.bg,
              color: G.text,
              border: `1px solid ${G.border}`,
              borderRadius: 6,
              cursor: 'pointer',
            }}
          >
            Reset
          </button>
        </div>

        {/* Current override label */}
        {devOverride && (
          <div style={{
            fontSize: 10,
            color: YELLOW,
            fontWeight: 600,
            background: YELLOW_LIGHT,
            padding: '4px 8px',
            borderRadius: 4,
            textAlign: 'center',
          }}>
            Viewing as: {devOverride.full_name} ({devOverride.role})
          </div>
        )}
      </div>
    </div>
  );
}
