import React from 'react';
import { RefreshCw } from 'lucide-react';

interface RefetchCalendarButtonProps {
  onClick: () => void;
  isRefetching: boolean;
  isReadOnly?: boolean;
}

const RefetchCalendarButton: React.FC<RefetchCalendarButtonProps> = ({
  onClick,
  isRefetching,
  isReadOnly = false
}) => {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200">
      <div className="flex justify-center">
        <button
          onClick={onClick}
          disabled={isRefetching || isReadOnly}
          className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors border disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw className={`w-4 h-4 ${isRefetching ? 'animate-spin' : ''}`} />
          {isRefetching ? 'カレンダー取得中...' : 'Googleカレンダーから再取得'}
        </button>
      </div>
      <p className="text-center text-sm text-gray-500 mt-2">
        現在の予定をGoogleカレンダーの最新情報で更新します
      </p>
    </div>
  );
};

export default RefetchCalendarButton;