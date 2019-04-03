import { useEffect, useState } from "react";
import { FetchStatus, useFetch } from "./useFetch";
import { Observable } from "rxjs";
import { AjaxError } from "rxjs/ajax";

type SimpleSuspenseProps<T> = {
  maxDuration?: number;
  fallback: JSX.Element;
  source: Observable<T> | Promise<T>;
  params?: Array<unknown>;
  onSuccess: (data: T) => JSX.Element;
  onFailed: (error: AjaxError) => JSX.Element;
};

function AjaxRespite<T>({
  fallback,
  maxDuration = 0,
  source,
  params = [],
  onSuccess,
  onFailed
}: SimpleSuspenseProps<T>) {
  const [showFallback, setShowFallback] = useState(false);
  const { status, error, data } = useFetch<T>(source, params);

  AjaxRespite.prototype.repeatLastRequest = () => {
    // todo: doFetch()
  };

  useEffect(
    () => {
      const timeout = setTimeout(() => {
        setShowFallback(true);
      }, maxDuration);

      return () => {
        setShowFallback(false);
        clearTimeout(timeout);
      };
    },
    [maxDuration]
  );

  if (status === FetchStatus.Success) {
    return onSuccess(data as T);
  }

  if (status === FetchStatus.Failed) {
    return onFailed(error as AjaxError);
  }

  if (showFallback) {
    return fallback;
  }

  return null;
}

export { AjaxRespite };
export default AjaxRespite;
