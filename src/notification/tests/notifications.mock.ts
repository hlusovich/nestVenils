export const mockNotificationService = {
  sentNotification: jest.fn((email): void => {
    return email;
  }),
};
