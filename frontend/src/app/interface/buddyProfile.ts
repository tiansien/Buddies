export interface BuddyProfile {
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    profilePhoto: string;
    login: string;
    createdDate: any;
    role: any;
    buddy: any;
  };
  profile: {
    id: number;
    bio: string;
    fac: string;
    program: string;
    yearOfStudy: string;
    levelOfStudy: string;
  };

  requestStatus?: string;
}

export interface BuddyResponse {
  data: BuddyProfile[];
  totalPages: number;
  pageSize: number;
  currentPage: number;
  requestStatus?: string;
}

// export interface BuddyRequest {
//   id: number;
//   name: string;
//   profilePhoto: string;
//   timestamp: Date;

//   requestID?: number;
//   // id: number;
//   status?: string;
//   requestDate?: string;
//   ReceiverID?: string;
// }

export interface BuddyRequest {
  requestID: number;
  appUser: {
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
  receiver: {
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
  status: string;
  requestDate: string;
}

export interface BuddyUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  profilePhoto: string;
  login: string;
  createdDate: any;
  role: any;
  buddy: any;
}
