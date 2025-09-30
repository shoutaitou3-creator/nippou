import React from 'react';
import { FileText, ChevronDown, Plus } from 'lucide-react';

interface ReportSectionProps {
  reportContent: string;
  onReportContentChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  showQuickInsert: boolean;
  onToggleQuickInsert: () => void;
  onQuickInsert: (text: string) => void;
  isReadOnly?: boolean;
}

const quickInsertTemplates = [
  { name: '順調に進行', content: '順調に進行しています。' },
  { name: '課題あり', content: '課題が発生しており、対応を検討中です。' },
  { name: '完了報告', content: '予定通り完了しました。' },
  { name: 'フォローアップ必要', content: 'フォローアップが必要です。' },
  { name: '継続検討', content: '継続して検討を行います。' }
];

const ReportSection: React.FC<ReportSectionProps> = ({
  reportContent,
  onReportContentChange,
  showQuickInsert,
  onToggleQuickInsert,
  onQuickInsert,
  isReadOnly = false
}) => {
  const getCharacterCountStyle = (count: number) => {
    if (count < 60) {
      return { color: 'text-orange-600', message: '60文字以上必須' };
    } else if (count >= 60 && count <= 1500) {
      return { color: 'text-green-600', message: '適切な文字数です' };
    } else {
      return { color: 'text-gray-600', message: '文字数制限内' };
    }
  };

  const characterStyle = getCharacterCountStyle(reportContent.length);

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 lg:p-6">
      <div className="flex items-center gap-3 mb-6">
        <FileText className="w-6 h-6 text-accent" />
        <h2 className="text-lg lg:text-xl font-semibold text-gray-800">
          報告事項
        </h2>
      </div>
      
      <div>
        <textarea
          value={reportContent}
          onChange={onReportContentChange}
          disabled={isReadOnly}
          maxLength={2000}
          rows={8}
          className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent resize-none ${
            isReadOnly ? 'bg-gray-50 text-gray-500' : ''
          }`}
        />
        
        <div className="flex justify-between items-center mt-2">
          <div className="flex items-center gap-4">
            <p className={`text-sm ${characterStyle.color}`}>
              {characterStyle.message}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <p className={`text-sm ${characterStyle.color}`}>
              {reportContent.length}/2000文字
            </p>
            
            <div className="relative">
              <button
                onClick={onToggleQuickInsert}
                disabled={isReadOnly}
                className="text-sm text-accent hover:text-accent/80 transition-colors flex items-center gap-1 px-2 py-1 rounded hover:bg-accent/10"
              >
                <Plus className="w-3 h-3" />
                定型文挿入
              </button>
              
              {showQuickInsert && (
                <div className="absolute right-0 top-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 min-w-[150px]">
                  {quickInsertTemplates.map((template, index) => (
                    <button
                      key={index}
                      onClick={() => onQuickInsert(template.content)}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors first:rounded-t-lg last:rounded-b-lg"
                    >
                      {template.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {showQuickInsert && !isReadOnly && (
        <div 
          className="fixed inset-0 z-5" 
          onClick={onToggleQuickInsert}
        />
      )}
    </div>
  );
};

export default ReportSection;