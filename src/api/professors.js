import api from "./axios";

export const getProfessors = () => api.get("/professors");
export const getProfessorById = (id) => api.get(`/professors/${id}`);
export const createProfessor = (data) => api.post("/professors", data);
export const updateProfessor = (id, data) => api.put(`/professors/${id}`, data);
export const deleteProfessor = (id) => api.delete(`/professors/${id}`);