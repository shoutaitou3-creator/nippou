import React from 'react';
import { FileText } from 'lucide-react';
import { ReportCategory, UserTemplate, ReportField } from '../../types/daily-report';
import ReportFieldSection from './ReportFieldSection';

interface ReportSectionNewProps {
  reportFields: {
    positive_reactions: string;
    achievements: string;
    challenges_issues: string;
    lessons_learned: string;
    other_notes: string;
  };
  onFieldChange: (field: ReportCategory, value: string) => void;
  templates: UserTemplate[];
  isReadOnly?: boolean;
}

const REPORT_FIELDS: ReportField[] = [
  {
    key: 'positive_reactions',
    label: 'お客様の良い反応',
    placeholder: 'お客様からの好意的な反応や評価を記入してください...',
  },
  {
    key: 'achievements',
    label: '達成できたこと',
    placeholder: '本日達成した目標や成果を記入してください...',
  },
  {
    key: 'challenges_issues',
    label: '課題や問題点',
    placeholder: '発生した課題や問題点を記入してください...',
  },
  {
    key: 'lessons_learned',
    label: '次回に活かすこと',
    placeholder: '今回の経験から学んだことや次回に活かせることを記入してください...',
  },
  {
    key: 'other_notes',
    label: 'その他報告事項',
    placeholder: 'その他の報告事項があれば記入してください...',
  },
];

const ReportSectionNew: React.FC<ReportSectionNewProps> = ({
  reportFields,
  onFieldChange,
  templates,
  isReadOnly = false,
}) => {
  const totalCharacters = Object.values(reportFields).reduce(
    (sum, value) => sum + value.length,
    0
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 lg:p-6">
      <div className="flex items-center gap-3 mb-6">
        <FileText className="w-6 h-6 text-accent" />
        <h2 className="text-lg lg:text-xl font-semibold text-gray-800">報告事項</h2>
      </div>

      <div className="space-y-4">
        {REPORT_FIELDS.map((field) => (
          <ReportFieldSection
            key={field.key}
            label={field.label}
            value={reportFields[field.key]}
            onChange={(value) => onFieldChange(field.key, value)}
            category={field.key}
            templates={templates}
            isReadOnly={isReadOnly}
            placeholder={field.placeholder}
          />
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600">合計文字数</p>
          <p className="text-sm font-medium text-gray-800">{totalCharacters}文字</p>
        </div>
      </div>
    </div>
  );
};

export default ReportSectionNew;
