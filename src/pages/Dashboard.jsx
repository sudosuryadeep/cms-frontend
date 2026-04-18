import { useEffect, useState } from "react";
import { getStudents } from "../api/students";
import { getCourses } from "../api/courses";
import { getDepartments } from "../api/departments";
import { getProfessors } from "../api/professors";
import { getEnrollments } from "../api/enrollments";
import { getGrades } from "../api/grades";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const extract = (res) => {
  const d = res.data;
  if (Array.isArray(d)) return d;
  if (Array.isArray(d?.data)) return d.data;
  if (Array.isArray(d?.students)) return d.students;
  if (Array.isArray(d?.courses)) return d.courses;
  if (Array.isArray(d?.result)) return d.result;
  return [];
};

const gradeConfig = {
  A: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-500" },
  B: { bg: "bg-sky-50", text: "text-sky-700", border: "border-sky-200", dot: "bg-sky-500" },
  C: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", dot: "bg-amber-500" },
  D: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200", dot: "bg-orange-500" },
  F: { bg: "bg-red-50", text: "text-red-600", border: "border-red-200", dot: "bg-red-500" },
};

const getInitials = (name = "") =>
  name.split(" ").slice(0, 2).map((w) => w[0]?.toUpperCase()).join("");

const avatarColors = [
  "from-violet-500 to-purple-600",
  "from-sky-500 to-blue-600",
  "from-emerald-500 to-teal-600",
  "from-rose-500 to-pink-600",
  "from-amber-500 to-orange-600",
];

const getAvatarColor = (str = "") => {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = str.charCodeAt(i) + ((h << 5) - h);
  return avatarColors[Math.abs(h) % avatarColors.length];
};

const statCards = [
  {
    key: "students",
    label: "Students",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
        <path d="M10 9a3 3 0 100-6 3 3 0 000 6zM6 8a2 2 0 11-4 0 2 2 0 014 0zM1.49 15.326a.78.78 0 01-.358-.442 3 3 0 014.308-3.516 6.484 6.484 0 00-1.905 3.959c-.023.222-.014.442.025.654a4.97 4.97 0 01-2.07-.655zM16.44 15.98a4.97 4.97 0 002.07-.654.78.78 0 00.357-.442 3 3 0 00-4.308-3.517 6.484 6.484 0 011.907 3.96 2.32 2.32 0 01-.026.654zM18 8a2 2 0 11-4 0 2 2 0 014 0zM5.304 16.19a.844.844 0 01-.277-.71 5 5 0 019.947 0 .843.843 0 01-.277.71A6.975 6.975 0 0110 18a6.974 6.974 0 01-4.696-1.81z" />
      </svg>
    ),
    accent: "text-violet-600",
    iconBg: "bg-violet-50",
    bar: "bg-violet-500",
  },
  {
    key: "courses",
    label: "Courses",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
      </svg>
    ),
    accent: "text-sky-600",
    iconBg: "bg-sky-50",
    bar: "bg-sky-500",
  },
  {
    key: "departments",
    label: "Departments",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
      </svg>
    ),
    accent: "text-teal-600",
    iconBg: "bg-teal-50",
    bar: "bg-teal-500",
  },
  {
    key: "professors",
    label: "Faculty",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
      </svg>
    ),
    accent: "text-amber-600",
    iconBg: "bg-amber-50",
    bar: "bg-amber-500",
  },
  {
    key: "enrollments",
    label: "Enrollments",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
      </svg>
    ),
    accent: "text-emerald-600",
    iconBg: "bg-emerald-50",
    bar: "bg-emerald-500",
  },
  {
    key: "grades",
    label: "Grades",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ),
    accent: "text-rose-600",
    iconBg: "bg-rose-50",
    bar: "bg-rose-500",
  },
];

const quickActions = [
  { label: "Add Student", to: "/students", color: "text-violet-700", bg: "bg-violet-50 hover:bg-violet-100", border: "border-violet-200", adminOnly: true },
  { label: "Add Course", to: "/courses", color: "text-sky-700", bg: "bg-sky-50 hover:bg-sky-100", border: "border-sky-200", adminOnly: true },
  { label: "Add Department", to: "/departments", color: "text-teal-700", bg: "bg-teal-50 hover:bg-teal-100", border: "border-teal-200", adminOnly: true },
  { label: "Add Faculty", to: "/professors", color: "text-amber-700", bg: "bg-amber-50 hover:bg-amber-100", border: "border-amber-200", adminOnly: true },
  { label: "New Enrollment", to: "/enrollments", color: "text-emerald-700", bg: "bg-emerald-50 hover:bg-emerald-100", border: "border-emerald-200", adminOnly: false },
  { label: "Assign Grade", to: "/grades", color: "text-rose-700", bg: "bg-rose-50 hover:bg-rose-100", border: "border-rose-200", adminOnly: false },
];

export default function Dashboard() {
  const { user, isAdmin } = useAuth();

  const [stats, setStats] = useState({
    students: 0, courses: 0, departments: 0,
    professors: 0, enrollments: 0, grades: 0,
  });
  const [recentEnrollments, setRecentEnrollments] = useState([]);
  const [recentGrades, setRecentGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [s, c, d, p, e, g] = await Promise.all([
          getStudents(), getCourses(), getDepartments(),
          getProfessors(), getEnrollments(), getGrades(),
        ]);
        const students    = extract(s);
        const courses     = extract(c);
        const departments = extract(d);
        const professors  = extract(p);
        const enrollments = extract(e);
        const grades      = extract(g);

        setStats({
          students: students.length, courses: courses.length,
          departments: departments.length, professors: professors.length,
          enrollments: enrollments.length, grades: grades.length,
        });
        setRecentEnrollments(enrollments.slice(-5).reverse());
        setRecentGrades(grades.slice(-5).reverse());
      } catch (err) {
        console.error("Dashboard error:", err);
        setError("Failed to load — please check the backend.");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-72">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-full border-2 border-slate-100" />
            <div className="absolute inset-0 rounded-full border-2 border-t-violet-500 animate-spin" />
          </div>
          <p className="text-sm text-slate-400 font-medium tracking-wide">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-72">
        <div className="text-center bg-red-50 border border-red-100 rounded-2xl px-8 py-8">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M12 3a9 9 0 100 18A9 9 0 0012 3z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-red-700 mb-1">{error}</p>
          <button onClick={() => window.location.reload()}
            className="mt-2 text-xs text-red-500 hover:text-red-700 font-medium underline underline-offset-2">
            Try again
          </button>
        </div>
      </div>
    );
  }

  const maxStat = Math.max(...statCards.map((c) => stats[c.key]), 1);
  const firstName = user?.name?.split(" ")[0] || "there";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="min-h-screen bg-slate-50/60 px-6 py-8 space-y-8">

      {/* ── Header ── */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold tracking-widest uppercase text-slate-400">
              Course Management System
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {greeting}, {firstName} 👋
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            {isAdmin ? "Full system overview — all data at a glance." : "Your academic overview for this term."}
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-sm">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-medium text-slate-600">Live data</span>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
        {statCards.map((card) => {
          const pct = Math.round((stats[card.key] / maxStat) * 100);
          return (
            <div key={card.key}
              className="group bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-default">
              <div className={`w-8 h-8 rounded-lg ${card.iconBg} ${card.accent} flex items-center justify-center mb-3`}>
                {card.icon}
              </div>
              <p className="text-2xl font-bold text-slate-900 tabular-nums leading-none mb-1">
                {stats[card.key].toLocaleString()}
              </p>
              <p className="text-xs font-medium text-slate-400 mb-3">{card.label}</p>
              <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${card.bar} rounded-full transition-all duration-700`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Recent Tables ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Recent Enrollments */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-emerald-50 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-slate-800">Recent Enrollments</h3>
            </div>
            <Link to="/enrollments"
              className="text-xs font-medium text-violet-600 hover:text-violet-700 flex items-center gap-1 transition-colors">
              View all
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {recentEnrollments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-300">
              <svg className="w-10 h-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-sm font-medium">No enrollments yet</p>
            </div>
          ) : (
            <div>
              {recentEnrollments.map((e, i) => {
                const name = e.student?.name || e.Student?.name || `Student #${e.student_id}`;
                const course = e.course?.name || e.Course?.name || `Course #${e.course_id}`;
                const sem = e.semester?.name || e.Semester?.name || `Sem ${e.semester_id}`;
                return (
                  <div key={e.id || i}
                    className="px-5 py-3.5 flex items-center gap-3 hover:bg-slate-50/80 transition-colors border-b border-slate-50 last:border-0">
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${getAvatarColor(name)} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                      {getInitials(name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">{name}</p>
                      <p className="text-xs text-slate-400 truncate">{course}</p>
                    </div>
                    <span className="shrink-0 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-lg">
                      {sem}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Grades */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-rose-50 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-rose-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-slate-800">Recent Grades</h3>
            </div>
            <Link to="/grades"
              className="text-xs font-medium text-violet-600 hover:text-violet-700 flex items-center gap-1 transition-colors">
              View all
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {recentGrades.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-300">
              <svg className="w-10 h-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              <p className="text-sm font-medium">No grades assigned yet</p>
            </div>
          ) : (
            <div>
              {recentGrades.map((g, i) => {
                const name =
                  g.student?.name || g.Student?.name ||
                  g.enrollment?.student?.name || g.Enrollment?.Student?.name ||
                  `Enrollment #${g.enrollment_id}`;
                const course =
                  g.course?.name || g.Course?.name ||
                  g.enrollment?.course?.name || g.Enrollment?.Course?.name || "Course";
                const grade = g.grade;
                const gc = gradeConfig[grade] || { bg: "bg-slate-50", text: "text-slate-600", border: "border-slate-200", dot: "bg-slate-400" };
                return (
                  <div key={g.id || i}
                    className="px-5 py-3.5 flex items-center gap-3 hover:bg-slate-50/80 transition-colors border-b border-slate-50 last:border-0">
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${getAvatarColor(name)} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                      {getInitials(name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">{name}</p>
                      <p className="text-xs text-slate-400 truncate">{course}</p>
                    </div>
                    {grade && (
                      <span className={`shrink-0 text-xs font-bold px-2.5 py-1 rounded-lg border ${gc.bg} ${gc.text} ${gc.border}`}>
                        {grade}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Quick Actions ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-5 py-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 bg-violet-50 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-slate-800">Quick Actions</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {quickActions
            .filter((a) => isAdmin || !a.adminOnly)
            .map((a) => (
              <Link
                key={a.to}
                to={a.to}
                className={`inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl border transition-all duration-150 ${a.color} ${a.bg} ${a.border}`}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
                {a.label}
              </Link>
            ))}
        </div>
      </div>

    </div>
  );
}