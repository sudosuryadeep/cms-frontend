import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, Building2, GraduationCap, Star,
  AlertCircle, Check, Loader2, ChevronDown,
} from "lucide-react";
import { useDepartments } from "../../hooks/useDepartments";
import { useProfessors }  from "../../hooks/useProfessors";

/* ── Field wrapper ──────────────────────────────────────────────────────── */
function Field({ label, icon: Icon, error, touched, hint, children }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none z-10">
          <Icon size={14} className="text-slate-300" />
        </div>
        {children}
      </div>
      <AnimatePresence>
        {touched && error && (
          <motion.p
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-1 text-[11.5px] text-red-500 font-medium"
          >
            <AlertCircle size={11} />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
      {hint && !(touched && error) && (
        <p className="text-[11.5px] text-slate-400">{hint}</p>
      )}
    </div>
  );
}

/* ── Select wrapper ─────────────────────────────────────────────────────── */
function SelectField({ name, value, onChange, onBlur, touched, hasError, children }) {
  const state = touched && hasError
    ? "border-red-300 focus:ring-red-200 focus:border-red-300"
    : "border-slate-200 hover:border-slate-300 focus:ring-sky-300 focus:border-sky-300";
  return (
    <>
      <select
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`w-full pl-10 pr-8 py-2.5 text-sm rounded-xl border transition-all duration-150
                    appearance-none text-slate-800 bg-white cursor-pointer
                    focus:outline-none focus:ring-2 ${state}`}
      >
        {children}
      </select>
      <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
    </>
  );
}

/* ── Credit dot indicator ───────────────────────────────────────────────── */
function CreditDots({ value }) {
  const max = 10;
  return (
    <div className="flex items-center gap-1 flex-wrap">
      {Array.from({ length: max }).map((_, i) => (
        <div
          key={i}
          className={`w-2 h-2 rounded-full transition-all duration-200 ${
            i < value ? "bg-sky-500 scale-110" : "bg-slate-200"
          }`}
        />
      ))}
    </div>
  );
}

/* ── Main Form ──────────────────────────────────────────────────────────── */
export default function CourseForm({ initialData = {}, onSubmit, onCancel, loading }) {
  const { departments } = useDepartments();
  const { professors }  = useProfessors();

  const [form, setForm] = useState({
    name: "", department_id: "", credits: 3, professor_id: "",
    ...initialData,
  });
  const [touched, setTouched] = useState({
    name: false, department_id: false, credits: false,
  });

  useEffect(() => {
    if (initialData?.id) setForm({ ...initialData });
  }, [initialData?.id]);

  const isEditing = Boolean(initialData?.id);

  /* Validation */
  const errors = {
    name:          form.name.trim().length < 2    ? "Course name must be at least 2 characters." : null,
    department_id: !form.department_id             ? "Please select a department."               : null,
    credits:       !form.credits || form.credits < 1 ? "Credits must be at least 1."             : null,
  };
  const isValid = !errors.name && !errors.department_id && !errors.credits;

  const touch = (field) => setTouched((t) => ({ ...t, [field]: true }));

  const handleChange = (e) => {
    const { name, value } = e.target;
    touch(name);
    setForm((prev) => ({ ...prev, [name]: name === "credits" ? Number(value) : value }));
  };

  const handleSubmit = () => {
    setTouched({ name: true, department_id: true, credits: true });
    if (!isValid) return;
    onSubmit(form);
  };

  /* Selected labels for preview */
  const selectedDept = departments.find((d) => String(d.id) === String(form.department_id));
  const selectedProf = professors.find((p) => String(p.id) === String(form.professor_id));

  const inputBase =
    "w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border transition-all duration-150 " +
    "placeholder-slate-300 text-slate-800 bg-white focus:outline-none focus:ring-2 ";
  const inputState = (field) =>
    touched[field] && errors[field]
      ? "border-red-300 focus:ring-red-200 focus:border-red-300"
      : "border-slate-200 hover:border-slate-300 focus:ring-sky-300 focus:border-sky-300";

  return (
    <div className="space-y-5">

      {/* ── Live Preview Card ───────────────────────────────────────── */}
      <AnimatePresence>
        {form.name.trim() && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1,    y: 0   }}
            exit={{ opacity: 0,   scale: 0.96,  y: -8  }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className="rounded-xl bg-gradient-to-r from-sky-50 to-cyan-50 border border-sky-100 overflow-hidden"
          >
            {/* top mini accent */}
            <div className="h-[2px] bg-gradient-to-r from-sky-400 to-cyan-500" />
            <div className="flex items-center gap-3 p-3.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-cyan-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                <BookOpen size={15} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-800 truncate">{form.name.trim()}</p>
                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                  {selectedDept && (
                    <span className="text-xs text-sky-600 font-semibold flex items-center gap-0.5">
                      <Building2 size={9} /> {selectedDept.name}
                    </span>
                  )}
                  {selectedProf && (
                    <span className="text-xs text-cyan-600 font-semibold flex items-center gap-0.5">
                      <GraduationCap size={9} /> {selectedProf.name}
                    </span>
                  )}
                </div>
              </div>
              {form.credits && (
                <span className="text-xs font-black text-sky-700 bg-sky-100 border border-sky-200 px-2 py-0.5 rounded-full flex-shrink-0">
                  {form.credits} cr
                </span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Name ───────────────────────────────────────────────────── */}
      <Field
        label="Course Name"
        icon={BookOpen}
        error={errors.name}
        touched={touched.name}
        hint='e.g. "Data Structures & Algorithms"'
      >
        <input
          name="name"
          type="text"
          value={form.name}
          onChange={handleChange}
          onBlur={() => touch("name")}
          autoFocus
          placeholder="e.g. Data Structures"
          className={`${inputBase} ${inputState("name")}`}
        />
      </Field>

      {/* ── Department ─────────────────────────────────────────────── */}
      <Field
        label="Department"
        icon={Building2}
        error={errors.department_id}
        touched={touched.department_id}
        hint="The department offering this course."
      >
        <SelectField
          name="department_id"
          value={form.department_id}
          onChange={handleChange}
          onBlur={() => touch("department_id")}
          touched={touched.department_id}
          hasError={!!errors.department_id}
        >
          <option value="">Select department…</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </SelectField>
      </Field>

      {/* ── Credits slider ─────────────────────────────────────────── */}
      <div className="space-y-2">
        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest">
          Credits
        </label>
        <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Course weight</span>
            <span className="inline-flex items-center gap-1 text-sm font-black text-sky-700">
              <Star size={12} />
              {form.credits} {form.credits === 1 ? "credit" : "credits"}
            </span>
          </div>
          <input
            type="range"
            name="credits"
            min={1}
            max={10}
            step={1}
            value={form.credits}
            onChange={handleChange}
            className="w-full accent-sky-500 cursor-pointer"
          />
          <CreditDots value={Number(form.credits)} />
        </div>
      </div>

      {/* ── Professor (optional) ───────────────────────────────────── */}
      <Field
        label="Professor (optional)"
        icon={GraduationCap}
        error={null}
        touched={false}
        hint="Assign a professor to this course."
      >
        <SelectField
          name="professor_id"
          value={form.professor_id}
          onChange={handleChange}
          onBlur={() => {}}
          touched={false}
          hasError={false}
        >
          <option value="">No professor assigned</option>
          {professors.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </SelectField>
      </Field>

      {/* ── Divider ─────────────────────────────────────────────────── */}
      <div className="border-t border-slate-100 pt-1" />

      {/* ── Actions ─────────────────────────────────────────────────── */}
      <div className="flex gap-2.5">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-slate-600 bg-slate-100
                     hover:bg-slate-200 disabled:opacity-40 active:scale-95 transition-all"
        >
          Cancel
        </button>

        <motion.button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          whileTap={{ scale: loading ? 1 : 0.96 }}
          className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white
                     bg-sky-600 hover:bg-sky-700 disabled:opacity-50
                     disabled:cursor-not-allowed transition-all
                     shadow-md shadow-sky-200 flex items-center justify-center gap-2"
        >
          {loading ? (
            <><Loader2 size={15} className="animate-spin" /> Saving…</>
          ) : isEditing ? (
            <><Check size={15} strokeWidth={2.5} /> Update Course</>
          ) : (
            <><BookOpen size={15} strokeWidth={2.5} /> Create Course</>
          )}
        </motion.button>
      </div>
    </div>
  );
}