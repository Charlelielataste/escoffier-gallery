export default function InvalidEventPage() {
  return (
    <div className="min-h-screen flex items-center justify-center py-10 bg-container">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="bg-white/60 backdrop-blur rounded-2xl border border-red-200 p-8">
          <p className="text-4xl mb-4">🔒</p>
          <h1 className="text-2xl text-primary font-bold mb-4">
            Lien invalide
          </h1>
          <p className="text-gray-600 mb-2">
            Ce lien d&apos;évènement n&apos;est pas valide ou a expiré.
          </p>
          <p className="text-sm text-gray-500">
            Veuillez vérifier le lien qui vous a été communiqué ou contacter
            l&apos;organisateur de l&apos;évènement.
          </p>
        </div>
      </div>
    </div>
  );
}
