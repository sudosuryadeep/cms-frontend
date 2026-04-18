import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Building2, ChevronDown, AlertCircle, Check, Loader2 } from "lucide-react";
import { useDepartments } from "../../hooks/useDepartments";

/* ── Avatar preview (same deterministic gradient as the page cards) ─────── */
const AVATAR_GRADIENTS = [
  ["from-emerald-500", "to-teal-600"],
  ["from-teal-500",    "to-cyan-600"],
  ["from-sky-500",     "to-blue-600"],
  ["from-violet-500",  "to-purple-600"],
  ["from-rose-500",    "to-pink-600"],
  ["from-amber-500",   "to-orange-500"],
];

function avatarGradient(name = "") {
  const idx = (name.charCodeAt(0) || 0) % AVATAR_GRADIENTS.length;
  return AVATAR_GRADIENTS[idx];
}

/* ── Floating label input ───────────────────────────────────────────────── */
function Field({ label, icon: Icon, error, touched, hint, children }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
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

/* ── Main Form ──────────────────────────────────────────────────────────── */
export default function ProfessorForm({ initialData = {}, onSubmit, onCancel, loading }) {
  const { departments } = useDepartments();

  const [form, setForm] = useState({ name: "", department_id: "", ...initialData });
  const [touched, setTouched] = useState({ name: false, department_id: false });

  useEffect(() => {
    if (initialData?.id) setForm(initialData);
  }, [initialData?.id]);

  const isEditing = Boolean(initialData?.id);

  /* Validation */
  const errors = {
    name:          form.name.trim().length < 2 ? "Name must be at least 2 characters." : null,
    department_id: !form.department_id           ? "Please select a department."        : null,
  };
  const isValid = !errors.name && !errors.department_id;

  const touch = (field) => setTouched((t) => ({ ...t, [field]: true }));

  const handleChange = (e) => {
    const { name, value } = e.target;
    touch(name);
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    setTouched({ name: true, department_id: true });
    if (!isValid) return;
    onSubmit(form);
  };

  /* Avatar preview */
  const [from, to] = avatarGradient(form.name);
  const initials = form.name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("") || "?";

  const selectedDept = departments.find((d) => String(d.id) === String(form.department_id));

  /* Shared input classes */
  const inputBase =
    "w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border transition-all duration-150 " +
    "placeholder-slate-300 text-slate-800 bg-white " +
    "focus:outline-none focus:ring-2 ";

  const inputState = (field) =>
    touched[field] && errors[field]
      ? "border-red-300 focus:ring-red-200 focus:border-red-300"
      : "border-slate-200 hover:border-slate-300 focus:ring-emerald-300 focus:border-emerald-300";

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
            className="flex items-center gap-3 p-3.5 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50
                       border border-emerald-100"
          >
            {/* Mini avatar */}
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${from} ${to} flex items-center
                            justify-center text-white text-[13px] font-black shadow-sm flex-shrink-0`}>
              {initials}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-800 truncate">{form.name.trim()}</p>
              {selectedDept ? (
                <p className="text-xs text-emerald-600 font-semibold truncate flex items-center gap-1 mt-0.5">
                  <Building2 size={9} />
                  {selectedDept.name}
                </p>
              ) : (
                <p className="text-xs text-slate-400 mt-0.5">No department selected</p>
              )}
            </div>

            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider flex-shrink-0">
              Preview
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Name Field ─────────────────────────────────────────────── */}
      <Field
        label="Professor Name"
        icon={User}
        error={errors.name}
        touched={touched.name}
        hint='Include the title, e.g. "Dr. Priya Sharma"'
      >
        <input
          name="name"
          type="text"
          value={form.name}
          onChange={handleChange}
          onBlur={() => touch("name")}
          autoFocus
          placeholder='e.g. Dr. Rajesh Kumar'
          className={`${inputBase} ${inputState("name")}`}
        />
      </Field>

      {/* ── Department Field ────────────────────────────────────────── */}
      <Field
        label="Department"
        icon={Building2}
        error={errors.department_id}
        touched={touched.department_id}
        hint="The faculty department this professor belongs to."
      >
        <select
          name="department_id"
          value={form.department_id}
          onChange={handleChange}
          onBlur={() => touch("department_id")}
          className={`${inputBase} appearance-none pr-8 cursor-pointer ${inputState("department_id")}`}
        >
          <option value="">Select a department…</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
        <ChevronDown
          size={14}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
        />
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
                     bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50
                     disabled:cursor-not-allowed transition-all
                     shadow-md shadow-emerald-200 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              Saving…
            </>
          ) : isEditing ? (
            <>
              <Check size={15} strokeWidth={2.5} />
              Update Professor
            </>
          ) : (
            <>
              <User size={15} strokeWidth={2.5} />
              Add Professor
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
}