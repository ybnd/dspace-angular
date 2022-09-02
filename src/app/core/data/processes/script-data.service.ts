import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { ProcessParameter } from '../../../process-page/processes/process-parameter.model';
import { Process } from '../../../process-page/processes/process.model';
import { Script } from '../../../process-page/scripts/script.model';
import { SCRIPT } from '../../../process-page/scripts/script.resource-type';
import { hasValue } from '../../../shared/empty.util';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { dataService } from '../../cache/builders/build-decorators';
import { RemoteDataBuildService } from '../../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../../cache/object-cache.service';
import { CoreState } from '../../core-state.model';
import { HALEndpointService } from '../../shared/hal-endpoint.service';
import { getFirstCompletedRemoteData } from '../../shared/operators';
import { URLCombiner } from '../../url-combiner/url-combiner';
import { DataService } from '../data.service';
import { DefaultChangeAnalyzer } from '../default-change-analyzer.service';
import { RemoteData } from '../remote-data';
import { MultipartPostRequest } from '../request.models';
import { RequestService } from '../request.service';
import { RestRequest } from '../rest-request.model';

export const METADATA_IMPORT_SCRIPT_NAME = 'metadata-import';
export const METADATA_EXPORT_SCRIPT_NAME = 'metadata-export';

@Injectable()
@dataService(SCRIPT)
export class ScriptDataService extends DataService<Script> {
  protected linkPath = 'scripts';

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: DefaultChangeAnalyzer<Script>
  ) {
    super();
  }

  public invoke(
    scriptName: string,
    parameters: ProcessParameter[],
    files: File[]
  ): Observable<RemoteData<Process>> {
    const requestId = this.requestService.generateRequestId();
    this.getBrowseEndpoint()
      .pipe(
        take(1),
        map((endpoint: string) =>
          new URLCombiner(endpoint, scriptName, 'processes').toString()
        ),
        map((endpoint: string) => {
          const body = this.getInvocationFormData(parameters, files);
          return new MultipartPostRequest(requestId, endpoint, body);
        })
      )
      .subscribe((request: RestRequest) => this.requestService.send(request));

    return this.rdbService.buildFromRequestUUID<Process>(requestId);
  }

  private getInvocationFormData(
    parameters: ProcessParameter[],
    files: File[]
  ): FormData {
    const form: FormData = new FormData();
    form.set('properties', JSON.stringify(parameters));
    files.forEach((file: File) => {
      form.append('file', file);
    });
    return form;
  }

  /**
   * Check whether a script with given name exist; user needs to be allowed to execute script for this to to not throw a 401 Unauthorized
   * @param scriptName    script we want to check exists (and we can execute)
   */
  public scriptWithNameExistsAndCanExecute(
    scriptName: string
  ): Observable<boolean> {
    return this.findById(scriptName).pipe(
      getFirstCompletedRemoteData(),
      map((rd: RemoteData<Script>) => {
        return hasValue(rd.payload);
      })
    );
  }
}
