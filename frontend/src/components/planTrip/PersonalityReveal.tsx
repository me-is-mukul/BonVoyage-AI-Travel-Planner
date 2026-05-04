type PersonalityRevealProps = {
  personality: string;
  onRetake: () => void;
  onBackHome: () => void;
};

export function PersonalityReveal({
  personality,
  onRetake,
  onBackHome,
}: PersonalityRevealProps) {
  return (
    <div className="w-full max-w-lg mx-auto text-center rounded-3xl border border-white/[0.1] bg-[#121a2e]/90 backdrop-blur-xl py-12 px-6 sm:px-10 shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset,0_32px_64px_-32px_rgba(0,0,0,0.65)]">
      <p className="text-xs font-semibold tracking-[0.25em] text-sky-400 uppercase mb-4">
        Your travel personality
      </p>
      <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight mb-6 text-balance">
        {personality}
      </h2>
      <p className="text-slate-400 text-sm mb-10 leading-relaxed">
        We matched your answers to the same model used in Bon Voyage. You can refine your
        trip preferences from here as we expand the planner.
      </p>
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
