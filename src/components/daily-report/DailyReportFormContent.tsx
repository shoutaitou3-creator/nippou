import React from 'react';
import WorkTimeSection from './WorkTimeSection';
import TodayScheduleSection from './TodayScheduleSection';
import ReportSection from './ReportSection';
import { InternalCalendarEvent, DailyReportData } from '../../types/daily-report'; // Import DailyReportData

interface DailyReportFormContentProps {
  workStartTime: string;
  workEndTime: string;
  onWorkStartTimeChange: (time: string) => void;
  onWorkEndTimeChange: (time: string) => void;
  calendarEvents: InternalCalendarEvent[];
  calendarLoading: boolean;
  calendarError: string | null;
  onAddEvent: () => void;
  onEditEvent: (event: InternalCalendarEvent) => void;
  isReadOnly: boolean;
  onShowScreenshot?: () => void;
  reportContent: string;
  onReportContentChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  showQuickInsert: boolean;
  onToggleQuickInsert: () => void;
  onQuickInsert: (text: string) => void;
  // New props for copy functionality
  dailyReport: DailyReportData | null; // Pass the full dailyReport object
  reportDate: string; // Formatted report date string
  userName: string;
}

const DailyReportFormContent: React.FC<DailyReportFormContentProps> = ({
  workStartTime,
  workEndTime,
  onWorkStartTimeChange,
  onWorkEndTimeChange,
  calendarEvents,
  calendarLoading,
  calendarError,
  onAddEvent,
  onEditEvent,
  isReadOnly,
  onShowScreenshot,
  reportContent,
  onReportContentChange,
  showQuickInsert,
  onToggleQuickInsert,
  onQuickInsert,
  dailyReport, // Destructure new props
  reportDate,
  userName
}) => {
  return (
    <div className="space-y-6 lg:space-y-8">
      <WorkTimeSection
        workStartTime={workStartTime}
        workEndTime={workEndTime}
        onWorkStartTimeChange={onWorkStartTimeChange}
        onWorkEndTimeChange={onWorkEndTimeChange}
        isReadOnly={isReadOnly}
      />

      <TodayScheduleSection
        calendarEvents={calendarEvents}
        calendarLoading={calendarLoading}
        calendarError={calendarError}
        onAddEvent={onAddEvent}
        onEditEvent={onEditEvent}
        isReadOnly={isReadOnly}
        onShowScreenshot={onShowScreenshot}
        dailyReport={dailyReport} // Pass new props
        reportDate={reportDate}
        userName={userName}
      />

      <ReportSection
        reportContent={reportContent}
        onReportContentChange={onReportContentChange}
        showQuickInsert={showQuickInsert}
        onToggleQuickInsert={onToggleQuickInsert}
        onQuickInsert={onQuickInsert}
        isReadOnly={isReadOnly}
      />
    </div>
  );
};

export default DailyReportFormContent;