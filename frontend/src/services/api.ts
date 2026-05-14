import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/v1",
});

export default api;

export const getItems = async () => {
  const res = await api.get("/items/");
  return res.data;
};

export const createItem = async (data: any) => {
  const res = await api.post("/items/", data);
  return res.data;
};

export const updateItem = async (id: number, data: any) => {
  const res = await api.put(`/items/${id}/`, data);
  return res.data;
};

export const deleteItem = async (id: number) => {
  const res = await api.delete(`/items/${id}/`);
  return res.data;
};

export const getEntradas = async () => {
  const res = await api.get("/entradas/");
  return res.data;
};

export const createEntrada = async (data: any) => {
  const res = await api.post("/entradas/", data);
  return res.data;
};

export const getSalidas = async () => {
  const res = await api.get("/salidas/");
  return res.data;
};

export const createSalida = async (data: any) => {
  const res = await api.post("/salidas/", data);
  return res.data;
};

// Funciones compatibles con las páginas existentes
const API_BASE_URL = 'http://127.0.0.1:8000/api';

export const fetchItems = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/v1/items/`, { cache: 'no-store' });
    if (!response.ok) throw new Error('Failed to fetch items');
    return await response.json();
  } catch (error) {
    console.error('Error fetching items:', error);
    return [];
  }
};

export const fetchGeneric = async (endpoint: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/v1/${endpoint}/`, { cache: 'no-store' });
    if (!response.ok) throw new Error(`Failed to fetch ${endpoint}`);
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    return [];
  }
};

export const createData = async (endpoint: string, data: any) => {
  try {
    const response = await fetch(`${API_BASE_URL}/v1/${endpoint}/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`Failed to create ${endpoint}`);
    return await response.json();
  } catch (error) {
    console.error(`Error creating ${endpoint}:`, error);
    return null;
  }
};
