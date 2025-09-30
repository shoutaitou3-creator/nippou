// Google Calendar APIのイベント型定義
export interface CalendarEvent {
  id: string;
  summary: string;
  start: {
    dateTime?: string;
    date?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
  };
  location?: string;
  description?: string;
  attendees?: Array<{
    email: string;
    responseStatus: 'needsAction' | 'declined' | 'tentative' | 'accepted';
    self?: boolean;
  }>;
}

export interface CalendarApiResponse {
  items: CalendarEvent[];
}