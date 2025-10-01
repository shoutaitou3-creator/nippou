import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabaseService } from '../services/supabaseService';
import { calendarService } from '../services/calendarService';
import { CalendarEvent } from '../types/calendar';
import Header from '../components/Header';
import PageHeader from '../components/next-day-settings/PageHeader';
import DateTimeSettings from '../components/next-day-settings/DateTimeSettings';
import NotesSection from '../components/next-day-settings/NotesSection';
import ScheduleDisplay from '../components/next-day-settings/ScheduleDisplay';
import ActionButtons from '../components/next-day-settings/ActionButtons';

type LoadingState = 'idle' | 'initial' | 'loading' | 'ready' | 'error';

interface PageState {
  selectedDate: string;
  startTime: string;
  endTime: string;
  notes: string;
  calendarEvents: CalendarEvent[];
  hasExistingSettings: boolean;
  loadingState: LoadingState;
  calendarLoading: boolean;
  calendarError: string | null;
  saveMessage: string;
  isSaving: boolean;
  hasCalendarPermission: boolean;
  showQuickInsert: boolean;
}

const NextDaySettings: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const isInitializedRef = useRef(false);

  const [state, setState] = useState<PageState>({
    selectedDate: supabaseService.getTomorrowDate(),
    startTime: '09:00',
    endTime: '18:00',
    notes: '',
    calendarEvents: [],
    hasExistingSettings: false,
    loadingState: 'initial',
    calendarLoading: false,
    calendarError: null,
    saveMessage: '',
    isSaving: false,
    hasCalendarPermission: false,
    showQuickInsert: false
  });

  const updateState = useCallback((updates: Partial<PageState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const handleSignOut = useCallback(async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('ログアウト処理エラー:', error);
    }
  }, [signOut]);

  const loadInitialData = useCallback(async () => {
    if (!user || isInitializedRef.current) return;

    updateState({ loadingState: 'loading' });

    try {
      const tomorrow = supabaseService.getTomorrowDate();
      const nextWorkDate = await supabaseService.getNextAvailableWorkDate(user.id, tomorrow);
      const targetDate = nextWorkDate || tomorrow;

      const [existingSettings, userSettings, hasCalendarPerm] = await Promise.all([
        supabaseService.getNextDaySettings(user.id, targetDate),
        supabaseService.getUserSettings(user.id),
        calendarService.checkPermission()
      ]);

      if (existingSettings) {
        updateState({
          selectedDate: existingSettings.work_date,
          startTime: supabaseService.formatTime(existingSettings.start_time),
          endTime: supabaseService.formatTime(existingSettings.end_time),
          notes: existingSettings.notes || '',
          calendarEvents: existingSettings.calendar_events || [],
          hasExistingSettings: true,
          hasCalendarPermission: hasCalendarPerm,
          loadingState: 'ready'
        });
      } else {
        const defaults = supabaseService.getDefaultWorkTimes();
        const startTime = userSettings
          ? supabaseService.formatTime(userSettings.default_start_time)
          : defaults.startTime;
        const endTime = userSettings
          ? supabaseService.formatTime(userSettings.default_end_time)
          : defaults.endTime;

        updateState({
          selectedDate: targetDate,
          startTime,
          endTime,
          notes: '',
          calendarEvents: [],
          hasExistingSettings: false,
          hasCalendarPermission: hasCalendarPerm,
          loadingState: 'ready'
        });
      }

      isInitializedRef.current = true;
    } catch (error) {
      console.error('初期データ読み込みエラー:', error);
      updateState({
        loadingState: 'error',
        selectedDate: supabaseService.getTomorrowDate()
      });
    }
  }, [user, updateState]);

  const loadDateSettings = useCallback(async (date: string) => {
    if (!user) return;

    updateState({ loadingState: 'loading' });

    try {
      const [existingSettings, userSettings] = await Promise.all([
        supabaseService.getNextDaySettings(user.id, date),
        supabaseService.getUserSettings(user.id)
      ]);

      if (existingSettings) {
        updateState({
          startTime: supabaseService.formatTime(existingSettings.start_time),
          endTime: supabaseService.formatTime(existingSettings.end_time),
          notes: existingSettings.notes || '',
          calendarEvents: existingSettings.calendar_events || [],
          hasExistingSettings: true,
          loadingState: 'ready'
        });
      } else {
        const defaults = supabaseService.getDefaultWorkTimes();
        const startTime = userSettings
          ? supabaseService.formatTime(userSettings.default_start_time)
          : defaults.startTime;
        const endTime = userSettings
          ? supabaseService.formatTime(userSettings.default_end_time)
          : defaults.endTime;

        updateState({
          startTime,
          endTime,
          notes: '',
          calendarEvents: [],
          hasExistingSettings: false,
          loadingState: 'ready'
        });
      }
    } catch (error) {
      console.error('日付設定読み込みエラー:', error);
      updateState({ loadingState: 'error' });
    }
  }, [user, updateState]);

  const handleFetchSchedule = useCallback(async () => {
    if (!state.selectedDate || !state.hasCalendarPermission) return;

    updateState({ calendarLoading: true, calendarError: null });

    try {
      const events = await calendarService.fetchEvents(state.selectedDate, state.selectedDate);
      updateState({
        calendarEvents: events,
        calendarLoading: false
      });
    } catch (error: any) {
      console.error('スケジュール取得エラー:', error);
      updateState({
        calendarError: error.message || 'スケジュールの取得に失敗しました',
        calendarLoading: false
      });
    }
  }, [state.selectedDate, state.hasCalendarPermission, updateState]);

  const handleDateChange = useCallback((newDate: string) => {
    updateState({ selectedDate: newDate });
    loadDateSettings(newDate);
  }, [updateState, loadDateSettings]);

  const handleQuickInsert = useCallback((content: string) => {
    setState(prev => ({
      ...prev,
      notes: prev.notes + (prev.notes ? '\n' : '') + content,
      showQuickInsert: false
    }));
  }, []);

  const handleSave = useCallback(async () => {
    if (!user) {
      updateState({
        saveMessage: '認証が必要です',
        isSaving: false
      });
      setTimeout(() => updateState({ saveMessage: '' }), 3000);
      return;
    }

    updateState({ isSaving: true });

    try {
      const result = await supabaseService.saveNextDaySettings({
        user_id: user.id,
        work_date: state.selectedDate,
        start_time: state.startTime,
        end_time: state.endTime,
        notes: state.notes,
        calendar_events: state.calendarEvents
      });

      if (result.success) {
        updateState({
          saveMessage: '翌勤務日設定を保存しました',
          isSaving: false
        });

        setTimeout(() => {
          navigate('/work-hours');
        }, 500);
      } else {
        updateState({
          saveMessage: `保存に失敗しました: ${result.error}`,
          isSaving: false
        });
        setTimeout(() => updateState({ saveMessage: '' }), 3000);
      }
    } catch (error: any) {
      console.error('保存エラー:', error);
      updateState({
        saveMessage: `保存に失敗しました: ${error.message}`,
        isSaving: false
      });
      setTimeout(() => updateState({ saveMessage: '' }), 3000);
    }
  }, [user, state.selectedDate, state.startTime, state.endTime, state.notes, state.calendarEvents, updateState, navigate]);

  const handleReset = useCallback(() => {
    const tomorrow = supabaseService.getTomorrowDate();
    const defaults = supabaseService.getDefaultWorkTimes();

    updateState({
      selectedDate: tomorrow,
      startTime: defaults.startTime,
      endTime: defaults.endTime,
      notes: '',
      calendarEvents: [],
      hasExistingSettings: false
    });

    loadDateSettings(tomorrow);
  }, [updateState, loadDateSettings]);

  const calculateWorkHours = useCallback(() => {
    const start = state.startTime.split(':').map(Number);
    const end = state.endTime.split(':').map(Number);
    const startMinutes = start[0] * 60 + start[1];
    const endMinutes = end[0] * 60 + end[1];
    const diffMinutes = endMinutes - startMinutes;
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    return minutes > 0 ? `${hours}時間${minutes}分` : `${hours}時間`;
  }, [state.startTime, state.endTime]);

  const formatSelectedDate = useCallback((dateString: string) => {
    const date = new Date(dateString);
    const formatted = date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });

    return formatted
      .replace('日曜日', '(日)')
      .replace('月曜日', '(月)')
      .replace('火曜日', '(火)')
      .replace('水曜日', '(水)')
      .replace('木曜日', '(木)')
      .replace('金曜日', '(金)')
      .replace('土曜日', '(土)');
  }, []);

  useEffect(() => {
    if (user && !isInitializedRef.current) {
      loadInitialData();
    }
  }, [user, loadInitialData]);

  if (state.loadingState === 'initial' || state.loadingState === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header user={user} onSignOut={handleSignOut} />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">翌勤務日設定を読み込み中...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} onSignOut={handleSignOut} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageHeader hasExistingSettings={state.hasExistingSettings} />

        {state.saveMessage && (
          <div className={`mb-6 p-4 rounded-lg ${
            state.saveMessage.includes('失敗') || state.saveMessage.includes('エラー')
              ? 'bg-red-100 border border-red-200 text-red-700'
              : 'bg-green-100 border border-green-200 text-green-700'
          }`}>
            <p className="font-medium">{state.saveMessage}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-3 lg:space-y-6">
            <DateTimeSettings
              selectedDate={state.selectedDate}
              startTime={state.startTime}
              endTime={state.endTime}
              onDateChange={handleDateChange}
              onStartTimeChange={(time) => updateState({ startTime: time })}
              onEndTimeChange={(time) => updateState({ endTime: time })}
              calculateWorkHours={calculateWorkHours}
              formatSelectedDate={formatSelectedDate}
            />

            <NotesSection
              notes={state.notes}
              onNotesChange={(notes) => updateState({ notes })}
              showQuickInsert={state.showQuickInsert}
              onToggleQuickInsert={() => updateState({ showQuickInsert: !state.showQuickInsert })}
              onQuickInsert={handleQuickInsert}
              startTime={state.startTime}
              endTime={state.endTime}
              selectedDate={state.selectedDate}
            />
          </div>

          <div className="space-y-2 lg:space-y-6">
            <ScheduleDisplay
              calendarEvents={state.calendarEvents}
              calendarLoading={state.calendarLoading}
              calendarError={state.calendarError}
              hasCalendarPermission={state.hasCalendarPermission}
              onFetchSchedule={handleFetchSchedule}
            />
          </div>
        </div>

        <ActionButtons
          isSaving={state.isSaving}
          onSave={handleSave}
          onReset={handleReset}
          startTime={state.startTime}
          endTime={state.endTime}
          selectedDate={state.selectedDate}
        />
      </main>
    </div>
  );
};

export default NextDaySettings;
