import React from 'react';
import { Calendar } from 'lucide-react';
import { CalendarEvent } from '../../types/calendar';
import TimeDropdown from '../TimeDropdown'; // TimeDropdownをインポート

interface TomorrowScheduleSectionProps {
  selectedDate: Date;
  nextDayStartTime: string;
  nextDayEndTime: string;
  tomorrowEvents: CalendarEvent[];
  timeOptions: string[];
  onDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onStartTimeChange: (time: string) => void;
  onEndTimeChange: (time: string) => void;
  onScheduleFetch: () => void;
  formatDateForInput: (date: Date) => string;
  formatSelectedDate: (date: Date) => string;
  loadingTomorrowEvents: boolean;
}

const TomorrowScheduleSection: React.FC<TomorrowScheduleSectionProps> = ({
  selectedDate,
  nextDayStartTime,
  nextDayEndTime,
  tomorrowEvents,
  timeOptions,
  onDateChange,
  onStartTimeChange,
  onEndTimeChange,
  onScheduleFetch,
  formatDateForInput,
  formatSelectedDate,
  loadingTomorrowEvents
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 lg:p-6">
      <div className="flex items-center gap-3 mb-6">
        <Calendar className="w-6 h-6 text-accent" />
        <h2 className="text-lg lg:text-xl font-semibold text-gray-800">
          翌勤務日設定
        </h2>
      </div>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            日付
          </label>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={formatDateForInput(selectedDate)}
              onChange={onDateChange}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
            />
            <button
              onClick={onScheduleFetch}
              className="px-3 py-2 rounded-lg text-sm font-medium transition-colors bg-accent text-white hover:bg-accent/90"
            >
              更新
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            {formatSelectedDate(selectedDate)}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              開始時間
            </label>
            <TimeDropdown
              value={nextDayStartTime}
              onChange={onStartTimeChange}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              終了時間
            </label>
            <TimeDropdown
              value={nextDayEndTime}
              onChange={onEndTimeChange}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-700">
              予定勤務時間(休憩含)
            </h3>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-gray-500">
              {tomorrowEvents.length > 0 ? (
                `${tomorrowEvents.length}件の予定があります`
              ) : (
                '予定がありません'
              )}
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            特記事項
          </h3>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
            rows={4}
            placeholder="翌日の特別な予定や注意事項があれば入力してください"
          />
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            {formatSelectedDate(selectedDate)}の予定
          </h3>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 max-h-48 overflow-y-auto">
            {loadingTomorrowEvents ? (
              <div className="text-center py-4">
                <div className="w-4 h-4 border-2 border-accent/30 border-t-accent rounded-full animate-spin mx-auto mb-2" />
                <p className="text-sm text-gray-500">予定を取得中...</p>
              </div>
            ) : tomorrowEvents.length > 0 ? (
              <div className="space-y-2">
                {tomorrowEvents.map((event) => (
                  <div key={event.id} className="text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-accent font-medium">
                        {event.start.dateTime 
                          ? new Date(event.start.dateTime).toLocaleTimeString('ja-JP', { 
                              hour: '2-digit', 
                              minute: '2-digit',
                              timeZone: 'Asia/Tokyo'
                            })
                          : '終日'
                        }
                      </span>
                      <span className="text-gray-700">{event.summary}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">
                予定がありません
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TomorrowScheduleSection;