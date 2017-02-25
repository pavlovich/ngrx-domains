"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var reselect_1 = require("reselect");
var ReplaySubject_1 = require("rxjs/ReplaySubject");
var tables = new Map();
var reducers = {};
var tableCreatedSubject$ = new ReplaySubject_1.ReplaySubject(1);
exports.Components = {};
exports.Guards = {};
exports.Effects = {};
exports.Actions = {};
exports.State = {};
exports.Queries = {};
exports.Root = {};
var Model;
(function (Model) {
    var X = 15;
})(Model = exports.Model || (exports.Model = {}));
var utils;
(function (utils) {
    function generateQuery(key) {
        return function (state) { return state[key]; };
    }
    utils.generateQuery = generateQuery;
})(utils || (utils = {}));
function safeQuery(query, key) {
    return typeof query === 'function' ? query : utils.generateQuery(key);
}
exports.safeQuery = safeQuery;
function createDomain(name, reducer) {
    if (tables.has(name)) {
        throw new Error("Domain name \"" + name + "\" already exists.\"");
    }
    tables.set(name, true);
    reducers[name] = reducer;
    if (!exports.Root[name]) {
        setRootQuery(name);
    }
    tableCreatedSubject$.next(name);
}
exports.createDomain = createDomain;
function getReducers() {
    return Object.assign({}, reducers);
}
exports.getReducers = getReducers;
exports.tableCreated$ = tableCreatedSubject$.asObservable();
/**
 * Create a factory for creating selectors that relay on a base selector to transform the state.
 * @param base
 * @returns {(selector:(state:TState)=>TType)=>Selector<State, TOutput>}
 */
function combineFactory(base) {
    return function (selector) { return reselect_1.createSelector(base, selector); };
}
exports.combineFactory = combineFactory;
/**
 * Create a root query for a domain.
 * By default creates a query that returns an object on the State object referenced by the domain name property.
 * @param domain The domain name
 * @param query Optional, a custom query.
 * @returns {Query<TState>}
 */
function setRootQuery(domain, query) {
    if (exports.Root[domain]) {
        throw new Error("A root query for domain \"" + domain + "\" is already defined");
    }
    var rootQuery = safeQuery(query, domain);
    Object.defineProperty(exports.Root, domain, { value: rootQuery });
    return rootQuery;
}
exports.setRootQuery = setRootQuery;
/**
 * Given a domain, returns a factory for creating queries that except the DOMAIN's state as input.
 * i.e: the query create expects an object that the root will select.
 * If the a root selector for the domain does not exist creats is (see setRootQuery).
 * @param domain
 * @returns {(selector:(state:TState)=>TType)=>(state:State)=>TType}
 */
function combineRootFactory(domain) {
    var rootFn = exports.Root[domain] || setRootQuery(domain);
    return combineFactory(rootFn);
}
exports.combineRootFactory = combineRootFactory;
/**
 * Register a model in the model registry.
 *
 * @param cls
 * @param name Optional, if not set "name" property is used.
 */
function register(cls, name) {
    Model[name || cls.name] = cls;
}
exports.register = register;
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
function registerNS(ns) {
    Object.keys(ns).forEach(function (key) { return register(ns[key]); });
}
exports.registerNS = registerNS;
//# sourceMappingURL=index.js.map