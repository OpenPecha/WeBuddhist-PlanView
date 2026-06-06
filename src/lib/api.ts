import axios from "axios"

const tokenRaw = import.meta.env.VITE_TOKEN
const token = typeof tokenRaw === "string" ? tokenRaw.trim() : ""
const baseURL = import.meta.env.VITE_BACKEND_BASE_URL

const api = axios.create({
  ...(baseURL ? { baseURL } : {}),
  ...(token
    ? {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    : {}),
})

export default api
