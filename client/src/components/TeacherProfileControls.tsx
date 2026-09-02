import { useEffect, useMemo, useState } from "react";
import { ArrowDownAZ, BookmarkPlus, ChevronDown, Clock3, Download, KeyRound, Medal, Pencil, Printer, RefreshCw, RotateCcw, Save, Search, ShieldCheck, Sparkles, Star, Trash2, UsersRound, X } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getPlayerLevelProgress, nicknameError, normalizeNickname, type MosyPlayerProfile } from "@/game/playerProfile";
import { getMosyAvatar } from "@/game/playerAvatars";
import { trpc } from "@/lib/trpc";
import { buildTeacherRosterCsv, formatRosterActivity, getTeacherDefaultRosterPreset, getTeacherRosterCsvFilename, getTeacherRosterReport, normalizeTeacherRosterFilters, shouldAutoRefreshTeacherRoster, TEACHER_ROSTER_AUTO_REFRESH_MS, type TeacherRosterFilters, type TeacherRosterSortDirection, type TeacherRosterSortKey } from "@/game/teacherRoster";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import "./teacherProfileControls.css";
import "./teacherRoster.css";

type TeacherProfileControlsProps = {
  profile: MosyPlayerProfile;
  onRename: (nickname: string) => Promise<void>;
  onReset: () => Promise<void>;
};

type TeacherRosterPreset = TeacherRosterFilters & {
  id: number;
  name: string;
  isDefault: number;
};

function escapeReportHtml(value: string) {
  return value.replace(/[&<>\"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[character] ?? character);
}

export default function TeacherProfileControls({ profile, onRename, onReset }: TeacherProfileControlsProps) {
  const { user, loading } = useAuth();
  const [nickname, setNickname] = useState(profile.nickname);
  const [busy, setBusy] = useState<"rename" | "reset" | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [rosterOpen, setRosterOpen] = useState(false);
  const [sortKey, setSortKey] = useState<TeacherRosterSortKey>("activity");
  const [sortDirection, setSortDirection] = useState<TeacherRosterSortDirection>("desc");
  const [rosterSearch, setRosterSearch] = useState("");
  const [minScoreInput, setMinScoreInput] = useState("");
  const [maxScoreInput, setMaxScoreInput] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");
  const [presetName, setPresetName] = useState("");
  const [presetFeedback, setPresetFeedback] = useState<string | null>(null);
  const [presetBusy, setPresetBusy] = useState<"save" | "default" | number | null>(null);
  const [defaultPresetApplied, setDefaultPresetApplied] = useState(false);
  const [filtersChangedInSession, setFiltersChangedInSession] = useState(false);
  const [className, setClassName] = useState("");
  const [classNameFeedback, setClassNameFeedback] = useState<string | null>(null);
  const [classNameBusy, setClassNameBusy] = useState(false);
  const [classNameDirty, setClassNameDirty] = useState(false);
  const [lastAutoRefresh, setLastAutoRefresh] = useState<Date | null>(null);
  const nicknameIssue = nicknameError(nickname);
  const isAdmin = user?.role === "admin";
  const rosterQuery = trpc.player.teacherRoster.useQuery(undefined, { enabled: isAdmin && rosterOpen, retry: false, staleTime: 15_000 });
  const presetQuery = trpc.player.teacherRosterPresets.useQuery(undefined, { enabled: isAdmin && rosterOpen, retry: false, staleTime: 15_000 });
  const savePresetMutation = trpc.player.teacherSaveRosterPreset.useMutation();
  const deletePresetMutation = trpc.player.teacherDeleteRosterPreset.useMutation();
  const setDefaultPresetMutation = trpc.player.teacherSetDefaultRosterPreset.useMutation();
  const reportPreferenceQuery = trpc.player.teacherRosterReportPreference.useQuery(undefined, { enabled: isAdmin && rosterOpen, retry: false, staleTime: 60_000 });
  const saveReportPreferenceMutation = trpc.player.teacherSaveRosterReportPreference.useMutation();
  const parseScore = (value: string) => value.trim() === "" || !Number.isFinite(Number(value)) ? null : Math.max(0, Math.floor(Number(value)));
  const rosterFilters = useMemo<TeacherRosterFilters>(() => normalizeTeacherRosterFilters({ search: rosterSearch, minScore: parseScore(minScoreInput), maxScore: parseScore(maxScoreInput), level: levelFilter === "all" ? null : Number(levelFilter) }), [rosterSearch, minScoreInput, maxScoreInput, levelFilter]);
  const rosterReport = useMemo(() => getTeacherRosterReport(rosterQuery.data ?? [], rosterFilters, sortKey, sortDirection), [rosterQuery.data, rosterFilters, sortKey, sortDirection]);
  const sortedRoster = rosterReport.rows;
  const rosterSummary = rosterReport.summary;
  const hasRosterFilters = Boolean(rosterSearch.trim() || minScoreInput || maxScoreInput || levelFilter !== "all");
  const rosterIsRefreshing = rosterQuery.isFetching || presetQuery.isFetching || reportPreferenceQuery.isFetching;

  useEffect(() => setNickname(profile.nickname), [profile.nickname]);
  useEffect(() => {
    if (reportPreferenceQuery.data && !classNameDirty) setClassName(reportPreferenceQuery.data.className);
  }, [classNameDirty, reportPreferenceQuery.data]);
  useEffect(() => {
    if (!rosterOpen || defaultPresetApplied || filtersChangedInSession || presetQuery.isLoading || presetQuery.isError) return;
    const defaultPreset = getTeacherDefaultRosterPreset((presetQuery.data as TeacherRosterPreset[] | undefined) ?? []);
    if (defaultPreset) {
      setRosterSearch(defaultPreset.search);
      setMinScoreInput(defaultPreset.minScore === null ? "" : String(defaultPreset.minScore));
      setMaxScoreInput(defaultPreset.maxScore === null ? "" : String(defaultPreset.maxScore));
      setLevelFilter(defaultPreset.level === null ? "all" : String(defaultPreset.level));
      setPresetFeedback(`Loaded default view “${defaultPreset.name}”.`);
    }
    setDefaultPresetApplied(true);
  }, [defaultPresetApplied, filtersChangedInSession, presetQuery.data, presetQuery.isError, presetQuery.isLoading, rosterOpen]);
  useEffect(() => {
    if (!rosterOpen) return;
    const refreshWhenVisible = () => {
      const tabVisible = typeof document === "undefined" || document.visibilityState === "visible";
      if (!shouldAutoRefreshTeacherRoster({ rosterOpen, tabVisible, isFetching: rosterIsRefreshing })) return;
      void Promise.all([rosterQuery.refetch(), presetQuery.refetch(), reportPreferenceQuery.refetch()]).then(() => setLastAutoRefresh(new Date()));
    };
    const intervalId = window.setInterval(refreshWhenVisible, TEACHER_ROSTER_AUTO_REFRESH_MS);
    const onVisibilityChange = () => { if (document.visibilityState === "visible") refreshWhenVisible(); };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => { window.clearInterval(intervalId); document.removeEventListener("visibilitychange", onVisibilityChange); };
  }, [reportPreferenceQuery.refetch, presetQuery.refetch, rosterIsRefreshing, rosterOpen, rosterQuery.refetch]);

  if (loading || !isAdmin) return null;

  const rename = async () => {
    if (nicknameIssue) return;
    setBusy("rename");
    setFeedback(null);
    try {
      await onRename(normalizeNickname(nickname));
      setFeedback("Student name saved to the backend.");
    } catch {
      setFeedback("The name could not be saved. Please try again while connected.");
    } finally {
      setBusy(null);
    }
  };

  const reset = async () => {
    setBusy("reset");
    setFeedback(null);
    try {
      await onReset();
    } catch {
      setFeedback("The profile could not be reset. Please try again while connected.");
      setBusy(null);
    }
  };

  const setRosterSort = (nextKey: TeacherRosterSortKey) => {
    if (nextKey === sortKey) {
      setSortDirection((direction) => direction === "asc" ? "desc" : "asc");
      return;
    }
    setSortKey(nextKey);
    setSortDirection(nextKey === "activity" || nextKey === "score" || nextKey === "level" ? "desc" : "asc");
  };

  const sortLabel = (key: TeacherRosterSortKey) => `${key === "nickname" ? "Name" : key === "score" ? "Score" : key === "level" ? "Level" : "Activity"}${sortKey === key ? `, ${sortDirection === "asc" ? "ascending" : "descending"}` : ""}`;
  const markFiltersChanged = () => setFiltersChangedInSession(true);
  const resetRosterFilters = () => {
    markFiltersChanged();
    setRosterSearch("");
    setMinScoreInput("");
    setMaxScoreInput("");
    setLevelFilter("all");
  };

  const applyRosterPreset = (preset: TeacherRosterPreset, automatically = false) => {
    if (!automatically) markFiltersChanged();
    setRosterSearch(preset.search);
    setMinScoreInput(preset.minScore === null ? "" : String(preset.minScore));
    setMaxScoreInput(preset.maxScore === null ? "" : String(preset.maxScore));
    setLevelFilter(preset.level === null ? "all" : String(preset.level));
    setPresetFeedback(automatically ? `Loaded default view “${preset.name}”.` : `Showing “${preset.name}”.`);
  };

  const saveRosterPreset = async () => {
    const name = presetName.trim().replace(/\s+/g, " ");
    if (name.length < 2) {
      setPresetFeedback("Give this view a name with at least two characters.");
      return;
    }
    setPresetBusy("save");
    setPresetFeedback(null);
    try {
      await savePresetMutation.mutateAsync({ name, ...rosterFilters });
      await presetQuery.refetch();
      setPresetName("");
      setPresetFeedback(`Saved “${name}” for this teacher account.`);
    } catch {
      setPresetFeedback("This view could not be saved. Check your connection and try again.");
    } finally {
      setPresetBusy(null);
    }
  };

  const deleteRosterPreset = async (preset: TeacherRosterPreset) => {
    setPresetBusy(preset.id);
    setPresetFeedback(null);
    try {
      const result = await deletePresetMutation.mutateAsync({ presetId: preset.id });
      await presetQuery.refetch();
      setPresetFeedback(result.success ? `Removed “${preset.name}”.` : "That saved view is no longer available.");
    } catch {
      setPresetFeedback("This saved view could not be removed. Please try again while connected.");
    } finally {
      setPresetBusy(null);
    }
  };

  const setDefaultRosterPreset = async (preset: TeacherRosterPreset | null) => {
    setPresetBusy("default");
    setPresetFeedback(null);
    try {
      const result = await setDefaultPresetMutation.mutateAsync({ presetId: preset?.id ?? null });
      await presetQuery.refetch();
      if (!result.success) {
        setPresetFeedback("That saved view is no longer available.");
        return;
      }
      if (preset) {
        applyRosterPreset(preset);
        setPresetFeedback(`“${preset.name}” will load whenever you open the roster.`);
      } else {
        setPresetFeedback("No saved view will load automatically.");
      }
    } catch {
      setPresetFeedback("The default view could not be updated. Please try again while connected.");
    } finally {
      setPresetBusy(null);
    }
  };

  const saveClassName = async () => {
    const normalizedClassName = className.trim().replace(/\s+/g, " ");
    setClassNameBusy(true);
    setClassNameFeedback(null);
    try {
      await saveReportPreferenceMutation.mutateAsync({ className: normalizedClassName });
      await reportPreferenceQuery.refetch();
      setClassName(normalizedClassName);
      setClassNameDirty(false);
      setClassNameFeedback(normalizedClassName ? "Class name saved for your future reports and CSV files." : "Class name cleared from future reports and CSV files.");
    } catch {
      setClassNameFeedback("The class name could not be saved. Please try again while connected.");
    } finally {
      setClassNameBusy(false);
    }
  };

  const describePreset = (preset: TeacherRosterPreset) => {
    const parts = [preset.search ? `“${preset.search}”` : "All names"];
    if (preset.minScore !== null || preset.maxScore !== null) parts.push(`${preset.minScore ?? 0}–${preset.maxScore ?? "∞"} sparks`);
    if (preset.level !== null) parts.push(`Level ${preset.level}`);
    return parts.join(" · ");
  };

  const printRosterReport = () => {
    if (!sortedRoster.length) return;
    const reportWindow = window.open("", "MosyMathTeacherRosterReport", "width=980,height=760");
    if (!reportWindow) {
      setPresetFeedback("Your browser blocked the report window. Please allow pop-ups and try again.");
      return;
    }
    const reportClassName = className.trim();
    const activeFilters = [`Class: ${reportClassName || "Not set"}`, rosterFilters.search ? `Nickname contains “${rosterFilters.search}”` : "All nicknames", rosterFilters.minScore !== null || rosterFilters.maxScore !== null ? `Sparks ${rosterFilters.minScore ?? 0}–${rosterFilters.maxScore ?? "Any"}` : "All spark totals", rosterFilters.level !== null ? `Level ${rosterFilters.level}` : "All levels"].join(" · ");
    const sortName = sortKey === "nickname" ? "Nickname" : sortKey === "score" ? "Sparks" : sortKey === "level" ? "Level" : "Recent activity";
    const directionName = sortDirection === "asc" ? "ascending" : "descending";
    const rows = sortedRoster.map((student, index) => { const level = getPlayerLevelProgress(student.totalScore).level; return `<tr><td>${index + 1}</td><td>${escapeReportHtml(student.nickname)}</td><td>Level ${level.level}<small>${escapeReportHtml(level.title)}</small></td><td>${student.totalScore.toLocaleString()}</td><td>${escapeReportHtml(formatRosterActivity(student.updatedAt))}</td></tr>`; }).join("");
    const generatedAt = new Intl.DateTimeFormat(undefined, { dateStyle: "full", timeStyle: "short" }).format(new Date());
    reportWindow.document.open();
    reportWindow.document.write(`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Mosy Math Adventure — Teacher Roster Report</title><style>@page{size:auto;margin:15mm}*{box-sizing:border-box}body{margin:0;color:#2d2540;font-family:Arial,sans-serif;font-size:11pt}.sheet{max-width:850px;margin:0 auto}.brand{color:#805397;font-size:9pt;font-weight:800;letter-spacing:.12em}.headline{margin:4px 0;font-size:24pt;color:#3f3256}.meta{color:#695d78;line-height:1.55}.summary{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin:20px 0}.summary div{border:1px solid #d9cee3;border-radius:10px;padding:12px}.summary b{display:block;color:#925d7b;font-size:20pt}.summary span{color:#6d5a78;font-size:8pt;font-weight:800;letter-spacing:.08em}table{width:100%;border-collapse:collapse;margin-top:16px}th{text-align:left;background:#f4edfa;color:#6d4b83;font-size:8pt;letter-spacing:.07em}th,td{border:1px solid #dfd5e6;padding:9px 8px;vertical-align:top}td:nth-child(1){width:36px;color:#725b7c}td:nth-child(4){text-align:right;font-weight:700}td small{display:block;color:#796a83;margin-top:2px}.footer{margin-top:18px;color:#796b81;font-size:8pt}@media print{.sheet{max-width:none}}</style></head><body><main class="sheet"><div class="brand">MOSY MATH ADVENTURE · TEACHER MEETING REPORT</div><h1 class="headline">Filtered Student Roster</h1><p class="meta"><b>Report generated:</b> ${escapeReportHtml(generatedAt)}<br><b>Filters:</b> ${escapeReportHtml(activeFilters)}<br><b>Sort:</b> ${escapeReportHtml(sortName)} (${escapeReportHtml(directionName)})</p><section class="summary"><div><b>${rosterSummary.totalStudents}</b><span>FILTERED STUDENTS</span></div><div><b>${rosterSummary.averageScore.toLocaleString()}</b><span>AVERAGE SPARKS</span></div></section><table><thead><tr><th>#</th><th>NICKNAME</th><th>DERIVED LEVEL</th><th>SPARKS</th><th>LAST ACTIVITY</th></tr></thead><tbody>${rows}</tbody></table><p class="footer">This report contains only the currently filtered roster records available to the authenticated teacher when it was generated.</p></main></body></html>`);
    reportWindow.document.close();
    window.setTimeout(() => { reportWindow.focus(); reportWindow.print(); }, 120);
  };

  const exportRosterCsv = () => {
    if (!sortedRoster.length) return;
    const reportClassName = className.trim();
    const csv = buildTeacherRosterCsv(sortedRoster, reportClassName);
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = getTeacherRosterCsvFilename(new Date(), reportClassName);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
  };

  const toggleRoster = () => {
    const willOpen = !rosterOpen;
    setRosterOpen(willOpen);
    if (willOpen) {
      setDefaultPresetApplied(false);
      setFiltersChangedInSession(false);
      setPresetFeedback(null);
    }
  };

  const presets = (presetQuery.data ?? []) as TeacherRosterPreset[];

  return <section className="mosy-teacher-controls" aria-label="Teacher shared-device controls">
    <div className="mosy-teacher-heading"><ShieldCheck size={16} /><div><b>TEACHER CONTROLS</b><span>Backend-protected shared-device profile tools</span></div></div>
    <label><span>RENAME ACTIVE STUDENT</span><input value={nickname} maxLength={18} onChange={(event) => setNickname(event.target.value.slice(0, 18))} aria-invalid={!!nicknameIssue} /></label>
    <div className="mosy-teacher-actions">
      <button type="button" onClick={() => void rename()} disabled={!!nicknameIssue || busy !== null}><Pencil size={14} /> {busy === "rename" ? "SAVING…" : "SAVE NAME"}</button>
      <AlertDialog><AlertDialogTrigger asChild><button type="button" className="is-reset" disabled={busy !== null}><RotateCcw size={14} /> RESET STUDENT</button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Reset this active student?</AlertDialogTitle><AlertDialogDescription>This removes only {profile.nickname}’s saved profile from the backend and this device. Curriculum, game routes, and other classroom settings will not change.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel disabled={busy === "reset"}>CANCEL</AlertDialogCancel><AlertDialogAction onClick={() => void reset()} disabled={busy === "reset"}><KeyRound size={15} /> {busy === "reset" ? "RESETTING…" : "RESET PROFILE"}</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
    </div>
    {nicknameIssue ? <small role="alert">{nicknameIssue}</small> : null}
    {feedback ? <small role="status">{feedback}</small> : null}
    <div className="mosy-roster-toggle"><button type="button" onClick={toggleRoster} aria-expanded={rosterOpen}><UsersRound size={15} /> {rosterOpen ? "HIDE BACKEND ROSTER" : "VIEW BACKEND ROSTER"}<ChevronDown size={15} className={rosterOpen ? "is-open" : ""} /></button></div>
    {rosterOpen ? <section className="mosy-teacher-roster" aria-label="Saved student roster">
      <div className="mosy-roster-header"><div><b>SAVED STUDENTS</b><span>Nickname, score, level, and latest backend activity</span><small className={rosterIsRefreshing ? "is-refreshing" : ""}>{rosterIsRefreshing ? "Updating roster…" : lastAutoRefresh ? `Auto-refreshed ${lastAutoRefresh.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}` : "Auto-refreshes every 30 seconds while open"}</small></div><button type="button" onClick={() => void Promise.all([rosterQuery.refetch(), presetQuery.refetch(), reportPreferenceQuery.refetch()])} disabled={rosterIsRefreshing}><RefreshCw size={14} className={rosterIsRefreshing ? "is-spinning" : ""} /> REFRESH</button></div>
      {rosterQuery.isLoading ? <p className="mosy-roster-message" role="status">Loading saved student profiles…</p> : rosterQuery.isError ? <p className="mosy-roster-message is-error" role="alert">The backend roster is unavailable right now.</p> : <>
        <div className="mosy-roster-summary" aria-label={hasRosterFilters ? "Filtered class summary" : "Class summary"}><div><b>{rosterSummary.totalStudents}</b><span>{hasRosterFilters ? "FILTERED STUDENTS" : rosterSummary.totalStudents === 1 ? "SAVED STUDENT" : "SAVED STUDENTS"}</span></div><div><b>{rosterSummary.averageScore.toLocaleString()}</b><span>AVERAGE SPARKS</span></div></div>
        <div className="mosy-roster-filters" aria-label="Search and filter saved students">
          <label className="mosy-roster-search"><Search size={14} /><input value={rosterSearch} onChange={(event) => { markFiltersChanged(); setRosterSearch(event.target.value); }} placeholder="Search nickname" aria-label="Search student nickname" /></label>
          <label><span>MIN SPARKS</span><input type="number" min="0" inputMode="numeric" value={minScoreInput} onChange={(event) => { markFiltersChanged(); setMinScoreInput(event.target.value); }} aria-label="Minimum score" /></label>
          <label><span>MAX SPARKS</span><input type="number" min="0" inputMode="numeric" value={maxScoreInput} onChange={(event) => { markFiltersChanged(); setMaxScoreInput(event.target.value); }} aria-label="Maximum score" /></label>
          <label><span>LEVEL</span><select value={levelFilter} onChange={(event) => { markFiltersChanged(); setLevelFilter(event.target.value); }} aria-label="Filter by level"><option value="all">All levels</option>{Array.from({ length: 10 }, (_, index) => <option key={index + 1} value={index + 1}>Level {index + 1}</option>)}</select></label>
          <button type="button" className="mosy-roster-clear" onClick={resetRosterFilters} disabled={!hasRosterFilters}><X size={13} /> CLEAR</button>
        </div>
        <section className="mosy-roster-presets" aria-label="Saved teacher roster views">
          <div className="mosy-roster-presets-heading"><BookmarkPlus size={14} /><div><b>SAVED VIEWS</b><span>Private to this teacher account · up to 12</span></div></div>
          <div className="mosy-roster-preset-save"><label><span>VIEW NAME</span><input value={presetName} maxLength={32} onChange={(event) => setPresetName(event.target.value.slice(0, 32))} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); void saveRosterPreset(); } }} placeholder="e.g. Level 3 check-in" aria-label="Name this saved roster view" /></label><button type="button" onClick={() => void saveRosterPreset()} disabled={presetBusy !== null || presetName.trim().length < 2}><Save size={13} /> {presetBusy === "save" ? "SAVING…" : "SAVE VIEW"}</button></div>
          {presetFeedback ? <p className="mosy-roster-preset-feedback" role="status">{presetFeedback}</p> : null}
          {presetQuery.isLoading ? <p className="mosy-roster-preset-feedback" role="status">Loading saved views…</p> : presetQuery.isError ? <p className="mosy-roster-preset-feedback is-error" role="alert">Saved views are unavailable right now.</p> : presets.length ? <div className="mosy-roster-preset-list">{presets.map((preset) => <article key={preset.id}><button type="button" className="mosy-roster-preset-apply" onClick={() => applyRosterPreset(preset)} disabled={presetBusy !== null}><b>{preset.name}</b><span>{describePreset(preset)}</span></button><button type="button" className={`mosy-roster-preset-default${preset.isDefault === 1 ? " is-default" : ""}`} onClick={() => void setDefaultRosterPreset(preset.isDefault === 1 ? null : preset)} disabled={presetBusy !== null} aria-label={preset.isDefault === 1 ? `Clear default saved view ${preset.name}` : `Make ${preset.name} the default saved view`}><Star size={13} /><span>{preset.isDefault === 1 ? "DEFAULT" : "SET DEFAULT"}</span></button><button type="button" className="mosy-roster-preset-delete" onClick={() => void deleteRosterPreset(preset)} disabled={presetBusy !== null} aria-label={`Remove saved view ${preset.name}`}><Trash2 size={13} /><span className="sr-only">Remove</span></button></article>)}</div> : <p className="mosy-roster-preset-feedback">Name the current filters to save this view for later.</p>}
        </section>
        <section className="mosy-roster-class-name" aria-label="Class name for roster exports"><div><b>CLASS NAME FOR EXPORTS</b><span>Optional · private to this teacher account</span></div><div className="mosy-roster-class-name-form"><input value={className} maxLength={80} onChange={(event) => { setClassNameDirty(true); setClassName(event.target.value.slice(0, 80)); }} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); void saveClassName(); } }} placeholder="e.g. Grade 5 · Blue Group" aria-label="Optional class name for exports" /><button type="button" onClick={() => void saveClassName()} disabled={classNameBusy || reportPreferenceQuery.isLoading}>{classNameBusy ? "SAVING…" : "SAVE"}</button></div>{classNameFeedback ? <p className="mosy-roster-class-name-feedback" role="status">{classNameFeedback}</p> : null}{reportPreferenceQuery.isError ? <p className="mosy-roster-class-name-feedback is-error" role="alert">The saved class name is unavailable right now.</p> : null}</section>
        <section className="mosy-roster-report-preview" aria-label="Export the current filtered roster"><Printer size={15} /><div><b>MEETING REPORT READY</b><span>{className.trim() ? `${className.trim()} · ` : ""}{rosterSummary.totalStudents} filtered student{rosterSummary.totalStudents === 1 ? "" : "s"} · {rosterSummary.averageScore.toLocaleString()} average sparks</span></div><div className="mosy-roster-report-actions"><button type="button" onClick={printRosterReport} disabled={!sortedRoster.length}><Printer size={13} /> PRINT</button><button type="button" onClick={exportRosterCsv} disabled={!sortedRoster.length}><Download size={13} /> CSV</button></div></section>
        {rosterQuery.data?.length ? <><div className="mosy-roster-sortbar" role="group" aria-label="Sort filtered students"><button type="button" onClick={() => setRosterSort("nickname")} aria-label={sortLabel("nickname")}><ArrowDownAZ size={13} /> NAME</button><button type="button" onClick={() => setRosterSort("score")} aria-label={sortLabel("score")}><Sparkles size={13} /> SCORE</button><button type="button" onClick={() => setRosterSort("level")} aria-label={sortLabel("level")}><Medal size={13} /> LEVEL</button><button type="button" onClick={() => setRosterSort("activity")} aria-label={sortLabel("activity")}><Clock3 size={13} /> ACTIVITY {sortKey === "activity" ? (sortDirection === "desc" ? "↓" : "↑") : ""}</button></div>{sortedRoster.length ? <div className="mosy-roster-list">{sortedRoster.map((student, index) => { const avatar = getMosyAvatar(student.avatarId); const level = getPlayerLevelProgress(student.totalScore).level; return <article key={`${student.nickname}-${student.updatedAt?.getTime() ?? index}`}><span className="mosy-roster-avatar" style={{ "--avatar-glow": avatar.hue } as React.CSSProperties}>{avatar.image ? <img src={avatar.image} alt="" /> : <i aria-hidden="true">{avatar.icon}</i>}</span><div><b>{student.nickname}</b><small>Level {level.level} · {level.title}</small><time dateTime={student.updatedAt.toISOString()}>Last activity {formatRosterActivity(student.updatedAt)}</time></div><strong>{student.totalScore.toLocaleString()}<small>SPARKS</small></strong></article>; })}</div> : <p className="mosy-roster-message">No saved students match the current search and filters.</p>}</> : <p className="mosy-roster-message">No saved students yet. Profiles will appear here after a student chooses a nickname and character while connected.</p>}
      </>}</section> : null}
  </section>;
}
