import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import { CalendarEvent } from '../types/calendar';

interface ScheduleCardProps {
  title: string;
  date: string;
  events: CalendarEvent[];
  hasCalendarPermission: boolean;
  isLoading: boolean;
  colorScheme: 'primary' | 'secondary';
}

const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 9; hour <= 18; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00`);
  }
  return slots;
};

const mapEventsToTimeSlots = (events: CalendarEvent[]) => {
  const eventMap: { [key: string]: CalendarEvent[] } = {};
  
  events.forEach(event => {
    if (event.start.dateTime) {
      const startTime = new Date(event.start.dateTime);
      const timeKey = startTime.toLocaleTimeString('ja-JP', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });
      
      if (!eventMap[timeKey]) {
        eventMap[timeKey] = [];
      }
      eventMap[timeKey].push(event);
    }
  });
  
  return eventMap;
};

const calculateDuration = (event: CalendarEvent): number => {
  if (!event.start.dateTime || !event.end.dateTime) return 0;
  
  const start = new Date(event.start.dateTime);
  const end = new Date(event.end.dateTime);
  return Math.round((end.getTime() - start.getTime()) / (1000 * 60));
};

const formatEventTime = (event: CalendarEvent): string => {
  if (!event.start.dateTime || !event.end.dateTime) return '';
  
  const start = new Date(event.start.dateTime);
  const end = new Date(event.end.dateTime);
  
  const startTime = start.toLocaleTimeString('ja-JP', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  });
  const endTime = end.toLocaleTimeString('ja-JP', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  });
  
  return `${startTime} - ${endTime}`;
};

const ScheduleCard: React.FC<ScheduleCardProps> = ({ 
  title, 
  date, 
  events, 
  hasCalendarPermission, 
  isLoading,
  colorScheme 
}) => {
  const timeSlots = generateTimeSlots();
  const eventMap = mapEventsToTimeSlots(events);
  
  const colorClasses = {
    primary: {
      icon: 'text-primary',
      event: 'bg-primary/10 border-primary/20',
      eventText: 'text-primary'
    },
    secondary: {
      icon: 'text-secondary',
      event: 'bg-secondary/10 border-secondary/20',
      eventText: 'text-secondary'
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-3 mb-6">
        <Calendar className={`w-6 h-6 ${colorClasses[colorScheme].icon}`} />
        <div>
          <h3 className="text-xl font-semibold text-gray-800">
            {title}
          </h3>
          <p className="text-sm text-gray-500">
            {date}
          </p>
        </div>
      </div>
      
      <div className="space-y-2">
        {timeSlots.map((time) => {
          const eventsAtTime = eventMap[time] || [];
          
          if (eventsAtTime.length > 0) {
            return (
              <div key={time} className="py-2 border-b border-gray-100 last:border-b-0">
                <div className="text-sm text-gray-500 font-mono mb-1">
                  {time}
                </div>
                {eventsAtTime.map((event, index) => (
                  <div key={`${event.id}-${index}`} className={`${colorClasses[colorScheme].event} border rounded-lg p-3 mb-2 last:mb-0`}>
                    <div className={`font-medium ${colorClasses[colorScheme].eventText} mb-1`}>
                      {event.summary || '無題の予定'}
                    </div>
                    <div className="text-xs text-gray-600 flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      {formatEventTime(event)}
                      <span className="text-gray-400">
                        ({calculateDuration(event)}分)
                      </span>
                    </div>
                    {event.location && (
                      <div className="text-xs text-gray-500 mt-1">
                        📍 {event.location}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            );
          }
          
          return (
            <div key={time} className="flex items-center gap-4 py-2 border-b border-gray-100 last:border-b-0">
              <div className="w-16 text-sm text-gray-500 font-mono">
                {time}
              </div>
              <div className="flex-1">
                <div className="text-gray-300 text-sm">
                  {hasCalendarPermission ? '空き時間' : 'カレンダー権限が必要です'}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {!hasCalendarPermission && (
        <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <p className="text-xs text-orange-700 text-center">
            Googleカレンダーの権限が必要です。ログインし直してください。
          </p>
        </div>
      )}
      
      {hasCalendarPermission && events.length === 0 && !isLoading && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-xs text-green-700 text-center">
            予定はありません
          </p>
        </div>
      )}
    </div>
  );
};

export default ScheduleCard;