import { useState } from "react";
import { useGrades } from "../../hooks/useGrades";
import { useToast } from "../../hooks/useToast";
import Modal from "../../components/ui/Modal";
import Spinner from "../../components/ui/Spinner";
import GradeBadge from "../../components/ui/GradeBadge";
import GradeForm from "./GradeForm";

export default function GradesPage() {
  const { grades, loading, error, addGrade, editGrade, removeGrade } = useGrades();
  const toast = useToast();
  const [showModal, setShowModal] = useState(false);
  const [editData,  setEditData]  = useState(null);
  const [saving,    setSaving]    = useState(false);
  const [query,     setQuery]     = useState("");

  const filtered = grades.filter((g) =>
    g.student_name?.toLowerCase().includes(query.toLowerCase()) ||
    g.course_name?.toLowerCase().includes(query.toLowerCase()) ||
    String(g.enrollment_id).includes(query)
  );

  const closeModal = () => { setShowModal(false); setEditData(null); };

  const handleSubmit = async (data) => {
  setSaving(true);
  const payload = {
    enrollment_id: parseInt(data.enrollment_id),  // ← string to number
    grade: data.grade,
  };
  const result = editData
    ? await editGrade(editData.id, { grade: payload.grade })
    : await addGrade(payload);
  setSaving(false);
  if (result.success) {
    toast.success(editData ? "Grade updated!" : "Grade assigned!");
    closeModal();
  } else {
    toast.error(result.message);
  }
};

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this grade?")) return;
    const result = await removeGrade(id);
    result.success ? toast.success("Deleted!") : toast.error(result.message);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Grades</h1>
          <p className="text-sm text-gray-500 mt-1">{grades.length} total</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium">+ Assign Grade</button>
      </div>

      <input type="text" placeholder="Search by student or course..." value={query} onChange={(e) => setQuery(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm mb-5 focus:outline-none focus:ring-2 focus:ring-blue-500" />

      {loading && <div className="flex justify-center py-16"><Spinner /></div>}
      {error   && <p className="text-center py-16 text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto bg-white rounded-xl border border-gray-200 shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 text-left">
              <tr>
                <th className="px-4 py-3 border-b">#</th>
                <th className="px-4 py-3 border-b">Enrollment</th>
                <th className="px-4 py-3 border-b">Student</th>
                <th className="px-4 py-3 border-b">Course</th>
                <th className="px-4 py-3 border-b">Grade</th>
                <th className="px-4 py-3 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-10 text-gray-400">No grades found.</td></tr>
              ) : filtered.map((g) => (
                <tr key={g.id} className="hover:bg-gray-50 border-b last:border-0">
                  <td className="px-4 py-3 text-gray-400">{g.id}</td>
                  <td className="px-4 py-3 text-gray-500">#{g.enrollment_id}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">{g.student_name || "—"}</td>
                  <td className="px-4 py-3 text-gray-600">{g.course_name || "—"}</td>
                  <td className="px-4 py-3"><GradeBadge grade={g.grade} /></td>
                  <td className="px-4 py-3 flex gap-3">
                    <button onClick={() => { setEditData(g); setShowModal(true); }} className="text-xs text-blue-600 hover:underline">Edit</button>
                    <button onClick={() => handleDelete(g.id)} className="text-xs text-red-500 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={showModal} onClose={closeModal} title={editData ? "Edit Grade" : "Assign Grade"}>
        <GradeForm initialData={editData || {}} onSubmit={handleSubmit} onCancel={closeModal} loading={saving} />
      </Modal>
    </div>
  );
}