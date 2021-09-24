import React from "react";
declare abstract class StateHandler<T> {
    state?: T;
    setState: React.Dispatch<React.SetStateAction<T>>;
    instanceCreated?: () => void;
    constructor(sts: HandlerSetter<T>);
}
declare abstract class StateHandlerState<T> extends StateHandler<T> {
    abstract state: T;
}
declare type HandlerSetter<T> = React.Dispatch<React.SetStateAction<T>>;
declare function useStateHandler<H extends StateHandler<T>, T>(handlerClass: new (s: HandlerSetter<T>) => H, initial_value: T | (() => T)): [H extends StateHandlerState<T> ? T : T | undefined, H];
declare function useStateHandler<H extends StateHandler<T>, T>(handlerClass: new (s: HandlerSetter<T>) => H, initial_value?: T | (() => T)): [H extends StateHandlerState<T> ? T : T | undefined, H];
export { StateHandler, useStateHandler, HandlerSetter };
