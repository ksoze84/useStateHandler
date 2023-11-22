import React from "react";
declare abstract class StateHandler<T> {
    state?: T;
    readonly setState: React.Dispatch<React.SetStateAction<T>>;
    protected instanceCreated?: () => void;
    constructor(hs: HandlerSetter<T>);
}
declare abstract class StateHandlerState<T> extends StateHandler<T> {
    abstract state: T;
}
declare type HandlerSetter<T> = [T, React.Dispatch<React.SetStateAction<T>>];
declare function useStateHandler<T, H extends StateHandler<T>>(handlerClass: new (s: HandlerSetter<T>, state?: T) => H, initial_value: T | (() => T)): Readonly<[T, Readonly<H>]>;
declare function useStateHandler<T, H extends StateHandler<T>>(handlerClass: new (s: HandlerSetter<T>, state?: T) => H, initial_value?: T | (() => T)): Readonly<[H extends StateHandlerState<T> ? T : T | undefined, Readonly<H>]>;
export { StateHandler, useStateHandler, HandlerSetter };
