import React from "react";
import { StateHandler, StateHandlerState } from "./StateHandler";
type SelectorFunction<T, F> = (s: T) => F;
type CompareFunction<T> = (prevSTate: T, nextState: T) => boolean;
export declare function checkDepsSetter<T, F>(dispatcher: React.Dispatch<React.SetStateAction<T>>, deps: Array<keyof T> | SelectorFunction<T, F> | CompareFunction<T>): (newState: T) => void;
declare function usePartialHandler<T, S, H extends (StateHandler<T, S> | StateHandlerState<T, S>), J extends T>(handlerClass: new (s?: T) => H, depsArray: Array<keyof T> | CompareFunction<T>, initial_value: J | (() => J)): Readonly<[T, H]>;
declare function usePartialHandler<T, S, H extends (StateHandler<T, S> | StateHandlerState<T, S>), J extends T>(handlerClass: new (s?: T) => H, depsArray: Array<keyof T> | CompareFunction<T>, initial_value?: J | (() => J)): Readonly<[H extends StateHandlerState<T, S> ? T : T | undefined, H]>;
declare function usePartialHandler<T, S, F, H extends (StateHandler<T, S> | StateHandlerState<T, S>), J extends T>(handlerClass: new (s?: T) => H, depsArray: SelectorFunction<T, F>, initial_value?: J | (() => J)): Readonly<[F, H]>;
export { usePartialHandler };
