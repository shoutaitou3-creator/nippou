import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { User } from '@supabase/supabase-js';

interface SystemStatusProps {
  user: User | null;
  hasCalendarPermission: boolean;
  calendarLoading: boolean;
  calendarError: string | null;
  calendarDataLoaded: boolean;
  lastFetchTime: Date | null;
  todayEventsCount: number;
  tomorrowEventsCount: number;
  onManualRefresh: () => void;
  onReauth: () => void;
  onRetry: () => void;
  onRecheckPermission: () => void;
}

const SystemStatus: React.FC<SystemStatusProps> = ({
  user,
  hasCalendarPermission,
  calendarLoading,
  calendarError,
  calendarDataLoaded,
  lastFetchTime,
  todayEventsCount,
  tomorrowEventsCount,
  onManualRefresh,
  onReauth,
  onRetry,
  onRecheckPermission
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">
          スケジュール管理
        </h2>
        <div className="flex items-center gap-2">
          {lastFetchTime && (
            <span className="text-xs text-gray-500">
              最終更新: {lastFetchTime.toLocaleTimeString('ja-JP')}
            </span>
          )}
          <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${
            hasCalendarPermission 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-orange-50 border border-orange-200'
          }`}>
            <AlertCircle className={`w-4 h-4 ${
              hasCalendarPermission ? 'text-green-600' : 'text-orange-600'
            }`} />
            <span className={`text-sm font-medium ${
              hasCalendarPermission ? 'text-green-700' : 'text-orange-700'
            }`}>
              カレンダー権限: {hasCalendarPermission ? '取得済み' : '未取得'}
            </span>
          </div>
          {hasCalendarPermission && !calendarLoading && (
            <button 
              onClick={onManualRefresh}
              className="bg-primary text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              更新
            </button>
          )}
          {!hasCalendarPermission && user && (
            <button 
              onClick={onRecheckPermission}
              className="bg-accent text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              権限再チェック
            </button>
          )}
        </div>
      </div>
      
      <p className="text-gray-600 mt-2">
        {hasCalendarPermission 
          ? 'Googleカレンダーと連携してスケジュールを表示しています' 
          : '認証完了後、Googleカレンダーと連携してスケジュールを表示します'
        }
      </p>
      
      {/* カレンダーエラー表示 */}
      {calendarError && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">
            <AlertCircle className="w-4 h-4 inline mr-2" />
            {calendarError}
          </p>
          <div className="mt-2 flex gap-2">
            <button 
              onClick={onRetry}
              className="text-sm text-red-600 hover:text-red-800 underline"
            >
              再試行
            </button>
            {calendarError.includes('認証エラー') && (
              <button 
                onClick={onReauth}
                className="text-sm text-red-600 hover:text-red-800 underline"
              >
                再認証
              </button>
            )}
          </div>
        </div>
      )}
      
      {/* ローディング表示 */}
      {calendarLoading && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-700 text-sm flex items-center">
            <div className="w-4 h-4 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin mr-2" />
            カレンダーデータを取得中...
          </p>
        </div>
      )}

      {/* システム状況グリッド */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">システム状況</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-700 font-medium text-sm flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              ルーティング設定完了
            </p>
          </div>
          <div className={`rounded-lg p-4 ${
            user 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-orange-50 border border-orange-200'
          }`}>
            <p className={`font-medium text-sm flex items-center gap-2 ${
              user ? 'text-green-700' : 'text-orange-700'
            }`}>
              <span className={`w-2 h-2 rounded-full ${
                user ? 'bg-green-500' : 'bg-orange-500'
              }`}></span>
              Google認証: {user ? '完了' : '設定待ち'}
            </p>
          </div>
          <div className={`rounded-lg p-4 ${
            hasCalendarPermission 
              ? 'bg-green-50 border border-green-200'
              : 'bg-gray-50 border border-gray-200'
          }`}>
            <p className={`font-medium text-sm flex items-center gap-2 ${
              hasCalendarPermission ? 'text-green-700' : 'text-gray-700'
            }`}>
              <span className={`w-2 h-2 rounded-full ${
                hasCalendarPermission ? 'bg-green-500' : 'bg-gray-500'
              }`}></span>
              カレンダー権限: {hasCalendarPermission ? '取得済み' : '未取得'}
            </p>
          </div>
          <div className={`rounded-lg p-4 ${
            calendarError 
              ? 'bg-red-50 border border-red-200'
              : calendarLoading
                ? 'bg-blue-50 border border-blue-200'
                : calendarDataLoaded
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-gray-50 border border-gray-200'
          }`}>
            <p className={`font-medium text-sm flex items-center gap-2 ${
              calendarError 
                ? 'text-red-700'
                : calendarLoading
                  ? 'text-blue-700'
                  : calendarDataLoaded
                    ? 'text-green-700'
                    : 'text-gray-700'
            }`}>
              <span className={`w-2 h-2 rounded-full ${
                calendarError 
                  ? 'bg-red-500'
                  : calendarLoading
                    ? 'bg-blue-500 animate-pulse'
                    : calendarDataLoaded
                      ? 'bg-green-500'
                      : 'bg-gray-500'
              }`}></span>
              カレンダーAPI: {
                calendarError 
                  ? 'エラー'
                  : calendarLoading
                    ? '取得中'
                    : calendarDataLoaded
                      ? '接続済み'
                      : '未接続'
              }
            </p>
          </div>
        </div>
        
        {/* カレンダーデータ統計 */}
        {hasCalendarPermission && calendarDataLoaded && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="text-sm text-blue-700 flex items-center justify-between">
              <span>
                今日: {todayEventsCount}件の予定 | 明日: {tomorrowEventsCount}件の予定
              </span>
              {lastFetchTime && (
                <span className="text-xs">
                  {lastFetchTime.toLocaleString('ja-JP')} 更新
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemStatus;