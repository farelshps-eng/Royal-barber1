import React, { useState, useEffect, useMemo } from 'react';
import { useSalon } from '../context/SalonContext';
import { 
  FadeLevel, 
  BeardStyle, 
  CustomOptions, 
  Booking,
  ServiceCategory
} from '../types';
import { ADD_ON_OPTIONS, AVAILABLE_TIME_SLOTS } from '../data/mockData';
import { sendBookingConfirmationEmail, isEmailConfigured } from '../utils/emailService';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Shield,
  User, 
  Phone, 
  Mail, 
  AlertCircle,
  MessageCircle,
  MapPin,
  Download,
  Printer,
  CalendarCheck,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Flame,
  Coffee
} from 'lucide-react';

export const BookingView: React.FC = () => {
  const { 
    lang, 
    t, 
    services, 
    barbers, 
    bookings,
    addBooking, 
    checkSlotConflict, 
    preselectedServiceId, 
    setPreselectedServiceId,
    preselectedBarberId,
    setPreselectedBarberId,
    salonInfo,
    setCurrentPage,
    showToast
  } = useSalon();

  // Multi-step state: 1: Service, 2: Customization, 3: Barber, 4: Date/Time, 5: Client Info, 6: Summary, 7: Success
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  // Step 1: Selected Service
  const [selectedServiceId, setSelectedServiceId] = useState<string>(() => {
    return preselectedServiceId || services[0]?.id || '';
  });
  const [serviceCategoryFilter, setServiceCategoryFilter] = useState<ServiceCategory | 'all'>('all');

  // Step 2: Customization (Libyan authentic options)
  const [customOptions, setCustomOptions] = useState<CustomOptions>({
    fadeLevel: 'skin_fade',
    beardStyle: 'sharp_lineup',
    hairWashIncluded: true,
    selectedAddOns: [],
    beverageChoice: 'libyan_coffee',
    fragranceFinish: 'lemon_splash'
  });

  // Step 3: Barber
  const [selectedBarberId, setSelectedBarberId] = useState<string>(() => {
    return preselectedBarberId || 'any';
  });

  // Step 4: Date & Time
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');

  // Step 5: Client Info
  const [clientName, setClientName] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [clientEmail, setClientEmail] = useState<string>('');
  const [confirmationMethod, setConfirmationMethod] = useState<'whatsapp' | 'email' | 'both'>('whatsapp');
  const [emailSentAlert, setEmailSentAlert] = useState<boolean>(false);
  const [emailSending, setEmailSending] = useState<boolean>(false);
  const [emailSendError, setEmailSendError] = useState<string | null>(null);
  const [vipNotes, setVipNotes] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'pay_at_salon' | 'online_deposit'>('pay_at_salon');
  const [validationError, setValidationError] = useState<string | null>(null);

  // Sync pre-selections if set externally
  useEffect(() => {
    if (preselectedServiceId) {
      setSelectedServiceId(preselectedServiceId);
    }
  }, [preselectedServiceId]);

  useEffect(() => {
    if (preselectedBarberId) {
      setSelectedBarberId(preselectedBarberId);
    }
  }, [preselectedBarberId]);

  // Selected objects
  const selectedService = services.find((s) => s.id === selectedServiceId) || services[0];
  const selectedBarber = barbers.find((b) => b.id === selectedBarberId);

  // Real-time Calculation: Price & Duration
  const { totalPrice, totalDuration } = useMemo(() => {
    let price = selectedService ? selectedService.price : 25;
    let duration = selectedService ? selectedService.durationMinutes : 35;

    // Add selected add-ons
    customOptions.selectedAddOns.forEach((addonId) => {
      const opt = ADD_ON_OPTIONS.find((a) => a.id === addonId);
      if (opt) {
        price += opt.price;
        duration += opt.durationMinutes;
      }
    });

    return { totalPrice: price, totalDuration: duration };
  }, [selectedService, customOptions.selectedAddOns]);

  // Available dates (Next 14 days) with smart booking counters
  const availableDates = useMemo(() => {
    const dates = [];
    const base = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      const iso = d.toISOString().split('T')[0];
      const dayNameAr = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'][d.getDay()];
      const dayNameEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()];
      const monthAr = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'][d.getMonth()];
      const monthEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d.getMonth()];
      
      // Calculate how many bookings exist on this date for current selected barber or all
      const dayBookings = bookings.filter((b) => {
        if (b.status === 'cancelled') return false;
        if (b.date !== iso) return false;
        if (selectedBarberId && selectedBarberId !== 'any') {
          return b.barberId === selectedBarberId;
        }
        return true;
      });

      const totalSlots = AVAILABLE_TIME_SLOTS.length;
      const bookedCount = dayBookings.length;
      const isFullyBooked = bookedCount >= totalSlots;
      const isPartiallyBusy = bookedCount > 0;
      const isCompletelyFree = bookedCount === 0;

      dates.push({
        iso,
        dayNum: d.getDate(),
        dayName: lang === 'ar' ? dayNameAr : dayNameEn,
        monthName: lang === 'ar' ? monthAr : monthEn,
        dayOfWeek: d.getDay(),
        bookedCount,
        isFullyBooked,
        isPartiallyBusy,
        isCompletelyFree
      });
    }
    return dates;
  }, [lang, bookings, selectedBarberId]);

  // Current day statistics
  const currentDayStats = useMemo(() => {
    return availableDates.find((d) => d.iso === selectedDate) || availableDates[0];
  }, [availableDates, selectedDate]);

  // Suggested completely free dates
  const suggestedFreeDays = useMemo(() => {
    return availableDates.filter((d) => d.isCompletelyFree).slice(0, 4);
  }, [availableDates]);

  // Find all free slots for the currently selected date & barber
  const freeSlotsForCurrentDay = useMemo(() => {
    return AVAILABLE_TIME_SLOTS.filter((slot) => !checkSlotConflict(selectedBarberId, selectedDate, slot));
  }, [selectedBarberId, selectedDate, checkSlotConflict, bookings]);

  // Automatically suggest closest open slot if selected is busy
  const closestOpenSlot = useMemo(() => {
    return freeSlotsForCurrentDay[0] || null;
  }, [freeSlotsForCurrentDay]);

  // Handle Addon Toggle
  const toggleAddon = (addonId: string) => {
    setCustomOptions((prev) => {
      const exists = prev.selectedAddOns.includes(addonId);
      return {
        ...prev,
        selectedAddOns: exists
          ? prev.selectedAddOns.filter((id) => id !== addonId)
          : [...prev.selectedAddOns, addonId]
      };
    });
  };

  // Step Validation & Navigation
  const handleNextStep = () => {
    setValidationError(null);

    if (currentStep === 1) {
      if (!selectedServiceId) {
        setValidationError(lang === 'ar' ? 'يرجى اختيار الخدمة للمتابعة' : 'Please select a service');
        return;
      }
    } else if (currentStep === 4) {
      if (!selectedDate || !selectedTimeSlot) {
        setValidationError(lang === 'ar' ? 'يرجى اختيار التاريخ والوقت المناسب لحجزك' : 'Please choose both date and time slot');
        return;
      }
      // Check conflict
      if (checkSlotConflict(selectedBarberId, selectedDate, selectedTimeSlot)) {
        setValidationError(t.conflictWarning);
        return;
      }
    } else if (currentStep === 5) {
      if (!clientName.trim() || clientName.trim().length < 3) {
        setValidationError(t.nameValidation);
        return;
      }
      const cleanPhone = clientPhone.replace(/\s+/g, '');
      if (!cleanPhone || cleanPhone.length < 8) {
        setValidationError(t.phoneValidation);
        return;
      }
      if ((confirmationMethod === 'email' || confirmationMethod === 'both') && !clientEmail.trim()) {
        setValidationError(lang === 'ar' ? 'يرجى إدخال البريد الإلكتروني لاستلام وصل وتأكيد الحجز' : 'Please provide your email to receive confirmation');
        return;
      }
    }

    setCurrentStep((prev) => Math.min(prev + 1, 6));
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  const handlePrevStep = () => {
    setValidationError(null);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  // Step 6: Confirmation Submission
  const handleConfirmBooking = async () => {
    // Conflict check
    if (checkSlotConflict(selectedBarberId, selectedDate, selectedTimeSlot)) {
      setValidationError(t.conflictWarning);
      setCurrentStep(4);
      return;
    }

    setIsSubmitting(true);
    setEmailSentAlert(false);
    setEmailSendError(null);

    await new Promise<void>((resolve) => setTimeout(resolve, 700));

    const addOnObjs = customOptions.selectedAddOns.map((id) => {
      const item = ADD_ON_OPTIONS.find((a) => a.id === id)!;
      return {
        id: item.id,
        nameAr: item.nameAr,
        nameEn: item.nameEn,
        price: item.price
      };
    });

    const newBooking = addBooking({
      customerName: clientName.trim(),
      customerPhone: clientPhone.trim(),
      customerEmail: clientEmail.trim() || undefined,
      confirmationMethod,
      serviceId: selectedService.id,
      serviceNameAr: selectedService.nameAr,
      serviceNameEn: selectedService.nameEn,
      barberId: selectedBarber ? selectedBarber.id : 'any',
      barberNameAr: selectedBarber ? selectedBarber.nameAr : (lang === 'ar' ? 'أي حلاق متاح أولاً' : 'First Available Barber'),
      barberNameEn: selectedBarber ? selectedBarber.nameEn : 'First Available Barber',
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      customOptions,
      addOnDetails: addOnObjs,
      totalPrice,
      totalDurationMinutes: totalDuration,
      status: 'confirmed',
      vipNotes: vipNotes.trim() || undefined,
      paymentMethod
    });

    setConfirmedBooking(newBooking);
    setIsSubmitting(false);
    setCurrentStep(7); // Success Step!
    showToast(t.bookingSuccessful);
    window.scrollTo({ top: 40, behavior: 'smooth' });

    // ─── إرسال إيميل التأكيد تلقائياً ────────────────────────────────────
    const shouldSendEmail =
      newBooking.customerEmail &&
      (confirmationMethod === 'email' || confirmationMethod === 'both');

    if (shouldSendEmail && isEmailConfigured()) {
      setEmailSending(true);
      const result = await sendBookingConfirmationEmail(newBooking, lang);
      setEmailSending(false);
      if (result.success) {
        setEmailSentAlert(true);
        showToast(
          lang === 'ar'
            ? `✉️ تم إرسال تأكيد الحجز إلى ${newBooking.customerEmail}`
            : `✉️ Confirmation email sent to ${newBooking.customerEmail}`
        );
      } else {
        setEmailSendError(result.error || 'unknown');
      }
    }
  };

  const handleResetForAnother = () => {
    setPreselectedServiceId(null);
    setPreselectedBarberId(null);
    setConfirmedBooking(null);
    setSelectedTimeSlot('');
    setVipNotes('');
    setCurrentStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const downloadIcsFile = () => {
    if (!confirmedBooking) return;
    const startIso = `${confirmedBooking.date.replace(/-/g, '')}T${confirmedBooking.timeSlot.replace(':', '')}00`;
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//ROYAL BARBER LIBYA//Appointment//AR
BEGIN:VEVENT
SUMMARY:ROYAL BARBER Appointment (${confirmedBooking.serviceNameEn})
DESCRIPTION:Appointment at ROYAL BARBER Tripoli. Ref: ${confirmedBooking.referenceNumber}. Barber: ${confirmedBooking.barberNameEn}. Address: ${salonInfo.addressEn}
LOCATION:${salonInfo.addressEn}
DTSTART:${startIso}
DURATION:PT${confirmedBooking.totalDurationMinutes}M
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `royal_barber_${confirmedBooking.referenceNumber}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openWhatsAppConfirmation = () => {
    if (!confirmedBooking) return;
    const textAr = `✂️ *تأكيد حجز صالون رويال - طرابلس*
━━━━━━━━━━━━━━━━━━━━
رقم الحجز: *${confirmedBooking.referenceNumber}*
الاسم: ${confirmedBooking.customerName}
رقم الهاتف: ${confirmedBooking.customerPhone}
الخدمة: ${confirmedBooking.serviceNameAr}
الحلاق: ${confirmedBooking.barberNameAr}
التاريخ: ${confirmedBooking.date}
الوقت: ${confirmedBooking.timeSlot}
المدة المقدرة: ${confirmedBooking.totalDurationMinutes} دقيقة
المبلغ الإجمالي: *${confirmedBooking.totalPrice} د.ل*
طريقة الدفع: ${confirmedBooking.paymentMethod === 'pay_at_salon' ? 'كاش في الصالون' : 'سداد / تداول'}
الموقع: ${salonInfo.addressAr}
━━━━━━━━━━━━━━━━━━━━
نشكرك على ثقتك، وكرسيك في انتظارك بدون أي تأخير!`;

    const textEn = `✂️ *ROYAL BARBER Booking Confirmation*
━━━━━━━━━━━━━━━━━━━━
Ref: *${confirmedBooking.referenceNumber}*
Client: ${confirmedBooking.customerName}
Phone: ${confirmedBooking.customerPhone}
Service: ${confirmedBooking.serviceNameEn}
Barber: ${confirmedBooking.barberNameEn}
Date: ${confirmedBooking.date} at ${confirmedBooking.timeSlot}
Duration: ${confirmedBooking.totalDurationMinutes} mins
Total Due: *${confirmedBooking.totalPrice} LYD*
Payment: Pay at salon
Location: ${salonInfo.addressEn}
━━━━━━━━━━━━━━━━━━━━
Thank you for booking with us!`;

    const msg = lang === 'ar' ? textAr : textEn;
    const cleanPhone = salonInfo.whatsappNumber.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const openEmailConfirmation = async () => {
    if (!confirmedBooking) return;

    // إذا كان EmailJS مُهيَّأ → أرسل مباشرة
    if (isEmailConfigured() && confirmedBooking.customerEmail) {
      setEmailSending(true);
      setEmailSendError(null);
      const result = await sendBookingConfirmationEmail(confirmedBooking, lang);
      setEmailSending(false);
      if (result.success) {
        setEmailSentAlert(true);
        showToast(
          lang === 'ar'
            ? `✉️ تم إرسال تأكيد الحجز إلى ${confirmedBooking.customerEmail}`
            : `✉️ Confirmation email sent to ${confirmedBooking.customerEmail}`
        );
      } else {
        setEmailSendError(result.error || 'unknown');
        // fallback → mailto
        _openMailtoFallback(confirmedBooking);
      }
      return;
    }

    // Fallback: mailto (when EmailJS not configured or no email)
    _openMailtoFallback(confirmedBooking);
  };

  const _openMailtoFallback = (booking: Booking) => {
    const subject = encodeURIComponent(
      lang === 'ar'
        ? `تأكيد حجز صالون رويال طرابلس - رقم الحجز ${booking.referenceNumber}`
        : `ROYAL BARBER Tripoli - Booking Confirmation ${booking.referenceNumber}`
    );
    const body = encodeURIComponent(
      lang === 'ar'
        ? `مرحباً ${booking.customerName}،\n\nتم تأكيد حجز موعدك بنجاح في صالون رويال.\n\n• رقم الحجز: ${booking.referenceNumber}\n• الخدمة: ${booking.serviceNameAr}\n• الحلاق: ${booking.barberNameAr}\n• التاريخ: ${booking.date}\n• الوقت: ${booking.timeSlot} (${booking.totalDurationMinutes} دقيقة)\n• الإجمالي: ${booking.totalPrice} د.ل\n• الموقع: ${salonInfo.addressAr}\n\nيسعدنا استقبالك في الوقت المحدد بدون أي انتظار!`
        : `Dear ${booking.customerName},\n\nYour appointment at ROYAL BARBER Tripoli has been confirmed:\n\n• Ref: ${booking.referenceNumber}\n• Service: ${booking.serviceNameEn}\n• Barber: ${booking.barberNameEn}\n• Date: ${booking.date} at ${booking.timeSlot} (${booking.totalDurationMinutes} mins)\n• Total: ${booking.totalPrice} LYD\n• Location: ${salonInfo.addressEn}\n\nWe look forward to serving you!`
    );
    setEmailSentAlert(true);
    showToast(
      lang === 'ar'
        ? `تم تجهيز الإيميل (${booking.customerEmail || 'البريد المسجل'})`
        : 'Email client opened'
    );
    const targetEmail = booking.customerEmail || '';
    window.location.href = `mailto:${targetEmail}?subject=${subject}&body=${body}`;
  };

  const stepsList = [
    { num: 1, label: t.selectService },
    { num: 2, label: t.customizeStyle },
    { num: 3, label: t.selectBarber },
    { num: 4, label: t.selectDateTime },
    { num: 5, label: t.clientInfo },
    { num: 6, label: t.reviewSummary }
  ];

  const ArrowNext = lang === 'ar' ? ArrowLeft : ArrowRight;
  const ArrowPrev = lang === 'ar' ? ArrowRight : ArrowLeft;

  // ==========================================
  // RENDER STEP 7: SUCCESS
  // ==========================================
  if (currentStep === 7 && confirmedBooking) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 animate-in fade-in duration-300">
        <div className="rounded-2xl bg-gradient-to-b from-[#141822] to-[#0e1016] border border-[#d4af37]/60 p-6 sm:p-10 shadow-2xl relative text-center space-y-6">
          
          <div className="w-16 h-16 rounded-full bg-[#1b202c] border-2 border-[#d4af37] text-[#d4af37] mx-auto flex items-center justify-center shadow-lg shadow-[#d4af37]/20">
            <CheckCircle className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
              {lang === 'ar' ? 'تم الحجز بنجاح' : 'Booking Confirmed'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              {t.bookingSuccessful}
            </h1>
            <p className="text-xs sm:text-sm text-[#9ca3af]">
              {lang === 'ar'
                ? `مرحباً بك يا ${confirmedBooking.customerName}، تم تثبيت موعدك وسيكون كرسيك جاهزاً في الوقت بدون انتظار.`
                : `Welcome ${confirmedBooking.customerName}. Your chair is reserved with zero wait.`}
            </p>
          </div>

          {/* Reference Badge */}
          <div className="inline-flex flex-col items-center px-6 py-2.5 rounded-xl bg-[#0b0c10] border border-[#2a2e3b]">
            <span className="text-[10px] text-[#8e95a5] uppercase tracking-widest">{t.bookingRef}</span>
            <span className="font-mono text-2xl font-bold text-[#d4af37] tracking-wider">
              {confirmedBooking.referenceNumber}
            </span>
          </div>

          {/* Booking Summary Box */}
          <div className="p-5 rounded-xl bg-[#0f1118]/90 border border-[#222530] text-xs text-start space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-3 border-b border-[#1c202a]">
              <div>
                <span className="text-[#7d8697] block">{lang === 'ar' ? 'الخدمة:' : 'Service:'}</span>
                <span className="font-bold text-white text-sm">
                  {lang === 'ar' ? confirmedBooking.serviceNameAr : confirmedBooking.serviceNameEn}
                </span>
              </div>
              <div>
                <span className="text-[#7d8697] block">{lang === 'ar' ? 'الحلاق:' : 'Barber:'}</span>
                <span className="font-bold text-white text-sm">
                  {lang === 'ar' ? confirmedBooking.barberNameAr : confirmedBooking.barberNameEn}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-3 border-b border-[#1c202a]">
              <div>
                <span className="text-[#7d8697] block">{lang === 'ar' ? 'تاريخ الموعد:' : 'Date:'}</span>
                <span className="font-semibold text-white font-mono">{confirmedBooking.date}</span>
              </div>
              <div>
                <span className="text-[#7d8697] block">{lang === 'ar' ? 'التوقيت والمدة:' : 'Time & Duration:'}</span>
                <span className="font-semibold text-white font-mono">
                  {confirmedBooking.timeSlot} ({confirmedBooking.totalDurationMinutes} {t.mins})
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div>
                <span className="text-[#7d8697] block">{lang === 'ar' ? 'طريقة الدفع:' : 'Payment:'}</span>
                <span className="text-white">
                  {lang === 'ar' ? 'الدفع في الصالون (كاش أو تداول / سداد)' : 'Pay at salon'}
                </span>
              </div>
              <div className="text-end">
                <span className="text-[#7d8697] block">{t.totalDue}:</span>
                <span className="font-mono text-lg font-bold text-[#d4af37]">
                  {confirmedBooking.totalPrice} {t.currency}
                </span>
              </div>
            </div>
          </div>

          {/* Dedicated Instant Confirmation Receipts: WhatsApp or Email as requested */}
          <div className="p-4 rounded-xl bg-[#0b0d13] border border-[#262a38] text-start space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#d4af37]" />
                <span>{lang === 'ar' ? 'استلام تأكيد ووصل الحجز فوراً:' : 'Receive Immediate Booking Receipt:'}</span>
              </span>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30 font-semibold">
                {lang === 'ar' ? 'جاهز الآن' : 'Ready'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* WhatsApp Receipt Button */}
              <button
                type="button"
                onClick={openWhatsAppConfirmation}
                className="p-3 rounded-xl bg-[#122419] hover:bg-[#183122] border-2 border-[#25D366] text-white text-xs font-semibold flex items-center justify-between transition-all group shadow-md shadow-[#25D366]/20"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#25D366]/20 flex items-center justify-center text-[#25D366]">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <div className="text-start">
                    <span className="block font-bold text-emerald-300">
                      {lang === 'ar' ? 'إرسال تأكيد بالواتساب' : 'WhatsApp Receipt'}
                    </span>
                    <span className="text-[10px] text-[#9ca3af]">
                      {lang === 'ar' ? 'يفتح محادثة بالوصل وتفاصيل الموعد' : 'Direct message with full details'}
                    </span>
                  </div>
                </div>
                <span className="text-sm">📲</span>
              </button>

              {/* Email Receipt Button */}
              <button
                type="button"
                onClick={openEmailConfirmation}
                className="p-3 rounded-xl bg-[#0f2233] hover:bg-[#152e45] border-2 border-[#38bdf8] text-white text-xs font-semibold flex items-center justify-between transition-all group shadow-md shadow-[#38bdf8]/20"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#38bdf8]/20 flex items-center justify-center text-[#38bdf8]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="text-start">
                    <span className="block font-bold text-sky-300">
                      {lang === 'ar' ? 'إرسال تأكيد بالإيميل' : 'Email Receipt'}
                    </span>
                    <span className="text-[10px] text-[#9ca3af]">
                      {confirmedBooking.customerEmail 
                        ? confirmedBooking.customerEmail 
                        : (lang === 'ar' ? 'إرسال إشعار رسمي لبريدك' : 'Send to your email')}
                    </span>
                  </div>
                </div>
                <span className="text-sm">✉️</span>
              </button>
            </div>

            {/* Email Sending Spinner */}
            {emailSending && (
              <div className="p-2.5 rounded-lg bg-sky-500/10 border border-sky-500/30 text-[11px] text-sky-400 flex items-center gap-2">
                <span className="w-4 h-4 shrink-0 inline-block border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
                <span>
                  {lang === 'ar' ? 'جاري إرسال إيميل التأكيد...' : 'Sending confirmation email...'}
                </span>
              </div>
            )}

            {/* Email Sent Success */}
            {emailSentAlert && !emailSending && (
              <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-[11px] text-emerald-400 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>
                  {lang === 'ar'
                    ? `✅ تم إرسال إيميل التأكيد بنجاح إلى: ${confirmedBooking.customerEmail || 'البريد المسجل'}`
                    : `✅ Confirmation email sent to: ${confirmedBooking.customerEmail || 'registered email'}`}
                </span>
              </div>
            )}

            {/* Email Send Error */}
            {emailSendError && !emailSending && (
              <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-[11px] text-rose-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>
                  {lang === 'ar'
                    ? `تعذّر إرسال الإيميل تلقائياً – تحقق من إعدادات EmailJS في ملف .env`
                    : `Auto-send failed – check EmailJS config in .env (${emailSendError})`}
                </span>
              </div>
            )}

          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              onClick={downloadIcsFile}
              className="py-2.5 px-3 rounded-lg bg-[#181b24] hover:bg-[#202430] text-white border border-[#2b2f3d] text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <Download className="w-4 h-4 text-[#d4af37]" />
              <span>{t.addToCalendar}</span>
            </button>

            <a
              href={salonInfo.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-3 rounded-lg bg-[#181b24] hover:bg-[#202430] text-white border border-[#2b2f3d] text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <MapPin className="w-4 h-4 text-[#d4af37]" />
              <span>{t.getDirections}</span>
            </a>
          </div>

          <div className="pt-4 border-t border-[#1d2029] flex items-center justify-between text-xs text-[#8e95a5]">
            <button onClick={() => window.print()} className="hover:text-white flex items-center gap-1.5">
              <Printer className="w-4 h-4" />
              <span>{lang === 'ar' ? 'طباعة الوصل' : 'Print'}</span>
            </button>
            <button
              onClick={handleResetForAnother}
              className="px-4 py-2 rounded-lg bg-gold-gradient text-black font-bold hover:brightness-110"
            >
              {t.bookAnother}
            </button>
          </div>

        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER MULTI-STEP FUNNEL (STEPS 1 - 6)
  // ==========================================
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Page Title */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">
          {t.bookNow}
        </h1>
        <p className="text-xs sm:text-sm text-[#9ca3af]">
          {lang === 'ar'
            ? 'احجز موعدك مسبقاً وتفادى الزحمة والانتظار في صالون رويال بطرابلس.'
            : 'Book in advance for guaranteed chair seating with zero waiting time.'}
        </p>
      </div>

      {/* Real-time Sticky Top Bar */}
      <div className="sticky top-20 z-30 p-3.5 rounded-xl bg-[#11131a]/95 border border-[#2b2f3e] backdrop-blur-md shadow-xl flex flex-wrap items-center justify-between gap-3">
        {/* Step Progress indicators */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-0.5">
          {stepsList.map((st) => (
            <div
              key={st.num}
              className={`flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-md transition-all ${
                currentStep === st.num
                  ? 'bg-[#d4af37] text-[#0b0c10]'
                  : currentStep > st.num
                  ? 'bg-[#1a1e28] text-white'
                  : 'text-[#616879]'
              }`}
            >
              <span className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] border border-current">
                {currentStep > st.num ? '✓' : st.num}
              </span>
              <span className="hidden sm:inline-block whitespace-nowrap">{st.label}</span>
            </div>
          ))}
        </div>

        {/* Live Counters */}
        <div className="flex items-center gap-3 ms-auto text-xs">
          <div className="flex items-center gap-1 text-[#9ca3af]">
            <Clock className="w-3.5 h-3.5 text-[#d4af37]" />
            <span className="font-mono text-white font-bold">{totalDuration}</span>
            <span>{t.mins}</span>
          </div>

          <div className="flex items-center gap-1 text-[#d4af37]">
            <span className="text-[11px] text-[#8e95a5]">{t.totalDue}:</span>
            <span className="font-mono text-sm sm:text-base font-bold text-white">
              {totalPrice} {t.currency}
            </span>
          </div>
        </div>
      </div>

      {/* Validation Alert */}
      {validationError && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs sm:text-sm flex items-center gap-2.5 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Step Card Body */}
      <div className="rounded-2xl bg-[#0f1117] border border-[#20232c] p-5 sm:p-7 shadow-xl min-h-[400px]">
        
        {/* ==================================== */}
        {/* STEP 1: SERVICE SELECTION */}
        {/* ==================================== */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-lg sm:text-xl font-bold text-white">
                {lang === 'ar' ? '1. اختر الخدمة المطلوبة' : '1. Select Service'}
              </h2>
              <p className="text-xs text-[#8e95a5]">
                {lang === 'ar' ? 'حدد الخدمة أو الباقة التي تناسبك اليوم.' : 'Choose the haircut or package you need.'}
              </p>
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1.5 no-scrollbar">
              {[
                { id: 'all', label: t.all },
                { id: 'hair', label: t.hair },
                { id: 'beard', label: t.beard },
                { id: 'packages', label: t.packages },
                { id: 'vip', label: t.vip },
                { id: 'treatments', label: t.treatments }
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setServiceCategoryFilter(c.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                    serviceCategoryFilter === c.id
                      ? 'bg-[#d4af37] text-[#0b0c10] font-bold'
                      : 'bg-[#151820] text-[#9ca3af] hover:text-white border border-[#232732]'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {services
                .filter((s) => serviceCategoryFilter === 'all' || s.category === serviceCategoryFilter)
                .map((srv) => {
                  const isSelected = selectedServiceId === srv.id;
                  return (
                    <div
                      key={srv.id}
                      onClick={() => setSelectedServiceId(srv.id)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex gap-3.5 items-center ${
                        isSelected
                          ? 'bg-[#181c26] border-[#d4af37] shadow-md shadow-[#d4af37]/10'
                          : 'bg-[#12141b] border-[#222530] hover:border-[#383e50]'
                      }`}
                    >
                      <div className="relative w-18 h-18 rounded-lg overflow-hidden shrink-0">
                        <img src={srv.image} alt={srv.nameAr} className="w-full h-full object-cover" />
                      </div>

                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-bold text-white">
                            {lang === 'ar' ? srv.nameAr : srv.nameEn}
                          </h3>
                          <span className="text-sm font-bold text-[#d4af37] font-mono whitespace-nowrap ms-2">
                            {srv.price} {t.currency}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#8e95a5] line-clamp-2">
                          {lang === 'ar' ? srv.descriptionAr : srv.descriptionEn}
                        </p>
                        <div className="flex items-center gap-2 pt-0.5 text-[11px] text-[#9ca3af]">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-[#d4af37]" />
                            <span>{srv.durationMinutes} {t.mins}</span>
                          </span>
                        </div>
                      </div>

                      <div className="shrink-0">
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          isSelected ? 'border-[#d4af37] bg-[#d4af37] text-black' : 'border-[#3a3f50]'
                        }`}>
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* ==================================== */}
        {/* STEP 2: LIBYAN CUT & BEARD STYLES */}
        {/* ==================================== */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-lg sm:text-xl font-bold text-white">
                {lang === 'ar' ? '2. تحديد نوع القصة واللحية والإضافات' : '2. Cut & Beard Style Details'}
              </h2>
              <p className="text-xs text-[#8e95a5]">
                {lang === 'ar' ? 'اختر أسلوب التدريج وشكل اللحية المفضل لديك.' : 'Choose your fade type and beard finish.'}
              </p>
            </div>

            {/* Fade Options */}
            <div className="space-y-2.5">
              <label className="text-xs font-semibold text-[#d4af37] uppercase tracking-wider block">
                {t.selectSides}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {[
                  { id: 'skin_fade', title: t.fadeSkin, desc: lang === 'ar' ? 'تدرجة نظيفة من الزيرو مع الشفرة' : 'Clean zero skin fade' },
                  { id: 'taper_fade', title: t.fadeTaper, desc: lang === 'ar' ? 'تخفيف وتدريج السوالف والرقبة فقط' : 'Temple and neckline blend' },
                  { id: 'mid_fade', title: t.fadeMid, desc: lang === 'ar' ? 'تدرجة متوسطة متناسقة وأنيقة' : 'Balanced versatile mid fade' },
                  { id: 'low_fade', title: t.fadeLow, desc: lang === 'ar' ? 'تدرجة منخفضة هادئة' : 'Subtle low fade' },
                  { id: 'classic_scissor', title: t.fadeClassic, desc: lang === 'ar' ? 'حلاقة عادية بالمشط والمقص بدون زيرو' : 'Scissor comb traditional cut' },
                  { id: 'buzz_cut', title: t.fadeBuzz, desc: lang === 'ar' ? 'تقصير متساوٍ بالماكينة نمرة واحدة' : 'Uniform clipper cut' }
                ].map((item) => {
                  const isSelected = customOptions.fadeLevel === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setCustomOptions(prev => ({ ...prev, fadeLevel: item.id as FadeLevel }))}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-[#181b24] border-[#d4af37] text-white shadow'
                          : 'bg-[#12141a] border-[#222530] text-[#9ca3af] hover:border-[#383d4e]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-white">{item.title}</span>
                        {isSelected && <span className="w-2 h-2 rounded-full bg-[#d4af37]"></span>}
                      </div>
                      <p className="text-[11px] text-[#7a8394]">{item.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Beard Options */}
            <div className="space-y-2.5">
              <label className="text-xs font-semibold text-[#d4af37] uppercase tracking-wider block">
                {t.selectBeard}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {[
                  { id: 'sharp_lineup', title: t.beardSharp, desc: lang === 'ar' ? 'تحديدة نظيفة بالموس والشفرة' : 'Crisp razor edge line' },
                  { id: 'beard_fade', title: t.beardFade, desc: lang === 'ar' ? 'تدريج خفيف للحية مع السوالف' : 'Gradual taper with sideburns' },
                  { id: 'full_sculpt', title: t.beardFull, desc: lang === 'ar' ? 'تسوية وتقصير لحية كاملة' : 'Complete shape & trim' },
                  { id: 'steam_trim', title: t.beardSteam, desc: lang === 'ar' ? 'جلسة بخار لتليين شعر اللحية وزيت' : 'Ozone steam & softening oil' },
                  { id: 'hot_shave', title: t.beardHotShave, desc: lang === 'ar' ? 'حلاقة ذقن كاملة ناعمة بالمناشف' : 'Hot towel clean shave' },
                  { id: 'none', title: t.beardNone, desc: lang === 'ar' ? 'حلاقة شعر الرأس فقط بدون لحية' : 'Head cut only' }
                ].map((item) => {
                  const isSelected = customOptions.beardStyle === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setCustomOptions(prev => ({ ...prev, beardStyle: item.id as BeardStyle }))}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-[#181b24] border-[#d4af37] text-white shadow'
                          : 'bg-[#12141a] border-[#222530] text-[#9ca3af] hover:border-[#383d4e]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-white">{item.title}</span>
                        {isSelected && <span className="w-2 h-2 rounded-full bg-[#d4af37]"></span>}
                      </div>
                      <p className="text-[11px] text-[#7a8394]">{item.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Add-ons */}
            <div className="space-y-2.5 pt-1">
              <label className="text-xs font-semibold text-[#d4af37] uppercase tracking-wider block">
                {t.luxuryAddons}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {ADD_ON_OPTIONS.map((addon) => {
                  const isChecked = customOptions.selectedAddOns.includes(addon.id);
                  return (
                    <div
                      key={addon.id}
                      onClick={() => toggleAddon(addon.id)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                        isChecked
                          ? 'bg-[#191d29] border-[#d4af37]'
                          : 'bg-[#12141b] border-[#222530] hover:border-[#353a49]'
                      }`}
                    >
                      <div>
                        <span className="text-xs font-bold text-white block">
                          {lang === 'ar' ? addon.nameAr : addon.nameEn}
                        </span>
                        <span className="text-[11px] text-[#7d8697]">
                          +{addon.durationMinutes} {t.mins}
                        </span>
                      </div>
                      <div className="text-end shrink-0 flex items-center gap-2">
                        <span className="text-xs font-bold text-[#d4af37] font-mono">
                          +{addon.price} {t.currency}
                        </span>
                        <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                          isChecked ? 'bg-[#d4af37] border-[#d4af37] text-black' : 'border-[#3a3f50]'
                        }`}>
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Libyan Hospitality drink */}
            <div className="p-3.5 rounded-xl bg-[#141620] border border-[#262a38] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Coffee className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>{t.beverageSelection}</span>
                </span>
                <span className="text-[10px] text-emerald-400 font-medium">
                  {t.freeHospitality}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                {[
                  { id: 'libyan_coffee', label: t.libyanCoffee },
                  { id: 'libyan_tea', label: t.libyanTea },
                  { id: 'cappuccino', label: t.cappuccino },
                  { id: 'mineral_water', label: t.mineralWater }
                ].map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setCustomOptions(prev => ({ ...prev, beverageChoice: b.id }))}
                    className={`p-2 rounded-lg border text-center transition-colors ${
                      customOptions.beverageChoice === b.id
                        ? 'border-[#d4af37] bg-[#1a1e28] text-white font-medium'
                        : 'border-[#252834] text-[#9ca3af] hover:text-white'
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ==================================== */}
        {/* STEP 3: MASTER BARBER SELECTION */}
        {/* ==================================== */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-lg sm:text-xl font-bold text-white">
                {lang === 'ar' ? '3. اختر الحلاق' : '3. Select Barber'}
              </h2>
              <p className="text-xs text-[#8e95a5]">
                {lang === 'ar' ? 'اختر حلاقك المعتاد أو اختر الخيار الأسرع.' : 'Choose your barber or pick first available.'}
              </p>
            </div>

            {/* Any Barber */}
            <div
              onClick={() => setSelectedBarberId('any')}
              className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                selectedBarberId === 'any'
                  ? 'bg-[#181c28] border-[#d4af37] shadow'
                  : 'bg-[#12141b] border-[#222530] hover:border-[#383e50]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#1e2330] border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{t.anyBarber}</h3>
                  <p className="text-[11px] text-[#8e95a5]">
                    {lang === 'ar' ? 'يمنحك أكبر عدد من الأوقات المتاحة بدون تقييد بحلاق واحد.' : 'Offers greatest slot availability.'}
                  </p>
                </div>
              </div>
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                selectedBarberId === 'any' ? 'bg-[#d4af37] border-[#d4af37] text-black' : 'border-[#3a3f50]'
              }`}>
                {selectedBarberId === 'any' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
            </div>

            {/* Individual Barbers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {barbers.map((barber) => {
                const isSelected = selectedBarberId === barber.id;
                return (
                  <div
                    key={barber.id}
                    onClick={() => barber.isActive && setSelectedBarberId(barber.id)}
                    className={`p-3.5 rounded-xl border transition-all flex items-center gap-3.5 ${
                      !barber.isActive
                        ? 'opacity-40 cursor-not-allowed bg-[#0f1015] border-[#1d2028]'
                        : isSelected
                        ? 'bg-[#181c28] border-[#d4af37] shadow cursor-pointer'
                        : 'bg-[#12141b] border-[#222530] hover:border-[#383e50] cursor-pointer'
                    }`}
                  >
                    <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0 border border-[#d4af37]/40">
                      <img src={barber.avatar} alt={barber.nameAr} className="w-full h-full object-cover" />
                    </div>

                    <div className="flex-1 space-y-0.5">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-white">
                          {lang === 'ar' ? barber.nameAr : barber.nameEn}
                        </h4>
                        <span className="text-xs text-amber-400 font-mono">
                          ★ {barber.rating}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#d4af37]">
                        {lang === 'ar' ? barber.titleAr : barber.titleEn}
                      </p>
                      <p className="text-[10px] text-[#7e8799]">
                        {barber.experienceYears} {t.experienceYears}
                      </p>
                    </div>

                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-[#d4af37] border-[#d4af37] text-black' : 'border-[#3a3f50]'
                    }`}>
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ==================================== */}
        {/* STEP 4: DATE & TIME (Smart Availability & Suggested Open Days) */}
        {/* ==================================== */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-lg sm:text-xl font-bold text-white">
                {lang === 'ar' ? '4. اختيار موعد الحلاقة' : '4. Appointment Date & Time'}
              </h2>
              <p className="text-xs text-[#8e95a5]">
                {lang === 'ar'
                  ? 'الأوقات والمواعيد تفحص مباشرة لمنع أي حجز مكرر.'
                  : 'Real-time slot validation to avoid scheduling overlap.'}
              </p>
            </div>

            {/* Date Carousel with Booking Indicator */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-[#c5cbd6]">
                  {lang === 'ar' ? 'اختر اليوم:' : 'Select Day:'}
                </label>
                {currentDayStats.isCompletelyFree && (
                  <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    <span>{lang === 'ar' ? 'هذا اليوم شاغر تماماً (مفتوح للحجز)' : 'Completely open day'}</span>
                  </span>
                )}
                {currentDayStats.isPartiallyBusy && !currentDayStats.isFullyBooked && (
                  <span className="text-[11px] text-amber-400">
                    {lang === 'ar' ? `يوجد ${currentDayStats.bookedCount} حجز، وباقي المواعيد شاغرة` : 'Partially booked'}
                  </span>
                )}
                {currentDayStats.isFullyBooked && (
                  <span className="text-[11px] text-rose-400 font-semibold">
                    {lang === 'ar' ? 'هذا اليوم مكتمل الحجوزات' : 'Fully Booked Day'}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                {availableDates.map((item) => {
                  const isSelected = selectedDate === item.iso;
                  return (
                    <button
                      key={item.iso}
                      type="button"
                      onClick={() => {
                        setSelectedDate(item.iso);
                        setSelectedTimeSlot('');
                      }}
                      className={`min-w-[76px] p-2.5 rounded-xl border text-center transition-all relative ${
                        isSelected
                          ? 'bg-gold-gradient text-[#0b0c10] border-transparent font-bold shadow-md'
                          : item.isFullyBooked
                          ? 'bg-[#101115] text-[#555b6c] border-[#1d2028]'
                          : 'bg-[#13151c] text-[#8e95a5] border-[#222530] hover:text-white hover:border-[#383d4c]'
                      }`}
                    >
                      <span className="text-[10px] block uppercase">{item.dayName}</span>
                      <span className="text-base font-mono font-bold block my-0.5">{item.dayNum}</span>
                      <span className="text-[10px] block opacity-80">{item.monthName}</span>
                      
                      {/* Booking status dot */}
                      {item.isFullyBooked && (
                        <span className="absolute top-1.5 end-1.5 w-1.5 h-1.5 rounded-full bg-rose-500" title="ممتلئ"></span>
                      )}
                      {item.isCompletelyFree && !isSelected && (
                        <span className="absolute top-1.5 end-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500" title="شاغر بالكامل"></span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SMART SUGGESTION BANNER IF DAY IS FULLY BOOKED OR CONFLICTS */}
            {currentDayStats.isFullyBooked ? (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 space-y-3">
                <div className="flex items-center gap-2 text-rose-400 text-xs font-bold">
                  <AlertCircle className="w-4 h-4" />
                  <span>{t.dayFullyBooked}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {suggestedFreeDays.map((d) => (
                    <button
                      key={d.iso}
                      type="button"
                      onClick={() => {
                        setSelectedDate(d.iso);
                        setSelectedTimeSlot('');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#1a1e28] hover:bg-[#d4af37] hover:text-black text-white text-xs font-semibold border border-[#303544] transition-colors flex items-center gap-1.5"
                    >
                      <CalendarCheck className="w-3.5 h-3.5 text-[#d4af37]" />
                      <span>{d.dayName} ({d.dayNum} {d.monthName})</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* QUICK SUGGESTION FOR FASTEST FREE SLOTS ON THIS DAY */
              <div className="p-3 rounded-xl bg-[#141722] border border-[#252938] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-xs text-[#9ca3af]">
                  <span className="font-semibold text-white block mb-0.5">
                    {t.suggestedFreeSlots}:
                  </span>
                  <span>{lang === 'ar' ? 'أوقات خالية مؤكدة للحجز المباشر' : 'Immediate verified open slots'}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {freeSlotsForCurrentDay.slice(0, 3).map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedTimeSlot(slot)}
                      className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold transition-all ${
                        selectedTimeSlot === slot
                          ? 'bg-[#d4af37] text-black shadow'
                          : 'bg-[#1b202c] text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
                      }`}
                    >
                      {slot} ✓
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Time Slots Grid with Real Conflict Prevention */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#c5cbd6] block">
                {lang === 'ar' ? 'اختر وقت موعدك:' : 'Select Slot:'}
              </label>

              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {AVAILABLE_TIME_SLOTS.map((slot) => {
                  const hasConflict = checkSlotConflict(selectedBarberId, selectedDate, slot);
                  const isSelected = selectedTimeSlot === slot;

                  return (
                    <button
                      key={slot}
                      type="button"
                      disabled={hasConflict}
                      onClick={() => setSelectedTimeSlot(slot)}
                      className={`py-2.5 px-2 rounded-xl text-xs font-mono font-semibold transition-all border ${
                        hasConflict
                          ? 'bg-[#101115] border-[#1c1e24] text-[#474d5c] cursor-not-allowed line-through'
                          : isSelected
                          ? 'bg-[#d4af37] border-[#d4af37] text-[#0b0c10] shadow font-bold'
                          : 'bg-[#141720] border-[#232733] text-white hover:border-[#d4af37]/50'
                      }`}
                    >
                      <span>{slot}</span>
                      {hasConflict && (
                        <span className="block text-[8px] font-sans no-underline opacity-60">
                          {lang === 'ar' ? 'محجوز' : 'Booked'}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-4 text-[11px] text-[#6e7789] pt-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#141720] border border-[#232733]"></span>
                  <span>{lang === 'ar' ? 'متاح' : 'Available'}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#d4af37]"></span>
                  <span>{lang === 'ar' ? 'المحدد' : 'Selected'}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#101115] border border-[#1c1e24]"></span>
                  <span>{lang === 'ar' ? 'محجوز (غير متاح)' : 'Booked'}</span>
                </span>
              </div>
            </div>

          </div>
        )}

        {/* ==================================== */}
        {/* STEP 5: CLIENT DETAILS */}
        {/* ==================================== */}
        {currentStep === 5 && (
          <div className="space-y-6 max-w-lg mx-auto">
            <div className="space-y-1 text-center sm:text-start">
              <h2 className="text-lg sm:text-xl font-bold text-white">
                {lang === 'ar' ? '5. بياناتك للتواصل' : '5. Client Information'}
              </h2>
              <p className="text-xs text-[#8e95a5]">
                {lang === 'ar' ? 'سنرسل لك تفاصيل الموعد ورقم الحجز عبر الواتساب.' : 'Booking details will be sent via WhatsApp.'}
              </p>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-[#c5cbd6] mb-1">
                  {lang === 'ar' ? 'الاسم الكريم:' : 'Your Name:'} *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#6d7585] absolute start-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder={lang === 'ar' ? 'مثال: أحمد المصراتي' : 'e.g. Ahmed'}
                    className="w-full ps-9 pe-3 py-2.5 rounded-lg bg-[#0c0d12] border border-[#262a36] text-white text-xs sm:text-sm focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#c5cbd6] mb-1">
                  {lang === 'ar' ? 'رقم الهاتف / الواتساب:' : 'Phone / WhatsApp:'} *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#6d7585] absolute start-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="091XXXXXXX أو 092XXXXXXX"
                    className="w-full ps-9 pe-3 py-2.5 rounded-lg bg-[#0c0d12] border border-[#262a36] text-white text-xs sm:text-sm focus:outline-none focus:border-[#d4af37] font-mono dir-ltr text-start"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-semibold text-[#c5cbd6]">
                    {lang === 'ar' ? 'البريد الإلكتروني:' : 'Email Address:'}
                    {(confirmationMethod === 'email' || confirmationMethod === 'both') && (
                      <span className="text-amber-400 ms-1">*</span>
                    )}
                  </label>
                  <span className="text-[10px] text-[#6e7789]">
                    {confirmationMethod === 'whatsapp' 
                      ? (lang === 'ar' ? 'اختياري' : 'Optional') 
                      : (lang === 'ar' ? 'مطلوب لاستلام التأكيد' : 'Required for confirmation')}
                  </span>
                </div>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#6d7585] absolute start-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="example@gmail.com"
                    className="w-full ps-9 pe-3 py-2.5 rounded-lg bg-[#0c0d12] border border-[#262a36] text-white text-xs sm:text-sm focus:outline-none focus:border-[#d4af37] font-mono dir-ltr text-start"
                  />
                </div>
              </div>

              {/* Confirmation Channel Selector as requested by user */}
              <div className="p-3.5 rounded-xl bg-[#11131a] border border-[#242836] space-y-2">
                <label className="block font-bold text-white text-xs">
                  {lang === 'ar' ? 'طريقة استلام تأكيد الحجز الفوري:' : 'How do you want to receive booking confirmation?'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setConfirmationMethod('whatsapp')}
                    className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                      confirmationMethod === 'whatsapp'
                        ? 'border-[#25D366] bg-[#25D366]/15 text-white font-bold shadow-md shadow-[#25D366]/15'
                        : 'border-[#222530] text-[#8e95a5] hover:border-[#383d4e] hover:text-white'
                    }`}
                  >
                    <MessageCircle className="w-4 h-4 text-[#25D366]" />
                    <span className="text-[11px]">{lang === 'ar' ? 'عبر الواتساب' : 'WhatsApp'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmationMethod('email')}
                    className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                      confirmationMethod === 'email'
                        ? 'border-[#38bdf8] bg-[#38bdf8]/15 text-white font-bold shadow-md shadow-[#38bdf8]/15'
                        : 'border-[#222530] text-[#8e95a5] hover:border-[#383d4e] hover:text-white'
                    }`}
                  >
                    <Mail className="w-4 h-4 text-[#38bdf8]" />
                    <span className="text-[11px]">{lang === 'ar' ? 'عبر الإيميل' : 'Email'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmationMethod('both')}
                    className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                      confirmationMethod === 'both'
                        ? 'border-[#d4af37] bg-[#d4af37]/15 text-white font-bold shadow-md shadow-[#d4af37]/15'
                        : 'border-[#222530] text-[#8e95a5] hover:border-[#383d4e] hover:text-white'
                    }`}
                  >
                    <Sparkles className="w-4 h-4 text-[#d4af37]" />
                    <span className="text-[11px]">{lang === 'ar' ? 'كلاهما معاً' : 'Both (All)'}</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#c5cbd6] mb-1">
                  {lang === 'ar' ? 'ملاحظات خاصة للحلاق (اختياري):' : 'Special Notes (Optional):'}
                </label>
                <textarea
                  rows={2}
                  value={vipNotes}
                  onChange={(e) => setVipNotes(e.target.value)}
                  placeholder={lang === 'ar' ? 'مثال: بشرة حساسة، أو قصة معينة...' : 'Any preferences...'}
                  className="w-full p-2.5 rounded-lg bg-[#0c0d12] border border-[#262a36] text-white text-xs focus:outline-none focus:border-[#d4af37] resize-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#c5cbd6] mb-1">
                  {lang === 'ar' ? 'طريقة الدفع في الصالون:' : 'Payment Preference:'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('pay_at_salon')}
                    className={`p-2.5 rounded-lg border text-center transition-colors ${
                      paymentMethod === 'pay_at_salon'
                        ? 'border-[#d4af37] bg-[#1a1e28] text-white font-semibold'
                        : 'border-[#222530] text-[#8e95a5]'
                    }`}
                  >
                    {lang === 'ar' ? 'كاش في الصالون' : 'Cash at Salon'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('online_deposit')}
                    className={`p-2.5 rounded-lg border text-center transition-colors ${
                      paymentMethod === 'online_deposit'
                        ? 'border-[#d4af37] bg-[#1a1e28] text-white font-semibold'
                        : 'border-[#222530] text-[#8e95a5]'
                    }`}
                  >
                    {lang === 'ar' ? 'خدمة سداد / تداول' : 'Sadad / Card'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================== */}
        {/* STEP 6: SUMMARY & CONFIRMATION */}
        {/* ==================================== */}
        {currentStep === 6 && (
          <div className="space-y-6 max-w-lg mx-auto">
            <div className="space-y-1 text-center sm:text-start">
              <h2 className="text-lg sm:text-xl font-bold text-white">
                {lang === 'ar' ? '6. مراجعة وتأكيد الحجز' : '6. Review & Confirm'}
              </h2>
              <p className="text-xs text-[#8e95a5]">
                {lang === 'ar' ? 'تأكد من صحة بياناتك قبل تثبيت الموعد.' : 'Review appointment details before final confirmation.'}
              </p>
            </div>

            <div className="rounded-xl bg-[#12141c] border border-[#262a38] p-4 text-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#1f222d]">
                <span className="text-[#8e95a5]">{lang === 'ar' ? 'الخدمة الأساسية:' : 'Service:'}</span>
                <span className="font-bold text-white">
                  {lang === 'ar' ? selectedService.nameAr : selectedService.nameEn} ({selectedService.price} {t.currency})
                </span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-[#1f222d]">
                <span className="text-[#8e95a5]">{lang === 'ar' ? 'الحلاق:' : 'Barber:'}</span>
                <span className="font-bold text-white">
                  {selectedBarber ? (lang === 'ar' ? selectedBarber.nameAr : selectedBarber.nameEn) : t.anyBarber}
                </span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-[#1f222d]">
                <span className="text-[#8e95a5]">{lang === 'ar' ? 'تاريخ ووقت الموعد:' : 'Date & Time:'}</span>
                <span className="font-bold text-[#d4af37] font-mono">
                  {selectedDate} - {selectedTimeSlot}
                </span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-[#1f222d]">
                <span className="text-[#8e95a5]">{lang === 'ar' ? 'نوع التدرجة واللحية:' : 'Style:'}</span>
                <span className="text-white text-end">
                  {customOptions.fadeLevel} · {customOptions.beardStyle}
                </span>
              </div>

              {customOptions.selectedAddOns.length > 0 && (
                <div className="pb-2 border-b border-[#1f222d]">
                  <span className="text-[#8e95a5] block mb-1">{t.addOnsPrice}:</span>
                  <div className="space-y-1">
                    {customOptions.selectedAddOns.map((id) => {
                      const add = ADD_ON_OPTIONS.find((a) => a.id === id);
                      if (!add) return null;
                      return (
                        <div key={id} className="flex justify-between text-[11px] text-[#c5cbd6]">
                          <span>{lang === 'ar' ? add.nameAr : add.nameEn}</span>
                          <span className="font-mono">+{add.price} {t.currency}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pb-2 border-b border-[#1f222d]">
                <span className="text-[#8e95a5]">{lang === 'ar' ? 'العميل والتواصل:' : 'Client & Phone:'}</span>
                <span className="text-white text-end font-medium">
                  {clientName} <span className="font-mono text-[11px] text-[#8e95a5] dir-ltr inline-block">({clientPhone})</span>
                </span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-[#1f222d]">
                <span className="text-[#8e95a5]">{lang === 'ar' ? 'استلام تأكيد الحجز:' : 'Confirmation Channel:'}</span>
                <span className="font-semibold text-emerald-400">
                  {confirmationMethod === 'whatsapp' ? (lang === 'ar' ? 'عبر الواتساب (WhatsApp)' : 'Via WhatsApp') :
                   confirmationMethod === 'email' ? (lang === 'ar' ? 'عبر البريد الإلكتروني (Email)' : 'Via Email') :
                   (lang === 'ar' ? 'عبر الواتساب والإيميل معاً' : 'Both WhatsApp & Email')}
                </span>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div>
                  <span className="text-[#8e95a5] block">{t.estDuration}:</span>
                  <span className="text-white font-mono">{totalDuration} {t.mins}</span>
                </div>
                <div className="text-end">
                  <span className="text-[#8e95a5] block">{t.totalDue}:</span>
                  <span className="font-mono text-base font-bold text-[#d4af37]">
                    {totalPrice} {t.currency}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-[#7d8697] text-center">
              {t.termsNotice}
            </p>
          </div>
        )}

        {/* ==================================== */}
        {/* BOTTOM NAVIGATION BUTTONS */}
        {/* ==================================== */}
        <div className="mt-8 pt-4 border-t border-[#1d2028] flex items-center justify-between gap-4">
          {currentStep > 1 ? (
            <button
              onClick={handlePrevStep}
              className="px-4 py-2.5 rounded-lg bg-[#141720] hover:bg-[#1a1e28] text-white border border-[#2b2f3d] text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <ArrowPrev className="w-3.5 h-3.5" />
              <span>{t.prevStep}</span>
            </button>
          ) : (
            <div></div>
          )}

          {currentStep < 6 ? (
            <button
              onClick={handleNextStep}
              className="px-6 py-2.5 rounded-lg bg-gold-gradient text-[#0b0c10] font-bold text-xs shadow hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <span>{t.nextStep}</span>
              <ArrowNext className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleConfirmBooking}
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-lg bg-gold-gradient text-[#0b0c10] font-bold text-xs sm:text-sm shadow-md hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>{isSubmitting ? (lang === 'ar' ? 'جاري تثبيت الموعد...' : 'Confirming...') : t.confirmBooking}</span>
            </button>
          )}
        </div>

      </div>

    </div>
  );
};
