export type Language = 'ar' | 'en';

export type ViewPage = 
  | 'home' 
  | 'services' 
  | 'gallery' 
  | 'barbers' 
  | 'reviews' 
  | 'location' 
  | 'booking' 
  | 'admin';

export type ServiceCategory = 'hair' | 'beard' | 'packages' | 'vip' | 'treatments';

export interface Service {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  category: ServiceCategory;
  price: number;
  durationMinutes: number;
  isPopular?: boolean;
  isVipOnly?: boolean;
  image: string;
  includesAr: string[];
  includesEn: string[];
}

export interface Barber {
  id: string;
  nameAr: string;
  nameEn: string;
  titleAr: string;
  titleEn: string;
  experienceYears: number;
  rating: number;
  reviewCount: number;
  avatar: string;
  specialtiesAr: string[];
  specialtiesEn: string[];
  bioAr: string;
  bioEn: string;
  availableDays: number[]; // 0 = Sunday, 1 = Monday ... 6 = Saturday
  workHours: {
    start: string; // e.g. "10:00"
    end: string;   // e.g. "23:00"
  };
  isActive: boolean;
}

export type FadeLevel = 
  | 'skin_fade'       // تدرجة زيرو سكين فيد
  | 'taper_fade'      // تايبر فيد (حلاقة الجوانب والرقبة فقط)
  | 'low_fade'        // تدرجة واطية
  | 'mid_fade'        // تدرجة وسط
  | 'classic_scissor' // قصة كلاسيك مشط ومقص
  | 'buzz_cut';       // تخفيف بماكينة نمرة واحدة (باز كت)

export type BeardStyle = 
  | 'sharp_lineup'    // تحديد بالموس شفرة نظيفة
  | 'beard_fade'      // تدريج اللحية مع السوالف
  | 'full_sculpt'     // تهذيب لحية كاملة مع تسوية
  | 'steam_trim'      // تنظيف وبخار للحية مع زيوت
  | 'hot_shave'       // حلاقة ذقن كاملة بالموس وفوطة ساخنة
  | 'none';           // بدون لحية (شعر فقط)

export interface AddOnOption {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  price: number;
  durationMinutes: number;
  iconName: string;
}

export interface CustomOptions {
  fadeLevel: FadeLevel;
  beardStyle: BeardStyle;
  hairWashIncluded: boolean;
  selectedAddOns: string[]; // AddOnOption IDs
  beverageChoice?: string;
  fragranceFinish?: string;
}

export type BookingStatus = 'confirmed' | 'completed' | 'cancelled';
export type PaymentMethod = 'pay_at_salon' | 'online_deposit';
export type ConfirmationMethod = 'whatsapp' | 'email' | 'both';

export interface Booking {
  id: string;
  referenceNumber: string; // e.g. RB-2026-8942
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  confirmationMethod?: ConfirmationMethod;
  serviceId: string;
  serviceNameAr: string;
  serviceNameEn: string;
  barberId: string; // or 'any'
  barberNameAr: string;
  barberNameEn: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // "14:30"
  customOptions: CustomOptions;
  addOnDetails: { id: string; nameAr: string; nameEn: string; price: number }[];
  totalPrice: number;
  totalDurationMinutes: number;
  status: BookingStatus;
  vipNotes?: string;
  paymentMethod: PaymentMethod;
  createdAt: string;
}

export interface GalleryItem {
  id: string;
  titleAr: string;
  titleEn: string;
  category: 'classic' | 'fade' | 'beard' | 'vip_groom';
  imageUrl: string;
  barberId?: string;
  barberName?: string;
  likes: number;
}

export interface Review {
  id: string;
  authorNameAr: string;
  authorNameEn: string;
  rating: number; // 1 to 5
  commentAr: string;
  commentEn: string;
  date: string;
  verifiedBooking: boolean;
  serviceNameAr: string;
  serviceNameEn: string;
  avatar?: string;
  status: 'approved' | 'pending';
}

export interface SalonInfo {
  name: string;
  taglineAr: string;
  taglineEn: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  addressAr: string;
  addressEn: string;
  cityAr: string;
  cityEn: string;
  googleMapsUrl: string;
  workingHoursAr: string;
  workingHoursEn: string;
  instagram: string;
  vipRoomAvailable: boolean;
  currency: string;
}

export interface ClientProfile {
  id: string;
  name: string;
  phone: string;
  email?: string;
  totalBookings: number;
  totalSpent: number;
  lastVisit: string;
  vipTier: 'Gold' | 'Platinum' | 'Royal Diamond';
  notes?: string;
}
