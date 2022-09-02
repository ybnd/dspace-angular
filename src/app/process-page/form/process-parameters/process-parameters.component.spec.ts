import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateLoaderMock } from '../../../shared/mocks/translate-loader.mock';
import { ProcessParameter } from '../../processes/process-parameter.model';
import { ScriptParameter } from '../../scripts/script-parameter.model';
import { Script } from '../../scripts/script.model';
import { ParameterSelectComponent } from './parameter-select/parameter-select.component';
import { ProcessParametersComponent } from './process-parameters.component';

describe('ProcessParametersComponent', () => {
  let component: ProcessParametersComponent;
  let fixture: ComponentFixture<ProcessParametersComponent>;
  let parameterValues;
  let script;

  function init() {
    const param1 = new ScriptParameter();
    const param2 = new ScriptParameter();
    script = Object.assign(new Script(), { parameters: [param1, param2] });
    parameterValues = [
      Object.assign(new ProcessParameter(), { name: '-a', value: 'bla' }),
      Object.assign(new ProcessParameter(), { name: '-b', value: '123' }),
      Object.assign(new ProcessParameter(), { name: '-c', value: 'value' }),
    ];
  }

  beforeEach(waitForAsync(() => {
    init();
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock,
          },
        }),
      ],
      declarations: [ProcessParametersComponent, ParameterSelectComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessParametersComponent);
    component = fixture.componentInstance;
    component.script = script;
    component.parameterValues = parameterValues;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a ParameterSelectComponent for each parameter value of the component', () => {
    const selectComponents = fixture.debugElement.queryAll(
      By.directive(ParameterSelectComponent)
    );
    expect(selectComponents.length).toBe(parameterValues.length);
  });
});
