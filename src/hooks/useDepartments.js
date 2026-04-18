import { useState, useEffect, useCallback } from "react";
import {
  getDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "../api/departments";

export const useDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDepartments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getDepartments();
      const d = res.data;
      setDepartments(Array.isArray(d) ? d : Array.isArray(d?.data) ? d.data : []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch departments.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchDepartments(); }, [fetchDepartments]);

  const fetchDepartmentById = async (id) => {
    try {
      const res = await getDepartmentById(id);
      return res.data?.data || res.data;
    } catch {
      return null;
    }
  };

  // ── Create ──
  const addDepartment = async (data) => {
    setLoading(true);
    try {
      const res = await createDepartment(data);
      const created = res.data?.data || res.data;
      setDepartments((prev) => [...prev, created]);
      return { success: true, data: created };
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to create department.";
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  // ── Update ──
  const editDepartment = async (id, data) => {
    setLoading(true);
    try {
      const res = await updateDepartment(id, data);
      const updated = res.data?.data || res.data;
      setDepartments((prev) =>
        prev.map((d) => d.id === id ? updated : d)
      );
      return { success: true, data: updated };
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to update department.";
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  // ── Delete ──
  const removeDepartment = async (id) => {
    setLoading(true);
    try {
      await deleteDepartment(id);
      setDepartments((prev) => prev.filter((d) => d.id !== id));
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to delete department.";
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  return {
    departments,
    loading,
    error,
    fetchDepartments,
    fetchDepartmentById,
    addDepartment,
    editDepartment,    // ← add hua
    removeDepartment,  // ← add hua
  };
};