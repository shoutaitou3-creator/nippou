import React from 'react';

interface SubmissionStatusCardProps {
  yesterdayDate: Date;
  delayDays: number;
  isDelayed: boolean;
  isReadOnly: boolean;
  existingReport: any;
}

const SubmissionStatusCard: React.FC<SubmissionStatusCardProps> = ({
  yesterdayDate,
  delayDays,
  isDelayed,
  isReadOnly,
  existingReport
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">提出状況</h2>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">提出期限</span>
          <span className="text-sm text-gray-500 px-2 py-1 bg-gray-50 rounded">
            {new Date(yesterdayDate.getTime() + 86400000).toLocaleDateString('ja-JP')} 23:59
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">遅延日数</span>
          <span className={`text-sm font-medium px-2 py-1 rounded ${isDelayed ? 'text-orange-600 bg-orange-50' : 'text-green-600 bg-green-50'}`}>
            {isDelayed ? `${delayDays}日` : '期限内'}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">承認状況</span>
          <span className={`text-sm font-medium ${
            existingReport 
              ? existingReport.draft_status 
                ? 'text-orange-600 bg-orange-50' 
                : 'text-green-600 bg-green-50'
              : 'text-gray-500'
          } px-2 py-1 rounded`}>
            {existingReport 
              ? existingReport.draft_status 
                ? '下書き' 
                : '提出済み'
              : '未提出'
            }
          </span>
        </div>
        {existingReport && existingReport.submitted_at && (
          <div className="flex justify-between items-center">
            <span className="text-gray-600">提出日時</span>
            <span className="text-sm text-gray-500 px-2 py-1 bg-gray-50 rounded">
              {new Date(existingReport.submitted_at).toLocaleString('ja-JP')}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubmissionStatusCard;