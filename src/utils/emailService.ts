/**
 * emailService.ts
 * ----------------
 * Royal Barber – نظام إرسال إيميل تأكيد الحجز
 * يستخدم EmailJS لإرسال إيميلات HTML احترافية مباشرة من المتصفح.
 *
 * الإعداد المطلوب (مرة واحدة):
 *   1. سجّل في https://www.emailjs.com
 *   2. أنشئ Service (Gmail / Outlook / ...) واحتفظ بـ SERVICE_ID
 *   3. أنشئ Template واحتفظ بـ TEMPLATE_ID
 *   4. احتفظ بـ PUBLIC_KEY من لوحة التحكم
 *   5. ضع القيم في ملف .env:
 *        VITE_EMAILJS_SERVICE_ID=...
 *        VITE_EMAILJS_TEMPLATE_ID=...
 *        VITE_EMAILJS_PUBLIC_KEY=...
 */

import emailjs from '@emailjs/browser';
import type { Booking } from '../types';

// ─── Config ──────────────────────────────────────────────────────────────────
const SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID  as string;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string;
const PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY  as string;

// ─── Status Result ────────────────────────────────────────────────────────────
export interface EmailResult {
  success: boolean;
  error?: string;
}

// ─── Template Params Builder ──────────────────────────────────────────────────
/**
 * يبني الـ params المرسلة للـ EmailJS template.
 * أسماء المتغيرات يجب أن تتطابق مع ما وضعته في قالب EmailJS.
 */
function buildTemplateParams(booking: Booking, lang: 'ar' | 'en') {
  const isAr = lang === 'ar';

  // ترجمة طريقة الدفع
  const paymentLabel = isAr
    ? (booking.paymentMethod === 'pay_at_salon' ? 'كاش أو تداول في الصالون' : 'إيداع أونلاين مسبق')
    : (booking.paymentMethod === 'pay_at_salon' ? 'Pay at Salon (Cash / Tadawul)' : 'Online Deposit');

  // تفاصيل الإضافات
  const addOnsText =
    booking.addOnDetails.length > 0
      ? booking.addOnDetails.map((a) => (isAr ? a.nameAr : a.nameEn) + ` (+${a.price} ${isAr ? 'د.ل' : 'LYD'})`).join('، ')
      : isAr ? 'لا توجد إضافات' : 'No add-ons';

  return {
    // — إلى العميل
    to_email:         booking.customerEmail || '',
    to_name:          booking.customerName,

    // — تفاصيل الحجز (عربي + إنجليزي في نفس الإيميل)
    ref_number:       booking.referenceNumber,
    service_name:     isAr ? booking.serviceNameAr : booking.serviceNameEn,
    barber_name:      isAr ? booking.barberNameAr  : booking.barberNameEn,
    booking_date:     booking.date,
    booking_time:     booking.timeSlot,
    duration_mins:    String(booking.totalDurationMinutes),
    total_price:      String(booking.totalPrice),
    currency:         isAr ? 'د.ل' : 'LYD',
    payment_method:   paymentLabel,
    add_ons:          addOnsText,
    vip_notes:        booking.vipNotes || (isAr ? '—' : '—'),
    created_at:       new Date(booking.createdAt).toLocaleString(isAr ? 'ar-LY' : 'en-GB'),

    // — معلومات الصالون
    salon_name:       'ROYAL BARBER',
    salon_address:    isAr ? 'طرابلس - ليبيا' : 'Tripoli, Libya',
    salon_whatsapp:   '00218910000000',
    salon_phone:      '+218 91 000 0000',

    // — رسالة الترحيب
    welcome_message:  isAr
      ? `مرحباً بك يا ${booking.customerName}، تم تثبيت موعدك بنجاح في صالون رويال. كرسيك في انتظارك بدون أي تأخير! ✂️`
      : `Welcome ${booking.customerName}! Your appointment has been confirmed at ROYAL BARBER. Your chair is reserved with zero wait time! ✂️`,

    // — اللغة (يمكن استخدامه في الـ template كـ conditional)
    lang,
  };
}

// ─── Main Send Function ───────────────────────────────────────────────────────
/**
 * يرسل إيميل تأكيد الحجز إلى العميل.
 * يُستدعى مباشرة بعد نجاح إضافة الحجز.
 */
export async function sendBookingConfirmationEmail(
  booking: Booking,
  lang: 'ar' | 'en'
): Promise<EmailResult> {
  // تحقق من وجود إيميل العميل
  if (!booking.customerEmail?.trim()) {
    return { success: false, error: 'no_email' };
  }

  // تحقق من تهيئة EmailJS
  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
    console.warn('[EmailJS] Missing env variables – email not sent.');
    return { success: false, error: 'not_configured' };
  }

  try {
    const params = buildTemplateParams(booking, lang);

    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      params,
      { publicKey: PUBLIC_KEY }
    );

    if (response.status === 200) {
      return { success: true };
    }

    return { success: false, error: `status_${response.status}` };

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[EmailJS] Send error:', msg);
    return { success: false, error: msg };
  }
}

// ─── Is EmailJS Configured? ───────────────────────────────────────────────────
/**
 * تُرجع true إذا كانت متغيرات البيئة مضبوطة،
 * تُستخدم لإخفاء/إظهار زر الإيميل في الواجهة.
 */
export function isEmailConfigured(): boolean {
  return Boolean(SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY);
}
