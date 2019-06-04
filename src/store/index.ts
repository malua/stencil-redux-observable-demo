import {
  Store as ReduxStore,
  createStore,
  applyMiddleware,
  Action
} from "redux";

import { rootReducer } from "./reducer/index";

import { rootEpic } from "./epics/index";
import { createEpicMiddleware } from "redux-observable";

const epicMiddleware = createEpicMiddleware();

const configureStore = (preloadedState: any) => {
  const store = createStore<any, Action<any>, {}, {}>(
    rootReducer,
    preloadedState,
    applyMiddleware(epicMiddleware)
  );

  epicMiddleware.run(rootEpic);

  return store;
};

class Store {
  _store: ReduxStore<any>;
  constructor() {
    this._store = configureStore({});
  }

  setStore(store: ReduxStore) {
    this._store = store;
  }

  getState() {
    return this._store && this._store.getState();
  }

  getStore() {
    return this._store;
  }

  mapDispatchToProps(component: any, props: any) {
    Object.keys(props).forEach(actionName => {
      const action = props[actionName];
      Object.defineProperty(component, actionName, {
        get: () => (...args: any[]) => this._store.dispatch(action(...args)),
        configurable: true,
        enumerable: true
      });
    });
  }

  mapStateToProps(component: any, mapState: (...args: any[]) => any) {
    // TODO: Don't listen for each component
    const _mapStateToProps = (_component: any, _mapState: any) => {
      const mergeProps = mapState(this._store.getState());
      Object.keys(mergeProps).forEach(newPropName => {
        const newPropValue = mergeProps[newPropName];
        component[newPropName] = newPropValue;
        // TODO: can we define new props and still have change detection work?
      });
    };

    const unsubscribe = this._store.subscribe(() =>
      _mapStateToProps(component, mapState)
    );

    _mapStateToProps(component, mapState);

    return unsubscribe;
  }
}

export let store = new Store();
