import React, { memo } from 'react';
import { Plus } from 'lucide-react';
import { getJSTDate, parseJSTDateString } from '../../utils/dateUtils';

interface NotesSectionProps {
  notes: string;
  onNotesChange: (notes: string) => void;
  showQuickInsert: boolean;
  onToggleQuickInsert: () => void;
  onQuickInsert: (content: string) => void;
  startTime?: string;
  endTime?: string;
  selectedDate?: string;
}

const NotesSection: React.FC<NotesSectionProps> = memo(({
  notes,
  onNotesChange,
  showQuickInsert,
  onToggleQuickInsert,
  onQuickInsert,
  startTime = '09:00',
  endTime = '18:00',
  selectedDate = ''
}) => {
  // 動的な定型文テンプレートを生成
  const generateQuickInsertTemplates = () => {
    // 時間をHH:MM形式に変換
    const formatTime = (time: string) => time.substring(0, 5);
    
    // 有給期間を計算
    const calculateVacationPeriod = () => {
      // 日本時間で今日の日付を取得
      const todayJST = getJSTDate();
      
      // 選択された翌勤務日の日付を取得
      const selectedWorkDate = new Date(selectedDate);
      
      // 明日の日付を計算
      const tomorrowJST = new Date(todayJST);
      tomorrowJST.setDate(todayJST.getDate() + 1);
      
      // 翌勤務日が明日の場合（有給期間なし）
      if (selectedWorkDate.toDateString() === tomorrowJST.toDateString()) {
        return '翌勤務日を確認してください。';
      }
      
      // 有給開始日（明日）
      const vacationStartDate = new Date(tomorrowJST);
      tomorrowJST.setDate(todayJST.getDate() + 1);
      // 有給終了日（翌勤務日の前日）
      const vacationEndDate = new Date(selectedWorkDate);
      vacationEndDate.setDate(selectedWorkDate.getDate() - 1);
      
      // 有給期間が1日の場合（明日の翌日が翌勤務日）
      if (vacationStartDate.toDateString() === vacationEndDate.toDateString()) {
        return `${vacationStartDate.getMonth() + 1}月${vacationStartDate.getDate()}日は有給使用のためお休みします。`;
      }
      
      // 有給期間が複数日の場合
      if (vacationStartDate < vacationEndDate) {
        return `${vacationStartDate.getMonth() + 1}月${vacationStartDate.getDate()}日～${vacationEndDate.getMonth() + 1}月${vacationEndDate.getDate()}日は有給使用のためお休みします。`;
      }
      
      // フォールバック（通常は発生しない）
      return '翌勤務日を確認してください。';
    };
    
    return [
      { 
        name: '出勤時間調整', 
        content: `【出勤】時間調整のため、${formatTime(startTime)}に出勤します。` 
      },
      { 
        name: '退勤時間調整', 
        content: `【退勤】時間調整のため、${formatTime(endTime)}に退勤します。` 
      },
      { 
        name: '有給使用', 
        content: calculateVacationPeriod()
      }
    ];
  };
  
  const quickInsertTemplates = generateQuickInsertTemplates();
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">連絡事項</h2>
      <textarea
        value={notes}
        onChange={(e) => onNotesChange(e.target.value)}
        rows={4}
        maxLength={500}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent resize-none"
        placeholder="翌日の特別な予定や注意事項があれば入力してください"
      />
      <div className="flex justify-between items-center mt-2">
        <p className="text-sm text-gray-500">
          {notes.length}/500文字
        </p>
        
        <div className="relative">
          <button
            onClick={onToggleQuickInsert}
            className="text-sm text-accent hover:text-accent/80 transition-colors flex items-center gap-1 px-2 py-1 rounded hover:bg-accent/10"
          >
            <Plus className="w-3 h-3" />
            定型文挿入
          </button>
          
          {showQuickInsert && (
            <div className="absolute right-0 top-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 min-w-[300px]">
              {quickInsertTemplates.map((template, index) => (
                <button
                  key={index}
                  onClick={() => onQuickInsert(template.content)}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors first:rounded-t-lg last:rounded-b-lg"
                >
                  {template.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* 背景クリックでドロップダウンを閉じる */}
      {showQuickInsert && (
        <div 
          className="fixed inset-0 z-5" 
          onClick={onToggleQuickInsert}
        />
      )}
    </div>
  );
});

NotesSection.displayName = 'NotesSection';

export default NotesSection;