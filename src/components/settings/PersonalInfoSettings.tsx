import React, { useState } from 'react';
import { User, Save, AlertTriangle } from 'lucide-react';

interface PersonalInfoSettingsProps {
  profileBirthDate: string;
  profileMaritalStatus: string;
  profileAnniversary: string;
  profileChildrenCount: string;
  profileChild1Birthday: string;
  profileChild2Birthday: string;
  profileChild3Birthday: string;
  profileAddress: string;
  profilePostalCode: string;
  emergencyContactName: string;
  emergencyContactNameKana: string;
  emergencyContactRelation: string;
  emergencyContactPhone: string;
  emergencyContactEmail: string;
  emergencyContactLineId: string;
  onProfileBirthDateChange: (value: string) => void;
  onProfileMaritalStatusChange: (value: string) => void;
  onProfileAnniversaryChange: (value: string) => void;
  onProfileChildrenCountChange: (value: string) => void;
  onProfileChild1BirthdayChange: (value: string) => void;
  onProfileChild2BirthdayChange: (value: string) => void;
  onProfileChild3BirthdayChange: (value: string) => void;
  onProfileAddressChange: (value: string) => void;
  onProfilePostalCodeChange: (value: string) => void;
  onEmergencyContactNameChange: (value: string) => void;
  onEmergencyContactNameKanaChange: (value: string) => void;
  onEmergencyContactRelationChange: (value: string) => void;
  onEmergencyContactPhoneChange: (value: string) => void;
  onEmergencyContactEmailChange: (value: string) => void;
  onEmergencyContactLineIdChange: (value: string) => void;
  emergencyContactPostalCode: string;
  emergencyContactAddress: string;
  onEmergencyContactPostalCodeChange: (value: string) => void;
  onEmergencyContactAddressChange: (value: string) => void;
  onSave: () => void;
  isSaving: boolean;
}

const PersonalInfoSettings: React.FC<PersonalInfoSettingsProps> = ({
  profileBirthDate,
  profileMaritalStatus,
  profileAnniversary,
  profileChildrenCount,
  profileChild1Birthday,
  profileChild2Birthday,
  profileChild3Birthday,
  profileAddress,
  profilePostalCode,
  emergencyContactName,
  emergencyContactNameKana,
  emergencyContactRelation,
  emergencyContactPhone,
  emergencyContactEmail,
  emergencyContactLineId,
  onProfileBirthDateChange,
  onProfileMaritalStatusChange,
  onProfileAnniversaryChange,
  onProfileChildrenCountChange,
  onProfileChild1BirthdayChange,
  onProfileChild2BirthdayChange,
  onProfileChild3BirthdayChange,
  onProfileAddressChange,
  onProfilePostalCodeChange,
  onEmergencyContactNameChange,
  onEmergencyContactNameKanaChange,
  onEmergencyContactRelationChange,
  onEmergencyContactPhoneChange,
  onEmergencyContactEmailChange,
  onEmergencyContactLineIdChange,
  emergencyContactPostalCode,
  emergencyContactAddress,
  onEmergencyContactPostalCodeChange,
  onEmergencyContactAddressChange,
  onSave,
  isSaving
}) => {
  const [activeTab, setActiveTab] = useState<'basic' | 'detailed'>('basic');

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center gap-3 mb-6">
        <User className="w-6 h-6 text-red-600" />
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-gray-800">個人情報設定</h2>
          <span className="inline-flex items-center px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full border border-red-200">
            社内管理のみ
          </span>
        </div>
      </div>
      
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="w-4 h-4 text-red-600" />
          <span className="text-sm font-medium text-red-800">機密情報の取り扱いについて</span>
        </div>
        <p className="text-sm text-red-700">
          この情報は社内管理のみに使用され、対外的には公開されません。入力は任意ですが、緊急時の連絡や福利厚生の提供に活用される場合があります。
        </p>
      </div>

      {/* タブナビゲーション */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('basic')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'basic'
                ? 'border-red-500 text-red-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            基本情報（推奨入力）
          </button>
          <button
            onClick={() => setActiveTab('detailed')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'detailed'
                ? 'border-red-500 text-red-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            詳細情報（任意入力）
          </button>
        </nav>
      </div>

      {/* タブコンテンツ */}
      <div className="space-y-8">
        {activeTab === 'basic' && (
          <>
            {/* 基本個人情報 */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-gray-600" />
                基本個人情報
                <span className="text-sm text-red-600 font-normal">（推奨入力）</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    生年月日 <span className="text-red-500">*推奨</span>
                  </label>
                  <input
                    type="date"
                    value={profileBirthDate}
                    onChange={(e) => onProfileBirthDateChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* 住所情報 */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-gray-600" />
                居住地詳細
                <span className="text-sm text-red-600 font-normal">（推奨入力）</span>
              </h3>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    郵便番号 <span className="text-red-500">*推奨</span>
                  </label>
                  <input
                    type="text"
                    value={profilePostalCode}
                    onChange={(e) => onProfilePostalCodeChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="123-4567"
                    pattern="[0-9]{3}-[0-9]{4}"
                  />
                </div>
                
                <div className="col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    住所 <span className="text-red-500">*推奨</span>
                  </label>
                  <input
                    type="text"
                    value={profileAddress}
                    onChange={(e) => onProfileAddressChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="東京都渋谷区○○町1-2-3 ○○マンション101号室"
                  />
                </div>
              </div>
            </div>

            {/* 緊急連絡先 */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-gray-600" />
                緊急連絡先
                <span className="text-sm text-red-600 font-normal">（推奨入力）</span>
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    氏名 <span className="text-red-500">*推奨</span>
                  </label>
                  <input
                    type="text"
                    value={emergencyContactName}
                    onChange={(e) => onEmergencyContactNameChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="山田 花子"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    氏名ふりがな <span className="text-red-500">*推奨</span>
                  </label>
                  <input
                    type="text"
                    value={emergencyContactNameKana}
                    onChange={(e) => onEmergencyContactNameKanaChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="やまだ はなこ"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    続柄・関係 <span className="text-red-500">*推奨</span>
                  </label>
                  <select
                    value={emergencyContactRelation}
                    onChange={(e) => onEmergencyContactRelationChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">選択してください</option>
                    <option value="spouse">配偶者</option>
                    <option value="father">父</option>
                    <option value="mother">母</option>
                    <option value="sibling">兄弟姉妹</option>
                    <option value="child">子</option>
                    <option value="relative">親族</option>
                    <option value="friend">友人</option>
                    <option value="other">その他</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    電話番号 <span className="text-red-500">*推奨</span>
                  </label>
                  <input
                    type="tel"
                    value={emergencyContactPhone}
                    onChange={(e) => onEmergencyContactPhoneChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="090-1234-5678"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    メールアドレス
                  </label>
                  <input
                    type="email"
                    value={emergencyContactEmail}
                    onChange={(e) => onEmergencyContactEmailChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="hanako@example.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    LINE ID
                  </label>
                  <input
                    type="text"
                    value={emergencyContactLineId}
                    onChange={(e) => onEmergencyContactLineIdChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="hanako_yamada"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    郵便番号
                    <button
                      type="button"
                      onClick={() => {
                        onEmergencyContactPostalCodeChange(profilePostalCode);
                        onEmergencyContactAddressChange(profileAddress);
                      }}
                      className="text-xs text-blue-600 hover:text-blue-800 underline"
                      title="居住地詳細からコピー"
                    >
                      居住地からコピー
                    </button>
                  </label>
                  <input
                    type="text"
                    value={emergencyContactPostalCode}
                    onChange={(e) => onEmergencyContactPostalCodeChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="123-4567"
                    pattern="[0-9]{3}-[0-9]{4}"
                  />
                </div>
                
                <div className="col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    住所
                  </label>
                  <input
                    type="text"
                    value={emergencyContactAddress}
                    onChange={(e) => onEmergencyContactAddressChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="東京都渋谷区○○町1-2-3 ○○マンション101号室"
                  />
                </div>
              </div>
            </div>
          </div>
          </>
        )}

        {activeTab === 'detailed' && (
          <>
            {/* 家族情報 */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-gray-600" />
                家族情報
                <span className="text-sm text-gray-600 font-normal">（任意入力）</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    婚姻の有無
                  </label>
                  <select
                    value={profileMaritalStatus}
                    onChange={(e) => onProfileMaritalStatusChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">選択してください</option>
                    <option value="single">未婚</option>
                    <option value="married">既婚</option>
                    <option value="divorced">離婚</option>
                    <option value="widowed">死別</option>
                    <option value="other">その他</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    結婚記念日
                  </label>
                  <input
                    type="date"
                    value={profileAnniversary}
                    onChange={(e) => onProfileAnniversaryChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    子どもの人数
                  </label>
                  <select
                    value={profileChildrenCount}
                    onChange={(e) => onProfileChildrenCountChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">選択してください</option>
                    <option value="0">0人</option>
                    <option value="1">1人</option>
                    <option value="2">2人</option>
                    <option value="3">3人</option>
                    <option value="4+">4人以上</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 子どもの誕生日 */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-gray-600" />
                子どもの誕生日
                <span className="text-sm text-gray-600 font-normal">（任意入力）</span>
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    第1子の誕生日
                  </label>
                  <input
                    type="date"
                    value={profileChild1Birthday}
                    onChange={(e) => onProfileChild1BirthdayChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    第2子の誕生日
                  </label>
                  <input
                    type="date"
                    value={profileChild2Birthday}
                    onChange={(e) => onProfileChild2BirthdayChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    第3子の誕生日
                  </label>
                  <input
                    type="date"
                    value={profileChild3Birthday}
                    onChange={(e) => onProfileChild3BirthdayChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </>
        )}
        
        <div className="flex justify-end">
          <button
            onClick={onSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                保存中...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                個人情報を保存
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoSettings;