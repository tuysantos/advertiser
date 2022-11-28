import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';
import { take } from 'rxjs';
import { AddressComponent } from '../../components/address';
import { NotificationService } from '../../services/notification/notification.service';
import { TableData } from '../../shared/components/table';
import { DIALOG_WIDTHS } from '../../shared/constants/dialog.constants';
import { ApiState } from '../../shared/enum/api-state.num';
import { AddressModel } from '../../shared/models/address.model';
import { AdvertiserModel } from '../../shared/models/advertiser.model';
import { PageResultModel } from '../../shared/models/page-result.model';
import { AddressActions } from '../../store/address/address-store.actions';
import { AddressStoreState } from '../../store/address/address-store.reducer';
import { AddressSelectors } from '../../store/address/address-store.selectors';
import { AdvertiserStoreState } from '../../store/advertiser/advertiser-store.reducer';
import { AdvertiserSelectors } from '../../store/advertiser/advertiser-store.selectors';

@UntilDestroy()
@Component({
  selector: 'app-address-list',
  templateUrl: './address-list.component.html',
  styleUrls: ['./address-list.component.scss'],
})
export class AddressListComponent implements OnInit {
  addresses$ = this.addressStore.pipe(select(AddressSelectors.addressResulPage));
  currentAddresses$ = this.addressStore.pipe(select(AddressSelectors.currentAdress));
  advertisers$ = this.advertiserStore.pipe(select(AdvertiserSelectors.advertiserResulPage));
  apiState$ = this.addressStore.pipe(select(AddressSelectors.apiState));

  apiState: ApiState | null = ApiState.Init;
  addressList: TableData[] = [];
  columns: string[] = ['address', 'city', 'post_code', 'id'];
  isOpen = false;
  addressIdInUse: number[] = [];

  constructor(
    private advertiserStore: Store<AdvertiserStoreState>,
    private addressStore: Store<AddressStoreState>,
    private dialog: MatDialog,
    private notificationService: NotificationService,
  ) {}

  ngOnInit() {
    this.apiState$.pipe(untilDestroyed(this)).subscribe((data: ApiState | null) => {
      if (data) {
        this.apiState = data;
      }
    });

    this.currentAddresses$.pipe(untilDestroyed(this)).subscribe((result: AddressModel | null) => {
      if (result && !this.isOpen) {
        this.openDialog(result);
      }
    });

    this.addresses$.pipe(untilDestroyed(this)).subscribe((result: PageResultModel<AddressModel> | null) => {
      if (result) {
        this.buildResulList(result);
      }
    });

    this.advertisers$.pipe(untilDestroyed(this)).subscribe((result: PageResultModel<AdvertiserModel> | null) => {
      if (result) {
        this.buildAddressIdInUse(result);
      }
    });

    this.addressStore.dispatch(AddressActions.getAddresses());
  }

  buildResulList(data: PageResultModel<AddressModel>) {
    this.addressList = [];
    data['hydra:member'].forEach(address => {
      this.addressList.push({
        id: address.id ? address.id : 0,
        address: address.address,
        city: address.city,
        post_code: address.postcode,
      });
    });
  }

  addNewAddress() {
    this.openDialog(null);
  }

  deleteAddress(id: number) {
    // TODO: create the ability to delete address
    // this.addressStore.dispatch(AddressActions.deleteAddress({payload: id});
    id > 5 ? this.deleteMockAddress(id) : this.notificationService.error('This record cannot be deleted!');
  }

  deleteMockAddress(id: number) {
    if (confirm('Are you sure you want to delete this address?')) {
      !this.addressIdInUse.includes(id)
        ? this.addressStore.dispatch(AddressActions.deleteAddress({ payload: id }))
        : this.notificationService.error('This address cannot be deleted because it is in use.');
    }
  }

  buildAddressIdInUse(advertiserData: PageResultModel<AdvertiserModel> | null) {
    this.addressIdInUse = [];
    advertiserData?.['hydra:member'].forEach(advertiser => {
      const addressId = this.getAddressById(advertiser.address);
      const index = this.addressIdInUse.findIndex(id => id === addressId);
      if (index === -1) {
        this.addressIdInUse.push(addressId);
      }
    });
  }

  getAddressById(address: string): number {
    if (address === '' || address.indexOf('/') === -1) {
      return 0;
    }

    return isNaN(parseInt(address.substring(address.lastIndexOf('/') + 1, address.length)))
      ? 0
      : parseInt(address.substring(address.lastIndexOf('/') + 1, address.length));
  }

  editAddress(id: number) {
    // TODO: create the ability to update address
    // this.addressStore.dispatch(AddressActions.getAddress({payload: id});
    id > 5 ? this.getMockAddress(id) : this.notificationService.error('This record cannot be edited!');
  }

  getMockAddress(addressId: number) {
    const obj = sessionStorage.getItem('addressCached');
    const cachedData: AddressModel[] = obj ? (JSON.parse(obj) as unknown as AddressModel[]) : [];
    if (cachedData.length > 0) {
      const index = cachedData.findIndex(item => item.id === addressId);
      if (index > -1) {
        this.openDialog(cachedData[index]);
      }
    }
  }

  openDialog(address: AddressModel | null) {
    this.isOpen = true;
    const dialogRef = this.dialog.open(AddressComponent, {
      width: DIALOG_WIDTHS.medium,
      disableClose: true,
      data: address,
    });

    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe(() => {
        this.isOpen = false;
      });
  }
}
