import { useState } from "react";
import { useEnrollments } from "../../hooks/useEnrollments";
import { useToast } from "../../hooks/useToast";
import Modal from "../../components/ui/Modal";
import Spinner from "../../components/ui/Spinner";
import EnrollmentForm from "./EnrollmentForm";

function initials(name = "") {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

export default function EnrollmentsPage() {
  const { enrollments, loading, error, enroll, cancelEnrollment } = useEnrollments();
  const toast = useToast();
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = enrollments.filter((e) =>
    e.student_name?.toLowerCase().includes(query.toLowerCase()) ||
    e.course_name?.toLowerCase().includes(query.toLowerCase()) ||
    e.semester_name?.toLowerCase().includes(query.toLowerCase())
  );

  const uniqueCourses = new Set(enrollments.map((e) => e.course_id)).size;
  const uniqueSemesters = new Set(enrollments.map((e) => e.semester_id)).size;

  const handleSubmit = async (data) => {
    setSaving(true);
    const result = await enroll(data);
    setSaving(false);
    if (result.success) {
      toast.success("Student enrolled!");
      setShowModal(false);
    } else {
      toast.error(result.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this enrollment?")) return;
    const result = await cancelEnrollment(id);
    result.success ? toast.success("Enrollment removed!") : toast.error(result.message);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Enrollments</h1>
            <p className="text-sm text-gray-400 mt-1">{enrollments.length} total enrollments</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors shadow-sm shadow-indigo-200"
          >
            <PlusIcon />
            Enroll Student
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <StatCard
            icon={<UsersIcon />}
            iconBg="bg-indigo-50"
            value={enrollments.length}
            label="Total Enrollments"
          />
          <StatCard
            icon={<BookIcon />}
            iconBg="bg-green-50"
            value={uniqueCourses}
            label="Courses"
          />
          <StatCard
            icon={<CalendarIcon />}
            iconBg="bg-amber-50"
            value={uniqueSemesters}
            label="Semesters"
          />
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by student, course, semester…"
            className="w-full bg-white border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition"
          />
        </div>

        {/* Table */}
        {loading && (
          <div className="flex justify-center py-20">
            <Spinner />
          </div>
        )}
        {error && <p className="text-center py-16 text-red-500 text-sm">{error}</p>}

        {!loading && !error && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wide">ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wide">Student</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wide">Course</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wide">Semester</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wide"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={5}>
                        <div className="flex flex-col items-center py-16 text-center">
                          <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-3">
                            <InboxIcon />
                          </div>
                          <p className="text-sm font-medium text-gray-600">No enrollments found</p>
                          <p className="text-xs text-gray-400 mt-1">Try a different search term</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filtered.map((e) => {
                      const name = e.student_name || `Student #${e.student_id}`;
                      return (
                        <tr key={e.id} className="border-b border-gray-100 last:border-0 hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3">
                            <span className="inline-block bg-gray-100 text-gray-500 text-xs font-mono px-2 py-0.5 rounded">
                              #{e.id}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 text-xs font-semibold flex items-center justify-center shrink-0">
                                {initials(name)}
                              </div>
                              <span className="font-medium text-gray-800">{name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center gap-1.5 bg-gray-50 border border-gray-200 text-gray-600 text-xs px-2.5 py-1 rounded-md">
                              <BookIcon size={11} />
                              {e.course_name || e.course_id}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-100 text-amber-700 text-xs px-2.5 py-1 rounded-md">
                              <CalendarIcon size={11} />
                              {e.semester_name || e.semester_id}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => handleDelete(e.id)}
                              className="inline-flex items-center gap-1.5 text-xs text-red-500 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 px-2.5 py-1 rounded-md transition-all"
                            >
                              <TrashIcon size={12} />
                              Remove
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Enroll a Student">
        <EnrollmentForm onSubmit={handleSubmit} onCancel={() => setShowModal(false)} loading={saving} />
      </Modal>
    </div>
  );
}

function StatCard({ icon, iconBg, value, label }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl px-4 py-3.5 flex items-center gap-3 shadow-sm">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${iconBg}`}>
        {icon}
      </div>
      <div>
        <div className="text-xl font-semibold text-gray-900 leading-none">{value}</div>
        <div className="text-xs text-gray-400 mt-1">{label}</div>
      </div>
    </div>
  );
}

/* ── Icons ── */
function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M7 1.5v11M1.5 7h11" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}
function UsersIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="7" r="3.5" stroke="#4f46e5" strokeWidth="1.5" />
      <path d="M3 17c0-3.314 3.134-6 7-6s7 2.686 7 6" stroke="#4f46e5" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
function BookIcon({ size = 17 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path d="M4 6h12M4 10h8M4 14h5" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
function CalendarIcon({ size = 17 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <rect x="3" y="4" width="14" height="13" rx="2" stroke="#b45309" strokeWidth="1.5" />
      <path d="M3 8h14M7 2v4M13 2v4" stroke="#b45309" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
function SearchIcon({ className }) {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className={className}>
      <circle cx="6.5" cy="6.5" r="4" stroke="currentColor" strokeWidth="1.4" />
      <path d="M9.5 9.5l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
function TrashIcon({ size = 13 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <path d="M2 4h10M5 4V2.5h4V4M5.5 6.5v4M8.5 6.5v4M3 4l.8 7.5h6.4L11 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function InboxIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M3 10h3l2 3h4l2-3h3" stroke="#9ca3af" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="2" y="4" width="16" height="13" rx="2" stroke="#9ca3af" strokeWidth="1.4" />
    </svg>
  );
}