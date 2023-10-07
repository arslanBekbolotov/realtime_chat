export interface IMember {
  _id: string;
  displayName: string;
}

export interface IUser {
  username: string;
  token: string;
  password: string;
  displayName: string;
  role: string;
}

export interface IMessage {
  user: IMember;
  message: string;
}

export interface IError {
  error: string;
}

export interface IncomingMessage {
  type: string;
  payload: IMember[] | IMessage | IError | IMessage[] | IUser;
}

export interface IRegisterResponse {
  username: string;
  displayName: string;
  password: string;
}

export interface ILoginResponse {
  username: string;
  password: string;
}
