import { useState, useEffect, useCallback } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);

  useEffect(() => {
    console.log('=== useAuth初期化開始 ===', { 
      currentPath: window.location.pathname 
    });
    
    // 現在の認証状態を取得
    const getSession = async () => {
      try {
        console.log('セッション取得開始...');
        const { data: { session } } = await supabase.auth.getSession();
        console.log('初期セッション取得結果:', {
          hasSession: !!session,
          hasUser: !!session?.user,
          userEmail: session?.user?.email,
          currentPath: window.location.pathname
        });
        
        setUser(session?.user ?? null);
        setLoading(false);
        setAuthInitialized(true);
        
        // 認証済みユーザーがログイン画面にいる場合、日報作成画面にリダイレクト
        if (session?.user && window.location.hash === '#/login') {
          console.log('=== 認証済みユーザーを検出、日報作成画面にリダイレクト ===');
          navigate('/daily-report-create');
        }
      } catch (error) {
        console.error('=== セッション取得エラー ===', error);
        setLoading(false);
        setAuthInitialized(true);
      }
    };

    getSession();

    // 認証状態の変更を監視
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
        
        // 認証成功時の処理
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('=== 認証成功 ===');
          // ログイン画面にいる場合のみ日報作成画面にリダイレクト
          if (window.location.hash === '#/login') {
            console.log('=== ログイン画面から日報作成画面にリダイレクト ===');
            navigate('/daily-report-create');
          } else {
            console.log('=== 他のページにいるため、リダイレクトしない ===', {
              currentPath: window.location.hash
            });
          }
        }
        
        // ログアウト時の処理
        if (event === 'SIGNED_OUT') {
          console.log('=== ログアウト、ログイン画面にリダイレクト ===');
          navigate('/login');
        }
      }
    );

    return () => subscription.unsubscribe();
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
      // クライアント側の状態を即座にリセット
      setUser(null);
      setLoading(true);
      
      try {
        // Supabaseのログアウトを試行
        const { error } = await supabase.auth.signOut();
        if (error) {
          console.warn('=== Supabaseログアウトエラー（継続処理） ===', error);
          // エラーが発生してもログアウト処理を継続
        } else {
          console.log('=== Supabaseログアウト成功 ===');
        }
      } catch (supabaseError) {
        console.warn('=== Supabaseログアウト例外（継続処理） ===', supabaseError);
        // 例外が発生してもログアウト処理を継続
      }
      
      // ローカルストレージとセッションストレージをクリア
      try {
        localStorage.clear();
        sessionStorage.clear();
        console.log('=== ローカルストレージクリア完了 ===');
      } catch (storageError) {
        console.warn('=== ストレージクリアエラー ===', storageError);
      }
      
      console.log('=== 強制ログアウト完了 ===');
      
      // 確実にログイン画面にリダイレクト
      setTimeout(() => {
        setLoading(false);
        // 強制的にページ全体をリロードしてログイン画面に移動
        window.location.href = '/login';
      }, 200);
      
      return { success: true };
    } catch (error) {
      console.error('=== ログアウト処理中のエラー ===', error);
      
      // エラーが発生した場合でも強制的にログアウト
      setUser(null);
      
      // ローカルストレージをクリア
      try {
        localStorage.clear();
        sessionStorage.clear();
      } catch (storageError) {
        console.warn('=== エラー時ストレージクリア失敗 ===', storageError);
      }
      
      setTimeout(() => {
        setLoading(false);
        // エラーが発生した場合でも強制的にログイン画面に移動
        window.location.href = '/login';
      }, 200);
      
      return { success: true }; // ユーザー体験を優先して成功として扱う
    }
  }, []);

  return {
    user,
    loading,
    authInitialized,
    signInWithGoogle,
    signOut
  };
};