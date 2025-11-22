"use client";

import { useState, useEffect } from "react";
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
}

export default function GalleryPage() {
  const [images, setImages] = useState<CloudinaryResource[]>([]);
  const [videos, setVideos] = useState<CloudinaryResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"images" | "videos">("images");
  const [selectedMedia, setSelectedMedia] = useState<CloudinaryResource | null>(
    null
  );

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      const response = await fetch("/api/media");
      const data = await response.json();
      setImages(data.images || []);
      setVideos(data.videos || []);
    } catch (error) {
      console.error("Media loading error:", error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (media: CloudinaryResource) => {
    setSelectedMedia(media);
  };

  const closeModal = () => {
    setSelectedMedia(null);
  };

  return (
    <div className="min-h-screen py-8 px-4 bg-container">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4">
            <Image src={logo} alt="Logo" width={100} height={100} />
          </Link>
          <h1 className="text-3xl text-primary font-bold mb-2">
            Galerie de l&apos;événement
          </h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 justify-center mb-8">
          <button
            onClick={() => setActiveTab("images")}
            className={`flex-1 max-w-xs py-3 px-6 rounded-xl cursor-pointer font-semibold transition-all ${
              activeTab === "images"
                ? "bg-primary text-white shadow-lg border-2 border-primary"
                : "bg-white text-primary border-2 border-primary"
            }`}
          >
            📸 Photos ({images.length})
          </button>
          <button
            onClick={() => setActiveTab("videos")}
            className={`flex-1 max-w-xs py-3 px-6 rounded-xl cursor-pointer font-semibold transition-all ${
              activeTab === "videos"
                ? "bg-secondary text-white border-2 border-secondary shadow-lg"
                : "bg-white text-secondary border-2 border-secondary"
            }`}
          >
            🎬 Vidéos ({videos.length})
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-gray-600">Chargement...</p>
          </div>
        )}

        {/* Images grid */}
        {!loading && activeTab === "images" && (
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
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((image) => (
                  <div
                    key={image.public_id}
                    className="aspect-square bg-white rounded-xl overflow-hidden shadow-lg cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => openModal(image)}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={image.secure_url}
                      alt="Photo événement"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Videos grid */}
        {!loading && activeTab === "videos" && (
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {videos.map((video) => (
                  <div
                    key={video.public_id}
                    className="bg-white rounded-xl overflow-hidden shadow-lg"
                  >
                    <video
                      src={video.secure_url}
                      controls
                      className="w-full"
                      preload="metadata"
                    >
                      Votre navigateur ne supporte pas la lecture de vidéos.
                    </video>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Navigation */}
        <div className="mt-8 text-center space-y-4 border-t border-primary pt-5">
          <Link
            href="/upload"
            className="inline-block w-full bg-primary text-white py-4 px-8 rounded-2xl font-semibold text-lg transition-all shadow-lg hover:bg-primary-accessible"
          >
            Ajouter des médias
          </Link>
        </div>
      </div>

      {/* Modal for fullscreen images */}
      {selectedMedia && selectedMedia.resource_type === "image" && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div className="relative max-w-6xl max-h-[90vh]">
            <button
              onClick={closeModal}
              className="absolute -top-12 right-0 text-white text-4xl font-bold hover:text-gray-300"
            >
              ×
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selectedMedia.secure_url}
              alt="Photo en grand"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}
