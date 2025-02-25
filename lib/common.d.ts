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
export declare function getHandler<T, H extends (StateHandler<T> | StateHandlerState<T>)>(handlerClass: new (s?: T) => H): H;
export declare function mountLogic<T, H extends (StateHandler<T> | StateHandlerState<T>)>(dispatcher: React.Dispatch<React.SetStateAction<T>>, handlerClass: new (s?: T) => H): () => void;
export declare function unmountLogic<T>(dispatcher: React.Dispatch<React.SetStateAction<T>>, handler: StateHandler<T>): void;
