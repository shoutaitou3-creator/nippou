import React from 'react';
import { FileText } from 'lucide-react';
import { DailyReportData } from '../../types/daily-report';

interface ReportContentSectionProps {
  dailyReport: DailyReportData | null;
}

const ReportContentSection: React.FC<ReportContentSectionProps> = ({ dailyReport }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">日報の報告事項</h2>
      
      {dailyReport && dailyReport.work_content && dailyReport.work_content.trim() !== '' ? (
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-700 mb-3">業務内容</h3>
            <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">
              {dailyReport.work_content}
            </p>
          </div>
          
          {dailyReport.business_results && dailyReport.business_results.trim() !== '' && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-gray-700 mb-3">業務成果</h3>
              <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">
                {dailyReport.business_results}
              </p>
            </div>
          )}
          
          {dailyReport.challenges && dailyReport.challenges.trim() !== '' && (
            <div className="p-4 bg-orange-50 rounded-lg">
              <h3 className="font-medium text-gray-700 mb-3">課題・問題点</h3>
              <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">
                {dailyReport.challenges}
              </p>
            </div>
          )}
          
          {dailyReport.tomorrow_plan && dailyReport.tomorrow_plan.trim() !== '' && (
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-medium text-gray-700 mb-3">明日の予定</h3>
              <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">
                {dailyReport.tomorrow_plan}
              </p>
            </div>
          )}
          
          {dailyReport.report_notes && dailyReport.report_notes.trim() !== '' && (
            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="font-medium text-gray-700 mb-3">特記事項</h3>
              <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">
                {dailyReport.report_notes}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium mb-2">
            {dailyReport ? '報告事項が入力されていません' : '日報が提出されていません'}
          </p>
          <p className="text-sm">
            {dailyReport ? '日報に報告事項を入力してください' : '日報を提出すると報告事項が表示されます'}
          </p>
        </div>
      )}
    </div>
  );
};

export default ReportContentSection;