import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { AddressEffects } from '../../store/address/address-store.effects';
import { AddressStoreReducer } from '../../store/address/address-store.reducer';
import { AddressComponent } from './address.component';
import { MaterialModule } from './material.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    StoreModule.forFeature(AddressStoreReducer.featureSelectorKey, AddressStoreReducer.reducer),
    EffectsModule.forFeature([AddressEffects]),
  ],
  exports: [AddressComponent],
  declarations: [AddressComponent],
})
export class AddressModule {}
