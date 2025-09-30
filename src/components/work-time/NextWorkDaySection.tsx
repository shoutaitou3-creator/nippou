import React from 'react';
import { ArrowRight, Calendar } from 'lucide-react';
import { formatJSTDateForDisplay, parseJSTDateString } from '../../utils/dateUtils';
import { displayTime, calculateWorkDuration } from '../../utils/timeUtils';

interface NextDaySettings {
  work_date: string;
  start_time: string;
  end_time: string;
  notes: string;
  calendar_events: any[];
}

interface NextWorkDaySectionProps {
  nextDaySettings: NextDaySettings | null;
}

const NextWorkDaySection: React.FC<NextWorkDaySectionProps> = ({ nextDaySettings }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-3 mb-6">
        <ArrowRight className="w-6 h-6 text-accent" />
        <h2 className="text-xl font-semibold text-gray-800">翌勤務日の情報</h2>
      </div>
      
      {nextDaySettings ? (
        <div className="space-y-6">
          {/* 基本情報 */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 p-4 bg-accent/5 rounded-lg border border-accent/20">
            <div className="text-center">
              <p className="text-xs sm:text-sm text-gray-600 mb-1">勤務日</p>
              <p className="font-medium text-gray-800 text-xs sm:text-base">
                {formatJSTDateForDisplay(parseJSTDateString(nextDaySettings.work_date))}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs sm:text-sm text-gray-600 mb-1">勤務時間</p>
              <p className="font-medium text-accent text-xs sm:text-base">
                {displayTime(nextDaySettings.start_time)} - {displayTime(nextDaySettings.end_time)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs sm:text-sm text-gray-600 mb-1">予定勤務時間</p>
              <p className="font-medium text-accent text-xs sm:text-base">
                {calculateWorkDuration(nextDaySettings.start_time, nextDaySettings.end_time)}
              </p>
            </div>
          </div>

          {/* 特記事項 */}
          {nextDaySettings.notes && nextDaySettings.notes.trim() !== '' && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-medium text-blue-800 mb-2">特記事項</h3>
              <p className="text-blue-700 whitespace-pre-wrap">{nextDaySettings.notes}</p>
            </div>
          )}

          {/* 翌日の予定 */}
          <div>
            <h3 className="font-medium text-gray-800 mb-3">
              {formatJSTDateForDisplay(parseJSTDateString(nextDaySettings.work_date))}の予定
            </h3>
            {nextDaySettings.calendar_events && nextDaySettings.calendar_events.length > 0 ? (
              <div className="space-y-3">
                {nextDaySettings.calendar_events.map((event: any, index: number) => (
                  <div key={event.id || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                    <div className="flex items-center gap-4">
                      <div className="text-accent font-mono text-sm">
                        {event.start?.dateTime 
                          ? new Date(event.start.dateTime).toLocaleTimeString('ja-JP', { 
                              hour: '2-digit', 
                              minute: '2-digit',
                              timeZone: 'Asia/Tokyo'
                            })
                          : '終日'
                        } - {event.end?.dateTime 
                          ? new Date(event.end.dateTime).toLocaleTimeString('ja-JP', { 
                              hour: '2-digit', 
                              minute: '2-digit',
                              timeZone: 'Asia/Tokyo'
                            })
                          : '終日'
                        }
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">{event.summary || '無題の予定'}</h4>
                        {event.location && (
                          <p className="text-sm text-gray-500">{event.location}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm">翌日の予定はありません</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <ArrowRight className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium mb-2">翌勤務日の設定がありません</p>
          <p className="text-sm">翌勤務日設定画面で事前に設定してください</p>
        </div>
      )}
    </div>
  );
};

export default NextWorkDaySection;