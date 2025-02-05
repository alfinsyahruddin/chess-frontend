export type NotificationType = 'error' | 'success' | 'neutral';
export interface Notification {
	text: string;
	type?: NotificationType;
}
