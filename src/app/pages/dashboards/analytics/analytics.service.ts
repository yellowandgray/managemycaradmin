/* eslint-disable @typescript-eslint/adjacent-overload-signatures */
import { Injectable, PipeTransform } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';

// Date Format
import { DatePipe } from '@angular/common';

import { TopPageModel, browserModel } from './analytics.model';
import { browserData, topPageData } from './data';
import { DecimalPipe } from '@angular/common';
import { debounceTime, delay, switchMap, tap } from 'rxjs/operators';
import { SortColumn, SortColumn1, SortDirection } from './analytics-sortable.directive';

interface SearchResult {
  countries: browserModel[];
  toppageDatas: TopPageModel[];
}

interface State {
  sortColumn: SortColumn;
  sortColumn1: SortColumn1;
  sortDirection: SortDirection;
}

const compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

function sort(countries: browserModel[], column: SortColumn, direction: string): browserModel[] {
  if (direction === '' || column === '') {
    return countries;
  } else {
    return [...countries].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

function topsort(toppageDatas: TopPageModel[], column1: SortColumn1, direction: string): TopPageModel[] {
  if (direction === '' || column1 === '') {
    return toppageDatas;
  } else {
    return [...toppageDatas].sort((a, b) => {
      const res = compare(a[column1], b[column1]);
      return direction === 'asc' ? res : -res;
    });
  }
}

@Injectable({ providedIn: 'root' })
export class AnalyticService {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _countries$ = new BehaviorSubject<browserModel[]>([]);
  private _toppageDatas$ = new BehaviorSubject<TopPageModel[]>([]);

  content?: any;
  products?: any;
  toppages?: any;

  private _state: State = {
    sortColumn: '',
    sortColumn1: '',
    sortDirection: ''
  };

  constructor(private pipe: DecimalPipe) {
    this._search$.pipe(
      tap(() => this._loading$.next(true)),
      debounceTime(200),
      switchMap(() => this._search()),
      delay(200),
      tap(() => this._loading$.next(false))
    ).subscribe(result => {
      this._countries$.next(result.countries);
      this._toppageDatas$.next(result.toppageDatas);
    });

    this._search$.next();

    this.products = browserData;
    this.toppages = topPageData;
  }

  get countries$() { return this._countries$.asObservable(); }
  get toppageDatas$() { return this._toppageDatas$.asObservable(); }
  get product() { return this.products; }
  get toppage() { return this.toppages; }
  get loading$() { return this._loading$.asObservable(); }

  set sortColumn(sortColumn: SortColumn) { this._set({ sortColumn }); }
  set sortColumn1(sortColumn1: SortColumn1) { this._set({ sortColumn1 }); }
  set sortDirection(sortDirection: SortDirection) { this._set({ sortDirection }); }

  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  private _search(): Observable<SearchResult> {
    const datas = (this.product) ?? [];
    const topdatas = (this.toppages) ?? [];
    const { sortColumn, sortColumn1, sortDirection } = this._state;

    // 1. sort
    let countries = sort(datas, sortColumn, sortDirection);
    let toppageDatas = topsort(topdatas, sortColumn1, sortDirection);

    countries = countries;
    toppageDatas = toppageDatas;
    return of({ countries, toppageDatas });
    
  }


}
