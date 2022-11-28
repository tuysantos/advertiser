import { HttpErrorResponse } from '@angular/common/http';
import { createAction, props } from '@ngrx/store';
import { AdvertiserModel } from '../../shared/models/advertiser.model';
import { PageResultModel } from '../../shared/models/page-result.model';

export class AdvertisersActions {
  public static getAdvertisers = createAction('[Get Advertisers Page] Get advertisers');

  public static getAdvertisersSuccess = createAction(
    '[Get Advertisers API] Get advertisers Success',
    props<{ payload: PageResultModel<AdvertiserModel> }>(),
  );

  public static getAdvertisersFailure = createAction(
    '[Get Advertisers API] Get advertisers Failure',
    props<{ error: HttpErrorResponse }>(),
  );

  public static addAdvertiser = createAction('[Post Page] Post advertiser', props<{ payload: AdvertiserModel }>());

  public static addAdvertiserSuccess = createAction(
    '[Post Advertisers API] Post advertiser Success',
    props<{ payload: AdvertiserModel }>(),
  );

  public static addAdvertiserFailure = createAction(
    '[Post Advertisers API] Post advertiser Failure',
    props<{ error: HttpErrorResponse }>(),
  );
}
