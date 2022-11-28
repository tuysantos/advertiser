import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { AddressesService } from '../../services/address/addresses.service';
import { AddressActions } from './address-store.actions';

@Injectable()
export class AddressEffects {
  getAddresses$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(AddressActions.getAddresses),
      switchMap(() =>
        this.addressesService.getAddresses().pipe(
          map(addressResult => AddressActions.getAddressesSuccess({ payload: addressResult })),
          catchError((error: HttpErrorResponse) => of(AddressActions.getAddressesFailure({ error }))),
        ),
      ),
    ),
  );

  addAddress$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(AddressActions.addAddress),
      switchMap(action =>
        this.addressesService.addAddress(action.payload).pipe(
          map(addressResult => AddressActions.addAddressSuccess({ payload: addressResult })),
          catchError((error: HttpErrorResponse) => of(AddressActions.addAddressFailure({ error }))),
        ),
      ),
    ),
  );

  updateAddress$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(AddressActions.updateAddress),
      switchMap(action =>
        this.addressesService.updateAddress(action.payload).pipe(
          map(addressResult => AddressActions.updateAddressSuccess({ payload: addressResult })),
          catchError((error: HttpErrorResponse) => of(AddressActions.updateAddressFailure({ error }))),
        ),
      ),
    ),
  );

  deleteAddress$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(AddressActions.deleteAddress),
      switchMap(action =>
        this.addressesService.deleteAddress(action.payload).pipe(
          map(addressResult => AddressActions.deleteAddressSuccess({ payload: addressResult })),
          catchError((error: HttpErrorResponse) => of(AddressActions.deleteAddressFailure({ error }))),
        ),
      ),
    ),
  );

  getAddressById$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(AddressActions.getAddress),
      switchMap(action =>
        this.addressesService.getAddressById(action.payload).pipe(
          map(avertiserResult => AddressActions.getAddressSuccess({ payload: avertiserResult })),
          catchError((error: HttpErrorResponse) => of(AddressActions.getAddressFailure({ error }))),
        ),
      ),
    ),
  );

  constructor(private actions$: Actions, private addressesService: AddressesService) {}
}
