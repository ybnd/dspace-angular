import { Component } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MenuService } from '../../../shared/menu/menu.service';
import { CSSVariableService } from '../../../shared/sass-helper/sass-helper.service';
import { CSSVariableServiceStub } from '../../../shared/testing/css-variable-service.stub';
import { MenuServiceStub } from '../../../shared/testing/menu-service.stub';
import { AdminSidebarSectionComponent } from './admin-sidebar-section.component';

describe('AdminSidebarSectionComponent', () => {
  let component: AdminSidebarSectionComponent;
  let fixture: ComponentFixture<AdminSidebarSectionComponent>;
  const menuService = new MenuServiceStub();
  const iconString = 'test';

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        RouterTestingModule,
        TranslateModule.forRoot(),
      ],
      declarations: [AdminSidebarSectionComponent, TestComponent],
      providers: [
        {
          provide: 'sectionDataProvider',
          useValue: { model: { link: 'google.com' }, icon: iconString },
        },
        { provide: MenuService, useValue: menuService },
        { provide: CSSVariableService, useClass: CSSVariableServiceStub },
      ],
    })
      .overrideComponent(AdminSidebarSectionComponent, {
        set: {
          entryComponents: [TestComponent],
        },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminSidebarSectionComponent);
    component = fixture.componentInstance;
    spyOn(component as any, 'getMenuItemComponent').and.returnValue(
      TestComponent
    );
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the right icon', () => {
    const icon = fixture.debugElement
      .query(By.css('.shortcut-icon'))
      .query(By.css('i.fas'));
    expect(icon.nativeElement.getAttribute('class')).toContain(
      'fa-' + iconString
    );
  });
});

// declare a test component
@Component({
  selector: 'ds-test-cmp',
  template: ``,
})
class TestComponent {}
