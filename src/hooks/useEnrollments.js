import { useState, useEffect, useCallback } from "react";
import {
  getEnrollments,
  getEnrollmentById,
  createEnrollment,
  deleteEnrollment,
} from "../api/enrollments";

export const useEnrollments = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ── Fetch all ─────────────────────────
  const fetchEnrollments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getEnrollments();
      setEnrollments(res.data?.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch enrollments.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEnrollments();
  }, [fetchEnrollments]);

  // ── Get single ────────────────────────
  const fetchEnrollmentById = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getEnrollmentById(id);
      return res.data?.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch enrollment.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // ── Create ────────────────────────────
  const enroll = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const res = await createEnrollment(data);

      setEnrollments((prev) => [...prev, res.data?.data]);

      return { success: true, data: res.data?.data };
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to enroll student.";
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  // ── Delete ────────────────────────────
  const cancelEnrollment = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await deleteEnrollment(id);

      setEnrollments((prev) =>
        prev.filter((e) => e.id !== id)
      );

      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to cancel enrollment.";
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  return {
    enrollments,
    loading,
    error,
    fetchEnrollments,
    fetchEnrollmentById,
    enroll,
    cancelEnrollment,
  };
};