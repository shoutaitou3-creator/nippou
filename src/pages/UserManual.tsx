import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, LogIn, Edit, Calendar, Clock, List, CheckCircle, AlertTriangle, HelpCircle } from 'lucide-react';

const UserManual: React.FC = () => {
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
            <BookOpen className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-gray-800">
              リサスティー日報システム 簡易マニュアル
            </h1>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-8 space-y-8">
          {/* 1. アプリの概要と主な機能 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold">1</span>
              アプリの概要と主な機能
            </h2>
            <div className="ml-10 space-y-4">
              <p className="text-gray-700 leading-relaxed">
                リサスティー日報システムは、日々の業務報告を効率的に行うためのWebアプリケーションです。
                Googleカレンダーと連携して、予定を自動取得し、業務内容を簡単に記録できます。
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">主な機能</h3>
                <ul className="space-y-2 text-blue-700">
                  <li className="flex items-center gap-2">
                    <Edit className="w-4 h-4" />
                    <span><strong>日報作成</strong>：当日の業務内容を記録</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span><strong>翌勤務日設定</strong>：翌日の勤務予定を設定</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span><strong>日報確認</strong>：提出した日報の内容を確認</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <List className="w-4 h-4" />
                    <span><strong>日報一覧</strong>：過去の日報を一覧表示</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span><strong>Googleカレンダー連携</strong>：予定の自動取得</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* 2. 初回起動時の設定手順 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold">2</span>
              初回起動時の設定手順
            </h2>
            <div className="ml-10 space-y-4">
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                  <span className="font-semibold text-orange-800">重要</span>
                </div>
                <p className="text-orange-700">
                  このシステムを使用するには、<strong>Googleアカウント</strong>が必要です。
                  また、<strong>Googleカレンダーの権限</strong>を許可する必要があります。
                </p>
              </div>

              <h3 className="text-lg font-semibold text-gray-800 mb-3">ログイン手順</h3>
              <ol className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="bg-gray-200 text-gray-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">1</span>
                  <span>アプリにアクセスすると、ログイン画面が表示されます</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-gray-200 text-gray-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">2</span>
                  <span><strong>「Googleでログイン」</strong>ボタンをクリックします</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-gray-200 text-gray-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">3</span>
                  <span>Googleのログイン画面で、会社のGoogleアカウントでログインします</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-gray-200 text-gray-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">4</span>
                  <span><strong>カレンダーへのアクセス権限</strong>を求められたら、<strong>「許可」</strong>をクリックします</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-gray-200 text-gray-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">5</span>
                  <span>ログインが完了すると、自動的に日報作成画面に移動します</span>
                </li>
              </ol>
            </div>
          </section>

          {/* 3. 基本的な操作方法 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold">3</span>
              基本的な操作方法
            </h2>
            <div className="ml-10 space-y-6">
              
              {/* 日報作成 */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Edit className="w-5 h-5 text-primary" />
                  日報作成
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <ol className="space-y-2 text-gray-700">
                    <li><strong>1. 勤務時間の設定</strong>：開始時間と終了時間を選択します</li>
                    <li><strong>2. 当日の予定確認</strong>：Googleカレンダーから自動取得された予定を確認・編集します</li>
                    <li><strong>3. 報告事項の入力</strong>：業務内容を60文字以上で入力します（必須）</li>
                    <li><strong>4. 保存・提出</strong>：
                      <ul className="ml-4 mt-1 space-y-1">
                        <li>• <strong>一時保存</strong>：下書きとして保存（後で編集可能）</li>
                        <li>• <strong>日報提出</strong>：正式に提出（編集不可）</li>
                      </ul>
                    </li>
                  </ol>
                </div>
              </div>

              {/* 翌勤務日設定 */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  翌勤務日設定
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <p className="text-gray-700">日報提出後、自動的に翌勤務日設定画面に移動します。</p>
                  <ol className="space-y-2 text-gray-700">
                    <li><strong>1. 日付選択</strong>：翌勤務日の日付を選択します</li>
                    <li><strong>2. 勤務時間設定</strong>：開始時間と終了時間を設定します</li>
                    <li><strong>3. 連絡事項入力</strong>：特別な予定や注意事項があれば入力します</li>
                    <li><strong>4. 予定確認</strong>：翌日のGoogleカレンダーの予定を確認します</li>
                    <li><strong>5. 設定保存</strong>：「設定を保存」ボタンをクリックします</li>
                  </ol>
                </div>
              </div>

              {/* 日報確認 */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  日報確認
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <p className="text-gray-700">翌勤務日設定後、自動的に日報確認画面に移動します。</p>
                  <ul className="space-y-2 text-gray-700">
                    <li>• <strong>勤務時間表示</strong>：業務分類別の時間が自動計算されます</li>
                    <li>• <strong>予定詳細</strong>：当日の予定一覧を確認できます</li>
                    <li>• <strong>報告事項</strong>：提出した日報の内容を確認できます</li>
                    <li>• <strong>翌勤務日情報</strong>：設定した翌日の予定を確認できます</li>
                    <li>• <strong>スクリーンショット機能</strong>：勤務終了時の情報を画像として保存できます</li>
                  </ul>
                </div>
              </div>

              {/* その他の機能 */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <List className="w-5 h-5 text-primary" />
                  その他の機能
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <ul className="space-y-2 text-gray-700">
                    <li>• <strong>前日作成</strong>：過去の日報を後から作成できます</li>
                    <li>• <strong>日報一覧</strong>：過去に提出した日報を月別で確認できます</li>
                    <li>• <strong>設定</strong>：アカウント設定や通知設定を変更できます（開発中）</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* 4. 業務分類について */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold">4</span>
              業務分類について
            </h2>
            <div className="ml-10 space-y-4">
              <p className="text-gray-700 leading-relaxed">
                システムは予定のタイトルに含まれるキーワードを自動的に分析し、業務を分類して勤務時間を計算します。
                適切な分類のために、予定のタイトルに以下のキーワードを含めることをお勧めします。
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-3">業務分類とキーワード</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-blue-700 mb-1">🤝 会議・打ち合わせ</h4>
                      <p className="text-xs text-blue-600">会議、ミーティング、打ち合わせ、打合せ、MTG</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-blue-700 mb-1">💼 商談・営業</h4>
                      <p className="text-xs text-blue-600">商談、事業説明、営業、提案</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-blue-700 mb-1">📄 資料作成</h4>
                      <p className="text-xs text-blue-600">資料作成、資料確認、資料準備、ドキュメント作成、書類作成、報告書</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-blue-700 mb-1">💻 オンライン講習</h4>
                      <p className="text-xs text-blue-600">オンライン研修、オンライン講習、オンライン体験会、Web研修、Web講習</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-blue-700 mb-1">🏪 臨店講習</h4>
                      <p className="text-xs text-blue-600">臨店講習、臨店体験会、店舗研修、現地研修</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-blue-700 mb-1">👥 採用・面接</h4>
                      <p className="text-xs text-blue-600">面接、採用、人事面談、採用面接</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-blue-700 mb-1">🚗 移動</h4>
                      <p className="text-xs text-blue-600">移動、出張、訪問</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-blue-700 mb-1">☕ 休憩</h4>
                      <p className="text-xs text-blue-600">休憩、昼休み、昼食、ランチ、食事</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-800 mb-2">予定タイトルの記入例</h3>
                <div className="space-y-2 text-sm text-green-700">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                      <p><strong>良い例：</strong></p>
                      <ul className="ml-4 space-y-1">
                        <li>• 「A社との商談」</li>
                        <li>• 「営業会議」</li>
                        <li>• 「提案資料作成」</li>
                        <li>• 「オンライン研修参加」</li>
                        <li>• 「B店舗への移動」</li>
                      </ul>
                    </div>
                    <div>
                      <p><strong>分類されにくい例：</strong></p>
                      <ul className="ml-4 space-y-1">
                        <li>• 「A社」（内容が不明）</li>
                        <li>• 「作業」（具体性に欠ける）</li>
                        <li>• 「外出」（目的が不明）</li>
                        <li>• 「準備」（何の準備か不明）</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-800 mb-2">💡 分類精度を上げるコツ</h3>
                <ul className="space-y-1 text-sm text-yellow-700">
                  <li>• 予定のタイトルには<strong>業務の種類を明確に記載</strong>してください</li>
                  <li>• 複数のキーワードが含まれる場合は、<strong>最初に見つかったキーワード</strong>で分類されます</li>
                  <li>• キーワードが含まれない予定は<strong>「その他業務」</strong>として分類されます</li>
                  <li>• 手動で追加した予定も同様のルールで自動分類されます</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 操作のコツ */}
          <section className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-800 mb-3 flex items-center gap-2">
              <HelpCircle className="w-5 h-5" />
              操作のコツ
            </h3>
            <ul className="space-y-2 text-green-700">
              <li>• 日報は<strong>毎日提出</strong>することを心がけましょう</li>
              <li>• 報告事項は<strong>具体的</strong>に記入すると、後で振り返りやすくなります</li>
              <li>• Googleカレンダーの予定は<strong>自動取得</strong>されますが、手動で編集・追加も可能です</li>
              <li>• <strong>一時保存</strong>を活用して、途中で作業を中断しても安心です</li>
              <li>• スマートフォンからも利用できるので、外出先でも日報作成が可能です</li>
              <li>• 予定のタイトルに<strong>業務分類キーワード</strong>を含めると、勤務時間が正確に分析されます</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default UserManual;