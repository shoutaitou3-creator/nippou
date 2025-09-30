@@ .. @@
   // 予定の変更を保存
-  const saveEventChanges = React.useCallback(() => {
+  const saveEventChanges = React.useCallback((updatedEvent: InternalCalendarEvent) => {
-    if (editingEvent) {
-      console.log('=== 予定の変更を保存 ===', editingEvent);
+      console.log('=== 予定の変更を保存 ===', updatedEvent);
       const updatedEvents = calendarEvents.map(event => 
-        event.id === editingEvent.id ? editingEvent : event
+        event.id === updatedEvent.id ? updatedEvent : event
       );
       onCalendarEventsChange(updatedEvents);
       closeEditModal();
-    }
-  }, [editingEvent, calendarEvents, onCalendarEventsChange, closeEditModal]);
+  }, [calendarEvents, onCalendarEventsChange, closeEditModal]);