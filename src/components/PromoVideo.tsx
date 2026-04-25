import { useRef, useState } from "react";
import { Play } from "lucide-react";

export function PromoVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const handlePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    v.play();
    setPlaying(true);
  };

  return (
    <div className="relative mx-auto w-full max-w-2xl overflow-hidden rounded-2xl border-4 border-ink-black bg-ink-black shadow-[0_8px_0_0_var(--ink-black)]">
      <video
        ref={videoRef}
        src="/HNP_video_COMPRESSED.mp4"
        className="block aspect-video w-full bg-ink-black"
        controls={playing}
        playsInline
        preload="metadata"
        onClick={handlePlay}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
      />
      {!playing && (
        <button
          type="button"
          onClick={handlePlay}
          aria-label="Play MININOTE promo video"
          className="absolute inset-0 flex items-center justify-center bg-ink-black/30 transition hover:bg-ink-black/10"
        >
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-neon-pink text-ink-black shadow-[0_4px_0_0_var(--ink-black)] transition-transform group-hover:scale-110">
            <Play className="ml-1 h-9 w-9 fill-current" />
          </span>
        </button>
      )}
    </div>
  );
}
