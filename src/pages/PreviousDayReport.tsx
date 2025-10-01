import React, { useState, useEffect, useCallback } from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCalendar } from '../hooks/useCalendar';
import { useEventModalManager } from '../components/daily-report/EventModalManager';
import { usePreviousDayReport } from '../hooks/usePreviousDayReport';
import Header from '../components/Header';
import DailyReportHeader from '../components/daily-report/DailyReportHeader';
import TodayScheduleSection from '../components/daily-report/TodayScheduleSection';
import ReportSectionNew from '../components/daily-report/ReportSectionNew';
import WorkTimeSection from '../components/daily-report/WorkTimeSection';
import { useUserTemplates } from '../hooks/useUserTemplates';
import PreviousDayReportHeader from '../components/previous-day-report/PreviousDayReportHeader';
import SubmissionStatusCard from '../components/previous-day-report/SubmissionStatusCard';
import OperationGuideCard from '../components/previous-day-report/OperationGuideCard';
import CalendarFetchPrompt from '../components/previous-day-report/CalendarFetchPrompt';
import { InternalCalendarEvent } from '../types/daily-report';
import { CalendarEvent } from '../types/calendar';

const PreviousDayReport: React.FC = () => {
  const { user, signOut } = useAuth();
  
  // 日本時間で前日の日付を正しく計算
  const yesterdayDate = React.useMemo(() => {
    // 日本時間で今日を取得
    const now = new Date();
    const japanTime = new Date(now.getTime() + (9 * 60 * 60 * 1000));
    
    // 日本時間で前日を計算
    const yesterday = new Date(japanTime);
    yesterday.setDate(japanTime.getDate() - 1);
    
    console.log('=== 前日計算デバッグ ===');
    console.log('現在のUTC時刻:', now.toISOString());
    console.log('日本時間:', japanTime.toISOString());
    console.log('前日（日本時間）:', yesterday.toISOString());
    
    return yesterday;
  }, []);
  
  // 日本時間ベースで日付文字列を生成
  const yesterdayDateString = React.useMemo(() => {
    const dateString = yesterdayDate.toISOString().split('T')[0];
    console.log('前日の日付文字列:', dateString);
    return dateString;
  }, [yesterdayDate]);
  
  // カレンダー関連
  const { 
    hasCalendarPermission,
    fetchCalendarEvents, 
    calendarLoading, 
    calendarError, 
    setCalendarError
  } = useCalendar(user);
  
  // 状態管理
  const [reportFields, setReportFields] = useState({
    positive_reactions: '',
    achievements: '',
    challenges_issues: '',
    lessons_learned: '',
    other_notes: ''
  });
  const [workStartTime, setWorkStartTime] = useState('09:00');
  const [workEndTime, setWorkEndTime] = useState('18:00');
  const [calendarEvents, setCalendarEvents] = useState<InternalCalendarEvent[]>([]);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [showCalendarFetchPrompt, setShowCalendarFetchPrompt] = useState(false);
  const [existingReport, setExistingReport] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSubmitConfirmDialog, setShowSubmitConfirmDialog] = useState(false);

  // カスタムフック
  const {
    isSaving,
    isSubmitting,
    saveMessage,
    submitMessage,
    loadExistingReport,
    handleSave: handleSaveReport
  } = usePreviousDayReport(user, yesterdayDateString);

  const { templates } = useUserTemplates(user);
  
  // 報告内容変更ハンドラー
  const handleFieldChange = useCallback((field: string, value: string) => {
    setReportFields(prev => ({ ...prev, [field]: value }));
  }, []);

  // イベントモーダル管理
  const {
    openEditModal,
    openAddModal,
    EventModals
  } = useEventModalManager(calendarEvents, setCalendarEvents);

  const handleSignOut = useCallback(async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('ログアウト処理エラー:', error);
    }
  }, [signOut]);

  // 日付フォーマット
  const formatSelectedDate = (date: Date) => {
    const formatted = date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
    
    // 曜日を括弧書きに変換
    return formatted
      .replace('日曜日', '(日)')
      .replace('月曜日', '(月)')
      .replace('火曜日', '(火)')
      .replace('水曜日', '(水)')
      .replace('木曜日', '(木)')
      .replace('金曜日', '(金)')
      .replace('土曜日', '(土)');
  };

  // カレンダーイベントを内部形式に変換
  const convertCalendarEvents = useCallback((events: CalendarEvent[]): InternalCalendarEvent[] => {
    return events.map((event: CalendarEvent) => ({
      id: event.id,
      startTime: event.start.dateTime 
        ? new Date(event.start.dateTime).toLocaleTimeString('ja-JP', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
          })
        : '00:00',
      endTime: event.end.dateTime 
        ? new Date(event.end.dateTime).toLocaleTimeString('ja-JP', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
          })
        : '23:59',
      title: event.summary || '無題の予定',
      description: event.description || '',
      location: event.location || '',
      participants: ''
    }));
  }, []);

  // 日付範囲を取得
  const getDateRange = useCallback((date: Date) => {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    
    return {
      timeMin: start.toISOString(),
      timeMax: end.toISOString()
    };
  }, []);

  // Googleカレンダーから予定を取得
  const fetchCalendarData = useCallback(async () => {
    if (!hasCalendarPermission) {
      console.log('カレンダー権限がありません');
      return;
    }

    setCalendarError(null);
    
    try {
      const { timeMin, timeMax } = getDateRange(yesterdayDate);
      console.log('=== 前日の予定を取得中 ===', { timeMin, timeMax });
      
      const events = await fetchCalendarEvents(timeMin, timeMax);
      const internalEvents = convertCalendarEvents(events);
      setCalendarEvents(internalEvents);
      
      console.log('=== カレンダーデータ取得成功 ===', {
        eventCount: internalEvents.length,
        events: internalEvents
      });
      
    } catch (error) {
      console.error('=== カレンダーデータ取得エラー ===', error);
      const errorMessage = error instanceof Error ? error.message : 'カレンダーデータの取得に失敗しました';
      setCalendarError(errorMessage);
    }
  }, [hasCalendarPermission, fetchCalendarEvents, getDateRange, yesterdayDate, convertCalendarEvents, setCalendarError]);

  // 初期データ読み込み
  useEffect(() => {
    const loadInitialData = async () => {
      console.log('=== PreviousDayReport 初期データ読み込み開始 ===');
      console.log('現在のユーザー:', user ? {
        id: user.id,
        email: user.email,
        user_metadata: user.user_metadata
      } : 'null');
      console.log('前日の日付文字列:', yesterdayDateString);
      console.log('前日のDateオブジェクト:', yesterdayDate);
      
      // プロンプト表示状態を初期化
      setShowCalendarFetchPrompt(false);
      console.log('プロンプト表示状態を初期化: false');
      
      setIsLoading(true);
      
      try {
        // 既存の日報を読み込み
        console.log('loadExistingReport を呼び出し中...');
        const report = await loadExistingReport(yesterdayDateString);
        console.log('loadExistingReport の結果:', report);
        
        if (report) {
          console.log('日報が見つかりました - 設定中...');
          setExistingReport(report);
          // 既存の日報内容を各フィールドに設定
          setReportFields({
            positive_reactions: report.positive_reactions || '',
            achievements: report.achievements || '',
            challenges_issues: report.challenges_issues || '',
            lessons_learned: report.lessons_learned || '',
            other_notes: report.other_notes || ''
          });
          setWorkStartTime(report.work_start_time || '09:00');
          setWorkEndTime(report.work_end_time || '18:00');
          
          if (report.calendar_events) {
            console.log('カレンダーイベントを設定:', report.calendar_events.length, '件');
            setCalendarEvents(report.calendar_events);
          }
          
          // 提出済みの場合は読み取り専用
          if (!report.draft_status) {
            console.log('提出済み日報のため読み取り専用モードに設定');
            setIsReadOnly(true);
          } else {
            console.log('下書き日報のため編集可能モードに設定');
            // 下書きの場合は編集可能だが、カレンダー取得プロンプトは表示しない
            setIsReadOnly(false);
          }
          
          // 日報が存在する場合はプロンプトを表示しない
          console.log('日報が存在するため、プロンプトは表示しません');
        } else {
          console.log('日報が見つからないため、カレンダー取得プロンプトを表示');
          // 日報が存在しない場合、カレンダー取得プロンプトを表示
          setShowCalendarFetchPrompt(true);
          console.log('プロンプト表示状態を設定: true');
        }
      } catch (error) {
        console.error('初期データ読み込みエラー:', error);
        // エラーが発生した場合もプロンプトは表示しない
        setShowCalendarFetchPrompt(false);
        console.log('エラー発生のため、プロンプト表示状態を false に設定');
      } finally {
        console.log('初期データ読み込み完了');
        setIsLoading(false);
      }
    };

    console.log('=== useEffect triggered ===');
    console.log('user exists:', !!user);
    console.log('loadExistingReport function exists:', !!loadExistingReport);
    
    loadInitialData();
  }, [loadExistingReport, yesterdayDateString]);

  // カレンダー取得プロンプトの処理
  const handleCalendarFetchYes = async () => {
    setShowCalendarFetchPrompt(false);
    await fetchCalendarData();
  };

  const handleCalendarFetchNo = () => {
    setShowCalendarFetchPrompt(false);
  };

  // 保存・提出処理
  const onSave = () => {
    handleSaveReport(reportFields, workStartTime, workEndTime, calendarEvents, true);
  };

  const onSubmit = () => {
    setShowSubmitConfirmDialog(true);
  };

  const handleConfirmSubmit = () => {
    setShowSubmitConfirmDialog(false);
    handleSaveReport(reportFields, workStartTime, workEndTime, calendarEvents, false);
  };
  
  const handleCancelSubmit = () => {
    setShowSubmitConfirmDialog(false);
  };

  // 遅延日数計算
  const delayDays = Math.ceil((new Date().getTime() - yesterdayDate.getTime()) / (1000 * 60 * 60 * 24)) - 1;
  const isDelayed = delayDays > 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header user={user} onSignOut={handleSignOut} />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">前日の日報データを読み込み中...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} onSignOut={handleSignOut} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ページヘッダー */}
        <DailyReportHeader
          formattedDate={formatSelectedDate(yesterdayDate)}
          onSave={onSave}
          onSubmit={onSubmit}
          isSaving={isSaving}
          isSubmitting={isSubmitting}
          isReadOnly={isReadOnly}
          showReadOnlyNotification={true}
        />

        {isDelayed && !isReadOnly && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              <span className="font-medium text-orange-800">
                提出期限を過ぎています（{delayDays}日前の日報）
              </span>
            </div>
            <p className="text-sm text-orange-700 mt-1">
              速やかに提出してください。
            </p>
          </div>
        )}

        {/* メッセージ表示 */}
        {saveMessage && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
            {saveMessage}
          </div>
        )}
        {submitMessage && (
          <div className="mb-4 p-3 bg-blue-100 text-blue-700 rounded-lg">
            {submitMessage}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左側: メインコンテンツ */}
          <div className="lg:col-span-2 space-y-6">
            <PreviousDayReportHeader
              yesterdayDate={yesterdayDate}
              delayDays={delayDays}
              isDelayed={isDelayed}
              isReadOnly={isReadOnly}
              existingReport={existingReport}
            />

            {/* 勤務時間 */}
            <WorkTimeSection
              workStartTime={workStartTime}
              workEndTime={workEndTime}
              onWorkStartTimeChange={setWorkStartTime}
              onWorkEndTimeChange={setWorkEndTime}
              isReadOnly={isReadOnly}
            />

            {/* 当日の予定 */}
            <TodayScheduleSection
              calendarEvents={calendarEvents}
              calendarLoading={calendarLoading}
              calendarError={calendarError}
              onAddEvent={openAddModal}
              onEditEvent={openEditModal}
              isReadOnly={isReadOnly}
            />

            {/* 報告事項 */}
            <ReportSectionNew
              reportFields={reportFields}
              onFieldChange={handleFieldChange}
              templates={templates}
              isReadOnly={isReadOnly}
            />
          </div>

          {/* 右側: 提出状況 */}
          <div className="space-y-6">
            {/* 提出状況 */}
            <SubmissionStatusCard
              yesterdayDate={yesterdayDate}
              delayDays={delayDays}
              isDelayed={isDelayed}
              isReadOnly={isReadOnly}
              existingReport={existingReport}
            />

            {/* 操作ガイド */}
            <OperationGuideCard
              isReadOnly={isReadOnly}
              delayDays={delayDays}
            />
          </div>
        </div>
      </main>

      {/* カレンダー取得プロンプト */}
      <CalendarFetchPrompt
        isOpen={showCalendarFetchPrompt}
        onYes={handleCalendarFetchYes}
        onNo={handleCalendarFetchNo}
        calendarLoading={calendarLoading}
        hasCalendarPermission={hasCalendarPermission}
      />

      {/* 提出確認ダイアログ */}
      {showSubmitConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary" />
                日報提出の確認
              </h3>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-600 mb-4">
                日報を提出しますか？
              </p>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                <p className="text-orange-700 text-sm">
                  <strong>注意:</strong> 提出すると編集はできません。
                </p>
              </div>
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancelSubmit}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors font-medium rounded-lg hover:bg-gray-100"
              >
                編集に戻る
              </button>
              <button
                onClick={handleConfirmSubmit}
                className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                はい、提出する
              </button>
            </div>
          </div>
        </div>
      )}

      {/* イベントモーダル */}
      {EventModals}
    </div>
  );
};

export default PreviousDayReport;