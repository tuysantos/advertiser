import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EffectsModule } from '@ngrx/effects';
import { Store, StoreModule } from '@ngrx/store';
import { of } from 'rxjs';
import { ApiState } from 'src/app/shared/enum/api-state.num';
import { AddressModel } from '../../shared/models/address.model';
import { AddressActions } from '../../store/address/address-store.actions';

import { AddressComponent } from './address.component';

describe('AddressComponent', () => {
  let component: AddressComponent;
  let fixture: ComponentFixture<AddressComponent>;
  let store: Store;

  const mockDialogData: AddressModel = {
    id: 123,
    address: 'My address',
    city: 'London',
    postcode: 'TE1 2WE',
  };

  const dialogRef = {
    close: () => {},
    afterClosed: () => of(false),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddressComponent],
      imports: [ReactiveFormsModule, StoreModule.forRoot({}), EffectsModule.forRoot([])],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: mockDialogData,
        },
        {
          provide: MatDialogRef,
          useValue: dialogRef,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    spyOn(store, 'dispatch').and.callThrough();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialise data', () => {
    spyOn(dialogRef, 'close').and.callThrough();
    component.apiAdressState$ = of(ApiState.Done);
    component.isSaving = true;

    component.ngOnInit();

    expect(dialogRef.close).toHaveBeenCalled();
    expect(component.isSaving).toEqual(false);
    expect(component.apiState).toEqual(ApiState.Done);
  });

  it('should save data', () => {
    spyOn(component, 'updateMockData').and.callThrough();
    component.addressForm = new FormGroup({
      id: new FormControl(0, [Validators.required]),
      address: new FormControl('My address', [Validators.required]),
      city: new FormControl('London', [Validators.required]),
      postcode: new FormControl('WC1 2RE', [Validators.required]),
    });

    const data: AddressModel = {
      id: 0,
      address: 'My address',
      city: 'London',
      postcode: 'WC1 2RE',
    };

    component.saveAdress();

    expect(store.dispatch).toHaveBeenCalledWith(AddressActions.addAddress({ payload: data }));
    expect(component.updateMockData).not.toHaveBeenCalledWith(data);
  });

  it('should save mockdata', () => {
    spyOn(component, 'updateMockData').and.callThrough();
    component.addressForm = new FormGroup({
      id: new FormControl(3, [Validators.required]),
      address: new FormControl('My address', [Validators.required]),
      city: new FormControl('London', [Validators.required]),
      postcode: new FormControl('WC1 2RE', [Validators.required]),
    });

    const data: AddressModel = {
      id: 3,
      address: 'My address',
      city: 'London',
      postcode: 'WC1 2RE',
    };

    component.saveAdress();

    expect(store.dispatch).not.toHaveBeenCalledWith(AddressActions.addAddress({ payload: data }));
    expect(component.updateMockData).toHaveBeenCalledWith(data);
  });

  it('should not save data', () => {
    spyOn(component, 'updateMockData').and.callThrough();
    component.addressForm = new FormGroup({
      id: new FormControl(null, [Validators.required]),
      address: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
      postcode: new FormControl('WC1 2RE', [Validators.required]),
    });

    component.saveAdress();

    expect(store.dispatch).not.toHaveBeenCalled();
    expect(component.updateMockData).not.toHaveBeenCalled();
    expect(component.addressForm.valid).toEqual(false);
  });

  it('should update mockdata', () => {
    const data: AddressModel = {
      id: 3,
      address: 'My address',
      city: 'London',
      postcode: 'WC1 2RE',
    };
    component.updateMockData(data);
    expect(store.dispatch).toHaveBeenCalledWith(AddressActions.updateAddress({ payload: data }));
  });

  it('should not have an empty form', () => {
    component.ngOnInit();
    expect(component.addressForm.get('address')?.value).toEqual('My address');
  });

  it('should throw an error and close dialog', () => {
    spyOn(dialogRef, 'close').and.callThrough();
    component.apiAdressState$ = of(ApiState.Error);
    component.isSaving = true;

    component.ngOnInit();

    expect(dialogRef.close).toHaveBeenCalled();
    expect(component.isSaving).toEqual(false);
    expect(component.apiState).toEqual(ApiState.Error);
  });
});
