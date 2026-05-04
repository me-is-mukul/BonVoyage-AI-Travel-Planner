import { useNavigate } from 'react-router-dom';
import { PlanTripQuiz } from '../components/planTrip/PlanTripQuiz';

export const PlanTrip = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0a0f1e] relative overflow-x-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            'radial-gradient(ellipse 80% 50% at 50% -20%, rgb(56 189 248 / 0.25), transparent), radial-gradient(ellipse 60% 40% at 100% 50%, rgb(167 139 250 / 0.12), transparent)',
        }}
      />

      <header className="relative z-10 flex items-center justify-between px-6 sm:px-10 py-6 max-w-6xl mx-auto w-full">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="text-sm font-semibold text-slate-400 hover:text-sky-400 transition-colors cursor-pointer flex items-center gap-2"
        >
          <span aria-hidden>&#8592;</span>
          <span>Home</span>
        </button>
        <p className="text-xs font-semibold tracking-[0.3em] text-sky-400/90 uppercase">
          Plan a trip
        </p>
      </header>

      <main className="relative z-10 px-4 sm:px-6 pb-16 pt-4 sm:pt-8 max-w-6xl mx-auto w-full">
        <div className="mb-8 sm:mb-12 text-center max-w-xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-3">
            Travel personality
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Twelve quick questions. Agree or disagree with each statement — your answers
            shape the trip style we detect for you.
          </p>
        </div>

        <PlanTripQuiz />
      </main>
    </div>
  );
};
