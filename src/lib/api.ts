import axios, { InternalAxiosRequestConfig } from 'axios';

// ✅ Define Vite env types for TypeScript
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// ✅ Compute base URL dynamically
const apiBaseURL = false ? "http://localhost:8000" : "https://api2.brelis.in/";

// ✅ Create Axios instance
export const api = axios.create({
  baseURL: apiBaseURL,
  headers: { 'Content-Type': 'application/json' },
});

// ✅ Use correct interceptor typing (Axios v1+)
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;

  if (token) {
    // Ensure headers object exists
    config.headers = config.headers || {};
    // Use set() if headers is an AxiosHeaders instance
    if (typeof config.headers.set === 'function') {
      config.headers.set('Authorization', `Bearer ${token}`);
    } else {
      // fallback for non-AxiosHeaders type
      (config.headers as any)['Authorization'] = `Bearer ${token}`;
    }
  }

  return config;
});
