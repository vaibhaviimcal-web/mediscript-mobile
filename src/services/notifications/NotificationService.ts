import notifee, {AndroidImportance, TriggerType} from '@notifee/react-native';
import {Platform} from 'react-native';

class NotificationService {
  private channelId: string = 'mediscript-default';

  async initialize(): Promise<void> {
    try {
      // Request permissions
      await notifee.requestPermission();

      // Create notification channel (Android)
      if (Platform.OS === 'android') {
        await notifee.createChannel({
          id: this.channelId,
          name: 'MediScript Notifications',
          importance: AndroidImportance.HIGH,
          sound: 'default',
          vibration: true,
        });
      }

      console.log('✅ Notifications initialized');
    } catch (error) {
      console.error('❌ Notification initialization error:', error);
    }
  }

  async showNotification(title: string, body: string, data?: any): Promise<void> {
    try {
      await notifee.displayNotification({
        title,
        body,
        data,
        android: {
          channelId: this.channelId,
          importance: AndroidImportance.HIGH,
          pressAction: {
            id: 'default',
          },
        },
        ios: {
          sound: 'default',
        },
      });

      console.log('✅ Notification shown:', title);
    } catch (error) {
      console.error('❌ Error showing notification:', error);
    }
  }

  async scheduleNotification(
    title: string,
    body: string,
    timestamp: number,
    data?: any
  ): Promise<string> {
    try {
      const notificationId = await notifee.createTriggerNotification(
        {
          title,
          body,
          data,
          android: {
            channelId: this.channelId,
            importance: AndroidImportance.HIGH,
            pressAction: {
              id: 'default',
            },
          },
          ios: {
            sound: 'default',
          },
        },
        {
          type: TriggerType.TIMESTAMP,
          timestamp,
        }
      );

      console.log('✅ Notification scheduled:', notificationId);
      return notificationId;
    } catch (error) {
      console.error('❌ Error scheduling notification:', error);
      throw error;
    }
  }

  async cancelNotification(notificationId: string): Promise<void> {
    try {
      await notifee.cancelNotification(notificationId);
      console.log('✅ Notification cancelled:', notificationId);
    } catch (error) {
      console.error('❌ Error cancelling notification:', error);
    }
  }

  async cancelAllNotifications(): Promise<void> {
    try {
      await notifee.cancelAllNotifications();
      console.log('✅ All notifications cancelled');
    } catch (error) {
      console.error('❌ Error cancelling all notifications:', error);
    }
  }

  // Prescription reminder
  async schedulePrescriptionReminder(
    patientName: string,
    timestamp: number
  ): Promise<string> {
    return this.scheduleNotification(
      'Prescription Reminder',
      `Follow-up appointment for ${patientName}`,
      timestamp,
      {type: 'prescription_reminder', patientName}
    );
  }

  // Medicine reminder
  async scheduleMedicineReminder(
    medicineName: string,
    timestamp: number
  ): Promise<string> {
    return this.scheduleNotification(
      'Medicine Reminder',
      `Time to take ${medicineName}`,
      timestamp,
      {type: 'medicine_reminder', medicineName}
    );
  }
}

export const initializeNotifications = async () => {
  const service = new NotificationService();
  await service.initialize();
  return service;
};

export default new NotificationService();
