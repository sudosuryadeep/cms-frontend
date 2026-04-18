import { useState } from "react";

export default function DataTable({ columns, data, onEdit, onDelete }) {
  const [search, setSearch] = useState("");

  const filtered = data.filter((row) =>
    columns.some((col) =>
      String(row[col.key] ?? "").toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="px-5 py-4 border-b border-gray-100">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-64 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-left">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider"
                >
                  {col.label}
                </th>
              ))}
              <th className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="px-5 py-10 text-center text-sm text-gray-400"
                >
                  No records found
                </td>
              </tr>
            ) : (
              filtered.map((row, i) => (
                <tr key={row.id ?? i} className="hover:bg-gray-50 transition-colors">
                  {columns.map((col) => (
                    <td key={col.key} className="px-5 py-3 text-gray-700">
                      {col.render ? col.render(row) : row[col.key] ?? "—"}
                    </td>
                  ))}
                  <td className="px-5 py-3 text-right space-x-2">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(row)}
                        className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Edit
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(row.id)}
                        className="text-xs text-red-500 hover:text-red-700 font-medium"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}