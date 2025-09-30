import React from 'react';
import { Link } from 'react-router-dom';
import { Edit, Calendar, RefreshCw } from 'lucide-react';

interface ActionButtonsSectionProps {
  calendarLoading: boolean;
  onFetchCalendarEvents: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

const ActionButtonsSection: React.FC<ActionButtonsSectionProps> = ({
  calendarLoading,
  onFetchCalendarEvents,
  onSubmit,
  isSubmitting
}) => {
  return (
    <>
      {/* モバイル用日報提出ボタン */}
      <button 
        onClick={onSubmit}
        disabled={isSubmitting}
        className="lg:hidden w-full bg-primary text-white py-3 px-6 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            提出中...
          </>
        ) : (
          <>
            <Edit className="w-4 h-4" />
            日報提出
          </>
        )}
      </button>

      {/* 操作ガイド */}
      <div className="bg-white rounded-lg shadow-sm border p-4 lg:p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          操作ガイド
        </h3>
        <div className="space-y-3 text-sm text-gray-600">
          <div className="flex items-start gap-2">
            <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
            <p>Googleカレンダーから自動取得された予定を編集可能</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
            <p>予定の編集アイコンをクリックして詳細を編集</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
            <p>手動で新しい予定を追加することも可能</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
            <p>報告事項は必須項目です（200文字以上推奨）</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
            <p>一時保存で下書きを保存、日報提出で上司に報告</p>
          </div>
        </div>
      </div>

      {/* 前日の日報作成ボタン */}
      {(() => {
        // 日本時間で前日を計算
        const japanDate = new Date(new Date().toLocaleString("en-US", {timeZone: "Asia/Tokyo"}));
        
        const yesterday = new Date(japanDate);
        yesterday.setDate(japanDate.getDate() - 1);
        
        const year = yesterday.getFullYear();
        const month = String(yesterday.getMonth() + 1).padStart(2, '0');
        const day = String(yesterday.getDate()).padStart(2, '0');
        const dateString = `${year}-${month}-${day}`;
        
        const displayDate = `${year}年${yesterday.getMonth() + 1}月${yesterday.getDate()}日の日報作成`;
        
        return (
          <Link
            to={`/daily-report-create?date=${dateString}`}
            className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 border text-decoration-none"
          >
            <Calendar className="w-4 h-4" />
            {displayDate}
          </Link>
        );
      })()}

      {/* Googleカレンダー再取得ボタン */}
      <button
        onClick={onFetchCalendarEvents}
        disabled={calendarLoading}
        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 border disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <RefreshCw className={`w-4 h-4 ${calendarLoading ? 'animate-spin' : ''}`} />
        {calendarLoading ? 'カレンダー取得中...' : 'Googleカレンダーから再取得'}
      </button>
    </>
  );
};

export default ActionButtonsSection;