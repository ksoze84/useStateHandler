import { StateHandler, StateHandlerState } from "./base";
declare function useHandler<T, S, H extends (StateHandler<T, S> | StateHandlerState<T, S>)>(handlerClass: new (s?: T) => H, initial_value: T | (() => T)): Readonly<[T, H]>;
declare function useHandler<T, S, H extends (StateHandler<T, S> | StateHandlerState<T, S>)>(handlerClass: new (s?: T) => H, initial_value?: T | (() => T)): Readonly<[H extends StateHandlerState<T, S> ? T : T | undefined, H]>;
export { useHandler };
