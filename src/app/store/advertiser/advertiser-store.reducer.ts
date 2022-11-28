import { HttpErrorResponse } from '@angular/common/http';
import { Action, createReducer, on } from '@ngrx/store';
import { ApiState } from '../../shared/enum/api-state.num';
import { AdvertiserModel } from '../../shared/models/advertiser.model';
import { PageResultModel } from '../../shared/models/page-result.model';
import { AdvertisersActions } from './advertiser-store.action';

export interface AdvertiserStoreState {
  advertiserResulPage: PageResultModel<AdvertiserModel> | null;
  currentAdvertiser: AdvertiserModel | null;
  apiState: ApiState;
  error: HttpErrorResponse | null;
}

const initialState: AdvertiserStoreState = {
  advertiserResulPage: null,
  currentAdvertiser: null,
  apiState: ApiState.Init,
  error: null,
};

function addAdvertiser(
  advertiser: AdvertiserModel,
  listOfAdvertisers: AdvertiserModel[],
): PageResultModel<AdvertiserModel> {
  const newItem = { ...advertiser, id: 0 };
  const obj = sessionStorage.getItem('advertiserCached');
  const cachedData: AdvertiserModel[] = obj ? (JSON.parse(obj) as unknown as AdvertiserModel[]) : [];

  if (cachedData.length > 0) {
    newItem.id = listOfAdvertisers.length + cachedData.length + 1;
    cachedData.push(newItem);
  } else {
    newItem.id = listOfAdvertisers.length + 1;
    cachedData.push(newItem);
  }
  sessionStorage.setItem('advertiserCached', JSON.stringify(cachedData));

  return {
    'hydra:member': [...listOfAdvertisers, newItem],
    'hydra:totalItems': listOfAdvertisers.length + 1,
  };
}

function getMockData(data: PageResultModel<AdvertiserModel>): PageResultModel<AdvertiserModel> {
  let tempData: PageResultModel<AdvertiserModel> = { ...data };
  const obj = sessionStorage.getItem('advertiserCached');
  const cachedData: AdvertiserModel[] = obj ? (JSON.parse(obj) as unknown as AdvertiserModel[]) : [];

  if (cachedData.length > 0) {
    tempData['hydra:member'] = [...data['hydra:member'], ...cachedData];
    tempData['hydra:totalItems'] = data['hydra:member'].length + cachedData.length;
  }
  return tempData;
}

export class AdvertiserStoreReducer {
  public static featureSelectorKey = 'advertiser';

  public static reducer = createReducer(
    initialState,

    // getting advertisers
    on(AdvertisersActions.getAdvertisers, (state: AdvertiserStoreState) => ({
      ...state,
      currentAdvertiser: null,
      apiState: ApiState.Pending,
      error: null,
    })),
    on(AdvertisersActions.getAdvertisersSuccess, (_, { payload }) => ({
      advertiserResulPage: getMockData(payload),
      currentAdvertiser: null,
      apiState: ApiState.Done,
      error: null,
    })),
    on(AdvertisersActions.getAdvertisersFailure, (state, { error }) => ({
      ...state,
      apiState: ApiState.Error,
      error,
    })),

    // adding advertiser
    on(AdvertisersActions.addAdvertiser, (state: AdvertiserStoreState) => ({
      ...state,
      apiState: ApiState.Pending,
      error: null,
    })),
    on(AdvertisersActions.addAdvertiserSuccess, (state, { payload }) => ({
      advertiserResulPage: state.advertiserResulPage
        ? addAdvertiser(payload, state.advertiserResulPage?.['hydra:member'])
        : null,
      currentAdvertiser: payload,
      apiState: ApiState.Done,
      error: null,
    })),
    on(AdvertisersActions.addAdvertiserFailure, (state, { error }) => ({
      ...state,
      apiState: ApiState.Error,
      error,
    })),
  );
}

export function reducer(state: AdvertiserStoreState, action: Action) {
  return AdvertiserStoreReducer.reducer(state, action);
}
