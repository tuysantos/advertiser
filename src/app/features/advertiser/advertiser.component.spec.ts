import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { EffectsModule } from '@ngrx/effects';
import { Store, StoreModule } from '@ngrx/store';
import { of } from 'rxjs';
import { ApiState } from 'src/app/shared/enum/api-state.num';
import { AddressModel } from 'src/app/shared/models/address.model';
import { AdvertiserModel } from 'src/app/shared/models/advertiser.model';
import { PageResultModel } from 'src/app/shared/models/page-result.model';
import { AddressActions } from 'src/app/store/address/address-store.actions';
import { AdvertisersActions } from 'src/app/store/advertiser/advertiser-store.action';
import { AdvertiserStoreState } from 'src/app/store/advertiser/advertiser-store.reducer';
import { AdvertiserComponent } from './advertiser.component';

describe('AdvertiserComponent', () => {
  let component: AdvertiserComponent;
  let fixture: ComponentFixture<AdvertiserComponent>;
  let advertiserStore: Store<AdvertiserStoreState>;

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
    close: () => {},
    afterClosed: () => of(false),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdvertiserComponent],
      imports: [ReactiveFormsModule, StoreModule.forRoot({}), EffectsModule.forRoot([])],
      providers: [
        {
          provide: MatDialogRef,
          useValue: dialogRef,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdvertiserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvertiserComponent);
    component = fixture.componentInstance;
    advertiserStore = TestBed.inject(Store);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should setAddress to 1', () => {
    component.addressList = [
      {
        id: 1,
        address: 'Address 1',
        city: 'Manchester',
        postcode: 'XX1 ER1',
      },
      {
        id: 2,
        address: 'Address 2',
        city: 'Londong',
        postcode: '2ER WQa',
      },
    ];

    component.setAddress({ value: 1 });

    expect(component.addressId).toEqual(1);
  });

  it('should setAddress to 0', () => {
    component.addressList = [
      {
        id: 1,
        address: 'Address 1',
        city: 'Manchester',
        postcode: 'XX1 ER1',
      },
      {
        id: 2,
        address: 'Address 2',
        city: 'Londong',
        postcode: '2ER WQa',
      },
    ];

    component.setAddress({ value: 5 });

    expect(component.addressId).toEqual(0);
  });

  it('should saveAdvertiser', () => {
    spyOn(advertiserStore, 'dispatch').and.callThrough();
    component.advertiserForm = new FormGroup({
      id: new FormControl(0, [Validators.required]),
      name: new FormControl('Stripe', [Validators.required]),
      orgurl: new FormControl('www.url.com', [Validators.required]),
      firstName: new FormControl('Paul', [Validators.required]),
      lastName: new FormControl('Smith', [Validators.required]),
      email: new FormControl('email@ddd.com', [Validators.required]),
      telephone: new FormControl('43543534534', [Validators.required]),
      addressId: new FormControl(1, [Validators.required]),
    });

    let data: AdvertiserModel = {
      id: 0,
      name: 'Stripe',
      orgurl: 'www.url.com',
      firstName: 'Paul',
      lastName: 'Smith',
      email: 'email@ddd.com',
      telephone: '43543534534',
      address: '/addresses/1',
    };

    component.saveAdvertiser();

    expect(advertiserStore.dispatch).toHaveBeenCalledWith(AdvertisersActions.addAdvertiser({ payload: data }));
  });

  it('should saveAdvertiser', () => {
    spyOn(advertiserStore, 'dispatch').and.callThrough();
    component.advertiserForm = new FormGroup({
      id: new FormControl(0, [Validators.required]),
      name: new FormControl('', [Validators.required]),
      orgurl: new FormControl('', [Validators.required]),
      firstName: new FormControl('Paul', [Validators.required]),
      lastName: new FormControl('Smith', [Validators.required]),
      email: new FormControl('email@ddd.com', [Validators.required]),
      telephone: new FormControl('43543534534', [Validators.required]),
      addressId: new FormControl(1, [Validators.required]),
    });

    component.saveAdvertiser();

    expect(advertiserStore.dispatch).not.toHaveBeenCalled();
    expect(component.advertiserForm.valid).toEqual(false);
  });

  it('should initialise data', () => {
    spyOn(advertiserStore, 'dispatch').and.callThrough();
    component.apiAdvertiserState$ = of(ApiState.Done);
    component.addresses$ = of(addressMockData);

    component.ngOnInit();

    expect(component.addressList.length).toEqual(2);
    expect(component.apiState).toEqual(ApiState.Done);
    expect(advertiserStore.dispatch).toHaveBeenCalledWith(AddressActions.getAddresses());
  });

  it('should throw an error and close dialog', () => {
    spyOn(dialogRef, 'close').and.callThrough();
    component.apiAdvertiserState$ = of(ApiState.Error);
    component.isSaving = true;

    component.ngOnInit();

    expect(dialogRef.close).toHaveBeenCalled();
    expect(component.isSaving).toEqual(false);
    expect(component.apiState).toEqual(ApiState.Error);
  });
});
