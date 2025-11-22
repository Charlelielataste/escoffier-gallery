import Image from "next/image";
import Link from "next/link";
import logo from "@/public/logo-escoffier.png";

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center py-10 bg-container">
      <div className="text-center max-w-2xl mx-auto px-4 w-full">
        <div className="mb-12">
          <div className="inline-flex items-center space-x-2 mb-4">
            <Image src={logo} alt="Logo" width={200} height={200} />
          </div>
          <p className="text-lg text-primary font-bold mb-4">
            Evénement du lundi 24 novembre 2025
          </p>
          <p className="text-2xl text-primary font-bold mb-4">
            Diner Seconde Chance (titre à définir)
          </p>
          <div className="flex justify-center space-x-2">
            <span className="text-2xl">📸</span>
            <span className="text-2xl">✨</span>
            <span className="text-2xl">🍽️</span>
            <span className="text-2xl">✨</span>
            <span className="text-2xl">🎬</span>
          </div>
        </div>

        {/* Main navigation */}
        <div className="space-y-4 max-w-md mx-auto">
          <Link
            href="/upload"
            className="block bg-primary text-white py-4 px-8 rounded-2xl font-semibold text-lg transition-all shadow-lg"
          >
            Ajoutez Photos & Vidéos
          </Link>
          <Link
            href="/gallery"
            className="block bg-secondary text-white py-4 px-8 rounded-2xl font-semibold text-lg transition-all shadow-lg"
          >
            Voir la Galerie
          </Link>
        </div>

        {/* Additional information */}
        <div className="max-w-md mx-auto">
          <div className="mt-12 p-4 bg-white border border-tertiary backdrop-blur rounded-2xl">
            <h3 className="text-lg font-semibold text-primary mb-3">
              Comment ça marche ?
            </h3>
            <div className="text-sm text-black space-y-3 text-center">
              <p>
                📱 <strong>Télécharger :</strong> Ajoutez vos photos et vidéos
              </p>
              <p>
                🎨 <strong>Galerie :</strong> Découvrez la galerie de
                l&apos;événement
              </p>
            </div>
          </div>
        </div>
        {/* Footer */}
        <div className="mt-8 text-xs text-gray-400">
          <p>Merci de votre participation ! 🥂</p>
        </div>
      </div>
    </div>
  );
}
