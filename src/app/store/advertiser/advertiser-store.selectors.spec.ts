import { HttpErrorResponse } from '@angular/common/http';
import { AdvertiserModel } from 'src/app/shared/models/advertiser.model';
import { ApiState } from '../../shared/enum/api-state.num';
import { PageResultModel } from '../../shared/models/page-result.model';
import { AdvertiserStoreState } from './advertiser-store.reducer';
import { AdvertiserSelectors } from './advertiser-store.selectors';

describe('AdvertiserSelectors', () => {
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

  const initialDataState: AdvertiserStoreState = {
    advertiserResulPage: null,
    currentAdvertiser: null,
    apiState: ApiState.Init,
    error: null,
  };

  const loadedDataState: AdvertiserStoreState = {
    advertiserResulPage: mockAdvertiserResults,
    currentAdvertiser: null,
    apiState: ApiState.Done,
    error: null,
  };

  const loadedCurrentDataState: AdvertiserStoreState = {
    advertiserResulPage: mockAdvertiserResults,
    currentAdvertiser: advertiser,
    apiState: ApiState.Done,
    error: null,
  };

  const initialErrorDataState: AdvertiserStoreState = {
    advertiserResulPage: null,
    currentAdvertiser: null,
    apiState: ApiState.Init,
    error: null,
  };

  const errorDataState: AdvertiserStoreState = {
    advertiserResulPage: null,
    currentAdvertiser: null,
    apiState: ApiState.Error,
    error: new HttpErrorResponse({
      status: 400,
      statusText: 'error',
      url: '',
    }),
  };

  it('should returns advertiserResulPage state', () => {
    const advertiserResulPage = AdvertiserSelectors.advertiserResulPage.projector(loadedDataState);
    expect(advertiserResulPage).toBe(loadedDataState.advertiserResulPage);
  });

  it('should returns error state', () => {
    const error = AdvertiserSelectors.error.projector(initialDataState);
    expect(error).toBe(initialDataState.error);
  });

  it('should returns apiState', () => {
    const apiState = AdvertiserSelectors.apiState.projector(initialDataState);
    expect(apiState).toBe(initialDataState.apiState);
  });

  it('should returns currentAdvertiser state', () => {
    const currentAdvertiser = AdvertiserSelectors.currentAdvertiser.projector(loadedCurrentDataState);
    expect(currentAdvertiser).toEqual(loadedCurrentDataState.currentAdvertiser);
  });

  it('should returns null valiue for currentAdvertiser state', () => {
    const currentAdvertiser = AdvertiserSelectors.currentAdvertiser.projector(loadedDataState);
    expect(currentAdvertiser).toEqual(loadedDataState.currentAdvertiser);
  });

  it('should returns null', () => {
    const error = AdvertiserSelectors.error.projector(initialErrorDataState);
    expect(error).toBe(null);
  });

  it('should returns error state', () => {
    const error = AdvertiserSelectors.error.projector(errorDataState);
    expect(error?.statusText).toBe('error');
  });
});
