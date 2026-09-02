import { useState } from "react";
import { ArrowLeft, Check, LockKeyhole, LogOut, Music2, PlayCircle, ShieldCheck, VolumeX } from "lucide-react";
import { trpc } from "@/lib/trpc";
import "./adminPanel.css";

type AdminPanelProps = {
  onExit: () => void;
  musicOn: boolean;
  onToggleMusic: () => void;
};

type LessonStatus = "active" | "upcoming" | "archived";

const STATUS_OPTIONS: { id: LessonStatus; label: string }[] = [
  { id: "active", label: "OPEN" },
  { id: "upcoming", label: "LOCKED" },
  { id: "archived", label: "HIDDEN" },
];

export default function AdminPanel({ onExit, musicOn, onToggleMusic }: AdminPanelProps) {
  const utils = trpc.useUtils();
  const meQuery = trpc.admin.me.useQuery();
  const lessonsQuery = trpc.admin.listLessons.useQuery(undefined, { enabled: !!meQuery.data?.isAdmin });
  const loginMutation = trpc.admin.login.useMutation({ onSuccess: () => utils.admin.me.invalidate() });
  const logoutMutation = trpc.admin.logout.useMutation({ onSuccess: () => { utils.admin.me.invalidate(); utils.admin.listLessons.invalidate(); } });
  const setStatusMutation = trpc.admin.setLessonStatus.useMutation({ onSuccess: () => { utils.admin.listLessons.invalidate(); utils.catalog.list.invalidate(); } });
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const isAdmin = !!meQuery.data?.isAdmin;

  const submitLogin = (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    loginMutation.mutate({ password }, { onError: () => setError("Incorrect admin password.") });
  };

  const setStatus = (id: string, status: LessonStatus) => setStatusMutation.mutate({ id, status });

  return <main className="mosy-admin" aria-labelledby="mosy-admin-title">
    <header className="mosy-admin-topbar">
      <button onClick={onExit} data-mosy-hover-sound><ArrowLeft size={17} /> MAIN MENU</button>
      <strong><ShieldCheck size={18} /> ADMIN CONTROL <b>OPEN &amp; CLOSE UNITS</b></strong>
      <button onClick={onToggleMusic} aria-label={musicOn ? "Turn background music off" : "Turn background music on"}>{musicOn ? <Music2 size={18} /> : <VolumeX size={18} />} {musicOn ? "MUSIC" : "MUTED"}</button>
    </header>

    {!isAdmin ? <section className="mosy-admin-login">
      <div className="mosy-admin-lock"><LockKeyhole size={26} /></div>
      <h1 id="mosy-admin-title">Teacher access only.</h1>
      <p>Enter the admin password to open or close any lesson unit.</p>
      <form onSubmit={submitLogin}>
        <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Admin password" autoComplete="current-password" aria-label="Admin password" />
        <button type="submit" disabled={loginMutation.isPending || password.length === 0}>{loginMutation.isPending ? "CHECKING…" : "UNLOCK"}</button>
      </form>
      {error ? <p className="mosy-admin-error" role="alert">{error}</p> : null}
    </section> : <section className="mosy-admin-panel">
      <div className="mosy-admin-heading"><div><p>CONTENT CONTROL</p><h1>Open or close units</h1><span>Students only see units marked OPEN. Locked units stay visible as coming-soon, hidden units disappear.</span></div><button className="mosy-admin-logout" onClick={() => logoutMutation.mutate()}><LogOut size={15} /> LOG OUT</button></div>
      {lessonsQuery.isLoading ? <p className="mosy-admin-status" role="status">Loading units…</p> : lessonsQuery.isError ? <p className="mosy-admin-status is-error" role="alert">Could not load units.</p> : <div className="mosy-admin-units">{lessonsQuery.data?.map((lesson) => <article key={lesson.id} className={`mosy-admin-unit is-${lesson.status}`} style={{ "--unit-accent": lesson.accent } as React.CSSProperties}>
        <div className="mosy-admin-unit-mark" aria-hidden="true">✦</div>
        <div className="mosy-admin-unit-copy"><span>{lesson.topic.toUpperCase()}</span><h3>{lesson.title}</h3><p>{lesson.description}</p></div>
        <div className="mosy-admin-unit-actions">{STATUS_OPTIONS.map((option) => <button key={option.id} className={lesson.status === option.id ? "is-active" : ""} onClick={() => setStatus(lesson.id, option.id)} disabled={setStatusMutation.isPending} data-mosy-hover-sound>{lesson.status === option.id ? <Check size={13} /> : <PlayCircle size={13} />} {option.label}</button>)}</div>
      </article>)}</div>}
    </section>}
  </main>;
}
