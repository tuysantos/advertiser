import { HttpErrorResponse } from '@angular/common/http';
import { Action, createReducer, on } from '@ngrx/store';
import { ApiState } from '../../shared/enum/api-state.num';
import { AddressModel } from '../../shared/models/address.model';
import { PageResultModel } from '../../shared/models/page-result.model';
import { AddressActions } from './address-store.actions';

export interface AddressStoreState {
  addressResulPage: PageResultModel<AddressModel> | null;
  currentAdress: AddressModel | null;
  apiState: ApiState;
  error: HttpErrorResponse | null;
}

const initialState: AddressStoreState = {
  addressResulPage: null,
  currentAdress: null,
  apiState: ApiState.Init,
  error: null,
};

function addAddress(address: AddressModel, listOfAddress: AddressModel[]): PageResultModel<AddressModel> {
  const newItem = { ...address, id: 0 };
  const obj = sessionStorage.getItem('addressCached');
  const cachedData: AddressModel[] = obj ? (JSON.parse(obj) as unknown as AddressModel[]) : [];

  if (cachedData.length > 0) {
    newItem.id = listOfAddress.length + cachedData.length + 1;
    cachedData.push(newItem);
  } else {
    newItem.id = listOfAddress.length + 1;
    cachedData.push(newItem);
  }
  sessionStorage.setItem('addressCached', JSON.stringify(cachedData));

  return {
    'hydra:member': [...listOfAddress, newItem],
    'hydra:totalItems': listOfAddress.length + 1,
  };
}

function updateAddress(address: AddressModel, listOfAddress: AddressModel[]): PageResultModel<AddressModel> {
  const obj = sessionStorage.getItem('addressCached');
  const cachedData: AddressModel[] = obj ? (JSON.parse(obj) as unknown as AddressModel[]) : [];
  const tempData = [...listOfAddress];

  if (cachedData.length > 0) {
    const indexMock = cachedData.findIndex(item => item.id === address.id);
    const index = tempData.findIndex(item => item.id === address.id);
    if (indexMock > -1) {
      cachedData[indexMock] = address;
      sessionStorage.setItem('addressCached', JSON.stringify(cachedData));
      tempData[index] = address;
    }
  }
  return {
    'hydra:member': [...tempData],
    'hydra:totalItems': tempData.length,
  };
}

function deleteAddress(addressId: number, listOfAddress: AddressModel[]): PageResultModel<AddressModel> {
  const obj = sessionStorage.getItem('addressCached');
  let cachedData: AddressModel[] = obj ? (JSON.parse(obj) as unknown as AddressModel[]) : [];
  const tempData = listOfAddress.filter(item => item.id !== addressId);
  if (cachedData.length > 0) {
    cachedData = cachedData.filter(item => item.id !== addressId);
    sessionStorage.setItem('addressCached', JSON.stringify(cachedData));
  }
  return {
    'hydra:member': [...tempData],
    'hydra:totalItems': tempData.length,
  };
}

function getMockData(data: PageResultModel<AddressModel>): PageResultModel<AddressModel> {
  let tempData: PageResultModel<AddressModel> = { ...data };
  const obj = sessionStorage.getItem('addressCached');
  const cachedData: AddressModel[] = obj ? (JSON.parse(obj) as unknown as AddressModel[]) : [];

  if (cachedData.length > 0) {
    tempData['hydra:member'] = [...data['hydra:member'], ...cachedData];
    tempData['hydra:totalItems'] = data['hydra:member'].length + cachedData.length;
  }
  return tempData;
}

export class AddressStoreReducer {
  public static featureSelectorKey = 'address';

  public static reducer = createReducer(
    initialState,

    // getting addresses
    on(AddressActions.getAddresses, (state: AddressStoreState) => ({
      ...state,
      currentAdress: null,
      apiState: ApiState.Pending,
      error: null,
    })),
    on(AddressActions.getAddressesSuccess, (_, { payload }) => ({
      addressResulPage: getMockData(payload),
      currentAdress: null,
      apiState: ApiState.Done,
      error: null,
    })),
    on(AddressActions.getAddressesFailure, (state, { error }) => ({
      ...state,
      apiState: ApiState.Error,
      error,
    })),

    // getting address by id
    on(AddressActions.getAddress, (state: AddressStoreState) => ({
      ...state,
      currentAdress: null,
      apiState: ApiState.Pending,
      error: null,
    })),
    on(AddressActions.getAddressSuccess, (state, { payload }) => ({
      ...state,
      currentAdress: payload,
      apiState: ApiState.Done,
      error: null,
    })),
    on(AddressActions.getAddressFailure, (state, { error }) => ({
      ...state,
      apiState: ApiState.Error,
      error,
    })),

    // adding new address
    on(AddressActions.addAddress, (state: AddressStoreState) => ({
      ...state,
      currentAdress: null,
      apiState: ApiState.Pending,
      error: null,
    })),
    on(AddressActions.addAddressSuccess, (state, { payload }) => ({
      addressResulPage: state.addressResulPage ? addAddress(payload, state.addressResulPage?.['hydra:member']) : null,
      currentAdress: payload,
      apiState: ApiState.Done,
      error: null,
    })),
    on(AddressActions.addAddressFailure, (state, { error }) => ({
      ...state,
      apiState: ApiState.Error,
      error,
    })),

    // update address
    on(AddressActions.updateAddress, (state: AddressStoreState) => ({
      ...state,
      currentAdress: null,
      apiState: ApiState.Pending,
      error: null,
    })),
    on(AddressActions.updateAddressSuccess, (state, { payload }) => ({
      addressResulPage: state.addressResulPage
        ? updateAddress(payload, state.addressResulPage?.['hydra:member'])
        : null,
      currentAdress: payload,
      apiState: ApiState.Done,
      error: null,
    })),
    on(AddressActions.updateAddressFailure, (state, { error }) => ({
      ...state,
      apiState: ApiState.Error,
      error,
    })),

    // delete address
    on(AddressActions.deleteAddress, (state: AddressStoreState) => ({
      ...state,
      currentAdress: null,
      apiState: ApiState.Pending,
      error: null,
    })),
    on(AddressActions.deleteAddressSuccess, (state, { payload }) => ({
      addressResulPage: state.addressResulPage
        ? deleteAddress(payload, state.addressResulPage?.['hydra:member'])
        : null,
      currentAdress: null,
      apiState: ApiState.Done,
      error: null,
    })),
    on(AddressActions.deleteAddressFailure, (state, { error }) => ({
      ...state,
      apiState: ApiState.Error,
      error,
    })),
  );
}

export function reducer(state: AddressStoreState, action: Action) {
  return AddressStoreReducer.reducer(state, action);
}
