"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "@/public/logo-escoffier.png";

export default function UploadPage() {
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [uploadType, setUploadType] = useState<"image" | "video">("image");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(e.target.files);
    setUploadSuccess(false);
    setUploadError("");
  };

  const handleUpload = async () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      setUploadError("Veuillez sélectionner au moins un fichier");
      return;
    }

    setUploading(true);
    setUploadError("");
    setUploadSuccess(false);

    try {
      // Upload each file individually to avoid Vercel limits
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", uploadType);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Erreur lors de l'upload de ${file.name}`);
        }
      }

      setUploadSuccess(true);
      setSelectedFiles(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Upload error:", error);
      setUploadError(
        "Erreur lors de l'upload. Vérifiez la taille de vos fichiers."
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-10 bg-container">
      <div className="text-center max-w-2xl mx-auto px-4 w-full">
        <div className="mb-8">
          <Link href="/" className="inline-block mb-4">
            <Image src={logo} alt="Logo" width={100} height={100} />
          </Link>
          <h1 className="text-2xl text-primary font-bold mb-2">
            Ajouter vos Photos & Vidéos
          </h1>
        </div>

        {/* Type selection */}
        <div className="bg-white/60 backdrop-blur rounded-2xl border border-pink-100 p-6 mb-6">
          <h2 className="text-lg font-semibold text-primary mb-4">
            Type de média
          </h2>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => setUploadType("image")}
              className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
                uploadType === "image"
                  ? "bg-primary text-white shadow-lg"
                  : "bg-white text-primary border-2 border-primary"
              }`}
            >
              📸 Photos
            </button>
            <button
              onClick={() => setUploadType("video")}
              className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
                uploadType === "video"
                  ? "bg-secondary text-white shadow-lg"
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
            <label
              htmlFor="file-upload"
              className="block cursor-pointer bg-white border-2 border-dashed border-primary rounded-xl p-8 hover:bg-primary/5 transition-all"
            >
              <div className="text-center">
                <span className="text-4xl mb-2 block">
                  {uploadType === "image" ? "📸" : "🎬"}
                </span>
                <p className="text-primary font-semibold mb-1">
                  Cliquez pour sélectionner
                </p>
                <p className="text-sm text-gray-500">
                  {uploadType === "image"
                    ? "JPG, PNG (max 4MB par fichier)"
                    : "MP4, MOV (max 4MB par fichier)"}
                </p>
              </div>
              <input
                id="file-upload"
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept={uploadType === "image" ? "image/*" : "video/*"}
                multiple
                onChange={handleFileSelect}
              />
            </label>
          </div>

          {selectedFiles && selectedFiles.length > 0 && (
            <div className="mb-4 p-3 bg-white rounded-xl">
              <p className="text-sm text-gray-700">
                {selectedFiles.length} fichier(s) sélectionné(s)
              </p>
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={uploading || !selectedFiles}
            className={`w-full py-4 px-8 rounded-2xl font-semibold text-lg transition-all shadow-lg ${
              uploading || !selectedFiles
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : uploadType === "image"
                ? "bg-primary text-white hover:bg-primary-accessible"
                : "bg-secondary text-white hover:bg-secondary-accessible"
            }`}
          >
            {uploading ? "⏳ Upload en cours..." : "Envoyer"}
          </button>

          {uploadSuccess && (
            <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-xl">
              ✅ Upload réussi ! Vos fichiers sont en ligne.
            </div>
          )}

          {uploadError && (
            <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-xl">
              ❌ {uploadError}
            </div>
          )}
        </div>

        {/* Info and navigation */}
        <div className="space-y-4">
          <div className="bg-white/60 backdrop-blur rounded-2xl border border-pink-100 p-4">
            <p className="text-sm text-gray-600">
              💡 <strong>Astuce :</strong> Pour les fichiers volumineux,
              privilégiez plusieurs petits envois plutôt qu&apos;un gros.
            </p>
          </div>

          <Link
            href="/gallery"
            className="block bg-secondary text-white py-4 px-8 rounded-2xl font-semibold text-lg transition-all shadow-lg hover:bg-secondary-accessible"
          >
            Voir la Galerie
          </Link>
          <Link
            href="/"
            className="block bg-tertiary text-white py-4 px-8 rounded-2xl font-semibold text-lg transition-all shadow-lg hover:bg-tertiary-accessible"
          >
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
