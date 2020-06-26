import { Component, OnInit } from '@angular/core';
import { Script } from '../scripts/script.model';
import { Process } from '../processes/process.model';
import { ProcessParameter } from '../processes/process-parameter.model';
import { ScriptDataService } from '../../core/data/processes/script-data.service';
import { ControlContainer, NgForm } from '@angular/forms';
import { ScriptParameter } from '../scripts/script-parameter.model';
import { RequestEntry } from '../../core/data/request.reducer';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';
import { take } from 'rxjs/operators';
import { RequestService } from '../../core/data/request.service';
import { Router } from '@angular/router';

/**
 * Component to create a new script
 */
@Component({
  selector: 'ds-new-process',
  templateUrl: './new-process.component.html',
  styleUrls: ['./new-process.component.scss'],
})
export class NewProcessComponent implements OnInit {
  /**
   * The currently selected script
   */
  public selectedScript: Script;

  /**
   * The process to create
   */
  public process: Process;

  /**
   * The parameter values to use to start the process
   */
  public parameters: ProcessParameter[] = [];

  /**
   * Optional files that are used as parameter values
   */
  public files: File[] = [];

  /**
   * Contains the missing parameters on submission
   */
  public missingParameters = [];

  constructor(
    private scriptService: ScriptDataService,
    private notificationsService: NotificationsService,
    private translationService: TranslateService,
    private requestService: RequestService,
    private router: Router) {
  }

  ngOnInit(): void {
    this.process = new Process();
  }

  /**
   * Validates the form, sets the parameters to correct values and invokes the script with the correct parameters
   * @param form
   */
  submitForm(form: NgForm) {
    if (!this.validateForm(form) || this.isRequiredMissing()) {
      return;
    }

    const stringParameters: ProcessParameter[] = this.parameters.map((parameter: ProcessParameter) => {
        return {
          name: parameter.name,
          value: this.checkValue(parameter)
        };
      }
    );
    this.scriptService.invoke(this.selectedScript.id, stringParameters, this.files)
      .pipe(take(1))
      .subscribe((requestEntry: RequestEntry) => {
        if (requestEntry.response.isSuccessful) {
          const title = this.translationService.get('process.new.notification.success.title');
          const content = this.translationService.get('process.new.notification.success.content');
          this.notificationsService.success(title, content)
          this.sendBack();
        } else {
          const title = this.translationService.get('process.new.notification.error.title');
          const content = this.translationService.get('process.new.notification.error.content');
          this.notificationsService.error(title, content)
        }
      })
  }

  /**
   * Checks whether the parameter values are files
   * Replaces file parameters by strings and stores the files in a separate list
   * @param processParameter The parameter value to check
   */
  private checkValue(processParameter: ProcessParameter): string {
    if (typeof processParameter.value === 'object') {
      this.files = [...this.files, processParameter.value];
      return processParameter.value.name;
    }
    return processParameter.value;
  }

  /**
   * Validates the form
   * Returns false if the form is invalid
   * Returns true if the form is valid
   * @param form The NgForm object to validate
   */
  private validateForm(form: NgForm) {
    if (form.invalid) {
      Object.keys(form.controls).forEach((key) => {
        form.controls[key].markAsDirty();
      });
      return false;
    }
    return true;
  }

  private isRequiredMissing() {
    const setParams: string[] = this.parameters
      .map((param) => param.name);
    const requiredParams: ScriptParameter[] = this.selectedScript.parameters.filter((param) => param.mandatory)
    for (const rp of requiredParams) {
      if (!setParams.includes(rp.name)) {
        this.missingParameters.push(rp.name);
      }
    }
    return this.missingParameters.length > 0;
  }

  private sendBack() {
    this.requestService.removeByHrefSubstring('/processes');
    /* should subscribe on the previous method to know the action is finished and then navigate,
    will fix this when the removeByHrefSubstring changes are merged */
    this.router.navigateByUrl('/processes');
  }
}

export function controlContainerFactory(controlContainer?: ControlContainer) {
  return controlContainer;
}
