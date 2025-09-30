import { useState, useCallback } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

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

export const useCalendarData = (user: User | null, selectedDate: Date, isDevMode: boolean) => {
  const [calendarEvents, setCalendarEvents] = useState<InternalCalendarEvent[]>([]);
  const [calendarLoading, setCalendarLoading] = useState(false);
  const [calendarError, setCalendarError] = useState<string | null>(null);

  const categorizeEvent = (title: string): string => {
    const titleLower = title.toLowerCase();
    
    if (titleLower.includes('会議') || titleLower.includes('ミーティング') || titleLower.includes('打ち合わせ')) {
      return 'meeting';
    }
    if (titleLower.includes('商談') || titleLower.includes('事業説明')) {
      return 'business';
    }
    if (titleLower.includes('資料作成') || titleLower.includes('資料確認') || titleLower.includes('ドキュメント')) {
      return 'document';
    }
    if (titleLower.includes('オンライン研修') || titleLower.includes('オンライン講習') || titleLower.includes('オンライン体験会')) {
      return 'online-training';
    }
    if (titleLower.includes('臨店講習') || titleLower.includes('臨店体験会')) {
      return 'onsite-training';
    }
    if (titleLower.includes('面接') || titleLower.includes('採用')) {
      return 'recruitment';
    }
    if (titleLower.includes('移動')) {
      return 'travel';
    }
    if (titleLower.includes('休憩')) {
      return 'break';
    }
    
    return 'other';
  };

  const fetchCalendarEvents = useCallback(async () => {
    if (isDevMode && !user) {
      console.log('Dev mode: Skipping calendar fetch (no user)');
      setCalendarEvents([]);
      return;
    }

    if (!user) {
      console.log('No user authenticated, skipping calendar fetch');
      return;
    }

    try {
      setCalendarLoading(true);
      setCalendarError(null);
      console.log('カレンダーイベント取得開始:', selectedDate);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.provider_token) {
        console.log('Google認証トークンが見つかりません');
        setCalendarEvents([]);
        return;
      }

      // 日付範囲を正しく設定
      const startOfDay = new Date(selectedDate);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(selectedDate);
      endOfDay.setHours(23, 59, 59, 999);
      
      const timeMin = startOfDay.toISOString();
      const timeMax = endOfDay.toISOString();
      
      console.log('時間範囲:', { timeMin, timeMax });

      const apiUrl = new URL('https://www.googleapis.com/calendar/v3/calendars/primary/events');
      apiUrl.searchParams.set('timeMin', timeMin);
      apiUrl.searchParams.set('timeMax', timeMax);
      apiUrl.searchParams.set('singleEvents', 'true');
      apiUrl.searchParams.set('orderBy', 'startTime');
      apiUrl.searchParams.set('maxResults', '50');

      const response = await fetch(apiUrl.toString(), {
        headers: {
          'Authorization': `Bearer ${session.provider_token}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Calendar API Error Response:', errorText);
        
        if (response.status === 401) {
          throw new Error('Google認証の有効期限が切れています。再ログインしてください。');
        }
        if (response.status === 403) {
          throw new Error('Googleカレンダーへのアクセス権限がありません。');
        }
        throw new Error(`カレンダー取得エラー: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Calendar API Response:', data);
      
      if (!data.items) {
        setCalendarEvents([]);
        return;
      }

      // 参加を辞退した予定を除外
      const filteredItems = data.items.filter((event: any) => {
        // attendeesが存在しない場合は表示（自分が作成者の可能性）
        if (!event.attendees || event.attendees.length === 0) {
          return true;
        }
        
        // 自分の参加状況をチェック
        const selfAttendee = event.attendees.find((attendee: any) => attendee.self === true);
        if (selfAttendee) {
          // 自分が辞退している場合は除外
          return selfAttendee.responseStatus !== 'declined';
        }
        
        // 自分の情報が見つからない場合は表示
        return true;
      });

      const events: InternalCalendarEvent[] = filteredItems
        .filter((event: any) => event.start && (event.start.dateTime || event.start.date))
        .map((event: any, index: number) => {
          let startTime, endTime;
          
          if (event.start.dateTime) {
            startTime = new Date(event.start.dateTime).toLocaleTimeString('ja-JP', { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: false 
            });
          } else {
            startTime = '09:00';
          }
          
          if (event.end.dateTime) {
            endTime = new Date(event.end.dateTime).toLocaleTimeString('ja-JP', { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: false 
            });
          } else {
            endTime = '10:00';
          }
          
          return {
            id: event.id || `event-${index}`,
            startTime,
            endTime,
            title: event.summary || '無題のイベント',
            description: event.description || '',
            location: event.location || '',
            participants: event.attendees?.map((attendee: any) => attendee.email).join(', ') || '',
            category: categorizeEvent(event.summary || '')
          };
        });

      setCalendarEvents(events);
      console.log('カレンダーイベント取得完了:', {
        total: data.items.length,
        filtered: filteredItems.length,
        final: events.length,
        declined: data.items.length - filteredItems.length
      });

    } catch (error: any) {
      console.error('カレンダー取得エラー:', error);
      setCalendarError(error.message || 'カレンダーの取得に失敗しました');
    } finally {
      setCalendarLoading(false);
    }
  }, [selectedDate, user, isDevMode]);

  return {
    calendarEvents,
    setCalendarEvents,
    calendarLoading,
    calendarError,
    fetchCalendarEvents
  };
};