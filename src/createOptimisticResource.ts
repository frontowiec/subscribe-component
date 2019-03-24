import { Observable } from "rxjs";
import { startWith, tap } from "rxjs/operators";

let response: any;

export function createOptimisticResource<T>(
  stream$: Observable<T>
): Observable<T> {
  if (!response) {
    return stream$.pipe(tap(r => (response = r)));
  }

  return stream$.pipe(
    startWith(response),
    tap(r => (response = r))
  );
}
