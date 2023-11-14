import { animate, state, style, transition } from '@angular/animations';

export const sidebarLeftAnimationSlide = [
  state(
    'in',
    style({
      transform: 'translateX(0)',
      zIndex: 20,
    }),
  ),
  state(
    'out',
    style({
      transform: 'translateX(-700px)',
    }),
  ),

  transition('in => out', animate('200ms ease-in')),
  transition('out => in', animate('200ms ease-out')),
];
