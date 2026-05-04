import type { GetCitiesResponse } from '../types';

function apiBase(): string {
  return import.meta.env.VITE_API_BASE_URL ?? '';
}

export async function getCities(personality: string): Promise<GetCitiesResponse> {
  const res = await fetch(`${apiBase()}/get_cities`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ personality }),
  });

  const data = (await res.json()) as GetCitiesResponse;

  if (!res.ok && 'error' in data) {
    return data;
  }

  if (!res.ok) {
    return { error: `Request failed (${res.status})` };
  }

  return data;
}
