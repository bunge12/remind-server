INSERT INTO notifications (habit_id, notification_type, scheduled_time)
  VALUES (1, 'sms', timestamp 'today'), (1, 'sms', timestamp 'today' + interval '1 day'), (1, 'sms', timestamp 'today' + interval '3 day'), (2, 'sms', timestamp 'tomorrow'), (2, 'sms', timestamp 'today' + interval '4 day'), (3, 'sms', timestamp 'today'), (3, 'sms', timestamp 'tomorrow'), (3, 'sms', timestamp 'today' + interval '3 day'), (3, 'sms', timestamp 'today' + interval '5 day'),
