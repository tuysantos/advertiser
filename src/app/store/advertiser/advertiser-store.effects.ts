import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { AdvertiserService } from '../../services/advertiser/advertiser.service';
import { AdvertisersActions } from './advertiser-store.action';

@Injectable()
export class AdvertiserEffects {
  getAdvertisers$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(AdvertisersActions.getAdvertisers),
      switchMap(() =>
        this.advertiserService.getAdvertisers().pipe(
          map(advertisersResult => AdvertisersActions.getAdvertisersSuccess({ payload: advertisersResult })),
          catchError((error: HttpErrorResponse) => of(AdvertisersActions.getAdvertisersFailure({ error }))),
        ),
      ),
    ),
  );

  addAdvertiser$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(AdvertisersActions.addAdvertiser),
      switchMap(action =>
        this.advertiserService.addAdvertisers(action.payload).pipe(
          map(avertiserResult => AdvertisersActions.addAdvertiserSuccess({ payload: avertiserResult })),
          catchError((error: HttpErrorResponse) => of(AdvertisersActions.addAdvertiserFailure({ error }))),
        ),
      ),
    ),
  );

  constructor(private actions$: Actions, private advertiserService: AdvertiserService) {}
}
