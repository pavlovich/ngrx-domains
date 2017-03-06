import { State, Model } from 'ngrx-registry';

State.books = {
  ids: [],
  entities: {},
  selectedBookId: null,
};

declare module 'ngrx-registry' {
  export interface BooksState {
    ids: string[];
    entities: { [id: string]: Model.Book };
    selectedBookId: string | null;
  }

  interface State {
    books: BooksState;
  }
}
