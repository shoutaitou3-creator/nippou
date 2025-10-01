import React from 'react';
import WorkTimeSection from './WorkTimeSection';
import TodayScheduleSection from './TodayScheduleSection';
import ReportSectionNew from './ReportSectionNew';
import { InternalCalendarEvent, DailyReportData, ReportCategory, UserTemplate } from '../../types/daily-report';

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
  reportFields: {
    positive_reactions: string;
    achievements: string;
    challenges_issues: string;
    lessons_learned: string;
    other_notes: string;
  };
  onFieldChange: (field: ReportCategory, value: string) => void;
  templates: UserTemplate[];
  // New props for copy functionality
  dailyReport: DailyReportData | null;
  reportDate: string;
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
  reportFields,
  onFieldChange,
  templates,
  dailyReport,
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

      <ReportSectionNew
        reportFields={reportFields}
        onFieldChange={onFieldChange}
        templates={templates}
        isReadOnly={isReadOnly}
      />
    </div>
  );
};

export default DailyReportFormContent;