import React from 'react';
import { Clock } from 'lucide-react';
import { formatJSTDateForDisplay } from '../../utils/dateUtils';

interface WorkTimeHeaderProps {
  error: string | null;
}

const WorkTimeHeader: React.FC<WorkTimeHeaderProps> = ({ error }) => {
  return (
    <>
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Clock className="w-8 h-8 text-primary" />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            {formatJSTDateForDisplay(new Date())}の日報
          </h1>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{error}</p>
        </div>
      )}
    </>
  );
};

export default WorkTimeHeader;