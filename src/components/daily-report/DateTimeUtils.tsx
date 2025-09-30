import React from 'react';

// 日付・時間関連のユーティリティ関数とコンポーネント
export class DateTimeUtils {
  // 時間選択肢を生成（15分単位、24時間対応）
  static generateTimeOptions(): string[] {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        options.push(timeString);
      }
    }
    return options;
  }

  // 選択された日付をフォーマット（表示用）
  static formatSelectedDate(date: Date): string {
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  }

  // 日付をinput要素用にフォーマット
  static formatDateForInput(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  // 現在の日付をフォーマット（ページタイトル用）
  static formatCurrentDate(): string {
    const today = new Date();
    return today.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  }

  // 明日の日付を取得
  static getTomorrowDate(): Date {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  }

  // 今日の日付範囲を取得（カレンダーAPI用）
  static getTodayDateRange() {
    const today = new Date();
    const start = new Date(today);
    start.setHours(0, 0, 0, 0);
    
    const end = new Date(today);
    end.setHours(23, 59, 59, 999);
    
    return {
      timeMin: start.toISOString(),
      timeMax: end.toISOString()
    };
  }

  // 指定日の日付範囲を取得（カレンダーAPI用）
  static getDateRange(date: Date) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    
    return {
      timeMin: start.toISOString(),
      timeMax: end.toISOString()
    };
  }
}

// 日付・時間関連のカスタムフック
export const useDateTimeUtils = () => {
  const timeOptions = React.useMemo(() => DateTimeUtils.generateTimeOptions(), []);
  const formattedDate = React.useMemo(() => DateTimeUtils.formatCurrentDate(), []);
  const tomorrowDate = React.useMemo(() => DateTimeUtils.getTomorrowDate(), []);

  return {
    timeOptions,
    formattedDate,
    tomorrowDate,
    formatSelectedDate: DateTimeUtils.formatSelectedDate,
    formatDateForInput: DateTimeUtils.formatDateForInput,
    getTodayDateRange: DateTimeUtils.getTodayDateRange,
    getDateRange: DateTimeUtils.getDateRange
  };
};