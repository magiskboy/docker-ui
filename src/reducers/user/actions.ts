import { LOGIN_USER, REGISTER_USER } from './constants';
import { ILoginUserPayload, IRegisterUserPayload } from './reducers';
import { IAction } from '../interfaces';

export const loginUserAction: (payload: ILoginUserPayload) => IAction = (
  payload: ILoginUserPayload,
) => ({
  type: LOGIN_USER,
  payload,
});

export const registerUserAction: (payload: IRegisterUserPayload) => IAction = (
  payload: IRegisterUserPayload,
) => ({
  type: REGISTER_USER,
  payload,
});
