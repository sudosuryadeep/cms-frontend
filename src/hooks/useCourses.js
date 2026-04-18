import { useState, useEffect, useCallback } from "react";
import {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
} from "../api/courses";

export const useCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getCourses();
      const d = res.data;
      setCourses(Array.isArray(d) ? d : Array.isArray(d?.data) ? d.data : []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch courses.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCourses(); }, [fetchCourses]);

  const fetchCourseById = async (id) => {
    try {
      const res = await getCourseById(id);
      return res.data?.data || res.data;
    } catch {
      return null;
    }
  };

  // ── Create ──
  const addCourse = async (data) => {
    setLoading(true);
    try {
      const res = await createCourse(data);
      const created = res.data?.data || res.data;
      setCourses((prev) => [...prev, created]);
      return { success: true, data: created };
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to create course.";
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  // ── Update ──
  const editCourse = async (id, data) => {
    setLoading(true);
    try {
      const res = await updateCourse(id, data);
      const updated = res.data?.data || res.data;
      setCourses((prev) =>
        prev.map((c) => c.id === id ? updated : c)
      );
      return { success: true, data: updated };
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to update course.";
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  // ── Delete ──
  const removeCourse = async (id) => {
    setLoading(true);
    try {
      await deleteCourse(id);
      setCourses((prev) => prev.filter((c) => c.id !== id));
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to delete course.";
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  return {
    courses,
    loading,
    error,
    fetchCourses,
    fetchCourseById,
    addCourse,
    editCourse,    // ← add hua
    removeCourse,  // ← add hua
  };
};