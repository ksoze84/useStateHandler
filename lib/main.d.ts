declare class StateHandler<T> {
    state?: T;
    setState: (t: T) => void;
    constructor(sts: (t: T) => void);
}
declare function useStateHandler<H extends StateHandler<T>, T>(handlerClass: new (s: (t: T) => void) => H, initial_value: T): [T, H];
declare function useStateHandler<H extends StateHandler<T>, T>(handlerClass: new (s: (t: T) => void) => H, initial_value?: T): [T | undefined, H];
export { StateHandler, useStateHandler };
