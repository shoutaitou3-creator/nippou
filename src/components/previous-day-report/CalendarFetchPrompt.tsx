import React from 'react';
import { X } from 'lucide-react';

interface CalendarFetchPromptProps {
  isOpen: boolean;
  onYes: () => void;
  onNo: () => void;
  calendarLoading: boolean;
  hasCalendarPermission: boolean;
}

const CalendarFetchPrompt: React.FC<CalendarFetchPromptProps> = ({
  isOpen,
  onYes,
  onNo,
  calendarLoading,
  hasCalendarPermission
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            前日の日報作成
          </h3>
          <button
            onClick={onNo}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            前日の日報が提出されていません。
          </p>
          <p className="text-gray-600">
            Googleカレンダーから情報を取得しますか？
          </p>
        </div>
        
        <div className="flex justify-end gap-3">
          <button
            onClick={onNo}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors font-medium rounded-lg hover:bg-gray-100"
          >
            いいえ
          </button>
          <button
            onClick={onYes}
            disabled={calendarLoading || !hasCalendarPermission}
            className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {calendarLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                取得中...
              </>
            ) : (
              'はい'
            )}
          </button>
        </div>
        
        {!hasCalendarPermission && (
          <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="text-orange-700 text-sm">
              Googleカレンダーの権限が必要です。ログインし直してください。
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarFetchPrompt;