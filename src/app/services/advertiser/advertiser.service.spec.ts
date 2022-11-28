import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { environment } from '../../../environments/environment';
import { AdvertiserModel } from '../../shared/models/advertiser.model';
import { PageResultModel } from '../../shared/models/page-result.model';
import { NotificationService } from '../notification/notification.service';
import { AdvertiserService } from './advertiser.service';

describe('AdvertiserService', () => {
  let service: AdvertiserService;
  let httpMock: HttpTestingController;
  let notification: NotificationService;
  const url = `${environment.apiBaseUrl}/advertisers`;

  const mockResults: PageResultModel<AdvertiserModel> = {
    'hydra:member': [
      {
        id: 1,
        name: 'Fiat',
        orgurl: 'http://www.fiat.co.uk/',
        firstName: 'John',
        lastName: 'Smith',
        email: 'info@fiat.co.uk',
        telephone: '02012345678',
        updatedTs: '2017-08-07T14:36:49+00:00',
        address: '/addresses/1',
      },
      {
        id: 2,
        name: 'Mercedes-Benz',
        orgurl: 'http://www.mercedes-benz.co.uk/',
        firstName: 'Jim',
        lastName: 'Hendrix',
        email: 'info@mercedes-benz.co.uk',
        telephone: '02012345678',
        updatedTs: '2017-08-08T14:36:49+00:00',
        address: '/addresses/2',
      },
    ],
    'hydra:totalItems': 2,
  };

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [AdvertiserService, NotificationService],
      imports: [HttpClientTestingModule, MatSnackBarModule],
    });
    httpMock = TestBed.inject(HttpTestingController);
    service = TestBed.inject(AdvertiserService);
    notification = TestBed.inject(NotificationService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a list of advertisers', fakeAsync(() => {
    const subscription = service.getAdvertisers().subscribe((result: PageResultModel<AdvertiserModel>) => {
      expect(result).toEqual(mockResults);
    });

    const req = httpMock.expectOne(url);
    expect(req.request.method).toEqual('GET');
    req.flush(mockResults);
    subscription.unsubscribe();
    tick();
  }));

  it('should return an error while trying to get a a list of advertisers', fakeAsync(() => {
    const responseError = { status: 400, statusText: 'Bad request' };
    const subscription = service.getAdvertisers().subscribe(_ => {});

    const req = httpMock.expectOne(url);
    expect(req.request.method).toEqual('GET');
    req.flush({}, responseError);
    subscription.unsubscribe();
    tick();
  }));

  // TODO: this test will fail because post method is not implemented
  xit('should add a new Advertiser', () => {
    const advertiser: AdvertiserModel = {
      name: 'Fiat',
      orgurl: 'http://www.fiat.co.uk/',
      firstName: 'John',
      lastName: 'Smith',
      email: 'info@fiat.co.uk',
      telephone: '02012345678',
      address: '/addresses/1',
    };

    service.addAdvertisers(advertiser);
    const req = httpMock.expectOne(url);

    expect(req.request.method).toEqual('POST');
    req.flush(advertiser);
  });

  it('should return newly created advertiser', fakeAsync(() => {
    const advertiser: AdvertiserModel = {
      name: 'Fiat',
      orgurl: 'http://www.fiat.co.uk/',
      firstName: 'John',
      lastName: 'Smith',
      email: 'info@fiat.co.uk',
      telephone: '02012345678',
      address: '/addresses/1',
    };

    const subscription = service.addAdvertisers(advertiser).subscribe((result: AdvertiserModel) => {
      expect(result).toEqual(advertiser);
    });
    subscription.unsubscribe();
    tick();
  }));
});
