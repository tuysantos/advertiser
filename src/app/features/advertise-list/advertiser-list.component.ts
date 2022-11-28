import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';
import { combineLatest, filter, take } from 'rxjs';
import { TableData } from '../../shared/components/table';
import { DIALOG_WIDTHS } from '../../shared/constants/dialog.constants';
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
import { AdvertiserComponent } from '../advertiser';

@UntilDestroy()
@Component({
  selector: 'app-advertiser-list',
  templateUrl: './advertiser-list.component.html',
  styleUrls: ['./advertiser-list.component.scss'],
})
export class AdvertiserListComponent implements OnInit {
  apiAdvertiserState$ = this.advertiserStore.pipe(select(AdvertiserSelectors.apiState));
  advertisers$ = this.advertiserStore.pipe(select(AdvertiserSelectors.advertiserResulPage));
  addresses$ = this.addressStore.pipe(select(AddressSelectors.addressResulPage));
  apiAddressState$ = this.addressStore.pipe(select(AddressSelectors.apiState));

  apiState: ApiState | null = ApiState.Init;
  advertiserList: TableData[] = [];
  columns: string[] = ['name', 'organisation', 'telephone', 'address', 'post_code', 'id'];
  isOpen = false;

  constructor(
    private advertiserStore: Store<AdvertiserStoreState>,
    private addressStore: Store<AddressStoreState>,
    private dialog: MatDialog,
  ) {}

  ngOnInit() {
    combineLatest([this.advertisers$, this.addresses$, this.apiAdvertiserState$, this.apiAddressState$])
      .pipe(untilDestroyed(this))
      .subscribe(result => {
        if (result) {
          const avertiserResult = result[0] as unknown as PageResultModel<AdvertiserModel>;
          const addressResult = result[1] as unknown as PageResultModel<AddressModel>;
          const apiAdvertiserState = result[2] as unknown as ApiState;
          const apiAddressState = result[3] as unknown as ApiState;
          this.apiState = this.getApiState(apiAdvertiserState, apiAddressState);
          if (avertiserResult && addressResult) {
            this.buildAdvertisers(avertiserResult, addressResult);
          }
        }
      });

    this.loadData();
  }

  getApiState(apiAdvertiserState: ApiState, apiAddressState: ApiState): ApiState {
    return apiAdvertiserState === ApiState.Error || apiAddressState === ApiState.Error
      ? ApiState.Error
      : apiAdvertiserState === ApiState.Done && apiAddressState === ApiState.Done
      ? ApiState.Done
      : ApiState.Pending;
  }

  loadData() {
    this.advertiserStore.dispatch(AdvertisersActions.getAdvertisers());
    this.addressStore.dispatch(AddressActions.getAddresses());
  }

  buildAdvertisers(advertiserData: PageResultModel<AdvertiserModel>, addressData: PageResultModel<AddressModel>) {
    this.advertiserList = [];
    advertiserData['hydra:member']?.forEach(advertiser => {
      const addressId = this.getAddressById(advertiser.address);
      const index = addressData['hydra:member'].findIndex(address => address.id === addressId);
      this.advertiserList.push({
        id: advertiser.id ? advertiser.id : 0,
        name: advertiser.name,
        organisation: advertiser.orgurl,
        telephone: advertiser.telephone,
        address:
          index > -1 ? `${addressData['hydra:member'][index].address}, ${addressData['hydra:member'][index].city}` : '',
        post_code: index > -1 ? addressData['hydra:member'][index].postcode : '',
      });
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

  addNewAdvertiser() {
    this.isOpen = true;
    const dialogRef = this.dialog.open(AdvertiserComponent, {
      width: DIALOG_WIDTHS.medium,
      disableClose: true,
    });

    dialogRef
      .afterClosed()
      .pipe(
        filter(result => !!result),
        take(1),
      )
      .subscribe(() => {
        this.isOpen = false;
      });
  }
}
