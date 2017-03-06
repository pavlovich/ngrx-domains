import { LayoutState, Query, Queries, Root, combineRootFactory } from 'ngrx-registry';

export interface LayoutQueries {
  getShowSidenav: Query<boolean>;
}

/* SEE domains/boks/queries.ts for a detailed explanation */
const fromRoot = combineRootFactory<LayoutState>('layout');

Queries.layout = {
  getShowSidenav: fromRoot( state => state.showSidenav )
};

declare module 'ngrx-registry' {
  interface Root {
    layout: Query<LayoutState>;
  }

  interface Queries {
    layout: LayoutQueries;
  }
}
