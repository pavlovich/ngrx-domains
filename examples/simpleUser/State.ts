import { State, Model } from 'ngrx-registry';

// This is our initial state
State.simpleUser = {
  user: new Model.SimpleUser('John'),
  loggedIn: false
};

// type information
declare module 'ngrx-registry' {
  export interface SimpleUserState {
    user: Model.SimpleUser;
    loggedIn: boolean;
  }

  interface State {
    simpleUser: SimpleUserState
  }
}



