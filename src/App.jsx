import { useState, useRef, useEffect, useMemo } from "react";
import { SYSTEM_PROMPT } from "./prompt.js";
import { KNOWLEDGE_BASE } from "./knowledgebase.js";
import { OPERATIONAL_KB } from "./operational-kb.js";
import { useAuth } from "./contexts/AuthContext.jsx";
import { G } from "./constants/colors.js";
import { MODULES, MODE_PROMPTS } from "./constants/modules.js";
import {
  LOGIN_QUOTES, ONBOARDING_ITEMS, SITUATION_CATEGORIES, METHODOLOGY_ITEMS,
  SHARPENER_CATEGORIES, HUB_CATEGORIES, HELP_TIPS, HELP_MODULE_GUIDE,
  HELP_FAQS, SOCIAL_ITEMS, GAMEPLAN_STARTERS, FEEDBACK_SHEET_URL,
} from "./constants/content.js";
import { useDevMode } from "./hooks/useDevMode.js";
import DevModeSwitcher from "./components/DevModeSwitcher.jsx";
import LeaderDashboard from "./views/LeaderDashboard.jsx";
import ExecutiveDashboard from "./views/ExecutiveDashboard.jsx";
import AdminPanel from "./views/AdminPanel.jsx";

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
function logTeamActivity(name, mod, role, extra) {
  try {
    const d = loadTeamData();
    if (!d[name]) d[name] = { sessions: [], lastActive: "", role: role || "seller" };
    d[name].role = role || d[name].role || "seller";
    d[name].sessions.push({ module: mod, date: new Date().toISOString(), category: extra?.category || mod, firstMessage: extra?.firstMessage || "", messageCount: extra?.messageCount || 0, duration: extra?.duration || 0 });
    d[name].sessions = d[name].sessions.slice(-200);
    d[name].lastActive = new Date().toISOString();
    localStorage.setItem("ag-team", JSON.stringify(d));
  } catch {}
}

// Session category detection
function detectCategory(module, firstMsg) {
  if (module === "onboarding") return "onboarding";
  if (module === "outreach") return "call_prep";
  if (module === "roleplay") return "role_play";
  if (module === "sharpener") return "skill_drill";
  if (module === "methodology") return "methodology_learning";
  if (module === "social") return "social_selling";
  if (module === "gameplan") return "weekly_planning";
  if (module === "hub") return "internal_resources";
  if (module === "__mgr") return "manager_coaching";
  if (module === "help") return "help";
  if (module === "situation") {
    const m = (firstMsg || "").toLowerCase();
    if (m.includes("objection") || m.includes("send me your info") || m.includes("rate is too") || m.includes("call me back")) return "objection_handling";
    if (m.includes("cold") || m.includes("voicemail") || m.includes("lost the deal")) return "stalled_account";
    if (m.includes("call") || m.includes("transactional") || m.includes("questions to ask")) return "call_debrief";
    if (m.includes("focus") || m.includes("tough week") || m.includes("rough")) return "motivation";
    if (m.includes("pressure") || m.includes("numbers")) return "leadership_pressure";
    if (m.includes("client") || m.includes("hotel isn't")) return "client_issue";
    return "situation_general";
  }
  return module;
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
function ManagerDashboard({ teamData, userName, onSelectUser }) {
  const users = Object.entries(teamData);
  const now = new Date();
  const weekAgo = new Date(now - 7 * 864e5);
  const monthAgo = new Date(now - 30 * 864e5);
  const totalSessions = users.reduce((s, [, u]) => s + u.sessions.length, 0);
  const weekSessions = users.reduce((s, [, u]) => s + u.sessions.filter(x => new Date(x.date) > weekAgo).length, 0);
  const activeWeek = users.filter(([, u]) => u.sessions.some(s => new Date(s.date) > weekAgo)).length;
  const avgPerSeller = users.length ? Math.round(weekSessions / users.length * 10) / 10 : 0;

  // Activity last 14 days
  const dayBuckets = Array.from({length:14},(_,i) => {const d = new Date(now); d.setDate(d.getDate()-13+i); return d.toISOString().slice(0,10);});
  const dayCounts = dayBuckets.map(day => users.reduce((s,[,u]) => s + u.sessions.filter(x => x.date?.slice(0,10) === day).length, 0));
  const maxDay = Math.max(...dayCounts, 1);

  // Insights
  const insights = [];
  users.forEach(([name, u]) => {
    const da = Math.floor((now - new Date(u.lastActive)) / 864e5);
    if (da >= 7) insights.push({type:"inactive",text:`${name} hasn't logged in for ${da} days`});
  });
  const catCounts = {};
  users.forEach(([,u]) => u.sessions.filter(s => new Date(s.date) > weekAgo).forEach(s => { catCounts[s.category||s.module] = (catCounts[s.category||s.module]||0)+1; }));
  const topCat = Object.entries(catCounts).sort((a,b)=>b[1]-a[1]);
  if (topCat.length) insights.push({type:"pattern",text:`${topCat[0][0].replace(/_/g," ")} is the most common topic this week (${topCat[0][1]} sessions)`});
  const unusedMods = MODULES.filter(m => !users.some(([,u]) => u.sessions.some(s => s.module === m.id && new Date(s.date) > weekAgo)));
  if (unusedMods.length && unusedMods.length < MODULES.length) insights.push({type:"gap",text:`${unusedMods[0].label} had zero usage this week`});

  if (!users.length) {
    return (
      <div style={{padding:"32px 40px",maxWidth:600}}>
        <h2 style={{fontSize:22,fontWeight:600,margin:"0 0 4px"}}>Team Overview</h2>
        <p style={{fontSize:13,color:G.muted,margin:"0 0 28px"}}>Activity across your team. Updates as sellers use the platform.</p>
        <div style={{background:G.white,border:`1px solid ${G.tealBorder}`,borderRadius:14,padding:"36px 32px",textAlign:"center"}}>
          <div style={{fontSize:32,marginBottom:14}}>&#128075;</div>
          <div style={{fontSize:16,fontWeight:600,color:G.dark,marginBottom:8}}>Welcome to your dashboard</div>
          <div style={{fontSize:13,color:G.text,lineHeight:1.7,maxWidth:420,margin:"0 auto"}}>As your team starts using AskGillis, you'll see their activity, patterns, and coaching opportunities here. In the meantime, try switching to Seller Mode to explore the platform yourself and see what your team will experience.</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{padding:"32px 40px",maxWidth:860}}>
      <h2 style={{fontSize:22,fontWeight:600,margin:"0 0 4px"}}>Team Overview</h2>
      <p style={{fontSize:13,color:G.muted,margin:"0 0 28px"}}>Activity across your team. Updates as sellers use the platform.</p>

      <div className="stats-grid" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:28}}>
        {[{l:"Team members",v:users.length,c:G.purple},{l:"Active this week",v:`${activeWeek}`,s:users.length?`${Math.round(activeWeek/users.length*100)}%`:"",c:G.teal},{l:"Sessions this week",v:weekSessions,c:G.teal},{l:"Avg/seller this week",v:avgPerSeller,c:G.muted}].map((s,i) => (
          <div key={i} style={{background:G.white,border:`1px solid ${G.border}`,borderRadius:10,padding:"18px 16px"}}>
            <div style={{fontSize:11,color:G.muted,marginBottom:6,fontWeight:500,textTransform:"uppercase",letterSpacing:"0.04em"}}>{s.l}</div>
            <div style={{fontSize:28,fontWeight:600,color:s.c}}>{s.v}{s.s && <span style={{fontSize:12,fontWeight:500,color:G.muted,marginLeft:6}}>{s.s}</span>}</div>
          </div>
        ))}
      </div>

      {/* 14-day activity chart */}
      <div style={{background:G.white,border:`1px solid ${G.border}`,borderRadius:12,padding:"22px 24px",marginBottom:24}}>
        <div style={{fontSize:13,fontWeight:600,marginBottom:16}}>Activity (Last 14 Days)</div>
        <div style={{display:"flex",alignItems:"flex-end",gap:4,height:60}}>
          {dayCounts.map((c,i) => (
            <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
              <div style={{width:"100%",height:Math.max(2,c/maxDay*50),background:c>0?G.teal:G.borderLight,borderRadius:3,transition:"height 0.3s"}}/>
              <div style={{fontSize:8,color:G.dim}}>{dayBuckets[i].slice(8,10)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Team members */}
      <div style={{background:G.white,border:`1px solid ${G.border}`,borderRadius:12,padding:"22px 24px",marginBottom:24}}>
        <div style={{fontSize:13,fontWeight:600,marginBottom:16}}>Team Members</div>
        {users.length ? users.sort((a,b) => new Date(b[1].lastActive) - new Date(a[1].lastActive)).map(([name, u], i) => {
          const wc = u.sessions.filter(s => new Date(s.date) > weekAgo).length;
          const mc = {}; u.sessions.forEach(s => { mc[s.module] = (mc[s.module]||0)+1; });
          const topMod = Object.entries(mc).sort((a,b)=>b[1]-a[1])[0];
          const ml = topMod ? MODULES.find(x => x.id === topMod[0]) : null;
          const isMe = name === userName;
          const da = Math.floor((now - new Date(u.lastActive)) / 864e5);
          const rc = da === 0 ? "Today" : da === 1 ? "Yesterday" : `${da}d ago`;
          const statusColor = da <= 7 ? G.teal : da <= 14 ? G.gold : "#ef4444";
          return (
            <div key={i} onClick={() => onSelectUser(name)} style={{display:"flex",alignItems:"center",gap:14,padding:"12px 0",borderBottom:i<users.length-1?`1px solid ${G.borderLight}`:"none",cursor:"pointer"}}
              onMouseEnter={e => e.currentTarget.style.background=G.bg} onMouseLeave={e => e.currentTarget.style.background="transparent"}>
              <div style={{position:"relative"}}>
                <div style={{width:32,height:32,borderRadius:"50%",background:isMe?G.tealLight:G.purpleLight,border:`1.5px solid ${isMe?G.tealBorder:G.purpleBorder}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:600,color:isMe?G.teal:G.purple}}>
                  {name.split(" ").map(w=>w[0]).join("").slice(0,2)}
                </div>
                <div style={{position:"absolute",bottom:-1,right:-1,width:8,height:8,borderRadius:"50%",background:statusColor,border:"2px solid white"}}/>
              </div>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:500}}>{name}{isMe && <span style={{fontSize:10,color:G.teal,marginLeft:6}}>you</span>}</div>
                <div style={{fontSize:11,color:G.muted,display:"flex",gap:8}}>
                  {ml && <span style={{color:ml.color}}>Top: {ml.label}</span>}
                  <span>{u.sessions.length} total</span>
                </div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:13,fontWeight:600,color:wc>0?G.teal:G.dim}}>{wc}/wk</div>
                <div style={{fontSize:10,color:G.dim}}>{rc}</div>
              </div>
            </div>
          );
        }) : <div style={{fontSize:13,color:G.dim}}>No team members yet.</div>}
      </div>

      {/* Insights */}
      {insights.length > 0 && (
        <div style={{background:G.white,border:`1px solid ${G.border}`,borderRadius:12,padding:"18px 24px"}}>
          <div style={{fontSize:13,fontWeight:600,marginBottom:12}}>Quick Insights</div>
          {insights.slice(0,4).map((ins,i) => (
            <div key={i} style={{fontSize:12,color:G.text,padding:"6px 0",borderBottom:i<insights.length-1?`1px solid ${G.borderLight}`:"none",display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:14}}>{ins.type==="inactive"?"⚠️":ins.type==="pattern"?"📊":"💡"}</span>{ins.text}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---- Individual Seller View ----
function SellerDetail({ name, data, onBack }) {
  const now = new Date();
  const weekAgo = new Date(now - 7 * 864e5);
  const weekSessions = data.sessions.filter(s => new Date(s.date) > weekAgo).length;
  const totalDuration = data.sessions.reduce((s,x) => s + (x.duration||0), 0);
  const mc = {}; data.sessions.forEach(s => { mc[s.module] = (mc[s.module]||0)+1; });
  const modEntries = Object.entries(mc).sort((a,b)=>b[1]-a[1]);
  const maxMC = modEntries.length ? modEntries[0][1] : 1;
  const topMod = modEntries.length ? MODULES.find(x => x.id === modEntries[0][0]) : null;
  const cc = {}; data.sessions.forEach(s => { const c = s.category||s.module; cc[c]=(cc[c]||0)+1; });
  const catEntries = Object.entries(cc).sort((a,b)=>b[1]-a[1]);
  const totalCat = catEntries.reduce((s,[,v])=>s+v,0) || 1;

  return (
    <div style={{padding:"32px 40px",maxWidth:860}}>
      <button onClick={onBack} style={{background:"none",border:"none",cursor:"pointer",fontSize:12,color:G.teal,fontFamily:"inherit",padding:0,marginBottom:16,display:"flex",alignItems:"center",gap:4}}>← Back to Team</button>
      <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:28}}>
        <div style={{width:44,height:44,borderRadius:"50%",background:G.purpleLight,border:`2px solid ${G.purpleBorder}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:600,color:G.purple}}>
          {name.split(" ").map(w=>w[0]).join("").slice(0,2)}
        </div>
        <div>
          <h2 style={{fontSize:20,fontWeight:600,margin:0}}>{name}</h2>
          <div style={{fontSize:12,color:G.muted}}>Role: {data.role||"seller"} · Last active: {data.lastActive ? new Date(data.lastActive).toLocaleDateString() : "Never"}</div>
        </div>
      </div>

      <div className="stats-grid" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:28}}>
        {[{l:"Total sessions",v:data.sessions.length,c:G.purple},{l:"This week",v:weekSessions,c:G.teal},{l:"Top module",v:topMod?topMod.label:"—",c:topMod?topMod.color:G.dim,small:true},{l:"Total time",v:totalDuration>3600?Math.round(totalDuration/3600)+"h":Math.round(totalDuration/60)+"m",c:G.muted}].map((s,i) => (
          <div key={i} style={{background:G.white,border:`1px solid ${G.border}`,borderRadius:10,padding:"18px 16px"}}>
            <div style={{fontSize:11,color:G.muted,marginBottom:6,fontWeight:500,textTransform:"uppercase",letterSpacing:"0.04em"}}>{s.l}</div>
            <div style={{fontSize:s.small?16:28,fontWeight:600,color:s.c}}>{s.v}</div>
          </div>
        ))}
      </div>

      {/* Module breakdown */}
      <div style={{background:G.white,border:`1px solid ${G.border}`,borderRadius:12,padding:"22px 24px",marginBottom:24}}>
        <div style={{fontSize:13,fontWeight:600,marginBottom:16}}>Module Breakdown</div>
        {modEntries.length ? modEntries.map(([mod, count], i) => {
          const m = MODULES.find(x => x.id === mod);
          return (
            <div key={i} style={{display:"flex",alignItems:"center",gap:12,marginBottom:10}}>
              <div style={{width:120,fontSize:12,fontWeight:500}}>{m ? m.label : mod}</div>
              <div style={{flex:1,height:8,background:G.bg,borderRadius:4,overflow:"hidden"}}>
                <div style={{width:`${(count/maxMC)*100}%`,height:"100%",background:m?m.color:G.teal,borderRadius:4}}/>
              </div>
              <div style={{width:40,fontSize:12,fontWeight:600,color:G.muted,textAlign:"right"}}>{count}</div>
            </div>
          );
        }) : <div style={{fontSize:13,color:G.dim}}>No activity yet.</div>}
      </div>

      {/* Category breakdown */}
      <div style={{background:G.white,border:`1px solid ${G.border}`,borderRadius:12,padding:"22px 24px",marginBottom:24}}>
        <div style={{fontSize:13,fontWeight:600,marginBottom:16}}>What They're Working On</div>
        {catEntries.length ? catEntries.slice(0,8).map(([cat, count], i) => (
          <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 0",borderBottom:i<catEntries.length-1?`1px solid ${G.borderLight}`:"none"}}>
            <span style={{fontSize:12,fontWeight:500,textTransform:"capitalize"}}>{cat.replace(/_/g," ")}</span>
            <span style={{fontSize:12,fontWeight:600,color:G.teal}}>{Math.round(count/totalCat*100)}%</span>
          </div>
        )) : <div style={{fontSize:13,color:G.dim}}>No data.</div>}
      </div>

      {/* Recent sessions */}
      <div style={{background:G.white,border:`1px solid ${G.border}`,borderRadius:12,padding:"22px 24px"}}>
        <div style={{fontSize:13,fontWeight:600,marginBottom:16}}>Recent Sessions</div>
        {data.sessions.slice(-20).reverse().map((s,i) => {
          const m = MODULES.find(x => x.id === s.module);
          const d = s.date ? new Date(s.date) : null;
          return (
            <div key={i} style={{padding:"10px 0",borderBottom:i<19?`1px solid ${G.borderLight}`:"none",display:"flex",alignItems:"center",gap:12}}>
              <div style={{width:4,height:4,borderRadius:"50%",background:m?m.color:G.teal,flexShrink:0}}/>
              <div style={{flex:1}}>
                <div style={{fontSize:12,fontWeight:500}}>{m?m.label:s.module}{s.category && s.category !== s.module ? <span style={{fontSize:10,color:G.dim,marginLeft:8,textTransform:"capitalize"}}>{s.category.replace(/_/g," ")}</span> : ""}</div>
                {s.firstMessage && <div style={{fontSize:11,color:G.muted,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",maxWidth:400}}>{s.firstMessage}</div>}
              </div>
              <div style={{fontSize:10,color:G.dim,flexShrink:0}}>{d?d.toLocaleDateString():""}</div>
              <div style={{fontSize:10,color:G.dim,flexShrink:0}}>{s.messageCount||0} msgs</div>
            </div>
          );
        })}
        {!data.sessions.length && <div style={{fontSize:13,color:G.dim}}>No sessions yet.</div>}
      </div>
    </div>
  );
}

// ---- Patterns & Topics ----
function PatternsView({ teamData }) {
  const now = new Date();
  const weekAgo = new Date(now - 7 * 864e5);
  const users = Object.entries(teamData);
  const allWeekSessions = users.flatMap(([,u]) => u.sessions.filter(s => new Date(s.date) > weekAgo));

  // Top categories
  const catCounts = {};
  allWeekSessions.forEach(s => { const c = s.category||s.module; catCounts[c]=(catCounts[c]||0)+1; });
  const topCats = Object.entries(catCounts).sort((a,b)=>b[1]-a[1]);

  // Module usage
  const modCounts = {};
  allWeekSessions.forEach(s => { modCounts[s.module]=(modCounts[s.module]||0)+1; });
  const modEntries = Object.entries(modCounts).sort((a,b)=>b[1]-a[1]);
  const maxMod = modEntries.length ? modEntries[0][1] : 1;

  // Recent first messages
  const recentMsgs = users.flatMap(([name,u]) => u.sessions.filter(s => s.firstMessage && new Date(s.date) > weekAgo).map(s => ({name,msg:s.firstMessage,date:s.date,module:s.module})))
    .sort((a,b) => new Date(b.date) - new Date(a.date)).slice(0,10);

  // Time of day
  const hours = {Morning:0,Midday:0,Afternoon:0,Evening:0};
  allWeekSessions.forEach(s => {
    if (!s.date) return;
    const h = new Date(s.date).getHours();
    if (h < 12) hours.Morning++; else if (h < 14) hours.Midday++; else if (h < 18) hours.Afternoon++; else hours.Evening++;
  });
  const maxH = Math.max(...Object.values(hours), 1);

  return (
    <div style={{padding:"32px 40px",maxWidth:860}}>
      <h2 style={{fontSize:22,fontWeight:600,margin:"0 0 4px"}}>Patterns & Topics</h2>
      <p style={{fontSize:13,color:G.muted,margin:"0 0 28px"}}>What your team is working on this week.</p>

      <div className="patterns-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,marginBottom:24}}>
        <div style={{background:G.white,border:`1px solid ${G.border}`,borderRadius:12,padding:"22px 24px"}}>
          <div style={{fontSize:13,fontWeight:600,marginBottom:14}}>Top Topics This Week</div>
          {topCats.length ? topCats.slice(0,8).map(([cat,count],i) => (
            <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:i<topCats.length-1?`1px solid ${G.borderLight}`:"none"}}>
              <span style={{fontSize:12,textTransform:"capitalize"}}>{cat.replace(/_/g," ")}</span>
              <span style={{fontSize:12,fontWeight:600,color:G.teal}}>{count}</span>
            </div>
          )) : <div style={{fontSize:13,color:G.dim}}>No data this week.</div>}
        </div>

        <div style={{background:G.white,border:`1px solid ${G.border}`,borderRadius:12,padding:"22px 24px"}}>
          <div style={{fontSize:13,fontWeight:600,marginBottom:14}}>Time of Day</div>
          {Object.entries(hours).map(([label,count],i) => (
            <div key={i} style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
              <div style={{width:70,fontSize:12}}>{label}</div>
              <div style={{flex:1,height:8,background:G.bg,borderRadius:4,overflow:"hidden"}}><div style={{width:`${(count/maxH)*100}%`,height:"100%",background:G.teal,borderRadius:4}}/></div>
              <div style={{width:30,fontSize:11,color:G.muted,textAlign:"right"}}>{count}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{background:G.white,border:`1px solid ${G.border}`,borderRadius:12,padding:"22px 24px",marginBottom:24}}>
        <div style={{fontSize:13,fontWeight:600,marginBottom:14}}>Module Usage This Week</div>
        {modEntries.length ? modEntries.map(([mod,count],i) => {
          const m = MODULES.find(x => x.id === mod);
          return (
            <div key={i} style={{display:"flex",alignItems:"center",gap:12,marginBottom:10}}>
              <div style={{width:120,fontSize:12,fontWeight:500}}>{m?m.label:mod}</div>
              <div style={{flex:1,height:8,background:G.bg,borderRadius:4,overflow:"hidden"}}><div style={{width:`${(count/maxMod)*100}%`,height:"100%",background:m?m.color:G.teal,borderRadius:4}}/></div>
              <div style={{width:40,fontSize:12,fontWeight:600,color:G.muted,textAlign:"right"}}>{count}</div>
            </div>
          );
        }) : <div style={{fontSize:13,color:G.dim}}>No data.</div>}
      </div>

      <div style={{background:G.white,border:`1px solid ${G.border}`,borderRadius:12,padding:"22px 24px"}}>
        <div style={{fontSize:13,fontWeight:600,marginBottom:14}}>What Sellers Are Asking</div>
        {recentMsgs.length ? recentMsgs.map((r,i) => {
          const m = MODULES.find(x => x.id === r.module);
          return (
            <div key={i} style={{padding:"8px 0",borderBottom:i<recentMsgs.length-1?`1px solid ${G.borderLight}`:"none"}}>
              <div style={{fontSize:12,color:G.text,lineHeight:1.5,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>"{r.msg}"</div>
              <div style={{fontSize:10,color:G.dim,marginTop:2}}>{r.name} · {m?m.label:r.module}</div>
            </div>
          );
        }) : <div style={{fontSize:13,color:G.dim}}>No conversations this week.</div>}
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
  const { user, profile, loading: authLoading, signInWithPassword, setPassword, resetPassword, signOut, devSignIn, isSupabaseConfigured, authError, visiblePodIds, needsPasswordSetup } = useAuth();
  const { isDevMode } = useDevMode();
  const [screen, setScreen] = useState("login");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");
  const [userRole, setUserRole] = useState("");
  const [mode, setMode] = useState("seller");
  const [mgrView, setMgrView] = useState("team");
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeModule, setActiveModule] = useState(() => {
    try {
      const last = localStorage.getItem("ag-last-module");
      if (last && last !== "help") return last;
    } catch {}
    return new Date().getDay() === 1 ? "gameplan" : "onboarding";
  });
  const [chatOpen, setChatOpen] = useState(() => typeof window !== "undefined" ? window.innerWidth >= 1024 : true);
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
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef(null);
  const [faqOpen, setFaqOpen] = useState(null);
  const [winW, setWinW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  const [loginPhase, setLoginPhase] = useState(0); // 0=splash, 1=transition, 2=login
  const [loginQuote] = useState(() => LOGIN_QUOTES[Math.floor(Math.random()*LOGIN_QUOTES.length)]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = winW < 768;
  const isTablet = winW >= 768 && winW < 1024;
  const isCompact = winW < 1024;

  const kbRef = useRef(null);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const convRef = useRef([]);
  const streamTickerRef = useRef(null);
  const prevModuleRef = useRef(activeModule);

  const userName = email ? email.split("@")[0].replace(/[._]/g," ").replace(/\b\w/g, l => l.toUpperCase()) : "";

  // Global search index
  const searchIndex = useMemo(() => {
    const items = [];
    // Modules as navigation targets
    MODULES.forEach(m => items.push({text:m.label,module:m.id,type:"module",action:"navigate",color:m.color}));
    // Onboarding items
    ONBOARDING_ITEMS.filter(x=>x.tammy).forEach(x => items.push({text:x.label,module:"onboarding",type:"Onboarding",action:"prompt",prompt:x.prompt,color:G.teal}));
    // Game Plan
    GAMEPLAN_STARTERS.forEach(cat => cat.items.forEach(x => items.push({text:x.label,desc:x.desc,module:"gameplan",type:"Weekly Game Plan",action:"prompt",prompt:x.prompt,color:"#8B5CF6"})));
    // Situation
    SITUATION_CATEGORIES.forEach(cat => cat.items.forEach(x => items.push({text:x.label,desc:x.desc,module:"situation",type:"Situation",action:"prompt",prompt:x.prompt,color:G.lilac})));
    // Sharpener
    SHARPENER_CATEGORIES.forEach(cat => cat.items.forEach(x => items.push({text:x.label,module:"sharpener",type:"Daily Sharpener",action:"drill",scenario:x.scenario,category:cat.category,color:cat.color})));
    // Social
    SOCIAL_ITEMS.forEach(cat => cat.items.forEach(x => items.push({text:x.label,desc:x.desc,module:"social",type:"LinkedIn & Social",action:"prompt",prompt:x.prompt,color:"#3B82F6"})));
    // Methodology
    METHODOLOGY_ITEMS.forEach(x => items.push({text:x.title,desc:x.desc,module:"methodology",type:"Methodology",action:"prompt",prompt:"Explain "+x.title+" with a real hotel sales example.",color:x.color}));
    // Hub
    HUB_CATEGORIES.forEach(cat => cat.items.forEach(x => {
      if (x.type==="ask") items.push({text:x.label,desc:x.desc,module:"hub",type:"Gillis Hub",action:"prompt",prompt:x.prompt,color:"#6B7280"});
      else if (x.type==="link"&&!x.placeholder) items.push({text:x.label,desc:x.desc,module:"hub",type:"Gillis Hub",action:"link",url:x.url,color:"#3B82F6"});
      else if (x.type==="document") items.push({text:x.label,desc:x.desc,module:"hub",type:"Gillis Hub",action:"doc",filename:x.filename,color:G.teal});
    }));
    // FAQ
    HELP_FAQS.forEach(x => items.push({text:x.q,module:"help",type:"FAQ",action:"navigate",color:G.muted}));
    return items;
  }, []);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    const words = q.split(/\s+/).filter(Boolean);
    return searchIndex
      .map(item => {
        const hay = (item.text + " " + (item.desc||"") + " " + (item.type||"")).toLowerCase();
        const score = words.reduce((s,w) => s + (hay.includes(w) ? 1 : 0), 0);
        return {...item, score};
      })
      .filter(x => x.score > 0)
      .sort((a,b) => b.score - a.score)
      .slice(0, 12);
  }, [searchQuery, searchIndex]);

  // Login animation phases
  useEffect(() => {
    if (screen !== "login") return;
    const t1 = setTimeout(() => setLoginPhase(1), 2800);
    const t2 = setTimeout(() => setLoginPhase(2), 3800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [screen]);

  // Cleanup streaming on unmount
  useEffect(() => () => { if (streamTickerRef.current) clearInterval(streamTickerRef.current); }, []);

  // Responsive: track window width
  useEffect(() => {
    const onResize = () => setWinW(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Cmd+K / Ctrl+K global search shortcut
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k" && screen === "platform") { e.preventDefault(); setSearchOpen(true); setSearchQuery(""); }
      if (e.key === "Escape" && searchOpen) { setSearchOpen(false); setSearchQuery(""); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [searchOpen, screen]);

  // Load KB on mount
  useEffect(() => {
    const kb = getKB();
    kbRef.current = kb;
    setKbWords(kb.split(/\s+/).length);
    try { setHasKBOverride(!!localStorage.getItem("ag-kb-override")); } catch {}
  }, []);

  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [messages, loading]);
  useEffect(() => { if (chatOpen) setTimeout(() => inputRef.current?.focus(), 200); }, [chatOpen]);
  useEffect(() => {
    if (screen === "platform") {
      if (streamTickerRef.current) { clearInterval(streamTickerRef.current); streamTickerRef.current = null; }
      if (messages.length >= 2) saveSession();
      prevModuleRef.current = activeModule;
      setMessages([]);
      convRef.current = [];
      sessionStartRef.current = null;
      setSocialExpanded(null);
      setSocialInput("");
      if (activeModule !== "help" && activeModule !== "__mgr") {
        try { localStorage.setItem("ag-last-module", activeModule); } catch {}
      }
    }
  }, [activeModule]);
  useEffect(() => {
    if (screen === "platform") {
      setSessions(loadSessions());
      setTeamData(loadTeamData());
    }
  }, [screen]);

  const [password, setPasswordVal] = useState("");
  const [loginView, setLoginView] = useState("login"); // login | forgot | reset-sent | set-password
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Detect if user arrived via invite/reset link
  useEffect(() => {
    if (needsPasswordSetup && screen === "login") {
      setLoginView("set-password");
    }
  }, [needsPasswordSetup, screen]);

  const handleLogin = async () => {
    if (!email.includes("@")) { setErr("Please enter a valid email."); return; }
    setErr("");

    // Dev mode: instant login from seed data
    if (isDevMode) {
      const success = devSignIn(email.trim().toLowerCase());
      if (!success) { setErr("Email not found in user directory. Check the address."); return; }
      return;
    }

    // Supabase: email + password
    if (isSupabaseConfigured) {
      if (!password) { setErr("Please enter your password."); return; }
      const { error } = await signInWithPassword(email.trim().toLowerCase(), password);
      if (error) {
        if (error.message === "Invalid login credentials") {
          setErr("Incorrect email or password.");
        } else {
          setErr(error.message);
        }
        return;
      }
      return;
    }

    // Fallback: legacy invitation code login
    const success = devSignIn(email.trim().toLowerCase());
    if (!success) {
      if (code.toUpperCase().trim() !== "GILLIS2026") { setErr("Invalid invitation code or email not recognized."); return; }
      setScreen("role-select");
      return;
    }
  };

  const handleForgotPassword = async () => {
    if (!email.includes("@")) { setErr("Please enter your email address first."); return; }
    setErr("");
    const { error } = await resetPassword(email.trim().toLowerCase());
    if (error) { setErr(error.message); return; }
    setLoginView("reset-sent");
  };

  const handleSetPassword = async () => {
    if (!newPassword) { setErr("Please enter a password."); return; }
    if (newPassword.length < 6) { setErr("Password must be at least 6 characters."); return; }
    if (newPassword !== confirmPassword) { setErr("Passwords don't match."); return; }
    setErr("");
    const { error } = await setPassword(newPassword);
    if (error) { setErr(error.message); return; }
    setNewPassword("");
    setConfirmPassword("");
    // Auth state change will auto-navigate to platform
  };

  const selectRole = (role) => {
    setUserRole(role);
    try { localStorage.setItem("ag-role-" + email.trim().toLowerCase(), role); } catch {}
    setMode(role === "manager" ? "manager" : "seller");
    setChatOpen(window.innerWidth >= 1024);
    setScreen("platform");
  };

  // Auto-navigate to platform when auth state changes
  useEffect(() => {
    if (profile && user) {
      // Set mode based on role
      if (profile.role === 'executive' || profile.role === 'leader') {
        setMode('manager');
        setUserRole('manager');
      } else {
        setMode('seller');
        setUserRole('seller');
      }
      setEmail(profile.email || user.email || '');
      setChatOpen(window.innerWidth >= 1024);
      setScreen("platform");
    }
  }, [profile, user]);

  const sessionStartRef = useRef(null);

  const saveSession = () => {
    if (messages.length < 2) return;
    const fm = messages.find(m => !m.isTammy);
    const firstMsg = fm ? fm.text : "";
    const duration = sessionStartRef.current ? Math.round((Date.now() - sessionStartRef.current) / 1000) : 0;
    const mod4save = prevModuleRef.current || activeModule;
    const cat = detectCategory(mod4save, firstMsg);
    const s = {
      id: Date.now().toString(),
      module: mod4save,
      moduleLabel: MODULES.find(m => m.id === mod4save)?.label || mod4save,
      summary: fm ? fm.text.slice(0, 55) + "..." : "Session",
      date: new Date().toISOString(),
      messageCount: messages.length,
      messages: messages.slice(0, 50),
    };
    const updated = [s, ...sessions].slice(0, 30);
    setSessions(updated);
    saveSessions(updated);
    // Log rich session to team data
    logTeamActivity(userName, mod4save, userRole, { category: cat, firstMessage: firstMsg.slice(0, 120), messageCount: messages.length, duration });
    setTeamData(loadTeamData());
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
    if (!sessionStartRef.current) sessionStartRef.current = Date.now();
    convRef.current.push({ role: "user", content: msg });

    const kbContent = kbRef.current || "";
    const roleContext = userRole === "manager"
      ? "\n\nUSER ROLE: This person is a manager/RDOS who oversees sellers. If they ask about their own selling, coach them normally. If they ask about managing their team, coaching their sellers, or how to help a struggling rep, shift to coaching-the-coach mode. Help them diagnose seller issues and suggest how to address them in one-on-ones."
      : "\n\nUSER ROLE: This person is a seller.";
    const sys = SYSTEM_PROMPT
      + "\n\nSALES KNOWLEDGE BASE:\n" + kbContent
      + "\n\nGILLIS OPERATIONS KNOWLEDGE BASE:\n" + OPERATIONAL_KB
      + roleContext
      + "\n\nMODE: " + (MODE_PROMPTS[activeModule] || "")
      + "\n\n" + getCtx()
      + "\n\nToday: " + new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-opus-4-6", max_tokens: 1000, system: sys, messages: [...convRef.current] }),
      });

      // Error response — not streaming
      if (!res.ok) {
        let errMsg = "Something went wrong. Try again.";
        try { const data = JSON.parse(await res.text()); errMsg = data.error?.message || errMsg; } catch {}
        convRef.current.push({ role: "assistant", content: errMsg });
        setMessages(p => [...p, { text: errMsg, isTammy: true }]);
        setLoading(false);
        setTimeout(() => inputRef.current?.focus(), 100);
        return;
      }

      // Clean up any previous streaming ticker
      if (streamTickerRef.current) { clearInterval(streamTickerRef.current); streamTickerRef.current = null; }

      // Streaming with fixed-interval typewriter
      setMessages(p => [...p, { text: "", isTammy: true }]);
      setLoading(false);
      let fullText = "";
      let displayed = 0;
      let streamDone = false;
      let aborted = false;

      // Fixed 12ms interval releases characters at a steady, even pace
      const ticker = setInterval(() => {
        if (aborted) { clearInterval(ticker); streamTickerRef.current = null; return; }
        if (displayed >= fullText.length) {
          if (streamDone) {
            clearInterval(ticker);
            streamTickerRef.current = null;
            convRef.current.push({ role: "assistant", content: fullText || "Empty response." });
          }
          return;
        }
        const next = fullText.indexOf(" ", displayed + 1);
        displayed = next === -1 ? fullText.length : Math.min(next + 1, fullText.length);
        setMessages(p => { if (p.length === 0) { aborted = true; return p; } const u = p.slice(); u[u.length - 1] = { text: fullText.slice(0, displayed), isTammy: true }; return u; });
      }, 12);
      streamTickerRef.current = ticker;

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      const processLines = (text) => {
        buffer += text;
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const payload = line.slice(6).trim();
          if (!payload || payload === "[DONE]") continue;
          try {
            const evt = JSON.parse(payload);
            if (evt.type === "content_block_delta" && evt.delta?.text) {
              fullText += evt.delta.text;
            }
          } catch {}
        }
      };

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          processLines(decoder.decode(value, { stream: true }));
        }
        if (buffer.trim()) processLines("\n");
      } catch { /* stream interrupted — use what we have */ }
      streamDone = true;

      // Wait for the ticker to finish displaying (with timeout safety)
      await new Promise(resolve => {
        let waited = 0;
        const check = setInterval(() => {
          waited += 20;
          if (aborted || displayed >= fullText.length || waited > 10000) { clearInterval(check); resolve(); }
        }, 20);
      });
      if (!aborted && fullText) {
        setMessages(p => { if (p.length === 0) return p; const u = p.slice(); u[u.length - 1] = { text: fullText, isTammy: true }; return u; });
      }
    } catch (e) {
      if (streamTickerRef.current) { clearInterval(streamTickerRef.current); streamTickerRef.current = null; }
      setMessages(p => [...p, { text: "Connection error. Please try again.", isTammy: true }]);
      setLoading(false);
    }
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
      module: mode==="manager"?"Manager Dashboard":(MODULES.find(m => m.id === (prevModuleRef.current||activeModule))?.label || activeModule),
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

  // ---- AUTH LOADING ----
  if (authLoading) {
    return (
      <div style={{height:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:`linear-gradient(160deg,#1a1035 0%,${G.purpleDark} 40%,${G.purple} 70%,#1a1035 100%)`}}>
        <div style={{textAlign:"center"}}>
          <img src="/images/gillis-logo-white.png" alt="Gillis" style={{width:200,maxWidth:"60vw",opacity:0.8}}/>
          <p style={{color:"rgba(255,255,255,0.5)",fontSize:14,marginTop:16}}>Loading...</p>
        </div>
      </div>
    );
  }

  // ---- LOGIN ----
  if (screen === "login") {
    return (
      <div style={{position:"relative",height:"100vh",overflow:"hidden",fontFamily:"'DM Sans',system-ui,sans-serif"}}>
        {/* Background layers */}
        <div style={{position:"absolute",inset:0,background:"linear-gradient(160deg,#1a1035 0%,#2d1f5e 40%,#3D2B6B 70%,#1a1035 100%)",opacity:loginPhase>=1?0.6:1,transition:"opacity 1.4s ease"}}/>
        <div style={{position:"absolute",inset:0,backgroundImage:"url(/images/photo-1759038086397-2b7b1535da04.jpg)",backgroundSize:"cover",backgroundPosition:"center 40%",filter:"grayscale(100%)",opacity:loginPhase>=1?0.25:0,transform:loginPhase>=1?"scale(1)":"scale(1.03)",transition:"opacity 1.4s ease, transform 8s cubic-bezier(0.16,1,0.3,1)"}}/>
        <div style={{position:"absolute",inset:0,background:"rgba(30,20,55,0.7)",mixBlendMode:"multiply",opacity:loginPhase>=1?1:0,transition:"opacity 1.2s ease 0.2s"}}/>
        <div style={{position:"absolute",inset:0,opacity:0.03,backgroundImage:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",backgroundSize:"128px",mixBlendMode:"overlay",pointerEvents:"none"}}/>

        {/* Splash screen */}
        <div style={{position:"absolute",inset:0,zIndex:10,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",opacity:loginPhase>=1?0:1,transform:loginPhase>=1?"scale(0.95)":"scale(1)",transition:"opacity 0.5s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1)",pointerEvents:loginPhase>=1?"none":"auto"}}>
          <div style={{opacity:0,animation:"loginLogoIn 0.7s cubic-bezier(0.16,1,0.3,1) 0.2s forwards"}}>
            <img src="/images/gillis-logo-white.png" alt="Gillis" style={{width:280,maxWidth:"70vw"}}/>
          </div>
          <div style={{marginTop:24,height:20,overflow:"hidden"}}>
            <div style={{animation:"splashWords 2.4s ease 0.6s forwards",opacity:0}}>
              <div style={{fontSize:13,fontWeight:500,color:"rgba(255,255,255,0.5)",textAlign:"center",height:20,lineHeight:"20px",letterSpacing:"0.08em"}}>Loading...</div>
              <div style={{fontSize:13,fontWeight:500,color:"rgba(255,255,255,0.5)",textAlign:"center",height:20,lineHeight:"20px",letterSpacing:"0.08em"}}>Planning...</div>
              <div style={{fontSize:13,fontWeight:500,color:"rgba(255,255,255,0.5)",textAlign:"center",height:20,lineHeight:"20px",letterSpacing:"0.08em"}}>Gillis-ing...</div>
            </div>
          </div>
        </div>

        {/* Top-left logo removed — logo already appears above login card */}

        {/* Login form */}
        <div style={{position:"absolute",inset:0,zIndex:5,display:"flex",alignItems:"center",justifyContent:"center",padding:"40px 28px",opacity:loginPhase>=2?1:0,pointerEvents:loginPhase>=2?"auto":"none",transition:"opacity 0.7s cubic-bezier(0.16,1,0.3,1) 0.15s"}}>
          <div style={{width:"100%",maxWidth:400,textAlign:"center"}}>
            <div className={loginPhase>=2?"login-anim login-d1":"login-anim"} style={{opacity:0,transform:"translateY(20px)"}}>
              <img src="/images/gillis-logo-white.png" alt="Gillis" style={{width:220,maxWidth:"60vw",marginBottom:12}}/>
            </div>
            <div className={loginPhase>=2?"login-anim login-d2":"login-anim"} style={{opacity:0,transform:"translateY(20px)"}}>
              <p style={{fontSize:17,fontWeight:400,color:"rgba(255,255,255,0.85)",margin:"0 0 28px",lineHeight:1.5}}>AI-powered sales coaching built on 28 years of hospitality expertise.</p>
            </div>
            <div className={loginPhase>=2?"login-anim login-d3":"login-anim"} style={{opacity:0,transform:"translateY(20px)"}}>
              <div style={{background:"rgba(15,12,25,0.88)",backdropFilter:"blur(30px)",WebkitBackdropFilter:"blur(30px)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:16,padding:"32px 28px",textAlign:"left"}}>
                {loginView === "set-password" ? (
                  <>
                    <p style={{color:"rgba(255,255,255,0.9)",fontSize:16,fontWeight:600,marginBottom:4,marginTop:0}}>Set your password</p>
                    <p style={{color:"rgba(255,255,255,0.5)",fontSize:13,marginBottom:20,marginTop:0}}>Choose a password to complete your account setup.</p>
                    <div style={{marginBottom:14}}>
                      <label style={{display:"block",fontSize:11,fontWeight:600,color:"rgba(255,255,255,0.6)",marginBottom:8,letterSpacing:"0.06em",textTransform:"uppercase"}}>New Password</label>
                      <input type="password" value={newPassword} onChange={e => {setNewPassword(e.target.value);setErr("");}} placeholder="At least 6 characters"
                        onKeyDown={e => {if(e.key==="Enter" && confirmPassword)handleSetPassword();}}
                        style={{width:"100%",padding:"14px 16px",borderRadius:10,border:"1px solid rgba(255,255,255,0.18)",background:"rgba(255,255,255,0.1)",color:"white",fontSize:15,fontWeight:500,outline:"none",boxSizing:"border-box",fontFamily:"inherit",transition:"background 0.2s, border-color 0.2s"}}/>
                    </div>
                    <div style={{marginBottom:20}}>
                      <label style={{display:"block",fontSize:11,fontWeight:600,color:"rgba(255,255,255,0.6)",marginBottom:8,letterSpacing:"0.06em",textTransform:"uppercase"}}>Confirm Password</label>
                      <input type="password" value={confirmPassword} onChange={e => {setConfirmPassword(e.target.value);setErr("");}} placeholder="Confirm your password"
                        onKeyDown={e => {if(e.key==="Enter")handleSetPassword();}}
                        style={{width:"100%",padding:"14px 16px",borderRadius:10,border:"1px solid rgba(255,255,255,0.18)",background:"rgba(255,255,255,0.1)",color:"white",fontSize:15,fontWeight:500,outline:"none",boxSizing:"border-box",fontFamily:"inherit",transition:"background 0.2s, border-color 0.2s"}}/>
                    </div>
                    {err && <p style={{color:"#ff7b7b",fontSize:12,marginTop:6,marginBottom:12}}>{err}</p>}
                    <button onClick={handleSetPassword} style={{width:"100%",padding:"15px",borderRadius:10,border:"none",background:`linear-gradient(135deg,${G.teal},${G.tealDark})`,color:"white",fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"inherit",boxShadow:"0 4px 24px rgba(26,187,166,0.25)",transition:"transform 0.15s, box-shadow 0.15s"}}
                      onMouseEnter={e => {e.currentTarget.style.transform="translateY(-1px)";e.currentTarget.style.boxShadow="0 6px 30px rgba(26,187,166,0.35)";}}
                      onMouseLeave={e => {e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="0 4px 24px rgba(26,187,166,0.25)";}}>
                      Set Password & Continue
                    </button>
                  </>
                ) : loginView === "forgot" ? (
                  <>
                    <p style={{color:"rgba(255,255,255,0.9)",fontSize:16,fontWeight:600,marginBottom:4,marginTop:0}}>Reset your password</p>
                    <p style={{color:"rgba(255,255,255,0.5)",fontSize:13,marginBottom:20,marginTop:0}}>Enter your email and we'll send you a reset link.</p>
                    <div style={{marginBottom:20}}>
                      <label style={{display:"block",fontSize:11,fontWeight:600,color:"rgba(255,255,255,0.6)",marginBottom:8,letterSpacing:"0.06em",textTransform:"uppercase"}}>Email</label>
                      <input type="email" value={email} onChange={e => {setEmail(e.target.value);setErr("");}} placeholder="you@gillissales.com"
                        onKeyDown={e => {if(e.key==="Enter")handleForgotPassword();}}
                        style={{width:"100%",padding:"14px 16px",borderRadius:10,border:"1px solid rgba(255,255,255,0.18)",background:"rgba(255,255,255,0.1)",color:"white",fontSize:15,fontWeight:500,outline:"none",boxSizing:"border-box",fontFamily:"inherit",transition:"background 0.2s, border-color 0.2s"}}/>
                    </div>
                    {err && <p style={{color:"#ff7b7b",fontSize:12,marginTop:6,marginBottom:12}}>{err}</p>}
                    <button onClick={handleForgotPassword} style={{width:"100%",padding:"15px",borderRadius:10,border:"none",background:`linear-gradient(135deg,${G.teal},${G.tealDark})`,color:"white",fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"inherit",boxShadow:"0 4px 24px rgba(26,187,166,0.25)",transition:"transform 0.15s, box-shadow 0.15s"}}
                      onMouseEnter={e => {e.currentTarget.style.transform="translateY(-1px)";e.currentTarget.style.boxShadow="0 6px 30px rgba(26,187,166,0.35)";}}
                      onMouseLeave={e => {e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="0 4px 24px rgba(26,187,166,0.25)";}}>
                      Send Reset Link
                    </button>
                    <div style={{textAlign:"center",marginTop:16}}>
                      <button onClick={() => {setLoginView("login");setErr("");}} style={{background:"none",border:"none",color:"rgba(255,255,255,0.5)",fontSize:13,cursor:"pointer",fontFamily:"inherit",textDecoration:"underline"}}>Back to sign in</button>
                    </div>
                  </>
                ) : loginView === "reset-sent" ? (
                  <div style={{textAlign:"center",padding:"16px 0"}}>
                    <div style={{fontSize:28,marginBottom:12}}>&#x2709;</div>
                    <p style={{color:"rgba(255,255,255,0.9)",fontSize:16,fontWeight:600,marginBottom:8}}>Check your email</p>
                    <p style={{color:"rgba(255,255,255,0.6)",fontSize:14,marginBottom:20,lineHeight:1.5}}>We sent a password reset link to <strong style={{color:"rgba(255,255,255,0.85)"}}>{email}</strong>.</p>
                    <button onClick={() => {setLoginView("login");setErr("");}} style={{padding:"10px 20px",borderRadius:8,border:"1px solid rgba(255,255,255,0.2)",background:"transparent",color:"rgba(255,255,255,0.7)",fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>Back to sign in</button>
                  </div>
                ) : (
                  <>
                    <div style={{marginBottom:14}}>
                      <label style={{display:"block",fontSize:11,fontWeight:600,color:"rgba(255,255,255,0.6)",marginBottom:8,letterSpacing:"0.06em",textTransform:"uppercase"}}>Email</label>
                      <input type="email" value={email} onChange={e => {setEmail(e.target.value);setErr("");}} placeholder="you@gillissales.com"
                        onKeyDown={e => {if(e.key==="Enter" && password)handleLogin(); else if(e.key==="Enter")document.getElementById("ag-pw")?.focus();}}
                        style={{width:"100%",padding:"14px 16px",borderRadius:10,border:"1px solid rgba(255,255,255,0.18)",background:"rgba(255,255,255,0.1)",color:"white",fontSize:15,fontWeight:500,outline:"none",boxSizing:"border-box",fontFamily:"inherit",transition:"background 0.2s, border-color 0.2s"}}/>
                    </div>
                    {isSupabaseConfigured ? (
                      <div style={{marginBottom:20}}>
                        <label style={{display:"block",fontSize:11,fontWeight:600,color:"rgba(255,255,255,0.6)",marginBottom:8,letterSpacing:"0.06em",textTransform:"uppercase"}}>Password</label>
                        <input id="ag-pw" type="password" value={password} onChange={e => {setPasswordVal(e.target.value);setErr("");}} placeholder="Enter your password"
                          onKeyDown={e => {if(e.key==="Enter")handleLogin();}}
                          style={{width:"100%",padding:"14px 16px",borderRadius:10,border:`1px solid ${err?"rgba(255,100,100,0.5)":"rgba(255,255,255,0.18)"}`,background:"rgba(255,255,255,0.1)",color:"white",fontSize:15,fontWeight:500,outline:"none",boxSizing:"border-box",fontFamily:"inherit",transition:"background 0.2s, border-color 0.2s"}}/>
                      </div>
                    ) : (
                      <div style={{marginBottom:20}}>
                        <label style={{display:"block",fontSize:11,fontWeight:600,color:"rgba(255,255,255,0.6)",marginBottom:8,letterSpacing:"0.06em",textTransform:"uppercase"}}>Invitation Code</label>
                        <input type="text" autoComplete="off" value={code} onChange={e => {setCode(e.target.value);setErr("");}} placeholder="Enter your code"
                          onKeyDown={e => {if(e.key==="Enter")handleLogin();}}
                          style={{width:"100%",padding:"14px 16px",borderRadius:10,border:`1px solid ${err?"rgba(255,100,100,0.5)":"rgba(255,255,255,0.18)"}`,background:"rgba(255,255,255,0.1)",color:"white",fontSize:15,fontWeight:500,outline:"none",boxSizing:"border-box",fontFamily:"inherit",transition:"background 0.2s, border-color 0.2s"}}/>
                      </div>
                    )}
                    {err && <p style={{color:"#ff7b7b",fontSize:12,marginTop:6,marginBottom:12}}>{err}</p>}
                    <button onClick={handleLogin} style={{width:"100%",padding:"15px",borderRadius:10,border:"none",background:`linear-gradient(135deg,${G.teal},${G.tealDark})`,color:"white",fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"inherit",boxShadow:"0 4px 24px rgba(26,187,166,0.25)",transition:"transform 0.15s, box-shadow 0.15s"}}
                      onMouseEnter={e => {e.currentTarget.style.transform="translateY(-1px)";e.currentTarget.style.boxShadow="0 6px 30px rgba(26,187,166,0.35)";}}
                      onMouseLeave={e => {e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="0 4px 24px rgba(26,187,166,0.25)";}}>
                      Sign In
                    </button>
                    {isSupabaseConfigured && (
                      <div style={{textAlign:"center",marginTop:14}}>
                        <button onClick={() => {setLoginView("forgot");setErr("");}} style={{background:"none",border:"none",color:"rgba(255,255,255,0.45)",fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>Forgot password?</button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
            <div className={loginPhase>=2?"login-anim login-d6":"login-anim"} style={{opacity:0,transform:"translateY(20px)"}}>
              <div style={{marginTop:28,padding:"0 4px",textAlign:"center"}}>
                <div style={{fontSize:15,fontStyle:"italic",color:"rgba(255,255,255,0.75)",lineHeight:1.7,marginBottom:10}}>"{loginQuote.text}"</div>
                <div style={{fontSize:11,fontWeight:600,color:"rgba(255,255,255,0.4)",letterSpacing:"0.06em",textTransform:"uppercase"}}>— {loginQuote.attr}</div>
              </div>
              <p style={{marginTop:18,fontSize:12,color:"rgba(255,255,255,0.35)",fontWeight:500}}>Need access? Contact your Gillis representative.</p>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes loginLogoIn{0%{opacity:0;transform:scale(0.85)}100%{opacity:1;transform:scale(1)}}
          @keyframes splashWords{0%{opacity:1;transform:translateY(0)}30%{opacity:1;transform:translateY(0)}40%{opacity:1;transform:translateY(-20px)}65%{opacity:1;transform:translateY(-20px)}75%{opacity:1;transform:translateY(-40px)}100%{opacity:1;transform:translateY(-40px)}}
          @keyframes loginFadeUp{0%{opacity:0;transform:translateY(20px)}100%{opacity:1;transform:translateY(0)}}
          .login-anim{opacity:0;transform:translateY(20px)}
          .login-d1{animation:loginFadeUp 0.55s cubic-bezier(0.16,1,0.3,1) 0.3s forwards}
          .login-d2{animation:loginFadeUp 0.55s cubic-bezier(0.16,1,0.3,1) 0.4s forwards}
          .login-d3{animation:loginFadeUp 0.55s cubic-bezier(0.16,1,0.3,1) 0.5s forwards}
          .login-d6{animation:loginFadeUp 0.55s cubic-bezier(0.16,1,0.3,1) 0.85s forwards}
          .login-anim input:focus{background:rgba(255,255,255,0.14)!important;border-color:rgba(26,187,166,0.5)!important}
        `}</style>
      </div>
    );
  }

  // ---- ROLE SELECTION ----
  if (screen === "role-select") {
    return (
      <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:`linear-gradient(160deg,#1a1035 0%,${G.purpleDark} 40%,${G.purple} 70%,#1a1035 100%)`,padding:20}}>
        <div style={{width:"100%",maxWidth:520}}>
          <div style={{textAlign:"center",marginBottom:32}}>
            <div style={{marginBottom:16}}>
              <img src="/images/gillis-logo-white.png" alt="Gillis" style={{width:200,maxWidth:"50vw"}}/>
            </div>
            <p style={{color:"rgba(255,255,255,0.7)",fontSize:16,fontWeight:500,margin:"0 0 4px"}}>Welcome, {userName}.</p>
            <p style={{color:"rgba(255,255,255,0.4)",fontSize:14,margin:0}}>How will you be using AskGillis?</p>
          </div>
          <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr",gap:16}}>
            <button onClick={() => selectRole("seller")} style={{padding:"32px 24px",borderRadius:14,border:"1px solid rgba(255,255,255,0.1)",background:"rgba(255,255,255,0.04)",cursor:"pointer",fontFamily:"inherit",textAlign:"center",transition:"all 0.2s"}}
              onMouseEnter={e => {e.currentTarget.style.borderColor=G.teal;e.currentTarget.style.background="rgba(26,187,166,0.08)";}}
              onMouseLeave={e => {e.currentTarget.style.borderColor="rgba(255,255,255,0.1)";e.currentTarget.style.background="rgba(255,255,255,0.04)";}}>
              <div style={{fontSize:28,marginBottom:12}}>&#127919;</div>
              <div style={{fontSize:16,fontWeight:600,color:"white",marginBottom:6}}>I'm a Seller</div>
              <div style={{fontSize:12,color:"rgba(255,255,255,0.4)",lineHeight:1.5}}>Coaching, drills, and outreach support.</div>
            </button>
            <button onClick={() => selectRole("manager")} style={{padding:"32px 24px",borderRadius:14,border:"1px solid rgba(255,255,255,0.1)",background:"rgba(255,255,255,0.04)",cursor:"pointer",fontFamily:"inherit",textAlign:"center",transition:"all 0.2s"}}
              onMouseEnter={e => {e.currentTarget.style.borderColor="#8B5CF6";e.currentTarget.style.background="rgba(139,92,246,0.08)";}}
              onMouseLeave={e => {e.currentTarget.style.borderColor="rgba(255,255,255,0.1)";e.currentTarget.style.background="rgba(255,255,255,0.04)";}}>
              <div style={{fontSize:28,marginBottom:12}}>&#128202;</div>
              <div style={{fontSize:16,fontWeight:600,color:"white",marginBottom:6}}>I'm a Manager / Leader</div>
              <div style={{fontSize:12,color:"rgba(255,255,255,0.4)",lineHeight:1.5}}>Team insights, patterns, and coaching tools.</div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---- PLATFORM ----
  const mod = MODULES.find(m => m.id === activeModule) || {id:"help",label:"Help & FAQ",icon:"M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01",color:G.muted};
  const sB = "rgba(255,255,255,0.08)";
  const sT = "rgba(255,255,255,0.55)";

  return (
    <div style={{display:"flex",height:"100dvh",color:G.dark,background:G.bg,position:"relative",overflow:"hidden"}}>
      {/* SIDEBAR BACKDROP (mobile/tablet) */}
      {isCompact && sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",zIndex:90}}/>}
      {/* SIDEBAR */}
      <div style={{width:220,background:"linear-gradient(180deg,#3D2B6B 0%,#2d1f5e 100%)",display:"flex",flexDirection:"column",flexShrink:0,...(isCompact?{position:"fixed",left:sidebarOpen?0:-240,top:0,bottom:0,zIndex:95,transition:"left 0.25s ease",boxShadow:sidebarOpen?"4px 0 20px rgba(0,0,0,0.3)":"none"}:{})}}>
        <div style={{padding:"16px 20px",borderBottom:`0.5px solid ${sB}`,display:"flex",flexDirection:"column",gap:6}}>
          <img src="/images/gillis-logo-white.png" alt="Gillis" style={{width:100,alignSelf:"flex-start",opacity:0.85}}/>
          <div style={{fontSize:9,fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase",color:G.teal}}>{mode === "manager" ? (profile?.role === 'executive' ? "Executive Dashboard" : profile?.role === 'admin' ? "Administration" : "Leader Dashboard") : "Sales Platform"}</div>
        </div>

        {/* KB indicator (hidden, functionality preserved) */}

        {mode === "seller" ? <>
          <div style={{flex:1,padding:"14px 10px",overflowY:"auto"}}>
            <div style={{fontSize:9,fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase",color:"rgba(255,255,255,0.2)",padding:"0 12px",marginBottom:8}}>Training</div>
            {MODULES.filter(m => m.id !== "hub").map(m => {
              const a = activeModule === m.id;
              return <button key={m.id} onClick={() => {setActiveModule(m.id);if(isCompact)setSidebarOpen(false);}} style={{width:"100%",padding:"10px 14px",borderRadius:8,border:"none",textAlign:"left",cursor:"pointer",fontFamily:"inherit",background:a?"rgba(26,187,166,0.1)":"transparent",color:a?G.teal:sT,fontSize:12.5,fontWeight:a?600:400,marginBottom:2,display:"flex",alignItems:"center",gap:10}}>
                <NavIcon path={m.icon} color={a?G.teal:sT} size={16}/>{m.label}
              </button>;
            })}
            <div style={{borderTop:`0.5px solid ${sB}`,margin:"10px 12px 8px",paddingTop:10}}>
              <div style={{fontSize:9,fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase",color:"rgba(255,255,255,0.2)",marginBottom:8}}>Resources</div>
              {(() => { const m = MODULES.find(x => x.id === "hub"); const a = activeModule === "hub"; return m ? <button onClick={() => {setActiveModule("hub");if(isCompact)setSidebarOpen(false);}} style={{width:"100%",padding:"10px 14px",borderRadius:8,border:"none",textAlign:"left",cursor:"pointer",fontFamily:"inherit",background:a?"rgba(255,255,255,0.06)":"transparent",color:a?"rgba(255,255,255,0.7)":sT,fontSize:12.5,fontWeight:a?600:400,marginBottom:2,display:"flex",alignItems:"center",gap:10}}>
                <NavIcon path={m.icon} color={a?"rgba(255,255,255,0.7)":sT} size={16}/>{m.label}
              </button> : null; })()}
            </div>
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
        </> : <>
          <div style={{flex:1,padding:"14px 10px",overflowY:"auto"}}>
            <div style={{fontSize:9,fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase",color:"rgba(255,255,255,0.2)",padding:"0 12px",marginBottom:8}}>Dashboard</div>
            {[{id:"team",label:"Team Overview"},{id:"patterns",label:"Patterns & Topics"},{id:"kb",label:"Knowledge Base"}].map(n => {
              const a = mgrView === n.id && !selectedUser && activeModule !== "help";
              return <button key={n.id} onClick={() => {setMgrView(n.id);setSelectedUser(null);setActiveModule("__mgr");if(isCompact)setSidebarOpen(false);}} style={{width:"100%",padding:"10px 14px",borderRadius:8,border:"none",textAlign:"left",cursor:"pointer",fontFamily:"inherit",background:a?"rgba(26,187,166,0.1)":"transparent",color:a?G.teal:sT,fontSize:12.5,fontWeight:a?600:400,marginBottom:2}}>{n.label}</button>;
            })}
          </div>
          <div style={{padding:"10px 10px"}}>
            <button onClick={() => {if(streamTickerRef.current){clearInterval(streamTickerRef.current);streamTickerRef.current=null;}if(messages.length>=2)saveSession();setChatOpen(p=>!p);}} style={{width:"100%",padding:"10px 14px",borderRadius:8,border:`0.5px solid ${chatOpen?"rgba(26,187,166,0.3)":sB}`,background:chatOpen?"rgba(26,187,166,0.08)":"transparent",color:chatOpen?G.teal:sT,fontSize:12,fontWeight:500,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:8,justifyContent:"center"}}>
              <TammyAvatar size={18}/>{chatOpen ? "Close Tammy" : "Talk to Tammy"}
            </button>
          </div>
        </>}

        <div style={{padding:"6px 10px 0"}}>
          <button onClick={() => {setActiveModule("help");if(isCompact)setSidebarOpen(false);}} style={{width:"100%",padding:"7px 14px",borderRadius:7,border:"none",background:activeModule==="help"?"rgba(255,255,255,0.06)":"transparent",cursor:"pointer",fontFamily:"inherit",color:activeModule==="help"?"rgba(255,255,255,0.7)":sT,fontSize:11.5,fontWeight:400,display:"flex",alignItems:"center",gap:8,textAlign:"left"}}
            onMouseEnter={e => e.currentTarget.style.color="rgba(255,255,255,0.7)"}
            onMouseLeave={e => e.currentTarget.style.color=activeModule==="help"?"rgba(255,255,255,0.7)":sT}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01"/></svg>
            Help & FAQ
          </button>
        </div>
        {(mode === "manager" || userRole === "manager") && <div style={{padding:"4px 10px"}}>
          <button onClick={() => {if(mode==="seller"){setMode("manager");setMgrView("team");setSelectedUser(null);setActiveModule("__mgr");setChatOpen(false);}else{setMode("seller");setActiveModule("onboarding");setChatOpen(window.innerWidth>=1024);}}}
            style={{width:"100%",padding:"6px 14px",borderRadius:7,border:"none",background:"transparent",cursor:"pointer",fontFamily:"inherit",color:"rgba(255,255,255,0.25)",fontSize:10.5,textAlign:"left"}}
            onMouseEnter={e => e.currentTarget.style.color="rgba(255,255,255,0.5)"}
            onMouseLeave={e => e.currentTarget.style.color="rgba(255,255,255,0.25)"}>
            {mode === "seller" ? "Switch to Manager" : "Switch to Seller Mode"}
          </button>
        </div>}
        <div style={{padding:"6px 20px 14px",borderTop:`0.5px solid ${sB}`}}>
          <div style={{fontSize:11,color:"rgba(255,255,255,0.3)",marginBottom:4}}>{profile?.full_name || userName}</div>
          {profile?.title && <div style={{fontSize:10,color:"rgba(255,255,255,0.2)",marginBottom:6}}>{profile.title}</div>}
          <button onClick={() => { signOut(); setScreen("login"); setEmail(""); }}
            style={{background:"transparent",border:"none",color:"rgba(255,255,255,0.25)",fontSize:10,cursor:"pointer",padding:0,fontFamily:"inherit"}}
            onMouseEnter={e => e.currentTarget.style.color="rgba(255,255,255,0.5)"}
            onMouseLeave={e => e.currentTarget.style.color="rgba(255,255,255,0.25)"}>
            Sign out
          </button>
        </div>
      </div>

      {/* CENTER CONTENT */}
      <div style={{flex:1,display:"flex",flexDirection:"column",minWidth:0}}>
        <div style={{padding:isMobile?"10px 14px":"14px 28px",borderBottom:"none",background:G.white,display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0,boxShadow:"0 1px 3px rgba(0,0,0,0.04)"}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            {isCompact && <button onClick={() => setSidebarOpen(true)} style={{background:"none",border:"none",cursor:"pointer",padding:4,display:"flex",alignItems:"center",color:G.dark}}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
            </button>}
            {!isCompact && (mode === "seller" || activeModule === "help") && <NavIcon path={mod.icon} color={mod.color} size={18}/>}
            <span style={{fontSize:isMobile?14:15,fontWeight:600}}>{activeModule === "help" ? "Help & FAQ" : mode === "manager" ? (selectedUser ? selectedUser : mgrView === "kb" ? "Knowledge Base" : mgrView === "patterns" ? "Patterns & Topics" : "Team Overview") : mod.label}</span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:isMobile?4:8}}>
            <button onClick={() => {setSearchOpen(true);setSearchQuery("");}} title="Search" style={{padding:isMobile?"6px":"6px 10px",borderRadius:8,border:`1px solid ${G.border}`,background:G.white,color:G.muted,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:5}}
              onMouseEnter={e => {e.currentTarget.style.borderColor=G.teal;e.currentTarget.style.color=G.teal;}}
              onMouseLeave={e => {e.currentTarget.style.borderColor=G.border;e.currentTarget.style.color=G.muted;}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
              {!isMobile && <>Search<span style={{fontSize:9,color:G.dim,marginLeft:2}}>{navigator.platform?.includes("Mac")?"⌘":"Ctrl+"}K</span></>}
            </button>
            <button onClick={() => setFbOpen(true)} title="Send Feedback" style={{padding:"6px 10px",borderRadius:8,border:`1px solid ${G.border}`,background:G.white,color:G.muted,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:5}}
              onMouseEnter={e => {e.currentTarget.style.borderColor=G.teal;e.currentTarget.style.color=G.teal;}}
              onMouseLeave={e => {e.currentTarget.style.borderColor=G.border;e.currentTarget.style.color=G.muted;}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              Feedback
            </button>
            {!chatOpen && !isMobile && <button onClick={() => setChatOpen(true)} style={{padding:"6px 14px",borderRadius:8,border:"none",background:G.teal,color:"white",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:6}}><TammyAvatar size={16}/>Ask Tammy</button>}
          </div>
        </div>

        <div style={{flex:1,overflowY:"auto",padding:(mode==="manager" && activeModule!=="help")?"0":isMobile?"20px 16px":"28px 36px",paddingBottom:isMobile?"80px":"28px"}}>
          {/* Dashboard views — role-aware routing */}
          {mode === "manager" && activeModule !== "help" && (() => {
            const role = profile?.role;
            // Admin panel
            if (role === 'admin') return <AdminPanel profile={profile} />;
            // Executive dashboard (org-wide)
            if (role === 'executive' && !selectedUser && mgrView === "team") return <ExecutiveDashboard profile={profile} onPodClick={(podId) => { setMgrView("pod-" + podId); }} onSellerClick={(email) => setSelectedUser(email)} onSwitchToSeller={() => { setMode("seller"); setActiveModule("onboarding"); setChatOpen(window.innerWidth >= 1024); }} />;
            // Leader dashboard (pod-scoped)
            if (role === 'leader' && !selectedUser && mgrView === "team") return <LeaderDashboard profile={profile} visiblePodIds={visiblePodIds} onSellerClick={(email) => setSelectedUser(email)} onSwitchToSeller={() => { setMode("seller"); setActiveModule("onboarding"); setChatOpen(window.innerWidth >= 1024); }} />;
            // Fallback: original manager dashboard for non-profiled users or sub-views
            if (!selectedUser && mgrView === "team") return <ManagerDashboard teamData={teamData} userName={userName} onSelectUser={name => setSelectedUser(name)} />;
            if (selectedUser && teamData[selectedUser]) return <SellerDetail name={selectedUser} data={teamData[selectedUser]} onBack={() => setSelectedUser(null)} />;
            if (selectedUser && !teamData[selectedUser]) return <div style={{padding:"32px 40px"}}><button onClick={() => setSelectedUser(null)} style={{background:"none",border:"none",cursor:"pointer",fontSize:12,color:G.teal,fontFamily:"inherit",padding:0}}>← Back to Team</button><p style={{fontSize:13,color:G.muted,marginTop:16}}>This team member's data is no longer available.</p></div>;
            if (!selectedUser && mgrView === "patterns") return <PatternsView teamData={teamData} />;
            if (!selectedUser && mgrView === "kb") return <KBAdmin kbWords={kbWords} hasOverride={hasKBOverride} onUpdate={(text) => {kbRef.current=text;setKbWords(text.split(/\s+/).length);setHasKBOverride(true);}} onReset={() => {kbRef.current=KNOWLEDGE_BASE;setKbWords(KNOWLEDGE_BASE.split(/\s+/).length);setHasKBOverride(false);}}/>;
            return null;
          })()}

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
                      onMouseEnter={e => {const el=e.currentTarget.querySelector('.ob-label');if(el)el.style.color=G.teal;}}
                      onMouseLeave={e => {const el=e.currentTarget.querySelector('.ob-label');if(el)el.style.color=done?G.dim:G.dark;}}>
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
                <button onClick={() => {setChatOpen(true);sendMessage("I've entered my target details. Help me build my approach.");}} disabled={!od.company.trim()} style={{padding:"12px 24px",borderRadius:9,border:"none",background:od.company.trim()?G.teal:G.borderLight,color:od.company.trim()?"white":G.dim,fontSize:13,fontWeight:600,cursor:od.company.trim()?"pointer":"default",fontFamily:"inherit"}}>Build my approach with Tammy</button>
                {!od.company.trim() && <p style={{fontSize:11,color:G.dim,margin:"10px 0 0"}}>Enter at least a company name to get started.</p>}
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

              <div style={{marginTop:28,padding:"18px 20px",borderRadius:10,border:`1px dashed ${G.border}`,background:G.white,textAlign:"center"}}>
                <div style={{fontSize:13,fontWeight:500,color:G.text,marginBottom:8}}>Something else on your mind?</div>
                <button onClick={() => {setChatOpen(true);sendMessage("I have a situation I need help with.");}} style={{padding:"8px 18px",borderRadius:8,border:"none",background:G.lilac,color:"white",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Just tell Tammy</button>
              </div>
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
                <button onClick={() => {setChatOpen(true);sendMessage(`Ready to role play. Calling ${rp.who}${rp.segment?" in "+rp.segment:""}. Objective: ${rp.objective||"get a meeting"}. Play the prospect.`);}} disabled={!rp.who.trim()} style={{padding:"12px 24px",borderRadius:9,border:"none",background:rp.who.trim()?G.orange:G.borderLight,color:rp.who.trim()?"white":G.dim,fontSize:13,fontWeight:600,cursor:rp.who.trim()?"pointer":"default",fontFamily:"inherit"}}>Start Role Play</button>
                {!rp.who.trim() && <p style={{fontSize:11,color:G.dim,margin:"10px 0 0"}}>Tell Tammy who you're calling to get started.</p>}
              </div>
            </div>
          )}

          {/* Sharpener */}
          {mode === "seller" && activeModule === "sharpener" && (
            <div>
              <h2 style={{fontSize:20,fontWeight:600,margin:"0 0 4px"}}>Daily Sharpener</h2>
              <p style={{fontSize:13,color:G.text,lineHeight:1.7,margin:"0 0 24px",maxWidth:540}}>Pick a drill. Give it your best shot. Tammy gives you feedback. Five minutes, real reps, real improvement.</p>

              <button onClick={() => {
                const cat = SHARPENER_CATEGORIES[Math.floor(Math.random() * SHARPENER_CATEGORIES.length)];
                const pick = cat.items[Math.floor(Math.random() * cat.items.length)];
                setChatOpen(true); sendMessage("Here's my drill (" + cat.category + "):\n\n" + pick.scenario + "\n\nLet me give it a shot.");
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
              <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr",gap:12}}>
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

          {/* Gillis Hub */}
          {mode === "seller" && activeModule === "hub" && (
            <div>
              <h2 style={{fontSize:20,fontWeight:600,margin:"0 0 4px"}}>Gillis Hub</h2>
              <p style={{fontSize:13,color:G.text,lineHeight:1.7,margin:"0 0 20px",maxWidth:540}}>Your go-to for anything Gillis. Systems, policies, contacts, forms, and answers.</p>
              <div style={{display:"flex",gap:8,marginBottom:28}}>
                <input value={socialInput} onChange={e => setSocialInput(e.target.value)} placeholder="Search for anything..." onKeyDown={e => {if(e.key==="Enter"&&socialInput.trim()){setChatOpen(true);sendMessage(socialInput.trim());setSocialInput("");}}}
                  style={{flex:1,padding:"11px 16px",border:`1px solid ${G.border}`,borderRadius:10,fontSize:13,fontFamily:"inherit",color:G.dark,outline:"none",background:G.white}}
                  onFocus={e => e.currentTarget.style.borderColor="#6B7280"}
                  onBlur={e => e.currentTarget.style.borderColor=G.border}/>
                <button onClick={() => {if(socialInput.trim()){setChatOpen(true);sendMessage(socialInput.trim());setSocialInput("");}}} disabled={!socialInput.trim()}
                  style={{padding:"11px 20px",borderRadius:10,border:"none",background:socialInput.trim()?"#6B7280":G.borderLight,color:socialInput.trim()?"white":G.dim,fontSize:13,fontWeight:600,cursor:socialInput.trim()?"pointer":"default",fontFamily:"inherit"}}>Ask</button>
              </div>
              {HUB_CATEGORIES.map((cat, ci) => (
                <div key={ci} style={{marginTop:ci > 0 ? 24 : 0}}>
                  <div style={{fontSize:11,fontWeight:600,color:G.muted,letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:8}}>{cat.category}</div>
                  <div style={{display:"flex",flexDirection:"column",gap:6}}>
                    {cat.items.map((item, si) => {
                      const borderColor = item.type === "link" ? "#3B82F6" : item.type === "document" ? G.teal : G.lilac;
                      const isPlaceholder = item.placeholder;
                      const isDocHosted = item.type === "document";
                      return (
                        <div key={si}
                          onClick={() => {
                            if (isPlaceholder) return;
                            if (item.type === "link") { window.open(item.url, "_blank"); }
                            else if (item.type === "document" && isDocHosted) {
                              const a = document.createElement("a"); a.href = "/docs/" + item.filename; a.download = item.filename; a.target = "_blank"; document.body.appendChild(a); a.click(); document.body.removeChild(a);
                            }
                            else if (item.type === "document") { setChatOpen(true); sendMessage("Tell me about the " + item.label + ". What's in it and what do I need to know?"); }
                            else { setChatOpen(true); sendMessage(item.prompt); }
                          }}
                          style={{display:"flex",alignItems:"center",gap:14,padding:"12px 16px",borderRadius:8,border:`1px solid ${G.border}`,borderLeft:`3px solid ${isPlaceholder ? G.dim : borderColor}`,background:G.white,cursor:isPlaceholder?"default":"pointer",opacity:isPlaceholder?0.5:1,transition:"all 0.15s"}}
                          onMouseEnter={e => {if(!isPlaceholder){e.currentTarget.style.borderColor=borderColor;e.currentTarget.style.background=borderColor+"0A";}}}
                          onMouseLeave={e => {if(!isPlaceholder){e.currentTarget.style.borderColor=G.border;e.currentTarget.style.borderLeftColor=isPlaceholder?G.dim:borderColor;e.currentTarget.style.background=G.white;}}}>
                          <div style={{flex:1}}>
                            <div style={{fontSize:13,fontWeight:600,color:isPlaceholder?G.dim:G.dark}}>{item.label}</div>
                            {item.desc && <div style={{fontSize:11.5,color:G.muted,marginTop:1}}>{item.desc}</div>}
                          </div>
                          <div style={{flexShrink:0}}>
                            {isPlaceholder ? (
                              <span style={{fontSize:9,fontWeight:600,color:G.dim,background:G.bg,padding:"3px 8px",borderRadius:10}}>Coming soon</span>
                            ) : item.type === "link" ? (
                              <span style={{fontSize:9,fontWeight:600,color:"#3B82F6",background:"#EFF6FF",padding:"3px 8px",borderRadius:10}}>Open &#8599;</span>
                            ) : item.type === "document" && isDocHosted ? (
                              <span style={{fontSize:9,fontWeight:600,color:G.teal,background:G.tealLight,padding:"3px 8px",borderRadius:10}}>Download</span>
                            ) : item.type === "document" ? (
                              <span style={{fontSize:9,fontWeight:600,color:G.lilac,background:G.lilacLight,padding:"3px 8px",borderRadius:10}}>Ask Tammy</span>
                            ) : (
                              <span style={{fontSize:9,fontWeight:600,color:G.lilac,background:G.lilacLight,padding:"3px 8px",borderRadius:10}}>Ask Tammy</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Help & FAQ */}
          {activeModule === "help" && (
            <div style={{maxWidth:620}}>
              <h2 style={{fontSize:20,fontWeight:600,margin:"0 0 4px"}}>Help & FAQ</h2>
              <p style={{fontSize:13,color:G.muted,margin:"0 0 32px"}}>Everything you need to know about using AskGillis.</p>

              <div style={{marginBottom:36}}>
                <div style={{fontSize:15,fontWeight:600,color:G.dark,marginBottom:10}}>What is AskGillis?</div>
                <p style={{fontSize:13,color:G.text,lineHeight:1.8,margin:0}}>AskGillis is your AI-powered sales coach, built on 28 years of Gillis hospitality sales methodology. Tammy is available 24/7 to help you prepare for calls, handle objections, practice scenarios, plan your week, and sharpen your skills.</p>
                <p style={{fontSize:13,color:G.text,lineHeight:1.8,margin:"10px 0 0"}}>She's not a generic chatbot. She knows hotel sales inside and out: the terminology, the segments, the grind of prospecting, and the Gillis way of doing things. Think of her as a senior colleague who's always available and never too busy to help.</p>
              </div>

              <div style={{marginBottom:36}}>
                <div style={{fontSize:15,fontWeight:600,color:G.dark,marginBottom:16}}>How to get the best answers from Tammy</div>
                <div style={{display:"flex",flexDirection:"column",gap:0}}>
                  {HELP_TIPS.map((tip, i) => (
                    <div key={i} style={{padding:"14px 0",borderBottom:i < HELP_TIPS.length - 1 ? `1px solid ${G.borderLight}` : "none"}}>
                      <div style={{fontSize:13,fontWeight:600,color:G.dark,marginBottom:4}}>{tip.title}</div>
                      <div style={{fontSize:13,color:G.text,lineHeight:1.7}}>{tip.body}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{marginBottom:36}}>
                <div style={{fontSize:15,fontWeight:600,color:G.dark,marginBottom:14}}>Module Guide</div>
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {HELP_MODULE_GUIDE.map((m, i) => (
                    <div key={i} style={{display:"flex",gap:12,alignItems:"flex-start",padding:"10px 14px",background:G.white,border:`1px solid ${G.border}`,borderRadius:8}}>
                      <div style={{width:4,height:4,borderRadius:"50%",background:m.color,marginTop:7,flexShrink:0}}/>
                      <div>
                        <span style={{fontSize:13,fontWeight:600,color:G.dark}}>{m.name}</span>
                        <span style={{fontSize:13,color:G.muted,marginLeft:8}}>{m.when}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{marginBottom:20}}>
                <div style={{fontSize:15,fontWeight:600,color:G.dark,marginBottom:14}}>FAQ</div>
                <div style={{display:"flex",flexDirection:"column",gap:4}}>
                  {HELP_FAQS.map((faq, i) => {
                    const open = faqOpen === i;
                    return (
                      <div key={i} style={{background:G.white,border:`1px solid ${G.border}`,borderRadius:8,overflow:"hidden"}}>
                        <button onClick={() => setFaqOpen(open ? null : i)} style={{width:"100%",padding:"12px 16px",border:"none",background:"transparent",cursor:"pointer",fontFamily:"inherit",textAlign:"left",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                          <span style={{fontSize:13,fontWeight:600,color:G.dark}}>{faq.q}</span>
                          <span style={{fontSize:16,color:G.dim,flexShrink:0,marginLeft:12,transform:open?"rotate(180deg)":"rotate(0)",transition:"transform 0.2s"}}>&#9662;</span>
                        </button>
                        {open && (
                          <div style={{padding:"0 16px 14px",fontSize:13,color:G.text,lineHeight:1.7}}>{faq.a}</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* TAMMY CHAT PANEL */}
      {chatOpen && (
        <div style={{...(isCompact?{position:"fixed",top:0,right:0,bottom:0,width:isMobile?"100%":420,zIndex:85,boxShadow:"-8px 0 30px rgba(0,0,0,0.12)"}:{width:420,flexShrink:0,boxShadow:"-1px 0 6px rgba(0,0,0,0.03)"}),borderLeft:"none",background:G.white,display:"flex",flexDirection:"column"}}>
          <div style={{padding:"12px 16px",borderBottom:`1px solid ${G.border}`,display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
            <TammyAvatar size={30}/>
            <div style={{flex:1}}>
              <div style={{fontSize:13,fontWeight:600}}>Tammy</div>
              <div style={{fontSize:9,fontWeight:600,letterSpacing:"0.06em",textTransform:"uppercase",color:mode==="manager"?"#8B5CF6":mod.color}}>{mode==="manager"?"Coaching the Coach":("Coaching: "+mod.label)}</div>
            </div>
            {messages.length > 0 && <button onClick={() => {if(streamTickerRef.current){clearInterval(streamTickerRef.current);streamTickerRef.current=null;}if(messages.length>=2)saveSession();setMessages([]);convRef.current=[];sessionStartRef.current=null;}} title="New conversation" style={{background:"none",border:"none",cursor:"pointer",color:G.muted,padding:4,display:"flex",alignItems:"center"}}
              onMouseEnter={e => e.currentTarget.style.color=G.teal}
              onMouseLeave={e => e.currentTarget.style.color=G.muted}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
            </button>}
            <button onClick={() => setFbOpen(true)} title="Send Feedback" style={{background:"none",border:"none",cursor:"pointer",color:G.muted,padding:4,display:"flex",alignItems:"center"}}
              onMouseEnter={e => e.currentTarget.style.color=G.teal}
              onMouseLeave={e => e.currentTarget.style.color=G.muted}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            </button>
            <button onClick={() => {if(streamTickerRef.current){clearInterval(streamTickerRef.current);streamTickerRef.current=null;}if(messages.length>=2)saveSession();setChatOpen(false);}} style={{background:"none",border:"none",cursor:"pointer",color:G.muted,padding:4,display:"flex",alignItems:"center"}}
              onMouseEnter={e => e.currentTarget.style.color=G.dark}
              onMouseLeave={e => e.currentTarget.style.color=G.muted}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>

          <div ref={scrollRef} style={{flex:1,overflowY:"auto",padding:"14px 12px",display:"flex",flexDirection:"column",gap:10}}>
            {!messages.length && (
              <div style={{padding:"20px 10px",textAlign:"center"}}>
                <TammyAvatar size={40}/>
                <div style={{fontSize:13,fontWeight:600,marginTop:10,marginBottom:4}}>I'm right here</div>
                <div style={{fontSize:12,color:G.muted,lineHeight:1.6,marginBottom:14}}>I can see what you're working on. Ask me anything.</div>
                <div style={{display:"flex",flexDirection:"column",gap:5}}>
                  {(mode==="manager"?["One of my sellers is struggling with objections","How do I coach a rep who's not hitting numbers?","What should I look for in my one-on-ones this week?"]
                    :activeModule==="onboarding"?["What should I focus on first?","Explain the Gillis approach","What does a typical day look like?"]
                    :activeModule==="gameplan"?["Plan my week","Which accounts should I focus on?","What worked last week?"]
                    :activeModule==="outreach"?["Help me write an opening statement","What qualifying questions should I ask?","Draft an outreach email"]
                    :activeModule==="situation"?["I keep hitting the same objection","My pipeline is drying up","I had a rough call"]
                    :activeModule==="roleplay"?["Let's practice a cold call","Throw me a tough objection","Practice a follow-up"]
                    :activeModule==="sharpener"?["Surprise me with a drill","Practice opening statements","Work on objection handling"]
                    :activeModule==="social"?["Fix my LinkedIn headline","Write a connection request","Help me write a post"]
                    :activeModule==="hub"?["Where do I submit expenses?","Tell me about the incentive plan","Who do I contact for help?"]
                    :activeModule==="help"?["How do I get started?","What module should I use?","Give me a quick tip"]
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
              <div key={i} style={{display:"flex",gap:8,alignItems:"flex-start",position:"relative"}} className="tammy-msg">
                <TammyAvatar size={24}/>
                <div style={{flex:1,padding:"11px 14px",background:G.bg,border:`1px solid ${G.border}`,borderRadius:"2px 14px 14px 14px",fontSize:13,color:G.text,lineHeight:1.75,whiteSpace:"pre-wrap"}}>{m.text}</div>
                {m.text && <button onClick={() => {try{navigator.clipboard.writeText(m.text);const btn=document.querySelector(`[data-copy="${i}"]`);if(btn){btn.textContent="Copied!";setTimeout(()=>btn.textContent="Copy",1500);}}catch{}}} data-copy={i}
                  style={{position:"absolute",top:2,right:2,padding:"2px 6px",borderRadius:4,border:"none",background:G.borderLight,color:G.dim,fontSize:9,cursor:"pointer",fontFamily:"inherit",opacity:0,transition:"opacity 0.15s"}}
                  onMouseEnter={e => e.currentTarget.style.opacity=1}
                >Copy</button>}
              </div>
            ) : (
              <div key={i} style={{display:"flex",justifyContent:"flex-end"}}>
                <div style={{maxWidth:"85%",padding:"11px 14px",background:G.purpleLight,border:`1px solid ${G.purpleBorder}`,borderRadius:"14px 2px 14px 14px",fontSize:13,color:G.dark,lineHeight:1.7,whiteSpace:"pre-wrap"}}>{m.text}</div>
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

          {messages.length > 0 && (
            <div style={{padding:"6px 12px 0",flexShrink:0}}>
              <button onClick={() => {if(streamTickerRef.current){clearInterval(streamTickerRef.current);streamTickerRef.current=null;}if(messages.length>=2)saveSession();setMessages([]);convRef.current=[];sessionStartRef.current=null;}}
                style={{width:"100%",padding:"6px",borderRadius:6,border:`1px solid ${G.border}`,background:G.bg,color:G.muted,fontSize:11,fontWeight:500,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:4}}
                onMouseEnter={e => {e.currentTarget.style.borderColor=G.teal;e.currentTarget.style.color=G.teal;}}
                onMouseLeave={e => {e.currentTarget.style.borderColor=G.border;e.currentTarget.style.color=G.muted;}}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                New conversation
              </button>
            </div>
          )}
          <div style={{padding:"10px 12px",borderTop:messages.length>0?"none":`1px solid ${G.border}`,flexShrink:0}}>
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

      {/* MOBILE FLOATING TAMMY BUTTON */}
      {isMobile && !chatOpen && (
        <button onClick={() => setChatOpen(true)} style={{position:"fixed",bottom:20,right:16,width:52,height:52,borderRadius:"50%",background:`linear-gradient(135deg,${G.teal},${G.tealDark})`,border:"none",boxShadow:"0 4px 16px rgba(26,187,166,0.4)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",zIndex:80}}>
          <TammyAvatar size={32}/>
        </button>
      )}

      {/* SEARCH OVERLAY */}
      {searchOpen && (
        <div style={{position:"fixed",inset:0,background:"rgba(44,37,64,0.5)",zIndex:999,display:"flex",alignItems:"flex-start",justifyContent:"center",paddingTop:"12vh"}} onClick={() => {setSearchOpen(false);setSearchQuery("");}}>
          <div style={{background:G.white,borderRadius:16,width:540,maxWidth:"90vw",boxShadow:"0 20px 60px rgba(0,0,0,0.25)",overflow:"hidden"}} onClick={e => e.stopPropagation()}>
            <div style={{display:"flex",alignItems:"center",gap:12,padding:"16px 20px",borderBottom:`1px solid ${G.border}`}}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={G.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
              <input ref={searchRef} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search modules, drills, resources, questions..." autoFocus
                onKeyDown={e => {
                  if (e.key === "Escape") { setSearchOpen(false); setSearchQuery(""); }
                  if (e.key === "Enter" && searchResults.length) {
                    const r = searchResults[0];
                    setSearchOpen(false); setSearchQuery("");
                    if (r.action === "navigate") { setActiveModule(r.module); }
                    else if (r.action === "link") { window.open(r.url, "_blank"); }
                    else if (r.action === "doc") { window.open("/docs/" + r.filename, "_blank"); }
                    else if (r.action === "drill") { setActiveModule("sharpener"); setTimeout(() => {setChatOpen(true);sendMessage("Here's my drill (" + r.category + "):\n\n" + r.scenario + "\n\nLet me give it a shot.");}, 300); }
                    else if (r.action === "prompt") { setActiveModule(r.module); setTimeout(() => {setChatOpen(true);sendMessage(r.prompt);}, 300); }
                  }
                }}
                style={{flex:1,border:"none",outline:"none",fontSize:15,color:G.dark,fontFamily:"inherit",background:"transparent"}}/>
              <span style={{fontSize:10,color:G.dim,background:G.bg,padding:"3px 8px",borderRadius:5,fontFamily:"inherit"}}>ESC</span>
            </div>
            <div style={{maxHeight:400,overflowY:"auto"}}>
              {searchQuery.trim() && !searchResults.length && (
                <div style={{padding:"32px 20px",textAlign:"center",color:G.dim,fontSize:13}}>No results for "{searchQuery}"</div>
              )}
              {!searchQuery.trim() && (
                <div style={{padding:"20px",color:G.muted,fontSize:12,lineHeight:1.6}}>
                  <div style={{fontWeight:600,marginBottom:8,color:G.text}}>Quick tips</div>
                  Try "objection", "expense", "LinkedIn", "opening statement", "incentive plan", or any topic.
                </div>
              )}
              {searchResults.map((r, i) => (
                <div key={i} onClick={() => {
                  setSearchOpen(false); setSearchQuery("");
                  if (r.action === "navigate") { setActiveModule(r.module); }
                  else if (r.action === "link") { window.open(r.url, "_blank"); }
                  else if (r.action === "doc") { window.open("/docs/" + r.filename, "_blank"); }
                  else if (r.action === "drill") { setActiveModule("sharpener"); setTimeout(() => {setChatOpen(true);sendMessage("Here's my drill (" + r.category + "):\n\n" + r.scenario + "\n\nLet me give it a shot.");}, 300); }
                  else if (r.action === "prompt") { setActiveModule(r.module); setTimeout(() => {setChatOpen(true);sendMessage(r.prompt);}, 300); }
                }} style={{padding:"12px 20px",cursor:"pointer",display:"flex",alignItems:"center",gap:12,borderBottom:`1px solid ${G.borderLight}`,transition:"background 0.1s"}}
                  onMouseEnter={e => e.currentTarget.style.background=G.bg}
                  onMouseLeave={e => e.currentTarget.style.background="transparent"}>
                  <div style={{width:4,height:4,borderRadius:"50%",background:r.color,flexShrink:0}}/>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:13,fontWeight:500,color:G.dark,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{r.text}</div>
                    {r.desc && <div style={{fontSize:11,color:G.dim,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{r.desc}</div>}
                  </div>
                  <div style={{flexShrink:0}}>
                    <span style={{fontSize:9,fontWeight:600,color:r.action==="doc"?G.teal:r.action==="link"?"#3B82F6":G.muted,background:r.action==="doc"?G.tealLight:r.action==="link"?"#EFF6FF":G.bg,padding:"3px 8px",borderRadius:10}}>
                      {r.action==="navigate"?"Go to":r.action==="link"?"Open":r.action==="doc"?"Download":r.action==="drill"?"Drill":"Ask Tammy"}
                    </span>
                  </div>
                </div>
              ))}
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
              <div style={{fontSize:11,color:G.dim}}>{messages.length ? `Includes ${messages.length} message${messages.length !== 1 ? "s" : ""} from ${mode==="manager"?"Manager Dashboard":mod.label}` : "No conversation to attach"}</div>
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

      {/* DEV MODE ROLE SWITCHER */}
      {isDevMode && <DevModeSwitcher />}

      <style>{`@keyframes pulse{0%,80%,100%{transform:scale(0.6);opacity:0.3}40%{transform:scale(1);opacity:0.8}}@keyframes fadeInUp{from{opacity:0;transform:translateX(-50%) translateY(10px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}.tammy-msg:hover button[data-copy]{opacity:1!important}@media(max-width:767px){.stats-grid{grid-template-columns:1fr 1fr!important}.patterns-grid{grid-template-columns:1fr!important}button[data-copy]{opacity:0.6!important}}button{transition:all 0.15s ease}::selection{background:rgba(26,187,166,0.2)}`}</style>
    </div>
  );
}
