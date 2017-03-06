import { createSelector } from 'reselect';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';
import { ActionReducer } from '@ngrx/store';
import '@ngrx/core/add/operator/select';
// import { compose } from '@ngrx/core/compose';
export { compose } from '@ngrx/core/compose';

const tables = new Map<string, boolean>();
const reducers: {[key: string]: ActionReducer<any> } = {};
const tableCreatedSubject$ = new ReplaySubject<string>(1);

export interface IGlobalRegistry {
  reducers: Model.global.IReducerRegistry;
  queries: Model.global.IQueryRegistry;
}

export interface IMasterRegistry {
  global: IGlobalRegistry;
  registries: Array<string>;
  modules: Model.IModuleRegistry;
  categories: Model.ICategoryRegistry;
  components: Model.IComponentRegistry;
  classes: Model.IClassRegistry;
  services: Model.IServiceRegistry;
  directives: Model.IDirectiveRegistry;
  providers: Model.IProviderRegistry;
  objects: Model.IObjectRegistry;
  reducers: Model.IReducerRegistry;
  queries: Model.IQueryRegistry;
  actions: Model.IActionRegistry;
  guards: Model.IGuardRegistry;
  effects: Model.IEffectRegistry;
  state: Model.IAppState;
}

export interface IQueryRegistryUtils {
  _createQuery<Y, X extends keyof Y>(myType: { new (): Y }, myAttribute: X): (stream: Observable<Y>) => Observable<Y[X]>;
  _generateSelector(key: string): Query<any>;
 // _generateQuery<X extends keyof QueryRegistry>(x: X): any;
}

class QueryRegistryUtils implements IQueryRegistryUtils {
  _createQuery<Y, X extends keyof Y>(myType: { new (...params: any[]): Y }, myAttribute: X): (stream: Observable<Y>) => Observable<Y[X]> {
    return (stream: Observable<Y>) => stream.select(this._generateSelector(myAttribute));
  };
  _generateSelector(key: string): Query<any> {
    return (state: any) => state[key];
  };
  // _generateQuery(path: string): any {
  //   const properties: Array<string> = path.split('.');
  //   let index = properties.length - 1;
  //   const queries: Array<(stream: Observable<any>) => Observable<any>> = [];
  //   properties.reduce((propString, prop) => {
  //     propString += prop;
  //     queries[index] = Registry.queries[propString];
  //     index--;
  //     return propString;
  //   });

  //   return compose(queries);
  // };
}

export const queryRegistryUtils: IQueryRegistryUtils = new QueryRegistryUtils();

export class QueryRegistry implements Model.IQueryRegistry {
  [index: string]: (stream: Observable<any>) => Observable<any>;
}

export class MasterRegistryImpl implements IMasterRegistry {

    global: IGlobalRegistry = {
      reducers: {},
      queries: {}
    };

    registries: ['classes', 'services', 'directives', 'providers', 'objects', 'reducers', 'queries', 'actions', 'guards', 'effects', 'state'];
    modules: Model.IModuleRegistry = {};
    categories: Model.ICategoryRegistry = {};
    components: Model.IComponentRegistry = {};
    classes: Model.IClassRegistry = {};
    services: Model.IServiceRegistry = {};
    directives: Model.IDirectiveRegistry = {};
    providers: Model.IProviderRegistry = {};
    objects: Model.IObjectRegistry = {};
    reducers: Model.IReducerRegistry = {};
    queries: Model.IQueryRegistry = new QueryRegistry();
    actions: Model.IActionRegistry = {};
    guards: Model.IGuardRegistry = {};
    effects: Model.IEffectRegistry = {};
    state: Model.IAppState = {};
}

export const Registry: IMasterRegistry = new MasterRegistryImpl();

export interface IEntityFactory {};
export class EntityFactory implements IEntityFactory {};

export const Categories: Model.ICategoryRegistry = {} as any;

export const Components: Model.IComponentRegistry = {} as any;

export const Guards: Model.IGuardRegistry = {} as any;

export const Effects: Model.IEffectRegistry = {} as any;

export const Actions: Model.IActionRegistry = {} as any;

export const State: Model.IAppState = {} as any;

export const Queries: Model.IQueryRegistry = {} as any;

export interface Root {}
export const Root: Root = {} as any;

export namespace Model {
  export namespace global {
    export interface IQueryRegistry {};
    export interface IReducerRegistry {};
  }

  export interface IModuleRegistry {};
  export interface ICategoryRegistry {};
  export interface IComponentRegistry {};
  export interface IClassRegistry {};
  export interface IServiceRegistry {};
  export interface IDirectiveRegistry {};
  export interface IProviderRegistry {};
  export interface IObjectRegistry {};
  export interface IReducerRegistry {};
  export interface IQueryRegistry {
   // [index: string]: (stream: Observable<any>) => Observable<any>;
  };
  export interface IActionRegistry {};
  export interface IGuardRegistry {};
  export interface IEffectRegistry {};
  export interface IAppState {};
}

export interface Query<TTarget> {
  (state: Model.IAppState): TTarget;
}

export interface Type<T> {
  new (...args: any[]): T;
}

namespace utils {
  export function generateQuery(key: string): Query<any> {
    return (state: any) => state[key];
  }
}

export function safeQuery(query: any, key: string): Query<any> {
  return typeof query === 'function' ? query : utils.generateQuery(key);
}

export function createDomain(name: string, reducer: ActionReducer<any>): void {
  if (tables.has(name)) {
    throw new Error(`Domain name "${name}" already exists."`);
  }

  tables.set(name, true);
  reducers[name] = reducer;

  if (!Root[name]) {
    setRootQuery(name);
  }

  tableCreatedSubject$.next(name);
}

export function getReducers(): {[key: string]: ActionReducer<any> } {
  return Object.assign({}, reducers) as any;
}

export const tableCreated$: Observable<string> = tableCreatedSubject$.asObservable();

/**
 * Create a factory for creating selectors that relay on a base selector to transform the state.
 * @param base
 * @returns {(selector:(state:TState)=>TType)=>Selector<Model.IAppState, TOutput>}
 */
export function combineFactory<TState>(base: Query<TState>): <TType>(selector: (state: TState) => TType) => (state: Model.IAppState) => TType  {
  return <TType>(selector: (state: TState) => TType) => createSelector(base, selector);
}

/**
 * Create a root query for a domain.
 * By default creates a query that returns an object on the State object referenced by the domain name property.
 * @param domain The domain name
 * @param query Optional, a custom query.
 * @returns {Query<TState>}
 */
export function setRootQuery<TState>(domain: string, query?: Query<TState>): Query<TState> {
  if (Root[domain]) {
    throw new Error(`A root query for domain "${domain}" is already defined`);
  }

  const rootQuery: Query<TState> = safeQuery(query, domain);
  Object.defineProperty(Root, domain, { value: rootQuery });
  return rootQuery;
}

/**
 * Given a domain, returns a factory for creating queries that except the DOMAIN's state as input.
 * i.e: the query create expects an object that the root will select.
 * If the a root selector for the domain does not exist creats is (see setRootQuery).
 * @param domain
 * @returns {(selector:(state:TState)=>TType)=>(state:Model.IAppState)=>TType}
 */
export function combineRootFactory<TState>(domain: string): <TType>(selector: (state: TState) => TType) => (state: Model.IAppState) => TType  {
  const rootFn: Query<TState> = Root[domain] || setRootQuery<TState>(domain);
  return combineFactory(rootFn);
}

/**
 * Register a model in the model registry.
 *
 * @param cls
 * @param name Optional, if not set "name" property is used.
 */
export function register(cls: Type<any>, name?: string): void {
  Model[name || cls.name] = cls;
}

/**
 * Registers a namespace.
 *
 * EXAMPLE:
 *
 * namespace MyModels {
 *   export class MyClass1 { }
 *   export class MyClass2 { }
 *   export class MyClass3 { }
 * }
 * registerNS(MyModels);
 *
 *
 *
 * Will register "MyClass1", "MyClass2" and "MyClass3"
 *
 * @param ns
 */
export function registerNS(ns: any): void {
  Object.keys(ns).forEach( key => register(ns[key]) );
}
