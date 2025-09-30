import React from 'react';
import { X, Clock, Calendar, User, MapPin } from 'lucide-react';
import { DailyReportData, InternalCalendarEvent } from '../types/daily-report';
import { calculateWorkTime, minutesToTimeString, getCategoryDisplayName } from '../utils/workTimeCalculator';
import { displayTime } from '../utils/timeUtils';

interface NextDaySettings {
  work_date: string;
  start_time: string;
  end_time: string;
  notes: string;
  calendar_events: any[];
}

interface ScreenshotModalProps {
  dailyReport: DailyReportData | null;
  nextDaySettings: NextDaySettings | null;
  reportDate: string;
  userName: string;
  onClose: () => void;
}

const ScreenshotModal: React.FC<ScreenshotModalProps> = ({
  dailyReport,
  nextDaySettings,
  reportDate,
  userName,
  onClose
}) => {
  // 時間フォーマット
  const formatTime = (timeString: string) => {
    return displayTime(timeString);
  };

  // 勤務時間計算
  const calculateDuration = (startTime: string, endTime: string): string => {
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    
    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;
    
    if (endMinutes <= startMinutes) {
      return '0分';
    }
    
    const diffMinutes = endMinutes - startMinutes;
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    
    return minutes > 0 ? `${hours}h${minutes}m` : `${hours}h`;
  };

  // 総勤務時間計算
  const getWorkTimeBreakdown = () => {
    if (!dailyReport?.calendar_events || dailyReport.calendar_events.length === 0) {
      return { totalWork: '0h', categories: [] };
    }

    const workStartTime = dailyReport.work_start_time || '09:00';
    const workEndTime = dailyReport.work_end_time || '18:00';
    const breakdown = calculateWorkTime(dailyReport.calendar_events, workStartTime, workEndTime);
    
    // 主要カテゴリのみを抽出（移動、会議、休憩）
    const mainCategories = [
      { key: 'travel', time: breakdown.travel },
      { key: 'meeting', time: breakdown.meeting },
      { key: 'break', time: breakdown.break }
    ].filter(cat => cat.time > 0);

    // 分を小数点形式に変換する関数
    const formatTimeToDecimal = (minutes: number): string => {
      if (minutes === 0) return '0h';
      
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      
      if (remainingMinutes === 0) {
        return `${hours}h`;
      } else {
        const decimalHours = hours + (remainingMinutes / 60);
        return `${decimalHours.toFixed(1)}h`;
      }
    };

    return {
      totalWork: formatTimeToDecimal(breakdown.totalWork),
      categories: mainCategories.map(cat => ({
        name: cat.key === 'travel' ? '移動' : cat.key === 'meeting' ? '会議' : '休憩',
        time: formatTimeToDecimal(cat.time)
      }))
    };
  };

  const workTimeData = getWorkTimeBreakdown();

  // 翌日の日付フォーマット
  const formatNextDayDate = () => {
    if (!nextDaySettings) return '';
    const date = new Date(nextDaySettings.work_date);
    return date.toLocaleDateString('ja-JP', {
      month: 'short',
      day: 'numeric',
      weekday: 'short'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-2">
      <div className="bg-white w-full max-w-sm mx-auto rounded-lg shadow-2xl overflow-hidden relative">
        {/* 閉じるボタン */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-10 bg-white rounded-full p-1 shadow-md hover:bg-gray-100 transition-colors"
        >
          <X className="w-4 h-4 text-gray-600" />
        </button>

        {/* スクリーンショット用コンテンツ */}
        <div className="p-3 text-xs leading-tight">
          {/* ヘッダー */}
          <div className="text-center mb-3 pb-2 border-b border-gray-200">
            <h1 className="text-sm font-bold text-primary">{reportDate} 日報 {userName}</h1>
          </div>

          {/* 勤務時間サマリー */}
          <div className="mb-3 bg-primary/5 rounded p-2">
            <div className="text-xs text-primary font-medium">
              勤務時間 開始{dailyReport?.work_start_time?.substring(0, 5) || '9:00'} 終了{dailyReport?.work_end_time?.substring(0, 5) || '18:00'} {workTimeData.totalWork}{workTimeData.categories.map((cat, index) => (
                <span key={index}> {cat.name}{cat.time}</span>
              ))}
            </div>
          </div>

          {/* 予定詳細 */}
          <div className="mb-3">
            <h2 className="text-xs font-semibold text-gray-800 mb-1">本日の業務</h2>
            {dailyReport?.calendar_events && dailyReport.calendar_events.length > 0 ? (
              <div className="space-y-1">
                {[...dailyReport.calendar_events]
                  .sort((a, b) => {
                    const timeA = a.startTime.split(':').map(Number);
                    const timeB = b.startTime.split(':').map(Number);
                    const minutesA = timeA[0] * 60 + timeA[1];
                    const minutesB = timeB[0] * 60 + timeB[1];
                    return minutesA - minutesB;
                  })
                  .map((event: InternalCalendarEvent, index) => (
                  <div key={event.id || index} className="bg-gray-50 rounded p-1 border-l-2 border-primary">
                    <div className="text-xs leading-tight">
                      <span className="font-bold text-primary font-mono">
                        {formatTime(event.startTime)}-{formatTime(event.endTime)}
                      </span>
                      <span className="font-semibold text-gray-800 mx-1">
                        {event.title}
                      </span>
                      {event.location && (
                        <span className="text-gray-600">
                          @{event.location}
                        </span>
                      )}
                      {event.description && (
                        <span className="text-gray-500 ml-1">
                          ({event.description.replace(/\n/g, '/').substring(0, 30)}{event.description.length > 30 ? '...' : ''})
                        </span>
                      )}
                    </div>
                  </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-2 text-gray-500 text-xs">
                業務なし
              </div>
            )}
          </div>

          {/* 報告事項 */}
          <div className="mb-3">
            <h2 className="text-xs font-semibold text-gray-800 mb-1">報告事項</h2>
            {dailyReport?.work_content && dailyReport.work_content.trim() !== '' ? (
              <div className="bg-blue-50 rounded p-2 text-xs">
                <p className="text-gray-700 leading-tight">
                  {dailyReport.work_content.replace(/\n/g, ' / ')}
                </p>
              </div>
            ) : (
              <div className="text-center py-2 text-gray-500 text-xs">
                報告事項なし
              </div>
            )}
          </div>

          {/* 翌勤務日情報 */}
          {nextDaySettings && (
            <div className="mb-2">
              <h2 className="text-xs font-semibold text-gray-800 mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-accent" />
                翌勤務日
              </h2>
              <div className="bg-accent/5 rounded p-2">
                <div className="text-xs leading-tight">
                  <span className="font-semibold text-accent">{formatNextDayDate()}</span>
                  <span className="font-mono text-gray-700 mx-2">
                    {formatTime(nextDaySettings.start_time)}-{formatTime(nextDaySettings.end_time)}
                  </span>
                  {nextDaySettings.notes && nextDaySettings.notes.trim() !== '' && (
                    <span className="text-gray-800 font-bold">
                      {nextDaySettings.notes.replace(/\n/g, '/')}
                    </span>
                  )}
                </div>
                {nextDaySettings.calendar_events && nextDaySettings.calendar_events.length > 0 && (
                  <div className="text-xs text-gray-600 mt-1 leading-tight">
                    {nextDaySettings.calendar_events.map((event: any, index: number) => (
                      <span key={event.id || index}>
                        {index > 0 && ' / '}
                        <span className="font-mono text-accent">
                          {event.start?.dateTime 
                            ? new Date(event.start.dateTime).toLocaleTimeString('ja-JP', { 
                                hour: '2-digit', 
                                minute: '2-digit',
                                hour12: false
                              })
                            : '終日'
                          }
                        </span>
                        <span className="ml-1">{event.summary || '無題'}</span>
                      </span>
                    ))}
                  </div>
                    )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ScreenshotModal;