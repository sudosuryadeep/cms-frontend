import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Building2, Link2, AlertCircle, CheckCircle2, ChevronDown } from "lucide-react";
import { getDepartments } from "../../api/departments";

/* ── Deterministic avatar gradient (same as page) ───────────────────────── */
const GRADIENTS = [
  ["from-rose-500",    "to-pink-600"   ],
  ["from-sky-500",     "to-blue-600"   ],
  ["from-emerald-500", "to-teal-600"   ],
  ["from-amber-500",   "to-orange-600" ],
  ["from-violet-500",  "to-purple-600" ],
  ["from-cyan-500",    "to-sky-600"    ],
];
function getGradient(name = "") {
  let h = 0;
  for (let i = 0; i < name.length; i++)
    h = (name.charCodeAt(i) + ((h << 5) - h)) | 0;
  return GRADIENTS[Math.abs(h) % GRADIENTS.length];
}
function getInitials(name = "") {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("") || "?";
}

/* ── Field wrapper ──────────────────────────────────────────────────────── */
function Field({ label, icon: Icon, error, touched, hint, required, children }) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
        <Icon size={11} className="text-slate-400" />
        {label}
        {required && <span className="text-rose-400 text-[13px] leading-none">*</span>}
      </label>
      <div className="relative">{children}</div>
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
export default function StudentForm({ form, setForm }) {
  const [departments,  setDepartments]  = useState([]);
  const [deptLoading,  setDeptLoading]  = useState(true);
  const [imgError,     setImgError]     = useState(false);
  const [touched,      setTouched]      = useState({ name: false, department_id: false });

  useEffect(() => {
    getDepartments()
      .then((res) => {
        const d = res.data;
        setDepartments(Array.isArray(d) ? d : Array.isArray(d?.data) ? d.data : []);
      })
      .catch(() => setDepartments([]))
      .finally(() => setDeptLoading(false));
  }, []);

  useEffect(() => { setImgError(false); }, [form.image]);

  const touch = (field) => setTouched((t) => ({ ...t, [field]: true }));

  const handleChange = (field, value) => {
    touch(field);
    setForm({ ...form, [field]: value });
  };

  /* Avatar preview */
  const [from, to] = getGradient(form.name);
  const initials   = getInitials(form.name);

  const selectedDept = departments.find((d) => String(d.id) === String(form.department_id));

  const inputBase =
    "w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border transition-all duration-150 " +
    "placeholder-slate-300 text-slate-800 bg-white focus:outline-none focus:ring-2 ";

  const inputState = (field, extra = false) => {
    const hasErr = field === "name"
      ? form.name.trim().length < 2
      : field === "department_id"
        ? !form.department_id
        : false;
    return touched[field] && hasErr && !extra
      ? "border-red-300 focus:ring-red-200 focus:border-red-300"
      : "border-slate-200 hover:border-slate-300 focus:ring-rose-300 focus:border-rose-300";
  };

  return (
    <div className="space-y-5">

      {/* ── Live Preview ────────────────────────────────────────────── */}
      <AnimatePresence>
        {form.name.trim() && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1,    y: 0   }}
            exit={{ opacity: 0,   scale: 0.96,  y: -8  }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className="rounded-xl bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-100 overflow-hidden"
          >
            <div className="h-[2px] bg-gradient-to-r from-rose-400 via-pink-500 to-orange-400" />
            <div className="flex items-center gap-3 p-3.5">
              {/* Avatar */}
              <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${from} ${to}
                              flex items-center justify-center text-white text-xs font-black
                              shadow-sm flex-shrink-0 overflow-hidden`}>
                {form.image && !imgError ? (
                  <img src={form.image} alt="" onError={() => setImgError(true)} className="w-full h-full object-cover" />
                ) : initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-800 truncate">{form.name.trim()}</p>
                {selectedDept ? (
                  <p className="text-xs text-rose-600 font-semibold flex items-center gap-1 mt-0.5 truncate">
                    <Building2 size={9} />
                    {selectedDept.name}
                  </p>
                ) : (
                  <p className="text-xs text-slate-400 mt-0.5">No department selected</p>
                )}
              </div>
              <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider flex-shrink-0">
                Preview
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Name ───────────────────────────────────────────────────── */}
      <Field
        label="Full Name" icon={User} required
        error="Name must be at least 2 characters."
        touched={touched.name && form.name.trim().length < 2}
        hint='Include first and last name, e.g. "Suryadeep Singh"'
      >
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <User size={14} className="text-slate-300" />
        </div>
        <input
          type="text"
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
          onBlur={() => touch("name")}
          autoFocus
          placeholder="e.g. Suryadeep Singh"
          className={`${inputBase} ${inputState("name")}`}
        />
      </Field>

      {/* ── Department ─────────────────────────────────────────────── */}
      <Field
        label="Department" icon={Building2} required
        error="Please select a department."
        touched={touched.department_id && !form.department_id}
        hint={
          !deptLoading && departments.length === 0
            ? undefined
            : !deptLoading
              ? `${departments.length} departments available`
              : undefined
        }
      >
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none z-10">
          <Building2 size={14} className="text-slate-300" />
        </div>
        <select
          value={form.department_id}
          onChange={(e) => handleChange("department_id", e.target.value)}
          onBlur={() => touch("department_id")}
          disabled={deptLoading}
          className={`${inputBase} appearance-none pr-9 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${inputState("department_id")}`}
        >
          <option value="">
            {deptLoading ? "Loading departments…" : "Select a department"}
          </option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
        <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />

        {!deptLoading && departments.length === 0 && (
          <p className="text-[11.5px] text-rose-500 mt-1.5 flex items-center gap-1 font-medium">
            <AlertCircle size={11} />
            No departments found — add one first.
          </p>
        )}
      </Field>

      {/* ── Photo URL ──────────────────────────────────────────────── */}
      <Field
        label="Photo URL" icon={Link2}
        error={null} touched={false}
        hint="Optional — leave blank to use initials avatar"
      >
        <div className="flex items-center gap-3">
          {/* Preview circle */}
          <div className={`w-10 h-10 rounded-full flex-shrink-0 overflow-hidden shadow-sm
                          bg-gradient-to-br ${from} ${to}
                          flex items-center justify-center text-white text-xs font-black`}>
            {form.image && !imgError ? (
              <img src={form.image} alt="preview" onError={() => setImgError(true)} className="w-full h-full object-cover" />
            ) : (
              <span className="text-[10px]">{initials || "?"}</span>
            )}
          </div>

          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Link2 size={14} className="text-slate-300" />
            </div>
            <input
              type="url"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              placeholder="https://example.com/photo.jpg"
              className={`${inputBase} ${inputState("image", true)}`}
            />
          </div>
        </div>

        {/* Image feedback */}
        <AnimatePresence>
          {form.image && imgError && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-1 text-[11.5px] text-amber-500 font-medium mt-1.5"
            >
              <AlertCircle size={11} />
              Could not load image — check the URL
            </motion.p>
          )}
          {form.image && !imgError && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-1 text-[11.5px] text-emerald-600 font-medium mt-1.5"
            >
              <CheckCircle2 size={11} />
              Image loaded successfully
            </motion.p>
          )}
        </AnimatePresence>
      </Field>

    </div>
  );
}