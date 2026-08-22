'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import type { Dictionary } from '@dictionaries';
import { HomeButton } from '../home-button';
import { IoCall, IoChevronDown, IoClose } from 'react-icons/io5';
import { cn } from '@shared/utils';

export type FloatingAppointmentWidgetProps = {
  lang: string;
  dict: Dictionary;
};

export function FloatingAppointmentWidget({ lang, dict }: FloatingAppointmentWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [selectedTimeIndex, setSelectedTimeIndex] = useState(1);
  const [step, setStep] = useState<'picker' | 'form' | 'success'>('picker');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Countdown timer state (starts at 2 minutes 57 seconds = 177s)
  const [timeLeft, setTimeLeft] = useState(177);

  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 180));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  const formattedTime = useMemo(() => {
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }, [timeLeft]);

  // Generate next 5 calendar days dynamically
  const days = useMemo(() => {
    const list = [];
    const today = new Date();
    for (let i = 1; i <= 5; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);

      const dayName = d.toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', { weekday: 'short' });
      const dayNum = d.getDate();
      list.push({ dayName, dayNum, fullDate: d });
    }
    return list;
  }, [lang]);

  const timeSlots = useMemo(() => {
    if (lang === 'ar') {
      return ['09:00 ص', '11:00 ص', '01:00 م', '03:00 م', '04:00 م', '05:00 م'];
    }
    return ['09:00 AM', '11:00 AM', '01:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'];
  }, [lang]);

  const [form, setForm] = useState({
    name: '',
    email: '',
    website: '',
    revenue: '$25,000 - $100,000',
  });

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep('success');
    }, 750);
  };

  const handleReset = () => {
    setStep('picker');
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Action Button (FAB) */}
      <div className="fixed bottom-6 end-6 z-50 flex items-center gap-3 select-none">
        {/* Subtle tooltip preview when closed */}
        {!isOpen && (
          <div
            onClick={() => setIsOpen(true)}
            className="hidden sm:flex items-center gap-2 rounded-full bg-white/95 backdrop-blur-md px-4 py-2 text-xs font-semibold text-foreground shadow-xl border border-black/10 cursor-pointer transition-all hover:scale-105"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{dict.floatingAppointment?.cta || 'Schedule a call'}</span>
          </div>
        )}

        {/* Circular FAB Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'relative flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-persici-crimson text-white shadow-2xl shadow-persici-crimson/40 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer',
            isOpen ? 'bg-persici-black shadow-black/40' : 'animate-bounce-subtle'
          )}
          aria-label={isOpen ? 'Close appointment scheduler' : 'Open appointment scheduler'}
        >
          {/* Subtle Ambient Pulse Ring when closed */}
          {!isOpen && (
            <span className="absolute -inset-1 rounded-full bg-persici-crimson/30 animate-ping opacity-60 pointer-events-none" />
          )}

          {isOpen ? (
            <IoChevronDown className="h-7 w-7 transition-transform duration-200" />
          ) : (
            <IoCall className="h-6 w-6 sm:h-7 sm:w-7 transition-transform duration-200" />
          )}
        </button>
      </div>

      {/* Appointment Popover Card */}
      {isOpen && (
        <div className="fixed bottom-24 end-4 sm:end-6 z-50 w-[calc(100vw-2rem)] max-w-[370px] sm:max-w-[400px] overflow-hidden rounded-3xl border border-black/10 bg-white shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-6">
          {/* Card Top Header */}
          <div className="flex items-center justify-between border-b border-black/5 bg-neutral-50/70 p-4 sm:p-5">
            <div className="flex items-center gap-3">
              {/* Advisor Avatar with Online Status */}
              <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border-2 border-white shadow-xs">
                <Image
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                  alt={dict.floatingAppointment?.advisorName || 'Aaron'}
                  fill
                  className="object-cover"
                />
                <span className="absolute bottom-0 end-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
              </div>

              <div>
                <div className="font-primary text-sm font-bold text-foreground">
                  {dict.floatingAppointment?.advisorName || 'Hanan'}
                </div>
                <div className="text-[11px] font-medium text-foreground/60">
                  {dict.floatingAppointment?.advisorRole || 'Senior Growth Advisor'}
                </div>
              </div>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-full text-foreground/60 hover:bg-black/5 hover:text-foreground transition-all cursor-pointer"
              aria-label="Close"
            >
              <IoClose className="h-5 w-5" />
            </button>
          </div>

          {/* Card Body */}
          <div className="p-5 sm:p-6">
            {step === 'picker' && (
              <div className="space-y-4">
                {/* Title & Description */}
                <div>
                  <h4 className="font-primary text-sm sm:text-base font-bold text-foreground leading-snug">
                    {dict.floatingAppointment?.title || 'Schedule your free 30-minute discovery call'}
                  </h4>
                  <p className="mt-1.5 text-xs text-foreground/70 leading-relaxed">
                    {dict.floatingAppointment?.subtitle ||
                      'This call is for ambitious eCommerce brands ready to take their growth to the next level.'}
                  </p>
                </div>

                {/* Urgency Progress Countdown Banner */}
                <div className="relative overflow-hidden rounded-xl border border-black/10 bg-neutral-50 p-3">
                  {/* Top Progress Accent Strip */}
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-persici-crimson via-persici-blush to-persici-crimson" />

                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-foreground/90">
                      {dict.floatingAppointment?.urgencyText || 'Only few slots are left.'}
                    </span>
                    <span className="font-mono text-xs font-bold text-persici-crimson bg-persici-crimson/10 px-2 py-0.5 rounded-md">
                      {formattedTime}
                    </span>
                  </div>
                </div>

                {/* 5-Day Date Selector Chips */}
                <div className="grid grid-cols-5 gap-1.5 pt-1">
                  {days.map((item, idx) => {
                    const isSelected = selectedDayIndex === idx;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedDayIndex(idx)}
                        className={cn(
                          'flex flex-col items-center justify-center rounded-2xl py-2.5 px-1 transition-all cursor-pointer text-center',
                          isSelected
                            ? 'border-2 border-persici-crimson bg-persici-crimson/5 text-persici-crimson shadow-xs font-bold'
                            : 'border border-black/10 bg-white text-foreground/80 hover:border-black/25'
                        )}
                      >
                        <span className="text-[11px] font-medium opacity-80">{item.dayName}</span>
                        <span className="text-sm font-extrabold mt-0.5">{item.dayNum}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Time Slots Selector */}
                <div>
                  <label className="block text-[11px] font-semibold text-foreground/70 mb-1.5">
                    {dict.floatingAppointment?.selectTime || 'Select time slot'}
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {timeSlots.map((time, idx) => {
                      const isSelected = selectedTimeIndex === idx;
                      return (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setSelectedTimeIndex(idx)}
                          className={cn(
                            'rounded-xl py-2 px-1 text-[11px] font-semibold transition-all cursor-pointer text-center',
                            isSelected
                              ? 'bg-persici-black text-white shadow-xs'
                              : 'border border-black/10 bg-white text-foreground/80 hover:bg-neutral-50'
                          )}
                        >
                          {time}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Primary CTA Button */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setStep('form')}
                    className="w-full flex items-center justify-center rounded-full bg-persici-crimson py-3 text-xs sm:text-sm font-bold text-white shadow-lg shadow-persici-crimson/25 transition-all hover:bg-persici-crimson-80 hover:shadow-xl active:scale-98 cursor-pointer"
                  >
                    {dict.floatingAppointment?.cta || 'Schedule a discovery call'}
                  </button>
                </div>
              </div>
            )}

            {step === 'form' && (
              <form onSubmit={handleBookingSubmit} className="space-y-3.5 animate-in fade-in">
                <div className="flex items-center justify-between pb-1 border-b border-black/5">
                  <span className="text-xs font-bold text-foreground">
                    {days[selectedDayIndex]?.dayName} {days[selectedDayIndex]?.dayNum} • {timeSlots[selectedTimeIndex]}
                  </span>
                  <button
                    type="button"
                    onClick={() => setStep('picker')}
                    className="text-[11px] font-semibold text-persici-crimson hover:underline cursor-pointer"
                  >
                    Change
                  </button>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-foreground/75 mb-1">
                    {dict.floatingAppointment?.fullName || 'Full Name'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full rounded-xl border border-black/15 bg-white px-3 py-2 text-xs text-foreground outline-none focus:border-persici-crimson"
                    placeholder="Jane Doe"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-foreground/75 mb-1">
                    {dict.floatingAppointment?.email || 'Work Email'} *
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full rounded-xl border border-black/15 bg-white px-3 py-2 text-xs text-foreground outline-none focus:border-persici-crimson"
                    placeholder="jane@brand.com"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-foreground/75 mb-1">
                    {dict.floatingAppointment?.website || 'Store Website / URL'}
                  </label>
                  <input
                    type="text"
                    value={form.website}
                    onChange={(e) => setForm({ ...form, website: e.target.value })}
                    className="w-full rounded-xl border border-black/15 bg-white px-3 py-2 text-xs text-foreground outline-none focus:border-persici-crimson"
                    placeholder="https://brand.com"
                  />
                </div>

                <div className="pt-2">
                  <HomeButton
                    type="submit"
                    title={
                      isSubmitting
                        ? dict.floatingAppointment?.submitting || 'Reserving slot...'
                        : dict.floatingAppointment?.confirmBooking || 'Confirm Booking'
                    }
                    loading={isSubmitting}
                    currentLang={lang}
                    isLangEffectIcon={true}
                    className="w-full bg-persici-crimson text-white shadow-md shadow-persici-crimson/25 py-2.5 text-xs font-semibold justify-center"
                    iconClassName="bg-white text-persici-crimson h-7 w-7"
                  />
                </div>
              </form>
            )}

            {step === 'success' && (
              <div className="py-6 text-center space-y-3 animate-in fade-in">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white text-2xl font-bold shadow-lg shadow-emerald-500/20">
                  ✓
                </div>
                <h4 className="font-primary text-base font-bold text-foreground">
                  {dict.floatingAppointment?.successTitle || 'Appointment Scheduled!'}
                </h4>
                <p className="text-xs text-foreground/70 leading-relaxed max-w-xs mx-auto">
                  {dict.floatingAppointment?.successMsg ||
                    "We've reserved your 30-minute growth session. Calendar invitation sent to your email."}
                </p>
                <button
                  type="button"
                  onClick={handleReset}
                  className="mt-4 inline-flex items-center rounded-full border border-black/15 bg-white px-6 py-2 text-xs font-semibold text-foreground hover:bg-neutral-50 transition-all cursor-pointer"
                >
                  Done
                </button>
              </div>
            )}
          </div>

          {/* Popover Footer Branding */}
          <div className="border-t border-black/5 bg-neutral-50/60 py-2.5 text-center text-[10px] font-medium text-foreground/50">
            {dict.floatingAppointment?.poweredBy || 'Powered by Persici Growth OS'}
          </div>
        </div>
      )}
    </>
  );
}
