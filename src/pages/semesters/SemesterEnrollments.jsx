import { useState, useEffect } from "react";

export default function SemesterForm({ initialData = {}, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState({ name: "", ...initialData });
  useEffect(() => { if (initialData?.id) setForm(initialData); }, [initialData?.id]);

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Semester Name</label>
        <input name="name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder='e.g. 2026 Spring' />
      </div>
      <div className="flex gap-2 pt-2">
        <button type="submit" disabled={loading}
          className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition">
          {loading ? "Saving..." : initialData?.id ? "Update" : "Create"}
        </button>
        <button type="button" onClick={onCancel} className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition">Cancel</button>
      </div>
    </form>
  );
}