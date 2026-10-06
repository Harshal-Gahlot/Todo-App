// Auto-selects backend URL based on Vite's mode (dev vs production)
const isDev = import.meta.env.DEV;
export const API_BASE = isDev
    ? "http://localhost:3000"
    : "https://todo-app-be-0kqo.onrender.com";
