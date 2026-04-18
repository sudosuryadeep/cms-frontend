import { useAuth } from "../../context/AuthContext";

export default function Topbar({ title, onMenuClick }) {
  const { user, logout } = useAuth();

  const initials = user?.name
    ? user.name.split(" ").slice(0, 2).map((w) => w[0]?.toUpperCase()).join("")
    : "U";

  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 shrink-0 z-10">

      {/* Left — hamburger (mobile) + title */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Hamburger — only on mobile */}
        <button
          onClick={onMenuClick}
          className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors shrink-0"
          aria-label="Open menu"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        </button>

        <h2 className="text-sm font-semibold text-slate-800 truncate">{title}</h2>
      </div>

      {/* Right — user info + logout */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">

        {/* Name + Role — hidden on very small screens */}
        <div className="hidden sm:block text-right">
          <p className="text-sm font-medium text-slate-800 leading-none truncate max-w-[120px]">
            {user?.name || "User"}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5 capitalize">
            {user?.role || "student"}
          </p>
        </div>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0 select-none">
          {initials}
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-red-600 transition-colors px-2.5 py-1.5 rounded-lg hover:bg-red-50"
          title="Logout"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
          </svg>
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}