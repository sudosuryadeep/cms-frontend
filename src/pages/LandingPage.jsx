export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-violet-50 to-blue-50">
      <h1 className="text-4xl font-bold">Welcome to EduCMS</h1>
      <p className="mt-2 text-gray-600">Manage students, courses & grades easily</p>

      <div className="mt-6 flex gap-4">
        <a href="/login" className="px-5 py-2 bg-blue-600 text-white rounded-xl">
          Login
        </a>
        <a href="/signup" className="px-5 py-2 bg-gray-200 rounded-xl">
          Signup
        </a>
      </div>
    </div>
  );
}