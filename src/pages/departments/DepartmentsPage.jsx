import { useState } from "react";
import { useDepartments } from "../../hooks/useDepartments";
import { useToast } from "../../hooks/useToast";
import Modal from "../../components/ui/Modal";
import Spinner from "../../components/ui/Spinner";
import DepartmentForm from "./DepartmentForm";

export default function DepartmentsPage() {
  const { departments, loading, error, addDepartment, editDepartment, removeDepartment } = useDepartments();
  const toast = useToast();
  const [showModal, setShowModal] = useState(false);
  const [editData,  setEditData]  = useState(null);
  const [saving,    setSaving]    = useState(false);
  const [query,     setQuery]     = useState("");

  const filtered = departments.filter((d) =>
    d.name?.toLowerCase().includes(query.toLowerCase()) ||
    d.building?.toLowerCase().includes(query.toLowerCase())
  );

  const closeModal = () => { setShowModal(false); setEditData(null); };

  const handleSubmit = async (data) => {
    setSaving(true);
    const result = editData ? await editDepartment(editData.id, data) : await addDepartment(data);
    setSaving(false);
    if (result.success) { toast.success(editData ? "Updated!" : "Created!"); closeModal(); }
    else toast.error(result.message);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this department?")) return;
    const result = await removeDepartment(id);
    result.success ? toast.success("Deleted!") : toast.error(result.message);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Departments</h1>
          <p className="text-sm text-gray-500 mt-1">{departments.length} total</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium">+ Add Department</button>
      </div>

      <input type="text" placeholder="Search departments..." value={query} onChange={(e) => setQuery(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm mb-5 focus:outline-none focus:ring-2 focus:ring-blue-500" />

      {loading && <div className="flex justify-center py-16"><Spinner /></div>}
      {error   && <p className="text-center py-16 text-red-500">{error}</p>}

      {!loading && !error && (
        filtered.length === 0
          ? <p className="text-center py-16 text-gray-400">No departments found.</p>
          : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((d) => (
                <div key={d.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition">
                  <h3 className="font-semibold text-gray-800">{d.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">📍 {d.building || "—"}</p>
                  <div className="flex gap-3 mt-3">
                    <button onClick={() => { setEditData(d); setShowModal(true); }} className="text-xs text-blue-600 hover:underline">Edit</button>
                    <button onClick={() => handleDelete(d.id)} className="text-xs text-red-500 hover:underline">Delete</button>
                  </div>
                </div>
              ))}
            </div>
      )}

      <Modal isOpen={showModal} onClose={closeModal} title={editData ? "Edit Department" : "Add Department"}>
        <DepartmentForm initialData={editData || {}} onSubmit={handleSubmit} onCancel={closeModal} loading={saving} />
      </Modal>
    </div>
  );
}