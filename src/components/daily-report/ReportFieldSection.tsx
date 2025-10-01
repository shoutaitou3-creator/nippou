import React, { useState, useRef, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { ReportCategory, UserTemplate } from '../../types/daily-report';

interface ReportFieldSectionProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  category: ReportCategory;
  templates: UserTemplate[];
  isReadOnly?: boolean;
  placeholder?: string;
}

const ReportFieldSection: React.FC<ReportFieldSectionProps> = ({
  label,
  value,
  onChange,
  category,
  templates,
  isReadOnly = false,
  placeholder = '',
}) => {
  const [showTemplates, setShowTemplates] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const categoryTemplates = templates.filter((t) => t.category === category);

  const handleTemplateInsert = (templateContent: string) => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      const before = value.substring(0, start);
      const after = value.substring(end);
      const newContent = before + templateContent + after;
      onChange(newContent);

      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd =
            start + templateContent.length;
          textareaRef.current.focus();
        }
      }, 0);
    } else {
      const newContent = value + (value.endsWith('\n') || value === '' ? '' : '\n') + templateContent;
      onChange(newContent);
    }
    setShowTemplates(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowTemplates(false);
      }
    };

    if (showTemplates) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showTemplates]);

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        {!isReadOnly && categoryTemplates.length > 0 && (
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setShowTemplates(!showTemplates)}
              className="text-xs text-accent hover:text-accent/80 transition-colors flex items-center gap-1 px-2 py-1 rounded hover:bg-accent/10"
            >
              <Plus className="w-3 h-3" />
              定型文
            </button>

            {showTemplates && (
              <div className="absolute right-0 top-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 min-w-[200px] max-h-[300px] overflow-y-auto">
                {categoryTemplates.map((template) => (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => handleTemplateInsert(template.template_content)}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors first:rounded-t-lg last:rounded-b-lg"
                  >
                    <div className="font-medium">{template.template_name}</div>
                    <div className="text-xs text-gray-500 truncate">
                      {template.template_content.substring(0, 50)}
                      {template.template_content.length > 50 ? '...' : ''}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={isReadOnly}
        placeholder={placeholder}
        rows={4}
        className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent resize-none ${
          isReadOnly ? 'bg-gray-50 text-gray-500' : ''
        }`}
      />

      <div className="flex justify-end mt-1">
        <p className="text-xs text-gray-500">{value.length}文字</p>
      </div>
    </div>
  );
};

export default ReportFieldSection;
