import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DestroyRef, Injectable, inject, signal } from '@angular/core';
import {
  catchError,
  filter,
  map,
  Observable,
  shareReplay,
  switchMap,
  throwError,
  OperatorFunction,
  UnaryFunction,
  pipe,
  distinctUntilChanged,
  of,
} from 'rxjs';
import {
  toSignal,
  toObservable,
  takeUntilDestroyed,
} from '@angular/core/rxjs-interop';

/**
 * Operador customizado para RxJs que garante que apenas stream
 * de dado válido chegue ao `next`.
 *
 * Filtra observable com valor `null` ou `undefined` e evita que stream
 * de dado prossiga caso valor seja filtrado.
 *
 * @returns Observable de valor que não seja `null` e nem `undefined`.
 */
export function filterNullish<T>(): UnaryFunction<
  Observable<T | null | undefined>,
  Observable<T>
> {
  return pipe(
    filter((value) => value != null) as OperatorFunction<
      T | null | undefined,
      T
    >
  );
}

@Injectable({
  providedIn: 'root',
})
export class AppService {
  private url = 'https://query2.finance.yahoo.com/v8/finance/chart/';
  http = inject(HttpClient);
  private destroyRef = inject(DestroyRef);

  private readonly _selectedAsset = signal<any>({});

  public readonly recentUpdates = toSignal(
    toObservable(this._selectedAsset).pipe(switchMap(() => this.getAsset())),
    { initialValue: [], manualCleanup: true }
  );

  public readonly selectedAsset = toSignal(
    toObservable(this._selectedAsset).pipe(
      distinctUntilChanged(),
      filterNullish<any>(),
      takeUntilDestroyed(this.destroyRef),
      switchMap((foundAsset: any) => of(foundAsset))
    ),
    { initialValue: {}, manualCleanup: true }
  );

  getAsset(): Observable<any> {
    return this.http.get<any>(`${this.url}/endpoint`).pipe(
      map((data) => data as any),
      shareReplay(1),
      catchError(this.handleError)
    );
  }

  assetSelected(bId: string): void {
    if (bId) {
      const foundasset = this.recentUpdates().find((b: any) => b.id === bId);
      this._selectedAsset.set(foundasset ? foundasset : {});
    }
  }

  private handleError(err: HttpErrorResponse): Observable<never> {
    // In a real world app we Should centralize error and calls on HTTPInterceptors
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage = '';
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `Algum erro ocorreu: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Servidor retornou o código: ${err.status}, A mensagem é: ${err.message}`;
    }
    console.error(errorMessage);
    return throwError(() => errorMessage);
  }
}
