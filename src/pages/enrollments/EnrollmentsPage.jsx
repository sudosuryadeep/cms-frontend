import { useState } from "react";
import { useEnrollments } from "../../hooks/useEnrollments";
import { useToast } from "../../hooks/useToast";
import Modal from "../../components/ui/Modal";
import Spinner from "../../components/ui/Spinner";
import EnrollmentForm from "./EnrollmentForm";

export default function EnrollmentsPage() {
  const { enrollments, loading, error, enroll, cancelEnrollment } = useEnrollments();
  const toast = useToast();
  const [showModal, setShowModal] = useState(false);
  const [saving,    setSaving]    = useState(false);
  const [query,     setQuery]     = useState("");

  const filtered = enrollments.filter((e) =>
    e.student_name?.toLowerCase().includes(query.toLowerCase()) ||
    e.course_name?.toLowerCase().includes(query.toLowerCase()) ||
    e.semester_name?.toLowerCase().includes(query.toLowerCase())
  );

  const handleSubmit = async (data) => {
    setSaving(true);
    const result = await enroll(data);
    setSaving(false);
    if (result.success) { toast.success("Student enrolled!"); setShowModal(false); }
    else toast.error(result.message);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this enrollment?")) return;
    const result = await cancelEnrollment(id);
    result.success ? toast.success("Enrollment removed!") : toast.error(result.message);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Enrollments</h1>
          <p className="text-sm text-gray-500 mt-1">{enrollments.length} total</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium">+ Enroll Student</button>
      </div>

      <input type="text" placeholder="Search by student, course, semester..." value={query} onChange={(e) => setQuery(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm mb-5 focus:outline-none focus:ring-2 focus:ring-blue-500" />

      {loading && <div className="flex justify-center py-16"><Spinner /></div>}
      {error   && <p className="text-center py-16 text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto bg-white rounded-xl border border-gray-200 shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 text-left">
              <tr>
                <th className="px-4 py-3 border-b">#</th>
                <th className="px-4 py-3 border-b">Student</th>
                <th className="px-4 py-3 border-b">Course</th>
                <th className="px-4 py-3 border-b">Semester</th>
                <th className="px-4 py-3 border-b">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-10 text-gray-400">No enrollments found.</td></tr>
              ) : filtered.map((e) => (
                <tr key={e.id} className="hover:bg-gray-50 border-b last:border-0">
                  <td className="px-4 py-3 text-gray-400">{e.id}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">{e.student_name || e.student_id}</td>
                  <td className="px-4 py-3 text-gray-600">{e.course_name || e.course_id}</td>
                  <td className="px-4 py-3 text-gray-600">{e.semester_name || e.semester_id}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleDelete(e.id)} className="text-xs text-red-500 hover:underline">Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Enroll Student">
        <EnrollmentForm onSubmit={handleSubmit} onCancel={() => setShowModal(false)} loading={saving} />
      </Modal>
    </div>
  );
}