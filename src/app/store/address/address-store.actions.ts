import { HttpErrorResponse } from '@angular/common/http';
import { createAction, props } from '@ngrx/store';
import { AddressModel } from '../../shared/models/address.model';
import { PageResultModel } from '../../shared/models/page-result.model';

export class AddressActions {
  public static getAddresses = createAction('[Get addressess Page] Get addresses');

  public static getAddressesSuccess = createAction(
    '[Get addresses API] Get addresses Success',
    props<{ payload: PageResultModel<AddressModel> }>(),
  );

  public static getAddressesFailure = createAction(
    '[Get addresses API] Get addresses Failure',
    props<{ error: HttpErrorResponse }>(),
  );

  public static getAddress = createAction('[Get address Page] Get address', props<{ payload: number }>());

  public static getAddressSuccess = createAction(
    '[Get address API] Get address Success',
    props<{ payload: AddressModel }>(),
  );

  public static getAddressFailure = createAction(
    '[Get address API] Get address Failure',
    props<{ error: HttpErrorResponse }>(),
  );

  // Add address
  public static addAddress = createAction('[Post Page] Post Address', props<{ payload: AddressModel }>());

  public static addAddressSuccess = createAction(
    '[Post Address API] Post Address Success',
    props<{ payload: AddressModel }>(),
  );

  public static addAddressFailure = createAction(
    '[Post Address API] Post Address Failure',
    props<{ error: HttpErrorResponse }>(),
  );

  // Update Address
  public static updateAddress = createAction('[Patch Page] Patch Address', props<{ payload: AddressModel }>());

  public static updateAddressSuccess = createAction(
    '[Patch Address API] Patch Address Success',
    props<{ payload: AddressModel }>(),
  );

  public static updateAddressFailure = createAction(
    '[Patch Address API] Patch Address Failure',
    props<{ error: HttpErrorResponse }>(),
  );

  // delete Address
  public static deleteAddress = createAction('[Delete Page] Delete Address', props<{ payload: number }>());

  public static deleteAddressSuccess = createAction(
    '[Delete Address API] Delete Address Success',
    props<{ payload: number }>(),
  );

  public static deleteAddressFailure = createAction(
    '[Delete Address API] Delete Address Failure',
    props<{ error: HttpErrorResponse }>(),
  );
}
