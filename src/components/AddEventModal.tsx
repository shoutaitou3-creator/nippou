import React from 'react';
import { X, Clock, MapPin, Users, FileText, Calendar, Plus } from 'lucide-react';
import TimeDropdown from './daily-report/TimeDropdown';

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: {
    startTime: string;
    endTime: string;
    title: string;
    description: string;
    location: string;
    participants: string;
  }) => void;
}

const AddEventModal: React.FC<AddEventModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [newEvent, setNewEvent] = React.useState({
    startTime: '09:00',
    endTime: '10:00',
    title: '',
    description: '',
    location: '',
    participants: ''
  });
  const [validationError, setValidationError] = React.useState<string | null>(null);

  // モーダルが開かれるたびに初期値にリセット
  React.useEffect(() => {
    if (isOpen) {
      setNewEvent({
        startTime: '09:00',
        endTime: '10:00',
        title: '',
        description: '',
        location: '',
        participants: ''
      });
      setValidationError(null);
    }
  }, [isOpen]);

  // モーダルが開いていない場合は何も表示しない
  if (!isOpen) {
    return null;
  }

  const handleFieldChange = (field: string, value: string) => {
    setNewEvent(prev => ({ ...prev, [field]: value }));
    // エラーをクリア
    if (validationError) {
      setValidationError(null);
    }
  };

  const validateTimes = (startTime: string, endTime: string): boolean => {
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    
    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;
    
    return endMinutes > startMinutes;
  };

  const handleSave = () => {
    // 時間のバリデーション
    if (!validateTimes(newEvent.startTime, newEvent.endTime)) {
      setValidationError('終了時間は開始時間より後に設定してください');
      return;
    }

    // タイトルが空の場合は「無題の予定」を設定
    const eventToSave = {
      ...newEvent,
      title: newEvent.title.trim() || '無題の予定'
    };

    onSave(eventToSave);
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    // モーダルの外側をクリックしても閉じないように無効化
    // モーダルを閉じるのはキャンセルボタンまたは保存ボタンのみ
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <Plus className="w-5 h-5 text-secondary" />
            新しい予定を追加
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        {/* コンテンツ */}
        <div className="p-6 space-y-6">
          {/* バリデーションエラー表示 */}
          {validationError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{validationError}</p>
            </div>
          )}

          {/* 時間設定 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4 text-secondary" />
                開始時間
              </label>
              <TimeDropdown
                value={newEvent.startTime}
                onChange={(value) => handleFieldChange('startTime', value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4 text-secondary" />
                終了時間
              </label>
              <TimeDropdown
                value={newEvent.endTime}
                onChange={(value) => handleFieldChange('endTime', value)}
              />
            </div>
          </div>
          
          {/* タイトル */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-secondary" />
              タイトル
            </label>
            <input
              type="text"
              value={newEvent.title}
              onChange={(e) => handleFieldChange('title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-colors"
              placeholder="予定のタイトルを入力してください（空の場合は「無題の予定」になります）"
            />
          </div>
          
          {/* 場所 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-secondary" />
              場所
            </label>
            <input
              type="text"
              value={newEvent.location}
              onChange={(e) => handleFieldChange('location', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-colors"
              placeholder="開催場所を入力してください（オプション）"
            />
          </div>
          
          {/* 説明 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-secondary" />
              説明
            </label>
            <textarea
              value={newEvent.description}
              onChange={(e) => handleFieldChange('description', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent resize-y min-h-[100px] transition-colors"
              placeholder="予定の詳細説明を入力してください（オプション）"
            />
          </div>
          
          {/* 参加者 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Users className="w-4 h-4 text-secondary" />
              参加者
            </label>
            <input
              type="text"
              value={newEvent.participants}
              onChange={(e) => handleFieldChange('participants', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-colors"
              placeholder="参加者名をカンマ区切りで入力してください（例：田中, 佐藤, 山田）"
            />
          </div>
        </div>
        
        {/* フッター */}
        <div className="flex justify-end items-center p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors font-medium rounded-lg hover:bg-gray-100"
            >
              キャンセル
            </button>
            <button
              onClick={handleSave}
              className="bg-secondary text-white px-6 py-2 rounded-lg font-medium hover:bg-secondary/90 transition-colors shadow-sm"
            >
              予定を追加
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEventModal;