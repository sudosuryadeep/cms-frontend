import api from "./axios";

// ── Get all grades ─────────────────────
export const getGrades = () => api.get("/grades");

// ── Assign grade ───────────────────────
export const assignGrade = (data) =>
  api.post("/grades", data);

// ── Update grade ───────────────────────
export const updateGrade = (id, data) =>
  api.put(`/grades/${id}`, data);

// ── Delete grade ───────────────────────
export const deleteGrade = (id) =>
  api.delete(`/grades/${id}`);

// ── Filters ────────────────────────────
export const getGradesByStudent = (studentId) =>
  api.get(`/grades/student/${studentId}`);

export const getGradesByCourse = (courseId) =>
  api.get(`/grades/course/${courseId}`);