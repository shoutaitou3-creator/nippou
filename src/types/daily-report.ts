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
  positive_reactions: string;
  achievements: string;
  challenges_issues: string;
  lessons_learned: string;
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

export type ReportCategory =
  | 'positive_reactions'
  | 'achievements'
  | 'challenges_issues'
  | 'lessons_learned'
  | 'work_content';

export interface UserTemplate {
  id: string;
  user_id: string;
  category: ReportCategory;
  template_name: string;
  template_content: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface ReportField {
  key: ReportCategory;
  label: string;
  placeholder: string;
}