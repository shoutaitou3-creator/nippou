import React from 'react';

interface OperationGuideCardProps {
  isReadOnly: boolean;
  delayDays: number;
}

const OperationGuideCard: React.FC<OperationGuideCardProps> = ({
  isReadOnly,
  delayDays
}) => {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <h3 className="font-medium text-blue-800 mb-2">操作ガイド</h3>
      <ul className="text-sm text-blue-700 space-y-1">
        {isReadOnly ? (
          <>
            <li>• この日報は既に提出済みです</li>
            <li>• 内容の確認のみ可能です</li>
            <li>• 編集や再提出はできません</li>
          </>
        ) : (
          <>
            <li>• 実際に行った業務を詳しく記入</li>
            <li>• 報告事項は60文字以上必須</li>
            <li>• 予定を参照して当日の業務を確認</li>
            {delayDays > 2 && <li>• 3日以上前の場合は遅延理由が必須</li>}
          </>
        )}
      </ul>
    </div>
  );
};

export default OperationGuideCard;