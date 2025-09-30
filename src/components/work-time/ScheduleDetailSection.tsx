import React from 'react';
import { Calendar } from 'lucide-react';
import { DailyReportData, InternalCalendarEvent } from '../../types/daily-report';
import { displayTime, calculateWorkDuration } from '../../utils/timeUtils';
import { timeToMinutes } from '../../utils/workTimeCalculator';

interface ScheduleDetailSectionProps {
  dailyReport: DailyReportData | null;
}

const ScheduleDetailSection: React.FC<ScheduleDetailSectionProps> = ({ dailyReport }) => {
  // 勤務時間内に調整されたイベントを取得
  const getAdjustedEvents = (): InternalCalendarEvent[] => {
    if (!dailyReport?.calendar_events || dailyReport.calendar_events.length === 0) {
      return [];
    }

    // 勤務開始・終了時間を取得（デフォルト値付き）
    const workStartTime = dailyReport.work_start_time || '09:00';
    const workEndTime = dailyReport.work_end_time || '18:00';
    const workStartMinutes = timeToMinutes(workStartTime);
    const workEndMinutes = timeToMinutes(workEndTime);

    // 各イベントを勤務時間内に調整
    const adjustedEvents = dailyReport.calendar_events
      .map((event: InternalCalendarEvent) => {
        const eventStartMinutes = timeToMinutes(event.startTime);
        const eventEndMinutes = timeToMinutes(event.endTime);

        // イベントが勤務時間と重複しているかチェック
        if (eventStartMinutes >= workEndMinutes || eventEndMinutes <= workStartMinutes) {
          return null; // 勤務時間外のイベントは除外
        }

        // 勤務時間内に調整
        const adjustedStartMinutes = Math.max(eventStartMinutes, workStartMinutes);
        const adjustedEndMinutes = Math.min(eventEndMinutes, workEndMinutes);

        // 調整後の時間を文字列に変換
        const adjustedStartTime = `${Math.floor(adjustedStartMinutes / 60).toString().padStart(2, '0')}:${(adjustedStartMinutes % 60).toString().padStart(2, '0')}`;
        const adjustedEndTime = `${Math.floor(adjustedEndMinutes / 60).toString().padStart(2, '0')}:${(adjustedEndMinutes % 60).toString().padStart(2, '0')}`;

        return {
          ...event,
          startTime: adjustedStartTime,
          endTime: adjustedEndTime
        };
      })
      .filter((event): event is InternalCalendarEvent => event !== null);

    return adjustedEvents;
  };

  const adjustedEvents = getAdjustedEvents();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">本日の予定詳細</h2>
      
      {adjustedEvents.length > 0 ? (
        <div className="space-y-4">
          {[...adjustedEvents]
            .sort((a, b) => {
              const timeA = a.startTime.split(':').map(Number);
              const timeB = b.startTime.split(':').map(Number);
              const minutesA = timeA[0] * 60 + timeA[1];
              const minutesB = timeB[0] * 60 + timeB[1];
              return minutesA - minutesB;
            })
            .map((event: InternalCalendarEvent) => (
            <div key={event.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="text-primary font-mono">
                  {displayTime(event.startTime)} - {displayTime(event.endTime)}
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">{event.title}</h3>
                  {event.location && (
                    <p className="text-sm text-gray-500">{event.location}</p>
                  )}
                  {event.description && (
                    <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                  )}
                </div>
              </div>
              <div className="text-sm text-gray-500">
                {calculateWorkDuration(event.startTime, event.endTime)}
              </div>
            </div>
            ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium mb-2">
            {dailyReport ? '勤務時間内の予定がありません' : '日報が提出されていません'}
          </p>
          <p className="text-sm">
            {dailyReport ? '勤務時間内の予定が登録されていませんでした' : '日報を提出すると予定詳細が表示されます'}
          </p>
        </div>
      )}
    </div>
  );
};

export default ScheduleDetailSection;