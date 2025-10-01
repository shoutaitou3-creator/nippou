import { supabase } from '../lib/supabase';
import { CalendarEvent } from '../types/calendar';

export interface CalendarServiceConfig {
  userId: string;
}

class CalendarService {
  private accessToken: string | null = null;
  private hasPermission: boolean = false;
  private lastTokenCheck: Date | null = null;
  private TOKEN_CACHE_DURATION = 5 * 60 * 1000;

  async checkPermission(): Promise<boolean> {
    try {
      const now = new Date();
      if (
        this.lastTokenCheck &&
        now.getTime() - this.lastTokenCheck.getTime() < this.TOKEN_CACHE_DURATION &&
        this.accessToken
      ) {
        return this.hasPermission;
      }

      const { data: { session } } = await supabase.auth.getSession();

      if (session?.provider_token) {
        this.accessToken = session.provider_token;
        this.hasPermission = true;
        this.lastTokenCheck = now;
        return true;
      }

      this.accessToken = null;
      this.hasPermission = false;
      return false;
    } catch (error) {
      console.error('カレンダー権限チェックエラー:', error);
      this.accessToken = null;
      this.hasPermission = false;
      return false;
    }
  }

  async fetchEvents(startDate: string, endDate: string): Promise<CalendarEvent[]> {
    if (!this.accessToken) {
      const hasPermission = await this.checkPermission();
      if (!hasPermission) {
        throw new Error('カレンダーアクセス権限がありません');
      }
    }

    try {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);

      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);

      const timeMin = start.toISOString();
      const timeMax = end.toISOString();

      const apiUrl = `https://www.googleapis.com/calendar/v3/calendars/primary/events?` +
        `timeMin=${encodeURIComponent(timeMin)}&` +
        `timeMax=${encodeURIComponent(timeMax)}&` +
        `singleEvents=true&` +
        `orderBy=startTime&` +
        `maxResults=50`;

      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          this.accessToken = null;
          this.hasPermission = false;
          throw new Error('認証エラー: Googleカレンダーへのアクセス権限が期限切れです。再度ログインしてください。');
        }

        if (response.status === 403) {
          throw new Error('権限エラー: Googleカレンダーへのアクセスが拒否されました。');
        }

        throw new Error(`カレンダーAPI エラー: ${response.status}`);
      }

      const data = await response.json();

      const filteredEvents = (data.items || []).filter((event: any) => {
        if (!event.attendees || event.attendees.length === 0) {
          return true;
        }

        const selfAttendee = event.attendees.find((attendee: any) => attendee.self === true);
        if (selfAttendee) {
          return selfAttendee.responseStatus !== 'declined';
        }

        return true;
      });

      const events: CalendarEvent[] = filteredEvents.map((event: any, index: number) => {
        let startTime: string;
        let endTime: string;

        if (event.start?.dateTime) {
          startTime = new Date(event.start.dateTime).toLocaleTimeString('ja-JP', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          });
        } else {
          startTime = '09:00';
        }

        if (event.end?.dateTime) {
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
          summary: event.summary || '無題のイベント',
          description: event.description || '',
          location: event.location || '',
          start: {
            dateTime: event.start?.dateTime || null,
            date: event.start?.date || null,
            timeZone: event.start?.timeZone || null
          },
          end: {
            dateTime: event.end?.dateTime || null,
            date: event.end?.date || null,
            timeZone: event.end?.timeZone || null
          },
          attendees: event.attendees || [],
          htmlLink: event.htmlLink || ''
        };
      });

      return events;
    } catch (error) {
      console.error('カレンダーイベント取得エラー:', error);
      throw error;
    }
  }

  clearCache(): void {
    this.accessToken = null;
    this.hasPermission = false;
    this.lastTokenCheck = null;
  }

  getPermissionStatus(): boolean {
    return this.hasPermission;
  }
}

export const calendarService = new CalendarService();
