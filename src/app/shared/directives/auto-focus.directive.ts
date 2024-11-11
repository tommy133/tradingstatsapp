import { AfterViewInit, Directive, ElementRef } from '@angular/core'

//! YOUR COMPONENT MUST BE FOCUSABLE
/**
 * hack for 'div' elements: `tabindex="0"`
 */
@Directive({
  selector: '[appAutoFocus]',
})
export class AutoFocusDirective implements AfterViewInit {
  constructor(private elementRef: ElementRef) {}

  ngAfterViewInit() {
    this.elementRef.nativeElement.focus()
  }
}
