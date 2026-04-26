import promoVideo from "/HNP_video_COMPRESSED.mp4";
import { Link } from "@tanstack/react-router";
import { Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";

export function VideoBlock() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { t } = useTranslation();

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showOrderNow, setShowOrderNow] = useState(false);
  const [progress, setProgress] = useState(0);

  const retryVideo = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!videoRef.current) return;

    videoRef.current.currentTime = 0;
    setShowOrderNow(false);

    videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
  };

  const togglePlay = () => {
    if (!videoRef.current) return;

    if (videoRef.current.ended || showOrderNow) {
      retryVideo();
      return;
    }

    if (videoRef.current.paused) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;

    const newMuted = !videoRef.current.muted;
    videoRef.current.muted = newMuted;
    setIsMuted(newMuted);
  };

  return (
    <section className="w-full flex justify-center items-center min-h-[70vh] px-3 py-4">
      
      {/* Responsive container */}
      <div className="w-full max-w-md sm:max-w-2xl lg:max-w-4xl mx-auto flex justify-center rounded-none sm:rounded-3xl bg-transparent sm:bg-black/90 p-0 sm:p-8 lg:p-10 shadow-none sm:shadow-2xl ring-0 sm:ring-1 sm:ring-white/10">

        {/* Video wrapper (keeps correct ratio) */}
        <div className="relative aspect-[9/16] w-full max-h-[90vh] mx-auto rounded-none sm:rounded-2xl overflow-hidden bg-black">

          {/* VIDEO (FIXED: no crop) */}
          <video
            ref={videoRef}
            src={promoVideo}
            className="absolute inset-0 w-full h-full object-contain"
            muted={isMuted}
            playsInline
            onClick={togglePlay}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onTimeUpdate={() => {
              const v = videoRef.current;
              if (!v || !v.duration) return;
              setProgress(v.currentTime / v.duration);
            }}
            onEnded={() => {
              setIsPlaying(false);
              setShowOrderNow(true);
              setProgress(1);
            }}
          />

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60 pointer-events-none" />

          {/* Play button */}
          {!isPlaying && !showOrderNow && (
            <button
              type="button"
              onClick={togglePlay}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="h-16 w-16 rounded-full bg-[var(--neon-green)] flex items-center justify-center shadow-xl active:scale-90 transition">
                <Play className="w-8 h-8 text-black fill-black ml-1" />
              </div>
            </button>
          )}

          {/* CTA */}
          {showOrderNow && (
            <div className="absolute inset-0 flex flex-col items-center justify-end pb-6 gap-3 bg-black/40">
              <Link
                to="/products"
                className="w-[80%] text-center py-3 rounded-full bg-[var(--neon-green)] text-black text-base font-extrabold uppercase tracking-widest shadow-xl active:scale-95 transition"
                onClick={(e) => e.stopPropagation()}
              >
                {t("common.orderNow", { defaultValue: "Order Now" })}

              </Link>

              <button
                type="button"
                onClick={retryVideo}
                className="text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2 opacity-80 active:scale-95 transition"
              >
                <RotateCcw className="w-4 h-4" />
                                  {t("common.replay", { defaultValue: "Replay" })}

              </button>
            </div>
          )}

          {/* Mute button */}
          <button
            type="button"
            onClick={toggleMute}
            className="absolute top-3 right-3 h-9 w-9 rounded-full bg-black/50 flex items-center justify-center"
          >
            {isMuted ? (
              <VolumeX className="text-white w-4 h-4" />
            ) : (
              <Volume2 className="text-white w-4 h-4" />
            )}
          </button>

          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
            <div
              className="h-full bg-[var(--neon-green)]"
              style={{
                width: `${Math.min(100, Math.max(0, progress * 100))}%`,
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
