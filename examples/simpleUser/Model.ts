import { register } from 'ngrx-registry';

namespace UserModels {
  export class SimpleUser {
    constructor(public name: string) {}
  }
}


register(UserModels.SimpleUser);

declare module 'ngrx-registry' {
  export namespace Model {
    export const SimpleUser: typeof UserModels.SimpleUser;
    export type SimpleUser = UserModels.SimpleUser;
  }
}

