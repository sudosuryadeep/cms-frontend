import { useState, useEffect, useCallback } from "react";
import {
  getProfessors,
  getProfessorById,
  createProfessor,
  updateProfessor,
  deleteProfessor,
} from "../api/professors";

export const useProfessors = () => {
  const [professors, setProfessors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfessors = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getProfessors();
      const d = res.data;
      setProfessors(Array.isArray(d) ? d : Array.isArray(d?.data) ? d.data : []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch professors.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProfessors(); }, [fetchProfessors]);

  const fetchProfessorById = async (id) => {
    try {
      const res = await getProfessorById(id);
      return res.data?.data || res.data;
    } catch {
      return null;
    }
  };

  // ── Create ──
  const addProfessor = async (data) => {
    setLoading(true);
    try {
      const res = await createProfessor(data);
      const created = res.data?.data || res.data;
      setProfessors((prev) => [...prev, created]);
      return { success: true, data: created };
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to create professor.";
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  // ── Update ──
  const editProfessor = async (id, data) => {
    setLoading(true);
    try {
      const res = await updateProfessor(id, data);
      const updated = res.data?.data || res.data;
      setProfessors((prev) =>
        prev.map((p) => p.id === id ? updated : p)
      );
      return { success: true, data: updated };
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to update professor.";
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  // ── Delete ──
  const removeProfessor = async (id) => {
    setLoading(true);
    try {
      await deleteProfessor(id);
      setProfessors((prev) => prev.filter((p) => p.id !== id));
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to delete professor.";
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  return {
    professors,
    loading,
    error,
    fetchProfessors,
    fetchProfessorById,
    addProfessor,
    editProfessor,    // ← add hua
    removeProfessor,  // ← add hua
  };
};