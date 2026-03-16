import axios from "axios";
import { auth } from "../firebase/config";
import { toast } from "sonner";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Interceptor para inyectar el Token automáticamente
apiClient.interceptors.request.use(
    async (config) => {
        const user = auth.currentUser;
        if (user) {
            const token = await user.getIdToken(true);
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor para manejo de errores global (opcional)
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = error.response?.data?.message || error.message || "Error inesperado";
        console.error("API Error:", message);
        toast.error(message); // 🔥 aquí
        return Promise.reject(error);
    }
);

export default apiClient;