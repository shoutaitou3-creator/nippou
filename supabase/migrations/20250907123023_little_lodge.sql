/*
  # 翌勤務日設定テーブルの作成

  1. 新しいテーブル
    - `next_day_settings`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `work_date` (date, 勤務予定日)
      - `start_time` (time, 勤務開始時間)
      - `end_time` (time, 勤務終了時間)
      - `notes` (text, 特記事項)
      - `calendar_events` (jsonb, カレンダーイベント)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. セキュリティ
    - RLSを有効化
    - ユーザーは自分のデータのみアクセス可能
*/

CREATE TABLE IF NOT EXISTS next_day_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  work_date date NOT NULL,
  start_time time DEFAULT '09:00',
  end_time time DEFAULT '18:00',
  notes text DEFAULT '',
  calendar_events jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- RLSを有効化
ALTER TABLE next_day_settings ENABLE ROW LEVEL SECURITY;

-- ポリシーの作成
CREATE POLICY "Users can read own next day settings"
  ON next_day_settings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own next day settings"
  ON next_day_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own next day settings"
  ON next_day_settings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own next day settings"
  ON next_day_settings
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- インデックスの作成
CREATE INDEX IF NOT EXISTS idx_next_day_settings_user_date 
  ON next_day_settings (user_id, work_date);

-- 更新日時の自動更新トリガー
CREATE OR REPLACE FUNCTION update_next_day_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_next_day_settings_updated_at
  BEFORE UPDATE ON next_day_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_next_day_settings_updated_at();

-- ユーザーごと・日付ごとの一意制約
ALTER TABLE next_day_settings 
ADD CONSTRAINT unique_user_work_date 
UNIQUE (user_id, work_date);