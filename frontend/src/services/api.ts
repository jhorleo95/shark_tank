// api.ts
// Aquí configuraremos axios o fetch para conectarse al backend Django

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const fetchTest = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/ping/`);
        return await response.json();
    } catch (error) {
        console.error('Error connecting to backend:', error);
        return null;
    }
};

export const fetchItems = async () => {
    try {
        // En Next.js 13+ App Router con fetch, agregamos { cache: 'no-store' } para datos dinámicos
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
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error(`Failed to create ${endpoint}`);
        return await response.json();
    } catch (error) {
        console.error(`Error creating ${endpoint}:`, error);
        return null;
    }
};
