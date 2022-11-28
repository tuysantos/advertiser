import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { EffectsModule } from '@ngrx/effects';
import { Store, StoreModule } from '@ngrx/store';
import { EMPTY, of } from 'rxjs';
import { AddressModel } from 'src/app/shared/models/address.model';
import { AdvertiserModel } from 'src/app/shared/models/advertiser.model';
import { PageResultModel } from 'src/app/shared/models/page-result.model';
import { AddressActions } from '../..//store/address/address-store.actions';
import { AddressStoreState } from '../..//store/address/address-store.reducer';
import { AdvertisersActions } from '../..//store/advertiser/advertiser-store.action';
import { AdvertiserStoreState } from '../..//store/advertiser/advertiser-store.reducer';
import { ApiState } from '../../shared/enum/api-state.num';
import { AdvertiserListComponent } from './advertiser-list.component';

describe('AdvertiserListComponent', () => {
  let component: AdvertiserListComponent;
  let fixture: ComponentFixture<AdvertiserListComponent>;
  let advertiserStore: Store<AdvertiserStoreState>;
  let addressStore: Store<AddressStoreState>;

  const addressMockData: PageResultModel<AddressModel> = {
    'hydra:member': [
      {
        id: 1,
        address: 'My address',
        city: 'London',
        postcode: 'TE1 2WE',
      },
      {
        id: 20,
        address: 'My address 2',
        city: 'Manchester',
        postcode: 'XPTO',
      },
    ],
    'hydra:totalItems': 2,
  };

  const advertiserMockData: PageResultModel<AdvertiserModel> = {
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
      {
        name: 'My name 3',
        orgurl: 'my url 3',
        firstName: 'Ernest',
        lastName: 'Young',
        email: 'my email 3',
        telephone: '56767657',
        address: '/address/3',
      },
    ],
    'hydra:totalItems': 2,
  };

  const dialogRef = {
    open: () => afterDialog,
    afterClosed: () => of(false),
  };

  const afterDialog = {
    afterClosed: () => of(EMPTY),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdvertiserListComponent],
      imports: [StoreModule.forRoot({}), EffectsModule.forRoot([])],
      providers: [
        {
          provide: MatDialog,
          useValue: dialogRef,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdvertiserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvertiserListComponent);
    component = fixture.componentInstance;
    advertiserStore = TestBed.inject(Store);
    addressStore = TestBed.inject(Store);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialise data', () => {
    spyOn(component, 'buildAdvertisers').and.callThrough();
    spyOn(advertiserStore, 'dispatch').and.callThrough();
    component.apiAdvertiserState$ = of(ApiState.Done);
    component.apiAddressState$ = of(ApiState.Done);
    component.addresses$ = of(addressMockData);
    component.advertisers$ = of(advertiserMockData);

    component.ngOnInit();

    expect(component.buildAdvertisers).toHaveBeenCalledWith(advertiserMockData, addressMockData);
    expect(component.apiState).toEqual(ApiState.Done);
  });

  it('should loadData', () => {
    spyOn(addressStore, 'dispatch').and.callThrough();

    component.loadData();

    expect(advertiserStore.dispatch).toHaveBeenCalledWith(AdvertisersActions.getAdvertisers());
    expect(addressStore.dispatch).toHaveBeenCalledWith(AddressActions.getAddresses());
  });

  it('should return error ApiState', () => {
    const result = component.getApiState(ApiState.Error, ApiState.Done);
    expect(result).toEqual(ApiState.Error);
  });

  it('should return done ApiState', () => {
    const result = component.getApiState(ApiState.Done, ApiState.Done);
    expect(result).toEqual(ApiState.Done);
  });

  it('should return done ApiState', () => {
    const result = component.getApiState(ApiState.Done, ApiState.Pending);
    expect(result).toEqual(ApiState.Pending);
  });

  it('should return Init ApiState', () => {
    const result = component.getApiState(ApiState.Init, ApiState.Done);
    expect(result).toEqual(ApiState.Pending);
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

  it('should open dialog to add new address', () => {
    spyOn(dialogRef, 'open').and.callThrough();

    component.addNewAdvertiser();

    expect(dialogRef.open).toHaveBeenCalled();
  });
});
