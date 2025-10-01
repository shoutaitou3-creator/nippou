import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { DailyReportData, InternalCalendarEvent } from '../types/daily-report';

export const usePreviousDayReport = (user: User | null, yesterdayDateString: string) => {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [submitMessage, setSubmitMessage] = useState('');

  // 既存の日報を読み込み
  const loadExistingReport = useCallback(async (
    date: string
  ): Promise<DailyReportData | null> => {
    if (!user) {
      console.log('No user authenticated, skipping report load');
      return null;
    }

    console.log('=== PreviousDayReport loadExistingReport デバッグ情報 ===');
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
        
        return report as DailyReportData;
      } else {
        console.log('日報が見つかりませんでした (data is null)');
      }
      
      return null;
    } catch (error) {
      console.error('日報読み込みエラー:', error);
      return null;
    }
  }, [user]);

  // 保存・提出処理
  const handleSave = useCallback(async (
    reportFields: {
      positive_reactions: string;
      achievements: string;
      challenges_issues: string;
      lessons_learned: string;
      work_content: string;
    },
    workStartTime: string,
    workEndTime: string,
    calendarEvents: InternalCalendarEvent[],
    draftStatus: boolean = true
  ) => {
    if (!user) {
      setSaveMessage('認証が必要です');
      setTimeout(() => setSaveMessage(''), 3000);
      return;
    }

    const setSaving = draftStatus ? setIsSaving : setIsSubmitting;
    const setMessage = draftStatus ? setSaveMessage : setSubmitMessage;

    setSaving(true);

    try {
      const reportData = {
        user_id: user.id,
        report_date: yesterdayDateString,
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

      const message = draftStatus ? '下書きを保存しました' : '日報を提出しました';
      setMessage(message);
      setTimeout(() => setMessage(''), 3000);

      // 日報提出後に勤務時間画面に遷移
      if (!draftStatus) {
        setTimeout(() => {
          navigate('/next-day-settings');
        }, 500);
      }

    } catch (error: any) {
      console.error('保存エラー:', error);
      const errorMessage = `${draftStatus ? '保存' : '提出'}に失敗しました: ${error.message}`;
      setMessage(errorMessage);
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setSaving(false);
    }
  }, [user, yesterdayDateString, navigate]);

  return {
    isSaving,
    isSubmitting,
    saveMessage,
    submitMessage,
    loadExistingReport,
    handleSave
  };
};