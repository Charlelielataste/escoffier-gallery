"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "@/public/logo-escoffier.png";

interface CloudinaryResource {
  public_id: string;
  secure_url: string;
  format: string;
  created_at: string;
  width: number;
  height: number;
  resource_type: string;
  thumbnail_url?: string;
  full_url?: string; // High quality for modal
}

export default function GalleryPage() {
  const [images, setImages] = useState<CloudinaryResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [selectedMedia, setSelectedMedia] = useState<CloudinaryResource | null>(
    null
  );
  const [imageLoading, setImageLoading] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/images");
      const data = await response.json();
      setImages(data.images || []);
      setNextCursor(data.nextCursor);
      setHasMore(data.hasMore || false);
    } catch (error) {
      console.error("Media loading error:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreImages = useCallback(async () => {
    if (!nextCursor || loadingMore) return;

    try {
      setLoadingMore(true);
      const response = await fetch(`/api/images?cursor=${nextCursor}`);
      const data = await response.json();
      setImages((prev) => [...prev, ...(data.images || [])]);
      setNextCursor(data.nextCursor);
      setHasMore(data.hasMore || false);
    } catch (error) {
      console.error("Error loading more images:", error);
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
          loadMoreImages();
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
  }, [hasMore, loadingMore, loadMoreImages]);

  const openModal = (media: CloudinaryResource) => {
    setSelectedMedia(media);
    setImageLoading(true);
  };

  const closeModal = () => {
    setSelectedMedia(null);
    setImageLoading(false);
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
            className="flex-1 max-w-xs text-center py-3 px-6 bg-primary text-white shadow-lg border-2 border-primary rounded-xl cursor-pointer font-semibold transition-all"
          >
            📸 Photos ({images.length})
          </Link>
          <Link
            href="/gallery/videos"
            className="flex-1 max-w-xs py-3 text-center px-6 text-secondary border-2 border-secondary shadow-lg rounded-xl cursor-pointer font-semibold transition-all hover:bg-secondary/80 hover:text-white"
          >
            🎬 Vidéos
          </Link>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-gray-600">Chargement...</p>
          </div>
        )}

        {/* Images grid */}
        {!loading && (
          <>
            {images.length === 0 ? (
              <div className="text-center py-12 bg-white/60 backdrop-blur rounded-2xl border border-pink-100">
                <p className="text-gray-600 mb-4">
                  Aucune photo pour le moment
                </p>
                <Link
                  href="/upload"
                  className="inline-block bg-primary text-white py-3 px-6 rounded-xl font-semibold"
                >
                  Ajouter des photos
                </Link>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {images.map((image) => (
                    <button
                      key={image.public_id}
                      className="aspect-square bg-white rounded-xl overflow-hidden shadow-lg cursor-pointer hover:scale-105 transition-transform"
                      type="button"
                      onClick={() => openModal(image)}
                    >
                      <Image
                        src={image.secure_url}
                        alt="Photo évènement"
                        width={400}
                        height={400}
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        unoptimized
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
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

      {/* Modal for fullscreen images */}
      {selectedMedia && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div className="relative max-w-6xl h-full w-full max-h-[70vh]">
            <button
              onClick={closeModal}
              className="absolute -top-12 right-2 text-white text-4xl font-bold hover:text-gray-300 z-10"
            >
              ×
            </button>

            {/* Loading spinner */}
            {imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-white"></div>
              </div>
            )}

            <Image
              src={selectedMedia.full_url || selectedMedia.secure_url}
              alt="Photo en grand"
              fill
              unoptimized
              className={`max-w-full object-contain rounded-lg transition-opacity duration-300 ${
                imageLoading ? "opacity-0" : "opacity-100"
              }`}
              loading="eager"
              quality={90}
              onLoad={() => setImageLoading(false)}
              onError={() => setImageLoading(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
