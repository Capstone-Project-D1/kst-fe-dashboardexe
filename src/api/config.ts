const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"
).replace(/\/$/, "");

export interface ApiEnvelope<T> {
  timestamp: string;
  response: T;
  error?: {
    code: number;
    message: string;
  };
}

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function buildUrl(path: string, query?: Record<string, unknown>) {
  const url = new URL(`${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`);
  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });
  return url.toString();
}

async function request<T>(
  path: string,
  options: RequestInit & { query?: Record<string, unknown>; retry?: boolean } = {},
): Promise<T> {
  const token = localStorage.getItem("access_token");
  const headers = new Headers(options.headers);

  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(buildUrl(path, options.query), {
    ...options,
    headers,
    credentials: "include",
  });

  if (response.status === 401 && options.retry !== false && path !== "/auth/refresh") {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      return request<T>(path, { ...options, retry: false });
    }
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    if (!response.ok) throw new ApiError(response.status, response.statusText);
    return response as T;
  }

  const envelope = (await response.json()) as ApiEnvelope<T | null>;
  if (!response.ok || envelope.error) {
    throw new ApiError(envelope.error?.code ?? response.status, envelope.error?.message ?? "Request gagal");
  }
  return envelope.response as T;
}

async function refreshAccessToken() {
  try {
    const response = await request<{ accessToken: string }>("/auth/refresh", {
      method: "POST",
      retry: false,
    });
    localStorage.setItem("access_token", response.accessToken);
    return true;
  } catch {
    localStorage.removeItem("access_token");
    localStorage.removeItem("currentUser");
    return false;
  }
}

export const apiClient = {
  get: <T>(path: string, query?: Record<string, unknown>) => request<T>(path, { query }),
  post: <T>(path: string, body?: unknown, query?: Record<string, unknown>) =>
    request<T>(path, {
      method: "POST",
      body: body === undefined ? undefined : JSON.stringify(body),
      query,
    }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: "PATCH",
      body: body === undefined ? undefined : JSON.stringify(body),
    }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};

export function getDownloadUrl(path: string, query?: Record<string, unknown>) {
  return buildUrl(path, query);
}
