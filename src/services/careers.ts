import { api } from '@/lib/api';

export type Career = {
  _id?: string;
  title: string;
  department: string;
  location: string;
  type: string;
  level: string;
  description: string;
  isActive?: boolean;
};

export async function listCareers() {
  const { data } = await api.get('/api/careers');
  return data.data as Career[];
}

export async function createCareer(payload: Career) {
  const { data } = await api.post('/api/careers', payload);
  return data.data as Career;
}

export async function updateCareer(id: string, payload: Partial<Career>) {
  const { data } = await api.put(`/api/careers/${id}`, payload);
  return data.data as Career;
}

export async function deleteCareer(id: string) {
  const { data } = await api.delete(`/api/careers/${id}`);
  return data.data as { id: string };
}

