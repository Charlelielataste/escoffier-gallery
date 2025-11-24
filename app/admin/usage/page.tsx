"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "@/public/logo-escoffier.png";

interface UsageData {
  transformations: {
    used: number;
    limit: number;
    percent: number;
    remaining: number;
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
      if (!response.ok) {
        throw new Error("Failed to fetch usage");
      }
      const data = await response.json();
      setUsage(data);
      setLastUpdate(new Date());
      setError(null);
    } catch (err) {
      console.error("Error fetching usage:", err);
      setError("Erreur lors du chargement des données");
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
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || "Erreur de chargement"}</p>
          <button
            onClick={fetchUsage}
            className="bg-primary text-white py-2 px-4 rounded-xl"
          >
            Réessayer
          </button>
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

        {/* Transformations */}
        <div className="bg-white/60 backdrop-blur rounded-2xl border border-pink-100 p-6 mb-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold text-primary">
              Transformations (Crédits)
            </h2>
            <span
              className={`px-3 py-1 rounded-full text-white text-sm font-semibold ${getColorClass(
                usage.transformations.percent
              )}`}
            >
              {usage.transformations.percent.toFixed(1)}%
            </span>
          </div>
          <div className="bg-gray-200 rounded-full h-6 mb-3 overflow-hidden">
            <div
              className={`h-6 rounded-full transition-all duration-300 ${getColorClass(
                usage.transformations.percent
              )}`}
              style={{ width: `${Math.min(usage.transformations.percent, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-700">
              Utilisé :{" "}
              <strong>
                {usage.transformations.used.toLocaleString()}
              </strong>
            </span>
            <span className="text-gray-700">
              Limite :{" "}
              <strong>
                {usage.transformations.limit.toLocaleString()}
              </strong>
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Restant :{" "}
            <strong>
              {usage.transformations.remaining.toLocaleString()} crédits
            </strong>
          </p>
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

