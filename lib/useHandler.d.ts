import { StateHandler, StateHandlerState } from "./StateHandler";
declare function useHandler<T, S, H extends (StateHandler<T, S> | StateHandlerState<T, S>), J extends T>(handlerClass: new (s?: T) => H, initial_value: J | (() => J)): Readonly<[T, H]>;
declare function useHandler<T, S, H extends (StateHandler<T, S> | StateHandlerState<T, S>), J extends T>(handlerClass: new (s?: T) => H, initial_value?: J | (() => J)): Readonly<[H extends StateHandlerState<T, S> ? T : T | undefined, H]>;
export { useHandler };
