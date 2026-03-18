import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api/',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include the JWT token in headers
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle token expiration (optional but good)
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refresh_token');
            if (refreshToken) {
                try {
                    const response = await axios.post('http://localhost:8000/api/users/refresh/', {
                        refresh: refreshToken,
                    });
                    localStorage.setItem('access_token', response.data.access);
                    api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
                    return api(originalRequest);
                } catch (refreshError) {
                    // Token refresh failed, logout user
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    window.location.reload();
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;
