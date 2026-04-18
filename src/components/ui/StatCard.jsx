export default function StatCard({ title, value, icon, color = "blue" }) {
  const colors = {
    blue:   "bg-blue-50 text-blue-600",
    green:  "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
    orange: "bg-orange-50 text-orange-600",
    red:    "bg-red-50 text-red-600",
  };
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex items-center gap-4">
      {icon && (
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${colors[color] || colors.blue}`}>
          {icon}
        </div>
      )}
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value ?? "—"}</p>
      </div>
    </div>
  );
}