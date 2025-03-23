export type NotificationType = 'error' | 'success' | 'neutral';
export interface NotificationData {
	text: string;
	type: NotificationType;
}
