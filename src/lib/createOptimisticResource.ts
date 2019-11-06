import { from, Observable, throwError } from "rxjs";
import { catchError, startWith, tap } from "rxjs/operators";

// https://github.com/lodash/lodash/blob/master/memoize.js

const cache = new Map();

export function createOptimisticResource<T>(
  source: Observable<T> | Promise<T>,
  hashFunction?: () => string
): Observable<T> {
  if (source instanceof Promise) {
    if (!hashFunction) {
      throw new Error("If you use Promise you must provide hash function");
    }
    const key = hashFunction();
    return startWithCachedValue$(key, from(source));
  }

  const key = JSON.stringify(source);
  return startWithCachedValue$(key, source);
}

const startWithCachedValue$ = <T>(key: string, source: Observable<T>) => {
  const cachedValue = cache.get(key);

  if (!cachedValue) {
    return source.pipe(
      tap(data => {
        cache.set(key, data);
      })
    );
  }

  return source.pipe(
    startWith(cachedValue),
    tap(data => {
      cache.set(key, data);
    }),
    catchError(err => {
      // clear cache on error
      cache.delete(key);
      return throwError(err);
    })
  );
};
