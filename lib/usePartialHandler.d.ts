import React from "react";
import { StateHandler, StateHandlerState } from "./base";
export declare function checkDepsSetter<T>(dispatcher: React.Dispatch<React.SetStateAction<T>>, deps: Array<keyof T>): (newState: T) => void;
/**
 *
 * Hook to manage state with a handler class, but only hear changes of properties noted on depsArray parameter. The handler class must extend `StateHandler<T>`.  
 * This hook will maintain only one instance of the class per application at a time and will be shared between all components that use the [useStateHandler Hook, Class] pair, saving its state.  
 * Do not modify the handler state directly. Use the handler setState method instead.  
 * Unmounting components will not necessarily affect the instance nor its state.
 *
 * @template T - The type of the state.
 * @template H - The type of the handler class, which extends `StateHandler<T>`
 *
 * @param handlerClass - The class of the handler to be used for managing state.
 * @param depsArray - An array of keys of the state that will trigger a re-render when changed.
 * @param initial_value - Optional. The initial value of the state, which can be a value of type `T` or a function that returns a value of type `T`.
 *
 * @returns A readonly tuple containing the current state and the handler instance.
 */
declare function usePartialHandler<T, H extends (StateHandler<T> | StateHandlerState<T>)>(handlerClass: new (s?: T) => H, depsArray: Array<keyof T>, initial_value: T | (() => T)): Readonly<[T, H]>;
/**
 *
 * Hook to manage state with a handler class, but only hear changes of properties noted on depsArray parameter. The handler class must extend `StateHandler<T>`.  
 * This hook will maintain only one instance of the class per application at a time and will be shared between all components that use the [useStateHandler Hook, Class] pair, saving its state.  
 * Do not modify the handler state directly. Use the handler setState method instead.  
 * Unmounting components will not necessarily affect the instance nor its state.
 *
 * @template T - The type of the state.
 * @template H - The type of the handler class, which extends `StateHandler<T>`
 *
 * @param handlerClass - The class of the handler to be used for managing state.
 * @param depsArray - An array of keys of the state that will trigger a re-render when changed.
 * @param initial_value - Optional. The initial value of the state, which can be a value of type `T` or a function that returns a value of type `T`.
 *
 * @returns A readonly tuple containing the current state and the handler instance.
 */
declare function usePartialHandler<T, H extends (StateHandler<T> | StateHandlerState<T>)>(handlerClass: new (s?: T) => H, depsArray: Array<keyof T>, initial_value?: T | (() => T)): Readonly<[H extends StateHandlerState<T> ? T : T | undefined, H]>;
export { usePartialHandler };
