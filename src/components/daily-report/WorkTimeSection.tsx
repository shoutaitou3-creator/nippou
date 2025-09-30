import React from 'react';
import { Clock } from 'lucide-react';
import TimeDropdown from './TimeDropdown';
import { displayTime, calculateWorkDuration } from '../../utils/timeUtils';

interface WorkTimeSectionProps {
  workStartTime: string;
  workEndTime: string;
  onWorkStartTimeChange: (time: string) => void;
  onWorkEndTimeChange: (time: string) => void;
  isReadOnly?: boolean;
}

const WorkTimeSection: React.FC<WorkTimeSectionProps> = ({
  workStartTime,
  workEndTime,
  onWorkStartTimeChange,
  onWorkEndTimeChange,
  isReadOnly = false
}) => {
  // 勤務時間を計算
  const calculateWorkHours = () => {
    return calculateWorkDuration(workStartTime, workEndTime);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 lg:p-6">
      <div className="flex items-center gap-3 mb-4">
        <Clock className="w-6 h-6 text-primary" />
        <h2 className="text-lg lg:text-xl font-semibold text-gray-800">
          勤務時間
        </h2>
      </div>
      
      <div className="grid grid-cols-3 gap-2 md:gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            開始
          </label>
          {isReadOnly ? (
            <div className="px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 text-sm">
              {displayTime(workStartTime)}
            </div>
          ) : (
            <TimeDropdown
              value={workStartTime}
              onChange={onWorkStartTimeChange}
            />
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            終了
          </label>
          {isReadOnly ? (
            <div className="px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 text-sm">
              {displayTime(workEndTime)}
            </div>
          ) : (
            <TimeDropdown
              value={workEndTime}
              onChange={onWorkEndTimeChange}
            />
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            時間(休憩含)
          </label>
          <div className="px-3 py-2 bg-gray-50 rounded-lg text-sm font-medium text-primary">
            {calculateWorkHours()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkTimeSection;