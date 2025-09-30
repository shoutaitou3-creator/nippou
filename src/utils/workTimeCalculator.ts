// 業務時間計算ユーティリティ

export interface InternalCalendarEvent {
  id: string;
  startTime: string;
  endTime: string;
  title: string;
  description: string;
  location: string;
  participants: string;
}

export interface WorkTimeBreakdown {
  meeting: number;      // 会議
  sales: number;        // 商談
  document: number;     // 資料作成
  onlineTraining: number; // オンライン講習
  storeTraining: number;  // 臨店講習
  recruitment: number;    // 採用
  travel: number;         // 移動
  break: number;          // 休憩
  other: number;          // その他
  idle: number;           // 空白時間
  totalWork: number;      // 実働時間（休憩除く）
  totalScheduled: number; // 予定総時間
}

// 業務分類キーワード定義
const WORK_CATEGORIES = {
  meeting: ['会議', 'ミーティング', '打ち合わせ', '打合せ', 'MTG'],
  sales: ['商談', '事業説明', '営業', '提案'],
  document: ['資料作成', '資料確認', '資料準備', 'ドキュメント作成', '書類作成', '報告書'],
  onlineTraining: ['オンライン研修', 'オンライン講習', 'オンライン体験会', 'Web研修', 'Web講習'],
  storeTraining: ['臨店講習', '臨店体験会', '店舗研修', '現地研修'],
  recruitment: ['面接', '採用', '人事面談', '採用面接'],
  travel: ['移動', '出張', '訪問'],
  break: ['休憩', '昼休み', '昼食', 'ランチ', '食事'],
  idle: [] // 空白時間は特定のキーワードではなく、計算によって決まる
};

// タイムスライス（時間間隔）の型定義
interface TimeSlice {
  startMinutes: number;
  endMinutes: number;
  events: InternalCalendarEvent[];
}

/**
 * 時間文字列（HH:MM）を分数に変換
 */
export const timeToMinutes = (timeString: string): number => {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
};

/**
 * 分数を時間文字列（X時間Y分）に変換
 */
export const minutesToTimeString = (minutes: number): string => {
  // 四捨五入処理を適用（按分による小数点以下を処理）
  const roundedMinutes = Math.round(minutes);
  
  if (roundedMinutes === 0) return '0分';
  
  const hours = Math.floor(roundedMinutes / 60);
  const remainingMinutes = roundedMinutes % 60;
  
  if (hours === 0) {
    return `${remainingMinutes}分`;
  } else if (remainingMinutes === 0) {
    return `${hours}時間`;
  } else {
    return `${hours}時間${remainingMinutes}分`;
  }
};

/**
 * イベントタイトルから業務分類を判定
 */
export const categorizeEvent = (title: string): keyof typeof WORK_CATEGORIES | 'other' => {
  const lowerTitle = title.toLowerCase();
  
  for (const [category, keywords] of Object.entries(WORK_CATEGORIES)) {
    if (keywords.some(keyword => title.includes(keyword))) {
      return category as keyof typeof WORK_CATEGORIES;
    }
  }
  
  return 'other';
};

/**
 * 単一イベントの時間を計算（分単位）
 */
export const calculateEventDuration = (event: InternalCalendarEvent): number => {
  const startMinutes = timeToMinutes(event.startTime);
  const endMinutes = timeToMinutes(event.endTime);
  
  // 終了時間が開始時間より前の場合（日をまたぐ場合）の処理
  if (endMinutes < startMinutes) {
    return (24 * 60) - startMinutes + endMinutes;
  }
  
  return endMinutes - startMinutes;
};

/**
 * カレンダーイベントから業務時間を計算
 */
export const calculateWorkTime = (events: InternalCalendarEvent[], workStartTime: string, workEndTime: string): WorkTimeBreakdown => {
  // 引数の安全性チェック
  const safeWorkStartTime = workStartTime || '09:00';
  const safeWorkEndTime = workEndTime || '18:00';
  
  const breakdown: WorkTimeBreakdown = {
    meeting: 0,
    sales: 0,
    document: 0,
    onlineTraining: 0,
    storeTraining: 0,
    recruitment: 0,
    travel: 0,
    break: 0,
    other: 0,
    idle: 0,
    totalWork: 0,
    totalScheduled: 0
  };

  // 勤務開始・終了時間を分数に変換
  const workStartMinutes = timeToMinutes(safeWorkStartTime);
  const workEndMinutes = timeToMinutes(safeWorkEndTime);
  const totalWorkMinutes = workEndMinutes - workStartMinutes;

  if (totalWorkMinutes <= 0) {
    return breakdown;
  }

  // 勤務時間内のイベントのみをフィルタリング
  const workTimeEvents = events.filter(event => {
    const eventStartMinutes = timeToMinutes(event.startTime);
    const eventEndMinutes = timeToMinutes(event.endTime);
    
    // イベントが勤務時間と重複している場合のみ含める
    return eventStartMinutes < workEndMinutes && eventEndMinutes > workStartMinutes;
  }).map(event => {
    // イベントの時間を勤務時間内に調整
    const eventStartMinutes = Math.max(timeToMinutes(event.startTime), workStartMinutes);
    const eventEndMinutes = Math.min(timeToMinutes(event.endTime), workEndMinutes);
    
    return {
      ...event,
      startTime: `${Math.floor(eventStartMinutes / 60).toString().padStart(2, '0')}:${(eventStartMinutes % 60).toString().padStart(2, '0')}`,
      endTime: `${Math.floor(eventEndMinutes / 60).toString().padStart(2, '0')}:${(eventEndMinutes % 60).toString().padStart(2, '0')}`
    };
  });

  // タイムスライスを作成
  const timeSlices = createTimeSlices(workStartMinutes, workEndMinutes, workTimeEvents);

  // 各タイムスライスの時間を業務分類に配分
  timeSlices.forEach(slice => {
    const sliceDuration = slice.endMinutes - slice.startMinutes;
    
    // 休憩イベントがあるかチェック
    const breakEvents = slice.events.filter(event => categorizeEvent(event.title) === 'break');
    
    if (breakEvents.length > 0) {
      // 休憩時間が含まれている場合、そのスライスの全時間を休憩として計上
      breakdown.break += sliceDuration;
    } else if (slice.events.length === 0) {
      // 空白時間
      breakdown.idle += sliceDuration;
    } else {
      // 休憩イベントがなく、他のイベントがある場合
      // 休憩以外のイベントのみを対象とする
      const nonBreakEvents = slice.events.filter(event => categorizeEvent(event.title) !== 'break');
      
      if (nonBreakEvents.length > 0) {
        // 時間を重複しているイベントの数で按分
        const timePerEvent = sliceDuration / nonBreakEvents.length;
        
        nonBreakEvents.forEach(event => {
          const category = categorizeEvent(event.title);
          if (category in breakdown) {
            breakdown[category as keyof WorkTimeBreakdown] += timePerEvent;
          }
        });
      } else {
        // 休憩以外のイベントがない場合は空白時間
        breakdown.idle += sliceDuration;
      }
    }
  }
  );

  // 総時間の計算
  breakdown.totalScheduled = breakdown.meeting + breakdown.sales + breakdown.document + 
                            breakdown.onlineTraining + breakdown.storeTraining + 
                            breakdown.recruitment + breakdown.travel + breakdown.other + 
                            breakdown.break + breakdown.idle;
  
  breakdown.totalWork = breakdown.totalScheduled - breakdown.break;

  return breakdown;
}

/**
 * タイムスライスを作成する関数
 */
function createTimeSlices(workStartMinutes: number, workEndMinutes: number, events: InternalCalendarEvent[]): TimeSlice[] {
  // すべての時間ポイントを収集
  const timePoints = new Set<number>();
  timePoints.add(workStartMinutes);
  timePoints.add(workEndMinutes);
  
  events.forEach(event => {
    const startMinutes = timeToMinutes(event.startTime);
    const endMinutes = timeToMinutes(event.endTime);
    timePoints.add(startMinutes);
    timePoints.add(endMinutes);
  });
  
  // 時間ポイントをソート
  const sortedTimePoints = Array.from(timePoints).sort((a, b) => a - b);
  
  // タイムスライスを作成
  const timeSlices: TimeSlice[] = [];
  
  for (let i = 0; i < sortedTimePoints.length - 1; i++) {
    const sliceStart = sortedTimePoints[i];
    const sliceEnd = sortedTimePoints[i + 1];
    
    // このタイムスライスをカバーするイベントを特定
    const coveringEvents = events.filter(event => {
      const eventStart = timeToMinutes(event.startTime);
      const eventEnd = timeToMinutes(event.endTime);
      return eventStart <= sliceStart && eventEnd >= sliceEnd;
    });
    
    timeSlices.push({
      startMinutes: sliceStart,
      endMinutes: sliceEnd,
      events: coveringEvents
    });
  }
  
  return timeSlices;
}

/**
 * 業務分類の日本語名を取得
 */
export const getCategoryDisplayName = (category: keyof WorkTimeBreakdown): string => {
  const displayNames: Record<keyof WorkTimeBreakdown, string> = {
    meeting: '会議・打ち合わせ',
    sales: '商談・営業',
    document: '資料作成',
    onlineTraining: 'オンライン講習',
    storeTraining: '臨店講習',
    recruitment: '採用・面接',
    travel: '移動',
    break: '休憩',
    other: 'その他業務',
    idle: '空白時間',
    totalWork: '実働時間',
    totalScheduled: '予定総時間'
  };
  
  return displayNames[category];
};

/**
 * 業務時間の詳細分析を取得
 */
export const getWorkTimeAnalysis = (breakdown: WorkTimeBreakdown) => {
  const categories = [
    { key: 'meeting' as const, time: breakdown.meeting },
    { key: 'sales' as const, time: breakdown.sales },
    { key: 'document' as const, time: breakdown.document },
    { key: 'onlineTraining' as const, time: breakdown.onlineTraining },
    { key: 'storeTraining' as const, time: breakdown.storeTraining },
    { key: 'recruitment' as const, time: breakdown.recruitment },
    { key: 'travel' as const, time: breakdown.travel },
    { key: 'other' as const, time: breakdown.other },
    { key: 'idle' as const, time: breakdown.idle }
  ].filter(category => category.time > 0)
   .sort((a, b) => b.time - a.time);

  return {
    categories,
    hasBreak: breakdown.break > 0,
    breakTime: breakdown.break,
    totalWork: breakdown.totalWork,
    totalScheduled: breakdown.totalScheduled
  };
};