import { Action } from "redux";
import { TYPE_TEST } from "../epics";

export function rootReducer(state: any = {}, action: Action) {
  switch (action.type) {
    case TYPE_TEST: {
      return state;
    }
  }
}
