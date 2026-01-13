export default function HowTo() {
  return (
    <div className="flex items-center justify-center p-6">
      <div className="max-w-full w-full">
        <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Com obtenir el teu fitxer CSV?
            </h1>
            <p className="text-gray-600">
              Segueix aquests passos per descarregar el teu fitxer CSV des del portal del SAF:
            </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            <ol className="list-decimal list-inside space-y-4 text-gray-700">
                <li>Inicia sessió a <a href="https://uab.deporsite.net/login" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">uab.deporsite.net</a></li>
                <li>Ves a "Les Meves Reserves"</li>
                <li>A "Reserves Passades" selecciona el període i carrega l'historial</li>
                <li>Descarrega les dades en format CSV. Per el moment hauràs d'utilitzar una extensió com pot ser <a href="https://chromewebstore.google.com/detail/instant-data-scraper/ofaokhiedipichpaobibbnahnkdoiiah?hl=en" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">Instant Data Scraper</a> per obtenir el fitxer.</li>
                <li>Fes clic al botó de descarrega i desa el fitxer al teu dispositiu.</li>
            </ol>
        </div>
      </div>
    </div>
  );
}