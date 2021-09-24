import React from "react";
declare abstract class StateHandler<T> {
    state?: T;
    setState: React.Dispatch<React.SetStateAction<T>>;
    instanceCreated?: () => void;
    constructor(sts: React.Dispatch<React.SetStateAction<T>>);
}
declare function useStateHandler<T>(handlerClass: new (s: React.Dispatch<React.SetStateAction<T>>) => StateHandler<T>, initial_value: T | (() => T)): [T, StateHandler<T>];
declare function useStateHandler<T>(handlerClass: new (s: React.Dispatch<React.SetStateAction<T>>) => StateHandler<T>, initial_value?: T | (() => T)): [T | undefined, StateHandler<T>];
export { StateHandler, useStateHandler };
