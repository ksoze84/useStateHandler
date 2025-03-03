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
import { StateHandler, StateHandlerState } from "./StateHandler";
import { initHandler, mountLogic } from "./common";

type SelectorFunction <T, F> = ( s : T ) => F;
type CompareFunction <T> = ( prevSTate : T, nextState : T ) => boolean;

export function checkDepsSetter<T, F>( dispatcher: React.Dispatch<React.SetStateAction<T>>, deps: Array<keyof T> | SelectorFunction<T, F> | CompareFunction<T> ) {
  return ( newState : T ) => {
    if( Array.isArray( deps ) )
      return dispatcher( s => {
        for( const dep of deps ){
          if( s[dep] !== newState[dep] ){
            return newState ;
          }
        }
        return s;
      })
    else if ( deps instanceof Function && deps.length === 1 ){
      return dispatcher( s => {
        const oldSelector = (deps as SelectorFunction<T, F>)( s );  
        const newSelector = (deps as SelectorFunction<T, F>)( newState );
        if( Array.isArray( newSelector ) ){
          for( let i = 0; i < newSelector.length; i++ )
            if( (oldSelector as Array<unknown>)[i] !== newSelector[i] )
              return newState;
        }
        else if( newSelector instanceof Object ){
          for( const key in newSelector )
            if( (oldSelector as Record<any, unknown>)[key] !== (newSelector as Record<any, unknown>)[key] )
              return newState;
        }
        else if( oldSelector !== newSelector )
          return newState;
        
        return s;
      });

    }
    else if ( deps instanceof Function && deps.length === 2 ){
      return dispatcher( s => {
        if( (deps as CompareFunction<T>)( s, newState ) ){
          return newState;
        }
        return s;
      } );
    }
  }
}

function usePartialHandler<T, S, H extends (StateHandler<T, S>|StateHandlerState<T, S>), J extends T>( handlerClass : new ( s?:T ) => H, depsArray : Array<keyof T> | CompareFunction<T>, initial_value : J | (() => J)) : Readonly<[T, H]>
function usePartialHandler<T, S, H extends (StateHandler<T, S>|StateHandlerState<T, S>), J extends T>( handlerClass : new ( s?:T ) => H, depsArray : Array<keyof T> | CompareFunction<T>, initial_value? : J | (() => J)) : Readonly<[ H extends StateHandlerState<T, S> ? T : T | undefined, H]>
function usePartialHandler<T, S, F, H extends (StateHandler<T, S>|StateHandlerState<T, S>), J extends T>( handlerClass : new ( s?:T ) => H, depsArray : SelectorFunction<T, F>, initial_value? : J | (() => J)) : Readonly<[F , H]>

/**
 * 
 * Hook to manage state with a handler class, but only hear changes of properties noted on depsArray parameter. The handler class must extend `StateHandler<T>`.  
 * This hook will maintain only one instance of the class per application at a time and will be shared between all components that use the [useStateHandler Hook, Class] pair, saving its state.  
 * Do not modify the handler state directly. Use the handler setState method instead.  
 * Unmounting components will not necessarily affect the instance nor its state.
 *
 * @template T - The type of the state.
 * @template H - The type of the handler class, which extends `StateHandler<T>`
 * 
 * @param handlerClass - The class of the handler to be used for managing state.
 * @param depsArray - An array of keys of the state that will trigger a re-render when changed.
 * @param initial_value - Optional. The initial value of the state, which can be a value of type `T` or a function that returns a value of type `T`.
 * 
 * @returns A readonly tuple containing the current [derived]state and the handler instance.
 */
function usePartialHandler<T, S, F, H extends (StateHandler<T, S>|StateHandlerState<T, S>), J extends T>( handlerClass : new ( s?:T ) => H, depsArray : Array<keyof T> | SelectorFunction<T, F> | CompareFunction<T>, initial_value: J | (() => J)) : Readonly<[T | F | undefined, H]>  {
  const handler                   = initHandler<T, S, H>( handlerClass, initial_value );
  const [state, setState]         = React.useState<T>( handler.state as T );    
  
  useEffect( () => mountLogic( checkDepsSetter( setState, depsArray ) as React.Dispatch<React.SetStateAction<T>>, handlerClass ), [] );

  return [ depsArray instanceof Function && depsArray.length === 1 ? (depsArray as SelectorFunction<T, F>)( handler.state as T ) : state, handler ];
}


export { usePartialHandler };