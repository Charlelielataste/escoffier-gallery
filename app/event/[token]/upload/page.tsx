"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import logo from "@/public/logo-10-escoffier.png";
import Script from "next/script";

// Upload limits
const LIMITS = {
  photos: {
    maxFiles: 20,
    maxTotalSize: 100 * 1024 * 1024, // 100 MB total
  },
  videos: {
    maxFiles: 5,
    maxTotalSize: 100 * 1024 * 1024, // 100 MB total (Cloudinary plan limit)
  },
};

interface CloudinaryUploadResult {
  event: string;
  info: {
    secure_url: string;
    public_id: string;
    bytes?: number;
    [key: string]: unknown;
  };
}

declare global {
  interface Window {
    cloudinary: {
      createUploadWidget: (
        options: Record<string, unknown>,
        callback: (error: Error | null, result: CloudinaryUploadResult) => void,
      ) => {
        open: () => void;
        close: () => void;
      };
    };
  }
}

export default function UploadPage() {
  const { token } = useParams<{ token: string }>();
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadType, setUploadType] = useState<"image" | "video">("image");
  const [cloudinaryLoaded, setCloudinaryLoaded] = useState(() => {
    // Check if Cloudinary is already loaded (from cache)
    return typeof window !== "undefined" && !!window.cloudinary;
  });

  const handleUploadSuccess = () => {
    setUploadSuccess(true);
    setUploadError("");

    setTimeout(() => {
      setUploadSuccess(false);
    }, 10000); // 10 secondes (doublé)
  };

  const handleUploadError = (error: Error) => {
    console.error("Upload error:", error);
    setUploadError("Erreur lors de l'upload. Veuillez réessayer.");

    // Auto-hide après 10 secondes
    setTimeout(() => {
      setUploadError("");
    }, 10000);
  };

  const openCloudinaryWidget = () => {
    // Check if Cloudinary is available
    if (typeof window === "undefined" || !window.cloudinary) {
      setUploadError(
        "Le widget Cloudinary n'est pas chargé. Veuillez rafraîchir la page.",
      );
      return;
    }

    // Update loaded state if needed
    if (!cloudinaryLoaded) {
      setCloudinaryLoaded(true);
    }

    setUploadError("");
    setUploadSuccess(false);

    const isVideo = uploadType === "video";
    const limits = isVideo ? LIMITS.videos : LIMITS.photos;
    let totalUploadedSize = 0;

    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        uploadSignature: async (
          callback: (signature: string) => void,
          paramsToSign: Record<string, unknown>,
        ) => {
          try {
            const response = await fetch("/api/cloudinary-signature", {
              method: "POST",
              body: JSON.stringify({ paramsToSign }),
              headers: {
                "Content-Type": "application/json",
                "x-event-token": token,
              },
            });
            const data = await response.json();
            callback(data.signature);
          } catch (error) {
            console.error("Signature error:", error);
          }
        },
        apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,

        resourceType: isVideo ? "video" : "image",
        multiple: true,
        maxFiles: limits.maxFiles,
        maxFileSize: limits.maxTotalSize, // Total size limit

        // Chunked upload for videos
        chunkedUpload: isVideo,
        maxChunkSize: isVideo ? 6000000 : undefined, // 6MB chunks

        clientAllowedFormats: isVideo
          ? ["mp4", "mov", "avi", "webm", "mkv"]
          : ["jpg", "jpeg", "png", "gif", "webp"],

        folder: process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER || "escoffier-event",
        useFilenameAsDisplayName: true,
        uniqueFilename: true,

        sources: ["local", "camera"],
        cropping: false,
        showSkipCropButton: true,

        language: "fr",
        showPoweredBy: false,

        styles: {
          palette: {
            window: "#FFFFFF",
            windowBorder: "#B0675C",
            tabIcon: "#B0675C",
            menuIcons: "#8ccab2",
            textDark: "#171717",
            textLight: "#FFFFFF",
            link: "#B0675C",
            action: "#B0675C",
            inactiveTabIcon: "#ccb782",
            error: "#E53E3E",
            inProgress: "#8ccab2",
            complete: "#38A169",
            sourceBg: "#F3F4F6",
          },
          fonts: {
            default: null,
            "'Museo Sans', sans-serif": {
              url: null,
              active: true,
            },
          },
        },

        text: {
          fr: {
            or: "ou",
            back: "Retour",
            advanced: "Avancé",
            close: "Fermer",
            no_results: "Aucun résultat",
            search_placeholder: "Rechercher...",
            about_uw: "À propos du widget",
            menu: {
              files: "Mes fichiers",
              camera: "Caméra",
            },
            local: {
              browse: "Parcourir",
              dd_title_single: "Glissez-déposez votre fichier ici",
              dd_title_multi: "Glissez-déposez vos fichiers ici",
              drop_title_single: "Déposez le fichier pour l'uploader",
              drop_title_multiple: "Déposez les fichiers pour les uploader",
            },
            camera: {
              capture: "Capturer",
              cancel: "Annuler",
              take_pic: "Prendre une photo",
              explanation:
                "Assurez-vous que votre caméra est connectée et que votre navigateur autorise la capture.",
            },
            queue: {
              title: "File d'attente",
              title_uploading_with_counter: "Upload de {{num}} fichiers",
              title_processing_with_counter: "Traitement de {{num}} fichiers",
              mini_title: "Uploadés",
              mini_title_uploading: "Upload en cours",
              mini_title_processing: "Traitement en cours",
              show_completed: "Afficher terminés",
              retry_failed: "Réessayer échoués",
              abort_all: "Tout annuler",
              upload_more: "Uploader plus",
              done: "Terminé",
              mini_upload_count: "{{num}} uploadés",
              mini_failed: "{{num}} échoués",
              statuses: {
                uploading: "Upload...",
                processing: "Traitement...",
                uploaded: "Uploadé",
                error: "Erreur",
              },
            },
          },
        },
      },
      (error: Error | null, result: CloudinaryUploadResult) => {
        if (error) {
          handleUploadError(error);
          return;
        }

        if (result && result.event === "success") {
          if (result.info.bytes) {
            totalUploadedSize += result.info.bytes;

            if (totalUploadedSize > limits.maxTotalSize) {
              const limitSize = isVideo ? "1 GB" : "100 MB";
              setUploadError(
                `Limite dépassée ! Maximum ${limitSize} au total.`,
              );
              widget.close();
              return;
            }
          }

          handleUploadSuccess();

          // Invalidate cache so new uploads appear immediately in gallery
          fetch("/api/revalidate", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-event-token": token,
            },
            body: JSON.stringify({ type: uploadType }),
          }).catch(() => {});
        }

        if (result && result.event === "close") {
          totalUploadedSize = 0;
        }
      },
    );

    widget.open();
  };

  return (
    <>
      <Script
        src="https://upload-widget.cloudinary.com/global/all.js"
        strategy="lazyOnload"
        onLoad={() => setCloudinaryLoaded(true)}
      />

      <div className="min-h-screen flex flex-col items-center justify-center py-10 bg-container">
        {/* Toast de succès fixé en haut */}
        {uploadSuccess && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-5 fade-in duration-300">
            <div className="bg-green-500 text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 min-w-[300px] max-w-md">
              <span className="text-2xl">✅</span>
              <p className="font-semibold">
                Upload réussi ! Vos fichiers sont en ligne.
              </p>
            </div>
          </div>
        )}

        {/* Toast d'erreur fixé en haut */}
        {uploadError && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-5 fade-in duration-300">
            <div className="bg-red-500 text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 min-w-[300px] max-w-md">
              <span className="text-2xl">❌</span>
              <p className="font-semibold">{uploadError}</p>
            </div>
          </div>
        )}

        <div className="text-center max-w-xl mx-auto px-4 w-full">
          <div className="mb-8">
            <Link href={`/event/${token}`} className="inline-block mb-4">
              <Image
                src={logo}
                alt="Logo"
                width={100}
                height={100}
                priority
                style={{ width: "auto", height: "auto" }}
              />
            </Link>
            <h1 className="text-2xl text-primary font-bold mb-2">
              Ajoutez vos Photos & Vidéos
            </h1>
          </div>

          {/* Type selection */}
          <div className="bg-white/60 backdrop-blur rounded-2xl border border-pink-100 p-6 mb-6">
            <h2 className="text-lg font-semibold text-primary mb-4">
              Type de médias
            </h2>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setUploadType("image")}
                className={`flex-1 py-3 px-6 rounded-xl cursor-pointer font-semibold transition-all ${
                  uploadType === "image"
                    ? "bg-primary text-white border-2 border-primary shadow-lg"
                    : "bg-white text-primary border-2 border-primary"
                }`}
              >
                📸 Photos
              </button>
              <button
                onClick={() => setUploadType("video")}
                className={`flex-1 py-3 px-6 rounded-xl cursor-pointer font-semibold transition-all ${
                  uploadType === "video"
                    ? "bg-secondary text-white border-2 border-secondary shadow-lg"
                    : "bg-white text-secondary border-2 border-secondary"
                }`}
              >
                🎬 Vidéos
              </button>
            </div>
          </div>

          {/* Upload zone */}
          <div className="bg-white/60 backdrop-blur rounded-2xl border border-pink-100 p-6 mb-6">
            <div className="mb-4">
              <button
                onClick={openCloudinaryWidget}
                disabled={!cloudinaryLoaded}
                className={`block w-full cursor-pointer bg-white border-2 border-dashed border-primary rounded-xl p-8 transition-all ${
                  cloudinaryLoaded ? "hover:bg-primary/5" : "opacity-50"
                }`}
              >
                <div className="text-center">
                  <span className="text-4xl mb-2 block">
                    {uploadType === "image" ? "📸" : "🎬"}
                  </span>
                  <p className="text-primary font-semibold mb-1">
                    {cloudinaryLoaded
                      ? "Cliquez pour sélectionner"
                      : "Chargement..."}
                  </p>
                  <p className="text-sm text-gray-500">
                    {uploadType === "image"
                      ? "JPG, PNG, GIF - Max 20 fichiers / 100 MB total"
                      : "MP4, MOV, AVI, WebM - Max 5 fichiers / 100 MB par fichier"}
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Info and navigation */}
          <div className="space-y-4">
            <div className="bg-white/60 backdrop-blur rounded-2xl border border-pink-100 p-4">
              <p className="text-sm text-gray-600">
                💡 <strong>Astuce :</strong> Envoyez en plusieurs fois si vous
                rencontrez des problèmes, ne quittez pas la page avant que tous
                les fichiers soient uploadés.
              </p>
            </div>

            <Link
              href={`/event/${token}/gallery/pictures`}
              className="block bg-secondary text-white py-4 px-8 rounded-2xl font-semibold text-lg transition-all shadow-lg hover:bg-secondary-accessible"
            >
              Voir la Galerie
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
