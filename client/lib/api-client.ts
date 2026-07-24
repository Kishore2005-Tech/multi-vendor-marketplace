import axios from "axios";

const apiClient = axios.create({
  
  headers: { "Content-Type": "application/json" },
});

// Attach JWT from localStorage to every request, if present.
apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// If the token is invalid/expired, clear it so the UI can redirect to sign-in.
apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("token");
      ;
    }
    return Promise.reject(err);
  }
);

export default apiClient;
