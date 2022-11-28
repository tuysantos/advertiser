import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      imports: [RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should select an header option', () => {
    component.optionSelected = 0;
    component.openRoute('address');
    expect(component.optionSelected).toEqual(2);
  });

  it('should navigate to a router', () => {
    const router: Router = TestBed.inject(Router);
    spyOn(router, 'navigateByUrl');

    component.openRoute('advertiser');
    expect(router.navigateByUrl).toHaveBeenCalledWith('advertiser');
  });
});
