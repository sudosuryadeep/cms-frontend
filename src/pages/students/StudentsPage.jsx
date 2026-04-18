import { useEffect, useState, useCallback } from "react";
import DataTable from "../../components/ui/DataTable";
import Modal from "../../components/ui/Modal";
import Toast from "../../components/ui/Toast";
import {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent,
} from "../../api/students";
import StudentForm from "./StudentForm";

const COLUMNS = [
  { key: "id", label: "ID" },
  {
    key: "name",
    label: "Student",
    render: (row) => {
      const initials = row.name
        ? row.name.split(" ").slice(0, 2).map((w) => w[0]?.toUpperCase()).join("")
        : "?";
      const colors = [
        "from-violet-500 to-purple-600",
        "from-sky-500 to-blue-600",
        "from-emerald-500 to-teal-600",
        "from-rose-500 to-pink-600",
        "from-amber-500 to-orange-600",
      ];
      let h = 0;
      for (let i = 0; i < (row.name || "").length; i++)
        h = (row.name.charCodeAt(i) + ((h << 5) - h)) | 0;
      const grad = colors[Math.abs(h) % colors.length];
      return (
        <div className="flex items-center gap-3">
          {row.image ? (
            <img
              src={row.image}
              alt=""
              className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-100"
            />
          ) : (
            <div
              className={`w-8 h-8 rounded-full bg-gradient-to-br ${grad} flex items-center justify-center text-white text-xs font-bold shrink-0`}
            >
              {initials}
            </div>
          )}
          <span className="text-sm font-medium text-slate-800">{row.name}</span>
        </div>
      );
    },
  },
  {
    key: "department_id",
    label: "Department",
    render: (row) => (
      <span className="inline-flex items-center text-xs font-medium text-violet-700 bg-violet-50 border border-violet-100 px-2.5 py-1 rounded-lg">
        {row.department?.name || `Dept #${row.department_id}`}
      </span>
    ),
  },
];

const EMPTY = { name: "", image: "", department_id: "" };

export default function StudentsPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState("");

  const fetchData = useCallback(async () => {
    try {
      const res = await getStudents();
      setData(res.data?.data || []);
    } catch {
      showToast("Failed to load students", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const showToast = (message, type = "success") => setToast({ message, type });

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY);
    setModal(true);
  };

  const openEdit = (row) => {
    setEditing(row);
    setForm({ name: row.name, image: row.image || "", department_id: row.department_id });
    setModal(true);
  };

  const closeModal = () => {
    setModal(false);
    setEditing(null);
    setForm(EMPTY);
  };

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
    if (!window.confirm("Delete this student?")) return;
    try {
      await deleteStudent(id);
      setData((prev) => prev.filter((s) => s.id !== id));
      showToast("Student deleted");
    } catch {
      showToast("Delete failed", "error");
    }
  };

  const filtered = data.filter((s) =>
    s.name?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 rounded-full border-2 border-slate-100" />
            <div className="absolute inset-0 rounded-full border-2 border-t-violet-500 animate-spin" />
          </div>
          <p className="text-xs text-slate-400 font-medium">Loading students…</p>
        </div>
      </div>
    );

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold text-slate-900">Students</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {data.length} registered · {filtered.length} showing
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 active:scale-95 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-all duration-150 shadow-sm shadow-violet-200 self-start sm:self-auto"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          Add Student
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search students by name…"
          className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent placeholder-slate-400 text-slate-800 transition-all"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Empty state */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 py-16 flex flex-col items-center text-slate-300">
          <svg className="w-12 h-12 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p className="text-sm font-medium text-slate-400">
            {search ? "No students match your search" : "No students yet"}
          </p>
          {!search && (
            <button onClick={openCreate} className="mt-3 text-xs text-violet-500 hover:text-violet-700 font-semibold">
              + Add your first student
            </button>
          )}
        </div>
      ) : (
        <DataTable
          columns={COLUMNS}
          data={filtered}
          onEdit={openEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Modal */}
      <Modal
        isOpen={modal}
        title={editing ? "Edit Student" : "Add New Student"}
        onClose={closeModal}
      >
        <div className="space-y-5">
          <StudentForm form={form} setForm={setForm} />
          <div className="flex gap-3 pt-1">
            <button
              onClick={closeModal}
              className="flex-1 px-4 py-2.5 text-sm font-medium border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 px-4 py-2.5 text-sm font-semibold bg-violet-600 text-white rounded-xl hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 shadow-sm shadow-violet-200"
            >
              {saving ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Saving…
                </span>
              ) : editing ? "Update Student" : "Add Student"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Toast */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
}