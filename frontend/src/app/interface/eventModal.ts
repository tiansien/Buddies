export interface AppEvent {
  eventId: number;
  userId: number;
  title: string;
  date: number; // or Date if you convert the timestamp in your service
  location: string;
  approved: boolean | null;
  description: string;
  eventType: string;
  eventPictureUrls: string[]; // Ensure this is defined
  // eventPicturePaths?: string;
  data?: any;
}
