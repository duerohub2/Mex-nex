"use client";

import { useCallback, useEffect, useState } from "react";

const navItems = [
  ["overview", "Ikhtisar", "▦"],
  ["agents", "AI Agents", "◉"],
  ["tasks", "Tugas", "✓"],
  ["chat", "Chat", "▤"],
  ["departments", "Departemen", "⌂"],
];

export default function Home() {
  const [office, setOffice] = useState(null);
  const [active, setActive] = useState("overview");
  const [message, setMessage] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    try {
      const response = await fetch("/api/office", { cache: "no-store" });
      if (!response.ok) throw new Error("Tidak dapat membaca data kantor.");
      setOffice(await response.json());
      setError("");
    } catch (err) {
      setError(err.message || "Koneksi ke server lokal gagal.");
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  async function submit(action, value) {
    setBusy(true);
    setNotice("");
    try {
      const response = await fetch("/api/office", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...value }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Permintaan gagal.");
      setOffice(result);
      setNotice(action === "message"
        ? "Instruksi tersimpan. Runtime AI belum dihubungkan pada Tahap 1."
        : "Tugas berhasil disimpan.");
      if (action === "message") setMessage("");
      if (action === "add-task") setTaskTitle("");
    } catch (err) {
      setError(err.message || "Terjadi kesalahan.");
    } finally {
      setBusy(false);
    }
  }

  const agents = office?.agents || [];
  const tasks = office?.tasks || [];
  const messages = office?.messages || [];
  const departments = office?.departments || [];

  return (
    <main className="shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">M</div>
          <div><strong>MEX-NEX</strong><span>AI VIRTUAL OFFICE</span></div>
        </div>
        <div className="workspace-label">WORKSPACE</div>
        <nav>
          {navItems.map(([id, label, icon]) => (
            <button key={id} className={active === id ? "nav-item selected" : "nav-item"} onClick={() => setActive(id)}>
              <span className="nav-icon">{icon}</span>{label}
              {id === "tasks" && tasks.length > 0 && <small>{tasks.length}</small>}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="local-indicator"><i /> SERVER LOKAL AKTIF</div>
          <p>Mode pribadi · Tanpa login</p>
          <p className="version">MEX-NEX · Tahap 1</p>
        </div>
      </aside>

      <section className="main-area">
        <header className="topbar">
          <div><span className="eyebrow">RUANG KERJA PRIBADI</span><h1>{navItems.find(x => x[0] === active)?.[1] || "Ikhtisar"}</h1></div>
          <div className="top-status"><span className="status-dot" /> Lokal · 127.0.0.1</div>
        </header>

        {error && <div className="alert error">{error} <button onClick={refresh}>Coba lagi</button></div>}
        {notice && <div className="alert success">{notice}</div>}

        {active === "overview" && (
          <>
            <section className="welcome">
              <div><span className="eyebrow light">PUSAT KOMANDO MEX-NEX</span><h2>Kantor AI-mu,<br />dimulai dari sini.</h2><p>Fondasi kantor lokal sudah disiapkan. Kelola tim, catat instruksi, dan pantau aktivitas dari satu tempat.</p></div>
              <div className="welcome-art"><div className="orb orb-one" /><div className="orb orb-two" /><div className="art-window"><span /><span /><span /><b>MEX<br />NEX</b></div></div>
            </section>
            <section className="stats-grid">
              <Stat label="Total AI Agent" value={agents.length} hint="Profil awal tersedia" />
              <Stat label="Departemen" value={departments.length} hint="Struktur awal kantor" />
              <Stat label="Total tugas" value={tasks.length} hint="Tersimpan lokal" />
              <Stat label="Pesan tersimpan" value={messages.length} hint="Riwayat instruksi" />
            </section>
            <div className="content-grid">
              <section className="panel">
                <div className="panel-heading"><div><span className="eyebrow">TIM KANTOR</span><h3>AI Agents</h3></div><button className="text-button" onClick={() => setActive("agents")}>Lihat semua ↗</button></div>
                <div className="agent-list">{agents.slice(0, 4).map(agent => <AgentCard key={agent.id} agent={agent} />)}</div>
              </section>
              <section className="panel">
                <div className="panel-heading"><div><span className="eyebrow">WORKFLOW</span><h3>Tugas terbaru</h3></div><button className="text-button" onClick={() => setActive("tasks")}>Lihat semua ↗</button></div>
                <TaskList tasks={tasks.slice(0, 5)} />
              </section>
            </div>
          </>
        )}

        {active === "agents" && <section className="panel page-panel"><div className="panel-heading"><div><span className="eyebrow">SUMBER DAYA DIGITAL</span><h3>Daftar AI Agent</h3></div><span className="count-pill">{agents.length} Agent</span></div><div className="agent-grid">{agents.map(agent => <AgentCard key={agent.id} agent={agent} expanded />)}</div></section>}

        {active === "tasks" && <section className="panel page-panel"><div className="panel-heading"><div><span className="eyebrow">MANAJEMEN PEKERJAAN</span><h3>Task Manager</h3></div><span className="count-pill">{tasks.length} tugas</span></div><form className="task-form" onSubmit={e => { e.preventDefault(); if (taskTitle.trim()) submit("add-task", { title: taskTitle.trim() }); }}><input value={taskTitle} onChange={e => setTaskTitle(e.target.value)} placeholder="Tulis tugas baru..." /><button disabled={busy || !taskTitle.trim()}>Tambah tugas</button></form><TaskList tasks={tasks} /></section>}

        {active === "chat" && <section className="panel page-panel chat-panel"><div className="panel-heading"><div><span className="eyebrow">KOMUNIKASI</span><h3>Command Center</h3></div><span className="count-pill">Mode lokal</span></div><div className="chat-notice">Tahap 1: pesan dan instruksi akan disimpan secara lokal. Koneksi ke AI Manager dan runtime Agent akan dibangun pada tahap berikutnya.</div><div className="message-list">{messages.length === 0 ? <div className="empty-state">Belum ada instruksi. Mulai dengan menulis pesan di bawah.</div> : messages.slice().reverse().map(item => <div className="message-item" key={item.id}><b>Kamu</b><p>{item.text}</p><time>{new Date(item.createdAt).toLocaleString("id-ID")}</time></div>)}</div><form className="chat-form" onSubmit={e => { e.preventDefault(); if (message.trim()) submit("message", { text: message.trim() }); }}><input value={message} onChange={e => setMessage(e.target.value)} placeholder="Tulis instruksi untuk kantor..." /><button disabled={busy || !message.trim()}>Simpan instruksi</button></form></section>}

        {active === "departments" && <section className="panel page-panel"><div className="panel-heading"><div><span className="eyebrow">STRUKTUR ORGANISASI</span><h3>Departemen kantor</h3></div><span className="count-pill">{departments.length} departemen</span></div><div className="department-grid">{departments.map(dep => <div className="department-card" key={dep.id}><div className="department-icon">{dep.icon}</div><h4>{dep.name}</h4><p>{dep.description}</p><span>{agents.filter(a => a.departmentId === dep.id).length} Agent</span></div>)}</div></section>}

        <footer className="footer"><span>MEX-NEX · Kantor AI lokal</span><span>Data disimpan di perangkat ini</span></footer>
      </section>
    </main>
  );
}

function Stat({ label, value, hint }) {
  return <div className="stat-card"><span>{label}</span><strong>{value}</strong><small>{hint}</small></div>;
}

function AgentCard({ agent, expanded = false }) {
  return <div className="agent-card"><div className="agent-avatar">{agent.avatar}</div><div className="agent-info"><strong>{agent.name}</strong><span>{agent.role}</span><small>{agent.departmentName}</small></div><span className="agent-status"><i /> {agent.status}</span>{expanded && <p className="agent-description">{agent.description}</p>}</div>;
}

function TaskList({ tasks }) {
  if (!tasks.length) return <div className="empty-state">Belum ada tugas. Tambahkan tugas pertama di menu Task Manager.</div>;
  return <div className="task-list">{tasks.map(task => <div className="task-row" key={task.id}><span className="task-check">{task.status === "done" ? "✓" : "○"}</span><div><strong>{task.title}</strong><small>{task.assignee || "Belum ditugaskan"} · {new Date(task.createdAt).toLocaleDateString("id-ID")}</small></div><span className="task-status">{task.status === "done" ? "Selesai" : "Baru"}</span></div>)}</div>;
}
