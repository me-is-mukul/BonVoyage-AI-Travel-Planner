import { useNavigate } from 'react-router-dom';
import { GlobeScene } from '../components/GlobeScene';

export const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Left panel */}
      <div className="relative flex flex-col justify-center px-16 w-[42%] bg-[#0a0f1e]">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-900/20 to-transparent pointer-events-none" />

        <div className="relative mb-12">
          <p className="text-xs font-semibold tracking-[0.3em] text-sky-400 uppercase mb-4">
            AI-Powered Travel
          </p>
          <h1 className="text-6xl font-bold text-white leading-tight">
            Bon
            <span className="text-sky-400">Voyage.</span>
          </h1>
          <p className="mt-5 text-slate-400 text-base leading-relaxed max-w-xs">
            Your intelligent companion for crafting unforgettable journeys.
          </p>
        </div>

        <div className="relative flex flex-row gap-5 w-full">
          <button
            onClick={() => navigate('/plan-trip')}
            className="group flex items-center justify-between px-6 py-4 bg-white/5 hover:bg-blue-400/10 border border-white/10 hover:border-sky-400/50 text-white font-semibold rounded-2xl transition-all duration-200 backdrop-blur-sm cursor-pointer">
            <span>Plan a Trip</span>
            <span className="group-hover:translate-x-1 transition-transform duration-200">&#8594;</span>
          </button>

          <button
            onClick={() => navigate('/manage-pics')}
            className="group flex items-center justify-between px-6 py-4 bg-white/5 hover:bg-blue-400/10 border border-white/10 hover:border-sky-400/50 text-white font-semibold rounded-2xl transition-all duration-200 backdrop-blur-sm cursor-pointer"
          >
            <span>Manage Pics</span>
            <span className="group-hover:translate-x-1 transition-transform duration-200">&#8594;</span>
          </button>
        </div>
      </div>

      {/* Right panel — 3D globe */}
      <div className="flex-1 relative bg-[#0a0f1e]">
        <GlobeScene />
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#0a0f1e] to-transparent pointer-events-none" />
      </div>
    </div>
  );
};
