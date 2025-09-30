/*
  # 日報管理テーブルの作成

  1. New Tables
    - `daily_reports`
      - `id` (uuid, primary key) - 日報ID
      - `user_id` (uuid, foreign key) - ユーザーID（auth.usersテーブル参照）
      - `report_date` (date) - 日報対象日
      - `work_start_time` (time) - 勤務開始時間
      - `work_end_time` (time) - 勤務終了時間
      - `work_content` (text) - 業務内容
      - `business_results` (text) - 営業成果
      - `challenges` (text) - 課題・問題点
      - `report_notes` (text) - 備考・その他
      - `tomorrow_plan` (text) - 明日の予定
      - `calendar_events` (jsonb) - カレンダーイベント情報
      - `draft_status` (boolean) - 下書き状態（true: 下書き, false: 提出済み）
      - `submitted_at` (timestamptz) - 提出日時
      - `created_at` (timestamptz) - 作成日時
      - `updated_at` (timestamptz) - 更新日時
      - UNIQUE制約: (user_id, report_date) - 1ユーザー1日1件の日報

  2. Security
    - Enable RLS on `daily_reports` table
    - Add policy for users to read their own reports
    - Add policy for users to create their own reports
    - Add policy for users to update their own reports
    - Add policy for users to delete their own reports

  3. Indexes
    - Index on (user_id, report_date) for fast user-specific date queries
    - Index on submitted_at for submission time queries
    - Index on user_id for user-specific queries

  4. Functions
    - Trigger function to automatically update updated_at timestamp
*/

-- 日報テーブルの作成
CREATE TABLE IF NOT EXISTS daily_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  report_date DATE NOT NULL,
  work_start_time TIME,
  work_end_time TIME,
  work_content TEXT DEFAULT '',
  business_results TEXT DEFAULT '',
  challenges TEXT DEFAULT '',
  report_notes TEXT DEFAULT '',
  tomorrow_plan TEXT DEFAULT '',
  calendar_events JSONB DEFAULT '[]'::jsonb,
  draft_status BOOLEAN DEFAULT true,
  submitted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_user_report_date UNIQUE(user_id, report_date)
);

-- Row Level Security (RLS) を有効化
ALTER TABLE daily_reports ENABLE ROW LEVEL SECURITY;

-- RLSポリシーの作成
-- ユーザーは自分の日報のみ閲覧可能
CREATE POLICY "Users can read own daily reports"
  ON daily_reports
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- ユーザーは自分の日報のみ作成可能
CREATE POLICY "Users can create own daily reports"
  ON daily_reports
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- ユーザーは自分の日報のみ更新可能
CREATE POLICY "Users can update own daily reports"
  ON daily_reports
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ユーザーは自分の日報のみ削除可能
CREATE POLICY "Users can delete own daily reports"
  ON daily_reports
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- インデックスの作成
-- ユーザーIDと日付での高速検索用
CREATE INDEX IF NOT EXISTS idx_daily_reports_user_date 
  ON daily_reports(user_id, report_date);

-- 提出日時での検索用
CREATE INDEX IF NOT EXISTS idx_daily_reports_submitted_at 
  ON daily_reports(submitted_at) 
  WHERE submitted_at IS NOT NULL;

-- ユーザーIDでの検索用
CREATE INDEX IF NOT EXISTS idx_daily_reports_user_id 
  ON daily_reports(user_id);

-- 下書き状態での検索用
CREATE INDEX IF NOT EXISTS idx_daily_reports_draft_status 
  ON daily_reports(user_id, draft_status);

-- updated_at自動更新のトリガー関数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- updated_atトリガーの作成
DROP TRIGGER IF EXISTS update_daily_reports_updated_at ON daily_reports;
CREATE TRIGGER update_daily_reports_updated_at
  BEFORE UPDATE ON daily_reports
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();