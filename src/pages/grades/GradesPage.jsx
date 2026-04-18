import { useState } from "react";
import { useGrades } from "../../hooks/useGrades";
import { useToast } from "../../hooks/useToast";
import Modal from "../../components/ui/Modal";
import Spinner from "../../components/ui/Spinner";
import GradeForm from "./GradeForm";

const gradeConfig = {
  A: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", bar: "bg-emerald-500" },
  B: { bg: "bg-sky-50",     text: "text-sky-700",     border: "border-sky-200",     bar: "bg-sky-500"     },
  C: { bg: "bg-amber-50",   text: "text-amber-700",   border: "border-amber-200",   bar: "bg-amber-500"   },
  D: { bg: "bg-orange-50",  text: "text-orange-700",  border: "border-orange-200",  bar: "bg-orange-500"  },
  F: { bg: "bg-red-50",     text: "text-red-600",     border: "border-red-200",     bar: "bg-red-500"     },
};

const avatarColors = [
  "from-violet-500 to-purple-600",
  "from-sky-500 to-blue-600",
  "from-emerald-500 to-teal-600",
  "from-rose-500 to-pink-600",
  "from-amber-500 to-orange-600",
];

const getAvatarColor = (str = "") => {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = str.charCodeAt(i) + ((h << 5) - h);
  return avatarColors[Math.abs(h) % avatarColors.length];
};

const getInitials = (name = "") =>
  name.split(" ").slice(0, 2).map((w) => w[0]?.toUpperCase()).join("") || "?";

const GradeBadge = ({ grade }) => {
  const gc = gradeConfig[grade] || { bg: "bg-slate-50", text: "text-slate-600", border: "border-slate-200" };
  return (
    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-xs font-bold border ${gc.bg} ${gc.text} ${gc.border}`}>
      {grade || "—"}
    </span>
  );
};

export default function GradesPage() {
  const { grades, loading, error, addGrade, editGrade, removeGrade } = useGrades();
  const toast = useToast();
  const [showModal, setShowModal] = useState(false);
  const [editData,  setEditData]  = useState(null);
  const [saving,    setSaving]    = useState(false);
  const [query,     setQuery]     = useState("");
  const [filterGrade, setFilterGrade] = useState("");

  const filtered = grades.filter((g) => {
    const matchSearch =
      g.student_name?.toLowerCase().includes(query.toLowerCase()) ||
      g.course_name?.toLowerCase().includes(query.toLowerCase()) ||
      String(g.enrollment_id).includes(query);
    const matchGrade = filterGrade ? g.grade === filterGrade : true;
    return matchSearch && matchGrade;
  });

  const gradeCounts = ["A","B","C","D","F"].reduce((acc, g) => {
    acc[g] = grades.filter((x) => x.grade === g).length;
    return acc;
  }, {});

  const closeModal = () => { setShowModal(false); setEditData(null); };

  const handleSubmit = async (data) => {
    setSaving(true);
    const payload = { enrollment_id: parseInt(data.enrollment_id), grade: data.grade };
    const result = editData
      ? await editGrade(editData.id, { grade: payload.grade })
      : await addGrade(payload);
    setSaving(false);
    if (result.success) {
      toast.success(editData ? "Grade updated!" : "Grade assigned!");
      closeModal();
    } else {
      toast.error(result.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this grade?")) return;
    const result = await removeGrade(id);
    result.success ? toast.success("Deleted!") : toast.error(result.message);
  };

  return (
    <div className="space-y-5">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold text-slate-900">Grades</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {grades.length} assigned · {filtered.length} showing
          </p>
        </div>
        <button
          onClick={() => { setEditData(null); setShowModal(true); }}
          className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 active:scale-95 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-all shadow-sm shadow-violet-200 self-start sm:self-auto"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          Assign Grade
        </button>
      </div>

      {/* ── Grade Summary Pills ── */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilterGrade("")}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
            filterGrade === ""
              ? "bg-slate-800 text-white border-slate-800"
              : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
          }`}
        >
          All ({grades.length})
        </button>
        {["A","B","C","D","F"].map((g) => {
          const gc = gradeConfig[g];
          const active = filterGrade === g;
          return (
            <button
              key={g}
              onClick={() => setFilterGrade(active ? "" : g)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                active
                  ? `${gc.bg} ${gc.text} ${gc.border} ring-2 ring-offset-1 ring-current`
                  : `bg-white text-slate-500 border-slate-200 hover:${gc.bg} hover:${gc.text}`
              }`}
            >
              {g} · {gradeCounts[g] || 0}
            </button>
          );
        })}
      </div>

      {/* ── Search ── */}
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
          fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by student, course or enrollment ID…"
          className="w-full pl-9 pr-9 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent placeholder-slate-400 text-slate-800 transition-all"
        />
        {query && (
          <button onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* ── States ── */}
      {loading && (
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-3">
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 rounded-full border-2 border-slate-100" />
              <div className="absolute inset-0 rounded-full border-2 border-t-violet-500 animate-spin" />
            </div>
            <p className="text-xs text-slate-400 font-medium">Loading grades…</p>
          </div>
        </div>
      )}

      {error && !loading && (
        <div className="flex items-center justify-center h-48">
          <div className="text-center bg-red-50 border border-red-100 rounded-2xl px-8 py-6">
            <p className="text-sm font-medium text-red-600">{error}</p>
          </div>
        </div>
      )}

      {/* ── Table ── */}
      {!loading && !error && (
        <>
          {filtered.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 py-16 flex flex-col items-center text-slate-300">
              <svg className="w-12 h-12 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              <p className="text-sm font-medium text-slate-400">
                {query || filterGrade ? "No grades match your filter" : "No grades assigned yet"}
              </p>
              {!query && !filterGrade && (
                <button onClick={() => setShowModal(true)}
                  className="mt-3 text-xs text-violet-500 hover:text-violet-700 font-semibold">
                  + Assign first grade
                </button>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              {/* Desktop table */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/60">
                      <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide w-12">#</th>
                      <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Student</th>
                      <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Course</th>
                      <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide w-20">Enroll</th>
                      <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide w-20">Grade</th>
                      <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide w-24">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filtered.map((g) => {
                      const name = g.student_name || "Unknown";
                      return (
                        <tr key={g.id} className="hover:bg-slate-50/60 transition-colors group">
                          <td className="px-5 py-3.5 text-xs text-slate-400 tabular-nums">{g.id}</td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-2.5">
                              <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${getAvatarColor(name)} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                                {getInitials(name)}
                              </div>
                              <span className="font-medium text-slate-800 text-sm">{name}</span>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 text-slate-500 text-sm">{g.course_name || "—"}</td>
                          <td className="px-5 py-3.5">
                            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-lg">
                              #{g.enrollment_id}
                            </span>
                          </td>
                          <td className="px-5 py-3.5">
                            <GradeBadge grade={g.grade} />
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => { setEditData(g); setShowModal(true); }}
                                className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-violet-600 hover:bg-violet-50 transition-colors"
                                title="Edit"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleDelete(g.id)}
                                className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                title="Delete"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="sm:hidden divide-y divide-slate-100">
                {filtered.map((g) => {
                  const name = g.student_name || "Unknown";
                  return (
                    <div key={g.id} className="px-4 py-4 flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${getAvatarColor(name)} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                        {getInitials(name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800 truncate">{name}</p>
                        <p className="text-xs text-slate-400 truncate">{g.course_name || "—"} · #{g.enrollment_id}</p>
                      </div>
                      <GradeBadge grade={g.grade} />
                      <div className="flex gap-1 shrink-0">
                        <button onClick={() => { setEditData(g); setShowModal(true); }}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-violet-600 hover:bg-violet-50 transition-colors">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button onClick={() => handleDelete(g.id)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/40">
                <p className="text-xs text-slate-400">
                  Showing {filtered.length} of {grades.length} grades
                </p>
              </div>
            </div>
          )}
        </>
      )}

      {/* ── Modal ── */}
      <Modal isOpen={showModal} onClose={closeModal} title={editData ? "Edit Grade" : "Assign Grade"}>
        <GradeForm
          initialData={editData || {}}
          onSubmit={handleSubmit}
          onCancel={closeModal}
          loading={saving}
        />
      </Modal>
    </div>
  );
}