import { State } from 'ngrx-registry';

State.collection = {
  loaded: false,
  loading: false,
  ids: []
};

declare module 'ngrx-registry' {
  export interface CollectionState {
    loaded: boolean;
    loading: boolean;
    ids: string[];
  }

  interface State {
    collection: CollectionState;
  }
}
