
export interface EventRole {
  name: string;
  description: string;
  available: boolean;
}

export interface EventTypeRoles {
  [key: string]: EventRole[];
}

export interface Participation {
  participationID?: number;
  appUser?: {
    id: number;
    firstName: string;
    lastName: string;
    login: string;
    password: string;
    email: string;
    profilePhoto: string;
    role: string | null;
    createdDate: [number, number, number, number, number, number, number];
    buddy: any;
  };
  event?: {
    eventId: number;
    title: string;
    description: string;
    location: string;
    date: number;
    eventType: string;
    eventPicturePaths: string;
  };
  role: string;
  status?: string;
  applyReason?: string;
  position?: string;
  rejectReason?: string;
}




// managmentPage
export interface AppUser {
  id: number;
  firstName: string;
  lastName: string;
  login: string;
  email: string;
  profilePhoto: string;
  role: string;
}

export interface Event {
  eventId: number;
  title: string;
  date: number;
  location: string;
  eventType: string;
}

export interface Participant {
  participationID: number;
  appUser: AppUser;
  event: Event;
  role: string;
  status: string;
  applyReason: string;
}

interface TableItem {
  key: number;
  user: AppUser;
  event: Event;
  role: string;
  status: string;
  applyReason: string;
}

