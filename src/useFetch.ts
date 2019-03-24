import { EMPTY, Observable, pipe } from "rxjs";
import { useEffect, useRef, useState } from "react";
import { catchError, tap } from "rxjs/operators";
import { createOptimisticResource } from "./createOptimisticResource";
import { AjaxError } from "rxjs/ajax";

export enum FetchStatus {
  In_progress = "in_progress",
  Success = "success",
  Failed = "failed"
}

export const useFetch = <T>(
  stream$: Observable<T>,
  deps: Array<unknown>,
  optimisticMode: boolean
) => {
  const [status, setStatus] = useState<FetchStatus>(FetchStatus.In_progress);
  const [error, setError] = useState<AjaxError>();
  const [data, setData] = useState<T>();
  const savedDeps = useRef(deps);

  const commonOperator = pipe(
    tap((response: T) => setData(response)),
    tap(() => setStatus(FetchStatus.Success)),
    catchError((err: AjaxError) => {
      setError(err);
      setStatus(FetchStatus.Failed);
      return EMPTY;
    })
  );

  useEffect(() => {
    if (!optimisticMode || deps !== savedDeps.current) {
      setStatus(FetchStatus.In_progress);
      const subscription$ = stream$.pipe(commonOperator).subscribe();

      savedDeps.current = deps;

      return () => subscription$.unsubscribe();
    }

    const subscription$ = createOptimisticResource(stream$)
      .pipe(commonOperator)
      .subscribe();

    return () => subscription$.unsubscribe();
  }, deps);

  return { status, error, data };
};
