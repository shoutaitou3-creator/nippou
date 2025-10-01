import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading, authInitialized } = useAuth();
  const location = useLocation();
  const [showTimeoutWarning, setShowTimeoutWarning] = React.useState(false);

  console.log('=== ProtectedRoute 状態チェック ===', {
    hasUser: !!user,
    authInitialized,
    userEmail: user?.email,
    currentPath: window.location.pathname
  });

  // 開発モードのチェック（URLにdev=trueが含まれている場合）
  const isDevelopmentMode = new URLSearchParams(location.search).get('dev') === 'true';

  // 5秒後にタイムアウト警告を表示
  React.useEffect(() => {
    if (!authInitialized) {
      const timeoutId = setTimeout(() => {
        setShowTimeoutWarning(true);
      }, 5000);

      return () => clearTimeout(timeoutId);
    }
  }, [authInitialized]);

  if (isDevelopmentMode) {
    console.log('=== ProtectedRoute: 開発モード検出、認証をスキップ ===');
    return <>{children}</>;
  }

  if (!authInitialized) {
    console.log('=== ProtectedRoute: 認証初期化中 ===');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <div className="text-primary text-lg text-center">認証状態を確認中...</div>
          <div className="text-gray-500 text-sm text-center mt-2">しばらくお待ちください</div>

          {showTimeoutWarning && (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800 text-center mb-3">
                認証に時間がかかっています。
                <br />
                下記のボタンでページを再読み込みしてください。
              </p>
              <button
                onClick={() => window.location.reload()}
                className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                ページを再読み込み
              </button>
            </div>
          )}
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