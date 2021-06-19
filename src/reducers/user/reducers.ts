import { LOGIN_USER, REGISTER_USER } from './constants';
import { IPayload, IAction } from '../interfaces';

export interface IUserState {
  fullname: string;
  email: string;
  token: string;
  profileUrl: string;
}

export interface ILoginUserPayload extends IPayload {
  email: string;
  password: string;
  rememberMe?: boolean;
}

const LoginUser: (state: IUserState, payload: ILoginUserPayload) => IUserState =
  (_state, payload) => {
    return { fullname: '', email: payload.email, token: '', profileUrl: '' };
  };

export interface IRegisterUserPayload extends IPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const RegisterUser: (
  state: IUserState,
  payload: IRegisterUserPayload
) => IUserState = (_state, payload) => {
  return {
    fullname: payload.firstName + payload.lastName,
    email: payload.email,
    token: '',
    profileUrl: '',
  };
};

const initialUserState = {
  fullname: '',
  email: '',
  token: '',
  profileUrl: '',
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const user = (state: IUserState = initialUserState, action: IAction) => {
  const { type, payload } = action;

  switch (type) {
    case LOGIN_USER:
      return LoginUser(state, payload as ILoginUserPayload);
    case REGISTER_USER:
      return RegisterUser(state, payload as IRegisterUserPayload);
    default:
      return state;
  }
};
