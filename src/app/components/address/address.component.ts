import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';
import { ApiState } from '../../shared/enum/api-state.num';
import { AddressModel } from '../../shared/models/address.model';
import { AddressActions } from '../../store/address/address-store.actions';
import { AddressStoreState } from '../../store/address/address-store.reducer';
import { AddressSelectors } from '../../store/address/address-store.selectors';

@UntilDestroy()
@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss'],
})
export class AddressComponent implements OnInit {
  apiAdressState$ = this.addressStore.pipe(select(AddressSelectors.apiState));
  apiState: ApiState | null = ApiState.Init;
  isSaving = false;

  addressForm: FormGroup = this.fb.group({
    id: new FormControl(0, Validators.compose([Validators.required])),
    address: new FormControl('', Validators.compose([Validators.required])),
    city: new FormControl('', Validators.compose([Validators.required])),
    postcode: new FormControl('', Validators.compose([Validators.required])),
  });

  constructor(
    private fb: FormBuilder,
    private addressStore: Store<AddressStoreState>,
    public dialogRef: MatDialogRef<AddressComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AddressModel,
  ) {}

  ngOnInit() {
    this.apiAdressState$.pipe(untilDestroyed(this)).subscribe((result: ApiState | null) => {
      if (result) {
        this.apiState = result;
        if ((result === ApiState.Done || result === ApiState.Error) && this.isSaving) {
          this.isSaving = false;
          this.dialogRef.close();
        }
      }
    });

    if (this.data) {
      this.addressForm.get('id')?.setValue(this.data.id);
      this.addressForm.get('address')?.setValue(this.data.address);
      this.addressForm.get('city')?.setValue(this.data.city);
      this.addressForm.get('postcode')?.setValue(this.data.postcode);
    }
  }

  saveAdress() {
    this.isSaving = false;
    if (this.addressForm.valid) {
      this.isSaving = true;
      let data: AddressModel = {
        id: this.addressForm.get('id')?.value,
        address: this.addressForm.get('address')?.value,
        city: this.addressForm.get('city')?.value,
        postcode: this.addressForm.get('postcode')?.value,
      };
      data.id !== 0
        ? this.updateMockData(data)
        : this.addressStore.dispatch(AddressActions.addAddress({ payload: data }));
    } else {
      this.addressForm.markAllAsTouched();
    }
  }

  updateMockData(data: AddressModel) {
    this.addressStore.dispatch(AddressActions.updateAddress({ payload: data }));
  }
}
