import React from 'react';
import { User, Save } from 'lucide-react';

interface EmployeeInfoSettingsProps {
  profileName: string;
  profileNameKana: string;
  profileBusinessName: string;
  profileEmail: string;
  profilePhone: string;
  profileLineWorksId: string;
  profileDepartment: string;
  profilePosition: string;
  profileResidence: string;
  profileBio: string;
  onProfileNameChange: (value: string) => void;
  onProfileNameKanaChange: (value: string) => void;
  onProfileBusinessNameChange: (value: string) => void;
  onProfileEmailChange: (value: string) => void;
  onProfilePhoneChange: (value: string) => void;
  onProfileLineWorksIdChange: (value: string) => void;
  onProfileDepartmentChange: (value: string) => void;
  onProfilePositionChange: (value: string) => void;
  onProfileResidenceChange: (value: string) => void;
  onProfileBioChange: (value: string) => void;
  onSave: () => void;
  isSaving: boolean;
}

const EmployeeInfoSettings: React.FC<EmployeeInfoSettingsProps> = ({
  profileName,
  profileNameKana,
  profileBusinessName,
  profileEmail,
  profilePhone,
  profileLineWorksId,
  profileDepartment,
  profilePosition,
  profileResidence,
  profileBio,
  onProfileNameChange,
  onProfileNameKanaChange,
  onProfileBusinessNameChange,
  onProfileEmailChange,
  onProfilePhoneChange,
  onProfileLineWorksIdChange,
  onProfileDepartmentChange,
  onProfilePositionChange,
  onProfileResidenceChange,
  onProfileBioChange,
  onSave,
  isSaving
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center gap-3 mb-6">
        <User className="w-6 h-6 text-primary" />
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-gray-800">社員情報設定</h2>
          <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full border border-blue-200">
            対外的公開可能
          </span>
        </div>
      </div>
      
      <p className="text-gray-600 mb-6">
        名刺や社外向け資料に掲載可能な情報を設定します
      </p>
      
      <div className="space-y-6">
        {/* 基本情報 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              氏名 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={profileName}
              onChange={(e) => onProfileNameChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="山田 太郎"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              氏名よみがな
            </label>
            <input
              type="text"
              value={profileNameKana}
              onChange={(e) => onProfileNameKanaChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="やまだ たろう"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ビジネスネーム
            </label>
            <input
              type="text"
              value={profileBusinessName}
              onChange={(e) => onProfileBusinessNameChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="山田 太郎"
            />
            <p className="text-xs text-gray-500 mt-1">
              氏名を入力すると自動的に同じ値が入力されます
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              メールアドレス <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={profileEmail}
              onChange={(e) => onProfileEmailChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="yamada@example.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              電話番号
            </label>
            <input
              type="tel"
              value={profilePhone}
              onChange={(e) => onProfilePhoneChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="090-1234-5678"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              LINE WORKS ID
            </label>
            <input
              type="text"
              value={profileLineWorksId}
              onChange={(e) => onProfileLineWorksIdChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="yamada.taro"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              部署
            </label>
            <input
              type="text"
              value={profileDepartment}
              onChange={(e) => onProfileDepartmentChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="営業部"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              役職
            </label>
            <input
              type="text"
              value={profilePosition}
              onChange={(e) => onProfilePositionChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="主任"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              居住地（都道府県・市区町村）
            </label>
            <input
              type="text"
              value={profileResidence}
              onChange={(e) => onProfileResidenceChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="東京都渋谷区"
            />
          </div>
        </div>
        
        {/* 自己紹介 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            自己紹介・備考
          </label>
          <textarea
            value={profileBio}
            onChange={(e) => onProfileBioChange(e.target.value)}
            rows={3}
            maxLength={500}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="趣味や特技、業務に関する情報など"
          />
          <p className="text-xs text-gray-500 mt-1">
            {profileBio.length}/500文字
          </p>
        </div>
        
        <div className="flex justify-end">
          <button
            onClick={onSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                保存中...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                社員情報を保存
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeInfoSettings;