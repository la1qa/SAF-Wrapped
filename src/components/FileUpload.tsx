import { Upload } from 'lucide-react';
import { parseCSV } from '../utils/csvParser';
import type { Reservation } from '../types/reservation';

interface FileUploadProps {
  onDataLoaded: (reservations: Reservation[]) => void;
}

export default function FileUpload({ onDataLoaded }: FileUploadProps) {
  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const reservations = parseCSV(content);
        onDataLoaded(reservations);
      } catch (error) {
        alert('Error parsing CSV file. Please check the file format.');
        console.error(error);
      }
    };
    reader.readAsText(file);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    processFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50');
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    processFile(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.add('border-blue-500', 'bg-blue-50');
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50');
  };

  return (
    <div className="flex items-center justify-center p-6">
      <div className="max-w-full w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Descobreix el teus hàbits al SAF. 
          </h1>
          <p className="text-gray-600">
            Puja el teu fitxer CSV i obté un resum personalitzat del teu ús de les instal·lacions!
          </p>
        </div>

        <div className="mx-auto max-w-md w-full">
          <label
            htmlFor="csv-upload"
            className="block cursor-pointer"
          >
            <div 
              className="bg-white border-2 border-dashed border-[#28a35e] rounded-lg p-12 text-center hover:border-[#005d28] hover:bg-[#e9fae9] transition-all"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <Upload className="w-12 h-12 text-[#005d28] mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-700 mb-1">
                Arrossega el teu fitxer CSV aquí
              </p>
              <p className="text-sm text-gray-500">
                o fes clic per seleccionar-lo
              </p>
            </div>
            <input
              id="csv-upload"
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
          <span className="block text-center text-gray-500 text-sm mt-4">
            No guardem ni recollim aquestes dades.
          </span>
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 mb-2 font-medium">Format esperat:</p>
            <code className="text-xs text-gray-500 block">
              "Codi","Data","Horari","dummy","Nom","Informacio"
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}
