import React from 'react';
import { Clock, Users, Briefcase, FileText, Monitor, Store, UserCheck, Car, Coffee, Activity } from 'lucide-react';
import { 
  calculateWorkTime, 
  getWorkTimeAnalysis, 
  minutesToTimeString, 
  getCategoryDisplayName,
  InternalCalendarEvent 
} from '../../utils/workTimeCalculator';

interface WorkHoursDisplayProps {
  calendarEvents: InternalCalendarEvent[];
  workStartTime?: string;
  workEndTime?: string;
}

// 業務分類ごとのアイコンと色設定
const getCategoryConfig = (category: string) => {
  const configs = {
    meeting: {
      icon: Users,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      iconColor: 'text-blue-600',
      textColor: 'text-blue-800'
    },
    sales: {
      icon: Briefcase,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      iconColor: 'text-green-600',
      textColor: 'text-green-800'
    },
    document: {
      icon: FileText,
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      iconColor: 'text-purple-600',
      textColor: 'text-purple-800'
    },
    onlineTraining: {
      icon: Monitor,
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
      iconColor: 'text-indigo-600',
      textColor: 'text-indigo-800'
    },
    storeTraining: {
      icon: Store,
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      iconColor: 'text-emerald-600',
      textColor: 'text-emerald-800'
    },
    recruitment: {
      icon: UserCheck,
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-200',
      iconColor: 'text-pink-600',
      textColor: 'text-pink-800'
    },
    travel: {
      icon: Car,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      iconColor: 'text-yellow-600',
      textColor: 'text-yellow-800'
    },
    break: {
      icon: Coffee,
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      iconColor: 'text-orange-600',
      textColor: 'text-orange-800'
    },
    other: {
      icon: Activity,
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
      iconColor: 'text-gray-600',
      textColor: 'text-gray-800'
    }
  };
  
  return configs[category as keyof typeof configs] || configs.other;
};

const WorkHoursDisplay: React.FC<WorkHoursDisplayProps> = ({ 
  calendarEvents, 
  workStartTime = '09:00', 
  workEndTime = '18:00' 
}) => {
  const workTimeBreakdown = calculateWorkTime(calendarEvents, workStartTime, workEndTime);
  const analysis = getWorkTimeAnalysis(workTimeBreakdown);

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 lg:p-6">
      <div className="flex items-center gap-3 mb-6">
        <Clock className="w-6 h-6 text-primary" />
        <h2 className="text-lg lg:text-xl font-semibold text-gray-800">
          本日の勤務時間
        </h2>
      </div>
      
      {/* 総勤務時間の表示 */}
      <div className="mb-6 pb-4 border-b border-gray-200">
        <div className="grid grid-cols-3 gap-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">勤務時間</p>
            <p className="font-medium text-primary">
              {workStartTime.substring(0, 5)} - {workEndTime.substring(0, 5)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">時間数</p>
            <p className="font-medium text-primary">
              {minutesToTimeString(workTimeBreakdown.totalWork)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">休憩時間</p>
            <p className="font-medium text-primary">
              {workTimeBreakdown.break > 0 ? minutesToTimeString(workTimeBreakdown.break) : '0時間'}
            </p>
          </div>
        </div>
      </div>
      
      {/* 業務分類カード表示 */}
      {analysis.categories.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {analysis.categories.filter(categoryItem => categoryItem.key !== 'break').map((categoryItem) => {
            const config = getCategoryConfig(categoryItem.key);
            const IconComponent = config.icon;
            
            return (
              <div 
                key={categoryItem.key} 
                className={`${config.bgColor} ${config.borderColor} border rounded-lg p-3 transition-all hover:shadow-sm cursor-default`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <IconComponent className={`w-4 h-4 ${config.iconColor} flex-shrink-0`} />
                    <span className={`text-sm lg:text-base font-medium ${config.textColor} line-clamp-2 leading-tight h-8 lg:h-10 flex items-center`}>
                      {getCategoryDisplayName(categoryItem.key)}
                    </span>
                  </div>
                  <span className={`text-sm font-semibold ${config.textColor} ml-2 flex-shrink-0`}>
                    {minutesToTimeString(categoryItem.time)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* 予定がない場合の表示 */
        <div className="text-center py-8 text-gray-500">
          <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium mb-2">予定が登録されていません</p>
          <p className="text-sm">予定を追加すると勤務時間が自動計算されます</p>
        </div>
      )}
    </div>
  );
};

export default WorkHoursDisplay;