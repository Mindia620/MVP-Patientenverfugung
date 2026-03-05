const API_BASE = '/api';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, body.error || 'Unknown error');
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export const api = {
  auth: {
    register: (email: string, password: string) =>
      request<{ user: { id: string; email: string } }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    login: (email: string, password: string) =>
      request<{ user: { id: string; email: string } }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    logout: () =>
      request<void>('/auth/logout', { method: 'POST' }),
    me: () =>
      request<{ user: { id: string; email: string } }>('/auth/me'),
  },
  documents: {
    save: (answers: unknown) =>
      request<{ id: string }>('/documents', {
        method: 'POST',
        body: JSON.stringify({ answers }),
      }),
    list: () =>
      request<{ packages: DocumentPackageResponse[] }>('/documents'),
    get: (id: string) =>
      request<{ package: DocumentPackageResponse }>(`/documents/${id}`),
    delete: (id: string) =>
      request<void>(`/documents/${id}`, { method: 'DELETE' }),
    generate: (id: string) =>
      request<{ documents: GeneratedDocResponse[] }>(`/documents/${id}/generate`, {
        method: 'POST',
      }),
    downloadUrl: (packageId: string, type: string) =>
      `${API_BASE}/documents/${packageId}/pdf/${type}`,
  },
};

export interface DocumentPackageResponse {
  id: string;
  status: string;
  wizardVersion: string;
  createdAt: string;
  updatedAt: string;
  generatedDocuments: GeneratedDocResponse[];
}

export interface GeneratedDocResponse {
  id: string;
  documentType: string;
  fileName: string;
  generatedAt: string;
}
