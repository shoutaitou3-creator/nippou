import { supabase } from '../lib/supabase';

export interface UserSettings {
  user_id: string;
  default_start_time: string;
  default_end_time: string;
  name?: string;
  employee_id?: string;
}

export interface NextDaySettingsData {
  id?: string;
  user_id: string;
  work_date: string;
  start_time: string;
  end_time: string;
  notes: string;
  calendar_events: any[];
}

export const supabaseService = {
  async getUserSettings(userId: string): Promise<UserSettings | null> {
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('ユーザー設定取得エラー:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('ユーザー設定取得例外:', error);
      return null;
    }
  },

  async getNextDaySettings(userId: string, workDate: string): Promise<NextDaySettingsData | null> {
    try {
      const { data, error } = await supabase
        .from('next_day_settings')
        .select('*')
        .eq('user_id', userId)
        .eq('work_date', workDate)
        .maybeSingle();

      if (error) {
        console.error('翌勤務日設定取得エラー:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('翌勤務日設定取得例外:', error);
      return null;
    }
  },

  async getNextAvailableWorkDate(userId: string, fromDate: string): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('next_day_settings')
        .select('work_date')
        .eq('user_id', userId)
        .gte('work_date', fromDate)
        .order('work_date', { ascending: true })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('次の勤務日取得エラー:', error);
        return null;
      }

      return data?.work_date || null;
    } catch (error) {
      console.error('次の勤務日取得例外:', error);
      return null;
    }
  },

  async saveNextDaySettings(data: NextDaySettingsData): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('next_day_settings')
        .upsert(data, {
          onConflict: 'user_id,work_date'
        });

      if (error) {
        console.error('翌勤務日設定保存エラー:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      console.error('翌勤務日設定保存例外:', error);
      return { success: false, error: error.message || '保存に失敗しました' };
    }
  },

  getDefaultWorkTimes(): { startTime: string; endTime: string } {
    return {
      startTime: '09:00',
      endTime: '18:00'
    };
  },

  formatTime(timeString: string | null | undefined): string {
    if (!timeString) return '09:00';

    const formatted = timeString.substring(0, 5);
    return formatted === '00:00' ? '09:00' : formatted;
  },

  getTomorrowDate(): string {
    const now = new Date();
    const japanTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Tokyo" }));
    const tomorrow = new Date(japanTime);
    tomorrow.setDate(japanTime.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  }
};
