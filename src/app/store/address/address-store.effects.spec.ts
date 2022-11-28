import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, ReplaySubject, throwError } from 'rxjs';
import { AddressesService } from '../../services/address/addresses.service';
import { AddressModel } from '../../shared/models/address.model';
import { PageResultModel } from '../../shared/models/page-result.model';
import { AddressActions } from './address-store.actions';
import { AddressEffects } from './address-store.effects';

const address: AddressModel = {
  id: 6,
  address: "Convertr Media 6-8, St. John's Square",
  city: 'London',
  postcode: 'EC1M 4NH',
};

const mockResults: PageResultModel<AddressModel> = {
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

describe('AddressEffects', () => {
  let action, addressesService;
  let actions: ReplaySubject<any>;

  class AddressesServiceMock {
    option = 0;
    getAddresses(): Observable<PageResultModel<AddressModel>> {
      return this.option === 1
        ? throwError(() => new HttpErrorResponse({ error: 'some error occured' }))
        : of(mockResults);
    }

    getAddressById(id: number): Observable<AddressModel> {
      return id > 1 ? throwError(() => new HttpErrorResponse({ error: 'some error occured' })) : of(address);
    }

    deleteAddress(id: number) {
      return id > 1 ? throwError(() => new HttpErrorResponse({ error: 'some error occured' })) : of(id);
    }

    addAddress(address: AddressModel): Observable<AddressModel> {
      return address.postcode === 'Error'
        ? throwError(() => new HttpErrorResponse({ error: 'some error occured' }))
        : of(address);
    }

    updateAddress(address: AddressModel): Observable<AddressModel> {
      return address.postcode === 'Error'
        ? throwError(() => new HttpErrorResponse({ error: 'some error occured' }))
        : of(address);
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AddressEffects,
        provideMockActions(() => actions),
        {
          provide: AddressesService,
          useFactory: () => new AddressesServiceMock(),
        },
        HttpClientTestingModule,
      ],
    });
  });

  beforeEach(() => {
    addressesService = TestBed.inject(AddressesService);
    actions = new ReplaySubject(1);
  });

  it('should be created', () => {
    const effects: AddressEffects = TestBed.inject(AddressEffects);
    expect(effects).toBeTruthy();
  });

  it('should dispatch getAddressesSuccess', async () => {
    const effects: AddressEffects = TestBed.inject(AddressEffects);
    action = AddressActions.getAddresses();
    actions.next(action);
    effects.getAddresses$.subscribe(result => {
      expect(result.type).toEqual('[Get addresses API] Get addresses Success');
    });
  });

  it('should dispatch getAddressSuccess', async () => {
    const effects: AddressEffects = TestBed.inject(AddressEffects);
    action = AddressActions.getAddress({ payload: 1 });
    actions.next(action);
    effects.getAddressById$.subscribe(result => {
      expect(result.type).toEqual('[Get address API] Get address Success');
    });
  });

  it('should dispatch getAddressFailure', async () => {
    const effects: AddressEffects = TestBed.inject(AddressEffects);
    action = AddressActions.getAddress({ payload: 10 });
    actions.next(action);
    effects.getAddresses$.subscribe(result => {
      expect(result.type).toEqual('[Get address API] Get address Failure');
    });
  });

  it('should dispatch deleteAddressSuccess', async () => {
    const effects: AddressEffects = TestBed.inject(AddressEffects);
    action = AddressActions.deleteAddress({ payload: 1 });
    actions.next(action);
    effects.deleteAddress$.subscribe(result => {
      expect(result.type).toEqual('[Delete Address API] Delete Address Success');
    });
  });

  it('should dispatch deleteAddressFailure', async () => {
    const effects: AddressEffects = TestBed.inject(AddressEffects);
    action = AddressActions.deleteAddress({ payload: 10 });
    actions.next(action);
    effects.deleteAddress$.subscribe(result => {
      expect(result.type).toEqual('[Delete Address API] Delete Address Failure');
    });
  });

  it('should dispatch addAddressSuccess', async () => {
    const address: AddressModel = {
      id: 6,
      address: "Convertr Media 6-8, St. John's Square",
      city: 'London',
      postcode: 'EC1M 4NH',
    };
    const effects: AddressEffects = TestBed.inject(AddressEffects);
    action = AddressActions.addAddress({ payload: address });
    actions.next(action);
    effects.addAddress$.subscribe(result => {
      expect(result.type).toEqual('[Post Address API] Post Address Success');
    });
  });

  it('should dispatch addAddressFailure', async () => {
    const address: AddressModel = {
      id: 6,
      address: "Convertr Media 6-8, St. John's Square",
      city: 'London',
      postcode: 'Error',
    };
    const effects: AddressEffects = TestBed.inject(AddressEffects);
    action = AddressActions.addAddress({ payload: address });
    actions.next(action);
    effects.addAddress$.subscribe(result => {
      expect(result.type).toEqual('[Post Address API] Post Address Failure');
    });
  });

  it('should dispatch updateAddressSuccess', async () => {
    const address: AddressModel = {
      id: 6,
      address: "Convertr Media 6-8, St. John's Square",
      city: 'London',
      postcode: 'EC1M 4NH',
    };
    const effects: AddressEffects = TestBed.inject(AddressEffects);
    action = AddressActions.updateAddress({ payload: address });
    actions.next(action);
    effects.updateAddress$.subscribe(result => {
      expect(result.type).toEqual('[Patch Address API] Patch Address Success');
    });
  });

  it('should dispatch updateAddressFailure', async () => {
    const address: AddressModel = {
      id: 6,
      address: "Convertr Media 6-8, St. John's Square",
      city: 'London',
      postcode: 'Error',
    };
    const effects: AddressEffects = TestBed.inject(AddressEffects);
    action = AddressActions.updateAddress({ payload: address });
    actions.next(action);
    effects.updateAddress$.subscribe(result => {
      expect(result.type).toEqual('[Patch Address API] Patch Address Failure');
    });
  });
});

describe('AddressEffects getAddressesFailure', () => {
  let action, addressesService;
  let actions: ReplaySubject<any>;

  class AddressesServiceMock {
    option = 1;
    getAddresses(): Observable<PageResultModel<AddressModel>> {
      return this.option === 1
        ? throwError(() => new HttpErrorResponse({ error: 'some error occured' }))
        : of(mockResults);
    }

    getAddressById(id: number): Observable<AddressModel> {
      return id > 1 ? throwError(() => new HttpErrorResponse({ error: 'some error occured' })) : of(address);
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AddressEffects,
        provideMockActions(() => actions),
        {
          provide: AddressesService,
          useFactory: () => new AddressesServiceMock(),
        },
        HttpClientTestingModule,
      ],
    });
  });

  beforeEach(() => {
    addressesService = TestBed.inject(AddressesService);
    actions = new ReplaySubject(1);
  });

  it('should dispatch getAddressesFailure', async () => {
    const effects: AddressEffects = TestBed.inject(AddressEffects);
    action = AddressActions.getAddresses();
    actions.next(action);
    effects.getAddresses$.subscribe(result => {
      expect(result.type).toEqual('[Get addresses API] Get addresses Failure');
    });
  });

  it('should dispatch getAddressFailure', async () => {
    const effects: AddressEffects = TestBed.inject(AddressEffects);
    action = AddressActions.getAddress({ payload: 10 });
    actions.next(action);
    effects.getAddressById$.subscribe(result => {
      expect(result.type).toEqual('[Get address API] Get address Failure');
    });
  });
});
