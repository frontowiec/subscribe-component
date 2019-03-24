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
};

export function SimpleSuspense<T>({
  fallback,
  children,
  maxDuration = 0,
  stream
}: SimpleSuspenseProps<T>) {
  const [showFallback, setShowFallback] = useState(false);
  const { status, errorStatus, data } = useFetch<T>(stream, []);

  useEffect(() => {
    setTimeout(() => {
      setShowFallback(true);
    }, maxDuration);
  }, []);

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
