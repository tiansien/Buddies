interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  profilePhoto: string;
  login?: string;
  email?: string;
  role?: string;
  bio?: string;
  fac?: string;
  program?: string;
  levelOfStudy?: string;
  yearOfStudy?: string;
}

export interface Comment {
  commentID: number;
  type: string;
  referenceID: string;
  id: number; // User ID for linking with UserProfile
  content: string;
  timestamp: string;
  userProfile?: UserProfile;
}
