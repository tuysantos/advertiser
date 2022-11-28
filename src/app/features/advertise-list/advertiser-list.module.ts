import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { TableModule } from '../../shared/components/table';
import { AddressEffects } from '../../store/address/address-store.effects';
import { AddressStoreReducer } from '../../store/address/address-store.reducer';
import { AdvertiserEffects } from '../../store/advertiser/advertiser-store.effects';
import { AdvertiserStoreReducer } from '../../store/advertiser/advertiser-store.reducer';
import { AdvertiserListRoutingModule } from './advertiser-list-routing.module';
import { AdvertiserListComponent } from './advertiser-list.component';
import { MaterialModule } from './material.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    AdvertiserListRoutingModule,
    TableModule,
    ReactiveFormsModule,
    StoreModule.forFeature(AdvertiserStoreReducer.featureSelectorKey, AdvertiserStoreReducer.reducer),
    StoreModule.forFeature(AddressStoreReducer.featureSelectorKey, AddressStoreReducer.reducer),
    EffectsModule.forFeature([AdvertiserEffects, AddressEffects]),
  ],
  exports: [AdvertiserListComponent],
  declarations: [AdvertiserListComponent],
})
export class AdvertiserListModule {}
