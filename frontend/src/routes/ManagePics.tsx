import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import JSZip from 'jszip';

type ImageItem = {
  file: File;
  preview: string;
  label?: 'Day' | 'Night';
  probability?: number;
  error?: string;
  loading: boolean;
};

type ClassifyResult = {
  filename: string;
  label?: string;
  probability?: number;
  error?: string;
};

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a   = document.createElement('a');
  a.href = url;  a.download = filename;  a.click();
  URL.revokeObjectURL(url);
}

export const ManagePics = () => {
  const navigate = useNavigate();
  const [images, setImages]           = useState<ImageItem[]>([]);
  const [classifying, setClassifying] = useState(false);
  const [dragOver, setDragOver]       = useState(false);
  const [downloading, setDownloading] = useState<'all' | 'day' | 'night' | null>(null);

  // ─── file handling ──────────────────────────────────────────────────────────

  const addFiles = useCallback((files: FileList | File[]) => {
    const next: ImageItem[] = Array.from(files)
      .filter(f => /\.(png|jpe?g)$/i.test(f.name))
      .map(f => ({ file: f, preview: URL.createObjectURL(f), loading: false }));
    setImages(prev => [...prev, ...next]);
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    addFiles(e.dataTransfer.files);
  };

  const remove = (i: number) => {
    setImages(prev => {
      URL.revokeObjectURL(prev[i].preview);
      return prev.filter((_, idx) => idx !== i);
    });
  };

  const clear = () => {
    images.forEach(img => URL.revokeObjectURL(img.preview));
    setImages([]);
  };

  // ─── classification ──────────────────────────────────────────────────────────

  const classify = async () => {
    if (!images.length || classifying) return;
    setClassifying(true);
    setImages(prev =>
      prev.map(img => ({ ...img, loading: true, label: undefined, probability: undefined, error: undefined }))
    );

    const fd = new FormData();
    images.forEach(img => fd.append('images', img.file));

    try {
      const res = await fetch('/classify', { method: 'POST', body: fd });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const results: ClassifyResult[] = await res.json();

      setImages(prev =>
        prev.map((img, i) => {
          const r = results[i];
          if (!r) return { ...img, loading: false };
          return {
            ...img,
            loading:     false,
            label:       r.label as 'Day' | 'Night' | undefined,
            probability: r.probability,
            error:       r.error,
          };
        })
      );
    } catch {
      setImages(prev => prev.map(img => ({ ...img, loading: false, error: 'Request failed' })));
    } finally {
      setClassifying(false);
    }
  };

  // ─── download ────────────────────────────────────────────────────────────────

  const download = async (which: 'all' | 'day' | 'night') => {
    setDownloading(which);
    const zip = new JSZip();

    const subset = images.filter(img =>
      img.label && (which === 'all' || img.label.toLowerCase() === which)
    );

    if (which === 'all') {
      const dayFolder   = zip.folder('day')!;
      const nightFolder = zip.folder('night')!;
      for (const img of subset) {
        const folder = img.label === 'Day' ? dayFolder : nightFolder;
        folder.file(img.file.name, await img.file.arrayBuffer());
      }
    } else {
      const folder = zip.folder(which)!;
      for (const img of subset) {
        folder.file(img.file.name, await img.file.arrayBuffer());
      }
    }

    const blob = await zip.generateAsync({ type: 'blob' });
    triggerDownload(blob, which === 'all' ? 'classified_photos.zip' : `${which}_photos.zip`);
    setDownloading(null);
  };

  // ─── derived state ───────────────────────────────────────────────────────────

  const dayImages    = images.filter(img => img.label === 'Day');
  const nightImages  = images.filter(img => img.label === 'Night');
  const pending      = images.filter(img => !img.label && !img.error);
  const classified   = dayImages.length + nightImages.length;
  const hasGroups    = classified > 0 && !classifying;

  // ─── shared card renderer ─────────────────────────────────────────────────────

  const Card = ({ img, i }: { img: ImageItem; i: number }) => (
    <div className="relative group bg-white/5 border border-white/10 rounded-xl overflow-hidden">
      <img src={img.preview} alt={img.file.name} className="w-full aspect-square object-cover" />

      {img.loading && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {!img.loading && (
        <button
          onClick={() => remove(i)}
          className="absolute top-1.5 left-1.5 w-5 h-5 bg-black/50 hover:bg-red-600/80 rounded-full text-white text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex items-center justify-center"
        >✕</button>
      )}

      {!img.loading && img.label && (
        <div className={`absolute top-1.5 right-1.5 px-2 py-0.5 rounded-full text-xs font-bold ${
          img.label === 'Day'
            ? 'bg-amber-400/90 text-amber-900'
            : 'bg-indigo-950/95 text-sky-300 border border-sky-500/40'
        }`}>
          {img.label === 'Day' ? '☀ Day' : '🌙 Night'}
        </div>
      )}

      {!img.loading && img.error && (
        <div className="absolute top-1.5 right-1.5 px-2 py-0.5 rounded-full text-xs font-bold bg-red-900/80 text-red-300">
          Error
        </div>
      )}

      <div className="p-2 border-t border-white/5">
        <p className="text-xs text-slate-400 truncate" title={img.file.name}>{img.file.name}</p>
        {img.probability !== undefined && (
          <div className="mt-1.5">
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  img.label === 'Day' ? 'bg-amber-400' : 'bg-sky-400'
                }`}
                style={{
                  width: `${img.label === 'Day'
                    ? img.probability * 100
                    : (1 - img.probability) * 100}%`,
                }}
              />
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">
              {img.label === 'Day'
                ? `${(img.probability * 100).toFixed(1)}% day`
                : `${((1 - img.probability) * 100).toFixed(1)}% night`}
            </p>
          </div>
        )}
      </div>
    </div>
  );

  // ─── section renderer ─────────────────────────────────────────────────────────

  const Section = ({
    label, icon, items, color, which,
  }: {
    label: string;
    icon: string;
    items: ImageItem[];
    color: string;
    which: 'day' | 'night';
  }) => {
    if (!items.length) return null;

    return (
      <div className="mt-8">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">{icon}</span>
            <h2 className={`font-semibold text-base ${color}`}>{label}</h2>
            <span className="text-slate-500 text-sm">({items.length})</span>
          </div>
          <button
            onClick={() => download(which)}
            disabled={downloading !== null}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-slate-300 hover:text-white text-xs font-semibold rounded-xl transition-all cursor-pointer disabled:opacity-50"
          >
            {downloading === which ? (
              <span className="w-3 h-3 border border-white/40 border-t-transparent rounded-full animate-spin inline-block" />
            ) : '↓'}
            {downloading === which ? 'Zipping…' : `Download ${label}`}
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {items.map((img) => {
            const i = images.indexOf(img);
            return <Card key={i} img={img} i={i} />;
          })}
        </div>
      </div>
    );
  };

  // ─── render ──────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white">
      <div className="max-w-6xl mx-auto px-8 py-10">

        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-slate-400 hover:text-sky-400 transition-colors mb-10 cursor-pointer"
        >
          &#8592; <span className="text-sm font-medium">Back to Home</span>
        </button>

        <div className="mb-8">
          <p className="text-xs font-semibold tracking-[0.3em] text-sky-400 uppercase mb-2">Gallery</p>
          <h1 className="text-5xl font-bold">Manage Pics</h1>
          <p className="text-slate-400 mt-3 text-base max-w-md">
            Upload your travel photos — classify them as day or night, then download each group as a zip.
          </p>
        </div>

        {/* Drop zone */}
        <div
          onDrop={handleDrop}
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          className={`border-2 border-dashed rounded-2xl p-14 text-center transition-all duration-200 ${
            dragOver ? 'border-sky-400 bg-sky-400/5' : 'border-white/10 hover:border-white/20 bg-white/2'
          }`}
        >
          <div className="text-5xl mb-4">🖼️</div>
          <p className="text-white font-semibold text-lg mb-1">Drop images here</p>
          <p className="text-slate-500 text-sm mb-5">PNG · JPG · JPEG</p>
          <label className="inline-block px-6 py-2.5 bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/30 hover:border-sky-400/60 text-sky-300 text-sm font-semibold rounded-xl transition-all cursor-pointer">
            Browse Files
            <input
              type="file" multiple accept=".png,.jpg,.jpeg" className="hidden"
              onChange={e => { if (e.target.files) addFiles(e.target.files); e.target.value = ''; }}
            />
          </label>
        </div>

        {/* Action row */}
        {images.length > 0 && (
          <div className="flex items-center justify-between mt-6 mb-2">
            <p className="text-slate-400 text-sm">
              {images.length} image{images.length !== 1 ? 's' : ''}
              {classified > 0 && <span className="text-sky-400 ml-2">· {classified} classified</span>}
            </p>
            <div className="flex gap-3">
              <button
                onClick={clear}
                className="px-4 py-2 border border-white/10 hover:border-white/20 text-slate-400 hover:text-white text-sm rounded-xl transition-all cursor-pointer"
              >
                Clear All
              </button>
              <button
                onClick={classify}
                disabled={classifying}
                className="px-6 py-2 bg-sky-500 hover:bg-sky-400 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-all cursor-pointer"
              >
                {classifying ? 'Classifying…' : 'Classify All'}
              </button>
              {hasGroups && (
                <button
                  onClick={() => download('all')}
                  disabled={downloading !== null}
                  className="flex items-center gap-1.5 px-5 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/30 hover:border-emerald-400/60 text-emerald-300 text-sm font-semibold rounded-xl transition-all cursor-pointer disabled:opacity-50"
                >
                  {downloading === 'all' ? (
                    <span className="w-3.5 h-3.5 border border-emerald-300/60 border-t-transparent rounded-full animate-spin inline-block" />
                  ) : '↓'}
                  {downloading === 'all' ? 'Zipping…' : 'Download All'}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Grouped sections — shown after classification */}
        {hasGroups ? (
          <>
            <Section label="Day Photos"   icon="☀"  items={dayImages}   color="text-amber-400" which="day"   />
            <Section label="Night Photos" icon="🌙" items={nightImages} color="text-sky-400"   which="night" />

            {/* Unclassified / errored */}
            {pending.length > 0 && (
              <div className="mt-8">
                <div className="flex items-center gap-2 mb-3">
                  <h2 className="font-semibold text-base text-slate-400">Unclassified</h2>
                  <span className="text-slate-500 text-sm">({pending.length})</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {pending.map(img => {
                    const i = images.indexOf(img);
                    return <Card key={i} img={img} i={i} />;
                  })}
                </div>
              </div>
            )}
          </>
        ) : (
          /* Flat grid — before first classification */
          images.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
              {images.map((img, i) => <Card key={i} img={img} i={i} />)}
            </div>
          )
        )}

      </div>
    </div>
  );
};
