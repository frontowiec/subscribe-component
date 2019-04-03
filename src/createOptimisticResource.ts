import { Observable, throwError } from "rxjs";
import { catchError, startWith, tap } from "rxjs/operators";
import { instanceOf } from "prop-types";

// https://github.com/lodash/lodash/blob/master/memoize.js

const cache = new Map();

export function createOptimisticResource<T>(
  source: Observable<T> | Promise<T>,
  hashFunction?: () => string
): Observable<T> | Promise<T> {
  if (source instanceof Promise) {
    if (!hashFunction) {
      throw new Error("If you use Promise you must provide hash function");
    }

    console.warn("Optimistic rendering not supported yet for Promise");

    return source;

    /*const key = hashFunction();
    const cachedValue = cache.get(key);
    if (!cachedValue) {
      return source.then(data => {
        cache.set(key, data);
        return data;
      });
    }

    return new Promise(resolve => resolve(cachedValue));*/
  }

  const key = JSON.stringify(source);
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
}
