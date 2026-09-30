import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  getDocs 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { 
  Language, 
  ViewPage, 
  Service, 
  Barber, 
  Booking, 
  GalleryItem, 
  Review, 
  SalonInfo,
  ClientProfile
} from '../types';
import {
  INITIAL_SALON_INFO,
  INITIAL_SERVICES,
  INITIAL_BARBERS,
  INITIAL_BOOKINGS,
  INITIAL_GALLERY,
  INITIAL_REVIEWS,
  INITIAL_CLIENTS
} from '../data/mockData';
import { getT } from '../utils/i18n';

interface SalonContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: ReturnType<typeof getT>;
  currentPage: ViewPage;
  setCurrentPage: (page: ViewPage) => void;
  salonInfo: SalonInfo;
  updateSalonInfo: (info: Partial<SalonInfo>) => void;
  services: Service[];
  barbers: Barber[];
  bookings: Booking[];
  gallery: GalleryItem[];
  reviews: Review[];
  clients: ClientProfile[];
  
  // Quick pre-selections for booking
  preselectedServiceId: string | null;
  setPreselectedServiceId: (id: string | null) => void;
  preselectedBarberId: string | null;
  setPreselectedBarberId: (id: string | null) => void;
  
  // Actions
  addBooking: (booking: Omit<Booking, 'id' | 'referenceNumber' | 'createdAt'>) => Booking;
  updateBookingStatus: (id: string, status: Booking['status']) => void;
  cancelBooking: (id: string) => void;
  checkSlotConflict: (barberId: string, date: string, timeSlot: string) => boolean;
  
  // Reviews
  addReview: (review: Omit<Review, 'id' | 'date' | 'status'>) => void;
  toggleReviewApproval: (id: string) => void;
  
  // Admin & management
  addService: (service: Omit<Service, 'id'>) => void;
  updateService: (id: string, service: Partial<Service>) => void;
  toggleBarberActive: (id: string) => void;
  
  // Utilities
  resetToDefaults: () => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const SalonContext = createContext<SalonContextType | undefined>(undefined);

const STORAGE_KEY = 'royal_barber_tripoli_launch_2026_v5';

export const SalonProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem('royal_barber_lang');
    return (saved === 'en' || saved === 'ar') ? saved : 'ar';
  });

  const [currentPage, setCurrentPage] = useState<ViewPage>('home');
  const [preselectedServiceId, setPreselectedServiceId] = useState<string | null>(null);
  const [preselectedBarberId, setPreselectedBarberId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Core Data States
  const [salonInfo, setSalonInfo] = useState<SalonInfo>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_info`);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure new phone & address are synced
        return {
          ...INITIAL_SALON_INFO,
          ...parsed,
          phone: INITIAL_SALON_INFO.phone,
          whatsappNumber: INITIAL_SALON_INFO.whatsappNumber,
          addressAr: INITIAL_SALON_INFO.addressAr,
          addressEn: INITIAL_SALON_INFO.addressEn,
          googleMapsUrl: INITIAL_SALON_INFO.googleMapsUrl
        };
      }
      return INITIAL_SALON_INFO;
    } catch {
      return INITIAL_SALON_INFO;
    }
  });

  const [services, setServices] = useState<Service[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_services`);
      return saved ? JSON.parse(saved) : INITIAL_SERVICES;
    } catch {
      return INITIAL_SERVICES;
    }
  });

  const [barbers, setBarbers] = useState<Barber[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_barbers`);
      return saved ? JSON.parse(saved) : INITIAL_BARBERS;
    } catch {
      return INITIAL_BARBERS;
    }
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_bookings`);
      return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
    } catch {
      return INITIAL_BOOKINGS;
    }
  });

  const [gallery, setGallery] = useState<GalleryItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_gallery`);
      return saved ? JSON.parse(saved) : INITIAL_GALLERY;
    } catch {
      return INITIAL_GALLERY;
    }
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_reviews`);
      return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
    } catch {
      return INITIAL_REVIEWS;
    }
  });

  const [clients, setClients] = useState<ClientProfile[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_clients`);
      return saved ? JSON.parse(saved) : INITIAL_CLIENTS;
    } catch {
      return INITIAL_CLIENTS;
    }
  });

  // Keep dir and lang in sync on root element
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('royal_barber_lang', lang);
  }, [lang]);

  // Persist all data states to localStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_info`, JSON.stringify(salonInfo));
  }, [salonInfo]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_services`, JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_barbers`, JSON.stringify(barbers));
  }, [barbers]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_bookings`, JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_reviews`, JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_clients`, JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_gallery`, JSON.stringify(gallery));
  }, [gallery]);

  // Listen to cross-tab storage changes to ensure admin updates in real-time
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === `${STORAGE_KEY}_bookings` && e.newValue) {
        try {
          setBookings(JSON.parse(e.newValue));
        } catch {}
      }
      if (e.key === `${STORAGE_KEY}_clients` && e.newValue) {
        try {
          setClients(JSON.parse(e.newValue));
        } catch {}
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Listen to Firestore bookings, reviews, and clients in real time
  useEffect(() => {
    let unsubBookings: () => void = () => {};
    let unsubReviews: () => void = () => {};
    let unsubClients: () => void = () => {};

    try {
      const bookingsCol = collection(db, 'bookings');
      unsubBookings = onSnapshot(
        bookingsCol,
        (snapshot) => {
          const remoteBookings: Booking[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data() as Booking;
            remoteBookings.push(data);
          });
          remoteBookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setBookings(remoteBookings);
        },
        (error) => {
          console.warn('Firestore bookings snapshot notice:', error.message);
        }
      );

      const reviewsCol = collection(db, 'reviews');
      unsubReviews = onSnapshot(
        reviewsCol,
        (snapshot) => {
          const remoteReviews: Review[] = [];
          snapshot.forEach((docSnap) => {
            remoteReviews.push(docSnap.data() as Review);
          });
          setReviews(remoteReviews);
        },
        (error) => {
          console.warn('Firestore reviews snapshot notice:', error.message);
        }
      );

      const clientsCol = collection(db, 'clients');
      unsubClients = onSnapshot(
        clientsCol,
        (snapshot) => {
          const remoteClients: ClientProfile[] = [];
          snapshot.forEach((docSnap) => {
            remoteClients.push(docSnap.data() as ClientProfile);
          });
          setClients(remoteClients);
        },
        (error) => {
          console.warn('Firestore clients snapshot notice:', error.message);
        }
      );
    } catch (err) {
      console.warn('Firestore subscription fallback:', err);
    }

    return () => {
      unsubBookings();
      unsubReviews();
      unsubClients();
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3800);
  };

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    showToast(newLang === 'ar' ? 'تم تحويل الواجهة إلى اللغة العربية' : 'Switched interface to English');
  };

  // Conflict Checking: If a barber already has a confirmed/active booking at date & time
  const checkSlotConflict = (barberId: string, date: string, timeSlot: string): boolean => {
    if (!barberId || barberId === 'any') return false;
    return bookings.some(
      (b) =>
        b.barberId === barberId &&
        b.date === date &&
        b.timeSlot === timeSlot &&
        b.status !== 'cancelled'
    );
  };

  const addBooking = (bookingData: Omit<Booking, 'id' | 'referenceNumber' | 'createdAt'>): Booking => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newRef = `RB-2026-${randomSuffix}`;
    const newBooking: Booking = {
      ...bookingData,
      id: `bk-${Date.now()}`,
      referenceNumber: newRef,
      createdAt: new Date().toISOString()
    };

    setBookings((prev) => {
      const updated = [newBooking, ...prev];
      try {
        localStorage.setItem(`${STORAGE_KEY}_bookings`, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to persist bookings', e);
      }
      return updated;
    });

    // Write to Firestore
    try {
      setDoc(doc(db, 'bookings', newBooking.id), newBooking).catch((err) => {
        console.warn('Firestore booking persist notice:', err);
      });
    } catch (err) {
      console.warn('Error invoking Firestore booking save:', err);
    }

    // Also update or add to Client CRM
    setClients((prev) => {
      let updatedClients: ClientProfile[];
      let targetClient: ClientProfile;
      const existing = prev.find((c) => c.phone === newBooking.customerPhone);
      if (existing) {
        targetClient = {
          ...existing,
          totalBookings: existing.totalBookings + 1,
          totalSpent: existing.totalSpent + newBooking.totalPrice,
          lastVisit: newBooking.date
        };
        updatedClients = prev.map((c) => (c.id === existing.id ? targetClient : c));
      } else {
        targetClient = {
          id: `cli-${Date.now()}`,
          name: newBooking.customerName,
          phone: newBooking.customerPhone,
          email: newBooking.customerEmail,
          totalBookings: 1,
          totalSpent: newBooking.totalPrice,
          lastVisit: newBooking.date,
          vipTier: newBooking.totalPrice >= 60 ? 'Platinum' : 'Gold'
        };
        updatedClients = [targetClient, ...prev];
      }
      try {
        localStorage.setItem(`${STORAGE_KEY}_clients`, JSON.stringify(updatedClients));
        setDoc(doc(db, 'clients', targetClient.id), targetClient).catch(() => {});
      } catch (e) {
        console.error('Failed to persist clients', e);
      }
      return updatedClients;
    });

    return newBooking;
  };

  const updateBookingStatus = (id: string, status: Booking['status']) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b))
    );
    try {
      updateDoc(doc(db, 'bookings', id), { status }).catch(() => {});
    } catch {}
    showToast(lang === 'ar' ? 'تم تحديث حالة الموعد' : 'Booking status updated');
  };

  const cancelBooking = (id: string) => {
    updateBookingStatus(id, 'cancelled');
  };

  const addReview = (reviewData: Omit<Review, 'id' | 'date' | 'status'>) => {
    const newRev: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      status: 'approved' // auto-approve in preview demo
    };
    setReviews((prev) => [newRev, ...prev]);
    try {
      setDoc(doc(db, 'reviews', newRev.id), newRev).catch(() => {});
    } catch {}
    showToast(lang === 'ar' ? 'شكراً لك! تم إضافة تقييمك بنجاح' : 'Thank you! Review submitted successfully');
  };

  const toggleReviewApproval = (id: string) => {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, status: r.status === 'approved' ? 'pending' : 'approved' }
          : r
      )
    );
  };

  const addService = (srvData: Omit<Service, 'id'>) => {
    const newSrv: Service = {
      ...srvData,
      id: `srv-${Date.now()}`
    };
    setServices((prev) => [...prev, newSrv]);
    showToast(lang === 'ar' ? 'تمت إضافة الخدمة بنجاح' : 'Service added successfully');
  };

  const updateService = (id: string, updated: Partial<Service>) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updated } : s))
    );
  };

  const toggleBarberActive = (id: string) => {
    setBarbers((prev) =>
      prev.map((b) => (b.id === id ? { ...b, isActive: !b.isActive } : b))
    );
    showToast(lang === 'ar' ? 'تم تغيير حالة توفر الحلاق' : 'Barber availability updated');
  };

  const updateSalonInfo = (updated: Partial<SalonInfo>) => {
    setSalonInfo((prev) => ({ ...prev, ...updated }));
  };

  const resetToDefaults = () => {
    localStorage.removeItem(`${STORAGE_KEY}_info`);
    localStorage.removeItem(`${STORAGE_KEY}_services`);
    localStorage.removeItem(`${STORAGE_KEY}_barbers`);
    localStorage.removeItem(`${STORAGE_KEY}_bookings`);
    localStorage.removeItem(`${STORAGE_KEY}_reviews`);
    localStorage.removeItem(`${STORAGE_KEY}_clients`);
    localStorage.removeItem(`${STORAGE_KEY}_gallery`);

    setSalonInfo(INITIAL_SALON_INFO);
    setServices(INITIAL_SERVICES);
    setBarbers(INITIAL_BARBERS);
    setBookings(INITIAL_BOOKINGS);
    setGallery(INITIAL_GALLERY);
    setReviews(INITIAL_REVIEWS);
    setClients(INITIAL_CLIENTS);

    showToast(lang === 'ar' ? 'تمت تصفية وتصفير كافة البيانات وبدء النظام كصالون جديد اليوم بنجاح' : 'All counts reset to fresh launch state (0 bookings)');
  };

  const t = getT(lang);

  return (
    <SalonContext.Provider
      value={{
        lang,
        setLang,
        t,
        currentPage,
        setCurrentPage,
        salonInfo,
        updateSalonInfo,
        services,
        barbers,
        bookings,
        gallery,
        reviews,
        clients,
        preselectedServiceId,
        setPreselectedServiceId,
        preselectedBarberId,
        setPreselectedBarberId,
        addBooking,
        updateBookingStatus,
        cancelBooking,
        checkSlotConflict,
        addReview,
        toggleReviewApproval,
        addService,
        updateService,
        toggleBarberActive,
        resetToDefaults,
        toastMessage,
        showToast
      }}
    >
      {children}
    </SalonContext.Provider>
  );
};

export const useSalon = () => {
  const context = useContext(SalonContext);
  if (!context) {
    throw new Error('useSalon must be used within a SalonProvider');
  }
  return context;
};
