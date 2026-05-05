import type { RecommendedPlaceCard } from '../../features/planTrip/googlePlaces';

type CityRecommendationCardProps = {
  place: RecommendedPlaceCard;
  onSelect: () => void;
};

function RatingBadge({ rating }: { rating: number }) {
  const label = `${rating.toFixed(1)} out of five`;

  return (
    <span
      className="inline-flex items-baseline gap-0.5 text-amber-400 tabular-nums"
      title={label}
    >
      <span className="text-[15px] font-semibold leading-none">{rating.toFixed(1)}</span>
      <span className="text-[13px] leading-none" aria-hidden="true">
        ★
      </span>
      <span className="sr-only">{label}</span>
    </span>
  );
}

export function CityRecommendationCard({
  place,
  onSelect,
}: CityRecommendationCardProps) {
  const {
    displayName,
    backendCity,
    rating,
    userRatingsTotal,
    formattedAddress,
    photoUrl,
    primaryType,
    openNow,
  } = place;

  return (
    <button
      type="button"
      onClick={onSelect}
      className="flex w-full text-left gap-0 rounded-2xl overflow-hidden border border-white/10 bg-white/[0.04] hover:bg-white/[0.07] hover:border-sky-400/35 transition-all cursor-pointer shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/55 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0c1224]"
    >
      <div className="relative h-[108px] w-[108px] shrink-0 sm:h-[118px] sm:w-[132px] bg-linear-to-br from-slate-700 to-slate-900">
        {photoUrl ? (
          <img
            src={photoUrl}
            alt=""
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xl font-semibold tracking-tight text-white/55">
            {backendCity.slice(0, 2).toUpperCase()}
          </div>
        )}
        {primaryType ? (
          <span className="absolute bottom-2 left-2 rounded-md bg-black/55 backdrop-blur-sm px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-white/90">
            {primaryType}
          </span>
        ) : null}
      </div>

      <div className="min-w-0 flex-1 py-3 px-3.5 sm:py-4 sm:px-4 flex flex-col justify-center gap-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="text-[15px] sm:text-base font-semibold text-white truncate">
              {displayName}
            </h3>
            {displayName !== backendCity ? (
              <p className="text-xs text-slate-500 truncate">{backendCity}</p>
            ) : null}
          </div>
          {rating != null && rating > 0 ? (
            <div className="shrink-0 flex flex-col items-end gap-0.5">
              <RatingBadge rating={rating} />
              {userRatingsTotal != null && userRatingsTotal > 0 ? (
                <span className="text-[11px] text-slate-500 whitespace-nowrap">
                  ({userRatingsTotal.toLocaleString()})
                </span>
              ) : (
                <span className="text-[11px] text-slate-500">Reviews</span>
              )}
            </div>
          ) : (
            <span className="shrink-0 text-[11px] text-slate-500 italic">
              No rating
            </span>
          )}
        </div>

        {formattedAddress ? (
          <p className="text-xs text-slate-400 leading-snug line-clamp-2">
            {formattedAddress}
          </p>
        ) : null}

        <div className="flex flex-wrap items-center gap-2 mt-1">
          {typeof openNow === 'boolean' ? (
            <span
              className={
                openNow
                  ? 'inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium bg-emerald-500/15 text-emerald-300 border border-emerald-400/25'
                  : 'inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium bg-white/6 text-slate-400 border border-white/10'
              }
            >
              {openNow ? 'Open now · typical hours' : 'Hours may vary'}
            </span>
          ) : null}
          <span className="text-[11px] text-sky-400/85 font-medium">
            View itinerary →
          </span>
        </div>
      </div>
    </button>
  );
}
