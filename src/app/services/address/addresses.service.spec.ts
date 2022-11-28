import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { environment } from '../../../environments/environment';
import { AddressModel } from '../../shared/models/address.model';
import { PageResultModel } from '../../shared/models/page-result.model';
import { NotificationService } from '../notification/notification.service';
import { AddressesService } from './addresses.service';

describe('AddressesService', () => {
  let service: AddressesService;
  let httpMock: HttpTestingController;
  let notification: NotificationService;
  const url = `${environment.apiBaseUrl}/addresses`;

  const address: AddressModel = {
    id: 6,
    address: "Convertr Media 6-8, St. John's Square",
    city: 'London',
    postcode: 'EC1M 4NH',
  };

  const mockResults: PageResultModel<AddressModel> = {
    'hydra:member': [
      {
        id: 1,
        address: "Convertr Media 6-8, St. John's Square",
        city: 'London',
        postcode: 'EC1M 4NH',
        updatedTs: '2017-04-03T10:01:27+00:00',
      },
      {
        id: 2,
        address: "Convertr Media 6-8, St. John's Square",
        city: 'London',
        postcode: 'EC1M 4NH',
        updatedTs: '2017-04-03T10:01:27+00:00',
      },
    ],
    'hydra:totalItems': 2,
  };

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [AddressesService, NotificationService],
      imports: [HttpClientTestingModule, MatSnackBarModule],
    });
    httpMock = TestBed.inject(HttpTestingController);
    service = TestBed.inject(AddressesService);
    notification = TestBed.inject(NotificationService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // TODO: this test will fail because post method is not implemented
  xit('should add a new Address', () => {
    const subscription = service.addAddress(address);
    const req = httpMock.expectOne(url);

    expect(req.request.method).toEqual('POST');
    req.flush(address);
  });

  it('should return an address By Id', fakeAsync(() => {
    const subscription = service.getAddressById(1).subscribe((result: AddressModel) => {
      expect(result).toEqual(address);
    });

    const req = httpMock.expectOne(`${url}/1`);
    expect(req.request.method).toEqual('GET');
    req.flush(address);
    subscription.unsubscribe();
    tick();
  }));

  it('should return an error while getting address By Id', fakeAsync(() => {
    const responseError = { status: 400, statusText: 'Bad request' };
    const subscription = service.getAddressById(1).subscribe(_ => {});

    const req = httpMock.expectOne(`${url}/1`);
    expect(req.request.method).toEqual('GET');
    req.flush({}, responseError);
    subscription.unsubscribe();
    tick();
  }));

  it('should return a list of addresses', fakeAsync(() => {
    const subscription = service.getAddresses().subscribe((result: PageResultModel<AddressModel>) => {
      expect(result).toEqual(mockResults);
    });

    const req = httpMock.expectOne(url);
    expect(req.request.method).toEqual('GET');
    req.flush(mockResults);
    subscription.unsubscribe();
    tick();
  }));

  it('should return an error while trying to get a list of addresses', fakeAsync(() => {
    const responseError = { status: 400, statusText: 'Bad request' };
    const subscription = service.getAddresses().subscribe(_ => {});

    const req = httpMock.expectOne(url);
    expect(req.request.method).toEqual('GET');
    req.flush({}, responseError);
    subscription.unsubscribe();
    tick();
  }));

  it('should return newly created address', fakeAsync(() => {
    const subscription = service.addAddress(address).subscribe((result: AddressModel) => {
      expect(result).toEqual(address);
    });
    subscription.unsubscribe();
    tick();
  }));

  it('should return updated address', fakeAsync(() => {
    const subscription = service.updateAddress(address).subscribe((result: AddressModel) => {
      expect(result).toEqual(address);
    });
    subscription.unsubscribe();
    tick();
  }));

  it('should return deleted id', fakeAsync(() => {
    const subscription = service.deleteAddress(1).subscribe((result: number) => {
      expect(result).toEqual(1);
    });

    subscription.unsubscribe();
    tick();
  }));
});
