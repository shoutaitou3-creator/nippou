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

    const fields = [
      { label: 'Positive Reactions', value: dailyReport?.positive_reactions },
      { label: 'Achievements', value: dailyReport?.achievements },
      { label: 'Challenges/Issues', value: dailyReport?.challenges_issues },
      { label: 'Lessons Learned', value: dailyReport?.lessons_learned },
      { label: 'Work Content', value: dailyReport?.work_content }
    ];

    let hasContent = false;

    fields.forEach(field => {
      if (field.value && field.value.trim() !== '') {
        hasContent = true;

        // フィールドラベル
        this.doc.setFontSize(11);
        this.doc.setFont('helvetica', 'bold');
        this.doc.text(field.label + ':', this.margin, currentY);
        currentY += 6;

        // フィールド内容
        this.doc.setFontSize(10);
        this.doc.setFont('helvetica', 'normal');
        const content = TextUtils.wrapText(TextUtils.convertJapaneseToEnglish(field.value), 85);
        content.forEach(line => {
          this.doc.text(line, this.margin + 3, currentY);
          currentY += this.lineHeight;
        });

        currentY += 3; // フィールド間のスペース
      }
    });

    if (!hasContent) {
      this.doc.setFontSize(10);
      this.doc.setFont('helvetica', 'normal');
      this.doc.text('No report content entered', this.margin, currentY);
      currentY += this.lineHeight;
    }

    currentY += 5;
    return currentY;
  }
}