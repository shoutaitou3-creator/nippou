import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { DailyReportData } from '../types/daily-report';
import { formatJSTDateToYYYYMMDD } from '../utils/dateUtils';

interface InternalCalendarEvent {
  id: string;
  startTime: string;
  endTime: string;
  title: string;
  description: string;
  location: string;
  participants: string;
  category: string;
}

export const useReportData = (user: User | null, isDevMode: boolean) => {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [submitMessage, setSubmitMessage] = useState('');

  const loadExistingReport = useCallback(async (
    date: string, 
    onReportLoad?: (report: DailyReportData) => void,
    setCalendarEvents?: (events: InternalCalendarEvent[]) => void
  ): Promise<DailyReportData | null> => {
    if (isDevMode && !user) {
      console.log('Dev mode: Skipping report load (no user)');
      return null;
    }

    if (!user) {
      console.log('No user authenticated, skipping report load');
      return null;
    }

    console.log('=== loadExistingReport デバッグ情報 ===');
    console.log('検索対象ユーザーID:', user.id);
    console.log('検索対象日付:', date);
    console.log('ユーザーメタデータ:', user.user_metadata);
    console.log('ユーザーemail:', user.email);
    try {
      console.log('Supabaseクエリ実行中...');
      const { data: report, error } = await supabase
        .from('daily_reports')
        .select('*')
        .eq('user_id', user.id)
        .eq('report_date', date)
        .single();

      console.log('Supabaseクエリ結果:');
      console.log('- data:', report);
      console.log('- error:', error);
      console.log('- error code:', error?.code);
      if (error && error.code !== 'PGRST116') {
        console.error('既存日報読み込みエラー:', error);
        return null;
      }

      if (report) {
        console.log('日報が見つかりました:', {
          id: report.id,
          user_id: report.user_id,
          report_date: report.report_date,
          draft_status: report.draft_status,
          submitted_at: report.submitted_at,
          work_content_length: report.work_content?.length || 0
        });
        
        if (onReportLoad) {
          onReportLoad(report as DailyReportData);
        }
        
        if (report.calendar_events && setCalendarEvents) {
          setCalendarEvents(report.calendar_events);
        }
        
        return report as DailyReportData;
      } else {
        console.log('日報が見つかりませんでした (data is null)');
      }
      
      return null;
    } catch (error) {
      console.error('日報読み込みエラー:', error);
      console.error('エラー詳細:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      return null;
    }
  }, [user, isDevMode]);

  const handleSave = useCallback(async (
    selectedDate: Date,
    reportFields: {
      positive_reactions: string;
      achievements: string;
      challenges_issues: string;
      lessons_learned: string;
      work_content: string;
    },
    calendarEvents: InternalCalendarEvent[],
    workStartTime?: string,
    workEndTime?: string,
    draftStatus: boolean = true
  ) => {
    if (isDevMode && !user) {
      console.log('Dev mode: Skipping save (no user)');
      setSaveMessage('Dev mode: 保存をスキップしました（ユーザー未認証）');
      setTimeout(() => setSaveMessage(''), 3000);
      return;
    }

    if (!user) {
      setSaveMessage('認証が必要です');
      setTimeout(() => setSaveMessage(''), 3000);
      return;
    }

    setIsSaving(true);
    const dateString = formatJSTDateToYYYYMMDD(selectedDate);
    try {
      const reportData = {
        user_id: user.id,
        report_date: dateString,
        work_start_time: workStartTime,
        work_end_time: workEndTime,
        positive_reactions: reportFields.positive_reactions,
        achievements: reportFields.achievements,
        challenges_issues: reportFields.challenges_issues,
        lessons_learned: reportFields.lessons_learned,
        work_content: reportFields.work_content,
        calendar_events: calendarEvents,
        draft_status: draftStatus,
        submitted_at: draftStatus ? null : new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('daily_reports')
        .upsert(reportData, {
          onConflict: 'user_id,report_date'
        });

      if (error) {
        throw error;
      }

      setSaveMessage(draftStatus ? '下書きを保存しました' : '日報を提出しました');
      setTimeout(() => setSaveMessage(''), 3000);

    } catch (error: any) {
      console.error('保存エラー:', error);
      setSaveMessage('保存に失敗しました: ' + error.message);
      setTimeout(() => setSaveMessage(''), 3000);
    } finally {
      setIsSaving(false);
    }
  }, [user, isDevMode]);

  const handleSubmit = useCallback(async (
    selectedDate: Date,
    reportFields: {
      positive_reactions: string;
      achievements: string;
      challenges_issues: string;
      lessons_learned: string;
      work_content: string;
    },
    calendarEvents: InternalCalendarEvent[],
    workStartTime?: string,
    workEndTime?: string
  ) => {
    setIsSubmitting(true);
    try {
      if (isDevMode && !user) {
        console.log('Dev mode: Skipping submit (no user)');
        setSubmitMessage('Dev mode: 提出をスキップしました（ユーザー未認証）');
        setTimeout(() => setSubmitMessage(''), 3000);
        return;
      }

      if (!user) {
        setSubmitMessage('認証が必要です');
        setTimeout(() => setSubmitMessage(''), 3000);
        return;
      }

      const dateString = formatJSTDateToYYYYMMDD(selectedDate);
      const reportData = {
        user_id: user.id,
        report_date: dateString,
        work_start_time: workStartTime,
        work_end_time: workEndTime,
        positive_reactions: reportFields.positive_reactions,
        achievements: reportFields.achievements,
        challenges_issues: reportFields.challenges_issues,
        lessons_learned: reportFields.lessons_learned,
        work_content: reportFields.work_content,
        calendar_events: calendarEvents,
        draft_status: false,
        submitted_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('daily_reports')
        .upsert(reportData, {
          onConflict: 'user_id,report_date'
        });

      if (error) {
        throw error;
      }

      setSubmitMessage('日報を提出しました');
      setTimeout(() => setSubmitMessage(''), 3000);

      // 日報提出後に勤務時間画面に遷移
      setTimeout(() => {
        navigate('/next-day-settings');
      }, 500);

    } catch (error: any) {
      console.error('提出エラー:', error);
      setSubmitMessage('提出に失敗しました: ' + error.message);
      setTimeout(() => setSubmitMessage(''), 3000);
    } finally {
      setIsSubmitting(false);
    }
  }, [user, isDevMode, navigate]);

  return {
    isSaving,
    isSubmitting,
    saveMessage,
    submitMessage,
    loadExistingReport,
    handleSave,
    handleSubmit
  };
};