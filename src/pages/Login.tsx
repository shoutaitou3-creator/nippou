import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { BookOpen, Megaphone, Code, Globe, FileText } from 'lucide-react';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { user, signInWithGoogle, authInitialized } = useAuth();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // 認証初期化完了後、認証済みユーザーは自動的にダッシュボードにリダイレクト
  React.useEffect(() => {
    console.log('=== Login useEffect ===', { 
      hasUser: !!user, 
      authInitialized,
      userEmail: user?.email,
      currentPath: window.location.pathname
    });
    
    if (authInitialized && user) {
      console.log('=== Login: 認証済みユーザーを検出、日報作成画面にリダイレクト ===');
      navigate('/daily-report-create');
    }
  }, [user, authInitialized, navigate]);

  const handleGoogleSignIn = async () => {
    console.log('=== Login: Googleログインボタンクリック ===');
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await signInWithGoogle();
      
      if (!result.success) {
        console.error('=== Login: ログイン失敗 ===', result.error);
        setError(result.error || 'ログインに失敗しました');
      } else {
        // リダイレクトが発生するため、ここでローディングを解除しない
        return;
      }
    } catch (error) {
      console.error('=== Login: ログイン処理中の予期しないエラー ===', error);
      setError('ログイン処理中にエラーが発生しました');
    }
    
    setIsLoading(false);
  };

  // 認証初期化中の表示
  if (!authInitialized) {
    console.log('=== Login: 認証初期化中の表示 ===');
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary/10">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">認証状態を確認中...</p>
          <p className="text-xs text-gray-500 mt-2">しばらくお待ちください</p>
        </div>
      </div>
    );
  }

  console.log('=== Login: ログイン画面を表示 ===');

  return (
    <>
    <div className="min-h-screen bg-primary/10 py-8">
      <div className="flex flex-col items-center justify-center min-h-full">
        {/* 会社ロゴ */}
        <div className="w-80 max-w-md mb-8 mt-2.5">
          <img 
            src="/resusty_logo.png" 
            alt="株式会社リサスティー" 
            className="w-full h-auto"
          />
        </div>
        
        {/* ログインブロック */}
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <p className="text-secondary text-center mb-6">
          株式会社リサスティー 日報システム
        </p>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm text-center">{error}</p>
          </div>
        )}
        <button
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full bg-primary text-white hover:bg-primary/90 py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex items-center justify-center gap-2">
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            {isLoading ? 'ログイン中...' : 'Googleでログイン'}
          </div>
        </button>
        
        <div className="mt-6 p-4 bg-accent/10 rounded-lg border border-accent/20">
          <p className="text-accent text-sm text-center">
            <strong>Googleアカウント</strong>でログインし、<strong>カレンダー権限</strong>を取得します<br />
          </p>
        </div>
      </div>
      
      {/* 使用マニュアルリンク - ログインブロック直下 */}
      <div className="mt-6 p-6 max-w-md w-full">
        <div className="text-center">
          <Link
            to="/update-info"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium mb-4"
          >
            <Megaphone className="w-4 h-4" />
            更新情報を見る
          </Link>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            初めてご利用の方へ
          </h3>
          <p className="text-gray-600 mb-4 text-sm">
            システムの使い方がわからない場合は、<br />
            簡易マニュアルをご確認ください。
          </p>
          <Link
            to="/user-manual"
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors font-medium mb-3"
          >
            <BookOpen className="w-4 h-4" />
            簡易マニュアルを見る
          </Link>
          <Link
            to="/requirements"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
          >
            <FileText className="w-4 h-4" />
            要件定義書を見る
          </Link>
        </div>
        
        {/* 開発用リンク */}
        <div className="text-center" style={{ marginTop: '300px' }}>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Code className="w-4 h-4" />
              開発用リンク（認証スキップ）
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <Link
                to="/dashboard?dev=true"
                className="flex items-center gap-1 px-2 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
              >
                <Code className="w-3 h-3" />
                ダッシュボード
              </Link>
              <Link
                to="/daily-report-create?dev=true"
                className="flex items-center gap-1 px-2 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
              >
                <Code className="w-3 h-3" />
                日報作成
              </Link>
              <Link
                to="/next-day-settings?dev=true"
                className="flex items-center gap-1 px-2 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
              >
                <Code className="w-3 h-3" />
                翌日設定
              </Link>
              <Link
                to="/work-hours?dev=true"
                className="flex items-center gap-1 px-2 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
              >
                <Code className="w-3 h-3" />
                日報確認
              </Link>
              <Link
                to="/previous-day-report?dev=true"
                className="flex items-center gap-1 px-2 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
              >
                <Code className="w-3 h-3" />
                前日作成
              </Link>
              <Link
                to="/reports?dev=true"
                className="flex items-center gap-1 px-2 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
              >
                <Code className="w-3 h-3" />
                日報一覧
              </Link>
              <Link
                to="/settings?dev=true"
                className="flex items-center gap-1 px-2 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
              >
                <Code className="w-3 h-3" />
                設定
              </Link>
              <Link
                to="/requirements"
                className="flex items-center gap-1 px-2 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors col-span-2"
              >
                <FileText className="w-3 h-3" />
                要件定義書
              </Link>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              認証をスキップして各ページに直接アクセス
            </p>
          </div>
          
          {/* LPサイトリンク */}
          <div className="text-center mt-4">
            <a
              href="https://nippou.nanoapp.site/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors text-sm font-medium"
            >
              <Globe className="w-4 h-4" />
              LPサイトを見る
            </a>
            <p className="text-xs text-gray-500 mt-1">
              アプリの詳細情報とサービス紹介
            </p>
          </div>
        </div>
      </div>
      </div>
    </div>
    </>
  );
};

export default Login;