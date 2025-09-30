import jsPDF from 'jspdf';
import { NextDaySettings } from '../types';
import { TextUtils } from '../utils/TextUtils';

export class NextDaySection {
  constructor(
    private doc: jsPDF,
    private margin: number,
    private lineHeight: number
  ) {}

  render(nextDaySettings: NextDaySettings | null, currentY: number): number {
    // セクションタイトル
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Next Work Day Information', this.margin, currentY);
    currentY += 8;

    if (nextDaySettings) {
      this.doc.setFontSize(10);
      this.doc.setFont('helvetica', 'normal');
      
      // 基本情報
      const nextDate = new Date(nextDaySettings.work_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
      });
      
      this.doc.text(`Work Date: ${nextDate}`, this.margin, currentY);
      currentY += this.lineHeight;
      
      this.doc.text(`Work Hours: ${TextUtils.formatTime(nextDaySettings.start_time)} - ${TextUtils.formatTime(nextDaySettings.end_time)}`, this.margin, currentY);
      currentY += this.lineHeight;

      // 特記事項
      if (nextDaySettings.notes && nextDaySettings.notes.trim() !== '') {
        currentY += 2;
        this.doc.setFont('helvetica', 'bold');
        this.doc.text('Special Notes:', this.margin, currentY);
        currentY += this.lineHeight;
        this.doc.setFont('helvetica', 'normal');
        
        const notes = TextUtils.wrapText(TextUtils.convertJapaneseToEnglish(nextDaySettings.notes), 85);
        notes.forEach(line => {
          this.doc.text(line, this.margin + 5, currentY);
          currentY += this.lineHeight;
        });
      }

      // 翌日の予定
      if (nextDaySettings.calendar_events && nextDaySettings.calendar_events.length > 0) {
        currentY += 2;
        this.doc.setFont('helvetica', 'bold');
        this.doc.text('Next Day Schedule:', this.margin, currentY);
        currentY += this.lineHeight;
        this.doc.setFont('helvetica', 'normal');

        nextDaySettings.calendar_events.forEach((event: any) => {
          const startTime = event.start?.dateTime 
            ? new Date(event.start.dateTime).toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: false
              })
            : 'All day';
          const endTime = event.end?.dateTime 
            ? new Date(event.end.dateTime).toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: false
              })
            : 'All day';
          
          this.doc.text(`• ${startTime} - ${endTime} ${TextUtils.convertJapaneseToEnglish(event.summary || 'Untitled event')}`, this.margin + 5, currentY);
          currentY += this.lineHeight;
        });
      }
    } else {
      this.doc.setFontSize(10);
      this.doc.setFont('helvetica', 'normal');
      this.doc.text('No next work day settings', this.margin, currentY);
      currentY += this.lineHeight;
    }

    return currentY;
  }
}