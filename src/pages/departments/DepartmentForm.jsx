import { useState, useEffect } from "react";

export default function DepartmentForm({ initialData = {}, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState({ name: "", building: "", ...initialData });
  useEffect(() => { if (initialData?.id) setForm(initialData); }, [initialData?.id]);
  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  const handleSubmit = (e) => { e.preventDefault(); onSubmit(form); };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Department Name</label>
        <input name="name" value={form.name} onChange={handleChange} required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g. Computer Science" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Building (optional)</label>
        <input name="building" value={form.building} onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g. Block A" />
      </div>
      <div className="flex gap-2 pt-2">
        <button type="submit" disabled={loading}
          className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition">
          {loading ? "Saving..." : initialData?.id ? "Update" : "Create"}
        </button>
        <button type="button" onClick={onCancel}
          className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition">
          Cancel
        </button>
      </div>
    </form>
  );
}