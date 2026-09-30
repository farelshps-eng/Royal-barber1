import React from 'react';
import { useSalon } from '../context/SalonContext';
import { CheckCircle2 } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toastMessage } = useSalon();

  if (!toastMessage) return null;

  return (
    <div className="fixed top-24 start-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-300 pointer-events-none">
      <div className="flex items-center gap-2.5 px-5 py-3 rounded-xl bg-[#141720] text-white border border-[#d4af37]/60 shadow-2xl shadow-black/80">
        <CheckCircle2 className="w-5 h-5 text-[#d4af37] shrink-0" />
        <span className="text-sm font-medium">{toastMessage}</span>
      </div>
    </div>
  );
};
