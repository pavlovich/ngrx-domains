import { State } from 'ngrx-registry';

State.layout = {
  showSidenav: false
};

declare module 'ngrx-registry' {
  export interface LayoutState {
    showSidenav: boolean;
  }

  interface State {
    layout: LayoutState;
  }
}
