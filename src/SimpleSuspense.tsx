import { useEffect, useState } from "react";
import { StateStatus, useFetch } from "./useFetch";
import { Observable } from "rxjs";

type SimpleSuspenseProps<T> = {
  maxDuration?: number;
  children: (
    options: { status: StateStatus; errorStatus: string; data: T }
  ) => JSX.Element;
  fallback: JSX.Element;
  stream: Observable<T>;
  params?: Array<unknown>;
};

export function SimpleSuspense<T>({
  fallback,
  children,
  maxDuration = 0,
  stream,
  params = []
}: SimpleSuspenseProps<T>) {
  const [showFallback, setShowFallback] = useState(false);
  const { status, errorStatus, data } = useFetch<T>(stream, params);

  console.log(status);

  useEffect(
    () => {
      const timeout = setTimeout(() => {
        setShowFallback(true);
      }, maxDuration);

      return () => clearTimeout(timeout);
    },
    [params]
  );

  if (status === StateStatus.Success) {
    // StateStatus.Success should ensure value for data
    return children({ status, errorStatus, data } as {
      status: StateStatus;
      errorStatus: string;
      data: T;
    });
  }

  if (showFallback) {
    return fallback;
  }

  return null;
}
