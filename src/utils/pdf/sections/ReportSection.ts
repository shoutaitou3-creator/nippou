import jsPDF from 'jspdf';
import { DailyReportData } from '../../../types/daily-report';
import { TextUtils } from '../utils/TextUtils';

export class ReportSection {
  constructor(
    private doc: jsPDF,
    private margin: number,
    private lineHeight: number
  ) {}

  render(dailyReport: DailyReportData | null, currentY: number): number {
    // セクションタイトル
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Daily Report Content', this.margin, currentY);
    currentY += 8;

    if (dailyReport?.work_content && dailyReport.work_content.trim() !== '') {
      this.doc.setFontSize(10);
      this.doc.setFont('helvetica', 'normal');
      const content = TextUtils.wrapText(TextUtils.convertJapaneseToEnglish(dailyReport.work_content), 85);
      content.forEach(line => {
        this.doc.text(line, this.margin, currentY);
        currentY += this.lineHeight;
      });
    } else {
      this.doc.setFontSize(10);
      this.doc.setFont('helvetica', 'normal');
      this.doc.text('No report content entered', this.margin, currentY);
      currentY += this.lineHeight;
    }
    
    currentY += 5;
    return currentY;
  }
}