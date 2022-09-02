import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { getProfileModuleRoute } from '../../../app-routing-paths';
import { AppState } from '../../../app.reducer';
import { AuthService } from '../../../core/auth/auth.service';
import { isAuthenticationLoading } from '../../../core/auth/selectors';
import { EPerson } from '../../../core/eperson/models/eperson.model';
import { MYDSPACE_ROUTE } from '../../../my-dspace-page/my-dspace-page.component';

/**
 * This component represents the user nav menu.
 */
@Component({
  selector: 'ds-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss'],
})
export class UserMenuComponent implements OnInit {
  /**
   * True if the authentication is loading.
   * @type {Observable<boolean>}
   */
  public loading$: Observable<boolean>;

  /**
   * The authenticated user.
   * @type {Observable<EPerson>}
   */
  public user$: Observable<EPerson>;

  /**
   * The mydspace page route.
   * @type {string}
   */
  public mydspaceRoute = MYDSPACE_ROUTE;

  /**
   * The profile page route
   */
  public profileRoute = getProfileModuleRoute();

  constructor(
    private store: Store<AppState>,
    private authService: AuthService
  ) {}

  /**
   * Initialize all instance variables
   */
  ngOnInit(): void {
    // set loading
    this.loading$ = this.store.pipe(select(isAuthenticationLoading));

    // set user
    this.user$ = this.authService.getAuthenticatedUserFromStore();
  }
}
