/* 
MIT License

Copyright (c) 2021 Felipe Rodriguez Herrera

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

import { StateHandler, StateHandlerState } from "./StateHandler";

export const storage = new Map<string, {handler : StateHandler<any, any>, listeners? : React.Dispatch<React.SetStateAction<any>>[]}>();

export function initHandler<T, S, H extends (StateHandler<T, S>|StateHandlerState<T, S>)>( handlerClass : new ( s?:T ) => H, initial_value? : T | (() => T) ) : H {
  if ( !storage.has( handlerClass.name ) ) {
    const handler = new handlerClass( initial_value instanceof Function ? initial_value() : initial_value );
    
    storage.set( handlerClass.name, {handler} );

    (handler as Record<string, any>).__handlerDispatcher = (s : T) => storage.get( handlerClass.name )?.listeners?.forEach( l => l( s ) );
    (handler as Record<string, any>).destroyInstance = () => destroyInstance( handler );
    
    return handler;
  }
  else{
    const handler = storage.get( handlerClass.name )?.handler as H;
    if((handler as Record<string, any>).__properInitdHndl === false && initial_value !== undefined){ 
      handler.state = initial_value instanceof Function ? initial_value() : initial_value;
      (handler as Record<string, any>).__properInitdHndl = true;
    }
    return handler
  }
}

function destroyInstance<T, S>( handler : StateHandler<T, S>|StateHandlerState<T, S> ) {
  if ((storage.get(handler.constructor.name)?.listeners?.length ?? 0) === 0) {
    storage.delete(handler.constructor.name);
    handler["instanceDeleted"]?.();
  }
}


export function mountLogic<T, S, H extends (StateHandler<T, S>|StateHandlerState<T, S>)>( dispatcher: React.Dispatch<React.SetStateAction<T>>, handlerClass : new ( s?:T ) => H) {
  const handler = initHandler<T, S, H>( handlerClass );

  if( !storage.get( handler.constructor.name )?.listeners ){
    storage.get( handler.constructor.name )!.listeners = [ dispatcher ] ;
    handler["instanceCreated"]?.();
  }
  else
    storage.get( handler.constructor.name )?.listeners!.push( dispatcher );

  return () => unmountLogic( dispatcher, handler );
}

export function unmountLogic<T, S>( dispatcher: React.Dispatch<React.SetStateAction<T>>, handler: StateHandler<T, S>) {
  if ( ( storage.get( handler.constructor.name )?.listeners?.length ?? 0 ) > 0 ) {
    storage.get( handler.constructor.name )!.listeners = storage.get( handler.constructor.name )?.listeners?.filter( l => l !== dispatcher) ?? [] ;
      if( handler["_handlerConfig"].destroyOnUnmount )
        handler.destroyInstance();
  }
}


/**
 * Gets the instance of the handler class.  
 * This is not a hook. It will not trigger re-renders when used in components.
 * 
 * @template T - The type of the state.
 * @template S - The type of the setState function.
 * @template H - The type of the StateHandler class.
 * @param handlerClass - The constructor of the StateHandler class.
 * @returns The instance of the StateHandler class.
 */
export function getHandler<T, S, H extends (StateHandler<T, S>|StateHandlerState<T, S>)>( handlerClass : new ( s?:T ) => H ) : H {
  if ( storage.has( handlerClass.name ) )
    return storage.get( handlerClass.name )!.handler as H;
  else{
    const handler = initHandler<T, S, H>( handlerClass );
    (handler as Record<string, any>).__properInitdHndl = false;
    return handler;
  }
}
