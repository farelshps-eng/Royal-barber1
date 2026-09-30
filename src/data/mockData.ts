import { 
  Barber, 
  Service, 
  AddOnOption, 
  Booking, 
  GalleryItem, 
  Review, 
  SalonInfo,
  ClientProfile
} from '../types';

export const INITIAL_SALON_INFO: SalonInfo = {
  name: "ROYAL BARBER",
  taglineAr: "حلاقة تواكبك. أناقة تميّزك.",
  taglineEn: "Modern Precision Fades & Gentlemen Grooming in Tripoli",
  phone: "+218 94-2755744",
  whatsappNumber: "+218 94-2755744",
  email: "contact@royalbarber.ly",
  addressAr: "شارع أولاد ابن الحاج – طرابلس",
  addressEn: "Awlad Ibn Al-Hajj St, Tripoli, Libya",
  cityAr: "طرابلس، ليبيا",
  cityEn: "Tripoli, Libya",
  googleMapsUrl: "https://maps.app.goo.gl/BE2rK39stH6c8PZx9",
  workingHoursAr: "السبت - الخميس: 10:00 ص - 11:00 م | الجمعة: 2:30 م - 11:30 م",
  workingHoursEn: "Sat - Thu: 10:00 AM - 11:00 PM | Fri: 2:30 PM - 11:30 PM",
  instagram: "@royalbarber.libya",
  vipRoomAvailable: true,
  currency: "د.ل"
};

export const INITIAL_SERVICES: Service[] = [
  {
    id: "srv-fade-cut",
    nameAr: "قصة شعر مع تدرجة وسكين فيد (Skin Fade)",
    nameEn: "Precision Skin Fade & Styling",
    descriptionAr: "غسيل شعر، تدرجة نظيفة بماكينة الزيرو والشفرة، قصة متناسقة وتصفيف بمثبت عالي الجودة.",
    descriptionEn: "Hair wash, ultra-clean zero skin fade, custom texturing and matte pomade finish.",
    category: "hair",
    price: 30,
    durationMinutes: 40,
    isPopular: true,
    image: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=800&q=80",
    includesAr: ["غسيل شعر مرطب", "تدرجة ليزر أو سكين فيد بالموس", "قصة وتخفيف بالمقص", "تصفيف وسيشوار بمواد أصلية"],
    includesEn: ["Hydrating wash", "Clean razor skin fade", "Scissor texturing", "Blowout & matte finish"]
  },
  {
    id: "srv-beard-clean",
    nameAr: "تحديد وتدريج اللحية بالموس (Beard Fade)",
    nameEn: "Razor Beard Lineup & Gradual Fade",
    descriptionAr: "رسم خطوط الخد والرقبة بالموس الحاد، تدرج اللحية مع السوالف، فوطة ساخنة مهدئة وزيت ترطيب.",
    descriptionEn: "Straight razor crisp cheek & neck lines, gradual beard fade blend, hot towel and organic beard oil.",
    category: "beard",
    price: 15,
    durationMinutes: 25,
    isPopular: true,
    image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=800&q=80",
    includesAr: ["تحديدة شفرة حادة ومعقمة", "تدريج جانبي اللحية", "فوطة ساخنة مريحة", "زيت وكولونيا ليمون بعد الحلاقة"],
    includesEn: ["Sterile fresh blade lineup", "Sideburns fade transition", "Soothing hot towel", "Beard oil & post-shave balm"]
  },
  {
    id: "srv-full-combo",
    nameAr: "باقة رويال كومبو (شعر + لحية + غسيل)",
    nameEn: "Royal Combo (Haircut + Beard + Wash)",
    descriptionAr: "الباقة الأكثر طلباً: قصة وتدرجة شعر حسب طلبك، تحديد وتدريج اللحية، غسيل وسيشوار كامل.",
    descriptionEn: "Our most requested package: bespoke haircut and fade, beard sculpting, wash and fresh styling.",
    category: "packages",
    price: 40,
    durationMinutes: 55,
    isPopular: true,
    image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80",
    includesAr: ["قص وتدرجة شعر كاملة", "تحديد اللحية بالموس وشفرة جديدة", "غسيل شعر مرتين وتدليك خفيف", "سيشوار وتصفيف بالواكس"],
    includesEn: ["Full haircut & fade", "Razor beard edging", "Double wash & scalp refresh", "Blow dry & wax styling"]
  },
  {
    id: "srv-groom-vip",
    nameAr: "باقة العريس VIP المتكاملة (جلسة خاصة)",
    nameEn: "VIP Groom Master Package",
    descriptionAr: "تجهيز كامل للعريس: قصة شعر متقنة، تدريج لحية، تنظيف بشرة عميق بالأوزون، ماسك ذهبي، سنفرة وتقشير، وضيافة خاصة.",
    descriptionEn: "Complete wedding preparation: bespoke cut, razor beard, ozone steam facial, gold mask, scrub and private lounge.",
    category: "vip",
    price: 130,
    durationMinutes: 110,
    isVipOnly: true,
    image: "https://images.unsplash.com/photo-1517832606589-7629c3395907?auto=format&fit=crop&w=800&q=80",
    includesAr: ["قص وتدريج شعر ولحية متكامل", "تنظيف بشرة بجهاز البخار والشفط", "ماسك الذهب لنضارة الوجه", "سنفرة لليدين والوجه", "تعطير خاص وتبخير"],
    includesEn: ["Master cut & beard design", "Steam vacuum deep facial", "24K Gold radiance mask", "Hand grooming & exfoliation", "Premium fragrance finishing"]
  },
  {
    id: "srv-facial-black",
    nameAr: "تنظيف بشرة وماسك الفحم للرؤوس السوداء",
    nameEn: "Charcoal Detox Facial & Steam",
    descriptionAr: "جلسة بخار لتفتيح المسام، إزالة الرؤوس السوداء والشوائب، وماسك الفحم المنشط لشد وإنعاش البشرة.",
    descriptionEn: "Pore-opening steam session, blackhead removal, and peel-off activated charcoal clarifying mask.",
    category: "treatments",
    price: 25,
    durationMinutes: 30,
    image: "https://images.unsplash.com/photo-1512290900672-1f55b6a0b4b2?auto=format&fit=crop&w=800&q=80",
    includesAr: ["بخار أوزون ساخن", "إزالة الشوائب من الأنف والجبين", "ماسك الفحم الطبيعي", "مرطب ومهدئ للوجه"],
    includesEn: ["Warm facial ozone steam", "T-zone blackhead extraction", "Natural charcoal peel", "Hydrating soothing gel"]
  },
  {
    id: "srv-classic-scissor",
    nameAr: "قصة كلاسيك عادية (مشط ومقص فقط)",
    nameEn: "Classic Scissor & Comb Gentleman Cut",
    descriptionAr: "حلاقة كلاسيكية محترمة بالمقص والمشط بدون تخفيف مفرط، مناسبة للموظفين ورجال الأعمال.",
    descriptionEn: "Traditional scissor-over-comb architecture, clean neckline, gentle styling for executive gentlemen.",
    category: "hair",
    price: 25,
    durationMinutes: 35,
    image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=800&q=80",
    includesAr: ["قص وتحديد يدوي بالمقص", "تنظيف الرقبة بالموس", "غسيل وسيشوار خفيف"],
    includesEn: ["Hand scissor tapering", "Clean neck razor taper", "Light wash & dry"]
  },
  {
    id: "srv-beard-hot-towel",
    nameAr: "حلاقة ذقن كاملة ناعمة بالمناشف الساخنة",
    nameEn: "Traditional Hot Towel Straight Razor Shave",
    descriptionAr: "رغوة دافئة ناعمة، حلاقة بالموس شفرة جديدة باتجاه نمو الشعر، مناشف ساخنة وباردة لغلق المسام.",
    descriptionEn: "Warm lather, fresh surgical blade shave, alternating hot and cold essential towels to prevent irritation.",
    category: "beard",
    price: 20,
    durationMinutes: 30,
    image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80",
    includesAr: ["كريم ما قبل الحلاقة", "رغوة دافئة بالفرشاة", "حلاقة ملساء بدون حساسية", "بلسم بعد الحلاقة بالصبار"],
    includesEn: ["Pre-shave softening lotion", "Warm badger lather", "Zero-irritation shave", "Soothing aloe post-balm"]
  },
  {
    id: "srv-father-son",
    nameAr: "باقة الأب والابن (حلاقتين متجاورتين)",
    nameEn: "Father & Son Joint Session",
    descriptionAr: "حلاقة مشتركة في نفس الوقت للأب وابنه مع مشروب ضيافة ومعاملة خاصة للأطفال.",
    descriptionEn: "Side-by-side cuts for father and young boy, friendly approach and complimentary drinks.",
    category: "packages",
    price: 45,
    durationMinutes: 50,
    image: "https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=800&q=80",
    includesAr: ["قصة وتصفيف للأب", "قصة عصرية للابن", "ضيافة عصير وقهوة"],
    includesEn: ["Adult bespoke cut", "Junior styled haircut", "Refreshments included"]
  }
];

export const INITIAL_BARBERS: Barber[] = [
  {
    id: "barber-1",
    nameAr: "الأسطى مالك الزنتاني",
    nameEn: "Malek Al-Zintani",
    titleAr: "خبير التدرجات الحديثة والسكين فيد",
    titleEn: "Senior Skin Fade & Taper Specialist",
    experienceYears: 11,
    rating: 5.0,
    reviewCount: 0,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    specialtiesAr: ["تدرجة سكين فيد زيرو (Skin Fade)", "تايبر فيد نظيف", "تحديد شفرة دقيق بدون تحسس"],
    specialtiesEn: ["Razor-sharp skin fades", "Clean tapers", "Ultra-smooth edge work"],
    bioAr: "خبرة أكثر من 11 سنة في أشهر صالونات طرابلس، متمكن من التدرجات الصعبة وتصميم اللحية بدقة مليمترية.",
    bioEn: "Over 11 years in Tripoli's premier barbershops, known for flawless fade gradients and punctual service.",
    availableDays: [0, 1, 2, 3, 4, 6], // Off on Friday morning
    workHours: { start: "10:00", end: "22:30" },
    isActive: true
  },
  {
    id: "barber-2",
    nameAr: "الأسطى مهند الترهوني",
    nameEn: "Mohannad Al-Tarhouni",
    titleAr: "خبير نحت وتدريج اللحية وقصات الكلاسيك",
    titleEn: "Beard Artisan & Scissor Master",
    experienceYears: 9,
    rating: 5.0,
    reviewCount: 0,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    specialtiesAr: ["تدريج اللحية بالموس", "قص الشعر بالمقص", "علاجات تليين اللحية بالبخار"],
    specialtiesEn: ["Beard styling & graduation", "Classic scissor cut", "Herbal beard softening"],
    bioAr: "فنان في رسم اللحية وتنسيقها مع شكل الوجه، حريص على النظافة والتعقيم أمام الزبون دائماً.",
    bioEn: "Specializes in tailored beard geometry, meticulous scissor work, and client comfort.",
    availableDays: [1, 2, 3, 4, 5, 6], // Off on Sunday
    workHours: { start: "11:30", end: "23:00" },
    isActive: true
  },
  {
    id: "barber-3",
    nameAr: "الأسطى يوسف المغربي",
    nameEn: "Youssef Al-Maghrebi",
    titleAr: "أخصائي باقات العرسان وتنظيف البشرة",
    titleEn: "Groom Concierge & Facial Specialist",
    experienceYears: 13,
    rating: 5.0,
    reviewCount: 0,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    specialtiesAr: ["تجهيز العرسان الشامل", "تنظيف البشرة بالأوزون وماسك الفحم", "حلاقة الذقن الإيطالية بالمناشف الساخنة"],
    specialtiesEn: ["Full wedding groom suite", "Deep pore facials", "Traditional hot towel shaves"],
    bioAr: "اشتغل في تونس وطرابلس، اختصاصي في تجهيز العرسان وإعطاء مظهر متناسق وجذاب لأهم يوم في حياتك.",
    bioEn: "Extensive background across Tunis & Tripoli in luxury groom grooming and skin therapy.",
    availableDays: [0, 1, 2, 3, 5, 6], // Off on Thursday
    workHours: { start: "12:00", end: "23:30" },
    isActive: true
  },
  {
    id: "barber-4",
    nameAr: "الأسطى هيثم الورفلي",
    nameEn: "Haitham Al-Warfali",
    titleAr: "خبير القصات العصرية وتصفيف الشباب",
    titleEn: "Modern Trend & Texture Stylist",
    experienceYears: 7,
    rating: 5.0,
    reviewCount: 0,
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80",
    specialtiesAr: ["قصات التكستشر والكرو كات", "تدرجة لو فيد (Low Fade)", "سيشوار واستشوار للشعر"],
    specialtiesEn: ["Textured crops", "Low taper fades", "Blowout styling"],
    bioAr: "شاب مبدع يتابع أحدث صيحات الموضة العالمية، يقدم لمسات شبابية مميزة تناسب الشباب والطلبة.",
    bioEn: "Enthusiastic modern stylist focusing on crisp textural work and fast, clean fades.",
    availableDays: [0, 1, 2, 4, 5, 6], // Off on Wednesday
    workHours: { start: "10:00", end: "21:30" },
    isActive: true
  }
];

export const ADD_ON_OPTIONS: AddOnOption[] = [
  {
    id: "addon-towel",
    nameAr: "فوطة ساخنة مريحة بالأعشاب واللافندر",
    nameEn: "Hot Herbal Towel Comfort",
    descriptionAr: "فوطة قطنية ساخنة لتليين المسام وإراحة عضلات الرقبة والوجه.",
    descriptionEn: "Steamed hot towel infused with natural lavender and cedar.",
    price: 5,
    durationMinutes: 8,
    iconName: "Sparkles"
  },
  {
    id: "addon-mask-charcoal",
    nameAr: "ماسك الفحم الأسود للأنف والوجه",
    nameEn: "Black Charcoal Nose & T-Zone Peel",
    descriptionAr: "تنظيف سريع للرؤوس السوداء ليعطي مظهر نظيف وناعم.",
    descriptionEn: "Deep pore peel-off treatment for immediate clear texture.",
    price: 10,
    durationMinutes: 12,
    iconName: "ShieldCheck"
  },
  {
    id: "addon-scalp-massage",
    nameAr: "مساج فروة الرأس والرقبة (10 دقائق)",
    nameEn: "10-Min Scalp & Neck Acupressure",
    descriptionAr: "تدليك مريح يفك الشد العضلي بعد يوم عمل طويل.",
    descriptionEn: "Quick tension-release massage for neck and cranial points.",
    price: 10,
    durationMinutes: 10,
    iconName: "Flame"
  },
  {
    id: "addon-beard-steam",
    nameAr: "بخار أوزون لتليين اللحية مع زيت الأرغان",
    nameEn: "Beard Ozone Steam & Argan Oil Bath",
    descriptionAr: "تليين الشعر الخشن للذقن وترطيب الجلد تحته لمنع الحكة.",
    descriptionEn: "Deep follicle softening and skin hydration with pure argan oil.",
    price: 8,
    durationMinutes: 10,
    iconName: "Droplets"
  },
  {
    id: "addon-oud-finish",
    nameAr: "لمسة كولونيا ليمون إيطالية أصلية أو عطر فواح",
    nameEn: "Italian Lemon Splash & Fragrance Touch",
    descriptionAr: "تعقيم فوري منعش للشعر والرقبة برائحة تدوم.",
    descriptionEn: "Crisp antiseptic lemon splash and subtle gentleman fragrance finish.",
    price: 5,
    durationMinutes: 3,
    iconName: "Crown"
  }
];

export const INITIAL_GALLERY: GalleryItem[] = [
  {
    id: "gal-1",
    titleAr: "تدرجة سكين فيد زيرو مع تحديد شفرة حاد",
    titleEn: "Clean Low Skin Fade with Sharp Edge",
    category: "fade",
    imageUrl: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=800&q=80",
    barberName: "الأسطى مالك الزنتاني",
    likes: 0
  },
  {
    id: "gal-2",
    titleAr: "تحديد وتدريج لحية مع السوالف",
    titleEn: "Beard Fade with Sharp Cheek Line",
    category: "beard",
    imageUrl: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80",
    barberName: "الأسطى مهند الترهوني",
    likes: 0
  },
  {
    id: "gal-3",
    titleAr: "تجهيز عريس كامل في الصالة الخاصة",
    titleEn: "Groom Prep in Private Chair",
    category: "vip_groom",
    imageUrl: "https://images.unsplash.com/photo-1517832606589-7629c3395907?auto=format&fit=crop&w=800&q=80",
    barberName: "الأسطى يوسف المغربي",
    likes: 0
  },
  {
    id: "gal-4",
    titleAr: "قصة كلاسيك عادية بالمقص بدون ماكينة",
    titleEn: "Classic Pure Scissor Cut",
    category: "classic",
    imageUrl: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=800&q=80",
    barberName: "الأسطى مهند الترهوني",
    likes: 0
  },
  {
    id: "gal-5",
    titleAr: "تايبر فيد عصري مع شعر متوسط بالسيشوار",
    titleEn: "Modern Taper Fade & Natural Top",
    category: "fade",
    imageUrl: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=800&q=80",
    barberName: "الأسطى هيثم الورفلي",
    likes: 0
  },
  {
    id: "gal-6",
    titleAr: "حلاقة ذقن كاملة بالموس والمناشف الساخنة",
    titleEn: "Hot Towel Straight Razor Shave",
    category: "beard",
    imageUrl: "https://images.unsplash.com/photo-1512290900672-1f55b6a0b4b2?auto=format&fit=crop&w=800&q=80",
    barberName: "الأسطى مالك الزنتاني",
    likes: 0
  }
];

// Clean launch slate: Day 1 opening with zero previous reviews
export const INITIAL_REVIEWS: Review[] = [];

// Clean launch slate: Day 1 opening with zero registered clients
export const INITIAL_CLIENTS: ClientProfile[] = [];

// Clean launch slate: Day 1 opening with zero bookings
export const INITIAL_BOOKINGS: Booking[] = [];

export const AVAILABLE_TIME_SLOTS = [
  "10:00", "10:45", "11:30", "12:15",
  "14:30", "15:15", "16:00", "16:45", "17:30", "18:15",
  "19:00", "19:45", "20:30", "21:15", "22:00"
];
