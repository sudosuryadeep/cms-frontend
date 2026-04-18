import { useState } from "react";
import { useStudents } from "../../hooks/useStudents";
import { useCourses } from "../../hooks/useCourses";
import { useSemesters } from "../../hooks/useSemesters";

export default function EnrollmentForm({ onSubmit, onCancel, loading }) {
  const { students }  = useStudents();
  const { courses }   = useCourses();
  const { semesters } = useSemesters();
  const [form, setForm] = useState({ student_id: "", course_id: "", semester_id: "" });
  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Student</label>
        <select name="student_id" value={form.student_id} onChange={handleChange} required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">Select Student</option>
          {students.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
        <select name="course_id" value={form.course_id} onChange={handleChange} required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">Select Course</option>
          {courses.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
        <select name="semester_id" value={form.semester_id} onChange={handleChange} required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">Select Semester</option>
          {semesters.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>
      <div className="flex gap-2 pt-2">
        <button type="submit" disabled={loading}
          className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition">
          {loading ? "Enrolling..." : "Enroll Student"}
        </button>
        <button type="button" onClick={onCancel} className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition">Cancel</button>
      </div>
    </form>
  );
}