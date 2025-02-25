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

import { StateHandler, StateHandlerState, storage } from "./base";



/**
 * Gets the instance of the handler class.  
 * This is not a hook. It will not trigger re-renders when used in components.
 * 
 * @template T - The type of the state.
 * @template H - The type of the StateHandler class.
 * @param handlerClass - The constructor of the StateHandler class.
 * @returns The instance of the StateHandler class.
 */
export function getHandler<T, H extends (StateHandler<T>|StateHandlerState<T>)>( handlerClass : new ( s?:T ) => H ) : H {
  if ( !storage.has( handlerClass.name ) ) storage.set( handlerClass.name, {handler :new handlerClass( )} );
  return storage.get( handlerClass.name )?.handler as H;
}


export function mountLogic<T, H extends (StateHandler<T>|StateHandlerState<T>)>( dispatcher: React.Dispatch<React.SetStateAction<T>>, handlerClass : new ( s?:T ) => H) {
  const handler = getHandler<T, H>( handlerClass );

  if( !storage.get( handler.constructor.name )?.listeners ){
    storage.get( handler.constructor.name )!.listeners = [ dispatcher ] ;
    handler["instanceCreated"]?.();
  }
  else
    storage.get( handler.constructor.name )?.listeners!.push( dispatcher );

  return () => unmountLogic( dispatcher, handler );
}

export function unmountLogic<T>( dispatcher: React.Dispatch<React.SetStateAction<T>>, handler: StateHandler<T>) {
  if ( ( storage.get( handler.constructor.name )?.listeners?.length ?? 0 ) > 0 ) {
    storage.get( handler.constructor.name )!.listeners = storage.get( handler.constructor.name )?.listeners?.filter( l => l !== dispatcher) ?? [] ;
      if( handler["_handlerConfig"].destroyOnUnmount )
        handler.destroyInstance();
  }
}


