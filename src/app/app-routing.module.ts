import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
  {
    path: 'main',
    component: HomeComponent,
  },
  {
    path: 'advertiser',
    loadChildren: () => import('./features/advertise-list').then(m => m.AdvertiserListModule),
  },
  {
    path: 'address',
    loadChildren: () => import('./features/address-list').then(m => m.AddressListModule),
  },
  {
    path: 'add-advertiser',
    loadChildren: () => import('./features/advertiser').then(m => m.AdvertiserModule),
  },
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: '**',
    redirectTo: 'main',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
