import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AddressStoreReducer, AddressStoreState } from './address-store.reducer';

export const addressState = createFeatureSelector<AddressStoreState>(AddressStoreReducer.featureSelectorKey);
export class AddressSelectors {
  public static addressResulPage = createSelector(addressState, (state: AddressStoreState) =>
    state ? state.addressResulPage : null,
  );

  public static currentAdress = createSelector(addressState, (state: AddressStoreState) =>
    state ? state.currentAdress : null,
  );

  public static error = createSelector(addressState, (state: AddressStoreState) => state.error);

  public static apiState = createSelector(addressState, (state: AddressStoreState) => (state ? state.apiState : null));
}
