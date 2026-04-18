import { getCourseInitials, getCourseColor, formatDuration } from "../utils/courseUtils";

export default function CourseCard({ course }) {
  const initials = getCourseInitials(course.name);
  const colorClass = getCourseColor(course.name);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
      {/* Avatar + Name */}
      <div className="flex items-center gap-3 mb-3">
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold ${colorClass}`}
        >
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-800 truncate">{course.name}</h3>
          {course.code && (
            <span className="text-xs text-gray-400">{course.code}</span>
          )}
        </div>
      </div>

      {/* Description */}
      {course.description && (
        <p className="text-sm text-gray-500 line-clamp-2 mb-4">
          {course.description}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-400 border-t border-gray-100 pt-3">
        <span>{course.credits ? `${course.credits} credits` : "—"}</span>
        {course.duration && <span>{formatDuration(course.duration)}</span>}
      </div>
    </div>
  );
}