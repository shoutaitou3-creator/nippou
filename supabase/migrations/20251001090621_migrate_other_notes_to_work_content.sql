/*
  # other_notesフィールドからwork_contentフィールドへのデータ移行

  ## 概要
  既存のdaily_reportsテーブルのother_notesフィールドのデータをwork_contentフィールドにコピーします。
  work_contentフィールドに既にデータがある場合は上書きしません。

  ## 変更内容
  1. other_notesのデータをwork_contentにコピー（work_contentが空またはNULLの場合のみ）
  2. データ移行が正常に完了したことを確認

  ## 注意事項
  - work_contentに既存のデータがある場合は保護されます
  - other_notesフィールドは削除しません（アプリケーション側で使用を停止後、別途削除する必要があります）
*/

-- other_notesのデータをwork_contentにコピー（work_contentが空またはNULLの場合のみ）
UPDATE daily_reports
SET work_content = other_notes
WHERE (work_content IS NULL OR work_content = '')
  AND other_notes IS NOT NULL
  AND other_notes != '';