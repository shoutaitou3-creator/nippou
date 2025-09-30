import React from 'react';
import { Edit, Save, FileText, CheckCircle } from 'lucide-react';

interface DailyReportHeaderProps {
  formattedDate: string;
  onSave: () => void;
  onSubmit: () => void;
  isSaving: boolean;
  isSubmitting: boolean;
  isReadOnly?: boolean;
  showReadOnlyNotification?: boolean;
}

const DailyReportHeader: React.FC<DailyReportHeaderProps> = ({
  formattedDate,
  onSave,
  onSubmit,
  isSaving,
  isSubmitting,
  isReadOnly = false,
  showReadOnlyNotification = true
}) => {
  return (
    <>
      {/* 読み取り専用の通知 */}
      {isReadOnly && showReadOnlyNotification && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-blue-800">
              この日報は既に提出済みです
            </span>
          </div>
          <p className="text-sm text-blue-700 mt-1">
            内容は確認のみ可能で、編集することはできません。
          </p>
        </div>
      )}
      
      <div className="mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Edit className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              {formattedDate} 日報作成
            </h1>
          </div>
        </div>
        
        <div className="flex flex-row gap-3 w-full sm:w-auto">
        <div className="flex flex-row gap-3 w-full sm:w-auto justify-center sm:justify-start">
          <button 
            onClick={onSave}
            disabled={isSaving || isReadOnly}
            className="bg-gray-500 text-white py-2 px-4 sm:px-6 rounded-lg font-medium hover:bg-gray-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                保存中...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                一時保存
              </>
            )}
          </button>
          <button 
            onClick={onSubmit}
            disabled={isSubmitting || isReadOnly}
            className="bg-primary text-white py-2 px-4 sm:px-6 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                提出中...
              </>
            ) : (
              <>
                <FileText className="w-4 h-4" />
                日報提出
              </>
            )}
          </button>
        </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default DailyReportHeader;