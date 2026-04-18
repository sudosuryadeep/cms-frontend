const gradeColor = (grade) => {
  if (!grade) return "bg-gray-100 text-gray-500";
  const g = String(grade).toUpperCase();
  if (g.startsWith("A")) return "bg-green-100 text-green-700";
  if (g.startsWith("B")) return "bg-blue-100 text-blue-700";
  if (g.startsWith("C")) return "bg-yellow-100 text-yellow-700";
  if (g.startsWith("D")) return "bg-orange-100 text-orange-700";
  if (g.startsWith("F")) return "bg-red-100 text-red-700";
  const n = parseFloat(grade);
  if (!isNaN(n)) {
    if (n >= 85) return "bg-green-100 text-green-700";
    if (n >= 70) return "bg-blue-100 text-blue-700";
    if (n >= 55) return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  }
  return "bg-gray-100 text-gray-500";
};

export default function GradeBadge({ grade }) {
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${gradeColor(grade)}`}>
      {grade || "N/A"}
    </span>
  );
}