import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AdvertiserStoreReducer, AdvertiserStoreState } from './advertiser-store.reducer';

export const advertiserState = createFeatureSelector<AdvertiserStoreState>(AdvertiserStoreReducer.featureSelectorKey);
export class AdvertiserSelectors {
  public static advertiserResulPage = createSelector(advertiserState, (state: AdvertiserStoreState) =>
    state ? state.advertiserResulPage : null,
  );

  public static currentAdvertiser = createSelector(
    advertiserState,
    (state: AdvertiserStoreState) => state.currentAdvertiser,
  );

  public static error = createSelector(advertiserState, (state: AdvertiserStoreState) => state.error);

  public static apiState = createSelector(advertiserState, (state: AdvertiserStoreState) =>
    state ? state.apiState : null,
  );
}
