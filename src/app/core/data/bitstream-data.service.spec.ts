import { of as observableOf } from 'rxjs';
import { getMockRemoteDataBuildService } from '../../shared/mocks/remote-data-build.service.mock';
import { getMockRequestService } from '../../shared/mocks/request.service.mock';
import { HALEndpointServiceStub } from '../../shared/testing/hal-endpoint-service.stub';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { BitstreamFormatSupportLevel } from '../shared/bitstream-format-support-level';
import { BitstreamFormat } from '../shared/bitstream-format.model';
import { Bitstream } from '../shared/bitstream.model';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { BitstreamDataService } from './bitstream-data.service';
import { BitstreamFormatDataService } from './bitstream-format-data.service';
import { PutRequest } from './request.models';
import { RequestService } from './request.service';

describe('BitstreamDataService', () => {
  let service: BitstreamDataService;
  let objectCache: ObjectCacheService;
  let requestService: RequestService;
  let halService: HALEndpointService;
  let bitstreamFormatService: BitstreamFormatDataService;
  let rdbService: RemoteDataBuildService;
  const bitstreamFormatHref = 'rest-api/bitstreamformats';

  const bitstream = Object.assign(new Bitstream(), {
    uuid: 'fake-bitstream',
    _links: {
      self: { href: 'fake-bitstream-self' },
    },
  });
  const format = Object.assign(new BitstreamFormat(), {
    id: '2',
    shortDescription: 'PNG',
    description: 'Portable Network Graphics',
    supportLevel: BitstreamFormatSupportLevel.Known,
  });
  const url = 'fake-bitstream-url';

  beforeEach(() => {
    objectCache = jasmine.createSpyObj('objectCache', {
      remove: jasmine.createSpy('remove'),
    });
    requestService = getMockRequestService();
    halService = Object.assign(new HALEndpointServiceStub(url));
    bitstreamFormatService = jasmine.createSpyObj('bistreamFormatService', {
      getBrowseEndpoint: observableOf(bitstreamFormatHref),
    });
    rdbService = getMockRemoteDataBuildService();

    service = new BitstreamDataService(
      requestService,
      rdbService,
      null,
      objectCache,
      halService,
      null,
      null,
      null,
      null,
      bitstreamFormatService
    );
  });

  describe("when updating the bitstream's format", () => {
    beforeEach(() => {
      service.updateFormat(bitstream, format);
    });

    it('should send a put request', () => {
      expect(requestService.send).toHaveBeenCalledWith(jasmine.any(PutRequest));
    });
  });
});
