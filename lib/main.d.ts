/// <reference types="react" />
declare class StateHandler<T> {
    state?: T;
    setState: (value: React.SetStateAction<T>) => void;
    constructor(sts: (value: React.SetStateAction<T>) => void);
}
declare function useStateHandler<H extends StateHandler<T>, T>(handlerClass: new (s: (value: React.SetStateAction<T>) => void) => H, initial_value: T): [T, H];
declare function useStateHandler<H extends StateHandler<T>, T>(handlerClass: new (s: (value: React.SetStateAction<T>) => void) => H, initial_value?: T): [T | undefined, H];
export { StateHandler, useStateHandler };
