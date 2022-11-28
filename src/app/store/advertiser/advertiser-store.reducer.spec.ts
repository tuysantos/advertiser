import { HttpErrorResponse } from '@angular/common/http';
import { ApiState } from '../../shared/enum/api-state.num';
import { AdvertiserModel } from '../../shared/models/advertiser.model';
import { PageResultModel } from '../../shared/models/page-result.model';
import { AdvertisersActions } from './advertiser-store.action';
import { AdvertiserStoreReducer, AdvertiserStoreState, reducer } from './advertiser-store.reducer';

describe('AdvertiserStoreReducer', () => {
  const mockAdvertiserResults: PageResultModel<AdvertiserModel> = {
    'hydra:member': [
      {
        id: 23,
        name: 'My name',
        orgurl: 'my url 1',
        firstName: 'Rick',
        lastName: 'Jones',
        email: 'my email',
        telephone: '12345',
        address: '/address/1',
      },
      {
        id: 4,
        name: 'My name 2',
        orgurl: 'my url 2',
        firstName: 'Albert',
        lastName: 'Santos',
        email: 'my email 2',
        telephone: '56767657',
        address: '/address/2',
      },
    ],
    'hydra:totalItems': 2,
  };

  const initialState: AdvertiserStoreState = {
    advertiserResulPage: null,
    currentAdvertiser: null,
    apiState: ApiState.Init,
    error: null,
  };

  const loadedState: AdvertiserStoreState = {
    advertiserResulPage: mockAdvertiserResults,
    currentAdvertiser: null,
    apiState: ApiState.Done,
    error: null,
  };

  beforeEach(() => {
    sessionStorage.removeItem('advertiserCached');
  });

  it('should create a reducer', () => {
    const result = AdvertiserStoreReducer.reducer(initialState, AdvertisersActions.getAdvertisers);
    expect(result.apiState).toEqual(ApiState.Pending);
  });

  it('should fire getAdvertisersSuccess action', () => {
    const cachedData: AdvertiserModel[] = [
      {
        id: 2,
        name: 'May advertiser 1',
        orgurl: 'www.adc.com',
        firstName: 'John',
        lastName: 'Smith',
        email: 'jsmith@test.com',
        telephone: '1234567',
        address: '/address/1',
      },
    ];
    sessionStorage.setItem('advertiserCached', JSON.stringify(cachedData));
    const result = AdvertiserStoreReducer.reducer(
      initialState,
      AdvertisersActions.getAdvertisersSuccess({
        payload: mockAdvertiserResults,
      }),
    );
    expect(result.advertiserResulPage).toBeTruthy();
  });

  it('should fire getAdvertisersFailure action', () => {
    const result = AdvertiserStoreReducer.reducer(
      initialState,
      AdvertisersActions.getAdvertisersFailure(new HttpErrorResponse({ error: 'some error occured' })),
    );
    expect(result.apiState).toEqual(ApiState.Error);
  });

  it('should fire addAdvertiserSuccess action', () => {
    const cachedData: AdvertiserModel[] = [
      {
        id: 1,
        name: 'May advertiser 1',
        orgurl: 'www.adc.com',
        firstName: 'John',
        lastName: 'Smith',
        email: 'jsmith@test.com',
        telephone: '1234567',
        address: '/address/1',
      },
    ];
    sessionStorage.setItem('advertiserCached', JSON.stringify(cachedData));

    const advertiser: AdvertiserModel = {
      id: 1,
      name: 'May advertiser 1',
      orgurl: 'www.adc.com',
      firstName: 'John',
      lastName: 'Smith',
      email: 'jsmith@test.com',
      telephone: '1234567',
      address: '/address/1',
    };
    const result = AdvertiserStoreReducer.reducer(
      loadedState,
      AdvertisersActions.addAdvertiserSuccess({
        payload: advertiser,
      }),
    );

    expect(result.currentAdvertiser).toEqual(advertiser);
    expect(result.advertiserResulPage?.['hydra:totalItems']).toEqual(3);
    expect(result.apiState).toEqual(ApiState.Done);
  });

  it('should fire addAdvertiserFailure action', () => {
    const result = AdvertiserStoreReducer.reducer(
      loadedState,
      AdvertisersActions.addAdvertiserFailure(new HttpErrorResponse({ error: 'some error occured' })),
    );
    expect(result.apiState).toEqual(ApiState.Error);
  });

  it('should fire addAdvertiserSuccess action without cache data', () => {
    const advertiser: AdvertiserModel = {
      id: 1,
      name: 'May advertiser 1',
      orgurl: 'www.adc.com',
      firstName: 'John',
      lastName: 'Smith',
      email: 'jsmith@test.com',
      telephone: '1234567',
      address: '/address/1',
    };
    const result = AdvertiserStoreReducer.reducer(
      loadedState,
      AdvertisersActions.addAdvertiserSuccess({
        payload: advertiser,
      }),
    );

    expect(result.currentAdvertiser).toEqual(advertiser);
    expect(result.advertiserResulPage?.['hydra:totalItems']).toEqual(3);
    expect(result.apiState).toEqual(ApiState.Done);
  });

  it('should create a reducer', () => {
    const dataModel: AdvertiserModel = {
      id: 2,
      name: 'May advertiser 1',
      orgurl: 'www.adc.com',
      firstName: 'John',
      lastName: 'Smith',
      email: 'jsmith@test.com',
      telephone: '1234567',
      address: '/address/1',
    };

    const initialState: AdvertiserStoreState = {
      advertiserResulPage: null,
      currentAdvertiser: null,
      apiState: ApiState.Init,
      error: null,
    };

    const result = reducer(
      initialState,
      AdvertisersActions.addAdvertiserSuccess({
        payload: dataModel,
      }),
    );

    expect(result).toBeTruthy();
  });
});
