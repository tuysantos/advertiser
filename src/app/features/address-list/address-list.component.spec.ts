import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EffectsModule } from '@ngrx/effects';
import { Store, StoreModule } from '@ngrx/store';
import { of } from 'rxjs';
import { ApiState } from 'src/app/shared/enum/api-state.num';
import { AddressModel } from 'src/app/shared/models/address.model';
import { NotificationService } from '../../services/notification/notification.service';
import { AdvertiserModel } from '../../shared/models/advertiser.model';
import { PageResultModel } from '../../shared/models/page-result.model';
import { AddressActions } from '../../store/address/address-store.actions';
import { AddressStoreState } from '../../store/address/address-store.reducer';
import { AddressListComponent } from './address-list.component';

describe('AddressListComponent', () => {
  let component: AddressListComponent;
  let fixture: ComponentFixture<AddressListComponent>;
  let addressStore: Store<AddressStoreState>;

  const advertiserData: PageResultModel<AdvertiserModel> = {
    'hydra:member': [
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
      {
        id: 2,
        name: 'May advertiser 2',
        orgurl: 'www.rrrr.com',
        firstName: 'Paul',
        lastName: 'Brown',
        email: 'pbrown@test.com',
        telephone: '98765432',
        address: '/address/2',
      },
    ],
    'hydra:totalItems': 2,
  };

  const addressMockData: PageResultModel<AddressModel> = {
    'hydra:member': [
      {
        id: 123,
        address: 'My address',
        city: 'London',
        postcode: 'TE1 2WE',
      },
      {
        id: 333,
        address: 'My address 2',
        city: 'Manchester',
        postcode: 'XPTO',
      },
    ],
    'hydra:totalItems': 2,
  };

  const dialogRef = {
    open: () => afterDialog,
    afterClosed: () => of(false),
  };

  const afterDialog = {
    afterClosed: () => of(false),
  };

  const matSnackBar = {
    open: () => {},
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddressListComponent],
      imports: [StoreModule.forRoot({}), EffectsModule.forRoot([])],
      providers: [
        NotificationService,
        {
          provide: MatDialog,
          useValue: dialogRef,
        },
        {
          provide: MatSnackBar,
          useValue: matSnackBar,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddressListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressListComponent);
    component = fixture.componentInstance;
    addressStore = TestBed.inject(Store);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialise data', () => {
    spyOn(addressStore, 'dispatch').and.callThrough();
    spyOn(component, 'openDialog').and.callThrough();
    spyOn(component, 'buildResulList').and.callThrough();
    spyOn(component, 'buildAddressIdInUse').and.callThrough();

    component.apiState$ = of(ApiState.Done);
    component.currentAddresses$ = of(addressMockData['hydra:member'][0]);
    component.addresses$ = of(addressMockData);
    component.advertisers$ = of(advertiserData);

    component.ngOnInit();

    expect(component.openDialog).toHaveBeenCalledWith(addressMockData['hydra:member'][0]);
    expect(component.buildResulList).toHaveBeenCalledWith(addressMockData);
    expect(component.buildAddressIdInUse).toHaveBeenCalledWith(advertiserData);
    expect(component.apiState).toEqual(ApiState.Done);
    expect(addressStore.dispatch).toHaveBeenCalledWith(AddressActions.getAddresses());
  });

  it('should add New Address', () => {
    spyOn(component, 'openDialog').and.callThrough();

    component.addNewAddress();

    expect(component.openDialog).toHaveBeenCalledWith(null);
  });

  it('should call delete mockAddress', () => {
    spyOn(component, 'deleteMockAddress').and.callThrough();

    component.deleteAddress(7);

    expect(component.deleteMockAddress).toHaveBeenCalledWith(7);
  });

  it('should not call delete mockAddress', () => {
    spyOn(component, 'deleteMockAddress').and.callThrough();
    let notificationService = TestBed.inject(NotificationService);
    spyOn(notificationService, 'error').and.callThrough();

    component.deleteAddress(4);

    expect(component.deleteMockAddress).not.toHaveBeenCalled;
    expect(notificationService.error).toHaveBeenCalledWith('This record cannot be deleted!');
  });

  it('should deleteMockAddress', () => {
    spyOn(addressStore, 'dispatch').and.callThrough();
    spyOn(window, 'confirm').and.callFake(() => true);
    component.addressIdInUse = [1, 3];

    component.deleteMockAddress(2);

    expect(addressStore.dispatch).toHaveBeenCalledWith(AddressActions.deleteAddress({ payload: 2 }));
  });

  it('should not deleteMockAddress because is in use', () => {
    spyOn(addressStore, 'dispatch').and.callThrough();
    spyOn(window, 'confirm').and.callFake(() => true);
    let notificationService = TestBed.inject(NotificationService);
    spyOn(notificationService, 'error').and.callThrough();
    component.addressIdInUse = [1, 3];

    component.deleteMockAddress(3);

    expect(addressStore.dispatch).not.toHaveBeenCalled();
    expect(notificationService.error).toHaveBeenCalledWith('This address cannot be deleted because it is in use.');
  });

  it('should buildAddressIdInUse', () => {
    component.addressIdInUse = [];

    component.buildAddressIdInUse(advertiserData);

    expect(component.addressIdInUse.length).toEqual(2);
  });

  it('should return address Id', () => {
    const result = component.getAddressById('/address/1');

    expect(result).toEqual(1);
  });

  it('should not return address Id', () => {
    const result = component.getAddressById('address');

    expect(result).toEqual(0);
  });

  it('should return empty address Id as 0', () => {
    const result = component.getAddressById('');

    expect(result).toEqual(0);
  });

  it('should return address Id as 0', () => {
    const result = component.getAddressById('/address/t');

    expect(result).toEqual(0);
  });

  it('should edit Address', () => {
    let notificationService = TestBed.inject(NotificationService);
    spyOn(notificationService, 'error').and.callThrough();
    spyOn(component, 'getMockAddress').and.callThrough();

    component.editAddress(7);

    expect(component.getMockAddress).toHaveBeenCalledWith(7);
    expect(notificationService.error).not.toHaveBeenCalledWith('This record cannot be edited!');
  });

  it('should not edit Address', () => {
    let notificationService = TestBed.inject(NotificationService);
    spyOn(notificationService, 'error').and.callThrough();
    spyOn(component, 'getMockAddress').and.callThrough();

    component.editAddress(4);

    expect(component.getMockAddress).not.toHaveBeenCalled();
    expect(notificationService.error).toHaveBeenCalledWith('This record cannot be edited!');
  });

  it('should getMockAddress and openDialog', () => {
    spyOn(component, 'openDialog').and.callThrough();
    const obj = JSON.stringify([
      {
        id: 1,
        address: 'Address 123',
        city: 'London',
        postcode: 'WE1 3RT',
      },
    ]);
    spyOn(window.sessionStorage, 'getItem').and.returnValue(obj);

    component.getMockAddress(1);

    expect(component.openDialog).toHaveBeenCalled();
  });

  it('should getMockAddress and not openDialog', () => {
    spyOn(component, 'openDialog').and.callThrough();
    const obj = JSON.stringify([
      {
        id: 1,
        address: 'Address 123',
        city: 'London',
        postcode: 'WE1 3RT',
      },
    ]);
    spyOn(window.sessionStorage, 'getItem').and.returnValue(obj);

    component.getMockAddress(4);

    expect(component.openDialog).not.toHaveBeenCalled();
  });

  it('should buildResulList with id set to 0', () => {
    const addressMockData: PageResultModel<AddressModel> = {
      'hydra:member': [
        {
          address: 'My address',
          city: 'London',
          postcode: 'TE1 2WE',
        },
        {
          id: 333,
          address: 'My address 2',
          city: 'Manchester',
          postcode: 'XPTO',
        },
      ],
      'hydra:totalItems': 2,
    };

    component.addressList = [];

    component.buildResulList(addressMockData);

    expect(component.addressList[0]['id']).toEqual(0);
  });
});
