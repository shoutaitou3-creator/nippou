import React from 'react';
import { Link } from 'react-router-dom';
import { Home, FileText, Settings } from 'lucide-react';

const NavigationMenu: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-secondary mb-4">
        メニュー
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link 
          to="/dashboard"
          className="flex items-center gap-3 p-4 bg-primary/5 border border-primary/20 rounded-lg hover:bg-primary/10 transition-colors"
        >
          <Home className="w-6 h-6 text-primary" />
          <div className="text-left">
            <p className="font-medium text-primary">ホーム</p>
            <p className="text-sm text-gray-500">ダッシュボード概要</p>
          </div>
        </Link>
        <Link 
          href="/daily-report-create"
          to="/daily-report-create"
          className="flex items-center gap-3 p-4 bg-secondary/5 border border-secondary/20 rounded-lg hover:bg-secondary/10 transition-colors"
        >
          <FileText className="w-6 h-6 text-secondary" />
          <div className="text-left">
            <p className="font-medium text-secondary">日報管理</p>
            <p className="text-sm text-gray-500">日報の作成・編集</p>
          </div>
        </Link>
        <Link 
          to="/settings"
          className="flex items-center gap-3 p-4 bg-accent/5 border border-accent/20 rounded-lg hover:bg-accent/10 transition-colors"
        >
          <Settings className="w-6 h-6 text-accent" />
          <div className="text-left">
            <p className="font-medium text-accent">設定</p>
            <p className="text-sm text-gray-500">アカウント設定</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default NavigationMenu;