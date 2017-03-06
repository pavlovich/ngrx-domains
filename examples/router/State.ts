import { State } from 'ngrx-registry';
import { RouterState } from '@ngrx/router-store';

declare module 'ngrx-registry' {


  interface State {
    router: RouterState;
  }
}



