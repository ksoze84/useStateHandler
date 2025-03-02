import React from "react";
import { StateHandler, StateHandlerState } from "./base";
export declare function checkDepsSetter<T, F>(dispatcher: React.Dispatch<React.SetStateAction<T>>, deps: Array<keyof T> | ((s: T) => F)): (newState: T) => void;
declare function usePartialHandler<T, S, H extends (StateHandler<T, S> | StateHandlerState<T, S>)>(handlerClass: new (s?: T) => H, depsArray: Array<keyof T>, initial_value: T | (() => T)): Readonly<[T, H]>;
declare function usePartialHandler<T, S, H extends (StateHandler<T, S> | StateHandlerState<T, S>)>(handlerClass: new (s?: T) => H, depsArray: Array<keyof T>, initial_value?: T | (() => T)): Readonly<[H extends StateHandlerState<T, S> ? T : T | undefined, H]>;
declare function usePartialHandler<T, S, F, H extends (StateHandler<T, S> | StateHandlerState<T, S>)>(handlerClass: new (s?: T) => H, depsArray: ((s: T) => F), initial_value?: T | (() => T)): Readonly<[F, H]>;
export { usePartialHandler };
