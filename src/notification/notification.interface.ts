export interface INotificationService {
  sentNotification(email: string, text: string): void;
}
