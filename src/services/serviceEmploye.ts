import { Employe } from "../types/Employe";

const API_URL = 'http://localhost/api/employes';

export const getEmployes = async (): Promise<Employe[]> => {
    const res = await fetch(API_URL);
    return await res.json();
};

export const createEmploye = async (employe: Employe) => {
    await fetch(API_URL, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(employe)
    });
};

export const updateEmploye = async (employe: Employe) => {
    await fetch(`${API_URL}/${employe.id}`, {
       method: 'PUT',
       headers: { 'content-type': 'application/json' },
       body: JSON.stringify(employe) 
    });
};

export const deleteEmploye = async (id: number) => {
    await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
    });
};