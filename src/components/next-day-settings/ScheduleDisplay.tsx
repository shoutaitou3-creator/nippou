import React, { memo } from 'react';
import { RefreshCw, AlertCircle } from 'lucide-react';
import { CalendarEvent } from '../../types/calendar';

interface ScheduleDisplayProps {
  calendarEvents: CalendarEvent[];
  calendarLoading: boolean;
  calendarError: string | null;
  hasCalendarPermission: boolean;
  onFetchSchedule: () => void;
}

const ScheduleDisplay: React.FC<ScheduleDisplayProps> = memo(({
  calendarEvents,
  calendarLoading,
  calendarError,
  hasCalendarPermission,
  onFetchSchedule
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-3">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">翌日の予定</h2>
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onFetchSchedule}
          disabled={calendarLoading || !hasCalendarPermission}
          className="flex items-center gap-2 px-3 py-1 text-sm text-accent hover:bg-accent/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw className={`w-4 h-4 ${calendarLoading ? 'animate-spin' : ''}`} />
          更新
        </button>
      </div>
      
      {/* カレンダー権限チェック */}
      {!hasCalendarPermission && (
        <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg mb-4">
          <p className="text-orange-700 text-sm">
            <AlertCircle className="w-4 h-4 inline mr-2" />
            Googleカレンダーの権限が必要です。ログインし直してください。
          </p>
        </div>
      )}

      {/* カレンダーエラー */}
      {calendarError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
          <p className="text-red-700 text-sm">
            <AlertCircle className="w-4 h-4 inline mr-2" />
            {calendarError}
          </p>
        </div>
      )}

      {/* ローディング */}
      {calendarLoading && (
        <div className="text-center py-8">
          <div className="w-6 h-6 border-2 border-accent/30 border-t-accent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-sm text-gray-500">予定を取得中...</p>
        </div>
      )}
      
      {/* 予定一覧 */}
      <div className="space-y-3">
        {calendarEvents.length > 0 ? (
          calendarEvents.map((event) => (
            <div key={event.id} className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-800">{event.summary || '無題の予定'}</div>
                  <div className="text-sm text-gray-500">
                    {event.start.dateTime 
                      ? new Date(event.start.dateTime).toLocaleTimeString('ja-JP', { 
                          hour: '2-digit', 
                          minute: '2-digit',
                          hour12: false 
                        })
                      : '終日'
                    } - {event.end.dateTime 
                      ? new Date(event.end.dateTime).toLocaleTimeString('ja-JP', { 
                          hour: '2-digit', 
                          minute: '2-digit',
                          hour12: false 
                        })
                      : '終日'
                    }
                  </div>
                </div>
                <div className="text-xs text-gray-400">
                  {event.location || ''}
                </div>
              </div>
            </div>
          ))
        ) : (
          !calendarLoading && hasCalendarPermission && (
            <p className="text-sm text-gray-500 text-center py-4">
              予定がありません
            </p>
          )
        )}
      </div>
    </div>
  );
});

ScheduleDisplay.displayName = 'ScheduleDisplay';

export default ScheduleDisplay;