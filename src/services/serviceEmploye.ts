import { Employe } from "../types/Employe";

const API_URL = 'http://127.0.0.1:8000/api/employes';

export const getEmployes = async (): Promise<Employe[]> => {
    const res = await fetch(API_URL);
    return await res.json();
};

export const createEmploye = async (employe: Employe) => {
    const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(employe)
    });

    return await res.json();
};

export const updateEmploye = async (employe: Employe) => {
    const res = await fetch(`${API_URL}/${employe.id}`, {
       method: 'PUT',
       headers: { 'content-type': 'application/json' },
       body: JSON.stringify(employe) 
    });

    return await res.json();
};

export const deleteEmploye = async (id: number) => {
    const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
    });

    return await res.json();
};