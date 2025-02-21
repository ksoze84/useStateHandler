/* 
MIT License

Copyright (c) [2024] [Felipe Rodriguez Herrera]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
 */


import React, { useEffect } from "react";

const storage = new Map<string, {handler : StateHandler<any>, listeners? : React.Dispatch<React.SetStateAction<any>>[]}>();

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
   * Configuration object for the state handler.
   * 
   * @property {boolean} merge - Indicates whether to merge the state.
   * @property {boolean} destroyOnUnmount - Indicates whether to destroy the state on unmount.
   * @protected
   * @readonly
   */
  protected readonly _handlerConfig : {merge? : boolean, destroyOnUnmount? : boolean} = { merge : false, destroyOnUnmount : false };

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
  public readonly setState = (value: T | Partial<T> | ((prevState: T) => T |Partial<T>)) => {
    const newState = value instanceof Function ? value(this.state as T) : value;
    this.state = (this._handlerConfig.merge ? { ...this.state, ...newState } : newState) as T;
    storage.get(this.constructor.name)?.listeners?.forEach( l => l(this.state) );
  };

  /**
   * Destroys the instance if there are no active listeners.  
   * Use this method to delete the instance **on the unmount callback** of the component using it.  
   * Logs a warn if there are active listeners and the instance is not deleted.
   */
  public destroyInstance = () => {
    if ((storage.get(this.constructor.name)?.listeners?.length ?? 0) === 0) {
      storage.delete(this.constructor.name);
      this.instanceDeleted?.(); 
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

  /**
   * Gets the instance of the handler class.  
   * This is not a hook. It will not trigger re-renders when used in components.
   * 
   * @template T - The type of the state.
   * @template H - The type of the StateHandler class.
   * @param handlerClass - The constructor of the StateHandler class.
   * @returns The instance of the StateHandler class.
   */
function getHandler<T, H extends (StateHandler<T>|StateHandlerState<T>)>( handlerClass : new ( s?:T ) => H ) : H {
  if ( !storage.has( handlerClass.name ) ) storage.set( handlerClass.name, {handler :new handlerClass( )} );
  return storage.get( handlerClass.name )?.handler as H;
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
  const handler                     = getHandler<T, H>( handlerClass );
  const [state, setState]           = React.useState<T>( (initial_value instanceof Function ? initial_value() : initial_value) ?? handler.state as T );    
  
  useEffect( () => mountLogic( setState, handlerClass ), [] );

  return [ state, handler ];
}

function mountLogic<T, H extends (StateHandler<T>|StateHandlerState<T>)>( dispatcher: React.Dispatch<React.SetStateAction<T>>, handlerClass : new ( s?:T ) => H) {
  const handler = getHandler<T, H>( handlerClass );

  if( !storage.get( handler.constructor.name )?.listeners ){
    storage.get( handler.constructor.name )!.listeners = [ dispatcher ] ;
    handler["instanceCreated"]?.();
  }
  else
    storage.get( handler.constructor.name )?.listeners!.push( dispatcher );

  return () => unmountLogic( dispatcher, handler );
}

function unmountLogic<T>( dispatcher: React.Dispatch<React.SetStateAction<T>>, handler: StateHandler<T>) {
  if ( ( storage.get( handler.constructor.name )?.listeners?.length ?? 0 ) > 0 ) {
    storage.get( handler.constructor.name )!.listeners = storage.get( handler.constructor.name )?.listeners?.filter( l => l !== dispatcher) ?? [] ;
      if( handler["_handlerConfig"].destroyOnUnmount )
        handler.destroyInstance();
  }

}

export { StateHandler, useStateHandler, getHandler };