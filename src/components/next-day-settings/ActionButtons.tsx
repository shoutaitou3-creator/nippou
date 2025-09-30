import React from 'react';
import { Save } from 'lucide-react';

interface ActionButtonsProps {
  isSaving: boolean;
  onSave: () => void;
  onReset: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  isSaving,
  onSave,
  onReset
}) => {
  return (
    <div className="mt-8 mb-16 flex justify-end gap-4">
      <button
        onClick={onReset}
        className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
      >
        リセット
      </button>
      <button
        onClick={onSave}
        disabled={isSaving}
        className="flex items-center gap-2 px-6 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSaving ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            保存中...
          </>
        ) : (
          <>
            <Save className="w-4 h-4" />
            設定を保存
          </>
        )}
      </button>
    </div>
  );
};

export default ActionButtons;