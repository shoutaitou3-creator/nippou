import jsPDF from 'jspdf';
import { DailyReportData, InternalCalendarEvent } from '../../../types/daily-report';
import { TextUtils } from '../utils/TextUtils';

export class ScheduleSection {
  constructor(
    private doc: jsPDF,
    private margin: number,
    private lineHeight: number
  ) {}

  render(dailyReport: DailyReportData | null, currentY: number): number {
    // セクションタイトル
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Schedule Details', this.margin, currentY);
    currentY += 8;

    if (dailyReport?.calendar_events && dailyReport.calendar_events.length > 0) {
      this.doc.setFontSize(10);
      this.doc.setFont('helvetica', 'normal');
      
      dailyReport.calendar_events.forEach((event: InternalCalendarEvent) => {
        // 時間とタイトル
        const timeText = `${TextUtils.formatTime(event.startTime)} - ${TextUtils.formatTime(event.endTime)}`;
        this.doc.setFont('helvetica', 'bold');
        this.doc.text(timeText, this.margin, currentY);
        this.doc.setFont('helvetica', 'normal');
        this.doc.text(TextUtils.convertJapaneseToEnglish(event.title), this.margin + 35, currentY);
        currentY += this.lineHeight;

        // 場所と説明
        if (event.location) {
          this.doc.text(`Location: ${TextUtils.convertJapaneseToEnglish(event.location)}`, this.margin + 5, currentY);
          currentY += this.lineHeight;
        }
        if (event.description) {
          const description = TextUtils.wrapText(TextUtils.convertJapaneseToEnglish(event.description), 80);
          description.forEach(line => {
            this.doc.text(line, this.margin + 5, currentY);
            currentY += this.lineHeight;
          });
        }
        currentY += 2;
      });
    } else {
      this.doc.setFontSize(10);
      this.doc.setFont('helvetica', 'normal');
      this.doc.text('No schedule', this.margin, currentY);
      currentY += this.lineHeight;
    }
    
    currentY += 5;
    return currentY;
  }
}