import { useState } from 'react';
import FileUpload from './components/FileUpload';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import Footer from './components/Footer';
import HowTo from './components/HowTo';
import type { Reservation } from './types/reservation';

function App() {
  const [reservations, setReservations] = useState<Reservation[] | null>(null);

  const handleDataLoaded = (data: Reservation[]) => {
    setReservations(data);
  };

  const handleReset = () => {
    setReservations(null);
  };

    return (
    <div className="min-h-screen flex flex-col font-sony">
      <Header />
      <main className="flex-1">
        {reservations ? (
          <Dashboard reservations={reservations} onReset={handleReset} />
        ) : (
          <div className="max-w-3xl mx-auto">
            <FileUpload onDataLoaded={handleDataLoaded} />
            <HowTo />
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default App;
