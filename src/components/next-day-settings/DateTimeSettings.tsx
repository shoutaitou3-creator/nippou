import React, { memo } from 'react';
import { Calendar, Clock } from 'lucide-react';
import TimeDropdown from '../daily-report/TimeDropdown';

interface DateTimeSettingsProps {
  selectedDate: string;
  startTime: string;
  endTime: string;
  onDateChange: (date: string) => void;
  onStartTimeChange: (time: string) => void;
  onEndTimeChange: (time: string) => void;
  calculateWorkHours: () => string;
  formatSelectedDate: (dateString: string) => string;
}

const DateTimeSettings: React.FC<DateTimeSettingsProps> = memo(({
  selectedDate,
  startTime,
  endTime,
  onDateChange,
  onStartTimeChange,
  onEndTimeChange,
  calculateWorkHours,
  formatSelectedDate
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="space-y-4">
        {/* 日付セクション */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-accent" />
            <label className="text-sm font-medium text-gray-700">
              日付
            </label>
          </div>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent text-sm"
          />
        </div>

        {/* 時間セクション */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-accent" />
            <label className="text-sm font-medium text-gray-700">
              勤務時間
            </label>
          </div>
          
          <div className="grid grid-cols-3 gap-3 items-end">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                開始
              </label>
              <TimeDropdown
                value={startTime}
                onChange={onStartTimeChange}
                className="text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                終了
              </label>
              <TimeDropdown
                value={endTime}
                onChange={onEndTimeChange}
                className="text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                時間数
              </label>
              <div className="px-2 py-2 bg-accent/10 rounded-lg text-xs font-medium text-accent text-center">
                {calculateWorkHours()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

DateTimeSettings.displayName = 'DateTimeSettings';

export default DateTimeSettings;