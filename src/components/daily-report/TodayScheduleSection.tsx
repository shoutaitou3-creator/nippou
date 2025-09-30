import React from 'react';
import { Clock, Calendar, Plus, Edit, Users, MapPin, Eye, Copy } from 'lucide-react'; // Import Copy icon
import { InternalCalendarEvent, DailyReportData } from '../../types/daily-report'; // Import DailyReportData
import { displayTime } from '../../utils/timeUtils';
import { generateScreenshotTextContent } from '../../utils/screenshotTextFormatter'; // Import the new formatter

interface TodayScheduleSectionProps {
  calendarEvents: InternalCalendarEvent[];
  calendarLoading: boolean;
  calendarError: string | null;
  onAddEvent: () => void;
  onEditEvent: (event: InternalCalendarEvent) => void;
  isReadOnly?: boolean;
  onShowScreenshot?: () => void;
  // New props for copy functionality
  dailyReport: DailyReportData | null; // Pass the full dailyReport object
  reportDate: string; // Formatted report date string
  userName: string;
}

const TodayScheduleSection: React.FC<TodayScheduleSectionProps> = ({
  calendarEvents,
  calendarLoading,
  calendarError,
  onAddEvent,
  onEditEvent,
  isReadOnly = false,
  onShowScreenshot,
  dailyReport, // Destructure new props
  reportDate,
  userName
}) => {
  const [copyButtonText, setCopyButtonText] = React.useState('勤務開始時コピー');

  // 開始時間順にソートされたイベント
  const sortedEvents = React.useMemo(() => {
    return [...calendarEvents].sort((a, b) => {
      const timeA = displayTime(a.startTime).split(':').map(Number);
      const timeB = displayTime(b.startTime).split(':').map(Number);
      const minutesA = timeA[0] * 60 + timeA[1];
      const minutesB = timeB[0] * 60 + timeB[1];
      return minutesA - minutesB;
    });
  }, [calendarEvents]);

  const handleCopy = async () => {
    if (!dailyReport) {
      console.error('Daily report data is not available for copying.');
      return;
    }

    try {
      // Generate the text content using the formatter
      const textToCopy = generateScreenshotTextContent({
        dailyReport: dailyReport,
        nextDaySettings: null, // As per current ScreenshotModal usage in DailyReportCreate.tsx
        reportDate: reportDate,
        userName: userName,
        includeNextDay: false // 勤務開始時コピーでは翌勤務日情報を除外
      });

      await navigator.clipboard.writeText(textToCopy);
      setCopyButtonText('コピーしました');
      setTimeout(() => {
        setCopyButtonText('勤務開始時コピー');
      }, 2000); // Revert text after 2 seconds
    } catch (err) {
      console.error('Failed to copy text: ', err);
      setCopyButtonText('コピー失敗');
      setTimeout(() => {
        setCopyButtonText('勤務開始時コピー');
      }, 2000);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 lg:p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
          <Clock className="w-6 h-6 text-primary" />
          <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-800 truncate">
            当日の予定
          </h2>
          <div className="flex items-center gap-2 flex-shrink-0"> {/* Group buttons */}
            {onShowScreenshot && (
              <button
                onClick={onShowScreenshot}
                className="bg-primary text-white py-1.5 px-2 sm:py-2 sm:px-3 lg:px-4 rounded-lg text-xs sm:text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-1 sm:gap-2 whitespace-nowrap shadow-sm"
              >
                <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">勤務開始時スクショ</span>
                <span className="sm:hidden">スクショ</span>
              </button>
            )}
            <button
              onClick={handleCopy}
              disabled={copyButtonText === 'コピーしました' || copyButtonText === 'コピー失敗'}
              className="bg-accent text-white py-1.5 px-2 sm:py-2 sm:px-3 lg:px-4 rounded-lg text-xs sm:text-sm font-medium hover:bg-accent/90 transition-colors flex items-center gap-1 sm:gap-2 whitespace-nowrap shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">{copyButtonText}</span>
              <span className="sm:hidden">
                {copyButtonText === '勤務開始時コピー' ? 'コピー' : 
                 copyButtonText === 'コピーしました' ? 'コピー済' : 
                 copyButtonText === 'コピー失敗' ? '失敗' : copyButtonText}
              </span>
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0"> {/* This div is for the "予定追加" button */}
          {!isReadOnly && (
            <button
              onClick={onAddEvent}
              disabled={isReadOnly}
              className="bg-secondary text-white py-1.5 px-2 sm:py-2 sm:px-3 lg:px-4 rounded-lg text-xs sm:text-sm font-medium hover:bg-secondary/90 transition-colors flex items-center gap-1 sm:gap-2 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline sm:inline">予定追加</span>
              <span className="xs:hidden sm:hidden">追加</span>
            </button>
          )}
        </div>
      </div>
      
      {calendarLoading && (
        <div className="text-center py-8">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Googleカレンダーから予定を取得中...</p>
        </div>
      )}
      
      {sortedEvents.map((event) => (
        <div key={event.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="text-sm text-primary font-medium mb-2">
                {displayTime(event.startTime)} - {displayTime(event.endTime)}
              </div>
              
              <h4 className="text-lg font-semibold text-gray-800 mb-2 break-words">
                {event.title || '無題の予定'}
              </h4>
              
              {event.description && (
                <p className="text-gray-600 text-sm mb-2 break-words">
                  {event.description}
                </p>
              )}
              
              <div className="flex items-center gap-4 text-sm text-gray-500">
                {event.participants && (
                  <div className="flex items-center gap-1 min-w-0 flex-wrap">
                    <Users className="w-4 h-4" />
                    <span className="break-words">{event.participants}</span>
                  </div>
                )}
                {event.location && (
                  <div className="flex items-center gap-1 min-w-0 flex-wrap">
                    <MapPin className="w-4 h-4" />
                    <span className="break-words">{event.location}</span>
                  </div>
                )}
              </div>
            </div>
            
            <button
              onClick={() => onEditEvent(event)}
              disabled={isReadOnly}
              className="text-gray-400 hover:text-primary transition-colors p-1 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
            >
              <Edit className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
      
      {sortedEvents.length === 0 && !calendarLoading && (
        <div className="text-center py-12 text-gray-500">
          <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p className="text-lg">予定がありません</p>
          <p className="text-sm">
            {isReadOnly ? '予定が登録されていませんでした' : '手動で予定を追加してください'}
          </p>
        </div>
      )}
    </div>
  );
};

export default TodayScheduleSection;