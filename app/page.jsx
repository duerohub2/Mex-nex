"use client";

import { useCallback, useEffect, useState } from "react";

const navItems = [
  ["overview", "Ikhtisar", "▦"],
  ["agents", "AI Agents", "◉"],
  ["tasks", "Tugas", "✓"],
  ["chat", "Chat", "▤"],
  ["departments", "Departemen", "⌂"],
];

const emptyAgent = { name: "", role: "", departmentId: "", managerId: "", description: "" };

export default function Home() {
  const [office, setOffice] = useState(null);
  const [active, setActive] = useState("overview");
  const [message, setMessage] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskAssignee, setTaskAssignee] = useState("");
  const [agentForm, setAgentForm] = useState(emptyAgent);
  const [departmentForm, setDepartmentForm] = useState({ name: "", description: "" });
  const [showAgentForm, setShowAgentForm] = useState(false);
  const [showDepartmentForm, setShowDepartmentForm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    try {
      const response = await fetch("/api/office", { cache: "no-store" });
      if (!response.ok) throw new Error("Tidak dapat membaca data kantor.");
      setOffice(await response.json());
      setError("");
    } catch (err) { setError(err.message || "Koneksi ke server lokal gagal."); }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  async function submit(action, value) {
    setBusy(true); setNotice(""); setError("");
    try {
      const response = await fetch("/api/office", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...value }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Permintaan gagal.");
      setOffice(result);
      const labels = {
        message: "Instruksi tersimpan. Runtime AI akan dihubungkan pada tahap integrasi AI.",
        "add-task": "Tugas berhasil dibuat.",
        "create-agent": "AI Agent berhasil ditambahkan ke organisasi.",
        "create-department": "Departemen berhasil dibuat.",
        "assign-task": "Tugas berhasil didelegasikan.",
        "task-status": "Status tugas berhasil diperbarui.",
      };
      setNotice(labels[action] || "Perubahan berhasil disimpan.");
      if (action === "message") setMessage("");
      if (action === "add-task") { setTaskTitle(""); setTaskAssignee(""); }
      if (action === "create-agent") { setAgentForm(emptyAgent); setShowAgentForm(false); }
      if (action === "create-department") { setDepartmentForm({ name: "", description: "" }); setShowDepartmentForm(false); }
    } catch (err) { setError(err.message || "Terjadi kesalahan."); }
    finally { setBusy(false); }
  }

  const agents = office?.agents || [];
  const tasks = office?.tasks || [];
  const messages = office?.messages || [];
  const departments = office?.departments || [];
  const managers = agents.filter(agent => agent.role.toLowerCase().includes("manager") || agent.role.toLowerCase().includes("director"));

  return (
    <main className="shell">
      <aside className="sidebar">
        <div className="brand"><div className="brand-mark">M</div><div><strong>MEX-NEX</strong><span>AI VIRTUAL OFFICE</span></div></div>
        <div className="workspace-label">WORKSPACE</div>
        <nav>{navItems.map(([id, label, icon]) => <button key={id} className={active === id ? "nav-item selected" : "nav-item"} onClick={() => setActive(id)}><span className="nav-icon">{icon}</span>{label}{id === "tasks" && tasks.length > 0 && <small>{tasks.length}</small>}</button>)}</nav>
        <div className="sidebar-bottom"><div className="local-indicator"><i /> SERVER LOKAL AKTIF</div><p>Mode pribadi · Tanpa login</p><p className="version">MEX-NEX · Tahap 2</p></div>
      </aside>
      <section className="main-area">
        <header className="topbar"><div><span className="eyebrow">RUANG KERJA PRIBADI</span><h1>{navItems.find(x => x[0] === active)?.[1] || "Ikhtisar"}</h1></div><div className="top-status"><span className="status-dot" /> Lokal · 127.0.0.1</div></header>
        {error && <div className="alert error">{error} <button onClick={refresh}>Coba lagi</button></div>}
        {notice && <div className="alert success">{notice}</div>}

        {active === "overview" && <>
          <section className="welcome"><div><span className="eyebrow light">PUSAT KOMANDO MEX-NEX</span><h2>Bangun tim AI<br/>yang terorganisasi.</h2><p>Kelola struktur perusahaan, profil Agent, delegasi tugas, dan aktivitas kantor dari satu tempat.</p></div><div className="welcome-art"><div className="orb orb-one"/><div className="orb orb-two"/><div className="art-window"><span/><span/><span/><b>MEX<br/>NEX</b></div></div></section>
          <section className="stats-grid"><Stat label="Total AI Agent" value={agents.length} hint="Profil dalam organisasi"/><Stat label="Departemen" value={departments.length} hint="Unit kerja terdaftar"/><Stat label="Total tugas" value={tasks.length} hint="Termasuk tugas delegasi"/><Stat label="Tugas berjalan" value={tasks.filter(t => t.status === "in_progress").length} hint="Sedang dikerjakan"/></section>
          <div className="content-grid"><section className="panel"><div className="panel-heading"><div><span className="eyebrow">TIM KANTOR</span><h3>Struktur AI Agents</h3></div><button className="text-button" onClick={() => setActive("agents")}>Kelola tim ↗</button></div><div className="agent-list">{agents.slice(0,5).map(agent => <AgentCard key={agent.id} agent={agent}/>)}</div></section><section className="panel"><div className="panel-heading"><div><span className="eyebrow">WORKFLOW</span><h3>Tugas terbaru</h3></div><button className="text-button" onClick={() => setActive("tasks")}>Kelola tugas ↗</button></div><TaskList tasks={tasks.slice(0,5)} agents={agents} onStatus={id => submit("task-status",{taskId:id,status:"in_progress"})}/></section></div>
        </>}

        {active === "agents" && <section className="panel page-panel"><div className="panel-heading"><div><span className="eyebrow">SUMBER DAYA DIGITAL</span><h3>Organisasi AI Agent</h3></div><button className="primary-button" onClick={() => setShowAgentForm(!showAgentForm)}>{showAgentForm ? "Tutup" : "+ Tambah Agent"}</button></div>
          {showAgentForm && <form className="entity-form" onSubmit={e=>{e.preventDefault();submit("create-agent",agentForm);}}><input required placeholder="Nama Agent" value={agentForm.name} onChange={e=>setAgentForm({...agentForm,name:e.target.value})}/><input required placeholder="Jabatan / peran" value={agentForm.role} onChange={e=>setAgentForm({...agentForm,role:e.target.value})}/><select required value={agentForm.departmentId} onChange={e=>setAgentForm({...agentForm,departmentId:e.target.value})}><option value="">Pilih departemen</option>{departments.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}</select><select value={agentForm.managerId} onChange={e=>setAgentForm({...agentForm,managerId:e.target.value})}><option value="">Tanpa atasan langsung</option>{agents.map(a=><option key={a.id} value={a.id}>{a.name} — {a.role}</option>)}</select><textarea placeholder="Tanggung jawab dan deskripsi Agent" value={agentForm.description} onChange={e=>setAgentForm({...agentForm,description:e.target.value})}/><button disabled={busy}>Simpan Agent</button></form>}
          <div className="agent-grid">{agents.map(agent=><AgentCard key={agent.id} agent={agent} expanded/>)}</div>
        </section>}

        {active === "tasks" && <section className="panel page-panel"><div className="panel-heading"><div><span className="eyebrow">MANAJEMEN PEKERJAAN</span><h3>Task Manager & Delegasi</h3></div><span className="count-pill">{tasks.length} tugas</span></div><form className="task-form" onSubmit={e=>{e.preventDefault();if(taskTitle.trim())submit("add-task",{title:taskTitle.trim(),assigneeId:taskAssignee||null});}}><input value={taskTitle} onChange={e=>setTaskTitle(e.target.value)} placeholder="Tulis tugas baru..." required/><select value={taskAssignee} onChange={e=>setTaskAssignee(e.target.value)}><option value="">Belum ditugaskan</option>{agents.map(a=><option key={a.id} value={a.id}>{a.name} · {a.role}</option>)}</select><button disabled={busy||!taskTitle.trim()}>Buat tugas</button></form><TaskList tasks={tasks} agents={agents} onStatus={(id,status)=>submit("task-status",{taskId:id,status})}/></section>}

        {active === "chat" && <section className="panel page-panel chat-panel"><div className="panel-heading"><div><span className="eyebrow">KOMUNIKASI</span><h3>Command Center</h3></div><span className="count-pill">Mode lokal</span></div><div className="chat-notice">Pesan disimpan sebagai instruksi kantor. Pemrosesan otomatis oleh AI Manager akan diaktifkan setelah integrasi runtime AI.</div><div className="message-list">{messages.length===0?<div className="empty-state">Belum ada instruksi.</div>:messages.slice().reverse().map(item=><div className="message-item" key={item.id}><b>Kamu</b><p>{item.text}</p><time>{new Date(item.createdAt).toLocaleString("id-ID")}</time></div>)}</div><form className="chat-form" onSubmit={e=>{e.preventDefault();if(message.trim())submit("message",{text:message.trim()});}}><input value={message} onChange={e=>setMessage(e.target.value)} placeholder="Tulis instruksi untuk kantor..."/><button disabled={busy||!message.trim()}>Simpan instruksi</button></form></section>}

        {active === "departments" && <section className="panel page-panel"><div className="panel-heading"><div><span className="eyebrow">STRUKTUR ORGANISASI</span><h3>Departemen kantor</h3></div><button className="primary-button" onClick={()=>setShowDepartmentForm(!showDepartmentForm)}>{showDepartmentForm?"Tutup":"+ Departemen"}</button></div>
          {showDepartmentForm && <form className="entity-form" onSubmit={e=>{e.preventDefault();submit("create-department",departmentForm);}}><input required placeholder="Nama departemen" value={departmentForm.name} onChange={e=>setDepartmentForm({...departmentForm,name:e.target.value})}/><textarea placeholder="Fungsi dan tanggung jawab departemen" value={departmentForm.description} onChange={e=>setDepartmentForm({...departmentForm,description:e.target.value})}/><button disabled={busy}>Simpan Departemen</button></form>}
          <div className="department-grid">{departments.map(dep=><div className="department-card" key={dep.id}><div className="department-icon">{dep.icon}</div><h4>{dep.name}</h4><p>{dep.description}</p><span>{agents.filter(a=>a.departmentId===dep.id).length} Agent</span></div>)}</div>
        </section>}
        <footer className="footer"><span>MEX-NEX · Kantor AI lokal</span><span>Data disimpan di perangkat ini</span></footer>
      </section>
    </main>
  );
}

function Stat({label,value,hint}){return <div className="stat-card"><span>{label}</span><strong>{value}</strong><small>{hint}</small></div>;}
function AgentCard({agent,expanded=false}){return <div className="agent-card"><div className="agent-avatar">{agent.avatar}</div><div className="agent-info"><strong>{agent.name}</strong><span>{agent.role}</span><small>{agent.departmentName} · {agent.managerName ? "Atasan: "+agent.managerName : "Laporan langsung ke kantor"}</small></div><span className="agent-status"><i/> {agent.status}</span>{expanded&&<p className="agent-description">{agent.description||"Belum ada deskripsi."}</p>}</div>;}
function TaskList({tasks,agents,onStatus}){if(!tasks.length)return <div className="empty-state">Belum ada tugas. Buat tugas pertama di Task Manager.</div>;return <div className="task-list">{tasks.map(task=><div className="task-row" key={task.id}><span className="task-check">{task.status==="done"?"✓":task.status==="in_progress"?"◷":"○"}</span><div><strong>{task.title}</strong><small>{task.assigneeName||"Belum ditugaskan"} · {new Date(task.createdAt).toLocaleDateString("id-ID")}</small></div><select className="status-select" value={task.status} onChange={e=>onStatus(task.id,e.target.value)}><option value="todo">Baru</option><option value="in_progress">Berjalan</option><option value="done">Selesai</option></select></div>)}</div>;}
