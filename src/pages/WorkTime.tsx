import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { formatJSTDateForDisplay } from '../utils/dateUtils';
import Header from '../components/Header';
import ScreenshotModal from '../components/ScreenshotModal';
import WorkHoursDisplay from '../components/daily-report/WorkHoursDisplay';
import WorkTimeHeader from '../components/work-time/WorkTimeHeader';
import ScheduleDetailSection from '../components/work-time/ScheduleDetailSection';
import ReportContentSection from '../components/work-time/ReportContentSection';
import NextWorkDaySection from '../components/work-time/NextWorkDaySection';
import ScreenshotButton from '../components/work-time/ScreenshotButton';
import { generateScreenshotTextContent } from '../utils/screenshotTextFormatter';
import { DailyReportData } from '../types/daily-report';

interface NextDaySettings {
  id: string;
  work_date: string;
  start_time: string;
  end_time: string;
  notes: string;
  calendar_events: any[];
  created_at: string;
  updated_at: string;
}

const WorkTime: React.FC = () => {
  const { user, signOut } = useAuth();
  
  const [dailyReport, setDailyReport] = React.useState<DailyReportData | null>(null);
  const [nextDaySettings, setNextDaySettings] = React.useState<NextDaySettings | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [showScreenshotView, setShowScreenshotView] = React.useState(false);
  const [copyButtonText, setCopyButtonText] = React.useState('勤務終了時コピー');

  const handleSignOut = React.useCallback(async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('ログアウト処理エラー:', error);
    }
  }, [signOut]);

  // 日本時間で今日の日付を取得する関数
  const getTodayDateString = () => {
    const now = new Date();
    // 日本のタイムゾーンで日付を取得
    const japanDate = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Tokyo"}));
    const year = japanDate.getFullYear();
    const month = String(japanDate.getMonth() + 1).padStart(2, '0');
    const day = String(japanDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // スクショ用ページ表示処理
  const handleShowScreenshotView = () => {
    setShowScreenshotView(true);
  };

  // 勤務終了時コピー処理
  const handleCopyWorkEndData = async () => {
    // 日報データがない場合は基本情報のみでコピー内容を生成
    const reportData = dailyReport || {
      id: '',
      user_id: user?.id || '',
      report_date: getTodayDateString(),
      work_start_time: '09:00',
      work_end_time: '18:00',
      work_content: '日報が提出されていません',
      calendar_events: [],
      draft_status: true
    } as DailyReportData;

    const textToCopy = generateScreenshotTextContent({
      dailyReport: reportData,
      nextDaySettings: nextDaySettings,
      reportDate: formatJSTDateForDisplay(new Date()),
      userName: user?.user_metadata?.full_name || user?.email || 'ユーザー'
    });

    await navigator.clipboard.writeText(textToCopy);
  };

  // 翌勤務日設定を取得
  const loadNextDaySettings = React.useCallback(async () => {
    if (!user) return;

    try {
      const todayDateString = getTodayDateString();
      console.log('=== 翌勤務日設定を取得中 ===', { 
        userId: user.id, 
        searchFromDate: todayDateString,
        searchCondition: 'work_date > todayDateString (excluding today)'
      });

      // 現在の日付より後（翌日以降）で最も近い翌勤務日設定を取得
      const { data: settingsArray, error } = await supabase
        .from('next_day_settings')
        .select('*')
        .eq('user_id', user.id)
        .gt('work_date', todayDateString)
        .order('work_date', { ascending: true })
        .limit(1);

      console.log('=== 翌勤務日設定取得結果 ===', { 
        data: settingsArray, 
        error,
        searchFromDate: todayDateString,
        queryCondition: 'work_date > ' + todayDateString
      });

      if (error) {
        console.error('翌勤務日設定取得エラー:', error);
        return;
      }

      const settings = settingsArray && settingsArray.length > 0 ? settingsArray[0] : null;

      if (settings) {
        console.log('=== 翌勤務日設定が見つかりました ===', {
          id: settings.id,
          work_date: settings.work_date,
          start_time: settings.start_time,
          end_time: settings.end_time,
          notes: settings.notes,
          calendar_events_count: settings.calendar_events?.length || 0
        });
        setNextDaySettings(settings as NextDaySettings);
      } else {
        console.log('=== 翌勤務日設定が見つかりませんでした ===', {
          searchFromDate: todayDateString,
          message: '現在の日付より後の設定が存在しません（翌勤務日設定なし）'
        });
        setNextDaySettings(null);
      }
    } catch (error) {
      console.error('翌勤務日設定読み込みエラー:', error);
      setNextDaySettings(null);
    }
  }, [user]);

  // 今日の日報データを取得
  const loadTodayReport = React.useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const todayDateString = getTodayDateString();
      console.log('=== 今日の日報を取得中 ===', { 
        userId: user.id, 
        date: todayDateString,
        currentTime: new Date().toISOString()
      });

      // まず、このユーザーの全ての日報を確認（デバッグ用）
      const { data: allReports, error: allReportsError } = await supabase
        .from('daily_reports')
        .select('id, report_date, draft_status, created_at')
        .eq('user_id', user.id)
        .order('report_date', { ascending: false });

      console.log('=== ユーザーの全日報 ===', { 
        allReports, 
        allReportsError,
        reportCount: allReports?.length || 0
      });

      const { data: report, error } = await supabase
        .from('daily_reports')
        .select('*')
        .eq('user_id', user.id)
        .eq('report_date', todayDateString)
        .single();

      console.log('=== 日報取得結果 ===', { 
        data: report, 
        error,
        searchDate: todayDateString,
        foundReport: !!report
      });

      if (error && error.code !== 'PGRST116') {
        console.error('日報取得エラー:', error);
        setError('日報データの取得に失敗しました');
        return;
      }

      if (report) {
        console.log('=== 日報が見つかりました ===', {
          id: report.id,
          draft_status: report.draft_status,
          calendar_events_count: report.calendar_events?.length || 0,
          work_content_length: report.work_content?.length || 0,
          work_start_time: report.work_start_time,
          work_end_time: report.work_end_time
        });
        setDailyReport(report as DailyReportData);
      } else {
        console.log('=== 日報が見つかりませんでした ===', {
          searchDate: todayDateString,
          userId: user.id,
          errorCode: error?.code
        });
        setDailyReport(null);
      }
    } catch (error) {
      console.error('日報読み込みエラー:', error);
      setError('日報データの読み込み中にエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // 初回読み込み
  React.useEffect(() => {
    console.log('=== WorkTime useEffect triggered ===', {
      hasUser: !!user,
      userId: user?.id,
      userEmail: user?.email
    });
    const loadData = async () => {
      await loadTodayReport();
      await loadNextDaySettings();
    };
    loadData();
  }, [loadTodayReport, loadNextDaySettings]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header user={user} onSignOut={handleSignOut} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">日報データを読み込み中...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} onSignOut={handleSignOut} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <WorkTimeHeader error={error} />

        <div className="space-y-8">
          {/* 勤務時間表示 */}
          <WorkHoursDisplay 
            calendarEvents={dailyReport?.calendar_events || []} 
            workStartTime={dailyReport?.work_start_time || '09:00'}
            workEndTime={dailyReport?.work_end_time || '18:00'}
          />

          {/* 予定一覧 */}
          <ScheduleDetailSection dailyReport={dailyReport} />

          {/* 日報の報告事項 */}
          <ReportContentSection dailyReport={dailyReport} />

          {/* 翌勤務日の情報 */}
          <NextWorkDaySection nextDaySettings={nextDaySettings} />
        </div>

        {/* スクショ用ページ表示ボタン */}
        <ScreenshotButton 
          onShowScreenshot={handleShowScreenshotView}
          onCopyWorkEndData={handleCopyWorkEndData}
          hasReportData={true}
        />
      </main>

      {/* スクリーンショット用モーダル */}
      {showScreenshotView && (
        <ScreenshotModal
          dailyReport={dailyReport}
          nextDaySettings={nextDaySettings}
          reportDate={formatJSTDateForDisplay(new Date())}
          userName={user?.user_metadata?.full_name || user?.email || 'ユーザー'}
          onClose={() => setShowScreenshotView(false)}
        />
      )}
    </div>
  );
};

export default WorkTime;