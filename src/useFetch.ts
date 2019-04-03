import { EMPTY, Observable } from "rxjs";
import { useEffect, useState } from "react";
import { catchError, tap } from "rxjs/operators";
import { AjaxError } from "rxjs/ajax";

export enum FetchStatus {
  In_progress = "in_progress",
  Success = "success",
  Failed = "failed"
}

export const useFetch = <T>(stream$: Observable<T>, deps: Array<unknown>) => {
  const [data, setData] = useState<T>();
  const [error, setError] = useState<AjaxError>();
  const [status, setStatus] = useState<FetchStatus>(FetchStatus.In_progress);

  useEffect(() => {
    setStatus(FetchStatus.In_progress);
  }, deps);

  useEffect(() => {
    console.log(deps);
    const subscription$ = stream$
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
