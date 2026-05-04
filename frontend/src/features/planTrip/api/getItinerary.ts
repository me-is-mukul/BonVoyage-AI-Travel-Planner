import type { GetItineraryResponse } from '../types';

function apiBase(): string {
  return import.meta.env.VITE_API_BASE_URL ?? '';
}

export type FetchItineraryParams = {
  city: string;
  days: number;
  personality: string;
  signal?: AbortSignal;
};

export async function getItinerary({
  city,
  days,
  personality,
  signal,
}: FetchItineraryParams): Promise<GetItineraryResponse> {
  const res = await fetch(`${apiBase()}/get_itinerary`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ city, days, personality }),
    signal,
  });

  const data = (await res.json()) as GetItineraryResponse;

  if (!res.ok && 'error' in data) {
    return data;
  }

  if (!res.ok) {
    return { error: `Request failed (${res.status})` };
  }

  return data;
}
