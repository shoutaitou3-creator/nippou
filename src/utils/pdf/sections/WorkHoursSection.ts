import jsPDF from 'jspdf';
import { DailyReportData } from '../../../types/daily-report';
import { WorkTimeCalculator } from '../utils/WorkTimeCalculator';

export class WorkHoursSection {
  constructor(
    private doc: jsPDF,
    private margin: number,
    private lineHeight: number
  ) {}

  render(dailyReport: DailyReportData | null, currentY: number): number {
    // セクションタイトル
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Work Hours Summary', this.margin, currentY);
    currentY += 8;

    if (dailyReport?.calendar_events && dailyReport.calendar_events.length > 0) {
      // 勤務時間の計算と表示
      const workHours = WorkTimeCalculator.calculateWorkHours(dailyReport.calendar_events);
      
      this.doc.setFontSize(10);
      this.doc.setFont('helvetica', 'normal');
      this.doc.text(`Total Work Time (excluding breaks): ${workHours.totalWork}`, this.margin, currentY);
      currentY += this.lineHeight;

      // 業務分類別時間
      if (workHours.categories.length > 0) {
        currentY += 2;
        workHours.categories.forEach(category => {
          this.doc.text(`• ${category.name}: ${category.time}`, this.margin + 5, currentY);
          currentY += this.lineHeight;
        });
      }
    } else {
      this.doc.setFontSize(10);
      this.doc.setFont('helvetica', 'normal');
      this.doc.text('No schedule registered', this.margin, currentY);
      currentY += this.lineHeight;
    }
    
    currentY += 5;
    return currentY;
  }
}