import React from 'react';
import EventEditModal from '../EventEditModal';
import AddEventModal from '../AddEventModal';
import { InternalCalendarEvent } from '../../types/daily-report';

interface EventModalManagerProps {
  calendarEvents: InternalCalendarEvent[];
  onCalendarEventsChange: (events: InternalCalendarEvent[]) => void;
}

export const EventModalManager: React.FC<EventModalManagerProps> = ({
  calendarEvents,
  onCalendarEventsChange
}) => {
  const [editingEvent, setEditingEvent] = React.useState<InternalCalendarEvent | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);

  // 予定編集モーダルを開く
  const openEditModal = React.useCallback((event: InternalCalendarEvent) => {
    setEditingEvent({ ...event });
    setIsEditModalOpen(true);
  }, []);

  // 予定編集モーダルを閉じる
  const closeEditModal = React.useCallback(() => {
    setEditingEvent(null);
    setIsEditModalOpen(false);
  }, []);

  // 予定追加モーダルを開く
  const openAddModal = React.useCallback(() => {
    setIsAddModalOpen(true);
  }, []);

  // 予定追加モーダルを閉じる
  const closeAddModal = React.useCallback(() => {
    setIsAddModalOpen(false);
  }, []);

  // 予定の変更を保存
  const saveEventChanges = React.useCallback((updatedEvent: InternalCalendarEvent) => {
    const updatedEvents = calendarEvents.map(event => 
      event.id === updatedEvent.id ? updatedEvent : event
    );
    onCalendarEventsChange(updatedEvents);
    closeEditModal();
  }, [calendarEvents, onCalendarEventsChange, closeEditModal]);

  // 新しい予定を追加
  const addNewEvent = React.useCallback((eventData: Omit<InternalCalendarEvent, 'id'>) => {
    const newEvent: InternalCalendarEvent = {
      id: Date.now().toString(),
      ...eventData
    };
    const updatedEvents = [...calendarEvents, newEvent];
    onCalendarEventsChange(updatedEvents);
    closeAddModal();
  }, [calendarEvents, onCalendarEventsChange, closeAddModal]);

  // 予定を削除
  const removeEvent = React.useCallback((eventId: string) => {
    const updatedEvents = calendarEvents.filter(event => event.id !== eventId);
    onCalendarEventsChange(updatedEvents);
    closeEditModal();
  }, [calendarEvents, onCalendarEventsChange, closeEditModal]);

  return (
    <>
      {/* 予定編集モーダル */}
      <EventEditModal
        isOpen={isEditModalOpen}
        event={editingEvent}
        onClose={closeEditModal}
        onSave={saveEventChanges}
        onDelete={removeEvent}
      />

      {/* 予定追加モーダル */}
      <AddEventModal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        onSave={addNewEvent}
      />
    </>
  );
};

// カスタムフック版
export const useEventModalManager = (
  calendarEvents: InternalCalendarEvent[],
  onCalendarEventsChange: (events: InternalCalendarEvent[]) => void
) => {
  const [editingEvent, setEditingEvent] = React.useState<InternalCalendarEvent | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);

  // 予定編集モーダルを開く
  const openEditModal = React.useCallback((event: InternalCalendarEvent) => {
    setEditingEvent({ ...event });
    setIsEditModalOpen(true);
  }, []);

  // 予定編集モーダルを閉じる
  const closeEditModal = React.useCallback(() => {
    setEditingEvent(null);
    setIsEditModalOpen(false);
  }, []);

  // 予定追加モーダルを開く
  const openAddModal = React.useCallback(() => {
    setIsAddModalOpen(true);
  }, []);

  // 予定追加モーダルを閉じる
  const closeAddModal = React.useCallback(() => {
    setIsAddModalOpen(false);
  }, []);

  // 予定の変更を保存
  const saveEventChanges = React.useCallback((updatedEvent: InternalCalendarEvent) => {
    const updatedEvents = calendarEvents.map(event => 
      event.id === updatedEvent.id ? updatedEvent : event
    );
    onCalendarEventsChange(updatedEvents);
    closeEditModal();
  }, [calendarEvents, onCalendarEventsChange, closeEditModal]);

  // 新しい予定を追加
  const addNewEvent = React.useCallback((eventData: Omit<InternalCalendarEvent, 'id'>) => {
    const newEvent: InternalCalendarEvent = {
      id: Date.now().toString(),
      ...eventData
    };
    const updatedEvents = [...calendarEvents, newEvent];
    onCalendarEventsChange(updatedEvents);
    closeAddModal();
  }, [calendarEvents, onCalendarEventsChange, closeAddModal]);

  // 予定を削除
  const removeEvent = React.useCallback((eventId: string) => {
    const updatedEvents = calendarEvents.filter(event => event.id !== eventId);
    onCalendarEventsChange(updatedEvents);
    closeEditModal();
  }, [calendarEvents, onCalendarEventsChange, closeEditModal]);

  return {
    // 状態
    editingEvent,
    isEditModalOpen,
    isAddModalOpen,
    
    // メソッド
    openEditModal,
    closeEditModal,
    openAddModal,
    closeAddModal,
    saveEventChanges,
    addNewEvent,
    removeEvent,
    
    // モーダルコンポーネント
    EventModals: (
      <>
        <EventEditModal
          isOpen={isEditModalOpen}
          event={editingEvent}
          onClose={closeEditModal}
          onSave={saveEventChanges}
          onDelete={removeEvent}
        />
        <AddEventModal
          isOpen={isAddModalOpen}
          onClose={closeAddModal}
          onSave={addNewEvent}
        />
      </>
    )
  };
};