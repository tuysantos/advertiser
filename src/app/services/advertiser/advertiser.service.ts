import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, EMPTY, Observable, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AdvertiserModel } from '../../shared/models/advertiser.model';
import { PageResultModel } from '../../shared/models/page-result.model';
import { NotificationService } from '../notification/notification.service';

@Injectable({
  providedIn: 'root',
})
export class AdvertiserService {
  private url: string;

  constructor(private http: HttpClient, private notification: NotificationService) {
    this.url = `${environment.apiBaseUrl}/advertisers`;
  }

  getAdvertisers(): Observable<PageResultModel<AdvertiserModel>> {
    return this.http.get<PageResultModel<AdvertiserModel>>(`${this.url}`).pipe(
      tap({
        error: err => {
          this.notification.error(err.error.message);
        },
      }),
      catchError(() => EMPTY),
    );
  }

  addAdvertisers(advertiser: AdvertiserModel): Observable<AdvertiserModel> {
    // TODO: Remove this line of code and uncomment the code
    return of(advertiser);
    /*return this.http.post<AdvertiserModel>(`${environment.apiBaseUrl}`, { ...advertiser }).pipe(
      tap({
        error: err => {
          this.notification.error(err.error.message);
        },
      }),
      catchError(() => EMPTY),
    );*/
  }
}
