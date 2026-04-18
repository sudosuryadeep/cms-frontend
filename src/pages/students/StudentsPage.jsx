import { useEffect, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, Search, Plus, Edit2, Trash2, X,
  Building2, AlertCircle, ChevronDown, UserCircle2,
} from "lucide-react";
import {
  getStudents, createStudent, updateStudent, deleteStudent,
} from "../../api/students";
import StudentForm from "./StudentForm";
import { getDepartments } from "../../api/departments";


/* ── Deterministic avatar gradient ─────────────────────────────────────── */
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

/* ── Animated Toast ─────────────────────────────────────────────────────── */
function Toast({ message, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.95 }}
      animate={{ opacity: 1, y: 0,  scale: 1    }}
      exit={{ opacity: 0,   y: 16, scale: 0.95  }}
      className={`fixed bottom-5 right-5 z-[200] flex items-center gap-3 px-4 py-3 rounded-xl
                  border shadow-lg text-sm font-medium max-w-xs
                  ${type === "error"
                    ? "bg-red-50 border-red-100 text-red-700"
                    : "bg-emerald-50 border-emerald-100 text-emerald-700"}`}
    >
      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${type === "error" ? "bg-red-500" : "bg-emerald-500"}`} />
      {message}
      <button onClick={onClose} className="ml-auto text-current opacity-50 hover:opacity-100 transition-opacity">
        <X size={14} />
      </button>
    </motion.div>
  );
}

/* ── Animated Modal ─────────────────────────────────────────────────────── */
function Modal({ isOpen, onClose, title, children }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(2,8,23,0.65)", backdropFilter: "blur(8px)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            className="relative w-full max-w-[430px] bg-white rounded-2xl overflow-hidden shadow-2xl"
            initial={{ scale: 0.92, y: 28, opacity: 0 }}
            animate={{ scale: 1,    y: 0,  opacity: 1 }}
            exit={{ scale: 0.95,   y: 16, opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
          >
            <div className="h-[3px] w-full bg-gradient-to-r from-rose-400 via-pink-500 to-orange-400" />
            <div className="px-6 pt-5 pb-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-sm">
                    <Users size={15} className="text-white" />
                  </div>
                  <h2 className="text-[15px] font-bold text-slate-800 tracking-tight">{title}</h2>
                </div>
                <button onClick={onClose}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all">
                  <X size={15} />
                </button>
              </div>
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ── Student Row ────────────────────────────────────────────────────────── */
function StudentRow({ student, index, onEdit, onDelete }) {
  const [from, to] = getGradient(student.name);
  const [imgErr, setImgErr] = useState(false);

  return (
    <motion.tr
      layout
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1,  x: 0   }}
      exit={{ opacity: 0, x: 12, transition: { duration: 0.15 } }}
      transition={{ duration: 0.25, delay: index * 0.035, ease: "easeOut" }}
      className="group border-b border-slate-100 last:border-0 hover:bg-rose-50/30 transition-colors duration-150"
    >
      {/* Index */}
      <td className="pl-5 pr-2 py-3.5 w-10">
        <span className="text-xs font-bold text-slate-300 select-none">
          {String(index + 1).padStart(2, "0")}
        </span>
      </td>

      {/* Student */}
      <td className="px-3 py-3.5">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${from} ${to} flex items-center justify-center text-white text-xs font-black shrink-0 shadow-sm overflow-hidden`}>
            {student.image && !imgErr ? (
              <img src={student.image} alt="" onError={() => setImgErr(true)} className="w-full h-full object-cover" />
            ) : (
              getInitials(student.name)
            )}
          </div>
          <div>
            <p className="text-[13.5px] font-bold text-slate-800 leading-tight">{student.name}</p>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">ID #{student.id}</p>
          </div>
        </div>
      </td>

      {/* Department */}
      <td className="px-3 py-3.5">
        {student.department?.name ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 border border-rose-100 text-rose-700 text-[11px] font-semibold">
            <Building2 size={9} />
            {student.department.name}
          </span>
        ) : (
          <span className="text-xs text-slate-300 font-medium">—</span>
        )}
      </td>

      {/* Actions */}
      <td className="px-4 py-3.5 text-right">
        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          <button onClick={() => onEdit(student)}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-100 transition-all"
            title="Edit">
            <Edit2 size={13} />
          </button>
          <button onClick={() => onDelete(student.id)}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
            title="Delete">
            <Trash2 size={13} />
          </button>
        </div>
      </td>
    </motion.tr>
  );
}

/* ── Empty State ────────────────────────────────────────────────────────── */
function EmptyState({ isFiltered, onAdd }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1,  y: 0  }}
      className="flex flex-col items-center justify-center py-24 gap-4"
    >
      <div className="relative">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
          <Users size={32} className="text-slate-400" />
        </div>
        {!isFiltered && (
          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 flex items-center justify-center">
            <Plus size={12} className="text-white" strokeWidth={2.5} />
          </div>
        )}
      </div>
      <div className="text-center max-w-xs">
        <p className="font-bold text-slate-700 text-[15px]">
          {isFiltered ? "No students found" : "No students yet"}
        </p>
        <p className="text-sm text-slate-400 mt-1.5 leading-relaxed">
          {isFiltered
            ? "Try a different name or clear the search."
            : "Add your first student to start managing your registry."}
        </p>
      </div>
      {!isFiltered && (
        <button onClick={onAdd}
          className="mt-1 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 text-white
                     text-sm font-semibold hover:bg-rose-700 active:scale-95 transition-all
                     shadow-md shadow-rose-200">
          <Plus size={15} strokeWidth={2.5} />
          Add first student
        </button>
      )}
    </motion.div>
  );
}

/* ── Stat Pill ──────────────────────────────────────────────────────────── */
function StatPill({ icon: Icon, value, label, colorClass }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold ${colorClass}`}>
      <Icon size={11} />
      {value} {label}
    </span>
  );
}

/* ── Main Page ──────────────────────────────────────────────────────────── */
const EMPTY = { name: "", image: "", department_id: "" };

export default function StudentsPage() {
  const [data,    setData]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal,   setModal]   = useState(false);
  const [editing, setEditing] = useState(null);
  const [form,    setForm]    = useState(EMPTY);
  const [saving,  setSaving]  = useState(false);
  const [toast,   setToast]   = useState(null);
  const [search,  setSearch]  = useState("");
  const [sortBy,  setSortBy]  = useState("name");

  const showToast = (message, type = "success") => setToast({ message, type });

  // StudentsPage.jsx - fetchData ke andar
const fetchData = useCallback(async () => {
  try {
    const [studentsRes, deptsRes] = await Promise.all([
      getStudents(),
      getDepartments(),   // ← import karo upar se
    ]);

    const list = studentsRes.data?.data || studentsRes.data || [];
    const depts = deptsRes.data?.data || deptsRes.data || [];

    // department_id se department object inject karo
    const enriched = list.map((s) => ({
      ...s,
      department: depts.find((d) => d.id === s.department_id) || null,
    }));

    setData(Array.isArray(enriched) ? enriched : []);
  } catch {
    showToast("Failed to load students", "error");
  } finally {
    setLoading(false);
  }
}, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return [...data]
      .filter((s) => s.name?.toLowerCase().includes(q))
      .sort((a, b) =>
        sortBy === "dept"
          ? (a.department?.name || "").localeCompare(b.department?.name || "")
          : (a.name || "").localeCompare(b.name || "")
      );
  }, [data, search, sortBy]);

  const deptCount = useMemo(
    () => new Set(data.map((s) => s.department?.name).filter(Boolean)).size,
    [data]
  );

  const openCreate = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit   = (row) => { setEditing(row); setForm({ name: row.name, image: row.image || "", department_id: row.department_id }); setModal(true); };
  const closeModal = () => { setModal(false); setEditing(null); setForm(EMPTY); };

  const handleSave = async () => {
    if (!form.name.trim()) return showToast("Name is required", "error");
    setSaving(true);
    try {
      if (editing) {
        await updateStudent(editing.id, form);
        showToast("Student updated successfully");
      } else {
        await createStudent(form);
        showToast("Student added successfully");
      }
      closeModal();
      fetchData();
    } catch (err) {
      showToast(err.response?.data?.message || "Something went wrong", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this student? This cannot be undone.")) return;
    try {
      await deleteStudent(id);
      setData((prev) => prev.filter((s) => s.id !== id));
      showToast("Student deleted");
    } catch {
      showToast("Delete failed", "error");
    }
  };

  return (
    <div className="min-h-full bg-gradient-to-br from-slate-50 via-white to-rose-50/30 p-6 lg:p-8">

      {/* ── Header ───────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1,  y: 0   }}
        transition={{ duration: 0.35 }}
        className="mb-8"
      >
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600
                              flex items-center justify-center shadow-md shadow-rose-200">
                <Users size={18} className="text-white" />
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Students</h1>
            </div>

            {!loading && (
              <div className="flex items-center gap-2 ml-12 flex-wrap">
                <StatPill icon={UserCircle2} value={data.length}  label="students"    colorClass="bg-rose-50 border-rose-100 text-rose-700" />
                {deptCount > 0 && (
                  <StatPill icon={Building2} value={deptCount}    label="departments" colorClass="bg-pink-50 border-pink-100 text-pink-700" />
                )}
              </div>
            )}
          </div>

          <button onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 text-white
                       text-sm font-bold hover:bg-rose-700 active:scale-95 transition-all
                       shadow-md shadow-rose-200 whitespace-nowrap">
            <Plus size={16} strokeWidth={2.5} />
            Add Student
          </button>
        </div>
      </motion.div>

      {/* ── Toolbar ──────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.12 }}
        className="flex gap-3 mb-5 flex-wrap"
      >
        <div className="relative flex-1 min-w-[220px]">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search students by name…"
            className="w-full pl-10 pr-9 py-2.5 text-sm bg-white border border-slate-200 rounded-xl
                       text-slate-700 placeholder-slate-400
                       focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-rose-300 transition-all"
          />
          <AnimatePresence>
            {search && (
              <motion.button
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1   }}
                exit={{ opacity: 0, scale: 0.7    }}
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors">
                <X size={14} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2.5 text-sm bg-white border border-slate-200
                       rounded-xl text-slate-600 font-medium cursor-pointer
                       focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-rose-300 transition-all">
            <option value="name">Sort: Name</option>
            <option value="dept">Sort: Department</option>
          </select>
          <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
      </motion.div>

      {/* Result count */}
      <AnimatePresence>
        {search && !loading && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="text-xs text-slate-400 font-semibold mb-3"
          >
            {filtered.length} of {data.length} results for "{search}"
          </motion.p>
        )}
      </AnimatePresence>

      {/* ── Loading ───────────────────────────────────────────────────── */}
      {loading && (
        <div className="flex flex-col items-center gap-3 py-24">
          <div className="w-10 h-10 rounded-full border-[3px] border-rose-100 border-t-rose-500 animate-spin" />
          <p className="text-sm text-slate-400 font-medium">Loading students…</p>
        </div>
      )}

      {/* ── Table ────────────────────────────────────────────────────── */}
      {!loading && (
        filtered.length === 0 ? (
          <EmptyState isFiltered={!!search} onAdd={openCreate} />
        ) : (
          <motion.div
            layout
            className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm shadow-rose-50"
          >
            {/* Table head */}
            <div className="grid grid-cols-[40px_1fr_180px_80px] items-center px-2 py-3 bg-slate-50 border-b border-slate-100">
              <span />
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-3">Student</span>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-3">Department</span>
              <span />
            </div>

            <table className="w-full">
              <tbody>
                <AnimatePresence mode="popLayout">
                  {filtered.map((s, i) => (
                    <StudentRow
                      key={s.id}
                      student={s}
                      index={i}
                      onEdit={openEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </motion.div>
        )
      )}

      {/* ── Modal ────────────────────────────────────────────────────── */}
      <Modal
        isOpen={modal}
        onClose={closeModal}
        title={editing ? "Edit Student" : "Add New Student"}
      >
        <div className="space-y-5">
          <StudentForm form={form} setForm={setForm} />
          <div className="border-t border-slate-100 pt-4 flex gap-2.5">
            <button
              onClick={closeModal}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 active:scale-95 transition-all"
            >
              Cancel
            </button>
            <motion.button
              onClick={handleSave}
              disabled={saving}
              whileTap={{ scale: saving ? 1 : 0.96 }}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white bg-rose-600 hover:bg-rose-700
                         disabled:opacity-50 disabled:cursor-not-allowed transition-all
                         shadow-md shadow-rose-200 flex items-center justify-center gap-2"
            >
              {saving ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving…</>
              ) : editing ? "Update Student" : "Add Student"}
            </motion.button>
          </div>
        </div>
      </Modal>

      {/* ── Toast ────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {toast && <Toast key="toast" message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </AnimatePresence>
    </div>
  );
}