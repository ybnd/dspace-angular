import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { FollowLinkConfig } from '../../shared/utils/follow-link-config.model';
import { dataService } from '../cache/builders/build-decorators';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { CoreState } from '../core-state.model';
import { DefaultChangeAnalyzer } from '../data/default-change-analyzer.service';
import { RemoteData } from '../data/remote-data';
import { RequestService } from '../data/request.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { ConfigService } from './config.service';
import { SubmissionUploadsModel } from './models/config-submission-uploads.model';
import { SUBMISSION_UPLOADS_TYPE } from './models/config-type';
import { ConfigObject } from './models/config.model';

/**
 * Provides methods to retrieve, from REST server, bitstream access conditions configurations applicable during the submission process.
 */
@Injectable()
@dataService(SUBMISSION_UPLOADS_TYPE)
export class SubmissionUploadsConfigService extends ConfigService {
  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: DefaultChangeAnalyzer<SubmissionUploadsModel>
  ) {
    super(
      requestService,
      rdbService,
      null,
      objectCache,
      halService,
      notificationsService,
      http,
      comparator,
      'submissionuploads'
    );
  }

  findByHref(
    href: string,
    useCachedVersionIfAvailable = true,
    reRequestOnStale = true,
    ...linksToFollow
  ): Observable<RemoteData<SubmissionUploadsModel>> {
    return super.findByHref(
      href,
      useCachedVersionIfAvailable,
      reRequestOnStale,
      ...(linksToFollow as FollowLinkConfig<ConfigObject>[])
    ) as Observable<RemoteData<SubmissionUploadsModel>>;
  }
}
