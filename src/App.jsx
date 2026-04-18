import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Layout from "./components/layout/Layout";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Dashboard from "./pages/Dashboard";
import StudentsPage from "./pages/students/StudentsPage";
import CoursesPage from "./pages/courses/CoursesPage";
import DepartmentsPage from "./pages/departments/DepartmentsPage";
import ProfessorsPage from "./pages/professors/ProfessorsPage";
import SemestersPage from "./pages/semesters/SemestersPage";
import EnrollmentsPage from "./pages/enrollments/EnrollmentsPage";
import GradesPage from "./pages/grades/GradesPage";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="students" element={<StudentsPage />} />
        <Route path="courses" element={<CoursesPage />} />
        <Route path="departments" element={<DepartmentsPage />} />
        <Route path="professors" element={<ProfessorsPage />} />
        <Route path="semesters" element={<SemestersPage />} />
        <Route path="enrollments" element={<EnrollmentsPage />} />
        <Route path="grades" element={<GradesPage />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}