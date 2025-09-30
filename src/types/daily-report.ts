// 日報関連の型定義

export interface InternalCalendarEvent {
  id: string;
  startTime: string;
  endTime: string;
  title: string;
  description: string;
  location: string;
  participants: string;
}

export interface DailyReportData {
  id?: string;
  user_id: string;
  report_date: string;
  work_start_time?: string;
  work_end_time?: string;
  work_content: string;
  business_results?: string;
  challenges?: string;
  report_notes?: string;
  tomorrow_plan?: string;
  calendar_events: InternalCalendarEvent[];
  draft_status: boolean;
  submitted_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SaveMessage {
  type: 'success' | 'error';
  message: string;
}