import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading, authInitialized } = useAuth();
  const location = useLocation();

  console.log('=== ProtectedRoute 状態チェック ===', {
    hasUser: !!user, 
    authInitialized,
    userEmail: user?.email,
    currentPath: window.location.pathname
  });

  // 開発モードのチェック（URLにdev=trueが含まれている場合）
  const isDevelopmentMode = new URLSearchParams(location.search).get('dev') === 'true';
  
  if (isDevelopmentMode) {
    console.log('=== ProtectedRoute: 開発モード検出、認証をスキップ ===');
    return <>{children}</>;
  }

  if (!authInitialized) {
    console.log('=== ProtectedRoute: 認証初期化中 ===');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <div className="text-primary text-lg text-center">認証状態を確認中...</div>
          <div className="text-gray-500 text-sm text-center mt-2">しばらくお待ちください</div>
          {/* モバイル環境での追加処理 */}
          <div className="text-xs text-gray-400 text-center mt-4">
            長時間この画面が表示される場合は、<br />
            ページを再読み込みしてください
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('=== ProtectedRoute: 未認証ユーザー検出、ログイン画面にリダイレクト ===');
    return <Navigate to="/login" replace />;
  }

  console.log('=== ProtectedRoute: 認証済みユーザー、保護されたコンテンツを表示 ===');
  return <>{children}</>;
};

export default ProtectedRoute;