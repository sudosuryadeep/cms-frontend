import { useState, useEffect } from "react";

export default function SemesterForm({ initialData = {}, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState({ name: "", ...initialData });
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (initialData?.id) setForm(initialData);
  }, [initialData?.id]);

  const isEditing = Boolean(initialData?.id);
  const isValid   = form.name.trim().length > 0;

  const handleChange = (e) => {
    setTouched(true);
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;
    onSubmit(form);
  };

  return (
    <div className="space-y-5">
      {/* ── Field: Semester Name ───────────────────────────────────────── */}
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Semester Name
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="w-4 h-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
          </div>
          <input
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            onBlur={() => setTouched(true)}
            required
            autoFocus
            placeholder="e.g. Spring 2026"
            className={[
              "w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border transition-all",
              "placeholder-slate-300 text-slate-800",
              "focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300",
              touched && !isValid
                ? "border-red-300 bg-red-50 focus:ring-red-200 focus:border-red-300"
                : "border-slate-200 bg-white hover:border-slate-300",
            ].join(" ")}
          />
        </div>

        {touched && !isValid && (
          <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Semester name is required.
          </p>
        )}

        <p className="text-xs text-slate-400">
          Use a clear, descriptive name like "Fall 2025" or "Spring 2026".
        </p>
      </div>

      {/* ── Preview pill ───────────────────────────────────────────────── */}
      {form.name.trim() && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-50 border border-indigo-100">
          <div className="w-5 h-5 rounded-md bg-indigo-500 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
            {form.name.trim()[0]?.toUpperCase()}
          </div>
          <span className="text-sm text-indigo-700 font-medium truncate">{form.name.trim()}</span>
          <span className="ml-auto text-xs text-indigo-400 font-medium">Preview</span>
        </div>
      )}

      {/* ── Divider ────────────────────────────────────────────────────── */}
      <div className="border-t border-slate-100" />

      {/* ── Actions ────────────────────────────────────────────────────── */}
      <div className="flex gap-2.5">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 active:scale-95 transition-all"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading || !isValid}
          className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-all shadow-sm shadow-indigo-200 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Saving…
            </>
          ) : (
            <>
              {isEditing ? (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                  </svg>
                  Update Semester
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  Create Semester
                </>
              )}
            </>
          )}
        </button>
      </div>
    </div>
  );
}