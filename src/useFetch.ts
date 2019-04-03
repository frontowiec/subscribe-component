import { EMPTY, Observable } from "rxjs";
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

  useEffect(() => {
    setStatus(FetchStatus.In_progress);
  }, deps);

  useEffect(() => {
    if (source instanceof Promise) {
      source
        .then((response: T) => setData(response))
        .then(() => setStatus(FetchStatus.Success))
        .catch(err => {
          setError(err);
          setStatus(FetchStatus.Failed);
        });
      return;
    }

    const subscription$ = source
      .pipe(
        tap((response: T) => setData(response)),
        tap(() => setStatus(FetchStatus.Success)),
        catchError((err: AjaxError) => {
          setError(err);
          setStatus(FetchStatus.Failed);
          return EMPTY;
        })
      )
      .subscribe(console.log);
    return () => subscription$.unsubscribe();
  }, deps);

  return { status, error, data };
};
