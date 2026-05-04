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
  return (
    <div className="w-full max-w-lg mx-auto text-center rounded-3xl border border-white/10 bg-[#121a2e]/90 backdrop-blur-xl py-12 px-6 sm:px-10 shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset,0_32px_64px_-32px_rgba(0,0,0,0.65)]">
      <p className="text-xs font-semibold tracking-[0.25em] text-sky-400 uppercase mb-4">
        Your travel personality
      </p>
      <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight mb-6 text-balance">
        {personality}
      </h2>
      <p className="text-slate-400 text-sm mb-10 leading-relaxed">
        We matched your answers and found the top cities for your travel style.
      </p>
      {loadingCities ? (
        <p className="text-slate-300 text-sm mb-8">
          Finding your top 5 cities...
        </p>
      ) : null}
      {cityError ? (
        <p className="mb-6 text-sm text-red-200 bg-red-500/10 border border-red-400/20 rounded-xl px-4 py-3">
          {cityError}
        </p>
      ) : null}
      {!loadingCities && !cityError ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 text-left">
          {cities.map((city) => (
            <button
              key={city}
              type="button"
              onClick={() => onSelectCity(city)}
              className="px-4 py-3 rounded-xl font-semibold text-slate-100 bg-white/5 hover:bg-sky-500/15 border border-white/10 hover:border-sky-400/40 transition-all cursor-pointer"
            >
              {city}
            </button>
          ))}
        </div>
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
