'use client';

import React from 'react';
import { CalendarEvent, EventType } from '@/lib/types';
import { Video, Film, Camera, Package, DollarSign, Clock, MapPin } from 'lucide-react';
import { format } from 'date-fns';

interface CalendarWeekViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onSelectEvent: (event: CalendarEvent) => void;
  onSelectSlot: (dateString: string, hour: string) => void;
}

const HOURS = Array.from({ length: 15 }, (_, i) => i + 7); // 07:00 to 21:00

export function CalendarWeekView({
  currentDate,
  events,
  onSelectEvent,
  onSelectSlot,
}: CalendarWeekViewProps) {
  // Compute the 7 days of the current week (starting Sunday)
  const currentDayOfWeek = currentDate.getDay();
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDayOfWeek);

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return {
      date: d,
      dayNumber: d.getDate(),
      dayName: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][i],
      dateString: `${y}-${m}-${day}`,
      isToday: d.toDateString() === new Date(2026, 7, 24).toDateString() || d.getDate() === 24,
    };
  });

  const getEventStyle = (type: EventType) => {
    switch (type) {
      case 'RECORDING':
        return {
          bg: 'bg-[#ff5708]/15 border-l-4 border-[#ff5708] text-[#ff5708]',
          icon: <Video className="w-3.5 h-3.5 text-[#ff5708]" />,
        };
      case 'PHOTO':
        return {
          bg: 'bg-[#10b981]/15 border-l-4 border-[#10b981] text-[#10b981]',
          icon: <Camera className="w-3.5 h-3.5 text-[#10b981]" />,
        };
      case 'PRODUCTION':
        return {
          bg: 'bg-[#3b82f6]/15 border-l-4 border-[#3b82f6] text-[#3b82f6]',
          icon: <Film className="w-3.5 h-3.5 text-[#3b82f6]" />,
        };
      case 'DELIVERY':
        return {
          bg: 'bg-[#8b5cf6]/15 border-l-4 border-[#8b5cf6] text-[#8b5cf6]',
          icon: <Package className="w-3.5 h-3.5 text-[#8b5cf6]" />,
        };
      case 'FINANCIAL':
        return {
          bg: 'bg-[#f59e0b]/15 border-l-4 border-[#f59e0b] text-[#f59e0b]',
          icon: <DollarSign className="w-3.5 h-3.5 text-[#f59e0b]" />,
        };
      default:
        return {
          bg: 'bg-primary/15 border-l-4 border-primary text-primary',
          icon: <Video className="w-3.5 h-3.5 text-primary" />,
        };
    }
  };

  return (
    <div className="bg-[#121212] border border-[#262626] rounded-lg overflow-hidden shadow-2xl flex flex-col">
      {/* Week Header */}
      <div className="grid grid-cols-8 bg-[#161616] border-b border-[#262626] sticky top-0 z-20">
        <div className="py-3 px-2 border-r border-[#262626] text-center font-mono text-[10px] text-on-surface-variant uppercase font-bold">
          Horário
        </div>
        {weekDays.map((wd, i) => (
          <div
            key={i}
            className={`py-3 px-2 text-center border-r border-[#262626] font-mono last:border-r-0 ${
              wd.isToday ? 'bg-primary/10' : ''
            }`}
          >
            <span className="text-[11px] text-on-surface-variant uppercase block">
              {wd.dayName}
            </span>
            <span
              className={`text-sm font-bold mt-0.5 inline-block ${
                wd.isToday
                  ? 'w-6 h-6 rounded-full bg-primary text-white leading-6'
                  : 'text-on-surface'
              }`}
            >
              {wd.dayNumber}
            </span>
          </div>
        ))}
      </div>

      {/* Week Hours Grid */}
      <div className="overflow-y-auto max-h-[620px] divide-y divide-[#222]">
        {HOURS.map((hour) => {
          const formattedHour = `${String(hour).padStart(2, '0')}:00`;

          return (
            <div key={hour} className="grid grid-cols-8 min-h-[58px] relative group">
              {/* Hour Label */}
              <div className="py-1 px-2 border-r border-[#242424] text-right font-mono text-[11px] text-on-surface-variant/80 select-none bg-[#141414]">
                {formattedHour}
              </div>

              {/* 7 Day Slots */}
              {weekDays.map((wd, dayIdx) => {
                // Find events matching this day and approximately this hour
                const matchingEvents = events.filter((e) => {
                  if (e.date !== wd.dateString) return false;
                  if (!e.startTime) return hour === 9; // default morning slot
                  const startHour = parseInt(e.startTime.split(':')[0], 10);
                  return startHour === hour;
                });

                return (
                  <div
                    key={dayIdx}
                    onClick={() => onSelectSlot(wd.dateString, formattedHour)}
                    className={`border-r border-[#202020] p-1 transition-colors hover:bg-[#1a1a1a] cursor-pointer relative last:border-r-0 ${
                      wd.isToday ? 'bg-primary/[0.02]' : ''
                    }`}
                  >
                    {matchingEvents.map((evt) => {
                      const style = getEventStyle(evt.eventType);

                      return (
                        <div
                          key={evt.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectEvent(evt);
                          }}
                          className={`${style.bg} p-1.5 rounded-r shadow-md text-xs mb-1 hover:brightness-125 transition-all cursor-pointer`}
                        >
                          <div className="flex items-center gap-1 font-bold text-on-surface truncate">
                            {style.icon}
                            <span className="truncate">{evt.title}</span>
                          </div>

                          <div className="flex items-center justify-between text-[9px] font-mono text-on-surface-variant mt-0.5">
                            <span className="flex items-center gap-0.5">
                              <Clock className="w-2.5 h-2.5" />
                              {evt.startTime || '09:00'} - {evt.endTime || '12:00'}
                            </span>
                            {evt.location && (
                              <span className="truncate max-w-[70px] text-primary/80">
                                {evt.location}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
