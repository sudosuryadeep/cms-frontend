import { useState, useEffect, useCallback } from "react";
import {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
} from "../api/students";

export const useStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);

  // ── Fetch all students ─────────────────────────────────────
  const fetchStudents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getStudents();
      setStudents(res.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch students.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // ── Get single student ─────────────────────────────────────
  const fetchStudentById = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getStudentById(id);
      return res.data.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch student.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // ── Create student ─────────────────────────────────────────
  const addStudent = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const res = await createStudent(data);
      setStudents((prev) => [...prev, res.data.data]);
      return { success: true, data: res.data.data };
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to create student.";
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  // ── Update student ─────────────────────────────────────────
  const editStudent = async (id, data) => {
    setLoading(true);
    setError(null);
    try {
      const res = await updateStudent(id, data);
      setStudents((prev) =>
        prev.map((s) => (s.id === id ? res.data.data : s))
      );
      return { success: true, data: res.data.data };
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to update student.";
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  // ── Delete student ─────────────────────────────────────────
  const removeStudent = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await deleteStudent(id);
      setStudents((prev) => prev.filter((s) => s.id !== id));
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to delete student.";
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  return {
    students,
    loading,
    error,
    fetchStudents,
    fetchStudentById,
    addStudent,
    editStudent,
    removeStudent,
  };
};