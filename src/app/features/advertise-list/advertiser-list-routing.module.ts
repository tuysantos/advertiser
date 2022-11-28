import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdvertiserListComponent } from './advertiser-list.component';

const routes: Routes = [
  {
    path: '',
    component: AdvertiserListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdvertiserListRoutingModule {}
