export interface ILoginResponse {
  accessToken: string;
  expiresIn: number
}

export interface IResponse<T> {
  data: T;
}

export interface IUser {
  id?: number;
  name?: string;
  lastname?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  password?: string;
  confirmPassword?: string;
  photoUrl?: string;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
  authorities?: IAuthority[];
  role?: IRole;
  imageList?: IImage[];
  enabled?: boolean;
  biography?:string;
}

export interface IAuthority {
  authority: string;
}

export interface IFeedBackMessage {
  type?: IFeedbackStatus;
  message?: string;
}

export enum IFeedbackStatus {
  success = "SUCCESS",
  error = "ERROR",
  default = ''
}

export enum IRoleType {
  user = "ROLE_USER",
  superAdmin = 'ROLE_SUPER_ADMIN'
}

export interface IRole {
  createdAt: string;
  description: string;
  id: number;
  name : string;
  updatedAt: string;
}

export interface ISearch {
  page?: number;
  size?: number;
  pageNumber?: number;
  pageSize?: number;
  totalElements?: number;
  totalPages?:number;
}

export interface IResetPasswordToken {
  id?: number;
  token?: string;
  user?: IUser;
  expiryDate?: Date;
}

export interface IResetPasswordRequest {
  newPassword?: string;
}
export interface IContact {
  name?: string; 
  email?: string;
  subject?: string;
  message?: string;
}

export interface Ijwt{
  jwt?:string;}
  
export interface IImage {
  id?: number;
  name?: string;
  url?: string;
  saveurl?:string;
  createDate?: Date;
  user?: IUser;
}