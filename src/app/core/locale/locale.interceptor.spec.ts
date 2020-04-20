import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { DSpaceRESTv2Service } from '../dspace-rest-v2/dspace-rest-v2.service';
import { RestRequestMethod } from '../data/rest-request-method';
import { LocaleService } from './locale.service';
import { LocaleInterceptor } from './locale.interceptor';

describe(`LocaleInterceptor`, () => {
  let service: DSpaceRESTv2Service;
  let httpMock: HttpTestingController;
  let localeService: any;

  function getMockLocaleService(): LocaleService {
    return jasmine.createSpyObj('LocaleService', {
      getCurrentLanguageCode: jasmine.createSpy('getCurrentLanguageCode')
    })
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        DSpaceRESTv2Service,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: LocaleInterceptor,
          multi: true,
        },
        {provide: LocaleService, useValue: getMockLocaleService()},
      ],
    });

    service = TestBed.get(DSpaceRESTv2Service);
    httpMock = TestBed.get(HttpTestingController);
    localeService = TestBed.get(LocaleService);

    localeService.getCurrentLanguageCode.and.returnValue('en')
  });

  describe('', () => {

    it('should add an Accept-Language header when we’re sending an HTTP POST request', () => {
      service.request(RestRequestMethod.POST, 'server/api/submission/workspaceitems', 'test').subscribe((response) => {
        expect(response).toBeTruthy();
      });

      const httpRequest = httpMock.expectOne(`server/api/submission/workspaceitems`);

      expect(httpRequest.request.headers.has('Accept-Language'));
      const lang = httpRequest.request.headers.get('Accept-Language');
      expect(lang).toBe('en');
    });

    it('should add an Accept-Language header when we’re sending an HTTP GET request', () => {
      service.request(RestRequestMethod.GET, 'server/api/submission/workspaceitems/123').subscribe((response) => {
        expect(response).toBeTruthy();
      });

      const httpRequest = httpMock.expectOne(`server/api/submission/workspaceitems/123`);

      expect(httpRequest.request.headers.has('Accept-Language'));
      const lang = httpRequest.request.headers.get('Accept-Language');
      expect(lang).toBe('en');
    });

  });

});
