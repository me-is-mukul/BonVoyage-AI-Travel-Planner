import type { ModelAnswer, PredictPersonalityResponse } from '../types';

function apiBase(): string {
  return import.meta.env.VITE_API_BASE_URL ?? '';
}

export async function predictPersonality(
  answers: ModelAnswer[],
): Promise<PredictPersonalityResponse> {
  const res = await fetch(`${apiBase()}/predict_personality`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ answers }),
  });

  const data = (await res.json()) as PredictPersonalityResponse;

  if (!res.ok && 'error' in data) {
    return data;
  }

  if (!res.ok) {
    return { error: `Request failed (${res.status})` };
  }

  return data;
}
