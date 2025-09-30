import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useCalendar } from '../hooks/useCalendar';
import Header from '../components/Header';
import ScheduleCard from '../components/ScheduleCard';
import SystemStatus from '../components/SystemStatus';
import NavigationMenu from '../components/NavigationMenu';
import { CalendarEvent } from '../types/calendar';

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);

const formatDate = (date: Date) => {
  return date.toLocaleDateString('ja-JP', {
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });
};

const getDayTimeRange = (date: Date) => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  
  return {
    timeMin: start.toISOString(),
    timeMax: end.toISOString()
  };
};

const Dashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const { 
    hasCalendarPermission,
    fetchCalendarEvents, 
    calendarLoading, 
    calendarError, 
    setCalendarError,
    lastFetchTime,
    clearCalendarData,
    recheckPermission
  } = useCalendar(user);
  
  const [todayEvents, setTodayEvents] = React.useState<CalendarEvent[]>([]);
  const [tomorrowEvents, setTomorrowEvents] = React.useState<CalendarEvent[]>([]);
  const [calendarDataLoaded, setCalendarDataLoaded] = React.useState(false);

  const loadCalendarData = React.useCallback(async (forceReload = false) => {
    if (!hasCalendarPermission) {
      return;
    }

    setCalendarError(null);
    
    try {
      const todayRange = getDayTimeRange(today);
      const todayEventsData = await fetchCalendarEvents(todayRange.timeMin, todayRange.timeMax);
      setTodayEvents(todayEventsData);
      
      const tomorrowRange = getDayTimeRange(tomorrow);
      const tomorrowEventsData = await fetchCalendarEvents(tomorrowRange.timeMin, tomorrowRange.timeMax);
      setTomorrowEvents(tomorrowEventsData);
      
      setCalendarDataLoaded(true);
    } catch (error) {
      setCalendarError(error instanceof Error ? error.message : 'カレンダーデータの取得に失敗しました');
    }
  }, [hasCalendarPermission, fetchCalendarEvents]);

  const handleSignOut = React.useCallback(async () => {
    clearCalendarData();
    setCalendarDataLoaded(false);
    setTodayEvents([]);
    setTomorrowEvents([]);
    
    try {
      await signOut();
    } catch (error) {
      console.error('ログアウト処理エラー:', error);
    }
  }, [signOut, clearCalendarData]);

  React.useEffect(() => {
    if (user && hasCalendarPermission && !calendarDataLoaded) {
      loadCalendarData();
    }
  }, [user, hasCalendarPermission, loadCalendarData, calendarDataLoaded]);

  const handleManualRefresh = () => {
    setCalendarDataLoaded(false);
    setTodayEvents([]);
    setTomorrowEvents([]);
    loadCalendarData(true);
  };

  const handleReauth = () => {
    clearCalendarData();
    setCalendarDataLoaded(false);
    window.location.href = '/login';
  };

  const handleRetry = () => {
    loadCalendarData(true);
  };

  const handleRecheckPermission = () => {
    recheckPermission();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} onSignOut={handleSignOut} />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <SystemStatus
            user={user}
            hasCalendarPermission={hasCalendarPermission}
            calendarLoading={calendarLoading}
            calendarError={calendarError}
            calendarDataLoaded={calendarDataLoaded}
            lastFetchTime={lastFetchTime}
            todayEventsCount={todayEvents.length}
            tomorrowEventsCount={tomorrowEvents.length}
            onManualRefresh={handleManualRefresh}
            onReauth={handleReauth}
            onRetry={handleRetry}
            onRecheckPermission={handleRecheckPermission}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <ScheduleCard
              title="今日のスケジュール"
              date={formatDate(today)}
              events={todayEvents}
              hasCalendarPermission={hasCalendarPermission}
              isLoading={calendarLoading}
              colorScheme="primary"
            />
            <ScheduleCard
              title="明日のスケジュール"
              date={formatDate(tomorrow)}
              events={tomorrowEvents}
              hasCalendarPermission={hasCalendarPermission}
              isLoading={calendarLoading}
              colorScheme="secondary"
            />
          </div>

          <NavigationMenu />
        </main>
    </div>
  );
};

export default Dashboard;