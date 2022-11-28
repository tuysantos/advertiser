import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { AddressEffects } from './address-store.effects';
import { AddressStoreReducer } from './address-store.reducer';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(AddressStoreReducer.featureSelectorKey, AddressStoreReducer.reducer),
    EffectsModule.forFeature([AddressEffects]),
  ],
})
export class AddressStoreModule {}
