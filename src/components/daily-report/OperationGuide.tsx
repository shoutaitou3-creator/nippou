import React from 'react';
import { Calendar, RefreshCw } from 'lucide-react';

interface OperationGuideProps {
  onRefetchCalendar: () => void;
  isLoadingCalendar: boolean;
}

const OperationGuide: React.FC<OperationGuideProps> = ({ 
  onRefetchCalendar, 
  isLoadingCalendar 
}) => {
  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false);

  const handleRefetchClick = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmRefetch = () => {
    setShowConfirmDialog(false);
    onRefetchCalendar();
  };

  const handleCancelRefetch = () => {
    setShowConfirmDialog(false);
  };

  return (
    <>
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

      {/* 前回の日報作成ボタン（独立） */}
      <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 border mt-4">
        <Calendar className="w-4 h-4" />
        2025年8月31日の日報作成
      </button>

      {/* Googleカレンダー再取得ボタン（独立） */}
      <button
        onClick={handleRefetchClick}
        disabled={isLoadingCalendar}
        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 border disabled:opacity-50 disabled:cursor-not-allowed mt-4"
      >
        <RefreshCw className={`w-4 h-4 ${isLoadingCalendar ? 'animate-spin' : ''}`} />
        {isLoadingCalendar ? 'カレンダー取得中...' : 'Googleカレンダーから再取得'}
      </button>

      {/* 確認ダイアログ */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              カレンダー再取得の確認
            </h3>
            <p className="text-gray-600 mb-6">
              現在編集中の予定がすべてリセットされ、Googleカレンダーから最新の情報を取得します。よろしいですか？
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancelRefetch}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors font-medium rounded-lg hover:bg-gray-100"
              >
                キャンセル
              </button>
              <button
                onClick={handleConfirmRefetch}
                className="bg-accent text-white px-6 py-2 rounded-lg font-medium hover:bg-accent/90 transition-colors"
              >
                はい
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OperationGuide;