import { useEffect, useState } from 'react';
import {
  fetchPlaceCardsForCities,
  googleMapsApiKeyConfigured,
  type RecommendedPlaceCard,
} from '../../features/planTrip/googlePlaces';
import { CityRecommendationCard } from './CityRecommendationCard';

type PersonalityRevealProps = {
  personality: string;
  cities: string[];
  loadingCities: boolean;
  cityError: string | null;
  onSelectCity: (city: string) => void;
  onRetake: () => void;
  onBackHome: () => void;
};

export function PersonalityReveal({
  personality,
  cities,
  loadingCities,
  cityError,
  onSelectCity,
  onRetake,
  onBackHome,
}: PersonalityRevealProps) {
  const [googleCards, setGoogleCards] = useState<RecommendedPlaceCard[] | null>(
    null,
  );
  const [placesLoading, setPlacesLoading] = useState(false);
  const [attributionsHtml, setAttributionsHtml] = useState<string[]>([]);

  const showCityGrid =
    !loadingCities &&
    !cityError &&
    cities.length > 0;

  const useGooglePlaces = googleMapsApiKeyConfigured();

  const fallbackCards: RecommendedPlaceCard[] =
    showCityGrid && !useGooglePlaces
      ? cities.map((c) => ({ backendCity: c, displayName: c }))
      : [];

  const showPlacesSkeleton =
    Boolean(useGooglePlaces && showCityGrid && (placesLoading || googleCards === null));

  const resolvedCards: RecommendedPlaceCard[] | null =
    !showCityGrid
      ? null
      : useGooglePlaces
        ? googleCards
        : fallbackCards;

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      await Promise.resolve();

      if (cancelled) return;

      if (
        loadingCities ||
        cityError ||
        cities.length === 0 ||
        !googleMapsApiKeyConfigured()
      ) {
        setGoogleCards(null);
        setPlacesLoading(false);
        setAttributionsHtml([]);
        return;
      }

      setPlacesLoading(true);
      setGoogleCards(null);
      setAttributionsHtml([]);

      const { cards, attributionsHtml: attrs } =
        await fetchPlaceCardsForCities(cities);

      if (cancelled) return;

      setGoogleCards(cards);
      setAttributionsHtml(attrs);
      setPlacesLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [loadingCities, cityError, cities]);

  const googleApiHint =
    showCityGrid && !useGooglePlaces
      ? 'Add VITE_GOOGLE_MAPS_API_KEY to frontend/.env with Maps JavaScript API and Places API enabled (restrict the key by HTTP referrer in Google Cloud Console).'
      : null;

  return (
    <div className="w-full max-w-2xl mx-auto rounded-3xl border border-white/10 bg-[#121a2e]/90 backdrop-blur-xl py-10 px-5 sm:px-10 shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset,0_32px_64px_-32px_rgba(0,0,0,0.65)]">
      <div className="text-center mb-8">
        <p className="text-xs font-semibold tracking-[0.25em] text-sky-400 uppercase mb-3">
          Your travel personality
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight mb-3 text-balance">
          {personality}
        </h2>
        <p className="text-slate-400 text-sm leading-relaxed max-w-md mx-auto">
          We matched your answers and found the top cities for your travel style.
        </p>
      </div>

      {loadingCities ? (
        <p className="text-center text-slate-300 text-sm mb-8">
          Finding your top 5 cities...
        </p>
      ) : null}

      {cityError ? (
        <p className="mb-6 text-sm text-red-200 bg-red-500/10 border border-red-400/20 rounded-xl px-4 py-3">
          {cityError}
        </p>
      ) : null}

      {showCityGrid && (showPlacesSkeleton || resolvedCards?.length) ? (
        <div className="space-y-3 mb-6">
          {showPlacesSkeleton
            ? cities.map((city) => (
                <div
                  key={city}
                  className="flex w-full gap-0 rounded-2xl overflow-hidden border border-white/10 bg-white/[0.03] animate-pulse"
                >
                  <div className="h-[108px] w-[108px] sm:h-[118px] sm:w-[132px] shrink-0 bg-white/10" />
                  <div className="flex-1 p-4 space-y-2">
                    <div className="h-4 rounded bg-white/10 w-2/5" />
                    <div className="h-3 rounded bg-white/8 w-full" />
                    <div className="h-3 rounded bg-white/8 w-4/5" />
                  </div>
                </div>
              ))
            : (resolvedCards ?? []).map((place) => (
                <CityRecommendationCard
                  key={place.backendCity}
                  place={place}
                  onSelect={() => onSelectCity(place.backendCity)}
                />
              ))}
        </div>
      ) : null}

      {googleApiHint ? (
        <p className="text-xs text-slate-500 mb-6 text-center leading-relaxed px-2">
          {googleApiHint}
        </p>
      ) : null}

      {useGooglePlaces && attributionsHtml.length > 0 ? (
        <div
          className="mb-8 text-[10px] text-slate-500 leading-snug [&_a]:text-sky-400/90 [&_a]:underline underline-offset-2"
          dangerouslySetInnerHTML={{
            __html: attributionsHtml.join(''),
          }}
        />
      ) : null}

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          type="button"
          onClick={onRetake}
          className="px-6 py-3 rounded-2xl font-semibold text-white bg-white/5 hover:bg-teal-500/15 border border-white/10 hover:border-teal-400/40 transition-all cursor-pointer"
        >
          Retake survey
        </button>
        <button
          type="button"
          onClick={onBackHome}
          className="px-6 py-3 rounded-2xl font-semibold text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-sky-400/40 transition-all cursor-pointer"
        >
          Back to home
        </button>
      </div>
    </div>
  );
}
