import React from 'react';
import { Clock, Save, CheckCircle, AlertTriangle } from 'lucide-react';
import TimeDropdown from '../daily-report/TimeDropdown';
import { calculateWorkDuration } from '../../utils/timeUtils';

interface StandardWorkTimeSettingsProps {
  standardStartTime: string;
  standardEndTime: string;
  onStartTimeChange: (time: string) => void;
  onEndTimeChange: (time: string) => void;
  onSave: () => void;
  isSaving: boolean;
  saveMessage: string;
}

const StandardWorkTimeSettings: React.FC<StandardWorkTimeSettingsProps> = ({
  standardStartTime,
  standardEndTime,
  onStartTimeChange,
  onEndTimeChange,
  onSave,
  isSaving,
  saveMessage
}) => {
  // 勤務時間の妥当性チェック
  const getWorkTimeValidation = () => {
    const [startHour, startMinute] = standardStartTime.split(':').map(Number);
    const [endHour, endMinute] = standardEndTime.split(':').map(Number);
    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;
    const totalMinutes = endMinutes - startMinutes;
    
    const workDuration = calculateWorkDuration(standardStartTime, standardEndTime);
    
    if (totalMinutes > 540) { // 9時間 = 540分
      return {
        type: 'warning',
        icon: AlertTriangle,
        color: 'orange',
        title: '勤務時間数が超過しています',
        message: `${standardStartTime} - ${standardEndTime} (${workDuration})`,
        advice: '休憩時間を含む9時間に設定してください。'
      };
    } else if (totalMinutes < 540) {
      return {
        type: 'warning',
        icon: AlertTriangle,
        color: 'orange',
        title: '勤務時間数が少ないです',
        message: `${standardStartTime} - ${standardEndTime} (${workDuration})`,
        advice: '休憩時間を含む9時間に設定してください。'
      };
    } else {
      return {
        type: 'success',
        icon: CheckCircle,
        color: 'green',
        title: '設定は正常です',
        message: `${standardStartTime} - ${standardEndTime} (${workDuration})`,
        advice: ''
      };
    }
  };

  const validation = getWorkTimeValidation();

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center gap-3 mb-6">
        <Clock className="w-6 h-6 text-primary" />
        <h2 className="text-xl font-semibold text-gray-800">標準勤務時間設定</h2>
      </div>
      
      <p className="text-gray-600 mb-6">
        日報作成時にデフォルトで表示される勤務時間を設定できます
      </p>
      
      <div className="space-y-6">
        <div className="grid grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              標準開始時間
            </label>
            <TimeDropdown
              value={standardStartTime}
              onChange={onStartTimeChange}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              標準終了時間
            </label>
            <TimeDropdown
              value={standardEndTime}
              onChange={onEndTimeChange}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              予定勤務時間
            </label>
            <div className="px-3 py-2 bg-primary/10 rounded-lg text-sm font-medium text-primary border border-primary/20">
              {calculateWorkDuration(standardStartTime, standardEndTime)}
            </div>
          </div>
        </div>
        
        {/* 勤務時間の妥当性チェック表示 */}
        <div className={`bg-${validation.color}-50 border border-${validation.color}-200 rounded-lg p-4`}>
          <div className="flex items-center gap-2 mb-2">
            <validation.icon className={`w-4 h-4 text-${validation.color}-600`} />
            <span className={`text-sm font-medium text-${validation.color}-800`}>
              {validation.title}
            </span>
          </div>
          <p className={`text-sm text-${validation.color}-700`}>
            {validation.message}
          </p>
          {validation.advice && (
            <p className={`text-sm text-${validation.color}-700 mt-1`}>
              {validation.advice}
            </p>
          )}
        </div>
        
        <div className="flex justify-end">
          <button
            onClick={onSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                保存中...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                標準勤務時間を保存
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StandardWorkTimeSettings;