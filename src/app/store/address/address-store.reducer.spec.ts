import { HttpErrorResponse } from '@angular/common/http';
import { ApiState } from 'src/app/shared/enum/api-state.num';
import { AddressModel } from 'src/app/shared/models/address.model';
import { PageResultModel } from 'src/app/shared/models/page-result.model';
import { AddressActions } from './address-store.actions';
import { AddressStoreReducer, AddressStoreState, reducer } from './address-store.reducer';

describe('AddressStoreReducer', () => {
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

  const cuurentAddress: AddressModel = {
    id: 2,
    address: "Convertr Media 6-8, St. John's Square",
    city: 'London',
    postcode: 'EC1M 4NH',
    updatedTs: '2017-04-03T10:01:27+00:00',
  };

  const initialState: AddressStoreState = {
    addressResulPage: null,
    currentAdress: null,
    apiState: ApiState.Init,
    error: null,
  };

  const loadedState: AddressStoreState = {
    addressResulPage: mockAddressResults,
    currentAdress: null,
    apiState: ApiState.Done,
    error: null,
  };

  const loadedCurrentAddressState: AddressStoreState = {
    addressResulPage: mockAddressResults,
    currentAdress: cuurentAddress,
    apiState: ApiState.Done,
    error: null,
  };

  beforeEach(() => {
    sessionStorage.removeItem('addressCached');
  });

  it('should create a reducer', () => {
    const result = AddressStoreReducer.reducer(initialState, AddressActions.getAddresses);
    expect(result.apiState).toEqual(ApiState.Pending);
  });

  it('should fire getAddressesSuccess action', () => {
    const cachedData: AddressModel[] = [
      {
        id: 2,
        address: 'Mock Address 1',
        city: 'Liverpool',
        postcode: 'CC1 3ER',
      },
    ];
    sessionStorage.setItem('addressCached', JSON.stringify(cachedData));

    const result = AddressStoreReducer.reducer(
      loadedCurrentAddressState,
      AddressActions.getAddressesSuccess({
        payload: mockAddressResults,
      }),
    );

    expect(result.addressResulPage).toBeTruthy();
  });

  it('should fire getAddressesFailure action', () => {
    const result = AddressStoreReducer.reducer(
      initialState,
      AddressActions.getAddressesFailure(new HttpErrorResponse({ error: 'some error occured' })),
    );
    expect(result.apiState).toEqual(ApiState.Error);
  });

  it('should fire getAddressSuccess action', () => {
    const result = AddressStoreReducer.reducer(
      loadedCurrentAddressState,
      AddressActions.getAddressSuccess({
        payload: cuurentAddress,
      }),
    );
    expect(result.currentAdress).toEqual(cuurentAddress);
  });

  it('should fire getAddressFailure action', () => {
    const result = AddressStoreReducer.reducer(
      loadedState,
      AddressActions.getAddressFailure(new HttpErrorResponse({ error: 'some error occured' })),
    );
    expect(result.apiState).toEqual(ApiState.Error);
  });

  it('should fire addAddressSuccess action', () => {
    const cachedData: AddressModel[] = [
      {
        id: 8,
        address: 'Mock Address 1',
        city: 'Liverpool',
        postcode: 'CC1 3ER',
      },
    ];
    sessionStorage.setItem('addressCached', JSON.stringify(cachedData));
    const newAddress: AddressModel = {
      id: 7,
      address: "Convertr Media 6-8, St. John's Square",
      city: 'London',
      postcode: 'EC1M 4NH',
    };
    const result = AddressStoreReducer.reducer(
      loadedState,
      AddressActions.addAddressSuccess({
        payload: newAddress,
      }),
    );

    expect(result.currentAdress).toEqual(newAddress);
    expect(result.addressResulPage?.['hydra:totalItems']).toEqual(3);
    expect(result.apiState).toEqual(ApiState.Done);
  });

  it('should fire addAddressFailure action', () => {
    const result = AddressStoreReducer.reducer(
      loadedState,
      AddressActions.addAddressFailure(new HttpErrorResponse({ error: 'some error occured' })),
    );
    expect(result.apiState).toEqual(ApiState.Error);
  });

  it('should fire updateAddressSuccess action', () => {
    const cachedData: AddressModel[] = [
      {
        id: 2,
        address: 'Mock Address 1',
        city: 'Liverpool',
        postcode: 'CC1 3ER',
      },
    ];
    sessionStorage.setItem('addressCached', JSON.stringify(cachedData));

    const oldAddress: AddressModel = {
      id: 2,
      address: 'New Address',
      city: 'London',
      postcode: 'EC1M 4NH',
      updatedTs: '2017-04-03T10:01:27+00:00',
    };

    const result = AddressStoreReducer.reducer(
      loadedCurrentAddressState,
      AddressActions.updateAddressSuccess({
        payload: oldAddress,
      }),
    );

    expect(result.currentAdress).toEqual(oldAddress);
    expect(result.addressResulPage?.['hydra:totalItems']).toEqual(2);
    expect(result.apiState).toEqual(ApiState.Done);
  });

  it('should fire updateAddressFailure action', () => {
    const result = AddressStoreReducer.reducer(
      loadedCurrentAddressState,
      AddressActions.updateAddressFailure(new HttpErrorResponse({ error: 'some error occured' })),
    );
    expect(result.apiState).toEqual(ApiState.Error);
  });

  it('should fire deleteAddressSuccess action', () => {
    const cachedData: AddressModel[] = [
      {
        id: 2,
        address: 'Mock Address 1',
        city: 'Liverpool',
        postcode: 'CC1 3ER',
      },
    ];
    sessionStorage.setItem('addressCached', JSON.stringify(cachedData));

    const result = AddressStoreReducer.reducer(
      loadedCurrentAddressState,
      AddressActions.deleteAddressSuccess({
        payload: 2,
      }),
    );

    expect(result.addressResulPage?.['hydra:totalItems']).toEqual(1);
    expect(result.currentAdress).toEqual(null);
    expect(result.apiState).toEqual(ApiState.Done);
  });

  it('should fire deleteAddressFailure action', () => {
    const result = AddressStoreReducer.reducer(
      loadedCurrentAddressState,
      AddressActions.deleteAddressFailure(new HttpErrorResponse({ error: 'some error occured' })),
    );
    expect(result.apiState).toEqual(ApiState.Error);
  });

  it('should create a reducer', () => {
    const initialState: AddressStoreState = {
      addressResulPage: null,
      currentAdress: null,
      apiState: ApiState.Init,
      error: null,
    };

    const result = reducer(
      initialState,
      AddressActions.getAddressesSuccess({
        payload: mockAddressResults,
      }),
    );

    expect(result).toBeTruthy();
  });

  it('should fire addAddressSuccess action without cache data', () => {
    const newAddress: AddressModel = {
      id: 7,
      address: "Convertr Media 6-8, St. John's Square",
      city: 'London',
      postcode: 'EC1M 4NH',
    };
    const result = AddressStoreReducer.reducer(
      loadedState,
      AddressActions.addAddressSuccess({
        payload: newAddress,
      }),
    );

    expect(result.currentAdress).toEqual(newAddress);
    expect(result.addressResulPage?.['hydra:totalItems']).toEqual(3);
    expect(result.apiState).toEqual(ApiState.Done);
  });
});
