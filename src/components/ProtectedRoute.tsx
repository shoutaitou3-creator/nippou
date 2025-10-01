import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading, authInitialized, isDevelopmentMode } = useAuth();
  const location = useLocation();
  const [showTimeoutWarning, setShowTimeoutWarning] = React.useState(false);
  const [allowBypass, setAllowBypass] = React.useState(false);

  console.log('=== ProtectedRoute 状態チェック ===', {
    hasUser: !!user,
    authInitialized,
    isDevelopmentMode,
    userEmail: user?.email,
    currentPath: window.location.pathname
  });

  // 開発モードでは10秒後に認証なしでも画面表示を許可
  React.useEffect(() => {
    if (isDevelopmentMode && !authInitialized) {
      const bypassTimeout = setTimeout(() => {
        console.log('=== ProtectedRoute: 開発モードでタイムアウト、認証をバイパス ===');
        setAllowBypass(true);
      }, 10000);

      return () => clearTimeout(bypassTimeout);
    }
  }, [isDevelopmentMode, authInitialized]);

  // 5秒後にタイムアウト警告を表示
  React.useEffect(() => {
    if (!authInitialized) {
      const timeoutId = setTimeout(() => {
        setShowTimeoutWarning(true);
      }, 5000);

      return () => clearTimeout(timeoutId);
    }
  }, [authInitialized]);

  // 開発モードでバイパスが許可された場合
  if (isDevelopmentMode && allowBypass) {
    console.log('=== ProtectedRoute: 開発モードでバイパス許可、コンテンツを表示 ===');
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

          {isDevelopmentMode && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-700 text-center">
                開発モード: 10秒後に自動的に画面が表示されます
              </p>
            </div>
          )}

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