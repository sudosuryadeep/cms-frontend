import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, Search, Plus, Edit2, Trash2, X,
  Building2, GraduationCap, Star, AlertCircle,
  ChevronDown, LayoutList, Award,
} from "lucide-react";
import { useCourses }  from "../../hooks/useCourses";
import { useToast }    from "../../hooks/useToast";
import CourseForm      from "./CourseForm";

/* ── Credit badge colour ────────────────────────────────────────────────── */
function creditColor(n) {
  const c = Number(n);
  if (c <= 2) return { bg: "bg-sky-50",   border: "border-sky-100",   text: "text-sky-700"   };
  if (c <= 4) return { bg: "bg-cyan-50",  border: "border-cyan-100",  text: "text-cyan-700"  };
  return             { bg: "bg-teal-50",  border: "border-teal-100",  text: "text-teal-700"  };
}

/* ── Animated Modal ─────────────────────────────────────────────────────── */
function Modal({ isOpen, onClose, title, children }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(2,12,28,0.65)", backdropFilter: "blur(8px)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            className="relative w-full max-w-[440px] bg-white rounded-2xl overflow-hidden shadow-2xl"
            initial={{ scale: 0.92, y: 28, opacity: 0 }}
            animate={{ scale: 1,    y: 0,  opacity: 1 }}
            exit={{ scale: 0.95,   y: 16, opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
          >
            <div className="h-[3px] w-full bg-gradient-to-r from-sky-400 via-cyan-500 to-teal-500" />
            <div className="px-6 pt-5 pb-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-500 to-cyan-600 flex items-center justify-center shadow-sm">
                    <BookOpen size={15} className="text-white" />
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

/* ── Course Row (table-style list item) ─────────────────────────────────── */
function CourseRow({ course, onEdit, onDelete, index }) {
  const cc = creditColor(course.credits);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1,  x: 0   }}
      exit={{ opacity: 0, x: 16, transition: { duration: 0.15 } }}
      transition={{ duration: 0.28, delay: index * 0.04, ease: "easeOut" }}
      className="group flex items-center gap-4 px-5 py-4 bg-white
                 border-b border-slate-100 last:border-b-0
                 hover:bg-sky-50/40 transition-colors duration-150"
    >
      {/* Index number */}
      <span className="w-7 text-center text-xs font-bold text-slate-300 flex-shrink-0 select-none">
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* Icon box */}
      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-100 to-cyan-100
                      flex items-center justify-center flex-shrink-0 border border-sky-200/60">
        <BookOpen size={15} className="text-sky-600" />
      </div>

      {/* Course info */}
      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-bold text-slate-800 truncate leading-tight">{course.name}</p>
        <div className="flex items-center gap-3 mt-0.5 flex-wrap">
          {course.department_name && (
            <span className="inline-flex items-center gap-1 text-xs text-slate-500 font-medium">
              <Building2 size={10} className="text-slate-400" />
              {course.department_name}
            </span>
          )}
          {course.professor_name && (
            <span className="inline-flex items-center gap-1 text-xs text-slate-500 font-medium">
              <GraduationCap size={10} className="text-slate-400" />
              {course.professor_name}
            </span>
          )}
        </div>
      </div>

      {/* Credits badge */}
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-[11px] font-bold flex-shrink-0 ${cc.bg} ${cc.border} ${cc.text}`}>
        <Star size={9} />
        {course.credits} cr
      </span>

      {/* Actions — visible on hover */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex-shrink-0">
        <button onClick={() => onEdit(course)}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-sky-600 hover:bg-sky-100 transition-all"
          title="Edit">
          <Edit2 size={13} />
        </button>
        <button onClick={() => onDelete(course.id)}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
          title="Delete">
          <Trash2 size={13} />
        </button>
      </div>
    </motion.div>
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
          <BookOpen size={32} className="text-slate-400" />
        </div>
        {!isFiltered && (
          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-sky-500 flex items-center justify-center">
            <Plus size={12} className="text-white" strokeWidth={2.5} />
          </div>
        )}
      </div>
      <div className="text-center max-w-xs">
        <p className="font-bold text-slate-700 text-[15px]">
          {isFiltered ? "No courses found" : "No courses yet"}
        </p>
        <p className="text-sm text-slate-400 mt-1.5 leading-relaxed">
          {isFiltered
            ? "Try a different search or clear the filter."
            : "Add your first course to start building the curriculum."}
        </p>
      </div>
      {!isFiltered && (
        <button onClick={onAdd}
          className="mt-1 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 text-white
                     text-sm font-semibold hover:bg-sky-700 active:scale-95 transition-all
                     shadow-md shadow-sky-200">
          <Plus size={15} strokeWidth={2.5} />
          Add first course
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
export default function CoursesPage() {
  const { courses, loading, error, addCourse, editCourse, removeCourse } = useCourses();
  const toast = useToast();

  const [showModal, setShowModal] = useState(false);
  const [editData,  setEditData]  = useState(null);
  const [saving,    setSaving]    = useState(false);
  const [query,     setQuery]     = useState("");
  const [sortBy,    setSortBy]    = useState("name");

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return [...courses]
      .filter((c) =>
        c.name?.toLowerCase().includes(q) ||
        c.department_name?.toLowerCase().includes(q) ||
        c.professor_name?.toLowerCase().includes(q)
      )
      .sort((a, b) => {
        if (sortBy === "credits") return Number(b.credits) - Number(a.credits);
        if (sortBy === "dept") return (a.department_name || "").localeCompare(b.department_name || "");
        return (a.name || "").localeCompare(b.name || "");
      });
  }, [courses, query, sortBy]);

  const totalCredits = useMemo(() => courses.reduce((s, c) => s + Number(c.credits || 0), 0), [courses]);
  const deptCount    = useMemo(() => new Set(courses.map((c) => c.department_name).filter(Boolean)).size, [courses]);

  const openAdd    = () => { setEditData(null); setShowModal(true); };
  const openEdit   = (c) => { setEditData(c);   setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditData(null); };

  const handleSubmit = async (data) => {
    setSaving(true);
    const result = editData ? await editCourse(editData.id, data) : await addCourse(data);
    setSaving(false);
    if (result.success) {
      toast.success(editData ? "Course updated!" : "Course created!");
      closeModal();
    } else {
      toast.error(result.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this course? This cannot be undone.")) return;
    const result = await removeCourse(id);
    result.success ? toast.success("Course deleted.") : toast.error(result.message);
  };

  return (
    <div className="min-h-full bg-gradient-to-br from-slate-50 via-white to-sky-50/30 p-6 lg:p-8">

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
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-cyan-600
                              flex items-center justify-center shadow-md shadow-sky-200">
                <BookOpen size={18} className="text-white" />
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Courses</h1>
            </div>

            {!loading && !error && (
              <div className="flex items-center gap-2 ml-12 flex-wrap">
                <StatPill icon={LayoutList}  value={courses.length} label="courses"    colorClass="bg-sky-50 border-sky-100 text-sky-700" />
                <StatPill icon={Award}       value={totalCredits}   label="total cr."  colorClass="bg-cyan-50 border-cyan-100 text-cyan-700" />
                {deptCount > 0 && (
                  <StatPill icon={Building2} value={deptCount}      label="depts"      colorClass="bg-teal-50 border-teal-100 text-teal-700" />
                )}
              </div>
            )}
          </div>

          <button onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 text-white
                       text-sm font-bold hover:bg-sky-700 active:scale-95 transition-all
                       shadow-md shadow-sky-200 whitespace-nowrap">
            <Plus size={16} strokeWidth={2.5} />
            Add Course
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
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by course, department, professor…"
            className="w-full pl-10 pr-9 py-2.5 text-sm bg-white border border-slate-200 rounded-xl
                       text-slate-700 placeholder-slate-400
                       focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-300 transition-all"
          />
          <AnimatePresence>
            {query && (
              <motion.button
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1   }}
                exit={{ opacity: 0, scale: 0.7    }}
                onClick={() => setQuery("")}
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
                       focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-300 transition-all">
            <option value="name">Sort: Name</option>
            <option value="credits">Sort: Credits</option>
            <option value="dept">Sort: Department</option>
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
            className="text-xs text-slate-400 font-semibold mb-3"
          >
            {filtered.length} of {courses.length} results for "{query}"
          </motion.p>
        )}
      </AnimatePresence>

      {/* ── States ───────────────────────────────────────────────────── */}
      {loading && (
        <div className="flex flex-col items-center gap-3 py-24">
          <div className="w-10 h-10 rounded-full border-[3px] border-sky-100 border-t-sky-500 animate-spin" />
          <p className="text-sm text-slate-400 font-medium">Loading courses…</p>
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
          <motion.div
            layout
            className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm shadow-sky-50"
          >
            {/* Table header */}
            <div className="flex items-center gap-4 px-5 py-3 bg-slate-50 border-b border-slate-100">
              <span className="w-7" />
              <span className="w-9" />
              <span className="flex-1 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Course</span>
              <span className="w-16 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">Credits</span>
              <span className="w-16" />
            </div>

            <AnimatePresence mode="popLayout">
              {filtered.map((c, i) => (
                <CourseRow
                  key={c.id}
                  course={c}
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
        title={editData ? "Edit Course" : "Add Course"}
      >
        <CourseForm
          initialData={editData || {}}
          onSubmit={handleSubmit}
          onCancel={closeModal}
          loading={saving}
        />
      </Modal>
    </div>
  );
}