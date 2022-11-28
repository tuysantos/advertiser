import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UntilDestroy } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  optionSelected = 0;
  pages = ['home', 'advertiser', 'address'];

  constructor(private router: Router) {}

  ngOnInit() {
    const page = window.location.pathname.replace('/', '');
    this.optionSelected = this.pages.findIndex(item => item === page);
  }

  openRoute(page: string) {
    this.optionSelected = this.pages.findIndex(item => item === page);
    this.router.navigateByUrl(page);
  }
}
