import { useState, useCallback, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { CalendarEvent, CalendarApiResponse } from '../types/calendar';

export const useCalendar = (user: User | null) => {
  const [calendarLoading, setCalendarLoading] = useState(false);
  const [calendarError, setCalendarError] = useState<string | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState<Date | null>(null);
  const [hasCalendarPermission, setHasCalendarPermission] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // セッション情報からアクセストークンを取得
  const checkCalendarPermission = useCallback(async () => {
    if (!user) {
      setHasCalendarPermission(false);
      setAccessToken(null);
      return;
    }

    try {
      // Supabaseセッション情報を取得
      const { data: { session } } = await supabase.auth.getSession();
      
      let token: string | null = null;

      // セッションのprovider_tokenから取得
      if (session?.provider_token) {
        token = session.provider_token;
      }

      if (token) {
        setAccessToken(token);
        setHasCalendarPermission(true);
      } else {
        setAccessToken(null);
        setHasCalendarPermission(false);
      }

    } catch (error) {
      console.error('権限チェックエラー:', error);
      setHasCalendarPermission(false);
      setAccessToken(null);
    }
  }, [user]);

  // ユーザー変更時に権限をチェック
  useEffect(() => {
    if (user) {
      checkCalendarPermission();
    }
  }, [user]);

  // アクセストークンを取得
  const getAccessToken = useCallback(async (): Promise<string> => {
    if (accessToken) {
      return accessToken;
    }

    // 最新のセッション情報を再取得
    await checkCalendarPermission();
    
    if (!accessToken) {
      throw new Error('Googleアクセストークンが見つかりません。再度ログインしてカレンダー権限を許可してください。');
    }

    return accessToken;
  }, [accessToken]);

  // Google Calendar APIからイベントを取得
  const fetchCalendarEvents = useCallback(async (timeMin: string, timeMax: string): Promise<CalendarEvent[]> => {
    console.log('カレンダーイベント取得開始');
    
    setCalendarLoading(true);
    setCalendarError(null);
    
    try {
      const token = await getAccessToken();
      
      const apiUrl = `https://www.googleapis.com/calendar/v3/calendars/primary/events?` +
        `timeMin=${encodeURIComponent(timeMin)}&` +
        `timeMax=${encodeURIComponent(timeMax)}&` +
        `singleEvents=true&` +
        `orderBy=startTime&` +
        `maxResults=20`;

      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          // トークンをクリアして再認証を促す
          setAccessToken(null);
          setHasCalendarPermission(false);
          throw new Error('認証エラー: Googleカレンダーへのアクセス権限が期限切れです。再度ログインしてください。');
        }
        
        if (response.status === 403) {
          throw new Error('権限エラー: Googleカレンダーへのアクセスが拒否されました。カレンダー権限を許可してください。');
        }
        
        const errorText = await response.text();
        throw new Error(`Calendar API エラー: ${response.status} ${response.statusText}`);
      }

      const data: CalendarApiResponse = await response.json();
      
      // 参加を辞退した予定を除外
      const filteredEvents = (data.items || []).filter(event => {
        // attendeesが存在しない場合は表示（自分が作成者の可能性）
        if (!event.attendees || event.attendees.length === 0) {
          return true;
        }
        
        // 自分の参加状況をチェック
        const selfAttendee = event.attendees.find(attendee => attendee.self === true);
        if (selfAttendee) {
          // 自分が辞退している場合は除外
          return selfAttendee.responseStatus !== 'declined';
        }
        
        // 自分の情報が見つからない場合は表示
        return true;
      });
      
      console.log('カレンダーイベント取得成功:', {
        total: data.items?.length || 0,
        filtered: filteredEvents.length,
        declined: (data.items?.length || 0) - filteredEvents.length
      });
      
      setLastFetchTime(new Date());
      return filteredEvents;
      
    } catch (error) {
      console.error('カレンダーイベント取得エラー:', error);
      const errorMessage = error instanceof Error ? error.message : 'カレンダーデータの取得に失敗しました';
      setCalendarError(errorMessage);
      throw error;
    } finally {
      setCalendarLoading(false);
    }
  }, [getAccessToken]);

  // カレンダーデータをクリア
  const clearCalendarData = useCallback(() => {
    setAccessToken(null);
    setHasCalendarPermission(false);
    setCalendarError(null);
    setLastFetchTime(null);
  }, []);

  // 手動で権限を再チェック
  const recheckPermission = useCallback(async () => {
    console.log('権限の手動再チェック');
    await checkCalendarPermission();
  }, [checkCalendarPermission]);

  return {
    calendarLoading,
    calendarError,
    lastFetchTime,
    hasCalendarPermission,
    fetchCalendarEvents,
    setCalendarError,
    clearCalendarData,
    recheckPermission
  };
};