import { StateHandler, StateHandlerState } from "./StateHandler";
/**
 * 
 * Hook to manage state with a handler class. The handler class must extend `StateHandler<T>`.  
 * This hook will maintain only one instance of the class per application at a time and will be shared between all components that use the [useStateHandler Hook, Class] pair, saving its state.  
 * Do not modify the handler state directly. Use the handler setState method instead.  
 * Unmounting components will not necessarily affect the instance nor its state.
 *
 * @template T - The type of the state.
 * @template S - The type of the setState.
 * @template H - The type of the handler class, which extends `StateHandler<T>`
 * 
 * @param handlerClass - The class of the handler to be used for managing state.
 * @param initial_value - Optional. The initial value of the state, which can be a value of type `T` or a function that returns a value of type `T`.
 * 
 * @returns A readonly tuple containing the current state and the handler instance.
 */
declare function useStateHandler<T, S, H extends (StateHandler<T, S> | StateHandlerState<T, S>), J extends T>(handlerClass: new (s?: T) => H, initial_value: J | (() => J)): Readonly<[T, H]>;
/**
 * 
 * Hook to manage state with a handler class. The handler class must extend `StateHandler<T>`.  
 * This hook will maintain only one instance of the class per application at a time and will be shared between all components that use the [useStateHandler Hook, Class] pair, saving its state.  
 * Do not modify the handler state directly. Use the handler setState method instead.  
 * Unmounting components will not necessarily affect the instance nor its state.
 *
 * @template T - The type of the state.
 * @template S - The type of the setState.
 * @template H - The type of the handler class, which extends `StateHandler<T>`
 * 
 * @param handlerClass - The class of the handler to be used for managing state.
 * @param initial_value - Optional. The initial value of the state, which can be a value of type `T` or a function that returns a value of type `T`.
 * 
 * @returns A readonly tuple containing the current state and the handler instance.
 */
declare function useStateHandler<T, S, H extends (StateHandler<T, S> | StateHandlerState<T, S>), J extends T>(handlerClass: new (s?: T) => H, initial_value?: J | (() => J)): Readonly<[H extends StateHandlerState<T, S> ? T : T | undefined, H]>;
export { useStateHandler };
