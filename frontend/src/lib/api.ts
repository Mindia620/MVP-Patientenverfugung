import type { Answers } from '../types';

const API_BASE = '/api';

async function fetchApi<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'Request failed');
  }

  return res.json();
}

export async function register(email: string, password: string) {
  return fetchApi<{ user: { id: string; email: string } }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function login(email: string, password: string) {
  return fetchApi<{ user: { id: string; email: string } }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function logout() {
  return fetchApi<{ ok: boolean }>('/auth/logout', { method: 'POST' });
}

export async function getMe() {
  return fetchApi<{ user: { id: string; email: string } }>('/auth/me');
}

export async function saveDocument(answers: Answers) {
  return fetchApi<{ documentPackage: { id: string } }>('/documents', {
    method: 'POST',
    body: JSON.stringify(answers),
  });
}

export async function listDocuments() {
  return fetchApi<{ documentPackages: Array<{ id: string; wizardVersion: string; createdAt: string }> }>('/documents');
}

export async function getDocument(id: string) {
  return fetchApi<{ documentPackage: { id: string; answers: Answers } }>(`/documents/${id}`);
}

export async function deleteDocument(id: string) {
  return fetchApi<{ ok: boolean }>(`/documents/${id}`, { method: 'DELETE' });
}

export async function downloadPdf(documentType: string, answers: Answers): Promise<Blob> {
  const res = await fetch(`${API_BASE}/pdf/generate`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ documentType, answers }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'PDF generation failed');
  }

  return res.blob();
}
