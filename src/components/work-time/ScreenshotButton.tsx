import React from 'react';
import { Eye, Copy } from 'lucide-react';

interface ScreenshotButtonProps {
  onShowScreenshot: () => void;
  onCopyWorkEndData: () => void;
  hasReportData: boolean;
}

const ScreenshotButton: React.FC<ScreenshotButtonProps> = ({ 
  onShowScreenshot, 
  onCopyWorkEndData,
  hasReportData
}) => {
  const [copyButtonText, setCopyButtonText] = React.useState('勤務終了時コピー');

  const handleCopy = async () => {
    try {
      await onCopyWorkEndData();
      setCopyButtonText('コピーしました');
      setTimeout(() => {
        setCopyButtonText('勤務終了時コピー');
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      setCopyButtonText('コピー失敗');
      setTimeout(() => {
        setCopyButtonText('勤務終了時コピー');
      }, 2000);
    }
  };

  return (
    <div className="mt-8 pt-6 border-t border-gray-200">
      <div className="flex justify-center gap-4">
        <button
          onClick={onShowScreenshot}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Eye className="w-4 h-4" />
          <span className="hidden sm:inline">勤務終了時スクショ</span>
          <span className="sm:hidden">スクショ</span>
        </button>
        <button
          onClick={handleCopy}
          disabled={copyButtonText === 'コピーしました' || copyButtonText === 'コピー失敗'}
          className="flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-lg font-medium hover:bg-accent/90 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Copy className="w-4 h-4" />
          <span className="hidden sm:inline">{copyButtonText}</span>
          <span className="sm:hidden">
            {copyButtonText === '勤務終了時コピー' ? 'コピー' : 
             copyButtonText === 'コピーしました' ? 'コピー済' : 
             copyButtonText === 'コピー失敗' ? '失敗' : copyButtonText}
          </span>
        </button>
      </div>
      <p className="text-center text-sm text-gray-500 mt-2">
        勤務終了時の情報をスクリーンショットまたはクリップボードにコピーできます
      </p>
    </div>
  );
};

export default ScreenshotButton;