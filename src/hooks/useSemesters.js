import { useState, useEffect, useCallback } from "react";
import {
  getSemesters,
  getSemesterById,
  createSemester,
  updateSemester,
  deleteSemester,
} from "../api/semesters";

export const useSemesters = () => {
  const [semesters, setSemesters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSemesters = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getSemesters();
      const d = res.data;
      setSemesters(Array.isArray(d) ? d : Array.isArray(d?.data) ? d.data : []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch semesters.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSemesters(); }, [fetchSemesters]);

  const fetchSemesterById = async (id) => {
    try {
      const res = await getSemesterById(id);
      return res.data?.data || res.data;
    } catch (err) {
      return null;
    }
  };

  // ── Create ──
  const addSemester = async (data) => {
    setLoading(true);
    try {
      const res = await createSemester(data);
      const created = res.data?.data || res.data;
      setSemesters((prev) => [...prev, created]);
      return { success: true, data: created };
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to create semester.";
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  // ── Update ──
  const editSemester = async (id, data) => {
    setLoading(true);
    try {
      const res = await updateSemester(id, data);
      const updated = res.data?.data || res.data;
      setSemesters((prev) => prev.map((s) => s.id === id ? updated : s));
      return { success: true, data: updated };
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to update semester.";
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  // ── Delete ──
  const removeSemester = async (id) => {
    setLoading(true);
    try {
      await deleteSemester(id);
      setSemesters((prev) => prev.filter((s) => s.id !== id));
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to delete semester.";
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  return {
    semesters,
    loading,
    error,
    fetchSemesters,
    fetchSemesterById,
    addSemester,
    editSemester,    // ← yeh add hua
    removeSemester,  // ← yeh add hua
  };
};