import axios, { AxiosInstance, AxiosError } from 'axios';

// Laravel API Client Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Create axios instance
const laravelClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    timeout: 10000,
});

// Request interceptor to add auth token
laravelClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('laravel_auth_token');
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
laravelClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('laravel_auth_token');
            localStorage.removeItem('laravel_user');
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

export default laravelClient;

// Helper function to handle API errors
export const handleApiError = (error: any): string => {
    if (error.response?.data?.message) {
        return error.response.data.message;
    }
    if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const firstError = Object.values(errors)[0];
        return Array.isArray(firstError) ? firstError[0] : String(firstError);
    }
    if (error.message) {
        return error.message;
    }
    return 'An unexpected error occurred';
};
