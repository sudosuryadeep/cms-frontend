import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const pageTitles = {
  "/": "Dashboard",
  "/students": "Students",
  "/courses": "Courses",
  "/departments": "Departments",
  "/professors": "Professors",
  "/semesters": "Semesters",
  "/enrollments": "Enrollments",
  "/grades": "Grades",
};

export default function Layout() {
  const { pathname } = useLocation();
  const title = pageTitles[pathname] || "CMS";
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [sidebarOpen]);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">

      {/* ── Desktop Sidebar (always visible ≥ lg) ── */}
      <div className="hidden lg:flex lg:shrink-0">
        <Sidebar />
      </div>

      {/* ── Mobile Sidebar Overlay ── */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          {/* Drawer */}
          <div className="absolute left-0 top-0 h-full z-50 flex">
            <Sidebar onClose={() => setSidebarOpen(false)} mobile />
          </div>
        </div>
      )}

      {/* ── Main Content ── */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar
          title={title}
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 max-w-screen-xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}