import { StateHandler, StateHandlerState } from "./StateHandler";
/**
 * 
 * Hook to manage state with a handler class. The handler class must extend `StateHandler<T>`.  
 * Standalone hook, doesn't persist nor share state with other hooks.
 * Do not modify the handler state directly. Use the handler setState method instead.  
 *
 * @template T - The type of the state.
 * @template H - The type of the handler class, which extends `StateHandler<T>`
 * 
 * @param handlerClass - The class of the handler to be used for managing state.
 * @param initial_value - Optional. The initial value of the state, which can be a value of type `T` or a function that returns a value of type `T`.
 * 
 * @returns A readonly tuple containing the current state and the handler instance.
 */
declare function useHandler<T, S, H extends (StateHandler<T, S> | StateHandlerState<T, S>), J extends T>(handlerClass: new (s?: T) => H, initial_value: J | (() => J)): Readonly<[T, H]>;
/**
 * 
 * Hook to manage state with a handler class. The handler class must extend `StateHandler<T>`.  
 * Standalone hook, doesn't persist nor share state with other hooks.
 * Do not modify the handler state directly. Use the handler setState method instead.  
 *
 * @template T - The type of the state.
 * @template H - The type of the handler class, which extends `StateHandler<T>`
 * 
 * @param handlerClass - The class of the handler to be used for managing state.
 * @param initial_value - Optional. The initial value of the state, which can be a value of type `T` or a function that returns a value of type `T`.
 * 
 * @returns A readonly tuple containing the current state and the handler instance.
 */
declare function useHandler<T, S, H extends (StateHandler<T, S> | StateHandlerState<T, S>), J extends T>(handlerClass: new (s?: T) => H, initial_value?: J | (() => J)): Readonly<[H extends StateHandlerState<T, S> ? T : T | undefined, H]>;
export { useHandler };
