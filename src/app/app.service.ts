import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DestroyRef, Injectable, inject } from '@angular/core';
import {
  catchError,
  filter,
  map,
  Observable,
  shareReplay,
  throwError,
  OperatorFunction,
  UnaryFunction,
  pipe,
  distinctUntilChanged,
  Subject,
} from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

/**
 * Operador customizado para RxJs que garante que apenas stream
 * de dado válido chegue ao `next`.
 *
 * Filtra observable com valor `0` ou `undefined` e evita que stream
 * de dado prossiga caso valor seja filtrado.
 *
 * @returns Observable de valor que não seja `0` e nem `undefined`.
 */
export function filter0ish<T>(): UnaryFunction<
  Observable<T | 0 | undefined>,
  Observable<T>
> {
  return pipe(
    filter((value) => value != 0) as OperatorFunction<T | 0 | undefined, T>
  );
}

@Injectable({
  providedIn: 'root',
})
export class AppService {
  private url = 'http://localhost:3000/api/asset';
  private http = inject(HttpClient);
  private destroyRef = inject(DestroyRef);

  public readonly mySubject: Subject<any> = new Subject();

  requestAssetToChart(
    selectedAsset: string,
    startTimestamp: number,
    endTimestamp: number
  ): void {
    this.http
      .get<any>(
        `${this.url}/${selectedAsset}symbol=${selectedAsset}&period1=${startTimestamp}&period2=${endTimestamp}&interval=1d`,
        { withCredentials: true }
      )
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        distinctUntilChanged(),
        map((data) => this.mySubject.next(data)),
        shareReplay(1),
        catchError(this.handleError)
      )
      .subscribe();
  }

  getSelectedAsset(selectedAsset: string): void {
    const now = new Date();
    const startDate = new Date();
    startDate.setDate(now.getDate() - 30);

    const startTimestamp = Math.floor(startDate.getTime() / 1000);
    const endTimestamp = Math.floor(now.getTime() / 1000);

    this.requestAssetToChart(selectedAsset, startTimestamp, endTimestamp);
  }

  public get assets(): string[] {
    return ['BTC-USD', 'PETR4.SA', '%5ERUT', '%5EIXIC', 'JPY%3DX'];
  }

  private handleError = (err: HttpErrorResponse): Observable<never> => {
    const errorMessage =
      err.error instanceof ErrorEvent
        ? `Algum erro ocorreu: ${err.error.message}`
        : `Servidor retornou o código: ${err.status}, A mensagem é: ${err.message}`;

    console.error(errorMessage);
    return throwError(() => errorMessage);
  };
}
