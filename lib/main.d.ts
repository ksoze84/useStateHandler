/**
 * Abstract class representing a state handler. This class should be extended to create a state handler.  
 * The extended Class must be passed to the useStateHandler hook to work with React.  
 * The hook useStateHandler will maintain only one instance of the class per application at a time.  
 * The instance of this Class will be only one in the application, and will be shared between all components that use the [useStateHandler Hook, Class] pair saving its state.  
 * Mounting and unmounting components will not necesarily affect the instance nor its state.  
 * When is created a new instance of the class, the instanceCreated() method is called.
 *
 * @template T - The type of the state.
 */
declare abstract class StateHandler<T> {
    /**
     * Configuration object for the state handler.
     *
     * @property {boolean} merge - Indicates whether to merge the state.
     * @property {boolean} destroyOnUnmount - Indicates whether to destroy the state on unmount.
     * @protected
     * @readonly
     */
    protected readonly _handlerConfig: {
        merge?: boolean;
        destroyOnUnmount?: boolean;
    };
    /**
     * The current state. Do not set this property directly. Use the setState method instead.
     */
    state?: T;
    /**
     * Optional Callback function that is called only once when an instance is created.  
     * This Method is Called by the useStateHandler hook the first time a component in the application using the hook is effectively mounted and when the instance is "newly created".  
     * Prefer this mehtod over the constructor to execute initial code.  
     * This method has NOT the same behavior as mount callback a component in React.  
     * The only way this method is called again by the hook is destroying the instance first with destroyInstance().
     */
    protected instanceCreated?: () => void;
    /**
     * Optional callback function that is invoked when an instance is deleted with destroyInstance().  
     * This method has NOT the same behavior as unmount callback a component in React.
     */
    protected instanceDeleted?: () => void;
    /**
     * Sets the state and notifies all listeners.
     *
     * @param value - The new state or a function that returns the new state based on the previous state.
     */
    readonly setState: (value: T | Partial<T> | ((prevState: T) => T | Partial<T>)) => void;
    /**
     * Destroys the instance if there are no active listeners.  
     * Use this method to delete the instance **on the unmount callback** of the component using it.  
     * Logs a warn if there are active listeners and the instance is not deleted.
     */
    destroyInstance: () => void;
    /**
     * Constructs a new instance of the StateHandler class.  
     * Prefer use the method instanceCreated() instead of the constructor.  
     * Constructor code of the class and its inherited instances constructors are not part of the mounting/unmounting logic of react. Listeners may or may not be ready.
     *
     * @param state - The initial state.
     */
    constructor(state?: T);
}
declare abstract class StateHandlerState<T> extends StateHandler<T> {
    abstract state: T;
}
/**
 * Gets the instance of the handler class.  
 * This is not a hook. It will not trigger re-renders when used in components.
 *
 * @template T - The type of the state.
 * @template H - The type of the StateHandler class.
 * @param handlerClass - The constructor of the StateHandler class.
 * @returns The instance of the StateHandler class.
 */
declare function getHandler<T, H extends (StateHandler<T> | StateHandlerState<T>)>(handlerClass: new (s?: T) => H): H;
declare function useStateHandler<T, H extends (StateHandler<T> | StateHandlerState<T>)>(handlerClass: new (s?: T) => H, initial_value: T | (() => T)): Readonly<[T, H]>;
declare function useStateHandler<T, H extends (StateHandler<T> | StateHandlerState<T>)>(handlerClass: new (s?: T) => H, initial_value?: T | (() => T)): Readonly<[H extends StateHandlerState<T> ? T : T | undefined, H]>;
export { StateHandler, useStateHandler, getHandler };
