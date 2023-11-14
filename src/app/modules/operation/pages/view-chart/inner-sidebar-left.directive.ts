import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[appInnerSidebarLeft]',
})
export class InnerSidebarLeftDirective {
  @HostBinding('class') elementClass =
    'absolute top-16 left-0 md:w-[460px] h-[800px]';
}
