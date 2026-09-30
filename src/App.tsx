import React from 'react';
import { SalonProvider, useSalon } from './context/SalonContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { FloatingActions } from './components/FloatingActions';
import { Toast } from './components/Toast';
import { HomeView } from './views/HomeView';
import { ServicesView } from './views/ServicesView';
import { GalleryView } from './views/GalleryView';
import { BarbersView } from './views/BarbersView';
import { ReviewsView } from './views/ReviewsView';
import { LocationView } from './views/LocationView';
import { BookingView } from './views/BookingView';
import { AdminView } from './views/AdminView';

const MainAppContent: React.FC = () => {
  const { currentPage } = useSalon();

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0c10] text-[#e8eaed] selection:bg-[#d4af37]/30 selection:text-[#f8f9fa]">
      <Navbar />
      
      <main className="flex-1">
        {currentPage === 'home' && <HomeView />}
        {currentPage === 'services' && <ServicesView />}
        {currentPage === 'gallery' && <GalleryView />}
        {currentPage === 'barbers' && <BarbersView />}
        {currentPage === 'reviews' && <ReviewsView />}
        {currentPage === 'location' && <LocationView />}
        {currentPage === 'booking' && <BookingView />}
        {currentPage === 'admin' && <AdminView />}
      </main>

      <Footer />
      <FloatingActions />
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <SalonProvider>
      <MainAppContent />
    </SalonProvider>
  );
}
