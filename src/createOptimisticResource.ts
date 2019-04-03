import { Observable, throwError } from "rxjs";
import { catchError, startWith, tap } from "rxjs/operators";

// https://github.com/lodash/lodash/blob/master/memoize.js

const cache = new Map();

export function createOptimisticResource<T>(
  stream$: Observable<T>
): Observable<T> {
  const key = JSON.stringify(stream$);
  const cachedValue = cache.get(key);

  if (!cachedValue) {
    return stream$.pipe(
      tap(data => {
        cache.set(key, data);
      })
    );
  }

  return stream$.pipe(
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
}
