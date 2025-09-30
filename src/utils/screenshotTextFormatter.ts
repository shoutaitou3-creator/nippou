// src/utils/screenshotTextFormatter.ts

import { DailyReportData, InternalCalendarEvent } from '../types/daily-report';
import { calculateWorkTime, minutesToTimeString, getCategoryDisplayName } from './workTimeCalculator';
import { displayTime } from './timeUtils';
import { formatJSTDateForDisplay, parseJSTDateString } from './dateUtils';

/**
 * HTMLタグを除去してプレーンテキストに変換する関数
 */
const stripHtmlTags = (text: string): string => {
  if (!text) return '';
  
  return text
    // HTMLタグを除去
    .replace(/<[^>]*>/g, '')
    // HTMLエンティティをデコード
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    // 連続する空白を単一の空白に変換
    .replace(/\s+/g, ' ')
    // 前後の空白を除去
    .trim();
};

interface NextDaySettingsForCopy {
  work_date: string;
  start_time: string;
  end_time: string;
  notes: string;
  calendar_events: any[]; // Assuming CalendarEvent from types/calendar.ts
}

interface ScreenshotData {
  dailyReport: DailyReportData | null;
  nextDaySettings: NextDaySettingsForCopy | null;
  reportDate: string; // Already formatted string
  userName: string;
  includeNextDay?: boolean; // Optional flag to include next day info
}

const formatTimeToDecimal = (minutes: number): string => {
  if (minutes === 0) return '0h';
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (remainingMinutes === 0) {
    return `${hours}h`;
  } else {
    const decimalHours = hours + (remainingMinutes / 60);
    return `${decimalHours.toFixed(1)}h`;
  }
};

export const generateScreenshotTextContent = (data: ScreenshotData): string => {
  const { dailyReport, nextDaySettings, reportDate, userName, includeNextDay = true } = data;
  let content = '';

  // 1. Header
  content += `${reportDate} 日報 ${userName}\n\n`;

  // 2. 勤務時間サマリー
  if (dailyReport) {
    const workTimeBreakdown = calculateWorkTime(
      dailyReport.calendar_events || [], 
      dailyReport.work_start_time || '09:00', 
      dailyReport.work_end_time || '18:00'
    );
    const totalWorkFormatted = formatTimeToDecimal(workTimeBreakdown.totalWork);

    content += `勤務時間:\n`;
    content += `  開始: ${dailyReport.work_start_time?.substring(0, 5) || '9:00'}\n`;
    content += `  終了: ${dailyReport.work_end_time?.substring(0, 5) || '18:00'}\n`;
    content += `  総実働時間: ${totalWorkFormatted}\n`;

    const categories = [
      { key: 'meeting', time: workTimeBreakdown.meeting },
      { key: 'sales', time: workTimeBreakdown.sales },
      { key: 'document', time: workTimeBreakdown.document },
      { key: 'onlineTraining', time: workTimeBreakdown.onlineTraining },
      { key: 'storeTraining', time: workTimeBreakdown.storeTraining },
      { key: 'recruitment', time: workTimeBreakdown.recruitment },
      { key: 'travel', time: workTimeBreakdown.travel },
      { key: 'other', time: workTimeBreakdown.other }
    ].filter(cat => cat.time > 0);

    // Sort categories by time descending for consistent output
    categories.sort((a, b) => b.time - a.time);

    if (categories.length > 0) {
      content += `  業務内訳:\n`;
      categories.forEach(cat => {
        content += `    - ${getCategoryDisplayName(cat.key as any)}: ${formatTimeToDecimal(cat.time)}\n`;
      });
    }
    if (workTimeBreakdown.break > 0) {
      content += `  休憩時間: ${formatTimeToDecimal(workTimeBreakdown.break)}\n`;
    }
    content += `\n`;
  }

  // 3. 予定詳細 (本日の業務)
  content += `本日の業務:\n`;
  if (dailyReport?.calendar_events && dailyReport.calendar_events.length > 0) {
    const sortedEvents = [...dailyReport.calendar_events].sort((a, b) => {
      const timeA = displayTime(a.startTime).split(':').map(Number);
      const timeB = displayTime(b.startTime).split(':').map(Number);
      const minutesA = timeA[0] * 60 + timeA[1];
      const minutesB = timeB[0] * 60 + timeB[1];
      return minutesA - minutesB;
    });

    sortedEvents.forEach(event => {
      content += `- ${displayTime(event.startTime)}-${displayTime(event.endTime)} ${event.title || '無題の予定'}\n`;
      if (event.location) {
        content += `  場所: ${event.location}\n`;
      }
      if (event.description) {
        content += `  説明: ${stripHtmlTags(event.description)}\n`;
      }
    });
  } else {
    content += `  業務なし\n`;
  }
  content += `\n`;

  // 4. 報告事項
  content += `報告事項:\n`;
  if (dailyReport?.work_content && dailyReport.work_content.trim() !== '') {
    content += `${dailyReport.work_content}\n`;
  } else {
    content += `  報告事項なし\n`;
  }
  content += `\n`;

  // 5. 翌勤務日情報（includeNextDayがtrueの場合のみ）
  if (includeNextDay) {
    content += `翌勤務日:\n`;
    if (nextDaySettings) {
      const nextDate = new Date(nextDaySettings.work_date);
      const formattedNextDate = nextDate.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
      }).replace('日曜日', '(日)')
        .replace('月曜日', '(月)')
        .replace('火曜日', '(火)')
        .replace('水曜日', '(水)')
        .replace('木曜日', '(木)')
        .replace('金曜日', '(金)')
        .replace('土曜日', '(土)');

      content += `  日付: ${formattedNextDate}\n`;
      content += `  時間: ${nextDaySettings.start_time?.substring(0, 5) || '09:00'} - ${nextDaySettings.end_time?.substring(0, 5) || '18:00'}\n`;
      
      if (nextDaySettings.notes && nextDaySettings.notes.trim() !== '') {
        content += `  特記事項: ${nextDaySettings.notes}\n`;
      }
      
      if (nextDaySettings.calendar_events && nextDaySettings.calendar_events.length > 0) {
        content += `  予定:\n`;
        nextDaySettings.calendar_events.forEach((event: any) => {
          const startTime = event.start?.dateTime 
            ? new Date(event.start.dateTime).toLocaleTimeString('ja-JP', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: false
              })
            : '終日';
          const endTime = event.end?.dateTime 
            ? new Date(event.end.dateTime).toLocaleTimeString('ja-JP', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: false
              })
            : '終日';
          
          content += `    - ${startTime}-${endTime} ${event.summary || '無題の予定'}\n`;
          if (event.location) {
            content += `      場所: ${event.location}\n`;
          }
        });
      }
    } else {
      content += `  翌勤務日の設定がありません\n`;
      content += `  翌勤務日設定画面で事前に設定してください\n`;
    }
    content += `\n`;
  }

  return content.trim(); // Remove trailing newlines
};