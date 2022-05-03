import React, { useSyncExternalStore } from "react";
import { createStore } from 'redux';
function reducer(state = { number: 0 }, action) {
  switch (action.type) {
    case 'ADD':
      return { number: state.number + 1 }
    default:
      return state;
  }
}
let store = createStore(reducer);
/* class Store {
  value = 0
  listeners = []
  subscribe = (listener) => {
    this.listeners.push(listener)
  }
  getValue = () => {
    return this.value;
  }
  setValue(newValue) {
    this.value = newValue;
    this.listeners.forEach((l) => l());
  }
}
const store = new Store(); */
function useSyncExternalStorePage() {
  const state = useSyncExternalStore(store.subscribe, store.getState);
  const add = () => {
    //store.setValue(state + 1);
    //react-redux 最新版中 使用useSyncExternalStore实现了仓库和组件关联
    store.dispatch({ type: 'ADD' });
  }
  return (
    <div>
      <button onClick={add}>{state.number}</button>
    </div>
  );
}
export default useSyncExternalStorePage;
