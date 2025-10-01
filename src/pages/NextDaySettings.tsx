import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCalendar } from '../hooks/useCalendar';
import { supabase } from '../lib/supabase';
import Header from '../components/Header';
import PageHeader from '../components/next-day-settings/PageHeader';
import DateTimeSettings from '../components/next-day-settings/DateTimeSettings';
import NotesSection from '../components/next-day-settings/NotesSection';
import ScheduleDisplay from '../components/next-day-settings/ScheduleDisplay';
import ActionButtons from '../components/next-day-settings/ActionButtons';
import { CalendarEvent } from '../types/calendar';

interface NextDaySettingsData {
  id?: string;
  work_date: string;
  start_time: string;
  end_time: string;
  notes: string;
  calendar_events: CalendarEvent[];
}

const NextDaySettings: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { 
    hasCalendarPermission,
    fetchCalendarEvents, 
    calendarLoading, 
    calendarError, 
    setCalendarError
  } = useCalendar(user);

  // 基本設定
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [startTime, setStartTime] = useState(() => '09:00');
  const [endTime, setEndTime] = useState(() => '18:00');
  const [notes, setNotes] = useState('');

  // カレンダー関連
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [calendarDataLoaded, setCalendarDataLoaded] = useState(false);

  // UI状態
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [isLoadingSettings, setIsLoadingSettings] = useState(false);
  const [showQuickInsert, setShowQuickInsert] = useState(false);
  const [hasExistingSettings, setHasExistingSettings] = useState(false);

  const handleSignOut = useCallback(async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('ログアウト処理エラー:', error);
    }
  }, [signOut]);

  // 初期表示時の日付を決定
  const determineInitialSelectedDate = useCallback(async () => {
    if (!user) {
      setIsLoadingPage(false);
      return;
    }

    console.log('=== 初期日付決定開始 ===', { userId: user.id });

    try {
      // 日本時間で明日の日付を取得
      const now = new Date();
      const japanTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Tokyo"}));
      const tomorrow = new Date(japanTime);
      tomorrow.setDate(japanTime.getDate() + 1);
      const tomorrowDateString = tomorrow.toISOString().split('T')[0];

      console.log('=== 明日の日付 ===', { tomorrowDateString });

      // 明日以降で最も近い翌勤務日設定を取得
      const { data: nextSettings, error } = await supabase
        .from('next_day_settings')
        .select('*')
        .eq('user_id', user.id)
        .gte('work_date', tomorrowDateString)
        .order('work_date', { ascending: true })
        .limit(1);

      console.log('=== 翌勤務日設定検索結果 ===', { data: nextSettings, error });

      if (error) {
        console.error('翌勤務日設定検索エラー:', error);
        // エラーの場合は明日の日付を使用
        setSelectedDate(tomorrowDateString);
        setHasExistingSettings(false);
        setIsLoadingPage(false);
        return;
      }

      if (nextSettings && nextSettings.length > 0) {
        const settings = nextSettings[0];
        console.log('=== 既存の翌勤務日設定が見つかりました ===', {
          work_date: settings.work_date,
          start_time: settings.start_time,
          end_time: settings.end_time
        });
        
        // 既存設定の日付を使用
        setSelectedDate(settings.work_date);
        setHasExistingSettings(true);
        
        // 設定値を反映
        const startTimeFormatted = settings.start_time ? settings.start_time.substring(0, 5) : '09:00';
        const endTimeFormatted = settings.end_time ? settings.end_time.substring(0, 5) : '18:00';
        
        setStartTime(startTimeFormatted === '00:00' ? '09:00' : startTimeFormatted);
        setEndTime(endTimeFormatted === '00:00' ? '18:00' : endTimeFormatted);
        setNotes(settings.notes || '');
        
        if (settings.calendar_events) {
          setCalendarEvents(settings.calendar_events);
          setCalendarDataLoaded(true);
        }
      } else {
        console.log('=== 翌勤務日設定が見つからない、明日の日付を使用 ===');
        // 設定が見つからない場合は明日の日付を使用
        setSelectedDate(tomorrowDateString);
        setHasExistingSettings(false);
        
        // 標準勤務時間を読み込み
        await loadStandardWorkTime();
        setNotes('');
        setCalendarEvents([]);
        setCalendarDataLoaded(false);
      }
    } catch (error) {
      console.error('初期日付決定エラー:', error);
      // エラーの場合は明日の日付を使用
      const now = new Date();
      const japanTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Tokyo"}));
      const tomorrow = new Date(japanTime);
      tomorrow.setDate(japanTime.getDate() + 1);
      setSelectedDate(tomorrow.toISOString().split('T')[0]);
      setHasExistingSettings(false);
      
      // エラー時も標準勤務時間を読み込み
      await loadStandardWorkTime();
      setNotes('');
      setCalendarEvents([]);
      setCalendarDataLoaded(false);
    } finally {
      setIsLoadingPage(false);
    }
  }, [user]);

  // 標準勤務時間を読み込む関数
  const loadStandardWorkTime = useCallback(async () => {
    if (!user) {
      setStartTime('09:00');
      setEndTime('18:00');
      return;
    }

    try {
      console.log('=== 標準勤務時間読み込み開始 ===', { userId: user.id });
      
      const { data: settings, error } = await supabase
        .from('user_settings')
        .select('default_start_time, default_end_time')
        .eq('user_id', user.id)
        .single();

      console.log('=== 標準勤務時間取得結果 ===', { data: settings, error });

      if (error && error.code !== 'PGRST116') {
        console.error('標準勤務時間取得エラー:', error);
      }

      if (settings) {
        // データベースの時間が '00:00:00' 形式の場合は 'HH:MM' 形式に変換
        const startTimeFormatted = settings.default_start_time ? settings.default_start_time.substring(0, 5) : '09:00';
        const endTimeFormatted = settings.default_end_time ? settings.default_end_time.substring(0, 5) : '18:00';
        
        // '00:00' の場合はデフォルト値を使用
        setStartTime(startTimeFormatted === '00:00' ? '09:00' : startTimeFormatted);
        setEndTime(endTimeFormatted === '00:00' ? '18:00' : endTimeFormatted);
        
        console.log('=== 標準勤務時間設定完了 ===', {
          startTime: startTimeFormatted === '00:00' ? '09:00' : startTimeFormatted,
          endTime: endTimeFormatted === '00:00' ? '18:00' : endTimeFormatted
        });
      } else {
        console.log('=== 標準勤務時間設定が見つからない、デフォルト値を使用 ===');
        setStartTime('09:00');
        setEndTime('18:00');
      }
    } catch (error) {
      console.error('標準勤務時間読み込みエラー:', error);
      setStartTime('09:00');
      setEndTime('18:00');
    }
  }, [user]);

  // 日付フォーマット
  const formatSelectedDate = (dateString: string) => {
    const date = new Date(dateString);
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

  // 日付範囲を取得
  const getDateRange = (date: string) => {
    const targetDate = new Date(date);
    const start = new Date(targetDate);
    start.setHours(0, 0, 0, 0);
    
    const end = new Date(targetDate);
    end.setHours(23, 59, 59, 999);
    
    return {
      timeMin: start.toISOString(),
      timeMax: end.toISOString()
    };
  };

  // カレンダーイベントを取得
  const loadCalendarEvents = useCallback(async (date: string) => {
    if (!hasCalendarPermission) {
      console.log('カレンダー権限がありません');
      return;
    }

    setCalendarError(null);
    
    try {
      const { timeMin, timeMax } = getDateRange(date);
      console.log('=== カレンダーイベント取得開始 ===', { date, timeMin, timeMax });
      
      const events = await fetchCalendarEvents(timeMin, timeMax);
      setCalendarEvents(events);
      setCalendarDataLoaded(true);
      
      console.log('=== カレンダーイベント取得成功 ===', {
        eventCount: events.length,
        events
      });
      
    } catch (error) {
      console.error('=== カレンダーイベント取得エラー ===', error);
      const errorMessage = error instanceof Error ? error.message : 'カレンダーデータの取得に失敗しました';
      setCalendarError(errorMessage);
    }
  }, [hasCalendarPermission, fetchCalendarEvents, setCalendarError]);

  // 既存設定を読み込み
  const loadExistingSettings = useCallback(async (date: string) => {
    if (!user) return;

    console.log('=== loadExistingSettings 開始 ===', { date, userId: user.id });

    try {
      setIsLoadingSettings(true);
      const { data, error } = await supabase
        .from('next_day_settings')
        .select('*')
        .eq('user_id', user.id)
        .eq('work_date', date)
        .single();

      console.log('=== Supabase クエリ結果 ===', { data, error });

      if (error && error.code !== 'PGRST116') {
        console.error('既存設定読み込みエラー:', error);
        // エラーの場合もデフォルト値を設定
        await loadStandardWorkTime();
        setNotes('');
        setCalendarEvents([]);
        setCalendarDataLoaded(false);
        setHasExistingSettings(false);
        return;
      }

      if (data) {
        console.log('=== 既存データが見つかりました ===', data);
        setHasExistingSettings(true);
        // データベースの時間が '00:00:00' 形式の場合は 'HH:MM' 形式に変換
        const startTimeFormatted = data.start_time ? data.start_time.substring(0, 5) : '09:00';
        const endTimeFormatted = data.end_time ? data.end_time.substring(0, 5) : '18:00';
        
        // '00:00' の場合はデフォルト値を使用
        setStartTime(startTimeFormatted === '00:00' ? '09:00' : startTimeFormatted);
        setEndTime(endTimeFormatted === '00:00' ? '18:00' : endTimeFormatted);
        
        setNotes(data.notes || '');
        if (data.calendar_events) {
          setCalendarEvents(data.calendar_events);
          setCalendarDataLoaded(true);
        }
      } else {
        console.log('=== データが見つからない場合のデフォルト値設定 ===');
        setHasExistingSettings(false);
        await loadStandardWorkTime();
        setNotes('');
        setCalendarEvents([]);
        setCalendarDataLoaded(false);
      }
    } catch (error) {
      console.error('設定読み込みエラー:', error);
      console.log('=== エラー発生時のデフォルト値設定 ===');
      await loadStandardWorkTime();
      setNotes('');
      setCalendarEvents([]);
      setCalendarDataLoaded(false);
      setHasExistingSettings(false);
    } finally {
      setIsLoadingSettings(false);
    }
  }, [user]);

  // 初期表示時の処理
  useEffect(() => {
    console.log('=== NextDaySettings 初期化 ===', { hasUser: !!user });
    if (user) {
      determineInitialSelectedDate();
    } else {
      setIsLoadingPage(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // 日付変更時の処理 - 初回ロード完了後のみ実行
  useEffect(() => {
    // 初回ロード中は何もしない
    if (isLoadingPage) return;

    console.log('=== 日付変更時の処理 ===', { selectedDate, hasCalendarPermission, calendarDataLoaded });
    if (selectedDate && selectedDate !== null) {
      loadExistingSettings(selectedDate);
      if (hasCalendarPermission && !calendarDataLoaded) {
        setCalendarDataLoaded(false);
        setCalendarEvents([]);
        loadCalendarEvents(selectedDate);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, hasCalendarPermission]);

  // カレンダー権限が取得できた時の処理
  useEffect(() => {
    // 初回ロード中は何もしない
    if (isLoadingPage) return;

    if (hasCalendarPermission && selectedDate && selectedDate !== null && !calendarDataLoaded) {
      loadCalendarEvents(selectedDate);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasCalendarPermission, selectedDate, calendarDataLoaded]);

  // 手動でスケジュール取得
  const handleFetchSchedule = () => {
    if (!selectedDate) return;
    setCalendarDataLoaded(false);
    setCalendarEvents([]);
    loadCalendarEvents(selectedDate);
  };

  // 定型文挿入処理
  const handleQuickInsert = (content: string) => {
    const newNotes = notes + (notes ? '\n' : '') + content;
    setNotes(newNotes);
    setShowQuickInsert(false);
  };

  // 設定を保存
  const handleSave = async () => {
    if (!user || !selectedDate) {
      setSaveMessage('認証が必要です');
      setTimeout(() => setSaveMessage(''), 3000);
      return;
    }

    setIsSaving(true);
    
    try {
      const settingsData: NextDaySettingsData = {
        work_date: selectedDate,
        start_time: startTime,
        end_time: endTime,
        notes: notes,
        calendar_events: calendarEvents
      };

      const { error } = await supabase
        .from('next_day_settings')
        .upsert({
          user_id: user.id,
          ...settingsData
        }, { 
          onConflict: 'user_id,work_date' 
        });

      if (error) {
        throw error;
      }

      setSaveMessage('翌勤務日設定を保存しました');
      setTimeout(() => setSaveMessage(''), 3000);
      
      // 設定保存後に業務レポート画面に遷移
      setTimeout(() => {
        navigate('/work-hours');
      }, 500);
      
    } catch (error: any) {
      console.error('保存エラー:', error);
      setSaveMessage('保存に失敗しました: ' + error.message);
      setTimeout(() => setSaveMessage(''), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  // リセット処理
  const handleReset = () => {
    if (!selectedDate) return;
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setSelectedDate(tomorrow.toISOString().split('T')[0]);
    setStartTime('09:00');
    setEndTime('18:00');
    setNotes('');
    setCalendarEvents([]);
    setCalendarDataLoaded(false);
    setHasExistingSettings(false);
  };

  // 勤務時間を計算
  const calculateWorkHours = () => {
    const start = startTime.split(':').map(Number);
    const end = endTime.split(':').map(Number);
    const startMinutes = start[0] * 60 + start[1];
    const endMinutes = end[0] * 60 + end[1];
    const diffMinutes = endMinutes - startMinutes;
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    return minutes > 0 ? `${hours}時間${minutes}分` : `${hours}時間`;
  };

  if (isLoadingPage || isLoadingSettings || !selectedDate) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header user={user} onSignOut={handleSignOut} />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">
              {isLoadingPage ? '翌勤務日設定を読み込み中...' : '設定を読み込み中...'}
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} onSignOut={handleSignOut} />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageHeader hasExistingSettings={hasExistingSettings} />

        {/* 保存メッセージ */}
        {saveMessage && (
          <div className={`mb-6 p-4 rounded-lg ${
            saveMessage.includes('失敗') || saveMessage.includes('エラー')
              ? 'bg-red-100 border border-red-200 text-red-700'
              : 'bg-green-100 border border-green-200 text-green-700'
          }`}>
            <p className="font-medium">{saveMessage}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 左側: 設定フォーム */}
          <div className="space-y-3 lg:space-y-6">
            <DateTimeSettings
              selectedDate={selectedDate}
              startTime={startTime}
              endTime={endTime}
              onDateChange={setSelectedDate}
              onStartTimeChange={setStartTime}
              onEndTimeChange={setEndTime}
              calculateWorkHours={calculateWorkHours}
              formatSelectedDate={formatSelectedDate}
            />

            <NotesSection
              notes={notes}
              onNotesChange={setNotes}
              showQuickInsert={showQuickInsert}
              onToggleQuickInsert={() => setShowQuickInsert(!showQuickInsert)}
              onQuickInsert={handleQuickInsert}
              startTime={startTime}
              endTime={endTime}
              selectedDate={selectedDate}
            />
          </div>

          {/* 右側: 予定表示 */}
          <div className="space-y-2 lg:space-y-6">
            <ScheduleDisplay
              calendarEvents={calendarEvents}
              calendarLoading={calendarLoading}
              calendarError={calendarError}
              hasCalendarPermission={hasCalendarPermission}
              onFetchSchedule={handleFetchSchedule}
            />
          </div>
        </div>

        <ActionButtons
          isSaving={isSaving}
          onSave={handleSave}
          onReset={handleReset}
          startTime={startTime}
          endTime={endTime}
          selectedDate={selectedDate}
        />
      </main>
    </div>
  );
};

export default NextDaySettings;