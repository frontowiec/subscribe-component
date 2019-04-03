import { EMPTY, Observable, pipe, from } from "rxjs";
import { useEffect, useState } from "react";
import { catchError, tap } from "rxjs/operators";
import { AjaxError } from "rxjs/ajax";

export enum FetchStatus {
  In_progress = "in_progress",
  Success = "success",
  Failed = "failed"
}

export const useFetch = <T>(
  source: Observable<T> | Promise<T>,
  deps: Array<unknown>
) => {
  const [data, setData] = useState<T>();
  const [error, setError] = useState<AjaxError>();
  const [status, setStatus] = useState<FetchStatus>(FetchStatus.In_progress);
  const [toggleRequest, toggle] = useState(false);

  // todo: did not work for Promise. Look line 17 in createOptimisticResource
  const doFetch = () => toggle(!toggleRequest);

  const commonOperator = pipe(
    tap((response: T) => setData(response)),
    tap(() => setStatus(FetchStatus.Success)),
    catchError((err: AjaxError) => {
      setError(err);
      setStatus(FetchStatus.Failed);
      return EMPTY;
    })
  );

  useEffect(
    () => {
      setStatus(FetchStatus.In_progress);

      if (source instanceof Promise) {
        const subscription$ = from(source)
          .pipe(commonOperator)
          .subscribe();
        return () => subscription$.unsubscribe();
      }

      const subscription$ = source.pipe(commonOperator).subscribe(console.log);
      return () => subscription$.unsubscribe();
    },
    [...deps, toggleRequest]
  );

  return { status, error, data, doFetch };
};
