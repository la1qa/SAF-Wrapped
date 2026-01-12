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
                <li>Inicia sessió al portal del SAF amb les teves credencials d'usuari.</li>
                <li>Navega fins a la secció de "Reserves" o "Historial de Reserves".</li>
                <li>Busca l'opció per exportar o descarregar les teves dades de reserves.</li>
                <li>Selecciona el format CSV per a la descàrrega.</li>
                <li>Fes clic al botó de descarrega i desa el fitxer al teu dispositiu.</li>
            </ol>
            <p className="mt-4 text-sm text-gray-500">
                Nota: Si tens dificultats per trobar l'opció de descàrrega, consulta la secció d'ajuda del portal del SAF o contacta amb el suport tècnic.
            </p>
        </div>
      </div>
    </div>
  );
}