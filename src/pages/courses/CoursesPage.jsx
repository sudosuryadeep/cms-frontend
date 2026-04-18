import { useState } from "react";
import { useCourses } from "../../hooks/useCourses";
import { useToast } from "../../hooks/useToast";
import Modal from "../../components/ui/Modal";
import Spinner from "../../components/ui/Spinner";
import CourseForm from "./CourseForm";

export default function CoursesPage() {
  const { courses, loading, error, addCourse, editCourse, removeCourse } = useCourses();
  const toast = useToast();
  const [showModal, setShowModal] = useState(false);
  const [editData,  setEditData]  = useState(null);
  const [saving,    setSaving]    = useState(false);
  const [query,     setQuery]     = useState("");

  const filtered = courses.filter((c) =>
    c.name?.toLowerCase().includes(query.toLowerCase()) ||
    c.department_name?.toLowerCase().includes(query.toLowerCase()) ||
    c.professor_name?.toLowerCase().includes(query.toLowerCase())
  );

  const closeModal = () => { setShowModal(false); setEditData(null); };

  const handleSubmit = async (data) => {
    setSaving(true);
    const result = editData
      ? await editCourse(editData.id, data)
      : await addCourse(data);
    setSaving(false);
    if (result.success) { toast.success(editData ? "Course updated!" : "Course created!"); closeModal(); }
    else toast.error(result.message);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this course?")) return;
    const result = await removeCourse(id);
    result.success ? toast.success("Course deleted!") : toast.error(result.message);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Courses</h1>
          <p className="text-sm text-gray-500 mt-1">{courses.length} total</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium transition">
          + Add Course
        </button>
      </div>

      {/* Search */}
      <input type="text" placeholder="Search courses..." value={query} onChange={(e) => setQuery(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm mb-5 focus:outline-none focus:ring-2 focus:ring-blue-500" />

      {loading && <div className="flex justify-center py-16"><Spinner /></div>}
      {error   && <p className="text-center py-16 text-red-500">{error}</p>}

      {!loading && !error && (
        filtered.length === 0
          ? <p className="text-center py-16 text-gray-400">{query ? "No results." : "No courses yet."}</p>
          : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((c) => (
                <div key={c.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-800">{c.name}</h3>
                      <p className="text-sm text-gray-500 mt-0.5">{c.department_name || "—"}</p>
                      <p className="text-sm text-gray-500">Prof: {c.professor_name || "—"}</p>
                      <span className="mt-2 inline-block text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                        {c.credits} Credits
                      </span>
                    </div>
                    <div className="flex flex-col gap-1 ml-2 text-right">
                      <button onClick={() => { setEditData(c); setShowModal(true); }} className="text-xs text-blue-600 hover:underline">Edit</button>
                      <button onClick={() => handleDelete(c.id)} className="text-xs text-red-500 hover:underline">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
      )}

      <Modal isOpen={showModal} onClose={closeModal} title={editData ? "Edit Course" : "Add Course"}>
        <CourseForm initialData={editData || {}} onSubmit={handleSubmit} onCancel={closeModal} loading={saving} />
      </Modal>
    </div>
  );
}