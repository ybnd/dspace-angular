import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[dsIgnoreLinkClick]',
})
/**
 * Ignore click events that target links or buttons
 */
export class IgnoreLinkClickDirective {

  constructor(
    private elRef: ElementRef
  ) {
    this.elRef.nativeElement.addEventListener('mousedown', this.filterClick, { capture: true });
  }

  filterClick(event) {
    if (event.target.matches('a, button')) {
      event.stopImmediatePropagation();
    }
  }
}

