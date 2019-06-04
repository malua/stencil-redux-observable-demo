import { ActionsObservable, ofType } from "redux-observable";
import { mapTo } from "rxjs/operators";

export const TYPE_TEST = "TYPE_TEST";
export const TYPE_ANSWER = "TYPE_ANSWER";

export const rootEpic = (action$: ActionsObservable<any>) =>
  action$.pipe(
    ofType(TYPE_TEST),
    mapTo({
      type: TYPE_ANSWER
    })
  );
