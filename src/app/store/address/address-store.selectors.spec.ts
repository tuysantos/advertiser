import { HttpErrorResponse } from '@angular/common/http';
import { ApiState } from '../../shared/enum/api-state.num';
import { AddressModel } from '../../shared/models/address.model';
import { PageResultModel } from '../../shared/models/page-result.model';
import { AddressStoreState } from './address-store.reducer';
import { AddressSelectors } from './address-store.selectors';

describe('AddressSelectors', () => {
  const mockAddressResults: PageResultModel<AddressModel> = {
    'hydra:member': [
      {
        id: 1,
        address: "Convertr Media 6-8, St. John's Square",
        city: 'London',
        postcode: 'EC1M 4NH',
        updatedTs: '2017-04-03T10:01:27+00:00',
      },
      {
        id: 2,
        address: "Convertr Media 6-8, St. John's Square",
        city: 'London',
        postcode: 'EC1M 4NH',
        updatedTs: '2017-04-03T10:01:27+00:00',
      },
    ],
    'hydra:totalItems': 2,
  };

  const address: AddressModel = {
    id: 6,
    address: "Convertr Media 6-8, St. John's Square",
    city: 'London',
    postcode: 'EC1M 4NH',
  };

  const initialDataState: AddressStoreState = {
    addressResulPage: null,
    currentAdress: null,
    apiState: ApiState.Init,
    error: null,
  };

  const loadedDataState: AddressStoreState = {
    addressResulPage: mockAddressResults,
    currentAdress: null,
    apiState: ApiState.Done,
    error: null,
  };

  const loadedCurrentDataState: AddressStoreState = {
    addressResulPage: mockAddressResults,
    currentAdress: address,
    apiState: ApiState.Done,
    error: null,
  };

  const initialErrorDataState: AddressStoreState = {
    addressResulPage: null,
    currentAdress: null,
    apiState: ApiState.Init,
    error: null,
  };

  const errorDataState: AddressStoreState = {
    addressResulPage: null,
    currentAdress: null,
    apiState: ApiState.Error,
    error: new HttpErrorResponse({
      status: 400,
      statusText: 'error',
      url: '',
      error: {
        Errors: [
          {
            Code: 'Error occurred',
            PropertyName: 'my property',
            PropertyValues: null,
            Message: 'error in this country',
          },
        ],
      },
    }),
  };

  it('should returns addressResulPage state', () => {
    const addressResulPage = AddressSelectors.addressResulPage.projector(loadedDataState);
    expect(addressResulPage).toBe(loadedDataState.addressResulPage);
  });

  it('should returns error state', () => {
    const error = AddressSelectors.error.projector(initialDataState);
    expect(error).toBe(initialDataState.error);
  });

  it('should returns apiState', () => {
    const apiState = AddressSelectors.apiState.projector(initialDataState);
    expect(apiState).toBe(initialDataState.apiState);
  });

  it('should returns currentAdress state', () => {
    const currentAdress = AddressSelectors.currentAdress.projector(loadedCurrentDataState);
    expect(currentAdress).toEqual(loadedCurrentDataState.currentAdress);
  });

  it('should returns null', () => {
    const error = AddressSelectors.error.projector(initialErrorDataState);
    expect(error).toBe(null);
  });

  it('should returns error state', () => {
    const error = AddressSelectors.error.projector(errorDataState);
    expect(error?.statusText).toBe('error');
  });
});
