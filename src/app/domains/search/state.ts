import { State } from 'ngrx-registry';

State.search = {
  ids: [],
  loading: false,
  query: ''
};

declare module 'ngrx-registry' {
  export interface SearchState {
    ids: string[];
    loading: boolean;
    query: string;
  }

  interface State {
    search: SearchState;
  }
}
