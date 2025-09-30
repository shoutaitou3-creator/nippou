import jsPDF from 'jspdf';

export class FooterSection {
  constructor(
    private doc: jsPDF,
    private pageWidth: number,
    private pageHeight: number,
    private margin: number
  ) {}

  render(): void {
    const footerY = this.pageHeight - 15;
    this.doc.setFontSize(8);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text('Resasty Co., Ltd. - Daily Report Management System', this.pageWidth / 2, footerY, { align: 'center' });
    this.doc.text(`Generated: ${new Date().toLocaleString('en-US')}`, this.pageWidth - this.margin, footerY, { align: 'right' });
  }
}