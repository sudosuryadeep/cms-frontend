import { useState, useEffect } from "react";
import { useEnrollments } from "../../hooks/useEnrollments";

const GRADE_OPTIONS = [
  { value: "A", label: "A — Excellent",   color: "text-emerald-700 bg-emerald-50" },
  { value: "B", label: "B — Good",        color: "text-sky-700 bg-sky-50"         },
  { value: "C", label: "C — Average",     color: "text-amber-700 bg-amber-50"     },
  { value: "D", label: "D — Below Avg",   color: "text-orange-700 bg-orange-50"   },
  { value: "F", label: "F — Fail",        color: "text-red-600 bg-red-50"         },
];

const gradeConfig = {
  A: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-300" },
  B: { bg: "bg-sky-50",     text: "text-sky-700",     border: "border-sky-300"     },
  C: { bg: "bg-amber-50",   text: "text-amber-700",   border: "border-amber-300"   },
  D: { bg: "bg-orange-50",  text: "text-orange-700",  border: "border-orange-300"  },
  F: { bg: "bg-red-50",     text: "text-red-600",     border: "border-red-300"     },
};

const inputClass =
  "w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent focus:bg-white transition-all";

export default function GradeForm({ initialData = {}, onSubmit, onCancel, loading }) {
  const { enrollments } = useEnrollments();
  const [form, setForm] = useState({ enrollment_id: "", grade: "", ...initialData });

  useEffect(() => {
    if (initialData?.id) setForm(initialData);
  }, [initialData?.id]);

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const selectedGc = gradeConfig[form.grade];

  return (
    <div className="space-y-5">

      {/* Enrollment selector — only on create */}
      {!initialData?.id && (
        <div className="space-y-1.5">
          <label className="flex items-center gap-1 text-xs font-semibold text-slate-600 uppercase tracking-wide">
            Enrollment
            <span className="text-rose-400 text-sm leading-none">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
              </svg>
            </span>
            <select
              name="enrollment_id"
              value={form.enrollment_id}
              onChange={handleChange}
              required
              className={`${inputClass} pl-9 pr-9 appearance-none cursor-pointer`}
            >
              <option value="">Select an enrollment…</option>
              {enrollments.map((e) => (
                <option key={e.id} value={e.id}>
                  #{e.id} — {e.student_name || `Student ${e.student_id}`} / {e.course_name || `Course ${e.course_id}`}
                </option>
              ))}
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </span>
          </div>
          <p className="text-[11px] text-slate-400">{enrollments.length} enrollments available</p>
        </div>
      )}

      {/* Grade selector */}
      <div className="space-y-1.5">
        <label className="flex items-center gap-1 text-xs font-semibold text-slate-600 uppercase tracking-wide">
          Grade
          <span className="text-rose-400 text-sm leading-none">*</span>
        </label>

        {/* Grade pills */}
        <div className="grid grid-cols-5 gap-2">
          {GRADE_OPTIONS.map((g) => {
            const gc = gradeConfig[g.value];
            const selected = form.grade === g.value;
            return (
              <button
                key={g.value}
                type="button"
                onClick={() => setForm((p) => ({ ...p, grade: g.value }))}
                className={`h-12 rounded-xl text-sm font-bold border-2 transition-all duration-150 active:scale-95 ${
                  selected
                    ? `${gc.bg} ${gc.text} ${gc.border} ring-2 ring-offset-1 ring-current shadow-sm`
                    : "bg-slate-50 text-slate-400 border-slate-200 hover:border-slate-300 hover:bg-slate-100"
                }`}
              >
                {g.value}
              </button>
            );
          })}
        </div>

        {/* Selected grade info */}
        {form.grade ? (
          <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${selectedGc?.bg} ${selectedGc?.border} mt-1`}>
            <span className={`text-sm font-bold ${selectedGc?.text}`}>{form.grade}</span>
            <span className={`text-xs ${selectedGc?.text} opacity-80`}>
              {GRADE_OPTIONS.find((g) => g.value === form.grade)?.label.split("—")[1]?.trim()}
            </span>
          </div>
        ) : (
          <p className="text-[11px] text-slate-400 mt-1">Select a grade above</p>
        )}
      </div>

      {/* Editing info */}
      {initialData?.id && (
        <div className="flex items-center gap-2 px-3 py-2.5 bg-amber-50 border border-amber-200 rounded-xl">
          <svg className="w-4 h-4 text-amber-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-xs text-amber-700 font-medium">
            Editing grade for enrollment <span className="font-bold">#{initialData.enrollment_id}</span>
          </p>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-3 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2.5 text-sm font-medium border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => onSubmit(form)}
          disabled={loading || !form.grade || (!initialData?.id && !form.enrollment_id)}
          className="flex-1 px-4 py-2.5 text-sm font-semibold bg-violet-600 text-white rounded-xl hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 shadow-sm shadow-violet-200"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Saving…
            </span>
          ) : initialData?.id ? "Update Grade" : "Assign Grade"}
        </button>
      </div>
    </div>
  );
}