import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
    withCredentials: true
})

export const signUp = async (userName:string, password:string) => {
    const res = await api.post('/api/auth/signup', { userName, password });
    return res.data;
}

export const signIn = async (userName:string, password:string) => {
    const res = await api.post('/api/auth/signin', { userName, password });
    return res.data;
}

export const signOut = async () => {
    const res = await api.post('/api/auth/signout');
    return res.data;
}

export const getCurrentUser = async () => {
    const res = await api.get('/api/auth/currentuser');
    return res.data;
}

export default api;