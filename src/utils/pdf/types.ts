import { DailyReportData, InternalCalendarEvent } from '../../types/daily-report';

export interface NextDaySettings {
  work_date: string;
  start_time: string;
  end_time: string;
  notes: string;
  calendar_events: any[];
}

export interface PDFData {
  reportDate: string;
  dailyReport: DailyReportData | null;
  nextDaySettings: NextDaySettings | null;
  userName: string;
}

export interface WorkTimeBreakdown {
  totalWork: string;
  categories: { name: string; time: string }[];
}

export interface PDFSection {
  render(data: any, currentY: number): number;
}