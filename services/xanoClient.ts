import axios, { AxiosInstance, AxiosError } from 'axios';

// Xano API Client Configuration
const XANO_BASE_URL = import.meta.env.VITE_XANO_API_URL || 'https://x8ki-letl-twmt.n7.xano.io/api:v1';

// Create axios instance
const xanoClient: AxiosInstance = axios.create({
    baseURL: XANO_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

// Request interceptor to add auth token
xanoClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('xano_auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
xanoClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('xano_auth_token');
            localStorage.removeItem('xano_user');
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

export default xanoClient;

// Helper function to handle API errors
export const handleApiError = (error: any): string => {
    if (error.response?.data?.message) {
        return error.response.data.message;
    }
    if (error.message) {
        return error.message;
    }
    return 'An unexpected error occurred';
};
