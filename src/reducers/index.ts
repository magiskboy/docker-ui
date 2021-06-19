import { combineReducers } from 'redux';
import { IAction } from 'reducers/interfaces';
import { user, IUserState } from './user';

interface State {
  user: IUserState;
}

interface Action {
  user: IAction;
}

const rootReducer = combineReducers({
  user,
});

export default rootReducer;

export type { State, Action };
