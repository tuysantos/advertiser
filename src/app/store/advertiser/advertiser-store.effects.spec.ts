import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, ReplaySubject, throwError } from 'rxjs';
import { AdvertiserService } from '../../services/advertiser/advertiser.service';
import { AdvertiserModel } from '../../shared/models/advertiser.model';
import { PageResultModel } from '../../shared/models/page-result.model';
import { AdvertisersActions } from './advertiser-store.action';
import { AdvertiserEffects } from './advertiser-store.effects';

const mockResults: PageResultModel<AdvertiserModel> = {
  'hydra:member': [
    {
      id: 23,
      name: 'My name',
      orgurl: 'my url 1',
      firstName: 'Rick',
      lastName: 'Jones',
      email: 'my email',
      telephone: '12345',
      address: '/address/1',
    },
    {
      id: 4,
      name: 'My name 2',
      orgurl: 'my url 2',
      firstName: 'Albert',
      lastName: 'Santos',
      email: 'my email 2',
      telephone: '56767657',
      address: '/address/2',
    },
  ],
  'hydra:totalItems': 2,
};

class AdvertiserServiceMock {
  option = 0;

  getAdvertisers(): Observable<PageResultModel<AdvertiserModel>> {
    return this.option === 1
      ? throwError(() => new HttpErrorResponse({ error: 'some error occured' }))
      : of(mockResults);
  }

  addAdvertisers(advertiser: AdvertiserModel): Observable<AdvertiserModel> {
    return advertiser.name === 'Error'
      ? throwError(() => new HttpErrorResponse({ error: 'some error occured' }))
      : of(advertiser);
  }
}

describe('AdvertiserEffects', () => {
  let action, advertiserService;
  let actions: ReplaySubject<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AdvertiserEffects,
        provideMockActions(() => actions),
        {
          provide: AdvertiserService,
          useFactory: () => new AdvertiserServiceMock(),
        },
        HttpClientTestingModule,
      ],
    });
  });

  beforeEach(() => {
    advertiserService = TestBed.inject(AdvertiserService);
    actions = new ReplaySubject(1);
  });

  it('should be created', () => {
    const effects: AdvertiserEffects = TestBed.inject(AdvertiserEffects);
    expect(effects).toBeTruthy();
  });

  it('should dispatch getAdvertisersSuccess', async () => {
    const effects: AdvertiserEffects = TestBed.inject(AdvertiserEffects);
    action = AdvertisersActions.getAdvertisers();
    actions.next(action);
    effects.getAdvertisers$.subscribe(result => {
      expect(result.type).toEqual('[Get Advertisers API] Get advertisers Success');
    });
  });

  it('should dispatch addAdvertiserSuccess', async () => {
    const advertiser: AdvertiserModel = {
      id: 1,
      name: 'May advertiser 1',
      orgurl: 'www.adc.com',
      firstName: 'John',
      lastName: 'Smith',
      email: 'jsmith@test.com',
      telephone: '1234567',
      address: '/address/1',
    };
    const effects: AdvertiserEffects = TestBed.inject(AdvertiserEffects);
    action = AdvertisersActions.addAdvertiser({ payload: advertiser });
    actions.next(action);
    effects.addAdvertiser$.subscribe(result => {
      expect(result.type).toEqual('[Post Advertisers API] Post advertiser Success');
    });
  });

  it('should dispatch addAddressFailure', async () => {
    const advertiser: AdvertiserModel = {
      id: 1,
      name: 'Error',
      orgurl: 'www.adc.com',
      firstName: 'John',
      lastName: 'Smith',
      email: 'jsmith@test.com',
      telephone: '1234567',
      address: '/address/1',
    };
    const effects: AdvertiserEffects = TestBed.inject(AdvertiserEffects);
    action = AdvertisersActions.addAdvertiser({ payload: advertiser });
    actions.next(action);
    effects.addAdvertiser$.subscribe(result => {
      expect(result.type).toEqual('[Post Advertisers API] Post advertiser Failure');
    });
  });
});

describe('AddressEffects getAdvertisersFailure', () => {
  let action, advertiserService;
  let actions: ReplaySubject<any>;

  class AdvertiserServiceMock {
    option = 1;

    getAdvertisers(): Observable<PageResultModel<AdvertiserModel>> {
      return this.option === 1
        ? throwError(() => new HttpErrorResponse({ error: 'some error occured' }))
        : of(mockResults);
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AdvertiserEffects,
        provideMockActions(() => actions),
        {
          provide: AdvertiserService,
          useFactory: () => new AdvertiserServiceMock(),
        },
        HttpClientTestingModule,
      ],
    });
  });

  beforeEach(() => {
    advertiserService = TestBed.inject(AdvertiserService);
    actions = new ReplaySubject(1);
  });

  it('should dispatch getAdvertisersFailure', async () => {
    const effects: AdvertiserEffects = TestBed.inject(AdvertiserEffects);
    action = AdvertisersActions.getAdvertisers();
    actions.next(action);
    effects.getAdvertisers$.subscribe(result => {
      expect(result.type).toEqual('[Get Advertisers API] Get advertisers Failure');
    });
  });
});
