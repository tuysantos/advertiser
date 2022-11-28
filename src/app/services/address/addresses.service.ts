import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, EMPTY, map, Observable, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AddressModel } from '../../shared/models/address.model';
import { PageResultModel } from '../../shared/models/page-result.model';
import { NotificationService } from '../notification/notification.service';

@Injectable({
  providedIn: 'root',
})
export class AddressesService {
  private url: string;

  constructor(private http: HttpClient, private notification: NotificationService) {
    this.url = `${environment.apiBaseUrl}/addresses`;
  }

  addAddress(address: AddressModel): Observable<AddressModel> {
    // TODO: Remove this line of code and uncomment the code
    return of(address);
    /*return this.http.post<AddressModel>(`${environment.apiBaseUrl}`, { ...address }).pipe(
      tap({
        error: (err: HttpErrorResponse) => {
          this.notification.error(err.error.message);
        },
      }),
      catchError(() => EMPTY),
    );*/
  }

  getAddressById(id: number): Observable<AddressModel> {
    return this.http.get<AddressModel>(`${this.url}/${id}`).pipe(
      tap({
        error: (err: HttpErrorResponse) => {
          this.notification.error(err.error.message);
        },
      }),
      catchError(() => EMPTY),
    );
  }

  getAddresses(): Observable<PageResultModel<AddressModel>> {
    return this.http.get<PageResultModel<AddressModel>>(`${this.url}`).pipe(
      map((data: PageResultModel<AddressModel>) => this.fixIds(data)),
      tap({
        error: (err: HttpErrorResponse) => {
          this.notification.error(err.error.message);
        },
      }),
      catchError(() => EMPTY),
    );
  }

  updateAddress(address: AddressModel): Observable<AddressModel> {
    // TODO: add update method
    return of(address);
  }

  deleteAddress(id: number): Observable<number> {
    // TODO: Add delete method
    return of(id);
  }

  private fixIds(data: PageResultModel<AddressModel>): PageResultModel<AddressModel> {
    if (data['hydra:totalItems'] > 0) {
      let index = 1;
      data['hydra:member'].forEach(item => {
        item.id = index;
        index++;
      });
    }
    return data;
  }
}
