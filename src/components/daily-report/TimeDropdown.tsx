import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { displayTime } from '../../utils/timeUtils';

interface TimeDropdownProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const TimeDropdown: React.FC<TimeDropdownProps> = ({ value, onChange, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // 時間選択肢を生成（15分単位、24時間対応） - メモ化して再計算を防ぐ
  const timeOptions = React.useMemo(() => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        options.push(timeString);
      }
    }
    return options;
  }, []);

  // ドロップダウンを開いたときに選択値を中央に配置
  useEffect(() => {
    if (isOpen && listRef.current) {
      // 現在の値を正規化してからインデックスを検索
      const normalizedValue = displayTime(value);
      const currentIndex = timeOptions.findIndex(option => option === normalizedValue);
      
      console.log('=== TimeDropdown スクロール位置計算 ===');
      console.log('現在の値:', value);
      console.log('正規化された値:', normalizedValue);
      console.log('見つかったインデックス:', currentIndex);
      
      if (currentIndex !== -1) {
        // スクロール位置の計算
        const itemHeight = 40; // 各アイテムの高さ（px）
        const containerHeight = 280; // コンテナの高さ（px）
        const visibleItems = Math.floor(containerHeight / itemHeight); // 表示可能なアイテム数
        const centerPosition = Math.floor(visibleItems / 2); // 中央位置
        
        // 選択されたアイテムが中央に来るようにスクロール位置を計算
        const scrollTop = Math.max(0, (currentIndex - centerPosition) * itemHeight);
        
        console.log('アイテム高さ:', itemHeight);
        console.log('表示可能アイテム数:', visibleItems);
        console.log('中央位置:', centerPosition);
        console.log('計算されたスクロール位置:', scrollTop);
        
        // DOM更新後にスクロールを実行
        const timeoutId = setTimeout(() => {
          if (listRef.current) {
            listRef.current.scrollTop = scrollTop;
            console.log('スクロール実行完了:', listRef.current.scrollTop);
          }
        }, 10); // 10msの遅延でDOM更新を待つ
        
        return () => clearTimeout(timeoutId);
      } else {
        console.warn('選択された時間がオプションリストに見つかりません:', normalizedValue);
      }
    }
  }, [isOpen, value, timeOptions]); // 依存配列を明確に指定

  // 外部クリックでドロップダウンを閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (selectedValue: string) => {
    console.log('時間選択:', selectedValue);
    onChange(selectedValue);
    setIsOpen(false);
  };
  
  const handleToggle = () => {
    console.log('ドロップダウン切り替え:', !isOpen, '現在の値:', value);
    setIsOpen(!isOpen);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={handleToggle}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent bg-white text-left flex items-center justify-between hover:border-gray-400 transition-colors"
      >
        <span className="text-gray-900">{displayTime(value)}</span>
        <ChevronDown 
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {isOpen && (
        <div 
          className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg"
          style={{ height: '280px' }}
        >
          <div
            ref={listRef}
            className="overflow-y-auto h-full scroll-smooth"
          >
            {timeOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => handleSelect(option)}
                className={`
                  w-full text-left px-3 transition-colors h-10 flex items-center border-b border-gray-100 last:border-b-0
                  ${option === displayTime(value)
                    ? 'bg-accent text-white hover:bg-accent/90' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                  }
                `}
              >
                {displayTime(option)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeDropdown;