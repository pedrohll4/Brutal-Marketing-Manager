'use client';

import React, { useState } from 'react';
import { CalendarEvent, EventType } from '@/lib/types';
import { useSystemStore } from '@/lib/context/SystemStoreContext';
import { CalendarFilterBar } from './CalendarFilterBar';
import { CalendarWeekView } from './CalendarWeekView';
import { EventModal } from './EventModal';
import { ChevronLeft, ChevronRight, Video, Film, Camera, Package, DollarSign, Plus } from 'lucide-react';

export function CalendarGrid() {
  const { calendarEvents } = useSystemStore();

  const [currentDate, setCurrentDate] = useState(new Date(2026, 7, 24)); // August 2026
  const [viewMode, setViewMode] = useState<'MONTH' | 'WEEK'>('MONTH');

  const [selectedClientId, setSelectedClientId] = useState('ALL');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('ALL');
  const [selectedEventType, setSelectedEventType] = useState('ALL');

  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [selectedEventToEdit, setSelectedEventToEdit] = useState<CalendarEvent | null>(null);
  const [selectedDayForNewEvent, setSelectedDayForNewEvent] = useState<string>('');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const handlePrev = () => {
    if (viewMode === 'MONTH') {
      setCurrentDate(new Date(year, month - 1, 1));
    } else {
      const d = new Date(currentDate);
      d.setDate(d.getDate() - 7);
      setCurrentDate(d);
    }
  };

  const handleNext = () => {
    if (viewMode === 'MONTH') {
      setCurrentDate(new Date(year, month + 1, 1));
    } else {
      const d = new Date(currentDate);
      d.setDate(d.getDate() + 7);
      setCurrentDate(d);
    }
  };

  // Generate days for 7-col month grid
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const totalCells = Math.ceil((firstDayIndex + daysInMonth) / 7) * 7;

  const calendarDays = [];

  // Previous month trailing days
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    calendarDays.push({
      day: daysInPrevMonth - i,
      month: month - 1,
      year,
      isCurrentMonth: false,
      dateString: `${year}-${String(month).padStart(2, '0')}-${String(daysInPrevMonth - i).padStart(2, '0')}`,
    });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    calendarDays.push({
      day: d,
      month,
      year,
      isCurrentMonth: true,
      dateString: formattedDate,
    });
  }

  // Next month leading days
  const remaining = totalCells - calendarDays.length;
  for (let d = 1; d <= remaining; d++) {
    calendarDays.push({
      day: d,
      month: month + 1,
      year,
      isCurrentMonth: false,
      dateString: `${year}-${String(month + 2).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
    });
  }

  // Filter events
  const filteredEvents = calendarEvents.filter((evt) => {
    if (selectedClientId !== 'ALL' && evt.clientId !== selectedClientId) return false;
    if (selectedEmployeeId !== 'ALL' && evt.employeeId !== selectedEmployeeId) return false;
    if (selectedEventType !== 'ALL' && evt.eventType !== selectedEventType) return false;
    return true;
  });

  const getEventStyle = (type: EventType) => {
    switch (type) {
      case 'RECORDING':
        return {
          border: 'border-l-[3px] border-[#ff5708]',
          icon: <Video className="w-3 h-3 text-[#ff5708]" />,
        };
      case 'PHOTO':
        return {
          border: 'border-l-[3px] border-[#10b981]',
          icon: <Camera className="w-3 h-3 text-[#10b981]" />,
        };
      case 'PRODUCTION':
        return {
          border: 'border-l-[3px] border-[#3b82f6]',
          icon: <Film className="w-3 h-3 text-[#3b82f6]" />,
        };
      case 'DELIVERY':
        return {
          border: 'border-l-[3px] border-[#8b5cf6]',
          icon: <Package className="w-3 h-3 text-[#8b5cf6]" />,
        };
      case 'FINANCIAL':
        return {
          border: 'border-l-[3px] border-[#f59e0b]',
          icon: <DollarSign className="w-3 h-3 text-[#f59e0b]" />,
        };
      default:
        return {
          border: 'border-l-[3px] border-primary',
          icon: <Video className="w-3 h-3 text-primary" />,
        };
    }
  };

  const handleDayClick = (dateString: string) => {
    setSelectedEventToEdit(null);
    setSelectedDayForNewEvent(dateString);
    setIsEventModalOpen(true);
  };

  const handleEventClick = (e: React.MouseEvent, evt: CalendarEvent) => {
    e.stopPropagation();
    setSelectedEventToEdit(evt);
    setSelectedDayForNewEvent(evt.date);
    setIsEventModalOpen(true);
  };

  const handleWeekSlotClick = (dateString: string, _hour: string) => {
    setSelectedEventToEdit(null);
    setSelectedDayForNewEvent(dateString);
    setIsEventModalOpen(true);
  };

  return (
    <div className="space-y-4">
      {/* Page Header & View Controls matching Stitch */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pb-2">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-on-surface">
            {monthNames[month]} {year}
          </h2>
          <p className="font-mono text-xs text-on-surface-variant mt-1">
            Visão Geral de Gravações, Ensaios Fotográficos e Entregas
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex bg-[#1c1b1b] border border-[#2a2a2a] rounded p-1 text-xs font-mono">
            <button
              onClick={() => setViewMode('MONTH')}
              className={`px-3 py-1.5 rounded transition-all ${
                viewMode === 'MONTH'
                  ? 'bg-[#2a2a2a] text-on-surface font-bold shadow'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Mês
            </button>
            <button
              onClick={() => setViewMode('WEEK')}
              className={`px-3 py-1.5 rounded transition-all ${
                viewMode === 'WEEK'
                  ? 'bg-[#2a2a2a] text-on-surface font-bold shadow'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Semana
            </button>
          </div>

          {/* Navigation */}
          <div className="flex gap-1">
            <button
              onClick={handlePrev}
              className="w-9 h-9 flex items-center justify-center bg-[#1c1b1b] border border-[#2a2a2a] rounded hover:border-primary transition-colors text-on-surface"
              title="Anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="w-9 h-9 flex items-center justify-center bg-[#1c1b1b] border border-[#2a2a2a] rounded hover:border-primary transition-colors text-on-surface"
              title="Próximo"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => handleDayClick(new Date().toISOString().split('T')[0])}
            className="bg-primary hover:bg-primary-hover text-white font-semibold text-xs py-2 px-3.5 rounded flex items-center gap-1.5 shadow transition-all"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Novo Evento</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <CalendarFilterBar
        selectedClientId={selectedClientId}
        onChangeClientId={setSelectedClientId}
        selectedEmployeeId={selectedEmployeeId}
        onChangeEmployeeId={setSelectedEmployeeId}
        selectedEventType={selectedEventType}
        onChangeEventType={setSelectedEventType}
      />

      {/* Switch between Month Grid and Week Grid */}
      {viewMode === 'WEEK' ? (
        <CalendarWeekView
          currentDate={currentDate}
          events={filteredEvents}
          onSelectEvent={(evt) => {
            setSelectedEventToEdit(evt);
            setIsEventModalOpen(true);
          }}
          onSelectSlot={handleWeekSlotClick}
        />
      ) : (
        /* Calendar Month Grid Container (Discreet Brutalist Grid) */
        <div className="bg-[#2a2a2a] border border-[#2a2a2a] rounded-lg overflow-hidden shadow-2xl">
          {/* Days of Week Header */}
          <div className="grid grid-cols-7 bg-[#131313] border-b border-[#2a2a2a]">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((dayName, idx) => (
              <div
                key={idx}
                className={`py-2.5 px-3 font-mono text-xs text-on-surface-variant uppercase text-right ${
                  idx < 6 ? 'border-r border-[#2a2a2a]' : ''
                }`}
              >
                {dayName}
              </div>
            ))}
          </div>

          {/* Calendar Cells */}
          <div className="grid grid-cols-7 gap-[1px] bg-[#2a2a2a]">
            {calendarDays.map((cell, idx) => {
              const dayEvents = filteredEvents.filter((e) => e.date === cell.dateString);
              const isToday = cell.dateString === '2026-08-24' || cell.day === 10;

              return (
                <div
                  key={idx}
                  onClick={() => handleDayClick(cell.dateString)}
                  className={`bg-[#131313] min-h-[130px] p-2 flex flex-col transition-colors group cursor-pointer ${
                    !cell.isCurrentMonth
                      ? 'opacity-40 bg-[#0e0e0e]'
                      : 'hover:bg-[#1a1a1a]'
                  }`}
                >
                  {/* Day Number Header */}
                  <div className="flex justify-end items-center mb-1.5">
                    {isToday && cell.isCurrentMonth ? (
                      <div className="w-6 h-6 bg-primary rounded flex items-center justify-center shadow-lg">
                        <span className="font-mono text-xs text-white font-bold">{cell.day}</span>
                      </div>
                    ) : (
                      <span
                        className={`font-mono text-xs transition-colors ${
                          cell.isCurrentMonth
                            ? 'text-on-surface group-hover:text-primary'
                            : 'text-on-surface-variant'
                        }`}
                      >
                        {cell.day}
                      </span>
                    )}
                  </div>

                  {/* Events list inside cell */}
                  <div className="space-y-1 overflow-y-auto max-h-[100px]">
                    {dayEvents.map((evt) => {
                      const style = getEventStyle(evt.eventType);

                      return (
                        <div
                          key={evt.id}
                          onClick={(e) => handleEventClick(e, evt)}
                          className={`bg-[#1a1a1a] ${style.border} p-1.5 rounded-r-sm hover:bg-[#252525] transition-colors`}
                        >
                          <div className="flex items-center gap-1.5">
                            {style.icon}
                            <span className="text-[11px] font-semibold text-on-surface truncate leading-tight">
                              {evt.title}
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-[9px] font-mono text-on-surface-variant mt-0.5 ml-4">
                            <span>{evt.startTime ? `${evt.startTime}` : 'Dia Todo'}</span>
                            {evt.location && <span className="truncate max-w-[80px]">{evt.location}</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal Evento */}
      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        eventToEdit={selectedEventToEdit}
        initialDate={selectedDayForNewEvent}
      />
    </div>
  );
}
