import { combineReducers } from 'redux';
import { IAction } from 'reducers/interfaces';
import { container, IContainerState } from './containers';
import { meta, IMetaState } from './meta';

interface State {
  container: IContainerState;
  meta: IMetaState;
}

interface Action {
  container: IAction;
  meta: IAction;
}

const rootReducer = combineReducers({
  container,
  meta,
});

export default rootReducer;

export type { State, Action };
