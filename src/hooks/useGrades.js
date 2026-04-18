import { useState, useEffect, useCallback } from "react";
import {
  getGrades,
  assignGrade,
  updateGrade,
  deleteGrade,
  getGradesByStudent,
  getGradesByCourse,
} from "../api/grades";

export const useGrades = () => {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ── Fetch all ─────────────────────────
  const fetchGrades = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getGrades();
      setGrades(res.data?.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch grades.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGrades();
  }, [fetchGrades]);

  // ── Filters ───────────────────────────
  const fetchGradesByStudent = async (studentId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getGradesByStudent(studentId);
      return res.data?.data || [];
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch student grades.");
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchGradesByCourse = async (courseId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getGradesByCourse(courseId);
      return res.data?.data || [];
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch course grades.");
      return [];
    } finally {
      setLoading(false);
    }
  };

// ── Create ────────────────────────────
const addGrade = async (data) => {
  setLoading(true);
  setError(null);
  try {
    const payload = {
      ...data,
      enrollment_id: parseInt(data.enrollment_id), // ← fix
    };
    const res = await assignGrade(payload);
    setGrades((prev) => [...prev, res.data?.data]);
    return { success: true, data: res.data?.data };
  } catch (err) {
    const msg = err.response?.data?.message || "Failed to assign grade.";
    setError(msg);
    return { success: false, message: msg };
  } finally {
    setLoading(false);
  }
};

  // ── Update ────────────────────────────
  const editGrade = async (id, data) => {
    setLoading(true);
    setError(null);
    try {
      const res = await updateGrade(id, data);

      setGrades((prev) =>
        prev.map((g) =>
          g.id === id ? res.data?.data : g
        )
      );

      return { success: true, data: res.data?.data };
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to update grade.";
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  // ── Delete ────────────────────────────
  const removeGrade = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await deleteGrade(id);

      setGrades((prev) =>
        prev.filter((g) => g.id !== id)
      );

      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to delete grade.";
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  return {
    grades,
    loading,
    error,
    fetchGrades,
    fetchGradesByStudent,
    fetchGradesByCourse,
    addGrade,
    editGrade,
    removeGrade,
  };
};