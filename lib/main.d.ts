import React from "react";
declare abstract class StateHandler<T> {
    state?: T;
    readonly setState: React.Dispatch<React.SetStateAction<T>>;
    protected instanceCreated?: () => void;
    private init;
    constructor(sts: HandlerSetter<T>, state?: T);
    private putState;
}
declare abstract class StateHandlerState<T> extends StateHandler<T> {
    abstract state: T;
}
declare type HandlerSetter<T> = React.Dispatch<React.SetStateAction<T>>;
declare function useStateHandler<T, H extends StateHandler<T>>(handlerClass: new (s: HandlerSetter<T>, state?: T) => H, initial_value: T | (() => T)): [T, H];
declare function useStateHandler<T, H extends StateHandler<T>>(handlerClass: new (s: HandlerSetter<T>, state?: T) => H, initial_value?: T | (() => T)): [H extends StateHandlerState<T> ? T : T | undefined, H];
export { StateHandler, useStateHandler, HandlerSetter };
