"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "@/public/logo-escoffier.png";
import { Play } from "lucide-react";

interface CloudinaryResource {
  public_id: string;
  secure_url: string;
  format: string;
  created_at: string;
  width: number;
  height: number;
  resource_type: string;
  thumbnail_url?: string;
}

export default function GalleryPage() {
  const [videos, setVideos] = useState<CloudinaryResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const observerTarget = useRef<HTMLDivElement>(null);
  const [selectedMedia, setSelectedMedia] = useState<CloudinaryResource | null>(
    null
  );

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/videos");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      setVideos(data.videos || []);
      setNextCursor(data.nextCursor);
      setHasMore(data.hasMore || false);
    } catch (error) {
      console.error("Media loading error:", error);
      // Set empty array on error to show the "no videos" message
      setVideos([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreVideos = useCallback(async () => {
    if (!nextCursor || loadingMore) return;

    try {
      setLoadingMore(true);
      const response = await fetch(`/api/videos?cursor=${nextCursor}`);
      const data = await response.json();
      setVideos((prev) => [...prev, ...(data.videos || [])]);
      setNextCursor(data.nextCursor);
      setHasMore(data.hasMore || false);
    } catch (error) {
      console.error("Error loading more videos:", error);
    } finally {
      setLoadingMore(false);
    }
  }, [nextCursor, loadingMore]);

  // Infinite scroll observer
  useEffect(() => {
    if (!hasMore || loadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          loadMoreVideos();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, loadingMore, loadMoreVideos]);

  const openModal = (media: CloudinaryResource) => {
    setSelectedMedia(media);
  };

  const closeModal = () => {
    setSelectedMedia(null);
  };

  return (
    <div className="min-h-screen py-8 px-4 bg-container">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4">
            <Image src={logo} alt="Logo" width={100} height={100} />
          </Link>
          <h1 className="text-3xl text-primary font-bold mb-2">
            Galerie de l&apos;évènement
          </h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 justify-center mb-8">
          <Link
            href="/gallery/pictures"
            className="flex-1 max-w-xs text-center py-3 px-6 text-primary shadow-lg border-2 border-primary rounded-xl cursor-pointer font-semibold transition-all hover:bg-primary/80 hover:text-white"
          >
            📸 Photos
          </Link>
          <div className="flex-1 max-w-xs py-3 text-center px-6 bg-secondary text-white border-2 border-secondary shadow-lg rounded-xl cursor-pointer font-semibold transition-all">
            🎬 Vidéos ({videos.length})
          </div>
        </div>

        <p className="text-center text-sm text-gray-600 mb-10">
          Les vidéos peuvent mettre du temps à s&apos;afficher apres les avoir
          ajoutées. (1min maximum)
        </p>

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-gray-600">Chargement...</p>
          </div>
        )}

        {/* Videos grid */}
        {!loading && (
          <>
            {videos.length === 0 ? (
              <div className="text-center py-12 bg-white/60 backdrop-blur rounded-2xl border border-pink-100">
                <p className="text-gray-600 mb-4">
                  Aucune vidéo pour le moment
                </p>
                <Link
                  href="/upload"
                  className="inline-block bg-secondary text-white py-3 px-6 rounded-xl font-semibold"
                >
                  Ajouter des vidéos
                </Link>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {videos.map((video) => (
                    <button
                      key={video.public_id}
                      type="button"
                      onClick={() => openModal(video)}
                      className="aspect-square relative bg-white rounded-xl overflow-hidden shadow-lg cursor-pointer hover:scale-105 transition-transform"
                    >
                      {video.thumbnail_url ? (
                        <Image
                          src={video.thumbnail_url}
                          alt="Vidéo évènement"
                          width={400}
                          height={400}
                          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          unoptimized
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full bg-primary h-full object-cover flex items-end justify-center">
                          <p className="text-sm pb-5 text-white font-semibold">
                            Aperçu non disponible
                          </p>
                        </div>
                      )}
                      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/60 size-14 rounded-full flex items-center justify-center">
                        <Play className="text-secondary size-10" />
                      </div>
                    </button>
                  ))}
                </div>
                {/* Infinite scroll trigger */}
                {hasMore && (
                  <div ref={observerTarget} className="py-8 text-center">
                    {loadingMore && (
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    )}
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* Navigation */}
        <div className="mt-10 text-center space-y-4 border-t border-primary pt-5">
          <Link
            href="/upload"
            className="inline-block w-full bg-primary text-white py-4 px-8 rounded-2xl font-semibold text-lg transition-all shadow-lg hover:bg-primary-accessible"
          >
            Ajoutez des médias
          </Link>
        </div>
      </div>
      {selectedMedia && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div className="relative max-w-6xl flex items-center justify-center h-full w-full max-h-[70vh]">
            <button
              onClick={closeModal}
              className="absolute -top-18 right-3 text-white text-4xl font-bold hover:text-gray-300"
            >
              ×
            </button>
            <video
              src={selectedMedia.secure_url}
              controls
              className="w-full max-h-[70vh]"
              preload="metadata"
            >
              Votre navigateur ne supporte pas la lecture de vidéos.
            </video>
          </div>
        </div>
      )}
    </div>
  );
}
