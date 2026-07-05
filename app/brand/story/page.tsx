// app/brand/story/page.tsx
"use client";

import { useState, useEffect, useRef, useCallback, memo } from "react";
import Image from "next/image";
import { Play, X, Compass, Loader2 } from "lucide-react";

interface TravelShort {
  id: string;
  videoId: string;
  thumbnail: string;
  title: string;
  channelTitle: string;
}

// // Memoized Single Video Card to prevent rendering degradation with thousands of items
const VideoCard = memo(({ 
  video, 
  index, 
  onClick 
}: { 
  video: TravelShort; 
  index: number; 
  onClick: (videoId: string) => void;
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div
      onClick={() => onClick(video.videoId)}
      className="group relative overflow-hidden rounded-2xl border border-black/5 bg-[#FFFFFF] cursor-pointer shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-lg hover:border-black/10 w-full"
      style={{ backfaceVisibility: "hidden" }}
    >
      {/* Aspect Ratio Container */}
      <div className="relative w-full aspect-[9/16] overflow-hidden bg-[#FFFFFF]">
        {/* Placeholder Skeleton */}
        {!imageLoaded && (
          <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-[#FFFFFF] via-[#E5E2DA] to-[#FFFFFF]" />
        )}
        
        <Image
          src={video.thumbnail}
          alt={video.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 250px"
          className={`object-cover transition-all duration-700 ease-out group-hover:scale-105 ${
            imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
          onLoad={() => setImageLoaded(true)}
          priority={index < 8} // Prioritize first row of images
        />

        {/* Ambient Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-80" />

        {/* Play Icon and Overlay Elements */}
        <div className="absolute inset-0 flex flex-col justify-between p-4 z-10">
          {/* Top Info (Creator Badge) */}
          <div className="self-end translate-y-[-10px] opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <span className="backdrop-blur-md bg-black/40 text-[#FFFFFF] text-[10px] font-semibold tracking-wider px-2.5 py-1 rounded-full uppercase">
              {video.channelTitle}
            </span>
          </div>

          {/* Center Play Button */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-75 opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FFFFFF] text-black shadow-xl transition-transform duration-300 hover:scale-110">
              <Play size={20} fill="currentColor" className="ml-1" />
            </div>
          </div>

          {/* Bottom Info (Title) */}
          <div className="w-full">
            <p className="font-sans text-xs font-semibold leading-relaxed text-[#FFFFFF] tracking-wide line-clamp-2 drop-shadow-md group-hover:text-[#FFFFFF]">
              {video.title}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});

VideoCard.displayName = "VideoCard";

export default function BrandStoryPage() {
  const [videos, setVideos] = useState<TravelShort[]>([]);
  const [pageToken, setPageToken] = useState<string | null>("1");
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const isFetchingRef = useRef(false);

  // Fetch travel shorts from endpoint
  const fetchShorts = useCallback(async (token: string) => {
    if (isFetchingRef.current || !token) return;
    isFetchingRef.current = true;
    setIsLoading(true);

    try {
      const response = await fetch(`/api/travel-shorts?pageToken=${token}`);
      if (!response.ok) throw new Error("Failed to fetch travel shorts");
      
      const data = await response.json();
      setVideos((prev) => {
        const existingIds = new Set(prev.map(v => v.id));
        const newVideos = data.videos.filter((v: TravelShort) => !existingIds.has(v.id));
        return [...prev, ...newVideos];
      });
      setPageToken(data.nextPageToken);
      setIsInitialLoad(false);
    } catch (error) {
      console.error("Error loading travel shorts:", error);
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchShorts("1");
  }, []);

  // Infinite Scroll Trigger
  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const target = entries[0];
    if (target.isIntersecting && pageToken && !isLoading) {
      fetchShorts(pageToken);
    }
  }, [pageToken, isLoading, fetchShorts]);

  useEffect(() => {
    if (isLoading || isInitialLoad) return;

    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "300px", // Trigger loading slightly before reaching the bottom
      threshold: 0.1
    });

    if (sentinelRef.current) {
      observerRef.current.observe(sentinelRef.current);
    }

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [handleObserver, isLoading, isInitialLoad]);

  // Video playback interaction handlers
  const openVideoModal = useCallback((videoId: string) => {
    setActiveVideoId(videoId);
    document.body.style.overflow = "hidden"; // Prevent background scroll
  }, []);

  const closeVideoModal = useCallback(() => {
    setActiveVideoId(null);
    document.body.style.overflow = ""; // Re-enable background scroll
  }, []);

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeVideoModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeVideoModal]);

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#1E1E1E]">
      {/* Hero Banner Section */}
      <section 
        className="min-h-[140px] sm:min-h-[250px] md:min-h-[400px] lg:min-h-[450px]"
        style={{ 
          position: "relative",
          width: "100%",
          aspectRatio: "2000/693",
          overflow: "hidden",
          marginBottom: "3rem"
        }}
      >
        <Image
          src="/Shorts Banner.jpg"
          alt="Shorts Banner"
          fill
          priority
          sizes="100vw"
          style={{
            objectFit: "cover",
            objectPosition: "center"
          }}
        />
      </section>

      {/* Travel Shorts Wall */}
      <main className="w-full mx-auto" style={{ paddingLeft: "10%", paddingRight: "10%", paddingBottom: "4rem" }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {videos.map((video, idx) => (
            <VideoCard
              key={video.id}
              video={video}
              index={idx}
              onClick={openVideoModal}
            />
          ))}
        </div>

        {/* Loading Sentinel & Skeletons */}
        <div ref={sentinelRef} className="w-full flex flex-col items-center justify-center py-16 gap-3">
          {isLoading && (
            <>
              <Loader2 className="animate-spin text-[#1E1E1E] mb-2" size={32} />
              <span className="font-sans text-xs font-semibold text-black/40 tracking-wider uppercase">
                Loading more stories...
              </span>
            </>
          )}
        </div>
      </main>

      {/* Fullscreen Video Modal */}
      {activeVideoId && (
        <div 
          className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 sm:p-6 transition-all duration-300"
          onClick={closeVideoModal}
        >
          {/* Close Button */}
          <button 
            onClick={closeVideoModal}
            className="absolute top-6 right-6 z-[2010] flex h-12 w-12 items-center justify-center rounded-full bg-[#FFFFFF]/10 text-[#FFFFFF] hover:bg-[#FFFFFF]/20 hover:scale-105 transition-all duration-200"
          >
            <X size={24} />
          </button>

          {/* Modal Content - Vertical 9:16 Video Box */}
          <div 
            className="relative w-full max-w-[450px] aspect-[9/16] bg-black shadow-2xl overflow-hidden rounded-2xl border border-white/10"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking player itself
          >
            <iframe
              src={`https://www.youtube.com/embed/${activeVideoId}?autoplay=1&modestbranding=1&rel=0&showinfo=0`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
        </div>
      )}
    </div>
  );
}
