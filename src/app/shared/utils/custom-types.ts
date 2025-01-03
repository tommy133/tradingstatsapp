export interface NavButton {
  text: string;
  link: string;
}

export enum MutationType {
  ADD,
  EDIT,
}

export type SidebarAnimationState = 'in' | 'out';

export type AccountType = 'Demo' | 'Live' | 'Backtest';
