import React from "react";
declare abstract class StateHandler<T> {
    state?: T;
    setState: React.Dispatch<React.SetStateAction<T>>;
    instanceCreated?: () => void;
    constructor(sts: React.Dispatch<React.SetStateAction<T>>);
}
declare function useStateHandler<H extends StateHandler<T>, T>(handlerClass: new (s: React.Dispatch<React.SetStateAction<T>>) => H, initial_value: T | (() => T)): [T, H];
declare function useStateHandler<H extends StateHandler<T>, T>(handlerClass: new (s: React.Dispatch<React.SetStateAction<T>>) => H, initial_value?: T | (() => T)): [T, H];
export { StateHandler, useStateHandler };
