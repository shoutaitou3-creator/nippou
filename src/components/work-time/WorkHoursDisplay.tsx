interface WorkHoursDisplayProps {
  calendarEvents: InternalCalendarEvent[];
  workStartTime: string;
  workEndTime: string;
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
    focus: {
      icon: Brain,
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      iconColor: 'text-purple-600',
      textColor: 'text-purple-800'
    },
    break: {
      icon: Coffee,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      iconColor: 'text-green-600',
      textColor: 'text-green-800'
    },
    admin: {
      icon: FileText,
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      iconColor: 'text-orange-600',
      textColor: 'text-orange-800'
    },
    other: {
      icon: Clock,
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
      iconColor: 'text-gray-600',
      textColor: 'text-gray-800'
    },
    idle: {
      icon: Activity,
      bgColor: 'bg-slate-50',
      borderColor: 'border-slate-200',
      iconColor: 'text-slate-600',
      textColor: 'text-slate-800'
    }
  };
  
  return configs[category as keyof typeof configs] || configs.other;
};

const WorkHoursDisplay: React.FC<WorkHoursDisplayProps> = ({ calendarEvents, workStartTime, workEndTime }) => {
  const workTimeBreakdown = calculateWorkTime(calendarEvents, workStartTime, workEndTime);
  const analysis = getWorkTimeAnalysis(workTimeBreakdown);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          勤務時間分析
        </h2>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">勤務時間</p>
            <p className="font-medium text-primary">
              {displayTime(workStartTime)} - {displayTime(workEndTime)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">総勤務時間</p>
            <p className="font-medium text-gray-900">
              {formatDuration(workTimeBreakdown.totalWorkTime)}
            </p>
          </div>
        </div>
      </div>

      {/* 時間配分の円グラフ */}
      <div className="mb-6">
        <div className="flex justify-center mb-4">
          <div className="w-48 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analysis.chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="minutes"
                >
                  {analysis.chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [formatDuration(value), '時間']}
                  labelFormatter={(label) => `${label}`}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 凡例 */}
        <div className="grid grid-cols-2 gap-3">
          {analysis.chartData.map((item) => {
            const config = getCategoryConfig(item.category);
            const Icon = config.icon;
            
            return (
              <div
                key={item.category}
                className={`flex items-center gap-3 p-3 rounded-lg border ${config.bgColor} ${config.borderColor}`}
              >
                <Icon className={`w-4 h-4 ${config.iconColor}`} />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${config.textColor}`}>
                      {item.name}
                    </span>
                    <span className={`text-sm ${config.textColor}`}>
                      {formatDuration(item.minutes)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mr-2">
                      <div
                        className="h-1.5 rounded-full"
                        style={{
                          width: `${item.percentage}%`,
                          backgroundColor: item.color
                        }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {item.percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 分析結果 */}
      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-sm font-medium text-gray-900 mb-3">分析結果</h3>
        <div className="space-y-2">
          {analysis.insights.map((insight, index) => (
            <div key={index} className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
              <p className="text-sm text-gray-700">{insight}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkHoursDisplay;