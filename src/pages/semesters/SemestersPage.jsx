import { useState } from "react";
import { useSemesters } from "../../hooks/useSemesters";
import { useToast } from "../../hooks/useToast";
import SemesterForm from "./SemesterForm";

/* ─── Inline Modal (no dependency on external Modal component) ──────────── */
function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-fadeIn">
        {/* Top accent bar */}
        <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500" />

        <div className="px-6 py-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-slate-800 tracking-tight">{title}</h2>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
              aria-label="Close"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

/* ─── Spinner ────────────────────────────────────────────────────────────── */
function Spinner() {
  return (
    <div className="flex flex-col items-center gap-3 py-20">
      <div className="w-9 h-9 rounded-full border-[3px] border-indigo-100 border-t-indigo-500 animate-spin" />
      <p className="text-sm text-slate-400 font-medium">Loading semesters…</p>
    </div>
  );
}

/* ─── Semester Card ──────────────────────────────────────────────────────── */
function SemesterCard({ semester, onEdit, onDelete }) {
  const initials = semester.name
    ?.split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("") || "S";

  return (
    <div className="group relative bg-white border border-slate-200/80 rounded-2xl p-5 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-50 transition-all duration-200">
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-50/0 to-violet-50/0 group-hover:from-indigo-50/60 group-hover:to-violet-50/40 transition-all duration-200 pointer-events-none" />

      <div className="relative flex items-start gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-sm font-bold shadow-sm">
          {initials}
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-slate-800 truncate leading-snug">{semester.name}</p>
          <p className="text-xs text-slate-400 mt-0.5">Semester</p>
        </div>

        {/* Actions — appear on hover */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          <button
            onClick={() => onEdit(semester)}
            title="Edit"
            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(semester.id)}
            title="Delete"
            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
          </button>
        </div>
      </div>

      {/* Bottom action strip */}
      <div className="relative mt-4 pt-3 border-t border-slate-100 flex gap-3">
        <button
          onClick={() => onEdit(semester)}
          className="text-xs font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
        >
          Edit semester
        </button>
        <span className="text-slate-200">·</span>
        <button
          onClick={() => onDelete(semester.id)}
          className="text-xs font-medium text-slate-400 hover:text-red-500 transition-colors"
        >
          Remove
        </button>
      </div>
    </div>
  );
}

/* ─── Empty State ────────────────────────────────────────────────────────── */
function EmptyState({ isFiltered, onAdd }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
        <svg className="w-7 h-7 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
        </svg>
      </div>
      <div className="text-center">
        <p className="font-semibold text-slate-700">
          {isFiltered ? "No results found" : "No semesters yet"}
        </p>
        <p className="text-sm text-slate-400 mt-1">
          {isFiltered ? "Try a different search term." : "Create your first semester to get started."}
        </p>
      </div>
      {!isFiltered && (
        <button
          onClick={onAdd}
          className="mt-1 px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 active:scale-95 transition-all shadow-sm shadow-indigo-200"
        >
          + Add semester
        </button>
      )}
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────────────────────── */
export default function SemestersPage() {
  const { semesters, loading, error, addSemester, editSemester, removeSemester } = useSemesters();
  const toast = useToast();

  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData]   = useState(null);
  const [saving, setSaving]       = useState(false);
  const [query, setQuery]         = useState("");

  const filtered = semesters.filter((s) =>
    s.name?.toLowerCase().includes(query.toLowerCase())
  );

  const openAdd  = () => { setEditData(null);  setShowModal(true); };
  const openEdit = (s) => { setEditData(s);    setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditData(null); };

  const handleSubmit = async (data) => {
    setSaving(true);
    const result = editData
      ? await editSemester(editData.id, data)
      : await addSemester(data);
    setSaving(false);
    if (result.success) {
      toast.success(editData ? "Semester updated!" : "Semester created!");
      closeModal();
    } else {
      toast.error(result.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this semester? This action cannot be undone.")) return;
    const result = await removeSemester(id);
    result.success ? toast.success("Semester deleted.") : toast.error(result.message);
  };

  return (
    <div className="min-h-full bg-slate-50/60 p-6 lg:p-8">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="mb-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-sm">
                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Semesters</h1>
            </div>
            <p className="text-sm text-slate-500 ml-9.5">
              {loading ? "Loading…" : `${semesters.length} semester${semesters.length !== 1 ? "s" : ""} total`}
            </p>
          </div>

          <button
            onClick={openAdd}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 active:scale-95 transition-all shadow-sm shadow-indigo-200 whitespace-nowrap"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Semester
          </button>
        </div>
      </div>

      {/* ── Search ─────────────────────────────────────────────────────── */}
      <div className="relative mb-6">
        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0015.803 15.803z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by semester name…"
          className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl placeholder-slate-400 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition-all"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* ── Stats Bar ──────────────────────────────────────────────────── */}
      {!loading && !error && semesters.length > 0 && query && (
        <p className="text-xs text-slate-400 mb-4 font-medium">
          Showing {filtered.length} of {semesters.length} results
        </p>
      )}

      {/* ── Content ────────────────────────────────────────────────────── */}
      {loading && <Spinner />}
      {error   && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" />
          </svg>
          {error}
        </div>
      )}

      {!loading && !error && (
        filtered.length === 0 ? (
          <EmptyState isFiltered={!!query} onAdd={openAdd} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((s) => (
              <SemesterCard
                key={s.id}
                semester={s}
                onEdit={openEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )
      )}

      {/* ── Modal ──────────────────────────────────────────────────────── */}
      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title={editData ? "Edit Semester" : "New Semester"}
      >
        <SemesterForm
          initialData={editData || {}}
          onSubmit={handleSubmit}
          onCancel={closeModal}
          loading={saving}
        />
      </Modal>
    </div>
  );
}