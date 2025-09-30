import { InternalCalendarEvent } from '../../../types/daily-report';
import { WorkTimeBreakdown } from '../types';

/**
 * 勤務時間計算ユーティリティクラス
 */
export class WorkTimeCalculator {
  /**
   * 時間文字列を分数に変換
   */
  static timeToMinutes(timeString: string): number {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  }

  /**
   * 分数を時間文字列に変換
   */
  static minutesToTimeString(minutes: number): string {
    if (minutes === 0) return '0min';
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (hours === 0) {
      return `${remainingMinutes}min`;
    } else if (remainingMinutes === 0) {
      return `${hours}h`;
    } else {
      return `${hours}h${remainingMinutes}min`;
    }
  }

  /**
   * イベントを分類
   */
  static categorizeEvent(title: string): string {
    const titleLower = title.toLowerCase();
    
    if (titleLower.includes('meeting') || titleLower.includes('会議') || titleLower.includes('ミーティング')) {
      return 'Meeting';
    }
    if (titleLower.includes('sales') || titleLower.includes('商談') || titleLower.includes('営業')) {
      return 'Sales';
    }
    if (titleLower.includes('document') || titleLower.includes('資料')) {
      return 'Documentation';
    }
    if (titleLower.includes('training') || titleLower.includes('研修')) {
      return 'Training';
    }
    if (titleLower.includes('travel') || titleLower.includes('移動')) {
      return 'Travel';
    }
    if (titleLower.includes('break') || titleLower.includes('休憩')) {
      return 'Break';
    }
    
    return 'Other';
  }

  /**
   * 勤務時間を計算
   */
  static calculateWorkHours(events: InternalCalendarEvent[]): WorkTimeBreakdown {
    let totalMinutes = 0;
    const categoryMinutes: { [key: string]: number } = {};

    events.forEach(event => {
      const startMinutes = this.timeToMinutes(event.startTime);
      const endMinutes = this.timeToMinutes(event.endTime);
      const duration = endMinutes > startMinutes ? endMinutes - startMinutes : 0;
      
      totalMinutes += duration;
      
      const category = this.categorizeEvent(event.title);
      categoryMinutes[category] = (categoryMinutes[category] || 0) + duration;
    });

    const categories = Object.entries(categoryMinutes)
      .filter(([_, minutes]) => minutes > 0)
      .map(([category, minutes]) => ({
        name: category,
        time: this.minutesToTimeString(minutes)
      }))
      .sort((a, b) => this.timeToMinutes(b.time) - this.timeToMinutes(a.time));

    return {
      totalWork: this.minutesToTimeString(totalMinutes),
      categories
    };
  }
}