import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { AdvertiserEffects } from './advertiser-store.effects';
import { AdvertiserStoreReducer } from './advertiser-store.reducer';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(AdvertiserStoreReducer.featureSelectorKey, AdvertiserStoreReducer.reducer),
    EffectsModule.forFeature([AdvertiserEffects]),
  ],
})
export class AdvertiserStoreModule {}
