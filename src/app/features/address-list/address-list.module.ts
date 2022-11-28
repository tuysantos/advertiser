import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { AddressModule } from '../../components/address';
import { AddressEffects } from '../../store/address/address-store.effects';
import { TableModule } from '../../shared/components/table';
import { AddressStoreReducer } from '../../store/address/address-store.reducer';
import { AddressListRoutingModule } from './address-list-routing.module';
import { AddressListComponent } from './address-list.component';
import { MaterialModule } from './material.module';
import { AdvertiserStoreReducer } from '../../store/advertiser/advertiser-store.reducer';
import { AdvertiserEffects } from '../../store/advertiser/advertiser-store.effects';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    AddressListRoutingModule,
    TableModule,
    ReactiveFormsModule,
    AddressModule,
    StoreModule.forFeature(AddressStoreReducer.featureSelectorKey, AddressStoreReducer.reducer),
    StoreModule.forFeature(AdvertiserStoreReducer.featureSelectorKey, AdvertiserStoreReducer.reducer),
    EffectsModule.forFeature([AddressEffects, AdvertiserEffects]),
  ],
  exports: [AddressListComponent],
  declarations: [AddressListComponent],
})
export class AddressListModule {}
