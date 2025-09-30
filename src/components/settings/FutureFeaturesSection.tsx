import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Smartphone, Mail, MapPin, Home } from 'lucide-react';

const FutureFeaturesSection: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">将来の機能（開発予定）</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 組織管理機能 */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <Briefcase className="w-5 h-5 text-blue-600" />
            <h3 className="font-medium text-blue-800">組織管理機能</h3>
          </div>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• 組織図の表示・管理</li>
            <li>• 部署・チーム構成の確認</li>
            <li>• 上司・部下関係の設定</li>
            <li>• 組織変更履歴の管理</li>
          </ul>
        </div>

        {/* 通知設定機能 */}
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <Smartphone className="w-5 h-5 text-green-600" />
            <h3 className="font-medium text-green-800">通知設定機能</h3>
          </div>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• 日報提出リマインダー</li>
            <li>• 翌日設定の通知</li>
            <li>• メール・LINE Works連携</li>
            <li>• 通知タイミングの設定</li>
          </ul>
        </div>

        {/* 連携機能 */}
        <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <Mail className="w-5 h-5 text-purple-600" />
            <h3 className="font-medium text-purple-800">連携機能</h3>
          </div>
          <ul className="text-sm text-purple-700 space-y-1">
            <li>• メールアドレスと名前の自動連動</li>
            <li>• 参加者表示の最適化</li>
            <li>• 外部システムとの連携</li>
            <li>• データエクスポート機能</li>
          </ul>
        </div>

        {/* セキュリティ機能 */}
        <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-5 h-5 text-orange-600" />
            <h3 className="font-medium text-orange-800">セキュリティ・その他</h3>
          </div>
          <ul className="text-sm text-orange-700 space-y-1">
            <li>• アクセス権限の管理</li>
            <li>• データバックアップ設定</li>
            <li>• プライバシー設定</li>
            <li>• テーマ・表示設定</li>
          </ul>
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg text-center">
        <p className="text-gray-600 mb-4">
          これらの機能は順次開発・リリース予定です。
        </p>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Home className="w-4 h-4" />
          ダッシュボードに戻る
        </Link>
      </div>
    </div>
  );
};

export default FutureFeaturesSection;