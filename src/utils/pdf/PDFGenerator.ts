import jsPDF from 'jspdf';
import { PDFData } from './types';
import { HeaderSection } from './sections/HeaderSection';
import { WorkHoursSection } from './sections/WorkHoursSection';
import { ScheduleSection } from './sections/ScheduleSection';
import { ReportSection } from './sections/ReportSection';
import { NextDaySection } from './sections/NextDaySection';
import { FooterSection } from './sections/FooterSection';

/**
 * 業務レポートPDF生成クラス
 * 日本語対応のPDF生成機能を提供
 */
export class WorkReportPDFGenerator {
  private doc: jsPDF;
  private pageWidth: number;
  private pageHeight: number;
  private margin: number;
  private currentY: number;
  private lineHeight: number;

  // セクションクラス
  private headerSection: HeaderSection;
  private workHoursSection: WorkHoursSection;
  private scheduleSection: ScheduleSection;
  private reportSection: ReportSection;
  private nextDaySection: NextDaySection;
  private footerSection: FooterSection;

  constructor() {
    // A4サイズでPDFドキュメントを初期化
    this.doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    this.pageWidth = 210; // A4幅
    this.pageHeight = 297; // A4高さ
    this.margin = 15; // マージン15mm
    this.currentY = this.margin;
    this.lineHeight = 6; // 行間6mm

    // 日本語フォントを設定
    this.setupFont();

    // セクションクラスを初期化
    this.headerSection = new HeaderSection(this.doc, this.pageWidth, this.margin);
    this.workHoursSection = new WorkHoursSection(this.doc, this.margin, this.lineHeight);
    this.scheduleSection = new ScheduleSection(this.doc, this.margin, this.lineHeight);
    this.reportSection = new ReportSection(this.doc, this.margin, this.lineHeight);
    this.nextDaySection = new NextDaySection(this.doc, this.margin, this.lineHeight);
    this.footerSection = new FooterSection(this.doc, this.pageWidth, this.pageHeight, this.margin);
  }

  /**
   * フォントを設定
   */
  private setupFont(): void {
    this.doc.setFont('helvetica');
  }

  /**
   * 業務レポートPDFを生成
   */
  public generatePDF(data: PDFData): void {
    try {
      // ヘッダー部分
      this.currentY = this.headerSection.render(data.reportDate, data.userName, this.currentY);
      
      // 勤務時間セクション
      this.currentY = this.workHoursSection.render(data.dailyReport, this.currentY);
      
      // 予定詳細セクション
      this.currentY = this.scheduleSection.render(data.dailyReport, this.currentY);
      
      // 日報報告事項セクション
      this.currentY = this.reportSection.render(data.dailyReport, this.currentY);
      
      // 翌勤務日情報セクション
      this.currentY = this.nextDaySection.render(data.nextDaySettings, this.currentY);
      
      // フッター
      this.footerSection.render();
      
      // PDFをダウンロード
      const fileName = `業務レポート_${this.formatDateForFileName(data.reportDate)}.pdf`;
      this.doc.save(fileName);
      
    } catch (error) {
      console.error('PDF生成エラー:', error);
      throw new Error('PDFの生成に失敗しました');
    }
  }

  /**
   * ファイル名用の日付フォーマット
   */
  private formatDateForFileName(dateString: string): string {
    const now = new Date();
    return `${now.getFullYear()}_${(now.getMonth() + 1).toString().padStart(2, '0')}_${now.getDate().toString().padStart(2, '0')}`;
  }
}