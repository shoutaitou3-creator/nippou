import React from 'react';
import { Calendar, AlertTriangle, CheckCircle } from 'lucide-react';

interface PreviousDayReportHeaderProps {
  yesterdayDate: Date;
  delayDays: number;
  isDelayed: boolean;
  isReadOnly: boolean;
  existingReport: any;
}

const PreviousDayReportHeader: React.FC<PreviousDayReportHeaderProps> = ({
  yesterdayDate,
  delayDays,
  isDelayed,
  isReadOnly,
  existingReport
}) => {
  const formatSelectedDate = (date: Date) => {
    const formatted = date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
    
    // 曜日を括弧書きに変換
    return formatted
      .replace('日曜日', '(日)')
      .replace('月曜日', '(月)')
      .replace('火曜日', '(火)')
      .replace('水曜日', '(水)')
      .replace('木曜日', '(木)')
      .replace('金曜日', '(金)')
      .replace('土曜日', '(土)');
  };

  return (
    <>
      {/* 読み取り専用の通知 */}
      {isReadOnly && (
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

      {/* 遅延警告 */}
      {isDelayed && !isReadOnly && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <span className="font-medium text-orange-800">
              提出期限を過ぎています（{delayDays}日前の日報）
            </span>
          </div>
          <p className="text-sm text-orange-700 mt-1">
            速やかに提出してください。
          </p>
        </div>
      )}

      {/* 対象日表示 */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">対象日</h2>
        <div className="flex items-center gap-4">
          <Calendar className="w-6 h-6 text-secondary" />
          <div>
            <p className="font-medium text-gray-800">{formatSelectedDate(yesterdayDate)}</p>
            <p className="text-sm text-gray-500">{delayDays + 1}日前</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default PreviousDayReportHeader;