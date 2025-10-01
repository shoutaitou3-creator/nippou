/*
  # 報告事項の5項目分割とテンプレート管理機能の追加

  ## 1. daily_reportsテーブルの構造変更

    ### 新しいカラムの追加:
    - `positive_reactions` (text) - お客様の良い反応
    - `achievements` (text) - 達成できたこと
    - `challenges_issues` (text) - 課題や問題点
    - `lessons_learned` (text) - 次回に活かすこと
    - `other_notes` (text) - その他報告事項

    ### データ移行:
    - 既存の`work_content`データを`other_notes`に自動コピー
    - 移行完了後に`work_content`カラムを削除
    - NULL値や空白値も適切に処理

  ## 2. user_templatesテーブルの新規作成

    ユーザーごとのカスタムテンプレート管理用テーブル

    ### カラム:
    - `id` (uuid, primary key) - テンプレートID
    - `user_id` (uuid, foreign key) - ユーザーID
    - `category` (text) - 報告項目の種類
    - `template_name` (text) - テンプレート名
    - `template_content` (text) - テンプレート内容
    - `display_order` (integer) - 表示順序
    - `created_at` (timestamptz) - 作成日時
    - `updated_at` (timestamptz) - 更新日時

    ### カテゴリの種類:
    - positive_reactions: お客様の良い反応
    - achievements: 達成できたこと
    - challenges_issues: 課題や問題点
    - lessons_learned: 次回に活かすこと
    - other_notes: その他報告事項

  ## 3. セキュリティ
    - RLSを有効化
    - ユーザーは自分のテンプレートのみアクセス可能
    - 適切なインデックスを設定してクエリパフォーマンスを最適化

  ## 4. 重要な注意事項
    - 既存データは安全に保持されます
    - データ移行は自動的に実行されます
    - work_contentカラムは移行完了後に削除されます
*/

-- ステップ1: daily_reportsテーブルに新しいカラムを追加
DO $$
BEGIN
  -- positive_reactions カラムの追加
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'daily_reports' AND column_name = 'positive_reactions'
  ) THEN
    ALTER TABLE daily_reports ADD COLUMN positive_reactions TEXT DEFAULT '';
  END IF;

  -- achievements カラムの追加
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'daily_reports' AND column_name = 'achievements'
  ) THEN
    ALTER TABLE daily_reports ADD COLUMN achievements TEXT DEFAULT '';
  END IF;

  -- challenges_issues カラムの追加
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'daily_reports' AND column_name = 'challenges_issues'
  ) THEN
    ALTER TABLE daily_reports ADD COLUMN challenges_issues TEXT DEFAULT '';
  END IF;

  -- lessons_learned カラムの追加
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'daily_reports' AND column_name = 'lessons_learned'
  ) THEN
    ALTER TABLE daily_reports ADD COLUMN lessons_learned TEXT DEFAULT '';
  END IF;

  -- other_notes カラムの追加
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'daily_reports' AND column_name = 'other_notes'
  ) THEN
    ALTER TABLE daily_reports ADD COLUMN other_notes TEXT DEFAULT '';
  END IF;
END $$;

-- ステップ2: 既存のwork_contentデータをother_notesに移行
DO $$
DECLARE
  migration_count INTEGER;
BEGIN
  -- work_contentの内容をother_notesにコピー
  UPDATE daily_reports
  SET other_notes = COALESCE(work_content, '')
  WHERE work_content IS NOT NULL AND work_content != '';

  -- 移行されたレコード数を取得
  GET DIAGNOSTICS migration_count = ROW_COUNT;

  -- ログ出力（マイグレーション実行時にコンソールに表示）
  RAISE NOTICE 'Data migration completed: % records migrated from work_content to other_notes', migration_count;
END $$;

-- ステップ3: work_contentカラムを削除（データ移行後）
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'daily_reports' AND column_name = 'work_content'
  ) THEN
    ALTER TABLE daily_reports DROP COLUMN work_content;
    RAISE NOTICE 'work_content column has been successfully removed';
  END IF;
END $$;

-- ステップ4: user_templatesテーブルの作成
CREATE TABLE IF NOT EXISTS user_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  category TEXT NOT NULL CHECK (category IN (
    'positive_reactions',
    'achievements',
    'challenges_issues',
    'lessons_learned',
    'other_notes'
  )),
  template_name TEXT NOT NULL,
  template_content TEXT NOT NULL DEFAULT '',
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ステップ5: user_templatesテーブルのRLS設定
ALTER TABLE user_templates ENABLE ROW LEVEL SECURITY;

-- ユーザーは自分のテンプレートのみ閲覧可能
DROP POLICY IF EXISTS "Users can read own templates" ON user_templates;
CREATE POLICY "Users can read own templates"
  ON user_templates
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- ユーザーは自分のテンプレートのみ作成可能
DROP POLICY IF EXISTS "Users can create own templates" ON user_templates;
CREATE POLICY "Users can create own templates"
  ON user_templates
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- ユーザーは自分のテンプレートのみ更新可能
DROP POLICY IF EXISTS "Users can update own templates" ON user_templates;
CREATE POLICY "Users can update own templates"
  ON user_templates
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ユーザーは自分のテンプレートのみ削除可能
DROP POLICY IF EXISTS "Users can delete own templates" ON user_templates;
CREATE POLICY "Users can delete own templates"
  ON user_templates
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ステップ6: インデックスの作成
-- user_templatesテーブルのインデックス
CREATE INDEX IF NOT EXISTS idx_user_templates_user_category
  ON user_templates(user_id, category);

CREATE INDEX IF NOT EXISTS idx_user_templates_user_order
  ON user_templates(user_id, display_order);

-- ステップ7: updated_at自動更新トリガー
CREATE OR REPLACE FUNCTION update_user_templates_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_user_templates_updated_at ON user_templates;
CREATE TRIGGER update_user_templates_updated_at
  BEFORE UPDATE ON user_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_user_templates_updated_at();

-- ステップ8: デフォルトテンプレートの挿入（全ユーザー向け）
-- 注意: この部分は各ユーザーが初回ログイン時にアプリケーション側で実行されるため、
-- ここでは実行しません。テーブル構造のみを準備します。
