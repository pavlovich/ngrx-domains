import { Observable } from 'rxjs/Observable';
import { ActionReducer } from '@ngrx/store';
export interface Components {
}
export declare const Components: Components;
export interface Guards {
}
export declare const Guards: Guards;
export interface Effects {
}
export declare const Effects: Effects;
export interface Actions {
}
export declare const Actions: Actions;
export interface State {
}
export declare const State: State;
export interface Queries {
}
export declare const Queries: Queries;
export interface Root {
}
export declare const Root: Root;
export declare namespace Model {
}
export interface Query<TTarget> {
    (state: State): TTarget;
}
export interface Type<T> {
    new (...args: any[]): T;
}
export declare function safeQuery(query: any, key: string): Query<any>;
export declare function createDomain(name: string, reducer: ActionReducer<any>): void;
export declare function getReducers(): {
    [key: string]: ActionReducer<any>;
};
export declare const tableCreated$: Observable<string>;
/**
 * Create a factory for creating selectors that relay on a base selector to transform the state.
 * @param base
 * @returns {(selector:(state:TState)=>TType)=>Selector<State, TOutput>}
 */
export declare function combineFactory<TState>(base: Query<TState>): <TType>(selector: (state: TState) => TType) => (state: State) => TType;
/**
 * Create a root query for a domain.
 * By default creates a query that returns an object on the State object referenced by the domain name property.
 * @param domain The domain name
 * @param query Optional, a custom query.
 * @returns {Query<TState>}
 */
export declare function setRootQuery<TState>(domain: string, query?: Query<TState>): Query<TState>;
/**
 * Given a domain, returns a factory for creating queries that except the DOMAIN's state as input.
 * i.e: the query create expects an object that the root will select.
 * If the a root selector for the domain does not exist creats is (see setRootQuery).
 * @param domain
 * @returns {(selector:(state:TState)=>TType)=>(state:State)=>TType}
 */
export declare function combineRootFactory<TState>(domain: string): <TType>(selector: (state: TState) => TType) => (state: State) => TType;
/**
 * Register a model in the model registry.
 *
 * @param cls
 * @param name Optional, if not set "name" property is used.
 */
export declare function register(cls: Type<any>, name?: string): void;
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
export declare function registerNS(ns: any): void;
