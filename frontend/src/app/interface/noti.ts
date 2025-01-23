export interface NoticeItem {
  notificationID: number;
  appUser: {
    id: number;
    firstName: string;
    lastName: string;
    login: string;
    profilePhoto: string;
  };
  type: string;
  referenceID: number;
  content: string;
  timestamp: Date;
  isRead: string;
  fromId: {
    id: number;
    firstName: string;
    lastName: string;
    login: string;
    profilePhoto: string;
  };
}
