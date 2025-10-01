import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCalendarData } from '../hooks/useCalendarData';
import { useReportData } from '../hooks/useReportData';
import { useEventModalManager } from '../components/daily-report/EventModalManager';
import { supabase } from '../lib/supabase';
import { getJSTDate, formatJSTDateToYYYYMMDD, formatJSTDateForDisplay, parseJSTDateString } from '../utils/dateUtils';
import Header from '../components/Header';
import DailyReportHeader from '../components/daily-report/DailyReportHeader';
import DailyReportFormContent from '../components/daily-report/DailyReportFormContent';
import { useUserTemplates } from '../hooks/useUserTemplates';
import RefetchCalendarButton from '../components/daily-report/RefetchCalendarButton';
import SubmittedReportConfirmationDialog from '../components/daily-report/SubmittedReportConfirmationDialog';
import RefetchCalendarConfirmationDialog from '../components/daily-report/RefetchCalendarConfirmationDialog';
import ScreenshotModal from '../components/ScreenshotModal';
import { InternalCalendarEvent, DailyReportData } from '../types/daily-report'; // Import DailyReportData

const DailyReportCreate: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { user, signOut } = useAuth();

  const [selectedDate, setSelectedDate] = useState(() => {
    const dateParam = searchParams.get('date');
    if (dateParam) {
      return parseJSTDateString(dateParam);
    }
    return getJSTDate();
  });

  const [reportFields, setReportFields] = useState({
    positive_reactions: '',
    achievements: '',
    challenges_issues: '',
    lessons_learned: '',
    other_notes: ''
  });
  const [workStartTime, setWorkStartTime] = useState('09:00');
  const [workEndTime, setWorkEndTime] = useState('18:00');
  const [internalCalendarEvents, setInternalCalendarEvents] = useState<InternalCalendarEvent[]>([]);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [showSubmittedDialog, setShowSubmittedDialog] = useState(false);
  const [existingReport, setExistingReport] = useState<any>(null);
  const [showRefetchDialog, setShowRefetchDialog] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const [showScreenshotModal, setShowScreenshotModal] = useState(false);

  // 標準勤務時間を読み込む関数
  const loadWorkTimesFromSettings = useCallback(async (dateString: string) => {
    if (!user) {
      setWorkStartTime('09:00');
      setWorkEndTime('18:00');
      return;
    }

    try {
      console.log('=== 標準勤務時間読み込み開始 ===', { userId: user.id, date: dateString });
      
      // まずnext_day_settingsから該当日の勤務時間を取得
      const { data: nextDaySettings, error: nextDayError } = await supabase
        .from('next_day_settings')
        .select('start_time, end_time')
        .eq('user_id', user.id)
        .eq('work_date', dateString)
        .single();

      console.log('=== 翌勤務日設定取得結果 ===', { data: nextDaySettings, error: nextDayError });

      if (nextDaySettings && !nextDayError) {
        // データベースの時間が '00:00:00' 形式の場合は 'HH:MM' 形式に変換
        const startTimeFormatted = nextDaySettings.start_time ? nextDaySettings.start_time.substring(0, 5) : '09:00';
        const endTimeFormatted = nextDaySettings.end_time ? nextDaySettings.end_time.substring(0, 5) : '18:00';
        
        // '00:00' の場合はデフォルト値を使用
        setWorkStartTime(startTimeFormatted === '00:00' ? '09:00' : startTimeFormatted);
        setWorkEndTime(endTimeFormatted === '00:00' ? '18:00' : endTimeFormatted);
        
        console.log('=== 翌勤務日設定から時間を設定 ===', {
          startTime: startTimeFormatted === '00:00' ? '09:00' : startTimeFormatted,
          endTime: endTimeFormatted === '00:00' ? '18:00' : endTimeFormatted
        });
        return;
      }

      // next_day_settingsが見つからない場合はuser_settingsから標準勤務時間を取得
      const { data: userSettings, error: userSettingsError } = await supabase
        .from('user_settings')
        .select('default_start_time, default_end_time')
        .eq('user_id', user.id)
        .single();

      console.log('=== ユーザー設定取得結果 ===', { data: userSettings, error: userSettingsError });

      if (userSettings && !userSettingsError) {
        // データベースの時間が '00:00:00' 形式の場合は 'HH:MM' 形式に変換
        const startTimeFormatted = userSettings.default_start_time ? userSettings.default_start_time.substring(0, 5) : '09:00';
        const endTimeFormatted = userSettings.default_end_time ? userSettings.default_end_time.substring(0, 5) : '18:00';
        
        // '00:00' の場合はデフォルト値を使用
        setWorkStartTime(startTimeFormatted === '00:00' ? '09:00' : startTimeFormatted);
        setWorkEndTime(endTimeFormatted === '00:00' ? '18:00' : endTimeFormatted);
        
        console.log('=== ユーザー設定から時間を設定 ===', {
          startTime: startTimeFormatted === '00:00' ? '09:00' : startTimeFormatted,
          endTime: endTimeFormatted === '00:00' ? '18:00' : endTimeFormatted
        });
        return;
      }

      // どちらも見つからない場合はデフォルト値
      console.log('=== 設定が見つからないため、デフォルト値を使用 ===');
      setWorkStartTime('09:00');
      setWorkEndTime('18:00');
      
    } catch (error) {
      console.error('標準勤務時間読み込みエラー:', error);
      setWorkStartTime('09:00');
      setWorkEndTime('18:00');
    }
  }, [user]);

  const isDevMode = searchParams.get('dev') === 'true';

  const {
    calendarEvents,
    setCalendarEvents,
    calendarLoading,
    calendarError,
    fetchCalendarEvents
  } = useCalendarData(user, selectedDate, isDevMode);

  const {
    isSaving,
    isSubmitting,
    saveMessage,
    submitMessage,
    loadExistingReport,
    handleSave,
    handleSubmit
  } = useReportData(user, isDevMode);

  const { templates } = useUserTemplates(user);

  // イベントモーダル管理
  const {
    openEditModal,
    openAddModal,
    EventModals
  } = useEventModalManager(internalCalendarEvents, setInternalCalendarEvents);

  // カレンダーイベントを内部形式に変換
  const convertToInternalEvents = React.useCallback((events: any[]): InternalCalendarEvent[] => {
    return events.filter(event => event != null).map((event: any) => ({
      id: event.id || Date.now().toString(),
      startTime: event.startTime || '09:00',
      endTime: event.endTime || '10:00',
      title: event.title || '無題の予定',
      description: event.description || '',
      location: event.location || '',
      participants: event.participants || ''
    }));
  }, []);

  // calendarEventsが変更されたときに内部形式に変換
  useEffect(() => {
    const converted = convertToInternalEvents(calendarEvents);
    setInternalCalendarEvents(converted);
  }, [calendarEvents, convertToInternalEvents]);

  useEffect(() => {
    const dateParam = searchParams.get('date');
    if (dateParam && dateParam !== formatJSTDateToYYYYMMDD(selectedDate)) {
      setSelectedDate(parseJSTDateString(dateParam));
      console.log('URLパラメータによる日付更新:', dateParam);
    }
  }, [searchParams]);

  // 日報とカレンダーデータの読み込み
  useEffect(() => {
    if (selectedDate) {
      const loadReportAndCalendar = async () => {
        const dateString = formatJSTDateToYYYYMMDD(selectedDate);
        console.log('=== 日報とカレンダーデータの読み込み開始 ===', { 
          selectedDate: selectedDate.toISOString(),
          dateString,
          japanTime: getJSTDate().toISOString()
        });
        
        // まず既存の日報を確認（日本時間の日付文字列を使用）
        const existingReport = await loadExistingReport(dateString, (report) => {
          console.log('=== 既存日報が見つかりました ===', { 
            hasCalendarEvents: !!report.calendar_events,
            eventCount: report.calendar_events?.length || 0,
            reportDate: report.report_date
          });
        });
        
        if (existingReport) {
          setExistingReport(existingReport);
          // 既存の日報内容を各フィールドに設定
          setReportFields({
            positive_reactions: existingReport.positive_reactions || '',
            achievements: existingReport.achievements || '',
            challenges_issues: existingReport.challenges_issues || '',
            lessons_learned: existingReport.lessons_learned || '',
            other_notes: existingReport.other_notes || ''
          });
          setWorkStartTime(existingReport.work_start_time || '09:00');
          setWorkEndTime(existingReport.work_end_time || '18:00');
          
          // 提出済みの場合は確認ダイアログを表示
          if (!existingReport.draft_status) {
            setShowSubmittedDialog(true);
            setIsReadOnly(true);
          } else {
            setIsReadOnly(false);
          }
          
          // 既存日報にカレンダーイベントがある場合はそれを使用
          if (existingReport.calendar_events && existingReport.calendar_events.length > 0) {
            console.log('=== 既存日報のカレンダーイベントを使用 ===', {
              eventCount: existingReport.calendar_events.length
            });
            const converted = convertToInternalEvents(existingReport.calendar_events);
            setInternalCalendarEvents(converted);
            setCalendarEvents(existingReport.calendar_events);
            // 既存日報がある場合は常にGoogleカレンダーの取得をスキップ
            return;
          } else {
            // 既存日報があるがカレンダーイベントが空の場合も、Googleカレンダーの取得をスキップ
            console.log('=== 既存日報があるため、Googleカレンダーの取得をスキップ ===');
            return;
          }
        } else {
          // 新規日報の場合は設定から標準勤務時間を取得
          console.log('=== 新規日報のため、設定から標準勤務時間を取得 ===');
          await loadWorkTimesFromSettings(dateString);
          setIsReadOnly(false);
          
          // 新規日報の場合のみGoogleカレンダーから取得
          console.log('=== 新規日報のため、Googleカレンダーからイベントを取得 ===');
          fetchCalendarEvents();
        }
      };
      
      loadReportAndCalendar();
    }
  }, [selectedDate, fetchCalendarEvents, loadExistingReport, setCalendarEvents, convertToInternalEvents, user]);

  const handleFieldChange = useCallback((field: string, value: string) => {
    setReportFields(prev => ({ ...prev, [field]: value }));
  }, []);

  // 提出済み日報の編集確認ダイアログの処理
  const handleEditSubmittedYes = () => {
    setIsReadOnly(false);
    setShowSubmittedDialog(false);
  };

  const handleEditSubmittedNo = () => {
    setIsReadOnly(true);
    setShowSubmittedDialog(false);
  };

  const handleSignOut = useCallback(async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('ログアウト処理エラー:', error);
    }
  }, [signOut]);

  // Construct the dailyReport object for ScreenshotModal and copy functionality
  const currentDailyReport: DailyReportData = {
    id: existingReport?.id || '', // Use existing ID if available
    user_id: user?.id || '',
    report_date: formatJSTDateToYYYYMMDD(selectedDate),
    work_start_time: workStartTime,
    work_end_time: workEndTime,
    positive_reactions: reportFields.positive_reactions,
    achievements: reportFields.achievements,
    challenges_issues: reportFields.challenges_issues,
    lessons_learned: reportFields.lessons_learned,
    other_notes: reportFields.other_notes,
    calendar_events: internalCalendarEvents,
    draft_status: existingReport?.draft_status ?? true,
    submitted_at: existingReport?.submitted_at || undefined,
    created_at: existingReport?.created_at || undefined,
    updated_at: existingReport?.updated_at || undefined,
  };

  const formattedReportDate = formatJSTDateForDisplay(selectedDate);
  const reporterUserName = user?.user_metadata?.full_name || user?.email || 'ユーザー';

  const onSave = () => handleSave(selectedDate, reportFields, internalCalendarEvents, workStartTime, workEndTime);
  const onSubmit = () => handleSubmit(selectedDate, reportFields, internalCalendarEvents, workStartTime, workEndTime);

  // Googleカレンダー再取得の処理
  const handleRefetchCalendar = () => {
    setShowRefetchDialog(true);
  };

  const handleConfirmRefetch = async () => {
    setShowRefetchDialog(false);
    setIsRefetching(true);
    
    try {
      console.log('=== Googleカレンダーから強制再取得開始 ===');
      
      // 現在のカレンダーイベントをクリア
      setInternalCalendarEvents([]);
      setCalendarEvents([]);
      
      // Googleカレンダーから最新データを取得
      await fetchCalendarEvents();
      
      console.log('=== Googleカレンダー再取得完了 ===');
    } catch (error) {
      console.error('=== Googleカレンダー再取得エラー ===', error);
    } finally {
      setIsRefetching(false);
    }
  };

  const handleCancelRefetch = () => {
    setShowRefetchDialog(false);
  };

  // スクリーンショット用モーダルを表示
  const handleShowScreenshot = () => {
    setShowScreenshotModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} onSignOut={handleSignOut} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DailyReportHeader
          formattedDate={formattedReportDate}
          onSave={onSave}
          onSubmit={onSubmit}
          isSaving={isSaving}
          isSubmitting={isSubmitting}
          isReadOnly={isReadOnly}
          showReadOnlyNotification={false}
        />

        {/* 読み取り専用の通知 */}
        {isReadOnly && existingReport && !existingReport.draft_status && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="font-medium text-blue-800">
                この日報は既に提出済みです
              </span>
            </div>
            <p className="text-sm text-blue-700 mt-1">
              内容は確認のみ可能です。編集するには再度編集モードに切り替えてください。
            </p>
            <button
              onClick={() => setShowSubmittedDialog(true)}
              className="mt-2 text-sm text-blue-600 hover:text-blue-800 underline"
            >
              編集モードに切り替える
            </button>
          </div>
        )}

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

        <DailyReportFormContent
          workStartTime={workStartTime}
          workEndTime={workEndTime}
          onWorkStartTimeChange={setWorkStartTime}
          onWorkEndTimeChange={setWorkEndTime}
          calendarEvents={internalCalendarEvents}
          calendarLoading={calendarLoading}
          calendarError={calendarError}
          onAddEvent={openAddModal}
          onEditEvent={openEditModal}
          isReadOnly={isReadOnly}
          onShowScreenshot={handleShowScreenshot}
          reportFields={reportFields}
          onFieldChange={handleFieldChange}
          templates={templates}
          dailyReport={currentDailyReport}
          reportDate={formattedReportDate}
          userName={reporterUserName}
        />

        <RefetchCalendarButton
          onClick={handleRefetchCalendar}
          isRefetching={isRefetching}
          isReadOnly={isReadOnly}
        />
      </main>

      {/* 提出済み日報の編集確認ダイアログ */}
      <SubmittedReportConfirmationDialog
        isOpen={showSubmittedDialog}
        onConfirm={handleEditSubmittedYes}
        onCancel={handleEditSubmittedNo}
      />

      {/* Googleカレンダー再取得確認ダイアログ */}
      <RefetchCalendarConfirmationDialog
        isOpen={showRefetchDialog}
        onConfirm={handleConfirmRefetch}
        onCancel={handleCancelRefetch}
      />

      {/* イベントモーダル */}
      {EventModals}

      {/* スクリーンショット用モーダル */}
      {showScreenshotModal && (
        <ScreenshotModal
          dailyReport={currentDailyReport} // Pass the constructed dailyReport
          nextDaySettings={null} // As per current implementation in DailyReportCreate.tsx
          reportDate={formattedReportDate}
          userName={reporterUserName}
          onClose={() => setShowScreenshotModal(false)}
        />
      )}
    </div>
  );
};

export default DailyReportCreate;