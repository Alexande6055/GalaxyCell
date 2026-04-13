import { auth } from "../services/firebase/config"
import { toast } from "sonner"

const BASE_URL = import.meta.env.VITE_BASE_URL

interface RequestOptions extends RequestInit {
  headers?: Record<string, string>
}

const request = async <T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> => {
  let res: Response | undefined
  const url = `${BASE_URL}${endpoint}`

  const user = auth.currentUser
  let token: string | null = null

  if (user) {
    token = await user.getIdToken(true)
  }

  const isFormData = options.body instanceof FormData

  const headers: Record<string, string> = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  // Solo poner Content-Type JSON si NO es FormData
  if (!isFormData) {
    headers["Content-Type"] = "application/json"
  }

  const config: RequestInit = {
    ...options,
    headers,
  }

  try {
    res = await fetch(url, config)

    const contentType = res.headers.get("content-type") || ""
    const isJsonResponse = contentType.includes("application/json")

    if (!res.ok) {
      const errorData = isJsonResponse
        ? await res.json().catch(() => ({}))
        : await res.text().catch(() => "")

      const message =
        typeof errorData === "string"
          ? errorData || `Error ${res.status}: ${res.statusText}`
          : errorData.message || `Error ${res.status}: ${res.statusText}`

      if (res.status === 401) {
        console.warn("Sesión no autorizada o expirada")
      }

      toast.error(message)
      throw new Error(message)
    }

    if (isJsonResponse) {
      return (await res.json()) as T
    }

    return {} as T
  } catch (error: any) {
    console.error("API ERROR:", error.message)
    if (!res) toast.error("No se pudo conectar con el servidor")
    throw error
  }
}

export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint),

  post: <T>(endpoint: string, data: unknown) =>
    request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  put: <T>(endpoint: string, data: unknown) =>
    request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  patch: <T>(endpoint: string, data: unknown) =>
    request<T>(endpoint, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  delete: <T>(endpoint: string) =>
    request<T>(endpoint, {
      method: "DELETE",
    }),

  postFile: <T>(endpoint: string, data: FormData) =>
    request<T>(endpoint, {
      method: "POST",
      body: data,
    }),

  patchFile: <T>(endpoint: string, data: FormData) =>
    request<T>(endpoint, {
      method: "PATCH",
      body: data,
    }),
}