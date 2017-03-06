import { State } from 'ngrx-registry';

State.stats = {
  searchCount: 0,
  searchHistory: [],
  query: ''
};

declare module 'ngrx-registry' {
  export interface StatsState {
    searchCount: number;
    searchHistory: string[];
    query: string;
  }

  interface State {
    stats: StatsState;
  }
}
