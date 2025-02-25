import { StateHandler, StateHandlerState } from "./base";
declare function useStateHandler<T, H extends (StateHandler<T> | StateHandlerState<T>)>(handlerClass: new (s?: T) => H, initial_value: T | (() => T)): Readonly<[T, H]>;
declare function useStateHandler<T, H extends (StateHandler<T> | StateHandlerState<T>)>(handlerClass: new (s?: T) => H, initial_value?: T | (() => T)): Readonly<[H extends StateHandlerState<T> ? T : T | undefined, H]>;
export { useStateHandler };
