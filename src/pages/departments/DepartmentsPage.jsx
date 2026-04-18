import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2, Search, Plus, Edit2, Trash2, X,
  MapPin, Users, AlertCircle, ChevronDown, LayoutGrid,
} from "lucide-react";
import { useDepartments } from "../../hooks/useDepartments";
import { useToast }       from "../../hooks/useToast";
import DepartmentForm     from "./DepartmentForm";

/* ── Avatar colour palette (deterministic by name) ─────────────────────── */
const AVATAR_GRADIENTS = [
  ["from-violet-500",  "to-purple-600"],
  ["from-purple-500",  "to-indigo-600"],
  ["from-indigo-500",  "to-blue-600"],
  ["from-blue-500",    "to-cyan-600"],
  ["from-fuchsia-500", "to-violet-600"],
  ["from-pink-500",    "to-rose-600"],
];

function avatarGradient(name = "") {
  const idx = (name.charCodeAt(0) || 0) % AVATAR_GRADIENTS.length;
  return AVATAR_GRADIENTS[idx];
}

/* ── Animated Modal ─────────────────────────────────────────────────────── */
function Modal({ isOpen, onClose, title, children }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(10,5,30,0.65)", backdropFilter: "blur(8px)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            className="relative w-full max-w-[420px] bg-white rounded-2xl overflow-hidden shadow-2xl"
            initial={{ scale: 0.92, y: 28, opacity: 0 }}
            animate={{ scale: 1,    y: 0,  opacity: 1 }}
            exit={{ scale: 0.95,   y: 16, opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
          >
            <div className="h-[3px] w-full bg-gradient-to-r from-violet-400 via-purple-500 to-indigo-500" />
            <div className="px-6 pt-5 pb-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-sm">
                    <Building2 size={15} className="text-white" />
                  </div>
                  <h2 className="text-[15px] font-bold text-slate-800 tracking-tight">{title}</h2>
                </div>
                <button
                  onClick={onClose}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
                >
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

/* ── Department Card ────────────────────────────────────────────────────── */
function DepartmentCard({ department, onEdit, onDelete, index }) {
  const [from, to] = avatarGradient(department.name);
  const initials = department.name
    ?.split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("") || "D";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0  }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
      transition={{ duration: 0.3, delay: index * 0.045, ease: "easeOut" }}
      className="group relative bg-white border border-slate-200/70 rounded-2xl overflow-hidden
                 hover:border-violet-200 hover:shadow-xl hover:shadow-violet-50/60 transition-all duration-200"
    >
      {/* Top hover accent */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-400 to-indigo-500
                      opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

      <div className="p-5">
        <div className="flex items-start gap-3 mb-4">
          {/* Avatar */}
          <div className={`relative flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${from} ${to}
                          flex items-center justify-center text-white text-[15px] font-black shadow-md`}>
            {initials}
            <div className="absolute -bottom-0.5 -right-0.5 w-[18px] h-[18px] rounded-full bg-white
                            flex items-center justify-center shadow-sm">
              <Building2 size={9} className="text-violet-600" />
            </div>
          </div>

          {/* Name + building */}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-[14.5px] text-slate-800 truncate leading-tight">
              {department.name}
            </h3>
            <div className="flex items-center gap-1 mt-0.5">
              <MapPin size={11} className="text-slate-400 flex-shrink-0" />
              <span className="text-xs text-slate-500 truncate font-medium">
                {department.building || "No building assigned"}
              </span>
            </div>
          </div>

          {/* Hover action buttons */}
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-150
                          translate-x-2 group-hover:translate-x-0">
            <button
              onClick={() => onEdit(department)}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400
                         hover:text-violet-600 hover:bg-violet-50 transition-all"
              title="Edit"
            >
              <Edit2 size={13} />
            </button>
            <button
              onClick={() => onDelete(department.id)}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400
                         hover:text-red-500 hover:bg-red-50 transition-all"
              title="Delete"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>

        {/* Building badge */}
        {department.building ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full
                           bg-violet-50 border border-violet-100 text-violet-700 text-[11px] font-semibold">
            <MapPin size={9} />
            {department.building}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full
                           bg-slate-50 border border-slate-100 text-slate-400 text-[11px] font-medium">
            No building
          </span>
        )}

        {/* Bottom action strip */}
        <div className="flex items-center gap-2 mt-4 pt-3.5 border-t border-slate-100">
          <button
            onClick={() => onEdit(department)}
            className="text-[11.5px] font-semibold text-violet-600 hover:text-violet-700 transition-colors"
          >
            Edit details
          </button>
          <span className="text-slate-200 text-xs">·</span>
          <button
            onClick={() => onDelete(department.id)}
            className="text-[11.5px] font-medium text-slate-400 hover:text-red-500 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Empty State ────────────────────────────────────────────────────────── */
function EmptyState({ isFiltered, onAdd }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0  }}
      className="flex flex-col items-center justify-center py-24 gap-4"
    >
      <div className="relative">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
          <Building2 size={32} className="text-slate-400" />
        </div>
        {!isFiltered && (
          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-violet-500 flex items-center justify-center">
            <Plus size={12} className="text-white" strokeWidth={2.5} />
          </div>
        )}
      </div>
      <div className="text-center max-w-xs">
        <p className="font-bold text-slate-700 text-[15px]">
          {isFiltered ? "No departments found" : "No departments yet"}
        </p>
        <p className="text-sm text-slate-400 mt-1.5 leading-relaxed">
          {isFiltered
            ? "Try adjusting your search or clearing the filter."
            : "Add your first department to start organising your institution."}
        </p>
      </div>
      {!isFiltered && (
        <button
          onClick={onAdd}
          className="mt-1 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 text-white
                     text-sm font-semibold hover:bg-violet-700 active:scale-95 transition-all
                     shadow-md shadow-violet-200"
        >
          <Plus size={15} strokeWidth={2.5} />
          Add first department
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
export default function DepartmentsPage() {
  const { departments, loading, error, addDepartment, editDepartment, removeDepartment } = useDepartments();
  const toast = useToast();

  const [showModal, setShowModal] = useState(false);
  const [editData,  setEditData]  = useState(null);
  const [saving,    setSaving]    = useState(false);
  const [query,     setQuery]     = useState("");
  const [sortBy,    setSortBy]    = useState("name");

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return [...departments]
      .filter(
        (d) =>
          d.name?.toLowerCase().includes(q) ||
          d.building?.toLowerCase().includes(q)
      )
      .sort((a, b) =>
        sortBy === "building"
          ? (a.building || "").localeCompare(b.building || "")
          : (a.name || "").localeCompare(b.name || "")
      );
  }, [departments, query, sortBy]);

  const buildingCount = useMemo(
    () => new Set(departments.map((d) => d.building).filter(Boolean)).size,
    [departments]
  );

  const openAdd    = () => { setEditData(null); setShowModal(true); };
  const openEdit   = (d) => { setEditData(d);   setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditData(null); };

  const handleSubmit = async (data) => {
    setSaving(true);
    const result = editData
      ? await editDepartment(editData.id, data)
      : await addDepartment(data);
    setSaving(false);
    if (result.success) {
      toast.success(editData ? "Department updated!" : "Department created!");
      closeModal();
    } else {
      toast.error(result.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this department? This cannot be undone.")) return;
    const result = await removeDepartment(id);
    result.success ? toast.success("Department deleted.") : toast.error(result.message);
  };

  return (
    <div className="min-h-full bg-gradient-to-br from-slate-50 via-white to-violet-50/30 p-6 lg:p-8">

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
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600
                              flex items-center justify-center shadow-md shadow-violet-200">
                <Building2 size={18} className="text-white" />
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Departments</h1>
            </div>

            {!loading && !error && (
              <div className="flex items-center gap-2 ml-12 flex-wrap">
                <StatPill
                  icon={LayoutGrid}
                  value={departments.length}
                  label="departments"
                  colorClass="bg-violet-50 border-violet-100 text-violet-700"
                />
                {buildingCount > 0 && (
                  <StatPill
                    icon={MapPin}
                    value={buildingCount}
                    label="buildings"
                    colorClass="bg-indigo-50 border-indigo-100 text-indigo-700"
                  />
                )}
              </div>
            )}
          </div>

          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 text-white
                       text-sm font-bold hover:bg-violet-700 active:scale-95 transition-all
                       shadow-md shadow-violet-200 whitespace-nowrap"
          >
            <Plus size={16} strokeWidth={2.5} />
            Add Department
          </button>
        </div>
      </motion.div>

      {/* ── Toolbar ──────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.12 }}
        className="flex gap-3 mb-6 flex-wrap"
      >
        {/* Search input */}
        <div className="relative flex-1 min-w-[220px]">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or building…"
            className="w-full pl-10 pr-9 py-2.5 text-sm bg-white border border-slate-200 rounded-xl
                       text-slate-700 placeholder-slate-400
                       focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-300 transition-all"
          />
          <AnimatePresence>
            {query && (
              <motion.button
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1   }}
                exit={{ opacity: 0, scale: 0.7    }}
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
              >
                <X size={14} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Sort select */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2.5 text-sm bg-white border border-slate-200
                       rounded-xl text-slate-600 font-medium cursor-pointer
                       focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-300 transition-all"
          >
            <option value="name">Sort: Name</option>
            <option value="building">Sort: Building</option>
          </select>
          <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
      </motion.div>

      {/* Result count */}
      <AnimatePresence>
        {query && !loading && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="text-xs text-slate-400 font-semibold mb-4"
          >
            {filtered.length} of {departments.length} results for "{query}"
          </motion.p>
        )}
      </AnimatePresence>

      {/* ── States ───────────────────────────────────────────────────── */}
      {loading && (
        <div className="flex flex-col items-center gap-3 py-24">
          <div className="w-10 h-10 rounded-full border-[3px] border-violet-100 border-t-violet-500 animate-spin" />
          <p className="text-sm text-slate-400 font-medium">Loading departments…</p>
        </div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600"
        >
          <AlertCircle size={16} className="flex-shrink-0" />
          {error}
        </motion.div>
      )}

      {!loading && !error && (
        filtered.length === 0 ? (
          <EmptyState isFiltered={!!query} onAdd={openAdd} />
        ) : (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {filtered.map((d, i) => (
                <DepartmentCard
                  key={d.id}
                  department={d}
                  index={i}
                  onEdit={openEdit}
                  onDelete={handleDelete}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )
      )}

      {/* ── Modal ────────────────────────────────────────────────────── */}
      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title={editData ? "Edit Department" : "Add Department"}
      >
        <DepartmentForm
          initialData={editData || {}}
          onSubmit={handleSubmit}
          onCancel={closeModal}
          loading={saving}
        />
      </Modal>
    </div>
  );
}