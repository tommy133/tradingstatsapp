import { animate, state, style, transition } from '@angular/animations';

export const sidebarAnimationFadeInOut = [
  state(
    'in',
    style({
      opacity: 1,
      visibility: 'visible',
    }),
  ),
  state(
    'out',
    style({
      opacity: 0,
      visibility: 'hidden',
    }),
  ),

  transition('in => out', animate('200ms ease-in')),
  transition('out => in', animate('200ms ease-out')),
];
