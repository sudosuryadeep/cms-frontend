import { useState, useEffect } from "react";
import { useEnrollments } from "../../hooks/useEnrollments";

const GRADE_OPTIONS = ["A", "B", "C", "D", "F"];

export default function GradeForm({ initialData = {}, onSubmit, onCancel, loading }) {
  const { enrollments } = useEnrollments();
  const [form, setForm] = useState({ enrollment_id: "", grade: "", ...initialData });
  useEffect(() => { if (initialData?.id) setForm(initialData); }, [initialData?.id]);
  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} className="space-y-4">
      {!initialData?.id && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Enrollment</label>
          <select name="enrollment_id" value={form.enrollment_id} onChange={handleChange} required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Select Enrollment</option>
            {enrollments.map((e) => (
              <option key={e.id} value={e.id}>
                #{e.id} — {e.student_name || `Student ${e.student_id}`} / {e.course_name || `Course ${e.course_id}`}
              </option>
            ))}
          </select>
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
        <select name="grade" value={form.grade} onChange={handleChange} required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">Select Grade</option>
          {GRADE_OPTIONS.map((g) => <option key={g} value={g}>{g}</option>)}
        </select>
      </div>
      <div className="flex gap-2 pt-2">
        <button type="submit" disabled={loading}
          className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition">
          {loading ? "Saving..." : initialData?.id ? "Update Grade" : "Assign Grade"}
        </button>
        <button type="button" onClick={onCancel} className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition">Cancel</button>
      </div>
    </form>
  );
}