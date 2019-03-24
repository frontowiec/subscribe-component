import { useEffect, useState } from "react";
import { StateStatus, useFetch } from "./useFetch";
import { Observable } from "rxjs";
import { AjaxError } from "rxjs/ajax";

type SimpleSuspenseProps<T> = {
  maxDuration?: number;
  children: (
    options: { status: StateStatus; error: AjaxError; data: T }
  ) => JSX.Element;
  fallback: JSX.Element;
  source: Observable<T>;
  params?: Array<unknown>;
  optimisticMode?: boolean;
};

export function SimpleSuspense<T>({
  fallback,
  children,
  maxDuration = 0,
  source,
  params = [],
  optimisticMode = true
}: SimpleSuspenseProps<T>) {
  const [showFallback, setShowFallback] = useState(false);
  const { status, error, data } = useFetch<T>(source, params, optimisticMode);

  useEffect(
    () => {
      const timeout = setTimeout(() => {
        setShowFallback(true);
      }, maxDuration);

      return () => clearTimeout(timeout);
    },
    [params]
  );

  if (status === StateStatus.Success || status === StateStatus.Failed) {
    // StateStatus.Success should ensure value for data
    return children({ status, error, data } as {
      status: StateStatus;
      error: AjaxError;
      data: T;
    });
  }

  if (showFallback) {
    return fallback;
  }

  return null;
}
