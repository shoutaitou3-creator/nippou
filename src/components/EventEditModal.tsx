import React from 'react';
import { X, Clock, MapPin, Users, FileText, Calendar, Trash2 } from 'lucide-react';
import TimeDropdown from './daily-report/TimeDropdown';

interface EventEditModalProps {
  isOpen: boolean;
  event: {
    id: string;
    startTime: string;
    endTime: string;
    title: string;
    description: string;
    location: string;
    participants: string;
  } | null;
  onClose: () => void;
  onSave: (event: any) => void;
  onDelete?: (eventId: string) => void;
}

const EventEditModal: React.FC<EventEditModalProps> = ({
  isOpen,
  event,
  onClose,
  onSave,
  onDelete
}) => {
  const [editingEvent, setEditingEvent] = React.useState(event);
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);

  // 時間選択肢を生成（15分単位、24時間対応）
  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        options.push(timeString);
      }
    }
    return options;
  };

  const timeOptions = generateTimeOptions();

  // eventが変更されたときに編集中のイベントを更新
  React.useEffect(() => {
    setEditingEvent(event);
  }, [event]);

  // モーダルが開いていない場合は何も表示しない
  if (!isOpen || !editingEvent) {
    return null;
  }

  const handleFieldChange = (field: string, value: string) => {
    setEditingEvent(prev => prev ? { ...prev, [field]: value } : null);
  };

  const handleSave = () => {
    if (editingEvent) {
      onSave(editingEvent);
    }
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (editingEvent && onDelete) {
      onDelete(editingEvent.id);
      setShowDeleteConfirm(false);
      onClose();
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
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
            <Calendar className="w-5 h-5 text-primary" />
            予定を編集
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
          {/* 時間設定 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                開始時間
              </label>
              <TimeDropdown
                value={editingEvent.startTime}
                onChange={(value) => handleFieldChange('startTime', value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                終了時間
              </label>
              <TimeDropdown
                value={editingEvent.endTime}
                onChange={(value) => handleFieldChange('endTime', value)}
              />
            </div>
          </div>
          
          {/* タイトル */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              タイトル
            </label>
            <input
              type="text"
              value={editingEvent.title}
              onChange={(e) => handleFieldChange('title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
              placeholder="予定のタイトルを入力してください"
            />
          </div>
          
          {/* 場所 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              場所
            </label>
            <input
              type="text"
              value={editingEvent.location}
              onChange={(e) => handleFieldChange('location', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
              placeholder="開催場所を入力してください（オプション）"
            />
          </div>
          
          {/* 説明 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              説明
            </label>
            <textarea
              value={editingEvent.description}
              onChange={(e) => handleFieldChange('description', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-y min-h-[100px] transition-colors"
              placeholder="予定の詳細説明を入力してください（オプション）"
            />
          </div>
          
          {/* 参加者 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              参加者
            </label>
            <input
              type="text"
              value={editingEvent.participants}
              onChange={(e) => handleFieldChange('participants', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
              placeholder="参加者名をカンマ区切りで入力してください（例：田中, 佐藤, 山田）"
            />
          </div>
        </div>
        
        {/* フッター */}
        <div className="flex justify-between items-center p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          <div>
            {onDelete && (
              <button
                onClick={handleDelete}
                className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors px-3 py-2 rounded-lg hover:bg-red-50 flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                予定を削除
              </button>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors font-medium rounded-lg hover:bg-gray-100"
            >
              キャンセル
            </button>
            <button
              onClick={handleSave}
              className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-sm"
            >
              保存
            </button>
          </div>
        </div>

        {/* 削除確認ダイアログ */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-red-600" />
                予定の削除確認
              </h3>
              <p className="text-gray-600 mb-6">
                この予定を削除しますか？削除した内容は復元できません。
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={handleCancelDelete}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors font-medium rounded-lg hover:bg-gray-100"
                >
                  キャンセル
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  削除する
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventEditModal;