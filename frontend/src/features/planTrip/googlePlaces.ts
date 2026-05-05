import { importLibrary, setOptions } from '@googlemaps/js-api-loader';

export type RecommendedPlaceCard = {
  /** City string from `/get_cities` — passed through to itinerary. */
  backendCity: string;
  displayName: string;
  rating?: number;
  userRatingsTotal?: number;
  formattedAddress?: string;
  photoUrl?: string;
  primaryType?: string;
  openNow?: boolean;
  /** Google's required attribution snippets for this record (often empty). */
  htmlAttributions?: string[];
};

export function googleMapsApiKeyConfigured(): boolean {
  return Boolean(googleMapsApiKey());
}

export function googleMapsApiKey(): string | undefined {
  const k = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  if (typeof k !== 'string') return undefined;
  const trimmed = k.trim();
  return trimmed === '' ? undefined : trimmed;
}

let placesReady: Promise<{
  service: google.maps.places.PlacesService;
  PlacesServiceStatus: typeof google.maps.places.PlacesServiceStatus;
}> | null = null;

function ensurePlacesLoaded(): Promise<{
  service: google.maps.places.PlacesService;
  PlacesServiceStatus: typeof google.maps.places.PlacesServiceStatus;
}> {
  const key = googleMapsApiKey();
  if (!key) {
    return Promise.reject(new Error('MISSING_GOOGLE_MAPS_KEY'));
  }

  if (!placesReady) {
    const run = async () => {
      setOptions({ key, v: 'weekly' });
      const [{ Map }, placesLib] = await Promise.all([
        importLibrary('maps'),
        importLibrary('places'),
      ]);

      const container = document.createElement('div');
      container.setAttribute('aria-hidden', 'true');
      container.style.cssText =
        'position:absolute;width:320px;height:240px;top:0;left:-4000px;visibility:hidden;pointer-events:none';

      document.body.appendChild(container);

      const map = new Map(container, {
        center: { lat: 22.9734, lng: 78.6569 },
        zoom: 4,
        disableDefaultUI: true,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      });

      return {
        service: new placesLib.PlacesService(map),
        PlacesServiceStatus: placesLib.PlacesServiceStatus,
      };
    };

    placesReady = run().catch((e) => {
      placesReady = null;
      throw e;
    });
  }

  return placesReady;
}

function textSearchBestMatch(
  service: google.maps.places.PlacesService,
  PlacesServiceStatus: typeof google.maps.places.PlacesServiceStatus,
  request: google.maps.places.TextSearchRequest,
): Promise<google.maps.places.PlaceResult | null> {
  return new Promise((resolve) => {
    service.textSearch(request, (results, status) => {
      if (status !== PlacesServiceStatus.OK || !results?.length) {
        resolve(null);
        return;
      }
      resolve(results[0]);
    });
  });
}

function formatPrimaryType(types: string[] | undefined): string | undefined {
  if (!types?.length) return undefined;
  const vague = new Set([
    'establishment',
    'point_of_interest',
    'geocode',
    'political',
    'premise',
    'route',
    'street_address',
  ]);
  const pick = types.find((t) => !vague.has(t)) ?? types[0];
  if (!pick) return undefined;
  return pick
    .split('_')
    .map((w) => w.slice(0, 1).toUpperCase() + w.slice(1))
    .join(' ');
}

function placeToCard(
  backendCity: string,
  place: google.maps.places.PlaceResult | null,
): RecommendedPlaceCard {
  if (!place) {
    return { backendCity, displayName: backendCity };
  }

  let photoUrl: string | undefined;
  const photo = place.photos?.[0];
  if (photo?.getUrl) {
    photoUrl = photo.getUrl({ maxWidth: 480 });
  }

  const openHours = place.opening_hours;

  return {
    backendCity,
    displayName: place.name?.trim() || backendCity,
    rating: place.rating ?? undefined,
    userRatingsTotal: place.user_ratings_total ?? undefined,
    formattedAddress: place.formatted_address ?? undefined,
    photoUrl,
    primaryType: formatPrimaryType(place.types),
    openNow:
      typeof openHours?.open_now === 'boolean' ? openHours.open_now : undefined,
    htmlAttributions: place.html_attributions ?? undefined,
  };
}

/** One Google-backed card per backend city label; never throws once Places is initialized. */
export async function fetchPlaceCardsForCities(
  backendCities: string[],
): Promise<{ cards: RecommendedPlaceCard[]; attributionsHtml: string[] }> {
  try {
    const { service, PlacesServiceStatus } = await ensurePlacesLoaded();
    const results = await Promise.all(
      backendCities.map(async (city) => {
        try {
          const place = await textSearchBestMatch(service, PlacesServiceStatus, {
            query: `${city}, India`,
            region: 'in',
            language: 'en',
            location: { lat: 23.5937, lng: 78.9629 },
            radius: 2_000_000,
          });
          return placeToCard(city, place);
        } catch {
          return placeToCard(city, null);
        }
      }),
    );

    const attrSet = new Set<string>();
    for (const c of results) {
      for (const h of c.htmlAttributions ?? []) {
        if (h.trim()) attrSet.add(h);
      }
    }

    const stripped = results.map(({ htmlAttributions, ...rest }) => {
      void htmlAttributions;
      return rest;
    });
    return {
      cards: stripped,
      attributionsHtml: [...attrSet],
    };
  } catch {
    return {
      cards: backendCities.map((city) => placeToCard(city, null)),
      attributionsHtml: [],
    };
  }
}
