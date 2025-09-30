/*
  更新情報を記述する際の重要な注意点：
  
  1. ITリテラシーが低い人にも分かりやすく平易な言葉で記述する
     - 分かりづらいカタカナ語は避ける
     - 専門用語は使わず、日常的な言葉で説明する
  
  2. 内部的な処理の変更など使用する人にとって関係のないことは詳しくは書かない
     - 「◯◯を調整しました。」等の記述程度で十分
     - ユーザーが実際に体感できる変化に焦点を当てる
  
  3. ユーザーにとってのメリットや改善効果を明確に示す
     - 「なぜこの変更が良いのか」を分かりやすく説明する
*/

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Megaphone, Calendar, CheckCircle, Star, Zap, Shield, Users, LogIn, Clock, Settings, Copy } from 'lucide-react';

const UpdateInfo: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ヘッダー */}
        <div className="mb-8">
          <Link 
            to="/login" 
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            ログイン画面に戻る
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <Megaphone className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-gray-800">
              更新情報
            </h1>
          </div>
          <p className="text-gray-600">
            リサスティー日報システムの最新の機能追加・改善内容をお知らせします
          </p>
        </div>

        <div className="space-y-8">
          {/* 2025年9月14日の更新 */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-semibold text-gray-800">2025年9月14日</h2>
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                最新
              </span>
            </div>
            
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <Settings className="w-4 h-4 text-blue-500" />
                  個人設定機能を追加しました
                </h3>
                <p className="text-gray-700 mb-2">
                  これまで開発中だった個人設定機能が完成し、ご利用いただけるようになりました。
                </p>
                <ul className="text-sm text-gray-600 space-y-1 ml-4">
                  <li>• 標準勤務時間を個人ごとに設定できるようになりました</li>
                  <li>• 設定した時間が日報作成画面で自動的に入力されます</li>
                  <li>• 翌勤務日設定でも設定した時間が自動的に反映されます</li>
                  <li>• 毎回手動で時間を入力する手間が省けます</li>
                </ul>
                <div className="mt-2 p-2 bg-blue-50 rounded text-sm text-blue-700">
                  <strong>使い方：</strong>
                  <ul className="mt-1 space-y-1">
                    <li>• ハンバーガーメニューから「個人設定」を選択</li>
                    <li>• 標準開始時間と標準終了時間を設定</li>
                    <li>• 「設定を保存」ボタンで保存完了</li>
                    <li>• 次回の日報作成時から自動的に反映されます</li>
                  </ul>
                </div>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-green-500" />
                  勤務時間設定の安全機能を追加
                </h3>
                <p className="text-gray-700 mb-2">
                  個人設定で勤務時間を設定する際に、適切な時間かどうかをお知らせする機能を追加しました。
                </p>
                <ul className="text-sm text-gray-600 space-y-1 ml-4">
                  <li>• 勤務時間が9時間より短い場合に注意メッセージを表示</li>
                  <li>• 勤務時間が9時間を超える場合に注意メッセージを表示</li>
                  <li>• 適切な勤務時間（9時間）の場合は正常メッセージを表示</li>
                  <li>• 設定ミスを防ぎ、正しい勤務時間管理をサポート</li>
                </ul>
                <div className="mt-2 p-2 bg-green-50 rounded text-sm text-green-700">
                  <strong>メリット：</strong>労働基準法に適した勤務時間設定ができ、適切な労働時間管理が可能になります
                </div>
              </div>

              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <Copy className="w-4 h-4 text-purple-500" />
                  定型文挿入機能の改善
                </h3>
                <p className="text-gray-700 mb-2">
                  翌勤務日設定の連絡事項で使用する定型文挿入機能をより便利に改善しました。
                </p>
                <ul className="text-sm text-gray-600 space-y-1 ml-4">
                  <li>• 出勤時間調整の定型文に、設定した開始時間が自動的に入ります</li>
                  <li>• 退勤時間調整の定型文に、設定した終了時間が自動的に入ります</li>
                  <li>• 有給使用の定型文に、休暇期間が自動的に計算されて入ります</li>
                  <li>• 手動で時間や日付を入力する必要がなくなりました</li>
                </ul>
                <div className="mt-2 p-2 bg-purple-50 rounded text-sm text-purple-700">
                  <strong>改善効果：</strong>定型文を選ぶだけで適切な時間や日付が自動入力され、入力ミスを防げます
                </div>
              </div>

              <div className="border-l-4 border-orange-500 pl-4">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <Settings className="w-4 h-4 text-orange-500" />
                  メニュー表示を分かりやすく変更
                </h3>
                <p className="text-gray-700 mb-2">
                  ハンバーガーメニューや設定画面の表示をより分かりやすく変更しました。
                </p>
                <ul className="text-sm text-gray-600 space-y-1 ml-4">
                  <li>• 「設定」という表示を「個人設定」に変更</li>
                  <li>• より具体的で分かりやすい表示になりました</li>
                  <li>• 何の設定なのかが一目で分かるようになりました</li>
                </ul>
                <div className="mt-2 p-2 bg-orange-50 rounded text-sm text-orange-700">
                  <strong>メリット：</strong>メニューの内容がより明確になり、迷わずに操作できます
                </div>
              </div>
            </div>
          </div>

          {/* 2025年9月12日の更新 */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-semibold text-gray-800">2025年9月12日</h2>
            </div>
            
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <Copy className="w-4 h-4 text-blue-500" />
                  勤務開始時コピー機能の改善
                </h3>
                <p className="text-gray-700 mb-2">
                  日報作成画面の「勤務開始時コピー」機能を改善し、より適切な情報のみをコピーできるようになりました。
                </p>
                <ul className="text-sm text-gray-600 space-y-1 ml-4">
                  <li>• 勤務開始時には翌勤務日の情報は不要なため、コピー内容から除外しました</li>
                  <li>• 当日の勤務時間、予定、報告事項のみをコピーします</li>
                  <li>• 勤務終了時コピー（日報確認画面）には引き続き翌勤務日情報も含まれます</li>
                  <li>• より目的に応じた適切な情報共有が可能になりました</li>
                </ul>
                <div className="mt-2 p-2 bg-blue-50 rounded text-sm text-blue-700">
                  <strong>使い分け：</strong>
                  <ul className="mt-1 space-y-1">
                    <li>• 勤務開始時：当日の予定と業務内容のみ</li>
                    <li>• 勤務終了時：当日の実績＋翌勤務日の予定</li>
                  </ul>
                </div>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <Megaphone className="w-4 h-4 text-blue-500" />
                  定型文挿入機能の便利な自動入力について
                </h3>
                <p className="text-gray-700 mb-2">
                  翌勤務日設定の連絡事項で定型文を挿入する際、設定した時間や日付が自動的に反映されます。
                </p>
                <ul className="text-sm text-gray-600 space-y-1 ml-4">
                  <li>• 「出勤時間調整」を選択すると、設定した開始時間が自動入力されます</li>
                  <li>• 「退勤時間調整」を選択すると、設定した終了時間が自動入力されます</li>
                  <li>• 「有給使用」を選択すると、翌勤務日までの期間が自動計算されます</li>
                  <li>• 手動で時間や日付を入力する手間が省けます</li>
                </ul>
                <div className="mt-2 p-2 bg-blue-50 rounded text-sm text-blue-700">
                  <strong>使用例：</strong>
                  <ul className="mt-1 space-y-1">
                    <li>• 開始時間を10:00に設定 → 「時間調整のため、10:00に出勤します。」</li>
                    <li>• 終了時間を17:00に設定 → 「時間調整のため、17:00に退勤します。」</li>
                    <li>• 翌勤務日を3日後に設定 → 「○月○日～○月○日は有給使用のためお休みします。」</li>
                  </ul>
                </div>
              </div>

              <div className="border-l-4 border-orange-500 pl-4">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <Settings className="w-4 h-4 text-orange-500" />
                  翌勤務日設定画面の不具合を修正しました
                </h3>
                <p className="text-gray-700 mb-2">
                  翌勤務日設定画面が正常に表示されるようになりました。
                </p>
                <ul className="text-sm text-gray-600 space-y-1 ml-4">
                  <li>• 連絡事項の定型文挿入機能が正常に動作します</li>
                  <li>• 定型文に設定した時間や日付が自動的に反映されます</li>
                  <li>• 画面の表示が安定しました</li>
                </ul>
                <div className="mt-2 p-2 bg-orange-50 rounded text-sm text-orange-700">
                  <strong>改善効果：</strong>翌勤務日設定がスムーズに行えるようになり、定型文機能も便利にご利用いただけます
                </div>
              </div>

              <div className="border-l-4 border-red-500 pl-4">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-red-500" />
                  休憩時間の計算を改善しました
                </h3>
                <p className="text-gray-700 mb-2">
                  日報確認画面で表示される休憩時間がより正確に計算されるようになりました。
                </p>
                <ul className="text-sm text-gray-600 space-y-1 ml-4">
                  <li>• 休憩時間が他の予定と重複していても、正しく休憩時間として表示されます</li>
                  <li>• 実際の労働時間がより正確に計算されます</li>
                  <li>• 勤務時間の内訳がより分かりやすくなりました</li>
                </ul>
                <div className="mt-2 p-2 bg-green-50 rounded text-sm text-green-700">
                  <strong>改善効果：</strong>休憩時間が正確に表示され、労働時間の管理がより適切に行えるようになりました
                </div>
              </div>
            </div>
          </div>

          {/* 2025年9月11日の更新 */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-semibold text-gray-800">2025年9月11日</h2>
            </div>
            
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <LogIn className="w-4 h-4 text-blue-500" />
                  ログイン操作の簡素化
                </h3>
                <p className="text-gray-700 mb-2">
                  ログイン後の画面遷移を大幅に簡素化し、より直感的で効率的な操作を実現しました。
                </p>
                <ul className="text-sm text-gray-600 space-y-1 ml-4">
                  <li>• ログイン後の3つの画面遷移を削除</li>
                  <li>• ログインボタンを押すと直接日報作成画面に移動</li>
                  <li>• 不要な中間ページを排除してスムーズな操作を実現</li>
                  <li>• ユーザーの待ち時間を大幅に短縮</li>
                </ul>
                <div className="mt-2 p-2 bg-blue-50 rounded text-sm text-blue-700">
                  <strong>メリット：</strong>ログインから日報作成まで最短ルートでアクセスでき、日々の業務効率が向上
                </div>
              </div>
            </div>
          </div>

          {/* 2025年1月10日の更新 */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-semibold text-gray-800">2025年9月10日</h2>
            </div>
            
            <div className="space-y-4">
              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-purple-500" />
                  勤務開始時・終了時のテキストコピー機能を追加
                </h3>
                <p className="text-gray-700 mb-2">
                  日報の内容を簡単にコピーできる機能を追加しました。勤務開始時と終了時の情報をワンクリックでクリップボードにコピーできます。
                </p>
                <ul className="text-sm text-gray-600 space-y-1 ml-4">
                  <li>• 日報作成画面に「勤務開始時コピー」ボタンを追加</li>
                  <li>• 日報確認画面に「勤務終了時コピー」ボタンを追加</li>
                  <li>• 予定、勤務時間、報告事項を整理されたテキスト形式でコピー</li>
                  <li>• 翌勤務日の情報も含めて包括的な情報を提供</li>
                </ul>
                <div className="mt-2 p-2 bg-purple-50 rounded text-sm text-purple-700">
                  <strong>活用方法：</strong>
                  <ul className="mt-1 space-y-1">
                    <li>• チャットツール（Slack、Teams等）での日報共有</li>
                    <li>• メールでの業務報告</li>
                    <li>• 個人的な業務記録の保存</li>
                    <li>• 上司への口頭報告時の参考資料として活用</li>
                  </ul>
                </div>
                <div className="mt-2 p-2 bg-purple-50 rounded text-sm text-purple-700">
                  <strong>メリット：</strong>手動での入力作業が不要になり、正確で統一された形式での情報共有が可能
                </div>
              </div>

              <div className="border-l-4 border-orange-500 pl-4">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-orange-500" />
                  Googleカレンダー連携の精度向上
                </h3>
                <p className="text-gray-700 mb-2">
                  Googleカレンダーから取得する予定の精度を向上させ、より正確な業務スケジュールを反映できるようになりました。
                </p>
                <ul className="text-sm text-gray-600 space-y-1 ml-4">
                  <li>• 参加を辞退した予定を自動的に除外</li>
                  <li>• 実際に参加する予定のみを日報に反映</li>
                  <li>• より正確な勤務時間の計算が可能</li>
                  <li>• 不要な予定情報による混乱を防止</li>
                </ul>
                <div className="mt-2 p-2 bg-orange-50 rounded text-sm text-orange-700">
                  <strong>メリット：</strong>実際の業務内容により近い日報を作成でき、正確な勤務実態の把握が可能
                </div>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-green-500" />
                  更新情報機能を追加
                </h3>
                <p className="text-gray-700 mb-2">
                  システムの最新の機能追加や改善内容をお知らせする更新情報機能を追加しました。
                </p>
                <ul className="text-sm text-gray-600 space-y-1 ml-4">
                  <li>• ログイン画面に「更新情報を見る」ボタンを追加</li>
                  <li>• 日付順で整理された分かりやすい更新履歴</li>
                  <li>• 各変更点のメリットを明確に表示</li>
                  <li>• ユーザー向けの分かりやすい説明文</li>
                </ul>
                <div className="mt-2 p-2 bg-green-50 rounded text-sm text-green-700">
                  <strong>メリット：</strong>システムの最新情報を簡単に確認できるようになりました
                </div>
              </div>

              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <Star className="w-4 h-4 text-blue-500" />
                  ログイン画面の背景色統一
                </h3>
                <p className="text-gray-700 mb-2">
                  ログイン画面の「初めてご利用の方へ」セクションの背景色をサイト全体の背景色と統一しました。
                </p>
                <ul className="text-sm text-gray-600 space-y-1 ml-4">
                  <li>• 背景色の不統一を解消</li>
                  <li>• より自然で統一感のあるデザインに改善</li>
                  <li>• 視覚的な違和感を解消</li>
                </ul>
                <div className="mt-2 p-2 bg-blue-50 rounded text-sm text-blue-700">
                  <strong>メリット：</strong>より洗練された見た目で快適にご利用いただけます
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateInfo;