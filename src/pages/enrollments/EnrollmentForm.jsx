import { useState } from "react";
import { useStudents } from "../../hooks/useStudents";
import { useCourses } from "../../hooks/useCourses";
import { useSemesters } from "../../hooks/useSemesters";

export default function EnrollmentForm({ onSubmit, onCancel, loading }) {
  const { students } = useStudents();
  const { courses } = useCourses();
  const { semesters } = useSemesters();
  const [form, setForm] = useState({ student_id: "", course_id: "", semester_id: "" });

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  const handleSubmit = (e) => { e.preventDefault(); onSubmit(form); };

  return (
    <div className="space-y-4">
      <FormField label="Student" icon={<UserIcon />}>
        <SelectInput name="student_id" value={form.student_id} onChange={handleChange} required>
          <option value="">Select a student</option>
          {students.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </SelectInput>
      </FormField>

      <FormField label="Course" icon={<BookIcon />}>
        <SelectInput name="course_id" value={form.course_id} onChange={handleChange} required>
          <option value="">Select a course</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </SelectInput>
      </FormField>

      <FormField label="Semester" icon={<CalendarIcon />}>
        <SelectInput name="semester_id" value={form.semester_id} onChange={handleChange} required>
          <option value="">Select a semester</option>
          {semesters.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </SelectInput>
      </FormField>

      <div className="flex gap-2 pt-2">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex-1 inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
        >
          {loading ? (
            <>
              <SpinnerIcon />
              Enrolling…
            </>
          ) : (
            <>
              <PlusIcon />
              Enroll Student
            </>
          )}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium py-2.5 rounded-lg transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function FormField({ label, icon, children }) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 mb-1.5">
        {icon}
        {label}
      </label>
      {children}
    </div>
  );
}

function SelectInput({ children, ...props }) {
  return (
    <div className="relative">
      <select
        {...props}
        className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 focus:bg-white transition cursor-pointer pr-9"
      >
        {children}
      </select>
      <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
        <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
          <path d="M2 4l3.5 3.5L9 4" stroke="#9ca3af" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}

/* ── Icons ── */
function UserIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="7" r="3.5" stroke="#6b7280" strokeWidth="1.5" />
      <path d="M3 17c0-3.314 3.134-6 7-6s7 2.686 7 6" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
function BookIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 20 20" fill="none">
      <path d="M4 6h12M4 10h8M4 14h5" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
function CalendarIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 20 20" fill="none">
      <rect x="3" y="4" width="14" height="13" rx="2" stroke="#6b7280" strokeWidth="1.5" />
      <path d="M3 8h14M7 2v4M13 2v4" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
function PlusIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
      <path d="M7 1.5v11M1.5 7h11" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}
function SpinnerIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="animate-spin">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}