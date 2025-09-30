import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface SubmittedReportConfirmationDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const SubmittedReportConfirmationDialog: React.FC<SubmittedReportConfirmationDialogProps> = ({
  isOpen,
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            提出済み日報の編集
          </h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            すでに本日の日報は提出されていますが修正しますか？
          </p>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
            <p className="text-orange-700 text-sm">
              <strong>注意:</strong> 編集して再提出すると、既存の日報が上書きされます。
            </p>
          </div>
        </div>
        
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors font-medium rounded-lg hover:bg-gray-100"
          >
            いいえ
          </button>
          <button
            onClick={onConfirm}
            className="bg-orange-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors"
          >
            はい、編集する
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubmittedReportConfirmationDialog;