import { useNavigate } from 'react-router-dom';

export const ManagePics = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0a0f1e] flex flex-col items-center justify-center text-white">
      <p className="text-xs font-semibold tracking-[0.3em] text-sky-400 uppercase mb-4">
        Gallery
      </p>
      <h1 className="text-5xl font-bold mb-4">Manage Pics</h1>
      <p className="text-slate-400 text-base mb-10 text-center max-w-sm">
        Organize and relive your travel memories in one place.
      </p>
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 px-6 py-3 border border-white/10 hover:border-sky-400/50 text-slate-300 hover:text-sky-400 font-semibold rounded-2xl transition-all duration-200 cursor-pointer"
      >
        <span>&#8592;</span>
        <span>Back to Home</span>
      </button>
    </div>
  );
};
