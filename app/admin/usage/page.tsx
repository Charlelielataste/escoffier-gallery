"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "@/public/logo-escoffier.png";

interface UsageData {
  credits: {
    used: number;
    limit: number;
    percent: number;
    remaining: number;
  };
  transformations: {
    used: number;
    creditsUsed: number;
  };
  bandwidth: {
    used: number;
    usedGB: string;
    limit: number;
    limitGB: string;
    percent: number;
    remainingGB: string;
  };
  storage: {
    used: number;
    usedGB: string;
    limit: number;
    limitGB: string;
    percent: number;
    remainingGB: string;
  };
  resetDate: string | null;
  resources?: number;
  impressions?: number;
}

export default function UsagePage() {
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    fetchUsage();
    // Rafraîchir toutes les 30 secondes
    const interval = setInterval(() => {
      fetchUsage();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchUsage = async () => {
    try {
      const response = await fetch("/api/usage");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || "Failed to fetch usage");
      }

      // Vérifier si c'est une erreur
      if (data.error) {
        throw new Error(data.message || data.error);
      }

      setUsage(data);
      setLastUpdate(new Date());
      setError(null);
    } catch (err) {
      console.error("Error fetching usage:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Erreur lors du chargement des données. Vérifiez la console pour plus de détails.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getColorClass = (percent: number) => {
    if (percent >= 90) return "bg-red-500";
    if (percent >= 70) return "bg-orange-500";
    if (percent >= 50) return "bg-yellow-500";
    return "bg-green-500";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-container">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600">Chargement des données...</p>
        </div>
      </div>
    );
  }

  if (error || !usage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-container">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="bg-white/60 backdrop-blur rounded-2xl border border-red-200 p-6">
            <p className="text-red-600 mb-4 font-semibold">
              {error || "Erreur de chargement"}
            </p>
            <p className="text-sm text-gray-600 mb-4">
              Vérifiez que vos credentials Cloudinary sont correctement
              configurés dans les variables d&apos;environnement.
            </p>
            <button
              onClick={fetchUsage}
              className="bg-primary text-white py-2 px-4 rounded-xl font-semibold hover:bg-primary-accessible transition-all"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 bg-container">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4">
            <Image src={logo} alt="Logo" width={100} height={100} />
          </Link>
          <h1 className="text-3xl text-primary font-bold mb-2">
            Consommation Cloudinary
          </h1>
          <p className="text-gray-600">
            Dernière mise à jour : {lastUpdate.toLocaleTimeString()}
          </p>
        </div>

        {/* Crédits totaux */}
        <div className="bg-white/60 backdrop-blur rounded-2xl border border-pink-100 p-6 mb-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold text-primary">
              Crédits Cloudinary (Total)
            </h2>
            <span
              className={`px-3 py-1 rounded-full text-white text-sm font-semibold ${getColorClass(
                usage.credits.percent
              )}`}
            >
              {usage.credits.percent.toFixed(1)}%
            </span>
          </div>
          <div className="bg-gray-200 rounded-full h-6 mb-3 overflow-hidden">
            <div
              className={`h-6 rounded-full transition-all duration-300 ${getColorClass(
                usage.credits.percent
              )}`}
              style={{
                width: `${Math.min(usage.credits.percent, 100)}%`,
              }}
            />
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-700">
              Utilisé : <strong>{usage.credits.used.toFixed(2)}</strong>
            </span>
            <span className="text-gray-700">
              Limite : <strong>{usage.credits.limit}</strong>
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Restant :{" "}
            <strong>{usage.credits.remaining.toFixed(2)} crédits</strong>
          </p>
        </div>

        {/* Transformations */}
        <div className="bg-white/60 backdrop-blur rounded-2xl border border-pink-100 p-6 mb-6">
          <h2 className="text-lg font-semibold text-primary mb-2">
            Transformations
          </h2>
          <div className="text-sm">
            <p className="text-gray-700 mb-1">
              Transformations effectuées :{" "}
              <strong>{usage.transformations.used.toLocaleString()}</strong>
            </p>
            <p className="text-gray-600">
              Crédits utilisés pour transformations :{" "}
              <strong>{usage.transformations.creditsUsed.toFixed(2)}</strong>
            </p>
          </div>
        </div>

        {/* Bandwidth */}
        <div className="bg-white/60 backdrop-blur rounded-2xl border border-pink-100 p-6 mb-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold text-primary">Bandwidth</h2>
            <span
              className={`px-3 py-1 rounded-full text-white text-sm font-semibold ${getColorClass(
                usage.bandwidth.percent
              )}`}
            >
              {usage.bandwidth.percent.toFixed(1)}%
            </span>
          </div>
          <div className="bg-gray-200 rounded-full h-6 mb-3 overflow-hidden">
            <div
              className={`h-6 rounded-full transition-all duration-300 ${getColorClass(
                usage.bandwidth.percent
              )}`}
              style={{ width: `${Math.min(usage.bandwidth.percent, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-700">
              Utilisé : <strong>{usage.bandwidth.usedGB} GB</strong>
            </span>
            <span className="text-gray-700">
              Limite : <strong>{usage.bandwidth.limitGB} GB</strong>
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Restant : <strong>{usage.bandwidth.remainingGB} GB</strong>
          </p>
        </div>

        {/* Storage */}
        <div className="bg-white/60 backdrop-blur rounded-2xl border border-pink-100 p-6 mb-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold text-primary">Stockage</h2>
            <span
              className={`px-3 py-1 rounded-full text-white text-sm font-semibold ${getColorClass(
                usage.storage.percent
              )}`}
            >
              {usage.storage.percent.toFixed(1)}%
            </span>
          </div>
          <div className="bg-gray-200 rounded-full h-6 mb-3 overflow-hidden">
            <div
              className={`h-6 rounded-full transition-all duration-300 ${getColorClass(
                usage.storage.percent
              )}`}
              style={{ width: `${Math.min(usage.storage.percent, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-700">
              Utilisé : <strong>{usage.storage.usedGB} GB</strong>
            </span>
            <span className="text-gray-700">
              Limite : <strong>{usage.storage.limitGB} GB</strong>
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Restant : <strong>{usage.storage.remainingGB} GB</strong>
          </p>
        </div>

        {/* Stats supplémentaires */}
        {(usage.resources !== undefined || usage.impressions !== undefined) && (
          <div className="bg-white/60 backdrop-blur rounded-2xl border border-pink-100 p-6 mb-6">
            <h2 className="text-lg font-semibold text-primary mb-4">
              Statistiques
            </h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {usage.resources !== undefined && (
                <div>
                  <p className="text-gray-600">Ressources totales</p>
                  <p className="text-primary font-semibold text-lg">
                    {usage.resources.toLocaleString()}
                  </p>
                </div>
              )}
              {usage.impressions !== undefined && (
                <div>
                  <p className="text-gray-600">Impressions</p>
                  <p className="text-primary font-semibold text-lg">
                    {usage.impressions.toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Info */}
        <div className="bg-white/60 backdrop-blur rounded-2xl border border-pink-100 p-4 text-center">
          <p className="text-sm text-gray-600">
            {usage.resetDate
              ? `Réinitialisation : ${new Date(
                  usage.resetDate
                ).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}`
              : "Les quotas se réinitialisent chaque mois"}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Les données se mettent à jour automatiquement toutes les 30 secondes
          </p>
        </div>

        {/* Navigation */}
        <div className="mt-6 text-center space-y-4">
          <Link
            href="/gallery/pictures"
            className="inline-block bg-primary text-white py-3 px-6 rounded-xl font-semibold transition-all shadow-lg hover:bg-primary-accessible"
          >
            Voir la Galerie
          </Link>
        </div>
      </div>
    </div>
  );
}
