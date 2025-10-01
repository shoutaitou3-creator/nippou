import { useState } from 'react';
import { FileText, Plus, Trash2, Edit2, Save, X } from 'lucide-react';
import { UserTemplate, ReportCategory } from '../../types/daily-report';

interface TemplateManagementProps {
  templates: UserTemplate[];
  onAddTemplate: (category: ReportCategory, text: string) => Promise<void>;
  onUpdateTemplate: (id: string, text: string) => Promise<void>;
  onDeleteTemplate: (id: string) => Promise<void>;
  isSaving: boolean;
}

const CATEGORY_LABELS: Record<ReportCategory, string> = {
  positive_reactions: 'お客様の良い反応',
  achievements: '達成できたこと',
  challenges_issues: '課題や問題点',
  lessons_learned: '次回に活かすこと',
  work_content: 'その他報告事項',
};

const TemplateManagement: React.FC<TemplateManagementProps> = ({
  templates,
  onAddTemplate,
  onUpdateTemplate,
  onDeleteTemplate,
  isSaving,
}) => {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newCategory, setNewCategory] = useState<ReportCategory>('positive_reactions');
  const [newText, setNewText] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  const handleAddTemplate = async () => {
    if (!newText.trim()) return;

    await onAddTemplate(newCategory, newText);
    setIsAddingNew(false);
    setNewText('');
    setNewCategory('positive_reactions');
  };

  const handleStartEdit = (template: UserTemplate) => {
    setEditingId(template.id);
    setEditText(template.template_content);
  };

  const handleSaveEdit = async () => {
    if (!editingId || !editText.trim()) return;

    await onUpdateTemplate(editingId, editText);
    setEditingId(null);
    setEditText('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const categorizedTemplates = templates.reduce((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = [];
    }
    acc[template.category].push(template);
    return acc;
  }, {} as Record<ReportCategory, UserTemplate[]>);

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FileText className="w-6 h-6 text-primary" />
          <div>
            <h2 className="text-xl font-semibold text-gray-800">定型文管理</h2>
            <p className="text-sm text-gray-600 mt-1">
              日報入力時に使用する定型文を管理できます
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsAddingNew(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          disabled={isAddingNew || isSaving}
        >
          <Plus className="w-4 h-4" />
          新規追加
        </button>
      </div>

      {/* 新規追加フォーム */}
      {isAddingNew && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border-2 border-primary/20">
          <h3 className="text-sm font-medium text-gray-700 mb-3">新しい定型文を追加</h3>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                カテゴリー
              </label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as ReportCategory)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary"
              >
                {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                定型文
              </label>
              <textarea
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                placeholder="定型文を入力してください..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setIsAddingNew(false);
                  setNewText('');
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                disabled={isSaving}
              >
                キャンセル
              </button>
              <button
                onClick={handleAddTemplate}
                disabled={!newText.trim() || isSaving}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                保存
              </button>
            </div>
          </div>
        </div>
      )}

      {/* カテゴリー別テンプレート一覧 */}
      {Object.keys(CATEGORY_LABELS).length > 0 ? (
        <div className="space-y-6">
          {(Object.keys(CATEGORY_LABELS) as ReportCategory[]).map((category) => {
            const categoryTemplates = categorizedTemplates[category] || [];

            return (
              <div key={category} className="border-b pb-6 last:border-b-0 last:pb-0">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  {CATEGORY_LABELS[category]}
                </h3>

                {categoryTemplates.length > 0 ? (
                  <div className="space-y-2">
                    {categoryTemplates.map((template) => (
                      <div
                        key={template.id}
                        className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        {editingId === template.id ? (
                          <div className="space-y-2">
                            <textarea
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none"
                            />
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={handleCancelEdit}
                                className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
                                disabled={isSaving}
                              >
                                <X className="w-4 h-4" />
                              </button>
                              <button
                                onClick={handleSaveEdit}
                                disabled={!editText.trim() || isSaving}
                                className="p-2 text-primary hover:text-primary/80 transition-colors disabled:opacity-50"
                              >
                                <Save className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex justify-between items-start gap-3">
                            <p className="text-gray-700 flex-1 whitespace-pre-wrap">
                              {template.template_content}
                            </p>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleStartEdit(template)}
                                className="p-2 text-gray-600 hover:text-primary transition-colors"
                                disabled={isSaving}
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => onDeleteTemplate(template.id)}
                                className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                                disabled={isSaving}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">
                    このカテゴリーにはまだ定型文がありません
                  </p>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">定型文がまだ登録されていません</p>
          <p className="text-sm text-gray-400 mt-1">
            右上の「新規追加」ボタンから定型文を追加できます
          </p>
        </div>
      )}
    </div>
  );
};

export default TemplateManagement;
