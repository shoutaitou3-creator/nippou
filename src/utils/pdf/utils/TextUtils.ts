/**
 * PDF用テキストユーティリティクラス
 */
export class TextUtils {
  /**
   * 日本語テキストを英語表記に変換
   */
  static convertJapaneseToEnglish(text: string): string {
    // 基本的な日本語単語を英語に変換
    const translations: { [key: string]: string } = {
      // 一般的な単語
      '会議': 'Meeting',
      'ミーティング': 'Meeting',
      '打ち合わせ': 'Meeting',
      '商談': 'Business Meeting',
      '営業': 'Sales',
      '資料作成': 'Document Creation',
      '資料確認': 'Document Review',
      '研修': 'Training',
      'オンライン研修': 'Online Training',
      '臨店講習': 'Store Training',
      '移動': 'Travel',
      '休憩': 'Break',
      '昼休み': 'Lunch Break',
      '面接': 'Interview',
      '採用': 'Recruitment',
      
      // 時間関連
      '時間': 'hours',
      '分': 'minutes',
      '午前': 'AM',
      '午後': 'PM',
      
      // 曜日
      '月曜日': 'Monday',
      '火曜日': 'Tuesday',
      '水曜日': 'Wednesday',
      '木曜日': 'Thursday',
      '金曜日': 'Friday',
      '土曜日': 'Saturday',
      '日曜日': 'Sunday',
      
      // 月
      '1月': 'January',
      '2月': 'February',
      '3月': 'March',
      '4月': 'April',
      '5月': 'May',
      '6月': 'June',
      '7月': 'July',
      '8月': 'August',
      '9月': 'September',
      '10月': 'October',
      '11月': 'November',
      '12月': 'December',
      
      // その他
      '株式会社': 'Co., Ltd.',
      '有限会社': 'Ltd.',
      '部長': 'Manager',
      '課長': 'Section Chief',
      '主任': 'Supervisor',
      '係長': 'Subsection Chief',
      
      // 業務関連
      'お客様': 'Customer',
      'クライアント': 'Client',
      'プロジェクト': 'Project',
      'タスク': 'Task',
      '業務': 'Work',
      '作業': 'Task',
      '完了': 'Completed',
      '進行中': 'In Progress',
      '予定': 'Schedule',
      '計画': 'Plan',
      '報告': 'Report',
      '確認': 'Confirmation',
      '検討': 'Review',
      '対応': 'Response',
      '準備': 'Preparation',
      '実施': 'Implementation',
      '参加': 'Participation',
      '出席': 'Attendance'
    };

    let result = text;
    
    // 単語単位での置換
    Object.entries(translations).forEach(([japanese, english]) => {
      const regex = new RegExp(japanese, 'g');
      result = result.replace(regex, english);
    });

    // 残った日本語文字を処理
    result = result
      // ひらがなを[Hiragana]に置換
      .replace(/[あ-ん]/g, '[Hiragana]')
      // カタカナを[Katakana]に置換
      .replace(/[ア-ン]/g, '[Katakana]')
      // 漢字を[Kanji]に置換
      .replace(/[一-龯]/g, '[Kanji]')
      // 句読点を英語式に変換
      .replace(/。/g, '.')
      .replace(/、/g, ', ')
      .replace(/：/g, ': ')
      .replace(/；/g, '; ')
      .replace(/？/g, '?')
      .replace(/！/g, '!')
      // 括弧を英語式に変換
      .replace(/「/g, '"')
      .replace(/」/g, '"')
      .replace(/（/g, '(')
      .replace(/）/g, ')')
      // その他の記号
      .replace(/・/g, '• ')
      .replace(/〜/g, '~')
      .replace(/ー/g, '-');

    return result;
  }

  /**
   * テキストを指定文字数で折り返し
   */
  static wrapText(text: string, maxLength: number): string[] {
    const lines: string[] = [];
    const paragraphs = text.split('\n');
    
    paragraphs.forEach(paragraph => {
      if (paragraph.length <= maxLength) {
        lines.push(paragraph);
      } else {
        let currentLine = '';
        const words = paragraph.split(' ');
        
        words.forEach(word => {
          if ((currentLine + word).length <= maxLength) {
            currentLine += (currentLine ? ' ' : '') + word;
          } else {
            if (currentLine) lines.push(currentLine);
            currentLine = word;
          }
        });
        
        if (currentLine) {
          lines.push(currentLine);
        }
      }
    });
    
    return lines;
  }

  /**
   * 時間フォーマット（HH:MM形式）
   */
  static formatTime(timeString: string): string {
    return timeString.substring(0, 5);
  }
}