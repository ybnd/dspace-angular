import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { cold, getTestScheduler } from 'jasmine-marbles';
import { TestScheduler } from 'rxjs/testing';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { createSuccessfulRemoteDataObject } from '../../shared/remote-data.utils';
import { followLink } from '../../shared/utils/follow-link-config.model';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { CoreState } from '../core-state.model';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { Item } from '../shared/item.model';
import { DsoRedirectDataService } from './dso-redirect-data.service';
import { GetRequest, IdentifierType } from './request.models';
import { RequestService } from './request.service';

describe('DsoRedirectDataService', () => {
  let scheduler: TestScheduler;
  let service: DsoRedirectDataService;
  let halService: HALEndpointService;
  let requestService: RequestService;
  let rdbService: RemoteDataBuildService;
  let router;
  let remoteData;
  const dsoUUID = '9b4f22f4-164a-49db-8817-3316b6ee5746';
  const dsoHandle = '1234567789/22';
  const encodedHandle = encodeURIComponent(dsoHandle);
  const pidLink = 'https://rest.api/rest/api/pid/find{?id}';
  const requestHandleURL = `https://rest.api/rest/api/pid/find?id=${encodedHandle}`;
  const requestUUIDURL = `https://rest.api/rest/api/pid/find?id=${dsoUUID}`;
  const requestUUID = '34cfed7c-f597-49ef-9cbe-ea351f0023c2';
  const store = {} as Store<CoreState>;
  const notificationsService = {} as NotificationsService;
  const http = {} as HttpClient;
  const comparator = {} as any;
  const objectCache = {} as ObjectCacheService;

  beforeEach(() => {
    scheduler = getTestScheduler();

    halService = jasmine.createSpyObj('halService', {
      getEndpoint: cold('a', { a: pidLink }),
    });
    requestService = jasmine.createSpyObj('requestService', {
      generateRequestId: requestUUID,
      send: true,
    });
    router = {
      navigate: jasmine.createSpy('navigate'),
    };

    remoteData = createSuccessfulRemoteDataObject(
      Object.assign(new Item(), {
        type: 'item',
        uuid: '123456789',
      })
    );

    rdbService = jasmine.createSpyObj('rdbService', {
      buildSingle: cold('a', {
        a: remoteData,
      }),
    });
    service = new DsoRedirectDataService(
      requestService,
      rdbService,
      store,
      objectCache,
      halService,
      notificationsService,
      http,
      comparator,
      router
    );
  });

  describe('findById', () => {
    it('should call HALEndpointService with the path to the pid endpoint', () => {
      scheduler.schedule(() =>
        service.findByIdAndIDType(dsoHandle, IdentifierType.HANDLE)
      );
      scheduler.flush();

      expect(halService.getEndpoint).toHaveBeenCalledWith('pid');
    });

    it('should call HALEndpointService with the path to the dso endpoint', () => {
      scheduler.schedule(() =>
        service.findByIdAndIDType(dsoUUID, IdentifierType.UUID)
      );
      scheduler.flush();

      expect(halService.getEndpoint).toHaveBeenCalledWith('dso');
    });

    it('should call HALEndpointService with the path to the dso endpoint when identifier type not specified', () => {
      scheduler.schedule(() => service.findByIdAndIDType(dsoUUID));
      scheduler.flush();

      expect(halService.getEndpoint).toHaveBeenCalledWith('dso');
    });

    it('should send the proper FindByIDRequest for uuid', () => {
      scheduler.schedule(() =>
        service.findByIdAndIDType(dsoUUID, IdentifierType.UUID)
      );
      scheduler.flush();

      expect(requestService.send).toHaveBeenCalledWith(
        new GetRequest(requestUUID, requestUUIDURL),
        true
      );
    });

    it('should send the proper FindByIDRequest for handle', () => {
      scheduler.schedule(() =>
        service.findByIdAndIDType(dsoHandle, IdentifierType.HANDLE)
      );
      scheduler.flush();

      expect(requestService.send).toHaveBeenCalledWith(
        new GetRequest(requestUUID, requestHandleURL),
        true
      );
    });

    it('should navigate to item route', () => {
      remoteData.payload.type = 'item';
      const redir = service.findByIdAndIDType(dsoHandle, IdentifierType.HANDLE);
      // The framework would normally subscribe but do it here so we can test navigation.
      redir.subscribe();
      scheduler.schedule(() => redir);
      scheduler.flush();
      expect(router.navigate).toHaveBeenCalledWith([
        '/items/' + remoteData.payload.uuid,
      ]);
    });
    it('should navigate to entities route with the corresponding entity type', () => {
      remoteData.payload.type = 'item';
      remoteData.payload.metadata = {
        'dspace.entity.type': [
          {
            language: 'en_US',
            value: 'Publication',
          },
        ],
      };
      const redir = service.findByIdAndIDType(dsoHandle, IdentifierType.HANDLE);
      // The framework would normally subscribe but do it here so we can test navigation.
      redir.subscribe();
      scheduler.schedule(() => redir);
      scheduler.flush();
      expect(router.navigate).toHaveBeenCalledWith([
        '/entities/publication/' + remoteData.payload.uuid,
      ]);
    });

    it('should navigate to collections route', () => {
      remoteData.payload.type = 'collection';
      const redir = service.findByIdAndIDType(dsoHandle, IdentifierType.HANDLE);
      redir.subscribe();
      scheduler.schedule(() => redir);
      scheduler.flush();
      expect(router.navigate).toHaveBeenCalledWith([
        remoteData.payload.type + 's/' + remoteData.payload.uuid,
      ]);
    });

    it('should navigate to communities route', () => {
      remoteData.payload.type = 'community';
      const redir = service.findByIdAndIDType(dsoHandle, IdentifierType.HANDLE);
      redir.subscribe();
      scheduler.schedule(() => redir);
      scheduler.flush();
      expect(router.navigate).toHaveBeenCalledWith([
        'communities/' + remoteData.payload.uuid,
      ]);
    });
  });

  describe('getIDHref', () => {
    it('should return endpoint', () => {
      const result = (service as any).getIDHref(pidLink, dsoUUID);
      expect(result).toEqual(requestUUIDURL);
    });

    it('should include single linksToFollow as embed', () => {
      const expected = `${requestUUIDURL}&embed=bundles`;
      const result = (service as any).getIDHref(
        pidLink,
        dsoUUID,
        followLink('bundles')
      );
      expect(result).toEqual(expected);
    });

    it('should include multiple linksToFollow as embed', () => {
      const expected = `${requestUUIDURL}&embed=bundles&embed=owningCollection&embed=templateItemOf`;
      const result = (service as any).getIDHref(
        pidLink,
        dsoUUID,
        followLink('bundles'),
        followLink('owningCollection'),
        followLink('templateItemOf')
      );
      expect(result).toEqual(expected);
    });

    it('should not include linksToFollow with shouldEmbed = false', () => {
      const expected = `${requestUUIDURL}&embed=templateItemOf`;
      const result = (service as any).getIDHref(
        pidLink,
        dsoUUID,
        followLink('bundles', { shouldEmbed: false }),
        followLink('owningCollection', { shouldEmbed: false }),
        followLink('templateItemOf')
      );
      expect(result).toEqual(expected);
    });

    it('should include nested linksToFollow 3lvl', () => {
      const expected = `${requestUUIDURL}&embed=owningCollection/itemtemplate/relationships`;
      const result = (service as any).getIDHref(
        pidLink,
        dsoUUID,
        followLink(
          'owningCollection',
          {},
          followLink('itemtemplate', {}, followLink('relationships'))
        )
      );
      expect(result).toEqual(expected);
    });
  });
});
