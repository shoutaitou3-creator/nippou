import React from 'react';
import { Calendar } from 'lucide-react';

interface PageHeaderProps {
  hasExistingSettings: boolean;
}

const PageHeader: React.FC<PageHeaderProps> = ({ hasExistingSettings }) => {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-4">
        <Calendar className="w-8 h-8 text-accent" />
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              翌勤務日設定
            </h1>
            {hasExistingSettings && (
              <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full border border-green-200">
                設定済み
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;