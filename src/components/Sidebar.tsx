import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Edit, List, Settings, X } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  
  const handleLinkClick = (path: string) => {
    console.log('=== サイドバーリンククリック ===', { 
      clickedPath: path, 
      currentPath: location.pathname 
    });
    onClose(); // サイドバーを閉じる
  };

  return (
    <>
      {/* オーバーレイ背景（モバイルのみ） */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* サイドバー */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-60 bg-primary
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:z-40
      `}>
        <div className="p-6">
          {/* モバイル用閉じるボタン */}
          <div className="flex justify-between items-center mb-8 lg:block">
            <div className="text-white">
              <h2 className="text-xl font-bold">リサスティー</h2>
              <p className="text-primary-100 text-sm">日報管理システム</p>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <nav className="space-y-2">
            <Link
              to="/dashboard"
              className={`flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg transition-colors ${
                location.pathname === '/dashboard' ? 'bg-white/20' : ''
              }`}
              onClick={() => handleLinkClick('/dashboard')}
            >
              <Home className="w-5 h-5" />
              <span>ダッシュボード</span>
            </Link>
            
            <Link
              to="/daily-report-create"
              className={`flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg transition-colors ${
                location.pathname === '/daily-report-create' ? 'bg-white/20' : ''
              }`}
              onClick={() => handleLinkClick('/daily-report-create')}
            >
              <Edit className="w-5 h-5" />
              <span>本日の日報</span>
            </Link>
            
            <Link
              to="/work-time"
              className={`flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg transition-colors ${
                location.pathname === '/work-time' ? 'bg-white/20' : ''
              }`}
              onClick={() => handleLinkClick('/work-time')}
            >
              <Settings className="w-5 h-5" />
              <span>勤務時間</span>
            </Link>
            
            <Link
              to="/next-day-settings"
              className={`flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg transition-colors ${
                location.pathname === '/next-day-settings' ? 'bg-white/20' : ''
              }`}
              onClick={() => handleLinkClick('/next-day-settings')}
            >
              <Settings className="w-5 h-5" />
              <span>翌日設定</span>
            </Link>
            
            <Link
              to="/previous-day-report"
              className={`flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg transition-colors ${
                location.pathname === '/previous-day-report' ? 'bg-white/20' : ''
              }`}
              onClick={() => handleLinkClick('/previous-day-report')}
            >
              <Edit className="w-5 h-5" />
              <span>前日作成</span>
            </Link>
            
            <Link
              to="/reports"
              className={`flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg transition-colors ${
                location.pathname === '/reports' ? 'bg-white/20' : ''
              }`}
              onClick={() => handleLinkClick('/reports')}
            >
              <List className="w-5 h-5" />
              <span>日報一覧</span>
            </Link>
            
            <Link
              to="/settings"
              className={`flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg transition-colors ${
                location.pathname === '/settings' ? 'bg-white/20' : ''
              }`}
              onClick={() => handleLinkClick('/settings')}
            >
              <Settings className="w-5 h-5" />
              <span>設定</span>
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;