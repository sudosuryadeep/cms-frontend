export default function Modal({ title, onClose, children, isOpen }) {

  if (!isOpen) return null;   // 🔥 IMPORTANT LINE

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/40"
      onClick={onClose}   // optional: outside click close
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()} // 🔥 prevent close on inside click
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-800">{title}</h3>
          
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
          >
            ×
          </button>

        </div>

        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}