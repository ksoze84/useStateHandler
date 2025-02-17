import React, { useEffect } from "react"

const storage = new Map<string, StateHandler<any>>();
const listeners = new WeakMap<StateHandler<any>, React.Dispatch<React.SetStateAction<any>>[]>();

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
abstract class StateHandler<T> {

  /**
   * The current state. Do not set this property directly. Use the setState method instead.
   */
  public state?: T;

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
  public readonly setState: React.Dispatch<React.SetStateAction<T>> = (value: T | ((prevState: T) => T)) => {
    this.state = value instanceof Function ? value(this.state as T) : value;
    listeners.get(this)?.forEach(l => l(value));
  };

  /**
   * Destroys the instance if there are no active listeners.  
   * Use this method to delete the instance **on the unmount callback** of the component using it.  
   * 
   * Logs a warn if there are active listeners and the instance is not deleted.
   */
  public destroyInstance = () => {
    if ((listeners.get(this)?.length ?? 0) === 0) {
      storage.delete(this.constructor.name);
      this.instanceDeleted?.(); 
    } 
    else {
      console.warn(`There are ${this.constructor.name} listeners active (unmounted components). Instance will not be deleted`);
    }
  };

  /**
   * Constructs a new instance of the StateHandler class.  
   * Prefer use the method instanceCreated() instead of the constructor.  
   * Constructor code of the class and its inherited instances constructors are not part of the mounting/unmounting logic of react. Listeners may or may not be ready.  
   * 
   * @param state - The initial state.
   */
  constructor(state?: T) {
    if (!this.state && state) this.state = state;
  }

}

abstract class StateHandlerState<T> extends StateHandler<T> {
  abstract state    : T;
}

function initHandler<T, H extends (StateHandler<T>|StateHandlerState<T>)>( handlerClass : new ( s?:T ) => H ) : H {
  if ( !storage.has( handlerClass.name ) ) storage.set( handlerClass.name, new handlerClass( ) );
  return storage.get( handlerClass.name ) as H;
}

function useStateHandler<T, H extends (StateHandler<T>|StateHandlerState<T>)>( handlerClass : new ( s?:T ) => H, initial_value : T | (() => T)) : Readonly<[T, H]>
function useStateHandler<T, H extends (StateHandler<T>|StateHandlerState<T>)>( handlerClass : new ( s?:T ) => H, initial_value? : T | (() => T)) : Readonly<[ H extends StateHandlerState<T> ? T : T | undefined, H]>

/**
 * 
 * Hook to manage state with a handler class. The handler class must extend `StateHandler<T>`.  
 * This hook will maintain only one instance of the class per application at a time and will be shared between all components that use the [useStateHandler Hook, Class] pair, saving its state.  
 * Do not modify the handler state directly. Use the handler setState method instead.  
 * Unmounting components will not necessarily affect the instance nor its state.
 *
 * @template T - The type of the state.
 * @template H - The type of the handler class, which extends `StateHandler<T>`
 * 
 * @param handlerClass - The class of the handler to be used for managing state.
 * @param initial_value - Optional. The initial value of the state, which can be a value of type `T` or a function that returns a value of type `T`.
 * 
 * @returns A readonly tuple containing the current state and the handler instance.
 */
function useStateHandler<T, H extends (StateHandler<T>|StateHandlerState<T>)>( handlerClass : new ( s?:T ) => H, initial_value: T | (() => T)) : Readonly<[T | undefined, H]>  {
  const [, setHs]         = React.useState<T>( initial_value );    
  const handler           = initHandler<T, H>( handlerClass );

  useEffect( () => mountLogic( setHs, handlerClass ), [] );

  return [ handler.state, handler ];
}

function mountLogic<T, H extends (StateHandler<T>|StateHandlerState<T>)>( dispatcher: React.Dispatch<React.SetStateAction<T>>, handlerClass : new ( s?:T ) => H) {
  const handler = initHandler<T, H>( handlerClass );

  if( !listeners.has( handler ) ){
    listeners.set( handler, [ dispatcher ] );
    handler["instanceCreated"]?.();
  }
  else
    listeners.get( handler)?.push( dispatcher );

  return () => unmountLogic( dispatcher, handler );
}

function unmountLogic<T>( dispatcher: React.Dispatch<React.SetStateAction<T>>, handler: StateHandler<T>) {
  if ( ( listeners.get( handler )?.length ?? 0 ) > 0 ) 
    listeners.set( handler,  listeners.get( handler )?.filter( l => l !== dispatcher) ?? [] );
}

export { StateHandler, useStateHandler };

