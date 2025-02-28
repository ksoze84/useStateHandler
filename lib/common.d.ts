/// <reference types="react" />
import { StateHandler, StateHandlerState } from "./base";
/**
 * Gets the instance of the handler class.
 * This is not a hook. It will not trigger re-renders when used in components.
 *
 * @template T - The type of the state.
 * @template H - The type of the StateHandler class.
 * @param handlerClass - The constructor of the StateHandler class.
 * @returns The instance of the StateHandler class.
 */
export declare function getHandler<T, S, H extends (StateHandler<T, S> | StateHandlerState<T, S>)>(handlerClass: new (s?: T) => H): H;
export declare function mountLogic<T, S, H extends (StateHandler<T, S> | StateHandlerState<T, S>)>(dispatcher: React.Dispatch<React.SetStateAction<T>>, handlerClass: new (s?: T) => H): () => void;
export declare function unmountLogic<T, S>(dispatcher: React.Dispatch<React.SetStateAction<T>>, handler: StateHandler<T, S>): void;
