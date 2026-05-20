import axios from "axios"

const tokenRaw = import.meta.env.VITE_TOKEN
const token = typeof tokenRaw === "string" ? tokenRaw.trim() : ""

const api = axios.create(
  token
    ? {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    : {},
)

export default api
