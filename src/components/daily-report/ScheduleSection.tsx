import React from 'react';
import { Clock, Plus, Calendar } from 'lucide-react';

interface ScheduleSectionProps {
  calendarEvents: any[];
  calendarLoading: boolean;
  calendarError: string | null;
  onAddEvent: () => void;
}

const ScheduleSection: React.FC<ScheduleSectionProps> = ({
  calendarEvents,
  calendarLoading,
  calendarError,
  onAddEvent
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 lg:p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Clock className="w-6 h-6 text-primary" />
          <h2 className="text-lg lg:text-xl font-semibold text-gray-800">
            当日の予定
          </h2>
        </div>
        <div>
          <button
            onClick={onAddEvent}
            className="bg-secondary text-white py-2 px-3 lg:px-4 rounded-lg text-sm font-medium hover:bg-secondary/90 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">予定追加</span>
            <span className="sm:hidden">追加</span>
          </button>
        </div>
      </div>
      
      <div className="space-y-4">
        {calendarLoading && (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Googleカレンダーから予定を取得中...</p>
          </div>
        )}
        
        {calendarEvents.length === 0 && !calendarLoading && (
          <div className="text-center py-12 text-gray-500">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg">予定がありません</p>
            <p className="text-sm">手動で予定を追加するか、Googleカレンダーから再取得してください</p>
          </div>
        )}
      </div>

      {calendarError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
          <p className="text-red-700 text-sm">
            <span className="font-medium">カレンダーエラー:</span> {calendarError}
          </p>
        </div>
      )}
    </div>
  );
};

export default ScheduleSection;