import { useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import promoVideo from "/HNP_video_COMPRESSED.mp4";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <SiteLayout>
      <div className="max-w-2xl mx-auto">
        <VideoBlock />
      </div>
    </SiteLayout>
  );
}

export function VideoBlock() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showOrderNow, setShowOrderNow] = useState(false);
  const [progress, setProgress] = useState(0);

  const retryVideo = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!videoRef.current) return;

    videoRef.current.currentTime = 0;
    setShowOrderNow(false);

    videoRef.current
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => {
        // ignore autoplay / interaction errors
      });
  };

  const togglePlay = () => {
    if (!videoRef.current) return;

    if (videoRef.current.ended || showOrderNow) {
      retryVideo();
      return;
    }

    if (videoRef.current.paused) {
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          // ignore autoplay / interaction errors
        });
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!videoRef.current) return;

    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  return (
    <div className="rounded-3xl bg-black/90 p-4 sm:p-6 shadow-2xl ring-1 ring-white/10">
      {/* Keep mobile (9:16) but allow more width on larger screens */}
      <div className="mx-auto w-full max-w-[520px]">
        <div className="relative aspect-[9/16] max-h-[75vh] mx-auto bg-black rounded-2xl overflow-hidden border border-white/10">
          {/* VIDEO */}
          <video
            ref={videoRef}
            src={promoVideo}
            className="absolute inset-0 w-full h-full object-contain bg-black"
            muted={isMuted}
            playsInline
            onClick={togglePlay}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onLoadedMetadata={() => setProgress(0)}
            onTimeUpdate={() => {
              const videoEl = videoRef.current;
              if (!videoEl || !videoEl.duration) return;
              setProgress(videoEl.currentTime / videoEl.duration);
            }}
            onEnded={() => {
              setIsPlaying(false);
              setShowOrderNow(true);
              setProgress(1);
            }}
          />

          {/* SOFT OVERLAY (TikTok-style) */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/40 via-transparent to-black/70" />

          {/* PLAY BUTTON (center) */}
          {!isPlaying && !showOrderNow && (
            <button
              type="button"
              onClick={togglePlay}
              className="absolute inset-0 flex items-center justify-center bg-black/25"
              aria-label="Play video"
            >
              <span className="h-20 w-20 rounded-full bg-[color:var(--neon-green)] flex items-center justify-center shadow-2xl">
                <Play className="h-10 w-10 text-black fill-black ml-1" />
              </span>
            </button>
          )}

          {/* ORDER NOW (shows when video ends) */}
          {showOrderNow && (
            <div className="absolute inset-0 flex items-end justify-center pb-10 bg-black/45">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="px-5 py-3 rounded-full bg-white/15 text-white text-sm font-extrabold uppercase tracking-widest shadow-2xl ring-1 ring-white/20 backdrop-blur"
                  onClick={retryVideo}
                >
                  Retry
                </button>
                <Link
                  to="/products"
                  className="px-7 py-3 rounded-full bg-white text-black text-sm font-extrabold uppercase tracking-widest shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  Order Now
                </Link>
              </div>
            </div>
          )}

          {/* MUTE BUTTON (top-right like TikTok) */}
          <button
            type="button"
            onClick={toggleMute}
            className="absolute top-3 right-3 h-10 w-10 rounded-full bg-black/60 flex items-center justify-center backdrop-blur"
            aria-label={isMuted ? "Unmute video" : "Mute video"}
          >
            {isMuted ? (
              <VolumeX className="text-white w-5 h-5" />
            ) : (
              <Volume2 className="text-white w-5 h-5" />
            )}
          </button>

          {/* RETRY (when paused mid-video) */}
          {!isPlaying && !showOrderNow && progress > 0.02 && progress < 0.999 && (
            <button
              type="button"
              onClick={retryVideo}
              className="absolute bottom-12 right-3 h-10 px-3 rounded-full bg-black/60 text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2 backdrop-blur"
              aria-label="Retry video"
            >
              <RotateCcw className="h-4 w-4" />
              Retry
            </button>
          )}

          {/* LABEL */}
          <div className="absolute bottom-4 left-4 text-white text-xs font-bold uppercase tracking-widest drop-shadow-lg">
            MININOTE Promo
          </div>

          {/* PROGRESS (bottom) */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
            <div
              className="h-full bg-[color:var(--neon-green)] transition-[width] duration-100"
              style={{ width: `${Math.min(100, Math.max(0, progress * 100))}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
