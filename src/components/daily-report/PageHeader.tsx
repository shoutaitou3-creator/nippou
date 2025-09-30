import React from 'react';
import { Edit, FileText } from 'lucide-react';

interface PageHeaderProps {
  formattedDate: string;
  onSave: () => void;
  onSubmit: () => void;
  isSaving?: boolean;
  isSubmitting?: boolean;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  formattedDate,
  onSave,
  onSubmit,
  isSaving = false,
  isSubmitting = false
}) => {
  return (
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
        
        {/* アクションボタン */}
        <div className="hidden lg:flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <button 
            onClick={onSave}
            disabled={isSaving}
            className="bg-gray-500 text-white py-2 px-6 rounded-lg font-medium hover:bg-gray-600 transition-colors flex items-center justify-center gap-2 w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                保存中...
              </>
            ) : (
              <>
                <FileText className="w-4 h-4" />
                一時保存
              </>
            )}
          </button>
          <button 
            onClick={onSubmit}
            disabled={isSubmitting}
            className="bg-primary text-white py-2 px-6 rounded-lg font-medium hover:bg-primary/90 transition-colors w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                提出中...
              </>
            ) : (
              '日報提出'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;