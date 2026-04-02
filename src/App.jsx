import { useState, useRef, useEffect } from "react";
import { SYSTEM_PROMPT } from "./prompt.js";
import { KNOWLEDGE_BASE } from "./knowledgebase.js";

const INVITATION_CODE = "GILLIS2026";

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
  {id:"outreach",label:"Outreach Support",icon:"M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z",color:G.teal},
  {id:"situation",label:"Situation",icon:"M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 8v4M12 16h.01",color:G.lilac},
  {id:"roleplay",label:"Role Play",icon:"M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",color:G.orange},
  {id:"sharpener",label:"Daily Sharpener",icon:"M13 2L3 14h9l-1 8 10-12h-9l1-8z",color:G.gold},
  {id:"methodology",label:"Methodology",icon:"M4 6h16M4 10h16M4 14h10M4 18h7",color:G.muted},
];

const ONBOARDING_WEEKS = [
  {week:"Welcome",title:"Welcome Aboard",status:"current",items:["Computer setup and system access","Self-directed learning modules","Meet and greet with leadership","Introduction to Gillis Academy courses"]},
  {week:"Week 1",title:"The Gillis Brand",status:"locked",items:["Gillis brand, values, and culture","HR policies, health and safety","Systems and tools overview","ASM role and hotel portfolio overview"]},
  {week:"Week 2",title:"Strategic Selling",status:"locked",items:["Hotel onboarding process","Room to Grow: Gillis Strategic Selling","Client experiences and Salesforce","Time management and Dynamic Market Assessment"]},
  {week:"Week 3",title:"Into the Field",status:"locked",items:["Prospecting assignments","Bi-weekly and discovery call observations","Brand training deep-dives","Final Salesforce review"]},
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

const SHARPENER_DRILLS = [
  {type:"Opening Statement",scenario:"You're calling a general contractor who just won the bid for a new recreation complex 2 miles from your hotel. Crews will need rooms for 6+ months. Write your opening statement."},
  {type:"Objection Handling",scenario:"A prospect says: 'We already work with the Hampton Inn down the road and our guys are happy there.' Use the 4A model to respond."},
  {type:"Business Conversation",scenario:"Rewrite this sales pitch as a business conversation: 'Hi, I'm calling from the Courtyard Marriott. We're a newly renovated hotel with free breakfast, parking, and a fitness center. Do you have any travel needs?'"},
  {type:"Qualifying Questions",scenario:"You're meeting with a corporate travel manager whose company is expanding with 3 new distribution centers. Draft 4 qualifying questions: Business Needs, Competition, Decision Making, Event Logistics."},
];

const MODE_PROMPTS = {
  onboarding:"The user is going through onboarding. Guide step by step. Teach through examples.",
  outreach:"Help with outreach using call planner. Reference their target details if entered.",
  situation:"They have a situation. Validate frustration first, then coach. Use 4A for objections.",
  roleplay:"They want to practice. Once scene is set, become the prospect. Be realistic. Give feedback after.",
  sharpener:"Give the exercise, wait for response, give brief direct feedback.",
  methodology:"Explain concepts through real hotel sales scenarios.",
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
  const [drill] = useState(SHARPENER_DRILLS[Math.floor(Math.random()*SHARPENER_DRILLS.length)]);
  const [sessions, setSessions] = useState([]);
  const [teamData, setTeamData] = useState({});
  const [kbWords, setKbWords] = useState(0);
  const [hasKBOverride, setHasKBOverride] = useState(false);

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
    if (activeModule === "sharpener") c += "\nDRILL: " + drill.type + " -- " + drill.scenario;
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
          {mode === "seller" && !chatOpen && <button onClick={() => setChatOpen(true)} style={{padding:"6px 14px",borderRadius:8,border:"none",background:G.teal,color:"white",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:6}}><TammyAvatar size={16}/>Ask Tammy</button>}
        </div>

        <div style={{flex:1,overflowY:"auto",padding:mode==="manager"?"0":"28px 36px"}}>
          {/* Manager views */}
          {mode === "manager" && mgrView === "team" && <ManagerDashboard teamData={teamData} userName={userName}/>}
          {mode === "manager" && mgrView === "kb" && <KBAdmin kbWords={kbWords} hasOverride={hasKBOverride} onUpdate={(text) => {kbRef.current=text;setKbWords(text.split(/\s+/).length);setHasKBOverride(true);}} onReset={() => {kbRef.current=KNOWLEDGE_BASE;setKbWords(KNOWLEDGE_BASE.split(/\s+/).length);setHasKBOverride(false);}}/>}

          {/* Onboarding */}
          {mode === "seller" && activeModule === "onboarding" && (
            <div>
              <h2 style={{fontSize:20,fontWeight:600,margin:"0 0 4px"}}>Your Learning Path</h2>
              <p style={{fontSize:13,color:G.muted,margin:"0 0 24px"}}>Work through each stage. Tammy will guide you.</p>
              <div style={{display:"flex",flexDirection:"column",gap:14}}>
                {ONBOARDING_WEEKS.map((w,i) => (
                  <div key={i} style={{background:G.white,border:`1px solid ${w.status==="current"?G.tealBorder:G.border}`,borderRadius:12,padding:"20px 22px",opacity:w.status==="locked"?0.55:1}}>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
                      <div style={{display:"flex",alignItems:"center",gap:10}}>
                        <div style={{width:28,height:28,borderRadius:"50%",background:w.status==="current"?G.tealLight:G.bg,border:`1.5px solid ${w.status==="current"?G.teal:G.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:600,color:w.status==="current"?G.teal:G.dim}}>{i+1}</div>
                        <div><div style={{fontSize:14,fontWeight:600}}>{w.title}</div><div style={{fontSize:11,color:G.muted}}>{w.week}</div></div>
                      </div>
                      {w.status === "current" && <span style={{fontSize:10,fontWeight:600,color:G.teal,background:G.tealLight,padding:"4px 10px",borderRadius:20,border:`1px solid ${G.tealBorder}`}}>Current</span>}
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
                      {w.items.map((item,j) => <div key={j} style={{fontSize:12,color:G.text,padding:"8px 10px",background:G.bg,borderRadius:6,display:"flex",alignItems:"center",gap:8}}><div style={{width:14,height:14,borderRadius:4,border:`1.5px solid ${G.border}`,flexShrink:0}}/>{item}</div>)}
                    </div>
                  </div>
                ))}
              </div>
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
              <p style={{fontSize:13,color:G.muted,margin:"0 0 24px"}}>Pick what fits or start typing.</p>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                {[{l:"Objection I can't get past",p:"I hit an objection I couldn't handle."},{l:"Prospect went cold",p:"A prospect has gone cold on me."},{l:"Call didn't go well",p:"I just had a call that didn't land."},{l:"Don't know where to start",p:"I'm stuck and don't know where to focus."},{l:"Client relationship issue",p:"Having a challenge with a hotel client."},{l:"Pressure from leadership",p:"Getting pressure about my numbers."}].map((s,i) => (
                  <button key={i} onClick={() => {setChatOpen(true);sendMessage(s.p);}}
                    style={{padding:"18px 16px",borderRadius:10,border:`1px solid ${G.border}`,background:G.white,cursor:"pointer",fontFamily:"inherit",textAlign:"left",transition:"all 0.15s"}}
                    onMouseEnter={e => {e.currentTarget.style.borderColor=G.lilac;e.currentTarget.style.background=G.lilacLight;}}
                    onMouseLeave={e => {e.currentTarget.style.borderColor=G.border;e.currentTarget.style.background=G.white;}}>
                    <div style={{fontSize:13,fontWeight:600,color:G.dark}}>{s.l}</div>
                  </button>
                ))}
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
                <button onClick={() => {setChatOpen(true);sendMessage(`Ready to role play. Calling ${rp.who||"a prospect"}${rp.segment?" in "+rp.segment:""}. Objective: ${rp.objective||"get a meeting"}. Play the prospect.`);}} style={{padding:"12px 24px",borderRadius:9,border:"none",background:G.orange,color:"white",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Start Role Play</button>
              </div>
            </div>
          )}

          {/* Sharpener */}
          {mode === "seller" && activeModule === "sharpener" && (
            <div>
              <h2 style={{fontSize:20,fontWeight:600,margin:"0 0 4px"}}>Today's Drill</h2>
              <p style={{fontSize:13,color:G.muted,margin:"0 0 24px"}}>5 minutes. One exercise. Get sharper.</p>
              <div style={{background:G.white,border:`1.5px solid ${G.goldBorder}`,borderRadius:12,padding:"28px",position:"relative",overflow:"hidden"}}>
                <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:`linear-gradient(90deg,${G.gold},${G.goldBorder})`}}/>
                <div style={{fontSize:10,fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",color:G.gold,marginBottom:12}}>{drill.type}</div>
                <div style={{fontSize:15,fontWeight:500,lineHeight:1.7,color:G.dark,marginBottom:20}}>{drill.scenario}</div>
                <button onClick={() => {setChatOpen(true);sendMessage("I'm ready for the drill.");}} style={{padding:"12px 24px",borderRadius:9,border:"none",background:G.gold,color:"white",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Give it a shot</button>
              </div>
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
                    :activeModule==="outreach"?["Help me write an opening statement","What qualifying questions should I ask?","Draft an outreach email"]
                    :activeModule==="situation"?["I keep hitting the same objection","My pipeline is drying up","I had a rough call"]
                    :activeModule==="roleplay"?["Let's practice a cold call","Throw me a tough objection","Practice a follow-up"]
                    :activeModule==="sharpener"?["I'm ready for the drill","Give me a harder one","Why does this matter?"]
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

      <style>{`@keyframes pulse{0%,80%,100%{transform:scale(0.6);opacity:0.3}40%{transform:scale(1);opacity:0.8}}`}</style>
    </div>
  );
}
