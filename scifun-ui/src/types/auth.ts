export interface LoginResponse {
    status: number;
    message: string;
    token: string;
    data: {
      _id: string;
      email: string;
      fullname: string;
      isVerified: boolean;
      avatar?: string;
    };
}
export interface UpdateUserData {
  name?: string;
  avatar?: string;
}
