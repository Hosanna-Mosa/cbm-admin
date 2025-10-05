import { api } from '@/lib/api';

export async function requestOtp() {
  const { data } = await api.post('/api/admin/auth/request-otp', {});
  return data as { success: boolean; message?: string };
}

export async function verifyOtp(code: string) {
  const { data } = await api.post('/api/admin/auth/verify-otp', { code });
  return data as { success: boolean; data?: { token: string }; message?: string };
}

