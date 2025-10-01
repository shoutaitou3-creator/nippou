import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import Header from '../components/Header';
import StandardWorkTimeSettings from '../components/settings/StandardWorkTimeSettings';
import EmployeeInfoSettings from '../components/settings/EmployeeInfoSettings';
import PersonalInfoSettings from '../components/settings/PersonalInfoSettings';
import FutureFeaturesSection from '../components/settings/FutureFeaturesSection';
import TemplateManagement from '../components/settings/TemplateManagement';
import { Settings as SettingsIcon } from 'lucide-react';
import { useUserTemplates } from '../hooks/useUserTemplates';

const Settings: React.FC = () => {
  const { user, signOut } = useAuth();
  
  // 標準勤務時間設定
  const [standardStartTime, setStandardStartTime] = useState('09:00');
  const [standardEndTime, setStandardEndTime] = useState('18:00');
  const [isSavingStandardTime, setIsSavingStandardTime] = useState(false);
  const [standardTimeSaveMessage, setStandardTimeSaveMessage] = useState('');
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);

  // 社員情報設定
  const [profileName, setProfileName] = useState('');
  const [profileNameKana, setProfileNameKana] = useState('');
  const [profileBusinessName, setProfileBusinessName] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileLineWorksId, setProfileLineWorksId] = useState('');
  const [profileDepartment, setProfileDepartment] = useState('');
  const [profilePosition, setProfilePosition] = useState('');
  const [profileResidence, setProfileResidence] = useState('');
  const [profileBio, setProfileBio] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSaveMessage, setProfileSaveMessage] = useState('');
  
  // 個人情報設定
  const [profileBirthDate, setProfileBirthDate] = useState('');
  const [profileMaritalStatus, setProfileMaritalStatus] = useState('');
  const [profileAnniversary, setProfileAnniversary] = useState('');
  const [profileChildrenCount, setProfileChildrenCount] = useState('');
  const [profileChild1Birthday, setProfileChild1Birthday] = useState('');
  const [profileChild2Birthday, setProfileChild2Birthday] = useState('');
  const [profileChild3Birthday, setProfileChild3Birthday] = useState('');
  const [profileAddress, setProfileAddress] = useState('');
  const [profilePostalCode, setProfilePostalCode] = useState('');
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyContactNameKana, setEmergencyContactNameKana] = useState('');
  const [emergencyContactRelation, setEmergencyContactRelation] = useState('');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('');
  const [emergencyContactEmail, setEmergencyContactEmail] = useState('');
  const [emergencyContactLineId, setEmergencyContactLineId] = useState('');
  const [emergencyContactPostalCode, setEmergencyContactPostalCode] = useState('');
  const [emergencyContactAddress, setEmergencyContactAddress] = useState('');
  const [isSavingPersonalInfo, setIsSavingPersonalInfo] = useState(false);
  const [personalInfoSaveMessage, setPersonalInfoSaveMessage] = useState('');

  // テンプレート管理
  const { templates, addTemplate, updateTemplate, deleteTemplate, isSaving: isSavingTemplate } = useUserTemplates(user);

  const handleSignOut = React.useCallback(async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('ログアウト処理エラー:', error);
    }
  }, [signOut]);

  // ビジネスネーム自動入力ロジック
  const handleProfileNameChange = (value: string) => {
    setProfileName(value);
    // ビジネスネームが空の場合のみ自動入力
    if (!profileBusinessName.trim()) {
      setProfileBusinessName(value);
    }
  };

  // 標準勤務時間設定を読み込み
  React.useEffect(() => {
    const loadUserSettings = async () => {
      if (!user) {
        setIsLoadingSettings(false);
        return;
      }

      try {
        console.log('=== ユーザー設定読み込み開始 ===', { userId: user.id });
        
        const { data: settings, error } = await supabase
          .from('user_settings')
          .select('default_start_time, default_end_time, profile_name, profile_email, profile_phone, profile_line_works_id, profile_department, profile_position, profile_residence, profile_bio')
          .eq('user_id', user.id)
          .single();

        console.log('=== ユーザー設定取得結果 ===', { data: settings, error });

        if (error && error.code !== 'PGRST116') {
          console.error('ユーザー設定取得エラー:', error);
        }

        if (settings) {
          // データベースの時間が '00:00:00' 形式の場合は 'HH:MM' 形式に変換
          const startTimeFormatted = settings.default_start_time ? settings.default_start_time.substring(0, 5) : '09:00';
          const endTimeFormatted = settings.default_end_time ? settings.default_end_time.substring(0, 5) : '18:00';
          
          // '00:00' の場合はデフォルト値を使用
          setStandardStartTime(startTimeFormatted === '00:00' ? '09:00' : startTimeFormatted);
          setStandardEndTime(endTimeFormatted === '00:00' ? '18:00' : endTimeFormatted);
          
          // 社員情報を設定
          setProfileName(settings.profile_name || '');
          setProfileEmail(settings.profile_email || '');
          setProfilePhone(settings.profile_phone || '');
          setProfileLineWorksId(settings.profile_line_works_id || '');
          setProfileDepartment(settings.profile_department || '');
          setProfilePosition(settings.profile_position || '');
          setProfileResidence(settings.profile_residence || '');
          setProfileBio(settings.profile_bio || '');
          
          // ビジネスネームは氏名と同じ値をデフォルトに設定
          setProfileBusinessName(settings.profile_name || '');
          
          console.log('=== 標準勤務時間設定完了 ===', {
            startTime: startTimeFormatted === '00:00' ? '09:00' : startTimeFormatted,
            endTime: endTimeFormatted === '00:00' ? '18:00' : endTimeFormatted
          });
        } else {
          console.log('=== ユーザー設定が見つからない、デフォルト値を使用 ===');
          setStandardStartTime('09:00');
          setStandardEndTime('18:00');
        }
      } catch (error) {
        console.error('ユーザー設定読み込みエラー:', error);
        setStandardStartTime('09:00');
        setStandardEndTime('18:00');
      } finally {
        setIsLoadingSettings(false);
      }
    };

    loadUserSettings();
  }, [user]);

  // 標準勤務時間を保存
  const handleSaveStandardWorkTime = async () => {
    if (!user) {
      setStandardTimeSaveMessage('認証が必要です');
      setTimeout(() => setStandardTimeSaveMessage(''), 3000);
      return;
    }

    setIsSavingStandardTime(true);
    
    try {
      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          default_start_time: standardStartTime,
          default_end_time: standardEndTime
        }, { 
          onConflict: 'user_id' 
        });

      if (error) {
        throw error;
      }

      setStandardTimeSaveMessage('標準勤務時間を保存しました');
      setTimeout(() => setStandardTimeSaveMessage(''), 3000);
      
    } catch (error: any) {
      console.error('標準勤務時間保存エラー:', error);
      setStandardTimeSaveMessage('保存に失敗しました: ' + error.message);
      setTimeout(() => setStandardTimeSaveMessage(''), 3000);
    } finally {
      setIsSavingStandardTime(false);
    }
  };

  // 社員情報を保存
  const handleSaveProfile = async () => {
    if (!user) {
      setProfileSaveMessage('認証が必要です');
      setTimeout(() => setProfileSaveMessage(''), 3000);
      return;
    }

    setIsSavingProfile(true);
    
    try {
      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          profile_name: profileName,
          profile_email: profileEmail,
          profile_phone: profilePhone,
          profile_line_works_id: profileLineWorksId,
          profile_department: profileDepartment,
          profile_position: profilePosition,
          profile_residence: profileResidence,
          profile_bio: profileBio
        }, { 
          onConflict: 'user_id' 
        });

      if (error) {
        throw error;
      }

      setProfileSaveMessage('社員情報を保存しました');
      setTimeout(() => setProfileSaveMessage(''), 3000);
      
    } catch (error: any) {
      console.error('社員情報保存エラー:', error);
      setProfileSaveMessage('保存に失敗しました: ' + error.message);
      setTimeout(() => setProfileSaveMessage(''), 3000);
    } finally {
      setIsSavingProfile(false);
    }
  };

  // 個人情報を保存（現在は機能しない - データベーススキーマ更新後に実装）
  const handleSavePersonalInfo = async () => {
    setIsSavingPersonalInfo(true);
    
    // 現在はUIのみの実装
    setTimeout(() => {
      setPersonalInfoSaveMessage('個人情報の保存機能は開発中です');
      setTimeout(() => setPersonalInfoSaveMessage(''), 3000);
      setIsSavingPersonalInfo(false);
    }, 1000);
  };

  if (isLoadingSettings) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header user={user} onSignOut={handleSignOut} />
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="text-center py-12">
              <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-500">設定を読み込み中...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} onSignOut={handleSignOut} />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ページヘッダー */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <SettingsIcon className="w-8 h-8 text-primary" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              個人設定
            </h1>
          </div>
          <p className="text-gray-600">
            アカウント設定、通知設定、システム設定を管理できます
          </p>
        </div>

        {/* 保存メッセージ */}
        {standardTimeSaveMessage && (
          <div className={`mb-6 p-4 rounded-lg ${
            standardTimeSaveMessage.includes('失敗') || standardTimeSaveMessage.includes('エラー')
              ? 'bg-red-100 border border-red-200 text-red-700'
              : 'bg-green-100 border border-green-200 text-green-700'
          }`}>
            <p className="font-medium">{standardTimeSaveMessage}</p>
          </div>
        )}

        {profileSaveMessage && (
          <div className={`mb-6 p-4 rounded-lg ${
            profileSaveMessage.includes('失敗') || profileSaveMessage.includes('エラー')
              ? 'bg-red-100 border border-red-200 text-red-700'
              : 'bg-green-100 border border-green-200 text-green-700'
          }`}>
            <p className="font-medium">{profileSaveMessage}</p>
          </div>
        )}

        {personalInfoSaveMessage && (
          <div className={`mb-6 p-4 rounded-lg ${
            personalInfoSaveMessage.includes('失敗') || personalInfoSaveMessage.includes('エラー')
              ? 'bg-red-100 border border-red-200 text-red-700'
              : 'bg-blue-100 border border-blue-200 text-blue-700'
          }`}>
            <p className="font-medium">{personalInfoSaveMessage}</p>
          </div>
        )}

        <div className="space-y-8">
          {/* 標準勤務時間設定 */}
          <StandardWorkTimeSettings
            standardStartTime={standardStartTime}
            standardEndTime={standardEndTime}
            onStartTimeChange={setStandardStartTime}
            onEndTimeChange={setStandardEndTime}
            onSave={handleSaveStandardWorkTime}
            isSaving={isSavingStandardTime}
            saveMessage={standardTimeSaveMessage}
          />
          
          {/* 社員情報設定 */}
          <EmployeeInfoSettings
            profileName={profileName}
            profileNameKana={profileNameKana}
            profileBusinessName={profileBusinessName}
            profileEmail={profileEmail}
            profilePhone={profilePhone}
            profileLineWorksId={profileLineWorksId}
            profileDepartment={profileDepartment}
            profilePosition={profilePosition}
            profileResidence={profileResidence}
            profileBio={profileBio}
            onProfileNameChange={handleProfileNameChange}
            onProfileNameKanaChange={setProfileNameKana}
            onProfileBusinessNameChange={setProfileBusinessName}
            onProfileEmailChange={setProfileEmail}
            onProfilePhoneChange={setProfilePhone}
            onProfileLineWorksIdChange={setProfileLineWorksId}
            onProfileDepartmentChange={setProfileDepartment}
            onProfilePositionChange={setProfilePosition}
            onProfileResidenceChange={setProfileResidence}
            onProfileBioChange={setProfileBio}
            onSave={handleSaveProfile}
            isSaving={isSavingProfile}
          />
          
          {/* テンプレート管理 */}
          <TemplateManagement
            templates={templates}
            onAddTemplate={addTemplate}
            onUpdateTemplate={updateTemplate}
            onDeleteTemplate={deleteTemplate}
            isSaving={isSavingTemplate}
          />

          {/* 個人情報設定 */}
          <PersonalInfoSettings
            profileBirthDate={profileBirthDate}
            profileMaritalStatus={profileMaritalStatus}
            profileAnniversary={profileAnniversary}
            profileChildrenCount={profileChildrenCount}
            profileChild1Birthday={profileChild1Birthday}
            profileChild2Birthday={profileChild2Birthday}
            profileChild3Birthday={profileChild3Birthday}
            profileAddress={profileAddress}
            profilePostalCode={profilePostalCode}
            emergencyContactName={emergencyContactName}
            emergencyContactNameKana={emergencyContactNameKana}
            emergencyContactRelation={emergencyContactRelation}
            emergencyContactPhone={emergencyContactPhone}
            emergencyContactEmail={emergencyContactEmail}
            emergencyContactLineId={emergencyContactLineId}
            emergencyContactPostalCode={emergencyContactPostalCode}
            emergencyContactAddress={emergencyContactAddress}
            onProfileBirthDateChange={setProfileBirthDate}
            onProfileMaritalStatusChange={setProfileMaritalStatus}
            onProfileAnniversaryChange={setProfileAnniversary}
            onProfileChildrenCountChange={setProfileChildrenCount}
            onProfileChild1BirthdayChange={setProfileChild1Birthday}
            onProfileChild2BirthdayChange={setProfileChild2Birthday}
            onProfileChild3BirthdayChange={setProfileChild3Birthday}
            onProfileAddressChange={setProfileAddress}
            onProfilePostalCodeChange={setProfilePostalCode}
            onEmergencyContactNameChange={setEmergencyContactName}
            onEmergencyContactNameKanaChange={setEmergencyContactNameKana}
            onEmergencyContactRelationChange={setEmergencyContactRelation}
            onEmergencyContactPhoneChange={setEmergencyContactPhone}
            onEmergencyContactEmailChange={setEmergencyContactEmail}
            onEmergencyContactLineIdChange={setEmergencyContactLineId}
            onEmergencyContactPostalCodeChange={setEmergencyContactPostalCode}
            onEmergencyContactAddressChange={setEmergencyContactAddress}
            onSave={handleSavePersonalInfo}
            isSaving={isSavingPersonalInfo}
          />
          
          {/* 将来の機能 */}
          <FutureFeaturesSection />
        </div>
      </main>
    </div>
  );
};

export default Settings;