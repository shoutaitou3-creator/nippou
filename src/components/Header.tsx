import React from 'react';
import { LogOut, User, Home, Edit, List, Settings, Clock, Calendar, Menu, X, Megaphone, BookOpen, ChevronDown } from 'lucide-react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { Link, useLocation } from 'react-router-dom';

interface HeaderProps {
  user: SupabaseUser | null;
  onSignOut: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onSignOut }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isDesktopMenuOpen, setIsDesktopMenuOpen] = React.useState(false);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const toggleDesktopMenu = () => {
    setIsDesktopMenuOpen(!isDesktopMenuOpen);
  };

  const closeDesktopMenu = () => {
    setIsDesktopMenuOpen(false);
  };

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    try {
      await onSignOut();
    } catch (error) {
      console.error('ログアウトエラー:', error);
    } finally {
      // モバイル環境での追加待機時間
      setTimeout(() => {
        setIsLoggingOut(false);
      }, 500);
    }
  };

  return (
    <>
      <header className="bg-primary text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center gap-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold truncate">
                株式会社リサスティー
              </h1>
              <p className="text-primary-100 text-xs sm:text-sm">
                日報システム
              </p>
            </div>
            
            {/* ナビゲーションメニュー */}
            <nav className="hidden md:flex items-center gap-1">
              {/* 日報ワークフローグループ */}
              <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1 mr-2">
                <Link
                  to="/daily-report-create"
                  className={`flex items-center gap-2 px-3 py-2 text-white hover:bg-white/10 rounded-lg transition-colors text-sm ${
                    location.pathname === '/daily-report-create' ? 'bg-white/20' : ''
                  }`}
                >
                  <Edit className="w-4 h-4" />
                  <span>日報作成</span>
                </Link>
                
                <Link
                  to="/next-day-settings"
                  className={`flex items-center gap-2 px-3 py-2 text-white hover:bg-white/10 rounded-lg transition-colors text-sm ${
                    location.pathname === '/next-day-settings' ? 'bg-white/20' : ''
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  <span>翌日設定</span>
                </Link>
                
                <Link
                  to="/work-hours"
                  className={`flex items-center gap-2 px-3 py-2 text-white hover:bg-white/10 rounded-lg transition-colors text-sm ${
                    location.pathname === '/work-hours' ? 'bg-white/20' : ''
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  <span>日報確認</span>
                </Link>
              </div>
              
              <Link
                to="/previous-day-report"
                className={`flex items-center gap-2 px-3 py-2 text-white hover:bg-white/10 rounded-lg transition-colors text-sm ${
                  location.pathname === '/previous-day-report' ? 'bg-white/20' : ''
                }`}
              >
                <Edit className="w-4 h-4" />
                <span>前日作成</span>
              </Link>
              
              <Link
                to="/reports"
                className={`flex items-center gap-2 px-3 py-2 text-white hover:bg-white/10 rounded-lg transition-colors text-sm ${
                  location.pathname === '/reports' ? 'bg-white/20' : ''
                }`}
              >
                <List className="w-4 h-4" />
                <span>日報一覧</span>
              </Link>
            </nav>
          </div>
          
          {/* ユーザー情報とハンバーガーメニュー */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* デスクトップ版メニュー */}
            <div className="hidden md:block relative">
              <button
                onClick={toggleDesktopMenu}
                className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg hover:bg-white/20 transition-colors"
              >
                <User className="w-4 h-4" />
                <span className="text-sm">
                  {user?.user_metadata?.full_name || user?.email || (user ? 'ログイン済み' : 'ゲスト')}
                </span>
                <Menu className="w-4 h-4" />
              </button>

              {/* デスクトップ版ドロップダウンメニュー */}
              {isDesktopMenuOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40"
                    onClick={closeDesktopMenu}
                  />
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-xl border z-50 max-h-96 overflow-y-auto">
                    <div className="p-4 border-b border-gray-200">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-600" />
                        <span className="text-sm text-gray-800 font-medium">
                          {user?.user_metadata?.full_name || user?.email || 'ユーザー'}
                        </span>
                      </div>
                    </div>
                    
                    <nav className="p-2">
                      <Link
                        to="/dashboard"
                        className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        onClick={closeDesktopMenu}
                      >
                        <Home className="w-4 h-4" />
                        <span>ダッシュボード</span>
                      </Link>
                      
                      <Link
                        to="/settings"
                        className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        onClick={closeDesktopMenu}
                      >
                        <Settings className="w-4 h-4" />
                        <span>個人設定</span>
                      </Link>
                      
                      <div className="border-t border-gray-200 my-2"></div>
                      
                      <Link
                        to="/update-info"
                        className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        onClick={closeDesktopMenu}
                      >
                        <Megaphone className="w-4 h-4" />
                        <span>更新情報</span>
                      </Link>
                      
                      <Link
                        to="/user-manual"
                        className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        onClick={closeDesktopMenu}
                      >
                        <BookOpen className="w-4 h-4" />
                        <span>簡易マニュアル</span>
                      </Link>
                      
                      <div className="border-t border-gray-200 my-2"></div>
                      
                      <button 
                        onClick={() => {
                          closeDesktopMenu();
                          handleSignOut();
                        }}
                        disabled={isLoggingOut}
                        className="w-full flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoggingOut ? (
                          <>
                            <div className="w-4 h-4 border-2 border-red-600/30 border-t-red-600 rounded-full animate-spin" />
                            <span>ログアウト中...</span>
                          </>
                        ) : (
                          <>
                            <LogOut className="w-4 h-4" />
                            <span>ログアウト</span>
                          </>
                        )}
                      </button>
                    </nav>
                  </div>
                </>
              )}
            </div>
              
            {/* ハンバーガーメニューボタン - モバイルのみ */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden bg-white text-primary py-2 px-3 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center justify-center"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      </header>

      {/* モバイルメニューオーバーレイ */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* モバイルメニュー */}
      <div className={`
        fixed top-0 right-0 h-full w-80 bg-primary z-50 transform transition-transform duration-300 ease-in-out md:hidden
        ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="p-6 h-full overflow-y-auto">
          {/* ヘッダー */}
          <div className="flex justify-between items-center mb-8 sticky top-0 bg-primary z-10 py-2 -mt-2">
            <div className="text-white">
              <h2 className="text-xl font-bold">リサスティー</h2>
              <p className="text-primary-100 text-sm">日報システム</p>
            </div>
            <button
              onClick={closeMobileMenu}
              className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {/* ユーザー情報 */}
          <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg mb-6 sticky top-16 bg-primary z-10">
            <User className="w-4 h-4 text-white" />
            <span className="text-sm text-white">
              {user?.user_metadata?.full_name || user?.email || (user ? 'ログイン済み' : 'ゲスト')}
            </span>
          </div>
          
          {/* ナビゲーションメニュー */}
          <nav className="space-y-2 mb-8 pb-20">
            {/* ダッシュボードリンクを追加 */}
            <Link
              to="/dashboard"
              className={`flex items-center justify-end gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg transition-colors ${
                location.pathname === '/dashboard' ? 'bg-white/20' : ''
              }`}
              onClick={closeMobileMenu}
            >
              <span>ダッシュボード</span>
              <Home className="w-5 h-5" />
            </Link>
            
            {/* 区切り線 */}
            <div className="border-t border-white/20 my-2"></div>
            
            {/* 日報ワークフローグループ */}
            <div className="bg-white/5 rounded-lg p-2 mb-4">
              <Link
                to="/daily-report-create"
                className={`flex items-center justify-end gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg transition-colors ${
                  location.pathname === '/daily-report-create' ? 'bg-white/20' : ''
                }`}
                onClick={closeMobileMenu}
              >
                <span>日報作成</span>
                <Edit className="w-5 h-5" />
              </Link>
              
              <Link
                to="/next-day-settings"
                className={`flex items-center justify-end gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg transition-colors ${
                  location.pathname === '/next-day-settings' ? 'bg-white/20' : ''
                }`}
                onClick={closeMobileMenu}
              >
                <span>翌日設定</span>
                <Calendar className="w-5 h-5" />
              </Link>
              
              <Link
                to="/work-hours"
                className={`flex items-center justify-end gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg transition-colors ${
                  location.pathname === '/work-hours' ? 'bg-white/20' : ''
                }`}
                onClick={closeMobileMenu}
              >
                <span>日報確認</span>
                <Clock className="w-5 h-5" />
              </Link>
            </div>
            
            <Link
              to="/previous-day-report"
              className={`flex items-center justify-end gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg transition-colors ${
                location.pathname === '/previous-day-report' ? 'bg-white/20' : ''
              }`}
              onClick={closeMobileMenu}
            >
              <span>前日作成</span>
              <Edit className="w-5 h-5" />
            </Link>
            
            <Link
              to="/reports"
              className={`flex items-center justify-end gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg transition-colors ${
                location.pathname === '/reports' ? 'bg-white/20' : ''
              }`}
              onClick={closeMobileMenu}
            >
              <span>日報一覧</span>
              <List className="w-5 h-5" />
            </Link>
            
            <Link
              to="/settings"
              className={`flex items-center justify-end gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg transition-colors ${
                location.pathname === '/settings' ? 'bg-white/20' : ''
              }`}
              onClick={closeMobileMenu}
            >
              <span>個人設定</span>
              <Settings className="w-5 h-5" />
            </Link>
            
            {/* 区切り線 */}
            <div className="border-t border-white/20 my-2"></div>
            
            <Link
              to="/update-info"
              className="flex items-center justify-end gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg transition-colors"
              onClick={closeMobileMenu}
            >
              <span>更新情報</span>
              <Megaphone className="w-5 h-5" />
            </Link>
            
            <Link
              to="/user-manual"
              className="flex items-center justify-end gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg transition-colors"
              onClick={closeMobileMenu}
            >
              <span>簡易マニュアル</span>
              <BookOpen className="w-5 h-5" />
            </Link>
          </nav>
          
          {/* ログアウトボタン */}
          <div className="border-t border-white/20 pt-4 sticky bottom-0 bg-primary z-10 pb-6 -mb-6">
            <button 
              onClick={handleSignOut}
              disabled={isLoggingOut}
              className="w-full flex items-center justify-end gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoggingOut ? (
                <>
                  <span>ログアウト中...</span>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                </>
              ) : (
                <>
                  <span>ログアウト</span>
                  <LogOut className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;