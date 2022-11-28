import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdvertiserComponent } from './advertiser.component';

const routes: Routes = [
  {
    path: '',
    component: AdvertiserComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdvertiserRoutingModule {}
