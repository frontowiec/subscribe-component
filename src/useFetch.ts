import { EMPTY, Observable } from "rxjs";
import { useEffect, useRef, useState } from "react";
import { catchError, tap } from "rxjs/operators";
import { createOptimisticResource } from "./createOptimisticResource";
import { AjaxError } from "rxjs/ajax";

export enum StateStatus {
  In_progress = "in_progress",
  Success = "success",
  Failed = "failed"
}

export const useFetch = <T>(
  stream$: Observable<T>,
  deps: Array<unknown>,
  optimisticMode: boolean
) => {
  const [status, setStatus] = useState<StateStatus>(StateStatus.In_progress);
  const [error, setError] = useState<AjaxError>();
  const [data, setData] = useState<T>();
  const savedDeps = useRef(deps);

  useEffect(() => {
    if (!optimisticMode || deps !== savedDeps.current) {
      setStatus(StateStatus.In_progress);
      const subscription$ = stream$
        .pipe(
          tap((response: T) => setData(response)),
          tap(() => setStatus(StateStatus.Success)),
          catchError((err: AjaxError) => {
            setError(err);
            setStatus(StateStatus.Failed);
            return EMPTY;
          })
        )
        .subscribe();

      savedDeps.current = deps;

      return () => subscription$.unsubscribe();
    }

    const subscription$ = createOptimisticResource(stream$)
      .pipe(
        tap((response: T) => setData(response)),
        tap(() => setStatus(StateStatus.Success)),
        catchError((err: AjaxError) => {
          setError(err);
          setStatus(StateStatus.Failed);
          return EMPTY;
        })
      )
      .subscribe();

    return () => subscription$.unsubscribe();
  }, deps);

  return { status, error, data };
};
