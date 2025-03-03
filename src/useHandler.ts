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


import React from "react";
import {  StateHandler, StateHandlerState } from "./StateHandler";

function initSimpleHandler<T, S, H extends (StateHandler<T, S> | StateHandlerState<T, S>)>(handlerClass: new (s?: T) => H, initial_value: T | (() => T), getSetState: () => React.Dispatch<React.SetStateAction<T>>) {
  const handler = new handlerClass(initial_value instanceof Function ? initial_value() : initial_value);

  const ssHolder = (handler as Record<string, any>)._setState;
  (handler as Record<string, any>)._setState = (value: T | Partial<T> | ((prevState: T) => T | Partial<T>)) => {
    ssHolder(value);
    getSetState()(handler.state as T);
  };

  (handler as Record<string, any>).setState = (handler as Record<string, any>)._setState;

  return handler;
}

function useHandler<T, S, H extends (StateHandler<T, S>|StateHandlerState<T, S>), J extends T>( handlerClass : new ( s?:T ) => H, initial_value : J | (() => J)) : Readonly<[T, H]>
function useHandler<T, S, H extends (StateHandler<T, S>|StateHandlerState<T, S>), J extends T>( handlerClass : new ( s?:T ) => H, initial_value? : J | (() => J)) : Readonly<[ H extends StateHandlerState<T, S> ? T : T | undefined, H]>

/**
 * 
 * Hook to manage state with a handler class. The handler class must extend `StateHandler<T>`.  
 * Standalone hook, doesn't persist nor share state with other hooks.
 * Do not modify the handler state directly. Use the handler setState method instead.  
 *
 * @template T - The type of the state.
 * @template H - The type of the handler class, which extends `StateHandler<T>`
 * 
 * @param handlerClass - The class of the handler to be used for managing state.
 * @param initial_value - Optional. The initial value of the state, which can be a value of type `T` or a function that returns a value of type `T`.
 * 
 * @returns A readonly tuple containing the current state and the handler instance.
 */
function useHandler<T, S, H extends (StateHandler<T, S>|StateHandlerState<T, S>), J extends T>( handlerClass : new ( s?:T ) => H, initial_value: J | (() => J)) : Readonly<[T | undefined, H]>  {
  const [handler, ]                   = React.useState<StateHandler<T, S>>( () : H => initSimpleHandler<T, S, H>(handlerClass, initial_value, () => setState ) );
  const [state, setState]             = React.useState<T>( handler.state as T );    
  

  return [ state, handler as H ];
}

export { useHandler };


