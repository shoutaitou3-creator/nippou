import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, Database, Shield, Calendar, Zap, Layout, Users, Clock, CheckCircle, Settings } from 'lucide-react';

const Requirements: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            ダッシュボードに戻る
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-gray-800">
              リサスティー日報システム 要件定義書
            </h1>
          </div>
          <p className="text-gray-600">
            システムの技術仕様、機能要件、データベース構造などの詳細な要件定義
          </p>
        </div>

        <div className="space-y-8">
          {/* 1. アプリケーション概要 */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold">1</span>
              アプリケーション概要
            </h2>
            <div className="ml-10 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">システム名</h3>
                <p className="text-gray-700">リサスティー日報システム (Resusty Daily Report System)</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">目的</h3>
                <p className="text-gray-700 leading-relaxed">
                  業務日報の作成・管理を効率化し、Googleカレンダーとの連携により予定を自動取得して、日々の業務内容を正確に記録・管理することを目的としたWebアプリケーション。勤務時間の自動計算、業務分類の自動化、翌勤務日の予定管理など、日報業務に関わる一連のワークフローを統合的にサポートする。
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">主な特徴</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Googleカレンダー連携：</strong>OAuth 2.0認証により、ユーザーのGoogleカレンダーから予定を自動取得</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span><strong>業務分類の自動化：</strong>予定のタイトルからキーワードを検出し、業務カテゴリを自動分類</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span><strong>勤務時間の自動計算：</strong>カレンダーイベントから実労働時間を業務分類ごとに集計</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span><strong>日本時間対応：</strong>すべての日付・時刻処理を日本標準時（JST）で統一管理</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span><strong>レスポンシブデザイン：</strong>PC、タブレット、スマートフォンでの利用に最適化</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span><strong>PDF出力機能：</strong>日報内容をPDF形式で出力可能</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span><strong>テキストコピー機能：</strong>勤務開始時・終了時の情報をワンクリックでコピー</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">対象ユーザー</h3>
                <p className="text-gray-700 leading-relaxed">
                  リサスティー社の全従業員。特に営業職、コンサルタント職など、外出や訪問が多く、複数の予定を管理する必要がある職種を主な対象とする。
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">技術スタック</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li><strong>フロントエンド：</strong>React 18.2.0, TypeScript 5.0.2, React Router 6.15.0</li>
                    <li><strong>スタイリング：</strong>Tailwind CSS 3.3.3</li>
                    <li><strong>バックエンド：</strong>Supabase（PostgreSQL, Authentication, Row Level Security）</li>
                    <li><strong>外部API：</strong>Google Calendar API v3（OAuth 2.0）</li>
                    <li><strong>PDF生成：</strong>jsPDF 3.0.2, jspdf-autotable 5.0.2</li>
                    <li><strong>アイコン：</strong>Lucide React 0.263.1</li>
                    <li><strong>ビルドツール：</strong>Vite 5.4.2</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* 2. 画面一覧と機能概要 */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold">2</span>
              画面一覧と機能概要
            </h2>
            <div className="ml-10 space-y-6">

              {/* ログイン画面 */}
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-500" />
                  ログイン画面 (/login)
                </h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <p><strong>目的：</strong>Google OAuth 2.0を使用した認証</p>
                  <p><strong>主要機能：</strong></p>
                  <ul className="ml-4 space-y-1">
                    <li>• Googleアカウントでのログイン</li>
                    <li>• Googleカレンダーへのアクセス権限リクエスト</li>
                    <li>• 初回利用者向けの案内表示</li>
                    <li>• ユーザーマニュアルへのリンク</li>
                    <li>• 更新情報へのリンク</li>
                  </ul>
                  <p><strong>ルート：</strong>認証不要（公開）</p>
                </div>
              </div>

              {/* ダッシュボード */}
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <Layout className="w-5 h-5 text-green-500" />
                  ダッシュボード (/dashboard)
                </h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <p><strong>目的：</strong>今日と明日のスケジュール概要表示</p>
                  <p><strong>主要機能：</strong></p>
                  <ul className="ml-4 space-y-1">
                    <li>• 今日のスケジュールカード表示</li>
                    <li>• 明日のスケジュールカード表示</li>
                    <li>• Googleカレンダーからの予定自動取得</li>
                    <li>• システム状態表示（カレンダー権限、最終取得時刻）</li>
                    <li>• 主要機能へのナビゲーションメニュー</li>
                  </ul>
                  <p><strong>ルート：</strong>認証必須（ProtectedRoute）</p>
                </div>
              </div>

              {/* 日報作成画面 */}
              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-500" />
                  日報作成画面 (/daily-report-create)
                </h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <p><strong>目的：</strong>当日の日報作成・編集・提出</p>
                  <p><strong>主要機能：</strong></p>
                  <ul className="ml-4 space-y-1">
                    <li>• 勤務開始時刻・終了時刻の設定</li>
                    <li>• 当日のカレンダーイベント表示・編集・追加</li>
                    <li>• 報告事項の入力（60文字以上必須）</li>
                    <li>• 定型文の挿入機能</li>
                    <li>• 一時保存機能（draft_status = true）</li>
                    <li>• 日報提出機能（draft_status = false、編集不可）</li>
                    <li>• Googleカレンダーの再取得機能</li>
                    <li>• スクリーンショット用モーダル表示</li>
                    <li>• 勤務開始時のテキストコピー機能</li>
                    <li>• URLパラメータによる日付指定（?date=YYYY-MM-DD）</li>
                  </ul>
                  <p><strong>データソース：</strong>daily_reports, user_settings, next_day_settings</p>
                  <p><strong>ルート：</strong>認証必須（ProtectedRoute）</p>
                </div>
              </div>

              {/* 日報確認画面 */}
              <div className="border-l-4 border-orange-500 pl-4">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-orange-500" />
                  日報確認画面 (/work-hours)
                </h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <p><strong>目的：</strong>提出済み日報の確認と勤務時間分析</p>
                  <p><strong>主要機能：</strong></p>
                  <ul className="ml-4 space-y-1">
                    <li>• 業務分類別の勤務時間表示</li>
                    <li>• 当日のスケジュール詳細表示</li>
                    <li>• 日報の報告事項表示</li>
                    <li>• 翌勤務日の予定表示</li>
                    <li>• スクリーンショット用モーダル表示</li>
                    <li>• 勤務終了時のテキストコピー機能</li>
                  </ul>
                  <p><strong>データソース：</strong>daily_reports, next_day_settings</p>
                  <p><strong>ルート：</strong>認証必須（ProtectedRoute）</p>
                </div>
              </div>

              {/* 翌勤務日設定画面 */}
              <div className="border-l-4 border-pink-500 pl-4">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-pink-500" />
                  翌勤務日設定画面 (/next-day-settings)
                </h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <p><strong>目的：</strong>翌勤務日の予定と勤務時間の事前設定</p>
                  <p><strong>主要機能：</strong></p>
                  <ul className="ml-4 space-y-1">
                    <li>• 翌勤務日の日付選択</li>
                    <li>• 勤務開始時刻・終了時刻の設定</li>
                    <li>• 連絡事項の入力</li>
                    <li>• 定型文の自動入力（時間調整、有給使用など）</li>
                    <li>• 翌日のカレンダーイベント取得・表示</li>
                    <li>• 既存設定の読み込み・更新</li>
                    <li>• 標準勤務時間の自動設定</li>
                  </ul>
                  <p><strong>データソース：</strong>next_day_settings, user_settings</p>
                  <p><strong>ルート：</strong>認証必須（ProtectedRoute）</p>
                </div>
              </div>

              {/* 前日作成画面 */}
              <div className="border-l-4 border-red-500 pl-4">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-red-500" />
                  前日作成画面 (/previous-day-report)
                </h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <p><strong>目的：</strong>前日（昨日）の日報を後から作成</p>
                  <p><strong>主要機能：</strong></p>
                  <ul className="ml-4 space-y-1">
                    <li>• 前日の日付自動計算（日本時間）</li>
                    <li>• 提出遅延日数の表示</li>
                    <li>• カレンダーイベント取得の確認プロンプト</li>
                    <li>• 日報作成画面と同様の編集機能</li>
                    <li>• 提出状況カードの表示</li>
                    <li>• 操作ガイドの表示</li>
                  </ul>
                  <p><strong>データソース：</strong>daily_reports</p>
                  <p><strong>ルート：</strong>認証必須（ProtectedRoute）</p>
                </div>
              </div>

              {/* 日報一覧画面 */}
              <div className="border-l-4 border-indigo-500 pl-4">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-500" />
                  日報一覧画面 (/reports)
                </h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <p><strong>目的：</strong>過去の日報を月別に一覧表示</p>
                  <p><strong>主要機能：</strong></p>
                  <ul className="ml-4 space-y-1">
                    <li>• 月別の日報一覧表示</li>
                    <li>• 提出ステータスのバッジ表示（提出済み/下書き）</li>
                    <li>• ページネーション（10件/ページ）</li>
                    <li>• 日報詳細のモーダル表示</li>
                    <li>• スクリーンショット用モーダル表示</li>
                    <li>• レスポンシブ対応（テーブル/カード表示切り替え）</li>
                  </ul>
                  <p><strong>データソース：</strong>daily_reports, next_day_settings</p>
                  <p><strong>ルート：</strong>認証必須（ProtectedRoute）</p>
                </div>
              </div>

              {/* 個人設定画面 */}
              <div className="border-l-4 border-teal-500 pl-4">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-teal-500" />
                  個人設定画面 (/settings)
                </h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <p><strong>目的：</strong>ユーザーの個人情報と勤務設定の管理</p>
                  <p><strong>主要機能：</strong></p>
                  <ul className="ml-4 space-y-1">
                    <li>• 標準勤務時間の設定（開始時刻・終了時刻）</li>
                    <li>• 勤務時間の妥当性チェック（9時間基準）</li>
                    <li>• 社員情報の入力（氏名、部署、役職、連絡先など）</li>
                    <li>• 個人情報の入力（生年月日、住所、緊急連絡先など）</li>
                    <li>• 住所情報のコピー機能</li>
                    <li>• 自動保存機能</li>
                  </ul>
                  <p><strong>データソース：</strong>user_settings</p>
                  <p><strong>ルート：</strong>認証必須（ProtectedRoute）</p>
                </div>
              </div>

              {/* ユーザーマニュアル */}
              <div className="border-l-4 border-gray-500 pl-4">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-gray-500" />
                  ユーザーマニュアル (/user-manual)
                </h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <p><strong>目的：</strong>システムの使い方を平易な言葉で説明</p>
                  <p><strong>主要機能：</strong></p>
                  <ul className="ml-4 space-y-1">
                    <li>• アプリの概要と主な機能</li>
                    <li>• 初回起動時の設定手順</li>
                    <li>• 基本的な操作方法</li>
                    <li>• 業務分類について</li>
                    <li>• 操作のコツ</li>
                  </ul>
                  <p><strong>ルート：</strong>認証不要（公開）</p>
                </div>
              </div>

              {/* 更新情報 */}
              <div className="border-l-4 border-yellow-500 pl-4">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-yellow-500" />
                  更新情報 (/update-info)
                </h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <p><strong>目的：</strong>システムの機能追加・改善内容の告知</p>
                  <p><strong>主要機能：</strong></p>
                  <ul className="ml-4 space-y-1">
                    <li>• 日付順の更新履歴表示</li>
                    <li>• 各変更点のメリット説明</li>
                    <li>• ITリテラシーの低いユーザーにも分かりやすい表現</li>
                  </ul>
                  <p><strong>ルート：</strong>認証不要（公開）</p>
                </div>
              </div>
            </div>
          </div>

          {/* 3. データフロー */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold">3</span>
              データフロー
            </h2>
            <div className="ml-10 space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-3">標準的な日報作成フロー</h3>
                <ol className="space-y-2 text-sm text-blue-700">
                  <li><strong>1. ログイン：</strong>Google OAuth 2.0で認証 → Googleカレンダーへのアクセス許可</li>
                  <li><strong>2. 日報作成画面へ自動遷移：</strong>当日の日付で日報作成画面を表示</li>
                  <li><strong>3. 既存日報の確認：</strong>daily_reportsテーブルから当日の日報を検索</li>
                  <li><strong>4. 標準勤務時間の読み込み：</strong>
                    <ul className="ml-4 mt-1 space-y-1">
                      <li>• next_day_settingsテーブルから当日の設定を取得</li>
                      <li>• なければuser_settingsテーブルから標準勤務時間を取得</li>
                      <li>• どちらもなければデフォルト値（09:00-18:00）を使用</li>
                    </ul>
                  </li>
                  <li><strong>5. カレンダーイベントの取得：</strong>
                    <ul className="ml-4 mt-1 space-y-1">
                      <li>• 既存日報がある場合：保存されたcalendar_eventsを使用</li>
                      <li>• 新規作成の場合：Google Calendar APIから当日の予定を取得</li>
                      <li>• 参加を辞退した予定は除外</li>
                    </ul>
                  </li>
                  <li><strong>6. 日報の編集：</strong>勤務時間、予定、報告事項を入力・編集</li>
                  <li><strong>7. 一時保存 or 提出：</strong>
                    <ul className="ml-4 mt-1 space-y-1">
                      <li>• 一時保存：draft_status = true で保存（後で編集可能）</li>
                      <li>• 提出：draft_status = false で保存（編集不可、submitted_atに提出日時を記録）</li>
                    </ul>
                  </li>
                  <li><strong>8. 翌勤務日設定画面へ遷移：</strong>日報提出後、自動的に翌勤務日設定画面へ</li>
                  <li><strong>9. 翌勤務日の設定：</strong>
                    <ul className="ml-4 mt-1 space-y-1">
                      <li>• 既存の設定があればそれを読み込み</li>
                      <li>• なければ明日の日付を初期設定</li>
                      <li>• 勤務時間、連絡事項、カレンダーイベントを設定</li>
                      <li>• next_day_settingsテーブルにupsert</li>
                    </ul>
                  </li>
                  <li><strong>10. 日報確認画面へ遷移：</strong>設定保存後、自動的に日報確認画面へ</li>
                  <li><strong>11. 勤務終了時の処理：</strong>
                    <ul className="ml-4 mt-1 space-y-1">
                      <li>• 業務分類別の勤務時間を自動計算・表示</li>
                      <li>• スクリーンショット機能でPDF出力</li>
                      <li>• テキストコピー機能で情報共有</li>
                    </ul>
                  </li>
                </ol>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h3 className="font-semibold text-orange-800 mb-3">前日作成フロー</h3>
                <ol className="space-y-2 text-sm text-orange-700">
                  <li><strong>1. 前日作成画面へアクセス：</strong>前日（昨日）の日付を自動計算</li>
                  <li><strong>2. 既存日報の確認：</strong>daily_reportsテーブルから前日の日報を検索</li>
                  <li><strong>3. カレンダー取得の確認：</strong>
                    <ul className="ml-4 mt-1 space-y-1">
                      <li>• 既存日報がない場合：カレンダー取得の確認プロンプトを表示</li>
                      <li>• ユーザーが「はい」を選択：Google Calendar APIから前日の予定を取得</li>
                      <li>• ユーザーが「いいえ」を選択：カレンダーなしで作成</li>
                    </ul>
                  </li>
                  <li><strong>4. 日報の作成・編集：</strong>通常の日報作成画面と同様の操作</li>
                  <li><strong>5. 遅延日数の表示：</strong>提出が遅れている日数を警告表示</li>
                  <li><strong>6. 提出：</strong>draft_status = false で保存</li>
                </ol>
              </div>
            </div>
          </div>

          {/* 4. データベース構造 */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold">4</span>
              データベース構造
            </h2>
            <div className="ml-10 space-y-6">

              {/* daily_reports テーブル */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Database className="w-5 h-5 text-primary" />
                  daily_reports テーブル
                </h3>
                <p className="text-sm text-gray-600 mb-3">日報データを保存するメインテーブル</p>
                <div className="bg-gray-50 rounded-lg p-4 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-300">
                        <th className="text-left py-2 pr-4">カラム名</th>
                        <th className="text-left py-2 pr-4">型</th>
                        <th className="text-left py-2">説明</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-700">
                      <tr className="border-b border-gray-200">
                        <td className="py-2 pr-4 font-mono">id</td>
                        <td className="py-2 pr-4">uuid</td>
                        <td className="py-2">主キー（自動生成）</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="py-2 pr-4 font-mono">user_id</td>
                        <td className="py-2 pr-4">uuid</td>
                        <td className="py-2">ユーザーID（auth.users参照）</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="py-2 pr-4 font-mono">report_date</td>
                        <td className="py-2 pr-4">date</td>
                        <td className="py-2">日報の対象日（YYYY-MM-DD形式）</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="py-2 pr-4 font-mono">work_start_time</td>
                        <td className="py-2 pr-4">time</td>
                        <td className="py-2">勤務開始時刻（HH:MM形式）</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="py-2 pr-4 font-mono">work_end_time</td>
                        <td className="py-2 pr-4">time</td>
                        <td className="py-2">勤務終了時刻（HH:MM形式）</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="py-2 pr-4 font-mono">work_content</td>
                        <td className="py-2 pr-4">text</td>
                        <td className="py-2">報告事項（60文字以上必須）</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="py-2 pr-4 font-mono">calendar_events</td>
                        <td className="py-2 pr-4">jsonb</td>
                        <td className="py-2">カレンダーイベントの配列</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="py-2 pr-4 font-mono">draft_status</td>
                        <td className="py-2 pr-4">boolean</td>
                        <td className="py-2">下書き状態（true=下書き, false=提出済み）</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="py-2 pr-4 font-mono">submitted_at</td>
                        <td className="py-2 pr-4">timestamptz</td>
                        <td className="py-2">提出日時（提出時に自動設定）</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="py-2 pr-4 font-mono">created_at</td>
                        <td className="py-2 pr-4">timestamptz</td>
                        <td className="py-2">作成日時（自動設定）</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4 font-mono">updated_at</td>
                        <td className="py-2 pr-4">timestamptz</td>
                        <td className="py-2">更新日時（自動更新）</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="mt-3 space-y-2">
                  <p className="text-sm text-gray-700"><strong>制約：</strong></p>
                  <ul className="ml-4 text-sm text-gray-600 space-y-1">
                    <li>• UNIQUE制約: (user_id, report_date) - ユーザーごとに1日1レコード</li>
                    <li>• インデックス: (user_id, report_date) で高速検索</li>
                  </ul>
                  <p className="text-sm text-gray-700 mt-2"><strong>RLS（Row Level Security）：</strong></p>
                  <ul className="ml-4 text-sm text-gray-600 space-y-1">
                    <li>• SELECT: auth.uid() = user_id（自分のデータのみ閲覧可能）</li>
                    <li>• INSERT: auth.uid() = user_id（自分のデータのみ作成可能）</li>
                    <li>• UPDATE: auth.uid() = user_id（自分のデータのみ更新可能）</li>
                    <li>• DELETE: auth.uid() = user_id（自分のデータのみ削除可能）</li>
                  </ul>
                </div>
              </div>

              {/* next_day_settings テーブル */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Database className="w-5 h-5 text-primary" />
                  next_day_settings テーブル
                </h3>
                <p className="text-sm text-gray-600 mb-3">翌勤務日の設定を保存するテーブル</p>
                <div className="bg-gray-50 rounded-lg p-4 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-300">
                        <th className="text-left py-2 pr-4">カラム名</th>
                        <th className="text-left py-2 pr-4">型</th>
                        <th className="text-left py-2">説明</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-700">
                      <tr className="border-b border-gray-200">
                        <td className="py-2 pr-4 font-mono">id</td>
                        <td className="py-2 pr-4">uuid</td>
                        <td className="py-2">主キー（自動生成）</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="py-2 pr-4 font-mono">user_id</td>
                        <td className="py-2 pr-4">uuid</td>
                        <td className="py-2">ユーザーID（auth.users参照）</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="py-2 pr-4 font-mono">work_date</td>
                        <td className="py-2 pr-4">date</td>
                        <td className="py-2">勤務予定日（YYYY-MM-DD形式）</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="py-2 pr-4 font-mono">start_time</td>
                        <td className="py-2 pr-4">time</td>
                        <td className="py-2">勤務開始時刻（デフォルト: 09:00）</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="py-2 pr-4 font-mono">end_time</td>
                        <td className="py-2 pr-4">time</td>
                        <td className="py-2">勤務終了時刻（デフォルト: 18:00）</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="py-2 pr-4 font-mono">notes</td>
                        <td className="py-2 pr-4">text</td>
                        <td className="py-2">連絡事項・特記事項</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="py-2 pr-4 font-mono">calendar_events</td>
                        <td className="py-2 pr-4">jsonb</td>
                        <td className="py-2">カレンダーイベントの配列</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="py-2 pr-4 font-mono">created_at</td>
                        <td className="py-2 pr-4">timestamptz</td>
                        <td className="py-2">作成日時（自動設定）</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4 font-mono">updated_at</td>
                        <td className="py-2 pr-4">timestamptz</td>
                        <td className="py-2">更新日時（自動更新）</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="mt-3 space-y-2">
                  <p className="text-sm text-gray-700"><strong>制約：</strong></p>
                  <ul className="ml-4 text-sm text-gray-600 space-y-1">
                    <li>• UNIQUE制約: (user_id, work_date) - ユーザーごとに1日1レコード</li>
                    <li>• インデックス: (user_id, work_date) で高速検索</li>
                  </ul>
                  <p className="text-sm text-gray-700 mt-2"><strong>RLS（Row Level Security）：</strong></p>
                  <ul className="ml-4 text-sm text-gray-600 space-y-1">
                    <li>• SELECT: auth.uid() = user_id（自分のデータのみ閲覧可能）</li>
                    <li>• INSERT: auth.uid() = user_id（自分のデータのみ作成可能）</li>
                    <li>• UPDATE: auth.uid() = user_id（自分のデータのみ更新可能）</li>
                    <li>• DELETE: auth.uid() = user_id（自分のデータのみ削除可能）</li>
                  </ul>
                </div>
              </div>

              {/* user_settings テーブル */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Database className="w-5 h-5 text-primary" />
                  user_settings テーブル
                </h3>
                <p className="text-sm text-gray-600 mb-3">ユーザーの個人設定を保存するテーブル</p>
                <div className="bg-gray-50 rounded-lg p-4 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-300">
                        <th className="text-left py-2 pr-4">カラム名</th>
                        <th className="text-left py-2 pr-4">型</th>
                        <th className="text-left py-2">説明</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-700">
                      <tr className="border-b border-gray-200">
                        <td className="py-2 pr-4 font-mono">user_id</td>
                        <td className="py-2 pr-4">uuid</td>
                        <td className="py-2">主キー、ユーザーID（auth.users参照）</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="py-2 pr-4 font-mono">default_start_time</td>
                        <td className="py-2 pr-4">time</td>
                        <td className="py-2">標準勤務開始時刻</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="py-2 pr-4 font-mono">default_end_time</td>
                        <td className="py-2 pr-4">time</td>
                        <td className="py-2">標準勤務終了時刻</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="py-2 pr-4 font-mono">profile_name</td>
                        <td className="py-2 pr-4">text</td>
                        <td className="py-2">氏名</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="py-2 pr-4 font-mono">profile_email</td>
                        <td className="py-2 pr-4">text</td>
                        <td className="py-2">メールアドレス</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="py-2 pr-4 font-mono">profile_phone</td>
                        <td className="py-2 pr-4">text</td>
                        <td className="py-2">電話番号</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="py-2 pr-4 font-mono">profile_line_works_id</td>
                        <td className="py-2 pr-4">text</td>
                        <td className="py-2">LINE WORKS ID</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="py-2 pr-4 font-mono">profile_department</td>
                        <td className="py-2 pr-4">text</td>
                        <td className="py-2">所属部署</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="py-2 pr-4 font-mono">profile_position</td>
                        <td className="py-2 pr-4">text</td>
                        <td className="py-2">役職</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="py-2 pr-4 font-mono">profile_residence</td>
                        <td className="py-2 pr-4">text</td>
                        <td className="py-2">居住地</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="py-2 pr-4 font-mono">profile_bio</td>
                        <td className="py-2 pr-4">text</td>
                        <td className="py-2">自己紹介</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="py-2 pr-4 font-mono">created_at</td>
                        <td className="py-2 pr-4">timestamptz</td>
                        <td className="py-2">作成日時（自動設定）</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4 font-mono">updated_at</td>
                        <td className="py-2 pr-4">timestamptz</td>
                        <td className="py-2">更新日時（自動更新）</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="mt-3 space-y-2">
                  <p className="text-sm text-gray-700"><strong>RLS（Row Level Security）：</strong></p>
                  <ul className="ml-4 text-sm text-gray-600 space-y-1">
                    <li>• SELECT: auth.uid() = user_id（自分のデータのみ閲覧可能）</li>
                    <li>• INSERT: auth.uid() = user_id（自分のデータのみ作成可能）</li>
                    <li>• UPDATE: auth.uid() = user_id（自分のデータのみ更新可能）</li>
                    <li>• DELETE: auth.uid() = user_id（自分のデータのみ削除可能）</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* 5. Google Calendar連携 */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold">5</span>
              Google Calendar連携
            </h2>
            <div className="ml-10 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">認証フロー</h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <ol className="space-y-2 text-sm text-blue-700">
                    <li><strong>1. OAuth 2.0認証：</strong>Supabase Authを使用したGoogle認証</li>
                    <li><strong>2. スコープ：</strong>
                      <ul className="ml-4 mt-1 space-y-1">
                        <li>• https://www.googleapis.com/auth/calendar.readonly（カレンダー読み取り）</li>
                        <li>• https://www.googleapis.com/auth/userinfo.profile（プロフィール情報）</li>
                        <li>• https://www.googleapis.com/auth/userinfo.email（メールアドレス）</li>
                      </ul>
                    </li>
                    <li><strong>3. アクセストークン：</strong>Supabaseセッションに保存</li>
                    <li><strong>4. リフレッシュトークン：</strong>トークンの自動更新をSupabaseが管理</li>
                  </ol>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">カレンダーイベント取得</h3>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-green-700 mb-2"><strong>APIエンドポイント：</strong></p>
                  <code className="text-xs bg-white px-2 py-1 rounded border border-green-300">
                    GET https://www.googleapis.com/calendar/v3/calendars/primary/events
                  </code>
                  <p className="text-sm text-green-700 mt-3 mb-2"><strong>クエリパラメータ：</strong></p>
                  <ul className="text-xs text-green-600 space-y-1">
                    <li>• timeMin: 取得開始日時（ISO 8601形式）</li>
                    <li>• timeMax: 取得終了日時（ISO 8601形式）</li>
                    <li>• singleEvents: true（定期イベントを個別に展開）</li>
                    <li>• orderBy: startTime（開始時刻順にソート）</li>
                  </ul>
                  <p className="text-sm text-green-700 mt-3 mb-2"><strong>フィルタリング：</strong></p>
                  <ul className="text-xs text-green-600 space-y-1">
                    <li>• 参加ステータスが「辞退」（declined）の予定を除外</li>
                    <li>• 終日イベントの処理</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">イベントデータ構造</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <pre className="text-xs text-gray-700 overflow-x-auto"><code>{`{
  "id": "event_unique_id",
  "startTime": "09:00",
  "endTime": "10:00",
  "title": "会議",
  "description": "詳細情報",
  "location": "会議室A",
  "participants": "参加者名"
}`}</code></pre>
                </div>
              </div>
            </div>
          </div>

          {/* 6. 業務分類ロジック */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold">6</span>
              業務分類ロジック
            </h2>
            <div className="ml-10 space-y-4">
              <p className="text-gray-700 leading-relaxed">
                システムは予定のタイトルに含まれるキーワードを検出し、業務カテゴリを自動分類します。
                分類された業務ごとに勤務時間を集計し、日報確認画面で表示します。
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-3">業務分類とキーワード</h3>
                <div className="space-y-3 text-sm">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-white rounded p-3 border border-blue-200">
                      <h4 className="font-medium text-blue-700 mb-1">🤝 会議・打ち合わせ</h4>
                      <p className="text-xs text-blue-600">会議、ミーティング、打ち合わせ、打合せ、MTG</p>
                    </div>
                    <div className="bg-white rounded p-3 border border-blue-200">
                      <h4 className="font-medium text-blue-700 mb-1">💼 商談・営業</h4>
                      <p className="text-xs text-blue-600">商談、事業説明、営業、提案</p>
                    </div>
                    <div className="bg-white rounded p-3 border border-blue-200">
                      <h4 className="font-medium text-blue-700 mb-1">📄 資料作成</h4>
                      <p className="text-xs text-blue-600">資料作成、資料確認、資料準備、ドキュメント作成、書類作成、報告書</p>
                    </div>
                    <div className="bg-white rounded p-3 border border-blue-200">
                      <h4 className="font-medium text-blue-700 mb-1">💻 オンライン講習</h4>
                      <p className="text-xs text-blue-600">オンライン研修、オンライン講習、オンライン体験会、Web研修、Web講習</p>
                    </div>
                    <div className="bg-white rounded p-3 border border-blue-200">
                      <h4 className="font-medium text-blue-700 mb-1">🏪 臨店講習</h4>
                      <p className="text-xs text-blue-600">臨店講習、臨店体験会、店舗研修、現地研修</p>
                    </div>
                    <div className="bg-white rounded p-3 border border-blue-200">
                      <h4 className="font-medium text-blue-700 mb-1">👥 採用・面接</h4>
                      <p className="text-xs text-blue-600">面接、採用、人事面談、採用面接</p>
                    </div>
                    <div className="bg-white rounded p-3 border border-blue-200">
                      <h4 className="font-medium text-blue-700 mb-1">🚗 移動</h4>
                      <p className="text-xs text-blue-600">移動、出張、訪問</p>
                    </div>
                    <div className="bg-white rounded p-3 border border-blue-200">
                      <h4 className="font-medium text-blue-700 mb-1">☕ 休憩</h4>
                      <p className="text-xs text-blue-600">休憩、昼休み、昼食、ランチ、食事</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-800 mb-2">分類アルゴリズム</h3>
                <ol className="space-y-2 text-sm text-yellow-700">
                  <li><strong>1.</strong> イベントのタイトルを取得</li>
                  <li><strong>2.</strong> 各業務分類のキーワードリストと照合</li>
                  <li><strong>3.</strong> 最初にマッチしたキーワードの業務分類を適用</li>
                  <li><strong>4.</strong> マッチするキーワードがない場合は「その他業務」に分類</li>
                  <li><strong>5.</strong> 休憩時間は実労働時間から除外</li>
                </ol>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-800 mb-2">勤務時間計算</h3>
                <ul className="space-y-2 text-sm text-green-700">
                  <li>• <strong>総勤務時間：</strong>勤務開始時刻から終了時刻までの時間</li>
                  <li>• <strong>実労働時間：</strong>総勤務時間 - 休憩時間</li>
                  <li>• <strong>業務分類別時間：</strong>各カテゴリに分類されたイベントの合計時間</li>
                  <li>• <strong>その他業務時間：</strong>実労働時間 - 分類済み業務時間の合計</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 7. セキュリティ要件 */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold">7</span>
              セキュリティ要件
            </h2>
            <div className="ml-10 space-y-4">

              <div className="border-l-4 border-red-500 pl-4">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-red-500" />
                  認証・認可
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• <strong>認証方式：</strong>Supabase Auth + Google OAuth 2.0</li>
                  <li>• <strong>セッション管理：</strong>Supabaseが自動管理（JWT）</li>
                  <li>• <strong>アクセス制御：</strong>Row Level Security（RLS）による行レベル制御</li>
                  <li>• <strong>権限スコープ：</strong>カレンダー読み取り専用（書き込み権限なし）</li>
                </ul>
              </div>

              <div className="border-l-4 border-orange-500 pl-4">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-orange-500" />
                  データ保護
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• <strong>データ暗号化：</strong>Supabaseによる保管時暗号化</li>
                  <li>• <strong>通信暗号化：</strong>HTTPS/TLS 1.2以上</li>
                  <li>• <strong>データ分離：</strong>RLSにより各ユーザーのデータを完全分離</li>
                  <li>• <strong>個人情報保護：</strong>個人設定はuser_settingsテーブルで管理</li>
                </ul>
              </div>

              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-500" />
                  RLS（Row Level Security）ポリシー
                </h3>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-700 mb-2"><strong>すべてのテーブルに適用されるポリシー：</strong></p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• <strong>SELECT:</strong> auth.uid() = user_id（自分のデータのみ閲覧可能）</li>
                    <li>• <strong>INSERT:</strong> auth.uid() = user_id（自分のデータのみ作成可能）</li>
                    <li>• <strong>UPDATE:</strong> auth.uid() = user_id（自分のデータのみ更新可能）</li>
                    <li>• <strong>DELETE:</strong> auth.uid() = user_id（自分のデータのみ削除可能）</li>
                  </ul>
                </div>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-500" />
                  セキュリティベストプラクティス
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• 環境変数の使用（Supabase URL、Anon Key）</li>
                  <li>• クライアント側でのSecretキー非使用</li>
                  <li>• XSS対策（React自動エスケープ）</li>
                  <li>• CSRF対策（Supabase標準機能）</li>
                  <li>• SQL インジェクション対策（Supabase ORM使用）</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 8. UI/UX設計 */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold">8</span>
              UI/UX設計
            </h2>
            <div className="ml-10 space-y-4">

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">デザイン原則</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• <strong>シンプルさ：</strong>直感的で分かりやすいインターフェース</li>
                  <li>• <strong>一貫性：</strong>全画面で統一されたデザインパターン</li>
                  <li>• <strong>レスポンシブ：</strong>PC、タブレット、スマートフォンに最適化</li>
                  <li>• <strong>アクセシビリティ：</strong>ITリテラシーの低いユーザーでも使いやすい</li>
                  <li>• <strong>視覚的フィードバック：</strong>操作結果を明確に表示</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">カラーパレット</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-blue-500 text-white p-3 rounded text-center">
                    <p className="font-semibold">Primary</p>
                    <p className="text-xs">#3B82F6</p>
                  </div>
                  <div className="bg-gray-700 text-white p-3 rounded text-center">
                    <p className="font-semibold">Secondary</p>
                    <p className="text-xs">#374151</p>
                  </div>
                  <div className="bg-green-500 text-white p-3 rounded text-center">
                    <p className="font-semibold">Success</p>
                    <p className="text-xs">#10B981</p>
                  </div>
                  <div className="bg-red-500 text-white p-3 rounded text-center">
                    <p className="font-semibold">Error</p>
                    <p className="text-xs">#EF4444</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">レスポンシブブレークポイント</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• <strong>Mobile:</strong> 0px - 639px（1カラムレイアウト）</li>
                    <li>• <strong>Tablet:</strong> 640px - 1023px（2カラムレイアウト）</li>
                    <li>• <strong>Desktop:</strong> 1024px以上（フルレイアウト）</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">主要コンポーネント</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• <strong>Header：</strong>ロゴ、ユーザー情報、ログアウトボタン</li>
                  <li>• <strong>Sidebar：</strong>ナビゲーションメニュー（モバイルはハンバーガーメニュー）</li>
                  <li>• <strong>Card：</strong>情報のグループ化と視覚的な分離</li>
                  <li>• <strong>Modal：</strong>詳細表示、確認ダイアログ</li>
                  <li>• <strong>Form：</strong>入力フィールド、ボタン、バリデーション</li>
                  <li>• <strong>Badge：</strong>ステータス表示（提出済み/下書き）</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 9. 特殊機能 */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold">9</span>
              特殊機能
            </h2>
            <div className="ml-10 space-y-6">

              {/* PDF生成 */}
              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-500" />
                  PDF生成機能
                </h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <p><strong>ライブラリ：</strong>jsPDF 3.0.2, jspdf-autotable 5.0.2</p>
                  <p><strong>出力内容：</strong></p>
                  <ul className="ml-4 space-y-1">
                    <li>• ヘッダー（日付、ユーザー名）</li>
                    <li>• 勤務時間情報</li>
                    <li>• 当日のスケジュール（テーブル形式）</li>
                    <li>• 報告事項</li>
                    <li>• 翌勤務日の予定</li>
                    <li>• フッター（生成日時）</li>
                  </ul>
                  <p><strong>フォーマット：</strong>A4サイズ、日本語対応</p>
                </div>
              </div>

              {/* テキストコピー */}
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-blue-500" />
                  テキストコピー機能
                </h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <p><strong>目的：</strong>チャットツールやメールでの情報共有を簡単に</p>
                  <p><strong>機能：</strong></p>
                  <ul className="ml-4 space-y-1">
                    <li>• <strong>勤務開始時コピー：</strong>当日の予定と業務内容のみ</li>
                    <li>• <strong>勤務終了時コピー：</strong>当日の実績＋翌勤務日の予定</li>
                  </ul>
                  <p><strong>出力フォーマット：</strong>整形されたテキスト形式（Markdown風）</p>
                  <p><strong>コピー先：</strong>クリップボード（navigator.clipboard API）</p>
                </div>
              </div>

              {/* スクリーンショットモーダル */}
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-green-500" />
                  スクリーンショットモーダル
                </h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <p><strong>目的：</strong>日報内容をスクリーンショットとして保存</p>
                  <p><strong>表示内容：</strong></p>
                  <ul className="ml-4 space-y-1">
                    <li>• 日報の全内容を読みやすくレイアウト</li>
                    <li>• 背景色を白に統一</li>
                    <li>• 印刷可能な形式</li>
                  </ul>
                  <p><strong>使用方法：</strong>モーダル表示 → OSのスクリーンショット機能で撮影</p>
                </div>
              </div>

              {/* 定型文挿入 */}
              <div className="border-l-4 border-orange-500 pl-4">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-orange-500" />
                  定型文挿入機能
                </h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <p><strong>目的：</strong>よく使う文章を簡単に入力</p>
                  <p><strong>定型文の種類：</strong></p>
                  <ul className="ml-4 space-y-1">
                    <li>• 出勤時間調整（設定した開始時刻を自動入力）</li>
                    <li>• 退勤時間調整（設定した終了時刻を自動入力）</li>
                    <li>• 有給使用（休暇期間を自動計算）</li>
                    <li>• 在宅勤務</li>
                    <li>• 外出予定</li>
                  </ul>
                  <p><strong>自動入力：</strong>時間や日付が必要な定型文は自動的に情報を補完</p>
                </div>
              </div>
            </div>
          </div>

          {/* 10. 今後の開発予定 */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold">10</span>
              今後の開発予定
            </h2>
            <div className="ml-10 space-y-3">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">実装予定の機能</h3>
                <ul className="space-y-2 text-sm text-blue-700">
                  <li>• <strong>個人情報設定の保存機能：</strong>現在UIのみ、データベーススキーマ更新後に実装</li>
                  <li>• <strong>通知機能：</strong>日報未提出時のリマインダー</li>
                  <li>• <strong>統計機能：</strong>業務時間の月次・年次集計</li>
                  <li>• <strong>エクスポート機能：</strong>日報一覧のCSV/Excel出力</li>
                  <li>• <strong>承認ワークフロー：</strong>上司による日報承認機能</li>
                  <li>• <strong>コメント機能：</strong>日報へのフィードバック</li>
                  <li>• <strong>モバイルアプリ：</strong>React Nativeでのネイティブアプリ化</li>
                </ul>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-800 mb-2">改善予定</h3>
                <ul className="space-y-2 text-sm text-green-700">
                  <li>• パフォーマンス最適化（キャッシュ戦略の見直し）</li>
                  <li>• エラーハンドリングの強化</li>
                  <li>• ユーザーフィードバックに基づくUI改善</li>
                  <li>• アクセシビリティの向上（WCAG 2.1準拠）</li>
                </ul>
              </div>
            </div>
          </div>

        </div>

        {/* フッター */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>このドキュメントは開発チーム向けの技術仕様書です</p>
          <p className="mt-2">最終更新: 2025年10月1日</p>
        </div>
      </div>
    </div>
  );
};

export default Requirements;
