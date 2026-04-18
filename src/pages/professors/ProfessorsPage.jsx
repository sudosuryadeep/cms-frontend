import { useState } from "react";
import { useProfessors } from "../../hooks/useProfessors";
import { useToast } from "../../hooks/useToast";
import Modal from "../../components/ui/Modal";
import Spinner from "../../components/ui/Spinner";
import ProfessorForm from "./ProfessorForm";

export default function ProfessorsPage() {
  const { professors, loading, error, addProfessor, editProfessor, removeProfessor } = useProfessors();
  const toast = useToast();
  const [showModal, setShowModal] = useState(false);
  const [editData,  setEditData]  = useState(null);
  const [saving,    setSaving]    = useState(false);
  const [query,     setQuery]     = useState("");

  const filtered = professors.filter((p) =>
    p.name?.toLowerCase().includes(query.toLowerCase()) ||
    p.department_name?.toLowerCase().includes(query.toLowerCase())
  );

  const closeModal = () => { setShowModal(false); setEditData(null); };

  const handleSubmit = async (data) => {
    setSaving(true);
    const result = editData ? await editProfessor(editData.id, data) : await addProfessor(data);
    setSaving(false);
    if (result.success) { toast.success(editData ? "Updated!" : "Created!"); closeModal(); }
    else toast.error(result.message);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this professor?")) return;
    const result = await removeProfessor(id);
    result.success ? toast.success("Deleted!") : toast.error(result.message);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Professors</h1>
          <p className="text-sm text-gray-500 mt-1">{professors.length} total</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium">+ Add Professor</button>
      </div>

      <input type="text" placeholder="Search professors..." value={query} onChange={(e) => setQuery(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm mb-5 focus:outline-none focus:ring-2 focus:ring-blue-500" />

      {loading && <div className="flex justify-center py-16"><Spinner /></div>}
      {error   && <p className="text-center py-16 text-red-500">{error}</p>}

      {!loading && !error && (
        filtered.length === 0
          ? <p className="text-center py-16 text-gray-400">No professors found.</p>
          : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((p) => (
                <div key={p.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-sm mb-2">
                    {p.name?.charAt(0).toUpperCase()}
                  </div>
                  <h3 className="font-semibold text-gray-800">{p.name}</h3>
                  <p className="text-sm text-gray-500">{p.department_name || "—"}</p>
                  <div className="flex gap-3 mt-3">
                    <button onClick={() => { setEditData(p); setShowModal(true); }} className="text-xs text-blue-600 hover:underline">Edit</button>
                    <button onClick={() => handleDelete(p.id)} className="text-xs text-red-500 hover:underline">Delete</button>
                  </div>
                </div>
              ))}
            </div>
      )}

      <Modal isOpen={showModal} onClose={closeModal} title={editData ? "Edit Professor" : "Add Professor"}>
        <ProfessorForm initialData={editData || {}} onSubmit={handleSubmit} onCancel={closeModal} loading={saving} />
      </Modal>
    </div>
  );
}