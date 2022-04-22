import { Component, Injector } from '@angular/core';
import { slideMobileNav } from '../shared/animations/slide';
import { MenuComponent } from '../shared/menu/menu.component';
import { MenuService } from '../shared/menu/menu.service';
import { TextMenuItemModel } from '../shared/menu/menu-item/models/text.model';
import { LinkMenuItemModel } from '../shared/menu/menu-item/models/link.model';
import { HostWindowService } from '../shared/host-window.service';
import { BrowseService } from '../core/browse/browse.service';
import { getFirstCompletedRemoteData } from '../core/shared/operators';
import { PaginatedList } from '../core/data/paginated-list.model';
import { BrowseDefinition } from '../core/shared/browse-definition.model';
import { RemoteData } from '../core/data/remote-data';
import { ActivatedRoute } from '@angular/router';
import { AuthorizationDataService } from '../core/data/feature-authorization/authorization-data.service';
import { MenuID } from '../shared/menu/menu-id.model';
import { MenuItemType } from '../shared/menu/menu-item-type.model';
import { ExternalLinkMenuItemModel } from '../shared/menu/menu-item/models/external-link.model';

/**
 * Component representing the public navbar
 */
@Component({
  selector: 'ds-navbar',
  styleUrls: ['./navbar.component.scss'],
  templateUrl: './navbar.component.html',
  animations: [slideMobileNav]
})
export class NavbarComponent extends MenuComponent {
  /**
   * The menu ID of the Navbar is PUBLIC
   * @type {MenuID.PUBLIC}
   */
  menuID = MenuID.PUBLIC;

  constructor(protected menuService: MenuService,
    protected injector: Injector,
              public windowService: HostWindowService,
              public browseService: BrowseService,
              public authorizationService: AuthorizationDataService,
              public route: ActivatedRoute
  ) {
    super(menuService, injector, authorizationService, route);
  }

  ngOnInit(): void {
    this.createMenu();
    super.ngOnInit();
  }

  /**
   * Initialize all menu sections and items for this menu
   */
  createMenu() {
    const menuList: any[] = [
      /* Communities & Collections tree */
      {
        id: `browse_global_communities_and_collections`,
        active: false,
        visible: true,
        index: 0,
        model: {
          type: MenuItemType.LINK,
          text: `menu.section.browse_global_communities_and_collections`,
          link: `/community-list`
        } as LinkMenuItemModel
      },
      /* Link to static asset */
      {
        id: 'banner',
        active: false,
        visible: true,
        index: 10,
        model: {
          type: MenuItemType.EXTERNAL,
          text: 'menu.section.banner',
          href: '/assets/dspace/images/banner.jpg'
        } as ExternalLinkMenuItemModel
      },
      /* Links to GitHub */
      {
        id: 'github',
        active: false,
        visible: true,
        index: 11,
        model: {
          type: MenuItemType.TEXT,
          text: 'menu.section.github',
        } as TextMenuItemModel,
      },
      {
        id: 'github_rest',
        parentID: 'github',
        active: false,
        visible: true,
        index: 0,
        model: {
          type: MenuItemType.EXTERNAL,
          text: 'menu.section.github.rest',
          href: 'https://github.com/DSpace/DSpace'
        } as ExternalLinkMenuItemModel,
      },
      {
        id: 'github_angular',
        parentID: 'github',
        active: false,
        visible: true,
        index: 1,
        model: {
          type: MenuItemType.EXTERNAL,
          text: 'menu.section.github.angular',
          href: 'https://github.com/DSpace/dspace-angular'
        } as ExternalLinkMenuItemModel,
      },
    ];
    // Read the different Browse-By types from config and add them to the browse menu
    this.browseService.getBrowseDefinitions()
      .pipe(getFirstCompletedRemoteData<PaginatedList<BrowseDefinition>>())
      .subscribe((browseDefListRD: RemoteData<PaginatedList<BrowseDefinition>>) => {
        if (browseDefListRD.hasSucceeded) {
          browseDefListRD.payload.page.forEach((browseDef: BrowseDefinition) => {
            menuList.push({
              id: `browse_global_by_${browseDef.id}`,
              parentID: 'browse_global',
              active: false,
              visible: true,
              model: {
                type: MenuItemType.LINK,
                text: `menu.section.browse_global_by_${browseDef.id}`,
                link: `/browse/${browseDef.id}`
              } as LinkMenuItemModel
            });
          });
          menuList.push(
            /* Browse */
            {
              id: 'browse_global',
              active: false,
              visible: true,
              index: 1,
              model: {
                type: MenuItemType.TEXT,
                text: 'menu.section.browse_global'
              } as TextMenuItemModel,
            }
          );
        }
        menuList.forEach((menuSection) => this.menuService.addSection(this.menuID, Object.assign(menuSection, {
          shouldPersistOnRouteChange: true
        })));
      });

  }
}
