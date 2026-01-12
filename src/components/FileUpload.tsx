import { Upload } from 'lucide-react';
import { parseCSV } from '../utils/csvParser';
import type { Reservation } from '../types/reservation';

interface FileUploadProps {
  onDataLoaded: (reservations: Reservation[]) => void;
}

export default function FileUpload({ onDataLoaded }: FileUploadProps) {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Upload className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Reservation Analytics
          </h1>
          <p className="text-gray-600">
            Upload your CSV file to view insights and analytics
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
          <label
            htmlFor="csv-upload"
            className="block cursor-pointer"
          >
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-500 hover:bg-blue-50 transition-all">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-sm font-medium text-gray-700 mb-1">
                Click to upload CSV
              </p>
              <p className="text-xs text-gray-500">
                CSV file with reservation data
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

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 mb-2 font-medium">Expected format:</p>
            <code className="text-xs text-gray-500 block">
              "Codi","Data","Horari","dummy","Nom","Informacio"
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}
