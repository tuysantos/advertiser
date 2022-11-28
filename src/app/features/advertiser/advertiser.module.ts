import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { AddressEffects } from '../../store/address/address-store.effects';
import { AddressStoreReducer } from '../../store/address/address-store.reducer';
import { AdvertiserEffects } from '../../store/advertiser/advertiser-store.effects';
import { AdvertiserStoreReducer } from '../../store/advertiser/advertiser-store.reducer';
import { AdvertiserRoutingModule } from './advertiser-routing.module';
import { AdvertiserComponent } from './advertiser.component';
import { MaterialModule } from './material.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    AdvertiserRoutingModule,
    StoreModule.forFeature(AdvertiserStoreReducer.featureSelectorKey, AdvertiserStoreReducer.reducer),
    StoreModule.forFeature(AddressStoreReducer.featureSelectorKey, AddressStoreReducer.reducer),
    EffectsModule.forFeature([AdvertiserEffects, AddressEffects]),
  ],
  exports: [AdvertiserComponent],
  declarations: [AdvertiserComponent],
})
export class AdvertiserModule {}
