import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import Header from '../components/Header';
import ScreenshotModal from '../components/ScreenshotModal';
import { 
  List, 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  User, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Eye,
  Edit,
  Download,
  ChevronLeft,
  ChevronRight,
  MoreVertical
} from 'lucide-react';
import { DailyReportData } from '../types/daily-report';

interface NextDaySettings {
  work_date: string;
  start_time: string;
  end_time: string;
  notes: string;
  calendar_events: any[];
}

const Reports: React.FC = () => {
  const { user, signOut } = useAuth();
  
  // 状態管理
  const [reports, setReports] = useState<DailyReportData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'submitted' | 'draft'>('all');
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`;
  });
  const [customDateFrom, setCustomDateFrom] = useState('');
  const [customDateTo, setCustomDateTo] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReport, setSelectedReport] = useState<DailyReportData | null>(null);
  const [showScreenshotModal, setShowScreenshotModal] = useState(false);
  const [nextDaySettings, setNextDaySettings] = useState<NextDaySettings | null>(null);
  
  const reportsPerPage = 10;

  const handleSignOut = React.useCallback(async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('ログアウト処理エラー:', error);
    }
  }, [signOut]);

  // データベースから日報データを取得
  useEffect(() => {
    const loadReports = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      console.log('=== 日報一覧データ取得開始 ===', { userId: user.id });
      
      setLoading(true);
      setError(null);
      
      try {
        const { data, error } = await supabase
          .from('daily_reports')
          .select('*')
          .eq('user_id', user.id)
          .order('report_date', { ascending: false });

        console.log('=== Supabase クエリ結果 ===', { data, error });

        if (error) {
          console.error('日報データ取得エラー:', error);
          setError('日報データの取得に失敗しました');
          return;
        }

        if (data) {
          console.log('=== 日報データ取得成功 ===', {
            count: data.length,
            reports: data.map(r => ({
              id: r.id,
              date: r.report_date,
              draft_status: r.draft_status,
              submitted_at: r.submitted_at
            }))
          });
          setReports(data as DailyReportData[]);
        } else {
          setReports([]);
        }
      } catch (error) {
        console.error('日報データ取得エラー:', error);
        setError('日報データの取得中にエラーが発生しました');
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, [user]);

  // フィルタリング処理
  const filteredReports = reports.filter(report => {
    // 月フィルター
    const reportDate = new Date(report.report_date);
    const [year, month] = selectedMonth.split('-').map(Number);
    const reportYear = reportDate.getFullYear();
    const reportMonth = reportDate.getMonth() + 1;
    
    if (reportYear !== year || reportMonth !== month) return false;
    
    return true;
  });

  // ページネーション
  const totalPages = Math.ceil(filteredReports.length / reportsPerPage);
  const startIndex = (currentPage - 1) * reportsPerPage;
  const paginatedReports = filteredReports.slice(startIndex, startIndex + reportsPerPage);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short'
    });
  };

  const formatMonthYear = (monthString: string) => {
    const [year, month] = monthString.split('-');
    return `${year}年${month}月`;
  };

  const getPreviousMonth = (monthString: string) => {
    const [year, month] = monthString.split('-').map(Number);
    const date = new Date(year, month - 1, 1);
    date.setMonth(date.getMonth() - 1);
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
  };

  const getNextMonth = (monthString: string) => {
    const [year, month] = monthString.split('-').map(Number);
    const date = new Date(year, month - 1, 1);
    date.setMonth(date.getMonth() + 1);
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('ja-JP');
  };

  const getStatusBadge = (report: DailyReportData) => {
    if (report.draft_status) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">
          <AlertCircle className="w-3 h-3" />
          下書き
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
          <CheckCircle className="w-3 h-3" />
          提出済み
        </span>
      );
    }
  };

  const handleViewDetail = (report: DailyReportData) => {
    loadNextDaySettingsForReport(report);
  };

  // 選択された日報の翌日設定を取得
  const loadNextDaySettingsForReport = async (report: DailyReportData) => {
    setSelectedReport(report);
    
    try {
      // 日報の翌日の日付を計算
      const reportDate = new Date(report.report_date);
      const nextDay = new Date(reportDate);
      nextDay.setDate(reportDate.getDate() + 1);
      const nextDayString = nextDay.toISOString().split('T')[0];
      
      const { data: settings, error } = await supabase
        .from('next_day_settings')
        .select('*')
        .eq('user_id', user?.id)
        .eq('work_date', nextDayString)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('翌日設定取得エラー:', error);
      }

      setNextDaySettings(settings as NextDaySettings || null);
    } catch (error) {
      console.error('翌日設定読み込みエラー:', error);
      setNextDaySettings(null);
    }
    
    setShowScreenshotModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header user={user} onSignOut={handleSignOut} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">日報データを読み込み中...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header user={user} onSignOut={handleSignOut} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-400" />
            <p className="text-lg font-medium text-red-600 mb-2">エラーが発生しました</p>
            <p className="text-sm text-gray-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              再読み込み
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} onSignOut={handleSignOut} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ページヘッダー */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <List className="w-8 h-8 text-primary" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              日報一覧
            </h1>
          </div>
          <p className="text-gray-600">
            提出済みの日報を確認できます
          </p>
        </div>

        {/* 月選択 */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSelectedMonth(getPreviousMonth(selectedMonth))}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <h2 className="text-lg font-semibold text-gray-800">
              {formatMonthYear(selectedMonth)}
            </h2>
            
            <button
              onClick={() => setSelectedMonth(getNextMonth(selectedMonth))}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 日報リスト */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          {paginatedReports.length > 0 ? (
            <>
              {/* デスクトップ版テーブル */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        日付
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        内容
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ステータス
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        提出日時
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        アクション
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedReports.map((report) => (
                      <tr key={report.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-medium text-gray-900">
                              {formatDate(report.report_date)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-xs truncate">
                            {report.work_content}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(report)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {report.submitted_at ? formatDateTime(report.submitted_at) : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleViewDetail(report)}
                              className="text-primary hover:text-primary/80 transition-colors p-1"
                              title="詳細表示"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* モバイル版カードレイアウト */}
              <div className="md:hidden divide-y divide-gray-200">
                {paginatedReports.map((report) => (
                  <div key={report.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className="text-sm font-medium text-gray-900">
                          {formatDate(report.report_date)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(report)}
                        <button
                          onClick={() => handleViewDetail(report)}
                          className="text-primary hover:text-primary/80 transition-colors p-1"
                          title="詳細表示"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <p className="text-sm text-gray-900 line-clamp-2 leading-relaxed">
                        {report.work_content || '内容なし'}
                      </p>
                    </div>
                    
                    {report.submitted_at && (
                      <div className="text-xs text-gray-500">
                        提出日時: {formatDateTime(report.submitted_at)}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* ページネーション */}
              {totalPages > 1 && (
                <div className="px-4 md:px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-sm text-gray-500 order-2 sm:order-1">
                    {startIndex + 1} - {Math.min(startIndex + reportsPerPage, filteredReports.length)} / {filteredReports.length} 件
                  </div>
                  <div className="flex items-center gap-2 order-1 sm:order-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg hover:bg-gray-100"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const page = i + 1;
                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-3 py-1 text-sm rounded-lg ${
                              currentPage === page
                                ? 'bg-primary text-white'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}
                    </div>
                    
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg hover:bg-gray-100"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <List className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium text-gray-500 mb-2">日報が見つかりません</p>
              <p className="text-sm text-gray-400">検索条件を変更してお試しください</p>
            </div>
          )}
        </div>
      </main>

      {/* スクリーンショット用モーダル */}
      {showScreenshotModal && selectedReport && (
        <ScreenshotModal
          dailyReport={selectedReport}
          nextDaySettings={nextDaySettings}
          reportDate={formatDate(selectedReport.report_date)}
          userName={user?.user_metadata?.full_name || user?.email || 'ユーザー'}
          onClose={() => setShowScreenshotModal(false)}
        />
      )}

      {/* エクスポートボタン */}
      <div className="mt-8 flex justify-center px-4">
        <button className="bg-primary text-white py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 shadow-sm w-full sm:w-auto">
          <Download className="w-4 h-4" />
          エクスポート
        </button>
      </div>
    </div>
  );
};

export default Reports;