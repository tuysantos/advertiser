import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';
import { ApiState } from '../../shared/enum/api-state.num';
import { AddressModel } from '../../shared/models/address.model';
import { AdvertiserModel } from '../../shared/models/advertiser.model';
import { PageResultModel } from '../../shared/models/page-result.model';
import { AddressActions } from '../../store/address/address-store.actions';
import { AddressStoreState } from '../../store/address/address-store.reducer';
import { AddressSelectors } from '../../store/address/address-store.selectors';
import { AdvertisersActions } from '../../store/advertiser/advertiser-store.action';
import { AdvertiserStoreState } from '../../store/advertiser/advertiser-store.reducer';
import { AdvertiserSelectors } from '../../store/advertiser/advertiser-store.selectors';

@UntilDestroy()
@Component({
  selector: 'app-advertise',
  templateUrl: './advertiser.component.html',
  styleUrls: ['./advertiser.component.scss'],
})
export class AdvertiserComponent implements OnInit {
  isSaving = false;
  addressList: AddressModel[] = [];
  addressId: number | undefined = 1;
  urlRegex = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';

  advertiserForm: FormGroup = this.fb.group({
    id: new FormControl(0, Validators.compose([Validators.required])),
    addressId: new FormControl(1, Validators.compose([Validators.required])),
    name: new FormControl('', Validators.compose([Validators.required])),
    orgurl: new FormControl('', Validators.compose([Validators.required, Validators.pattern(this.urlRegex)])),
    firstName: new FormControl('', Validators.compose([Validators.required])),
    lastName: new FormControl('', Validators.compose([Validators.required])),
    email: new FormControl('', Validators.compose([Validators.required, Validators.email])),
    telephone: new FormControl('', Validators.compose([Validators.required])),
    address: new FormControl('/addresses/', Validators.compose([Validators.required])),
  });

  apiAdvertiserState$ = this.advertiserStore.pipe(select(AdvertiserSelectors.apiState));
  addresses$ = this.addressStore.pipe(select(AddressSelectors.addressResulPage));
  apiState: ApiState | null = ApiState.Init;

  constructor(
    private fb: FormBuilder,
    private advertiserStore: Store<AdvertiserStoreState>,
    private addressStore: Store<AddressStoreState>,
    public dialogRef: MatDialogRef<AdvertiserComponent>,
  ) {}

  ngOnInit() {
    this.apiAdvertiserState$.pipe(untilDestroyed(this)).subscribe((result: ApiState | null) => {
      if (result) {
        this.apiState = result;
        if ((result === ApiState.Done || result === ApiState.Error) && this.isSaving) {
          this.isSaving = false;
          this.dialogRef.close();
        }
      }
    });

    this.addresses$.pipe(untilDestroyed(this)).subscribe((result: PageResultModel<AddressModel> | null) => {
      if (result) {
        this.addressList = [];
        result['hydra:member'].forEach(address => this.addressList.push(address));
      }
    });

    this.addressStore.dispatch(AddressActions.getAddresses());
  }

  setAddress(obj: any) {
    const index = this.addressList.findIndex(item => item.id === obj.value);
    this.addressId = index > -1 ? this.addressList[index].id : 0;
    this.advertiserForm.get('addressId')?.setValue(this.addressId);
  }

  saveAdvertiser() {
    this.isSaving = false;
    if (this.advertiserForm.valid) {
      this.isSaving = true;
      let data: AdvertiserModel = {
        id: this.advertiserForm.get('id')?.value,
        name: this.advertiserForm.get('name')?.value,
        orgurl: this.advertiserForm.get('orgurl')?.value,
        firstName: this.advertiserForm.get('firstName')?.value,
        lastName: this.advertiserForm.get('lastName')?.value,
        email: this.advertiserForm.get('email')?.value,
        telephone: this.advertiserForm.get('telephone')?.value,
        address: `/addresses/${this.advertiserForm.get('addressId')?.value}`,
      };
      this.advertiserStore.dispatch(AdvertisersActions.addAdvertiser({ payload: data }));
    } else {
      this.advertiserForm.markAllAsTouched();
    }
  }
}
