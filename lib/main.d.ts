import React from "react";
declare abstract class StateHandler<T> {
    state?: T;
    setState: React.Dispatch<React.SetStateAction<T>>;
    constructor(sts: React.Dispatch<React.SetStateAction<T>>);
}
declare function useStateHandler<H extends StateHandler<T>, T>(handlerClass: new (s: React.Dispatch<React.SetStateAction<T>>) => H, initial_value: T | (() => T)): [T, H];
declare function useStateHandler<H extends StateHandler<T>, T>(handlerClass: new (s: React.Dispatch<React.SetStateAction<T>>) => H, initial_value?: T | (() => T)): [T | undefined, H];
declare function useHandlerObject<H extends StateHandler<T>, T>(handlerGenerator: (s: React.Dispatch<React.SetStateAction<T>>) => H, initial_value: T | (() => T)): [T, H];
export { StateHandler, useStateHandler, useHandlerObject };
