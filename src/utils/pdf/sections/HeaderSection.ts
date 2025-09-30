import jsPDF from 'jspdf';
import { TextUtils } from '../utils/TextUtils';

export class HeaderSection {
  constructor(
    private doc: jsPDF,
    private pageWidth: number,
    private margin: number
  ) {}

  render(reportDate: string, userName: string, currentY: number): number {
    // タイトル
    this.doc.setFontSize(18);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Daily Work Report', this.pageWidth / 2, currentY, { align: 'center' });
    currentY += 8;
    
    this.doc.setFontSize(14);
    this.doc.text('Business Report', this.pageWidth / 2, currentY, { align: 'center' });
    currentY += 10;

    // 日付とユーザー名
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(`Report Date: ${TextUtils.convertJapaneseToEnglish(reportDate)}`, this.margin, currentY);
    this.doc.text(`Reporter: ${TextUtils.convertJapaneseToEnglish(userName)}`, this.pageWidth - this.margin, currentY, { align: 'right' });
    currentY += 8;

    // 区切り線
    this.doc.setLineWidth(0.5);
    this.doc.line(this.margin, currentY, this.pageWidth - this.margin, currentY);
    currentY += 8;

    return currentY;
  }
}