import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  authInitialized: boolean;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<{ success: boolean }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);

  useEffect(() => {
    console.log('=== AuthProvider 初期化開始 ===', {
      currentPath: window.location.pathname
    });

    let sessionTimeout: ReturnType<typeof setTimeout> | null = null;
    let isSessionRetrieved = false;

    const getSession = async () => {
      try {
        console.log('セッション取得開始...');

        sessionTimeout = setTimeout(() => {
          if (!isSessionRetrieved) {
            console.warn('=== セッション取得タイムアウト (5秒) - 認証なしで継続 ===');
            setUser(null);
            setLoading(false);
            setAuthInitialized(true);
            isSessionRetrieved = true;
          }
        }, 5000);

        const { data: { session }, error } = await supabase.auth.getSession();

        if (sessionTimeout) {
          clearTimeout(sessionTimeout);
        }
        isSessionRetrieved = true;

        if (error) {
          console.error('=== セッション取得エラー ===', error);
          setUser(null);
          setLoading(false);
          setAuthInitialized(true);
          return;
        }

        console.log('初期セッション取得結果:', {
          hasSession: !!session,
          hasUser: !!session?.user,
          userEmail: session?.user?.email,
          currentPath: window.location.pathname
        });

        setUser(session?.user ?? null);
        setLoading(false);
        setAuthInitialized(true);

        if (session?.user && window.location.hash === '#/login') {
          console.log('=== 認証済みユーザーを検出、日報作成画面にリダイレクト ===');
          navigate('/daily-report-create');
        }
      } catch (error) {
        console.error('=== セッション取得例外 ===', error);
        if (sessionTimeout) {
          clearTimeout(sessionTimeout);
        }
        isSessionRetrieved = true;
        setUser(null);
        setLoading(false);
        setAuthInitialized(true);
      }
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('=== 認証状態変更 ===', {
          event,
          hasSession: !!session,
          hasUser: !!session?.user,
          userEmail: session?.user?.email,
          currentPath: window.location.pathname
        });

        setUser(session?.user ?? null);
        setLoading(false);

        if (event === 'SIGNED_IN' && session?.user) {
          console.log('=== 認証成功 ===');
          if (window.location.hash === '#/login') {
            console.log('=== ログイン画面から日報作成画面にリダイレクト ===');
            navigate('/daily-report-create');
          } else {
            console.log('=== 他のページにいるため、リダイレクトしない ===', {
              currentPath: window.location.hash
            });
          }
        }

        if (event === 'SIGNED_OUT') {
          console.log('=== ログアウト、ログイン画面にリダイレクト ===');
          navigate('/login');
        }
      }
    );

    return () => {
      if (sessionTimeout) {
        clearTimeout(sessionTimeout);
      }
      subscription.unsubscribe();
    };
  }, [navigate]);

  const signInWithGoogle = useCallback(async () => {
    console.log('=== Google認証開始 ===');

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          scopes: 'openid email profile https://www.googleapis.com/auth/calendar.readonly',
          redirectTo: `${window.location.origin}/daily-report-create`
        }
      });

      if (error) {
        console.error('=== Google認証エラー ===', error);
        return { success: false, error: error.message };
      }

      console.log('=== Google認証リダイレクト開始 ===');
      return { success: true };
    } catch (error) {
      console.error('=== Google認証処理中のエラー ===', error);
      return { success: false, error: 'Google認証処理中にエラーが発生しました' };
    }
  }, []);

  const signOut = useCallback(async () => {
    console.log('=== ログアウト開始 ===');

    try {
      setUser(null);
      setLoading(true);

      try {
        const { error } = await supabase.auth.signOut();
        if (error) {
          console.warn('=== Supabaseログアウトエラー（継続処理） ===', error);
        } else {
          console.log('=== Supabaseログアウト成功 ===');
        }
      } catch (supabaseError) {
        console.warn('=== Supabaseログアウト例外（継続処理） ===', supabaseError);
      }

      try {
        localStorage.clear();
        sessionStorage.clear();
        console.log('=== ローカルストレージクリア完了 ===');
      } catch (storageError) {
        console.warn('=== ストレージクリアエラー ===', storageError);
      }

      console.log('=== 強制ログアウト完了 ===');

      setTimeout(() => {
        setLoading(false);
        window.location.href = '/login';
      }, 200);

      return { success: true };
    } catch (error) {
      console.error('=== ログアウト処理中のエラー ===', error);

      setUser(null);

      try {
        localStorage.clear();
        sessionStorage.clear();
      } catch (storageError) {
        console.warn('=== エラー時ストレージクリア失敗 ===', storageError);
      }

      setTimeout(() => {
        setLoading(false);
        window.location.href = '/login';
      }, 200);

      return { success: true };
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, authInitialized, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
