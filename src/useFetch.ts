import { EMPTY, Observable, pipe } from "rxjs";
import { useEffect, useState } from "react";
import { catchError, startWith, tap } from "rxjs/operators";

export enum StateStatus {
  Default = "default",
  In_progress = "in_progress",
  Success = "success",
  Failed = "failed",
  Cached = "cached"
}

let response: any;

export const useFetch = <T>(stream$: Observable<T>, deps: Array<unknown>) => {
  const [status, setStatus] = useState<StateStatus>(StateStatus.Default);
  const [errorStatus, setErrorStatus] = useState();
  const [data, setData] = useState<T>();

  const fetchOperator = pipe(
    tap((response: T) => setData(response)),
    tap(() => setStatus(StateStatus.Success)),
    catchError(err => {
      setStatus(StateStatus.Failed);
      setErrorStatus(err.status);
      return EMPTY;
    })
  );

  useEffect(() => {
    setStatus(StateStatus.In_progress);

    if (!response) {
      const subscription = stream$
        .pipe(
          tap(r => (response = r)),
          fetchOperator
        )
        .subscribe();
      return () => subscription.unsubscribe();
    }

    const subscription = stream$
      .pipe(
        startWith(response),
        tap(r => (response = r)),
        fetchOperator
      )
      .subscribe();
    return () => subscription.unsubscribe();
  }, deps);

  return { status, errorStatus, data };
};
