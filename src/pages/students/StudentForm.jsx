import { useEffect, useState } from "react";
import { getDepartments } from "../../api/departments";

export default function StudentForm({ form, setForm }) {
  const [departments, setDepartments] = useState([]);
  const [deptLoading, setDeptLoading] = useState(true);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    getDepartments()
      .then((res) => {
        const d = res.data;
        const list = Array.isArray(d) ? d : Array.isArray(d?.data) ? d.data : [];
        setDepartments(list);
      })
      .catch(() => setDepartments([]))
      .finally(() => setDeptLoading(false));
  }, []);

  // Reset image error when URL changes
  useEffect(() => { setImgError(false); }, [form.image]);

  const Field = ({ label, required, children }) => (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1 text-xs font-semibold text-slate-600 uppercase tracking-wide">
        {label}
        {required && <span className="text-rose-400 text-sm leading-none">*</span>}
      </label>
      {children}
    </div>
  );

  const inputClass =
    "w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent focus:bg-white transition-all";

  return (
    <div className="space-y-4">

      {/* Name */}
      <Field label="Full Name" required>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </span>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. Surydeep Singh"
            className={`${inputClass} pl-9`}
          />
        </div>
      </Field>

      {/* Department */}
      <Field label="Department" required>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
            </svg>
          </span>
          <select
            value={form.department_id}
            onChange={(e) => setForm({ ...form, department_id: e.target.value })}
            disabled={deptLoading}
            className={`${inputClass} pl-9 pr-9 appearance-none cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed`}
          >
            <option value="">
              {deptLoading ? "Loading departments…" : "Select a department"}
            </option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
          {/* Chevron */}
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </span>
        </div>

        {/* Dept count badge */}
        {!deptLoading && departments.length > 0 && (
          <p className="text-[11px] text-slate-400 mt-1">
            {departments.length} departments available
          </p>
        )}
        {!deptLoading && departments.length === 0 && (
          <p className="text-[11px] text-rose-400 mt-1">
            No departments found — add one first
          </p>
        )}
      </Field>

      {/* Image URL */}
      <Field label="Photo URL">
        <div className="flex items-center gap-3">
          {/* Avatar preview */}
          <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden">
            {form.image && !imgError ? (
              <img
                src={form.image}
                alt="preview"
                onError={() => setImgError(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-slate-300">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            )}
          </div>

          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
              </svg>
            </span>
            <input
              type="url"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              placeholder="https://example.com/photo.jpg"
              className={`${inputClass} pl-9`}
            />
          </div>
        </div>

        {form.image && imgError && (
          <p className="text-[11px] text-amber-500 mt-1 flex items-center gap-1">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Could not load image — check the URL
          </p>
        )}
        {form.image && !imgError && (
          <p className="text-[11px] text-emerald-500 mt-1 flex items-center gap-1">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l3-3z" clipRule="evenodd" />
            </svg>
            Image loaded successfully
          </p>
        )}
        <p className="text-[11px] text-slate-400 mt-1">Optional — leave blank to use initials avatar</p>
      </Field>

    </div>
  );
}